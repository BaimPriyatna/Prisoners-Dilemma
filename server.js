const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const axios = require('axios');

const IPDStrategyAnalyzer = require('./analyzer.js');

const PORT = process.env.PORT || 3000;
const ROUND_TIMEOUT = 30000;
const CHALLENGE_TIMEOUT = 30000;
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_NAME = process.env.SHEET_NAME || 'Sheet1';

// Google Sheets API
const API_KEY = process.env.GOOGLE_API_KEY;
const SHEETS_API = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A:C?key=${API_KEY}`;
const SHEETS_APPEND_API = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A:C:append?valueInputOption=USER_ENTERED&key=${API_KEY}`;

const app = express();

const GITHUB_PAGES_URL = 'https://baimpriyatna.github.io'; // GANTI!

const allowedOrigins = [
  GITHUB_PAGES_URL,
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://localhost:3000',
  'https://' + process.env.REPL_SLUG + '.' + process.env.REPL_OWNER + '.repl.co'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Origin rejected:', origin);
      callback(null, false);
    }
  },
  credentials: true
}));

app.use(express.json());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

const onlineUsers = new Map();
const games = new Map();

// Helper functions for Google Sheets
async function getUsers() {
  try {
    const response = await axios.get(SHEETS_API);
    const rows = response.data.values || [];
    return rows.slice(1).map(row => ({
      name: row[0] || '',
      id: row[1] || '',
      key: row[2] || ''
    }));
  } catch (error) {
    console.error('Error reading from Google Sheets:', error.message);
    return [];
  }
}

async function addUser(name, id, key) {
  try {
    await axios.post(SHEETS_APPEND_API, {
      values: [[name, id, key]]
    });
    return true;
  } catch (error) {
    console.error('Error writing to Google Sheets:', error.message);
    return false;
  }
}

// REST Endpoints
app.post('/api/register', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }

    const users = await getUsers();
    if (users.some(u => u.name === name)) {
      return res.status(400).json({ success: false, message: 'Name already exists' });
    }

    const id = `PD-${uuidv4().slice(0, 8)}`;
    const key = crypto.randomBytes(16).toString('hex');
    
    const added = await addUser(name, id, key);
    
    if (added) {
      res.json({ success: true, user: { name, id, key } });
    } else {
      res.status(500).json({ success: false, message: 'Failed to save user' });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { name, key } = req.body;
    if (!name || !key) {
      return res.status(400).json({ success: false, message: 'Name and key are required' });
    }

    const users = await getUsers();
    const user = users.find(u => u.name === name && u.key === key);
    
    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(401).json({ success: false, message: 'Invalid name or key' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    onlineUsers: onlineUsers.size, 
    games: games.size,
    replit: process.env.REPL_SLUG || 'unknown'
  });
});

