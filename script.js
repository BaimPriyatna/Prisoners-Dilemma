// script.js

const SOCKET_SERVER_URL = 'https://nodejs--baimpriyatna.replit.app';
const ANALYZER = new IPDStrategyAnalyzer();

let socket = null;
let currentUser = null;
let currentMatch = {
  room: null,
  opponentId: null,
  opponentName: null,
  myMoves: [],
  opponentMoves: [],
  myScore: 0,
  opponentScore: 0,
  currentRound: 0,
  roundTimer: null,
  timeLeft: 30,
  gameActive: false
};

document.addEventListener('DOMContentLoaded', () => {
  const storedUser = localStorage.getItem('pd_user');
  if (storedUser) {
    try {
      currentUser = JSON.parse(storedUser);
      initializeSocket();
      showMainPage();
    } catch (e) {
      localStorage.removeItem('pd_user');
      showLoginPage();
    }
  } else {
    showLoginPage();
  }

  attachEventListeners();
});

function showLoginPage() {
  document.getElementById('loginPage').classList.remove('hidden');
  document.getElementById('mainPage').classList.add('hidden');
  document.getElementById('registrationResult').classList.add('hidden');
  document.getElementById('loginError').textContent = '';
}

function showMainPage() {
  document.getElementById('loginPage').classList.add('hidden');
  document.getElementById('mainPage').classList.remove('hidden');
  document.getElementById('matchArea').classList.add('hidden');
  document.getElementById('resultArea').classList.add('hidden');
  document.getElementById('menuPlay').classList.remove('hidden');
  document.getElementById('challengeError').textContent = '';
  document.getElementById('challengeInfo').textContent = '';

  if (currentUser) {
    document.getElementById('displayName').textContent = currentUser.name;
    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('profileId').textContent = currentUser.id;
  }
}

function showMatchArea() {
  document.getElementById('menuPlay').classList.add('hidden');
  document.getElementById('matchArea').classList.remove('hidden');
  document.getElementById('resultArea').classList.add('hidden');
  document.getElementById('gameError').textContent = '';
  resetMatchDisplay();
}

function showResultArea() {
  document.getElementById('matchArea').classList.add('hidden');
  document.getElementById('resultArea').classList.remove('hidden');
  
  if (currentMatch.roundTimer) {
    clearInterval(currentMatch.roundTimer);
    currentMatch.roundTimer = null;
  }
}

function attachEventListeners() {
  document.getElementById('registerBtn').addEventListener('click', handleRegister);
  document.getElementById('loginBtn').addEventListener('click', handleLogin);
  document.getElementById('logoutBtn').addEventListener('click', handleLogout);
  
  document.getElementById('copyNewKey').addEventListener('click', () => {
    copyToClipboard(document.getElementById('newPrivateKey').textContent);
  });

  document.getElementById('copyPrivateKey').addEventListener('click', () => {
    copyToClipboard(currentUser.key);
  });

  document.getElementById('challengeBtn').addEventListener('click', handleChallenge);

  document.getElementById('cooperateBtn').addEventListener('click', () => makeMove('C'));
  document.getElementById('defectBtn').addEventListener('click', () => makeMove('D'));

  document.getElementById('rematchBtn').addEventListener('click', handleRematch);
  document.getElementById('backToMenuBtn').addEventListener('click', () => {
    showMainPage();
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  });
}

// Fungsi Logout
function handleLogout() {
  // Tanyakan konfirmasi
  if (confirm('Are you sure you want to logout?')) {
    // Disconnect socket jika ada
    if (socket) {
      socket.disconnect();
      socket = null;
    }
    
    // Hapus user dari localStorage
    localStorage.removeItem('pd_user');
    
    // Reset current user
    currentUser = null;
    
    // Reset match data
    currentMatch = {
      room: null,
      opponentId: null,
      opponentName: null,
      myMoves: [],
      opponentMoves: [],
      myScore: 0,
      opponentScore: 0,
      currentRound: 0,
      roundTimer: null,
      timeLeft: 30,
      gameActive: false
    };
    
    // Clear form inputs
    document.getElementById('name').value = '';
    document.getElementById('privateKey').value = '';
    
    // Kembali ke halaman login
    showLoginPage();
    
    // Tampilkan pesan sukses
    alert('Logged out successfully!');
  }
}