app.get('/api/users/count', async (req, res) => {
  try {
    const users = await getUsers();
    res.json({ success: true, count: users.length });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error reading users' });
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('register_user', ({ userId, userName }) => {
    onlineUsers.set(userId, { socketId: socket.id, name: userName });
    socket.userId = userId;
    socket.userName = userName;
    console.log(`User ${userName} (${userId}) registered with socket ${socket.id}`);
    socket.emit('registered', { success: true });
  });

  socket.on('challenge', (data) => {
    const { from, to } = data;
    console.log(`Challenge from ${from} to ${to}`);
    
    const target = onlineUsers.get(to);
    if (!target) {
      socket.emit('challenge_rejected', 'Opponent is not online');
      return;
    }

    socket.challengeData = { from, to, fromName: socket.userName };

    io.to(target.socketId).emit('challenge_request', {
      from,
      fromName: socket.userName
    });

    const timeout = setTimeout(() => {
      if (socket.challengeData) {
        socket.emit('challenge_rejected', 'Challenge timeout');
        io.to(target.socketId).emit('challenge_expired', from);
        socket.challengeData = null;
      }
    }, CHALLENGE_TIMEOUT);
    
    socket.challengeTimeout = timeout;
  });

  socket.on('challenge_response', (data) => {
    const { accept, from } = data;
    console.log(`Challenge response from ${socket.userId} to ${from}: ${accept ? 'accepted' : 'rejected'}`);
    
    const challenger = onlineUsers.get(from);
    if (!challenger) return;

    const challengerSocket = io.sockets.sockets.get(challenger.socketId);
    if (!challengerSocket) return;

    if (accept) {
      if (challengerSocket.challengeTimeout) {
        clearTimeout(challengerSocket.challengeTimeout);
        challengerSocket.challengeTimeout = null;
      }

      const roomId = `game_${uuidv4()}`;
      challengerSocket.join(roomId);
      socket.join(roomId);

      const game = {
        roomId,
        players: [from, socket.userId],
        playerNames: {
          [from]: challengerSocket.userName,
          [socket.userId]: socket.userName
        },
        moves: { [from]: [], [socket.userId]: [] },
        scores: { [from]: 0, [socket.userId]: 0 },
        currentRound: 0,
        roundMoves: {},
        roundTimeout: null
      };
      games.set(roomId, game);

      challengerSocket.emit('challenge_accepted', {
        room: roomId,
        opponentId: socket.userId,
        opponentName: socket.userName
      });
      
      socket.emit('challenge_accepted', {
        room: roomId,
        opponentId: from,
        opponentName: challengerSocket.userName
      });

      console.log(`Game started: ${roomId} between ${from} and ${socket.userId}`);
      startRound(roomId);
    } else {
      if (challengerSocket) {
        challengerSocket.emit('challenge_rejected', 'Challenge rejected by opponent');
        if (challengerSocket.challengeTimeout) {
          clearTimeout(challengerSocket.challengeTimeout);
          challengerSocket.challengeTimeout = null;
        }
        challengerSocket.challengeData = null;
      }
    }
  });

  socket.on('player_move', (data) => {
    const { room, playerId, move } = data;
    console.log(`Player move: ${playerId} in ${room} = ${move}`);
    
    const game = games.get(room);
    if (!game) {
      socket.emit('game_error', 'Room not found');
      return;
    }
    
    if (!game.players.includes(playerId)) {
      socket.emit('game_error', 'You are not in this game');
      return;
    }
    
    if (game.roundMoves[playerId]) {
      socket.emit('game_error', 'You have already made a move this round');
      return;
    }

    game.roundMoves[playerId] = move;

    if (Object.keys(game.roundMoves).length === 2) {
      clearTimeout(game.roundTimeout);
      processRound(room);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
      
      for (let [roomId, game] of games.entries()) {
        if (game.players.includes(socket.userId)) {
          cancelGame(roomId, 'Opponent left the game');
          break;
        }
      }
    }
  });
});

function startRound(roomId) {
  const game = games.get(roomId);
  if (!game) return;

  game.roundMoves = {};
  game.currentRound++;
  
  game.roundTimeout = setTimeout(() => {
    const gameNow = games.get(roomId);
    if (!gameNow) return;
    cancelGame(roomId, 'Round timeout, game cancelled');
  }, ROUND_TIMEOUT);

  io.to(roomId).emit('new_round', { 
    round: game.currentRound,
    timeLeft: ROUND_TIMEOUT / 1000 
  });
  
  console.log(`Round ${game.currentRound} started in ${roomId}`);
}

function processRound(roomId) {
  const game = games.get(roomId);
  if (!game) return;

  const [p1, p2] = game.players;
  const move1 = game.roundMoves[p1];
  const move2 = game.roundMoves[p2];

  const payoffs = {
    'CC': { p1: 3, p2: 3 },
    'CD': { p1: 0, p2: 5 },
    'DC': { p1: 5, p2: 0 },
    'DD': { p1: 1, p2: 1 }
  };
  const key = move1 + move2;
  const payoff = payoffs[key] || { p1: 1, p2: 1 };

  game.scores[p1] += payoff.p1;
  game.scores[p2] += payoff.p2;
  game.moves[p1].push(move1);
  game.moves[p2].push(move2);

  console.log(`Round ${game.currentRound} in ${roomId}: ${move1} vs ${move2} | Score: ${game.scores[p1]}-${game.scores[p2]}`);

  const socket1 = onlineUsers.get(p1)?.socketId;
  const socket2 = onlineUsers.get(p2)?.socketId;

  if (socket1) {
    io.to(socket1).emit('round_result', {
      round: game.currentRound,
      myMove: move1,
      opponentMove: move2,
      myScore: game.scores[p1],
      opponentScore: game.scores[p2]
    });
  }
  
  if (socket2) {
    io.to(socket2).emit('round_result', {
      round: game.currentRound,
      myMove: move2,
      opponentMove: move1,
      myScore: game.scores[p2],
      opponentScore: game.scores[p1]
    });
  }

  if (game.currentRound >= 10) {
    try {
      const analyzer = new IPDStrategyAnalyzer();
      
      const analysisP2 = analyzer.analyze(game.moves[p2], game.moves[p1]);
      const analysisP1 = analyzer.analyze(game.moves[p1], game.moves[p2]);

      console.log(`Analysis P1 needsMore: ${analysisP1.needsMoreRounds}, P2 needsMore: ${analysisP2.needsMoreRounds}`);

      if (!analysisP1.needsMoreRounds && !analysisP2.needsMoreRounds) {
        endGame(roomId, { analysisP1, analysisP2 });
        return;
      }
    } catch (error) {
      console.error('Analysis error:', error);
    }
  }

  startRound(roomId);
}

function endGame(roomId, analyses) {
  const game = games.get(roomId);
  if (!game) return;

  const [p1, p2] = game.players;
  const socket1 = onlineUsers.get(p1)?.socketId;
  const socket2 = onlineUsers.get(p2)?.socketId;

  console.log(`Game ended: ${roomId} after ${game.currentRound} rounds`);

  if (socket1) {
    io.to(socket1).emit('game_complete', {
      myMoves: game.moves[p1],
      opponentMoves: game.moves[p2],
      myScore: game.scores[p1],
      opponentScore: game.scores[p2],
      opponentAnalysis: analyses.analysisP2,
      totalRounds: game.currentRound
    });
  }
  
  if (socket2) {
    io.to(socket2).emit('game_complete', {
      myMoves: game.moves[p2],
      opponentMoves: game.moves[p1],
      myScore: game.scores[p2],
      opponentScore: game.scores[p1],
      opponentAnalysis: analyses.analysisP1,
      totalRounds: game.currentRound
    });
  }

  games.delete(roomId);
  io.socketsLeave(roomId);
}

function cancelGame(roomId, reason) {
  const game = games.get(roomId);
  if (!game) return;

  const [p1, p2] = game.players;
  const socket1 = onlineUsers.get(p1)?.socketId;
  const socket2 = onlineUsers.get(p2)?.socketId;

  console.log(`Game cancelled: ${roomId} - ${reason}`);

  if (socket1) {
    io.to(socket1).emit('game_cancelled', reason);
  }
  
  if (socket2) {
    io.to(socket2).emit('game_cancelled', reason);
  }

  games.delete(roomId);
  io.socketsLeave(roomId);
}

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Replit URL: https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`);
  console.log(`Allowed origins:`, allowedOrigins);
});