async function handleRegister() {
  const name = document.getElementById('name').value.trim();
  if (!name) {
    showError('loginError', 'Name cannot be empty');
    return;
  }

  try {
    const response = await fetch(`${SOCKET_SERVER_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    
    const data = await response.json();

    if (data.success) {
      document.getElementById('newPrivateKey').textContent = data.user.key;
      document.getElementById('registrationResult').classList.remove('hidden');
      
      currentUser = data.user;
      localStorage.setItem('pd_user', JSON.stringify(currentUser));
      initializeSocket();
      showMainPage();
    } else {
      showError('loginError', data.message || 'Registration failed');
    }
  } catch (err) {
    showError('loginError', 'Failed to connect to server');
    console.error(err);
  }
}

async function handleLogin() {
  const name = document.getElementById('name').value.trim();
  const key = document.getElementById('privateKey').value.trim();

  if (!name || !key) {
    showError('loginError', 'Name and Private Key are required');
    return;
  }

  try {
    const response = await fetch(`${SOCKET_SERVER_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, key })
    });
    
    const data = await response.json();

    if (data.success) {
      currentUser = data.user;
      localStorage.setItem('pd_user', JSON.stringify(currentUser));
      initializeSocket();
      showMainPage();
    } else {
      showError('loginError', data.message || 'Invalid Name or Private Key');
    }
  } catch (err) {
    showError('loginError', 'Failed to connect to server');
    console.error(err);
  }
}

function initializeSocket() {
  if (socket) {
    socket.disconnect();
  }

  socket = io(SOCKET_SERVER_URL, {
    withCredentials: true,
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
  });

  setupSocketListeners();

  socket.on('connect', () => {
    console.log('Socket connected');
    socket.emit('register_user', {
      userId: currentUser.id,
      userName: currentUser.name
    });
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
    showError('challengeError', 'Failed to connect to server');
  });
}

function setupSocketListeners() {
  socket.on('registered', (data) => {
    console.log('Registered on server:', data);
  });

  socket.on('challenge_request', (data) => {
    const accept = confirm(`${data.fromName} (${data.from}) challenged you. Accept?`);
    socket.emit('challenge_response', {
      accept,
      from: data.from
    });
  });

  socket.on('challenge_accepted', (data) => {
    currentMatch.room = data.room;
    currentMatch.opponentId = data.opponentId;
    currentMatch.opponentName = data.opponentName;
    currentMatch.gameActive = true;
    currentMatch.myMoves = [];
    currentMatch.opponentMoves = [];
    currentMatch.myScore = 0;
    currentMatch.opponentScore = 0;
    currentMatch.currentRound = 0;
    
    document.getElementById('opponentName').textContent = data.opponentName;
    document.getElementById('roomDisplay').textContent = `Room: ${data.room.slice(0, 8)}...`;
    showMatchArea();
  });

  socket.on('challenge_rejected', (message) => {
    showError('challengeError', message);
  });

  socket.on('challenge_expired', (from) => {
    showError('challengeError', 'Challenge expired');
  });

  socket.on('new_round', (data) => {
    currentMatch.currentRound = data.round;
    document.getElementById('roundCounter').textContent = data.round;
    startRoundTimer(data.timeLeft || 30);
    toggleMoveButtons(true);
  });

  socket.on('round_result', (data) => {
    if (currentMatch.roundTimer) {
      clearInterval(currentMatch.roundTimer);
      currentMatch.roundTimer = null;
    }

    currentMatch.myMoves.push(data.myMove);
    currentMatch.opponentMoves.push(data.opponentMove);
    currentMatch.myScore = data.myScore;
    currentMatch.opponentScore = data.opponentScore;

    updateHistory();
    updateScores();
    highlightCell(data.myMove, data.opponentMove);
    updateScoreDiff();
    
    toggleMoveButtons(false);
  });

  socket.on('game_complete', (data) => {
    currentMatch.gameActive = false;
    
    currentMatch.myMoves = data.myMoves;
    currentMatch.opponentMoves = data.opponentMoves;
    currentMatch.myScore = data.myScore;
    currentMatch.opponentScore = data.opponentScore;

    displayGameResult(data);
    showResultArea();
  });

  socket.on('game_cancelled', (reason) => {
    currentMatch.gameActive = false;
    alert(`Game cancelled: ${reason}`);
    showMainPage();
  });

  socket.on('game_error', (message) => {
    showError('gameError', message);
    toggleMoveButtons(true);
  });
}

function handleChallenge() {
  const opponentCode = document.getElementById('opponentCode').value.trim();
  if (!opponentCode) {
    showError('challengeError', 'Enter opponent code');
    return;
  }

  if (!socket || !socket.connected) {
    showError('challengeError', 'Not connected to server');
    return;
  }

  socket.emit('challenge', {
    from: currentUser.id,
    to: opponentCode
  });

  showError('challengeError', 'Waiting for opponent response...', 'info');
}

function makeMove(move) {
  if (!currentMatch.gameActive || !currentMatch.room) {
    showError('gameError', 'Game is not active');
    return;
  }

  toggleMoveButtons(false);

  socket.emit('player_move', {
    room: currentMatch.room,
    playerId: currentUser.id,
    move: move
  });
}

function toggleMoveButtons(enable) {
  document.getElementById('cooperateBtn').disabled = !enable;
  document.getElementById('defectBtn').disabled = !enable;
}

function startRoundTimer(seconds) {
  currentMatch.timeLeft = seconds;
  updateTimerDisplay();

  if (currentMatch.roundTimer) {
    clearInterval(currentMatch.roundTimer);
  }

  currentMatch.roundTimer = setInterval(() => {
    currentMatch.timeLeft--;
    updateTimerDisplay();

    if (currentMatch.timeLeft <= 0) {
      clearInterval(currentMatch.roundTimer);
      currentMatch.roundTimer = null;
      toggleMoveButtons(false);
    }
  }, 1000);
}

function updateTimerDisplay() {
  document.getElementById('timer').textContent = `${currentMatch.timeLeft}s`;
}

function updateHistory() {
  const historyDiv = document.getElementById('historyDisplay');
  
  let myHistoryHtml = '<div class="flex" style="gap:4px; flex-wrap:wrap;">';
  let oppHistoryHtml = '<div class="flex" style="gap:4px; flex-wrap:wrap;">';
  
  currentMatch.myMoves.forEach((move, i) => {
    const payoff = getPayoff(move, currentMatch.opponentMoves[i]);
    myHistoryHtml += `<div class="move-badge ${move}" title="Round ${i+1}: +${payoff.myPayoff} pts">${move}</div>`;
  });
  
  currentMatch.opponentMoves.forEach((move, i) => {
    const payoff = getPayoff(currentMatch.myMoves[i], move);
    oppHistoryHtml += `<div class="move-badge ${move}" title="Round ${i+1}: +${payoff.opponentPayoff} pts">${move}</div>`;
  });
  
  myHistoryHtml += '</div>';
  oppHistoryHtml += '</div>';
  
  historyDiv.innerHTML = `
    <div style="margin-bottom: 16px;">
      <strong>You (${currentMatch.myScore} pts):</strong>
      ${myHistoryHtml}
    </div>
    <div>
      <strong>Opponent (${currentMatch.opponentScore} pts):</strong>
      ${oppHistoryHtml}
    </div>
  `;
}

function updateScores() {
  document.getElementById('selfScore').textContent = currentMatch.myScore;
  document.getElementById('opponentScore').textContent = currentMatch.opponentScore;
}

function updateScoreDiff() {
  const diff = currentMatch.myScore - currentMatch.opponentScore;
  const diffEl = document.getElementById('scoreDiff');
  diffEl.textContent = diff > 0 ? `+${diff}` : diff;
  diffEl.style.color = diff > 0 ? '#10b981' : diff < 0 ? '#ef4444' : '#333';
}

function highlightCell(myMove, oppMove) {
  document.querySelectorAll('.cell').forEach(c => {
    c.classList.remove('active');
  });
  
  const cellId = `cell${myMove}${oppMove}`;
  const cell = document.getElementById(cellId);
  
  if (cell) {
    cell.classList.add('active');
    
    const payoffs = {
      'CC': 'You: 3, Opp: 3',
      'CD': 'You: 0, Opp: 5',
      'DC': 'You: 5, Opp: 0',
      'DD': 'You: 1, Opp: 1'
    };
    cell.title = payoffs[`${myMove}${oppMove}`] || '';
  }
}

function getPayoff(myMove, oppMove) {
  const payoffs = {
    'CC': { myPayoff: 3, opponentPayoff: 3 },
    'CD': { myPayoff: 0, opponentPayoff: 5 },
    'DC': { myPayoff: 5, opponentPayoff: 0 },
    'DD': { myPayoff: 1, opponentPayoff: 1 }
  };
  return payoffs[`${myMove}${oppMove}`] || { myPayoff: 0, opponentPayoff: 0 };
}

function resetMatchDisplay() {
  // Reset UI elements only, preserve gameActive and room
  document.getElementById('historyDisplay').innerHTML = '';
  document.getElementById('roundCounter').textContent = '0';
  document.getElementById('timer').textContent = '30s';
  document.getElementById('selfScore').textContent = '0';
  document.getElementById('opponentScore').textContent = '0';
  document.getElementById('scoreDiff').textContent = '0';
  document.querySelectorAll('.cell').forEach(c => c.classList.remove('active'));
  
  // Reset move arrays but keep gameActive true if room exists
  if (!currentMatch.room) {
    currentMatch.gameActive = false;
  }
}

function displayGameResult(data) {
  const analysis = ANALYZER.analyze(data.opponentMoves, data.myMoves);

  document.getElementById('finalMyScore').textContent = data.myScore;
  document.getElementById('finalOppScore').textContent = data.opponentScore;
  const diff = data.myScore - data.opponentScore;
  document.getElementById('finalDiff').textContent = diff > 0 ? `+${diff}` : diff;
  document.getElementById('resultGameId').textContent = `Rounds: ${data.totalRounds || data.myMoves.length}`;

  displayPersonality(analysis.personality);
  displayPrimaryStrategy(analysis.primaryStrategy);
  displayTopStrategies(analysis.topStrategies);
  displayFullHistoryWithPoints(data);
  displayPointStatistics(data, analysis);
  displayAdditionalInfo(analysis, data);
}

function displayPersonality(personality) {
  const container = document.getElementById('personalityList');
  container.innerHTML = personality.map(p => `
    <div style="margin-bottom: 12px; display: flex; align-items: center; gap: 12px; padding: 12px; background: #f5f5f5; border-radius: 8px;">
      <div style="width: 24px; height: 24px; border-radius: 6px; background: ${p.color};"></div>
      <div style="flex: 1;">
        <div style="font-weight: 600;">${p.category}</div>
        <div style="font-size: 14px; color: #666;">${p.description}</div>
      </div>
      <div style="font-weight: 700; font-size: 18px; color: ${p.color};">${p.percentage}%</div>
    </div>
  `).join('');
}

function displayPrimaryStrategy(strategy) {
  const container = document.getElementById('primaryStrategy');
  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; background: linear-gradient(135deg, #764ba2 0%, #667eea 100%); color: white; border-radius: 12px;">
      <div>
        <div style="font-size: 20px; font-weight: 700; margin-bottom: 4px;">${strategy.name}</div>
        <div style="font-size: 14px; opacity: 0.9;">
          <i class="fas fa-tag"></i> ${strategy.code} | 
          <i class="fas fa-folder"></i> ${strategy.category}
        </div>
      </div>
      <div style="font-size: 32px; font-weight: 700;">${(strategy.probability * 100).toFixed(1)}%</div>
    </div>
  `;
}

function displayTopStrategies(strategies) {
  const tbody = document.querySelector('#topStrategiesTable tbody');
  tbody.innerHTML = strategies.map((s, index) => `
    <tr>
      <td>
        <div style="font-weight: ${index === 0 ? '700' : '400'}">${s.name}</div>
        <div style="font-size: 12px; color: #666;">${s.code} | ${s.category}</div>
      </td>
      <td style="font-weight: ${index === 0 ? '700' : '400'}; text-align: right;">
        <span style="background: ${index === 0 ? '#764ba2' : 'transparent'}; color: ${index === 0 ? 'white' : 'inherit'}; padding: ${index === 0 ? '4px 12px' : '0'}; border-radius: 20px;">
          ${(s.probability * 100).toFixed(1)}%
        </span>
      </td>
    </tr>
  `).join('');
}

function displayFullHistoryWithPoints(data) {
  const selfHistory = document.getElementById('historySelf');
  const oppHistory = document.getElementById('historyOpp');
  const totalRounds = document.getElementById('totalRounds');

  let selfHtml = '<table style="width:100%; border-collapse:collapse;">';
  selfHtml += '<tr><th>Round</th><th>Move</th><th>Points</th><th>Total</th></tr>';
  
  let cumulativeScore = 0;
  data.myMoves.forEach((move, i) => {
    const oppMove = data.opponentMoves[i];
    const payoff = getPayoff(move, oppMove);
    cumulativeScore += payoff.myPayoff;
    
    selfHtml += `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${i+1}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align:center;">
          <span style="display:inline-block; width:30px; height:30px; line-height:30px; background:${move === 'C' ? '#10b981' : '#ef4444'}; color:white; border-radius:6px;">
            ${move}
          </span>
        </td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align:center;">${payoff.myPayoff}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align:right; font-weight:bold;">${cumulativeScore}</td>
      </tr>
    `;
  });
  selfHtml += '</table>';
  
  let oppHtml = '<table style="width:100%; border-collapse:collapse;">';
  oppHtml += '<tr><th>Round</th><th>Move</th><th>Points</th><th>Total</th></tr>';
  
  cumulativeScore = 0;
  data.opponentMoves.forEach((move, i) => {
    const myMove = data.myMoves[i];
    const payoff = getPayoff(myMove, move);
    cumulativeScore += payoff.opponentPayoff;
    
    oppHtml += `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${i+1}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align:center;">
          <span style="display:inline-block; width:30px; height:30px; line-height:30px; background:${move === 'C' ? '#10b981' : '#ef4444'}; color:white; border-radius:6px;">
            ${move}
          </span>
        </td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align:center;">${payoff.opponentPayoff}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align:right; font-weight:bold;">${cumulativeScore}</td>
      </tr>
    `;
  });
  oppHtml += '</table>';

  selfHistory.innerHTML = selfHtml;
  oppHistory.innerHTML = oppHtml;
  totalRounds.textContent = data.totalRounds || data.myMoves.length;
}

function displayPointStatistics(data, analysis) {
  const totalRounds = data.myMoves.length;
  
  const myCoopCount = data.myMoves.filter(m => m === 'C').length;
  const oppCoopCount = data.opponentMoves.filter(m => m === 'C').length;
  
  const myCoopRate = (myCoopCount / totalRounds * 100).toFixed(1);
  const oppCoopRate = (oppCoopCount / totalRounds * 100).toFixed(1);
  
  let myTotalPayoff = 0;
  let oppTotalPayoff = 0;
  
  for (let i = 0; i < totalRounds; i++) {
    const payoff = getPayoff(data.myMoves[i], data.opponentMoves[i]);
    myTotalPayoff += payoff.myPayoff;
    oppTotalPayoff += payoff.opponentPayoff;
  }
  
  const myAvgPayoff = (myTotalPayoff / totalRounds).toFixed(2);
  const oppAvgPayoff = (oppTotalPayoff / totalRounds).toFixed(2);
  
  const statsHtml = `
    <h3><i class="fas fa-chart-bar"></i> Game Statistics</h3>
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 16px;">
      <div class="stat-card">
        <div class="stat-value">${myCoopRate}%</div>
        <div class="stat-label">Your Cooperation</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${oppCoopRate}%</div>
        <div class="stat-label">Opponent Cooperation</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${myAvgPayoff}</div>
        <div class="stat-label">Your Avg Points</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${oppAvgPayoff}</div>
        <div class="stat-label">Opponent Avg Points</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${analysis.confidence * 100}%</div>
        <div class="stat-label">Confidence Level</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${totalRounds}</div>
        <div class="stat-label">Total Rounds</div>
      </div>
    </div>
  `;
  
  document.getElementById('additionalStats').innerHTML = statsHtml;
}

function displayAdditionalInfo(analysis, data) {
  if (analysis.needsMoreRounds) {
    const infoDiv = document.createElement('div');
    infoDiv.className = 'card';
    infoDiv.style.marginTop = '16px';
    infoDiv.style.background = '#fef3c7';
    infoDiv.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        <i class="fas fa-exclamation-triangle" style="color: #92400e; font-size: 24px;"></i>
        <div>
          <strong style="color: #92400e;"><i class="fas fa-exclamation-circle"></i> Notice:</strong>
          <p style="color: #92400e; margin-top: 4px;">${analysis.reason}. Recommended to add ${analysis.suggestedRounds} rounds for more accurate analysis.</p>
        </div>
      </div>
    `;
    document.getElementById('resultArea').appendChild(infoDiv);
  }
}

function handleRematch() {
  if (currentMatch.opponentId && socket && socket.connected) {
    socket.emit('challenge', {
      from: currentUser.id,
      to: currentMatch.opponentId
    });
    showMainPage();
    showError('challengeError', 'Waiting for opponent response...', 'info');
  } else {
    showMainPage();
  }
}

function showError(elementId, message, type = 'error') {
  const el = document.getElementById(elementId);
  el.textContent = message;
  el.style.color = type === 'error' ? '#ef4444' : '#3b82f6';
  el.style.fontWeight = type === 'error' ? 'normal' : '500';
  el.style.background = type === 'info' ? '#e0f2fe' : 'transparent';
  el.style.padding = type === 'info' ? '8px' : '0';
  el.style.borderRadius = type === 'info' ? '8px' : '0';
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert('✅ Private key copied!');
  }).catch(() => {
    prompt('Copy your private key manually:', text);
  });
}

window.addEventListener('beforeunload', () => {
  if (currentMatch.roundTimer) {
    clearInterval(currentMatch.roundTimer);
  }
  if (socket) {
    socket.disconnect();
  }
});
