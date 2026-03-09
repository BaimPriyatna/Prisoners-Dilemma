class IPDStrategyAnalyzer {
  constructor(roundsRequired = 30, probabilityThreshold = 0.001) {
    this.roundsRequired = roundsRequired;
    this.probabilityThreshold = probabilityThreshold;
    this.strategies = this.initializeStrategies();
    this.weights = this.initializeWeights();
    this.expectedProfiles = this.initializeExpectedProfiles();
    this.personalityCategories = this.initializePersonalityCategories();
    this.sensitivities = this.initializeSensitivities();
  }

  initializeStrategies() {
    return {
      AllC: { name: "Always Cooperate", code: "ALLC", category: "Cooperative" },
      AllD: { name: "Always Defect", code: "ALLD", category: "Selfish / Exploitative" },
      Random: { name: "Random", code: "RAND", category: "Random" },
      TFT: { name: "Tit-for-Tat", code: "TFT", category: "Retaliator / Mimic" },
      SuspiciousTFT: { name: "Suspicious Tit-for-Tat", code: "STFT", category: "Retaliator / Mimic" },
      GenerousTFT: { name: "Generous Tit-for-Tat", code: "GTFT", category: "Forgiving" },
      ContriteTFT: { name: "Contrite Tit-for-Tat", code: "CTFT", category: "Forgiving" },
      ForgivingTFT: { name: "Forgiving Tit-for-Tat", code: "FTFT", category: "Forgiving" },
      OmegaTFT: { name: "Omega Tit-for-Tat", code: "OTFT", category: "Adaptive" },
      GrimTrigger: { name: "Grim Trigger", code: "GRIM", category: "Vindictive" },
      SoftGrudger: { name: "Soft Grudger", code: "SGRUD", category: "Vindictive" },
      HardGrudger: { name: "Hard Grudger", code: "HGRUD", category: "Vindictive" },
      Gradual: { name: "Gradual", code: "GRAD", category: "Analytical / Statistical" },
      Pavlov: { name: "Pavlov (Win-Stay Lose-Shift)", code: "PAV", category: "Adaptive" },
      SuspiciousPavlov: { name: "Suspicious Pavlov", code: "SPAV", category: "Retaliator / Mimic" },
      AdaptivePavlov: { name: "Adaptive Pavlov", code: "APAV", category: "Adaptive" },
      Prober: { name: "Prober", code: "PROB1", category: "Probe" },
      Prober2: { name: "Prober2", code: "PROB2", category: "Probe" },
      Prober3: { name: "Prober3", code: "PROB3", category: "Probe" },
      Downing: { name: "Downing", code: "DOWN", category: "Analytical / Statistical" },
      Graaskamp: { name: "Graaskamp", code: "GRAAS", category: "Analytical / Statistical" },
      TidemanChieruzzi: { name: "Tideman & Chieruzzi", code: "TIDC", category: "Adaptive" },
      Nydegger: { name: "Nydegger", code: "NYD", category: "Retaliator / Mimic" },
      Feld: { name: "Feld", code: "FELD", category: "Dynamic / Changing" },
      Tullock: { name: "Tullock", code: "TULL", category: "Dynamic / Changing" },
      TitForTwoTats: { name: "Tit for Two Tats", code: "TFTT", category: "Forgiving" },
      ReverseTFT: { name: "Reverse Tit-for-Tat", code: "RTFT", category: "Retaliator / Mimic" },
      AdaptiveCoop: { name: "Adaptive Cooperation", code: "ADAPT", category: "Cooperative" },
      ZDExtortion: { name: "Zero Determinant Extortion", code: "ZDE", category: "Selfish / Exploitative" },
      ZDGenerous: { name: "Zero Determinant Generous", code: "ZDG", category: "Cooperative" }
    };
  }

  initializePersonalityCategories() {
    return {
      "Cooperative": { strategies: ["AllC", "AdaptiveCoop", "ZDGenerous"], description: "Focuses on cooperation", color: "#10B981" },
      "Exploitative": { strategies: ["AllD", "ZDExtortion"], description: "Maximizes own gain", color: "#EF4444" },
      "Reciprocal": { strategies: ["TFT", "SuspiciousTFT", "ReverseTFT", "SuspiciousPavlov", "Nydegger"], description: "Mimics opponent actions", color: "#F59E0B" },
      "Forgiving": { strategies: ["GenerousTFT", "ForgivingTFT", "ContriteTFT", "TitForTwoTats"], description: "Easily returns to cooperate", color: "#3B82F6" },
      "Grudging": { strategies: ["GrimTrigger", "HardGrudger", "SoftGrudger"], description: "Punishes after betrayal", color: "#7C3AED" },
      "Adaptive": { strategies: ["Pavlov", "AdaptivePavlov", "OmegaTFT", "TidemanChieruzzi"], description: "Adjusts behavior", color: "#EC4899" },
      "Probing": { strategies: ["Prober", "Prober2", "Prober3"], description: "Tests opponent early", color: "#14B8A6" },
      "Analytical": { strategies: ["Downing", "Graaskamp", "Gradual"], description: "Analyzes patterns/probabilities", color: "#8B5CF6" },
      "Random": { strategies: ["Random"], description: "Unpredictable", color: "#6B7280" },
      "Dynamic": { strategies: ["Feld", "Tullock"], description: "Changes over time", color: "#F97316" }
    };
  }

  initializeSensitivities() {
    return {
      firstMove: 10,
      coopRate: 5,
      defectRate: 5,
      responseToC: 8,
      responseToD: 8,
      retaliationTrigger: 3,
      punishmentLength: 2,
      forgivenessRate: 6,
      memoryDepth: 2,
      probeBehaviour: 4,
      randomnessLevel: 4,
      adaptationTrend: 3,
      conditionalCooperation: 5,
      conditionalDefection: 5,
      punishmentEscalation: 3,
      noiseTolerance: 3,
      strategyDrift: 3,
      exploitDetection: 3,
      payoffResponse: 3,
      opponentModeling: 3
    };
  }

  initializeWeights() {
    return {
      firstMove: 0.12,
      coopRate: 0.06,
      defectRate: 0.04,
      responseToC: 0.09,
      responseToD: 0.09,
      retaliationTrigger: 0.05,
      punishmentLength: 0.04,
      forgivenessRate: 0.05,
      memoryDepth: 0.03,
      probeBehaviour: 0.04,
      randomnessLevel: 0.04,
      adaptationTrend: 0.04,
      transitions: 0.12,
      conditionalCooperation: 0.03,
      conditionalDefection: 0.03,
      punishmentEscalation: 0.02,
      noiseTolerance: 0.02,
      strategyDrift: 0.02,
      exploitDetection: 0.02,
      cyclePattern: 0.02,
      payoffResponse: 0.02,
      opponentModeling: 0.02
    };
  }

initializeExpectedProfiles() {
    return {
      AllC: {
        firstMove: 'C',
        coopRate: 1.0,
        defectRate: 0.0,
        responseToC: 1.0,
        responseToD: 0.0,
        retaliationTrigger: Infinity,
        punishmentLength: 0,
        forgivenessRate: 1.0,
        memoryDepth: 1,
        probeBehaviour: 0.0,
        randomnessLevel: 0.0,
        adaptationTrend: 0.0,
        transitions: {
          'CC': { toC: 1.0, toD: 0.0 },
          'CD': { toC: 1.0, toD: 0.0 },
          'DC': { toC: 1.0, toD: 0.0 },
          'DD': { toC: 1.0, toD: 0.0 }
        },
        conditionalCooperation: 1.0,
        conditionalDefection: 0.0,
        punishmentEscalation: 0.0,
        noiseTolerance: 1.0,
        strategyDrift: 0.0,
        exploitDetection: 0.0,
        cyclePattern: null,
        payoffResponse: 0.0,
        opponentModeling: 0.0
      },

      AllD: {
        firstMove: 'D',
        coopRate: 0.0,
        defectRate: 1.0,
        responseToC: 0.0,
        responseToD: 1.0,
        retaliationTrigger: 0,
        punishmentLength: Infinity,
        forgivenessRate: 0.0,
        memoryDepth: 1,
        probeBehaviour: 0.0,
        randomnessLevel: 0.0,
        adaptationTrend: 0.0,
        transitions: {
          'CC': { toC: 0.0, toD: 1.0 },
          'CD': { toC: 0.0, toD: 1.0 },
          'DC': { toC: 0.0, toD: 1.0 },
          'DD': { toC: 0.0, toD: 1.0 }
        },
        conditionalCooperation: 0.0,
        conditionalDefection: 1.0,
        punishmentEscalation: 0.0,
        noiseTolerance: 0.0,
        strategyDrift: 0.0,
        exploitDetection: 1.0,
        cyclePattern: null,
        payoffResponse: 0.0,
        opponentModeling: 0.0
      },

      Random: {
        firstMove: null,
        coopRate: 0.5,
        defectRate: 0.5,
        responseToC: 0.5,
        responseToD: 0.5,
        retaliationTrigger: null,
        punishmentLength: null,
        forgivenessRate: 0.5,
        memoryDepth: 0,
        probeBehaviour: 0.0,
        randomnessLevel: 1.0,
        adaptationTrend: 0.0,
        transitions: {
          'CC': { toC: 0.5, toD: 0.5 },
          'CD': { toC: 0.5, toD: 0.5 },
          'DC': { toC: 0.5, toD: 0.5 },
          'DD': { toC: 0.5, toD: 0.5 }
        },
        conditionalCooperation: 0.5,
        conditionalDefection: 0.5,
        punishmentEscalation: 0.0,
        noiseTolerance: 0.5,
        strategyDrift: 0.0,
        exploitDetection: 0.0,
        cyclePattern: null,
        payoffResponse: 0.0,
        opponentModeling: 0.0
      },

      TFT: {
        firstMove: 'C',
        coopRate: 0.5,
        defectRate: 0.5,
        responseToC: 0.95,
        responseToD: 0.95,
        retaliationTrigger: 1,
        punishmentLength: 1,
        forgivenessRate: 0.05,
        memoryDepth: 1,
        probeBehaviour: 0.0,
        randomnessLevel: 0.05,
        adaptationTrend: 0.0,
        transitions: {
          'CC': { toC: 0.95, toD: 0.05 },
          'CD': { toC: 0.05, toD: 0.95 },
          'DC': { toC: 0.95, toD: 0.05 },
          'DD': { toC: 0.05, toD: 0.95 }
        },
        conditionalCooperation: 0.95,
        conditionalDefection: 0.95,
        punishmentEscalation: 0.0,
        noiseTolerance: 0.1,
        strategyDrift: 0.0,
        exploitDetection: 0.5,
        cyclePattern: 'alternating',
        payoffResponse: 0.8,
        opponentModeling: 0.2
      },

      SuspiciousTFT: {
        firstMove: 'D',
        coopRate: 0.45,
        defectRate: 0.55,
        responseToC: 0.95,
        responseToD: 0.95,
        retaliationTrigger: 1,
        punishmentLength: 1,
        forgivenessRate: 0.05,
        memoryDepth: 1,
        probeBehaviour: 0.1,
        randomnessLevel: 0.05,
        adaptationTrend: 0.0,
        transitions: {
          'CC': { toC: 0.95, toD: 0.05 },
          'CD': { toC: 0.05, toD: 0.95 },
          'DC': { toC: 0.95, toD: 0.05 },
          'DD': { toC: 0.05, toD: 0.95 }
        },
        conditionalCooperation: 0.95,
        conditionalDefection: 0.95,
        punishmentEscalation: 0.0,
        noiseTolerance: 0.1,
        strategyDrift: 0.0,
        exploitDetection: 0.6,
        cyclePattern: 'alternating',
        payoffResponse: 0.8,
        opponentModeling: 0.2
      },

      GenerousTFT: {
        firstMove: 'C',
        coopRate: 0.65,
        defectRate: 0.35,
        responseToC: 0.98,
        responseToD: 0.7,
        retaliationTrigger: 1,
        punishmentLength: 1,
        forgivenessRate: 0.3,
        memoryDepth: 1,
        probeBehaviour: 0.0,
        randomnessLevel: 0.1,
        adaptationTrend: 0.0,
        transitions: {
          'CC': { toC: 0.98, toD: 0.02 },
          'CD': { toC: 0.30, toD: 0.70 },
          'DC': { toC: 0.98, toD: 0.02 },
          'DD': { toC: 0.30, toD: 0.70 }
        },
        conditionalCooperation: 0.98,
        conditionalDefection: 0.7,
        punishmentEscalation: 0.0,
        noiseTolerance: 0.3,
        strategyDrift: 0.0,
        exploitDetection: 0.3,
        cyclePattern: 'cooperative',
        payoffResponse: 0.7,
        opponentModeling: 0.3
      },

      ContriteTFT: {
        firstMove: 'C',
        coopRate: 0.55,
        defectRate: 0.45,
        responseToC: 0.9,
        responseToD: 0.9,
        retaliationTrigger: 1,
        punishmentLength: 1,
        forgivenessRate: 0.2,
        memoryDepth: 2,
        probeBehaviour: 0.0,
        randomnessLevel: 0.05,
        adaptationTrend: 0.0,
        transitions: {
          'CC': { toC: 0.95, toD: 0.05 },
          'CD': { toC: 0.20, toD: 0.80 },
          'DC': { toC: 0.80, toD: 0.20 },
          'DD': { toC: 0.10, toD: 0.90 }
        },
        conditionalCooperation: 0.9,
        conditionalDefection: 0.9,
        punishmentEscalation: 0.0,
        noiseTolerance: 0.4,
        strategyDrift: 0.0,
        exploitDetection: 0.4,
        cyclePattern: 'apologetic',
        payoffResponse: 0.6,
        opponentModeling: 0.4
      },

      ForgivingTFT: {
        firstMove: 'C',
        coopRate: 0.7,
        defectRate: 0.3,
        responseToC: 0.95,
        responseToD: 0.6,
        retaliationTrigger: 1,
        punishmentLength: 1,
        forgivenessRate: 0.5,
        memoryDepth: 1,
        probeBehaviour: 0.0,
        randomnessLevel: 0.1,
        adaptationTrend: 0.0,
        transitions: {
          'CC': { toC: 0.95, toD: 0.05 },
          'CD': { toC: 0.50, toD: 0.50 },
          'DC': { toC: 0.95, toD: 0.05 },
          'DD': { toC: 0.50, toD: 0.50 }
        },
        conditionalCooperation: 0.95,
        conditionalDefection: 0.5,
        punishmentEscalation: 0.0,
        noiseTolerance: 0.5,
        strategyDrift: 0.0,
        exploitDetection: 0.2,
        cyclePattern: 'cooperative',
        payoffResponse: 0.6,
        opponentModeling: 0.3
      },

      OmegaTFT: {
        firstMove: 'C',
        coopRate: 0.6,
        defectRate: 0.4,
        responseToC: 0.9,
        responseToD: 0.85,
        retaliationTrigger: 1,
        punishmentLength: 1,
        forgivenessRate: 0.2,
        memoryDepth: 3,
        probeBehaviour: 0.2,
        randomnessLevel: 0.1,
        adaptationTrend: 0.1,
        transitions: {
          'CC': { toC: 0.95, toD: 0.05 },
          'CD': { toC: 0.20, toD: 0.80 },
          'DC': { toC: 0.85, toD: 0.15 },
          'DD': { toC: 0.15, toD: 0.85 }
        },
        conditionalCooperation: 0.9,
        conditionalDefection: 0.85,
        punishmentEscalation: 0.2,
        noiseTolerance: 0.6,
        strategyDrift: 0.1,
        exploitDetection: 0.7,
        cyclePattern: 'adaptive',
        payoffResponse: 0.8,
        opponentModeling: 0.7
      },

      GrimTrigger: {
        firstMove: 'C',
        coopRate: 0.3,
        defectRate: 0.7,
        responseToC: 0.5,
        responseToD: 1.0,
        retaliationTrigger: 1,
        punishmentLength: Infinity,
        forgivenessRate: 0.0,
        memoryDepth: Infinity,
        probeBehaviour: 0.0,
        randomnessLevel: 0.0,
        adaptationTrend: -0.5,
        transitions: {
          'CC': { toC: 0.5, toD: 0.5 },
          'CD': { toC: 0.0, toD: 1.0 },
          'DC': { toC: 0.0, toD: 1.0 },
          'DD': { toC: 0.0, toD: 1.0 }
        },
        conditionalCooperation: 0.5,
        conditionalDefection: 1.0,
        punishmentEscalation: 0.0,
        noiseTolerance: 0.0,
        strategyDrift: 0.0,
        exploitDetection: 1.0,
        cyclePattern: 'triggered',
        payoffResponse: 0.9,
        opponentModeling: 0.1
      },

      SoftGrudger: {
        firstMove: 'C',
        coopRate: 0.6,
        defectRate: 0.4,
        responseToC: 0.8,
        responseToD: 0.7,
        retaliationTrigger: 1,
        punishmentLength: 3,
        forgivenessRate: 0.3,
        memoryDepth: 3,
        probeBehaviour: 0.0,
        randomnessLevel: 0.0,
        adaptationTrend: 0.0,
        transitions: {
          'CC': { toC: 0.9, toD: 0.1 },
          'CD': { toC: 0.2, toD: 0.8 },
          'DC': { toC: 0.7, toD: 0.3 },
          'DD': { toC: 0.3, toD: 0.7 }
        },
        conditionalCooperation: 0.8,
        conditionalDefection: 0.7,
        punishmentEscalation: 0.0,
        noiseTolerance: 0.2,
        strategyDrift: 0.0,
        exploitDetection: 0.6,
        cyclePattern: 'grudge_cycle',
        payoffResponse: 0.7,
        opponentModeling: 0.3
      },

      HardGrudger: {
        firstMove: 'C',
        coopRate: 0.4,
        defectRate: 0.6,
        responseToC: 0.6,
        responseToD: 0.9,
        retaliationTrigger: 1,
        punishmentLength: 10,
        forgivenessRate: 0.1,
        memoryDepth: 10,
        probeBehaviour: 0.0,
        randomnessLevel: 0.0,
        adaptationTrend: -0.2,
        transitions: {
          'CC': { toC: 0.8, toD: 0.2 },
          'CD': { toC: 0.1, toD: 0.9 },
          'DC': { toC: 0.5, toD: 0.5 },
          'DD': { toC: 0.1, toD: 0.9 }
        },
        conditionalCooperation: 0.6,
        conditionalDefection: 0.9,
        punishmentEscalation: 0.1,
        noiseTolerance: 0.1,
        strategyDrift: 0.0,
        exploitDetection: 0.8,
        cyclePattern: 'long_grudge',
        payoffResponse: 0.8,
        opponentModeling: 0.2
      },

      Gradual: {
        firstMove: 'C',
        coopRate: 0.5,
        defectRate: 0.5,
        responseToC: 0.8,
        responseToD: 0.6,
        retaliationTrigger: 1,
        punishmentLength: 'increasing',
        forgivenessRate: 0.2,
        memoryDepth: 5,
        probeBehaviour: 0.1,
        randomnessLevel: 0.0,
        adaptationTrend: -0.1,
        transitions: {
          'CC': { toC: 0.9, toD: 0.1 },
          'CD': { toC: 0.2, toD: 0.8 },
          'DC': { toC: 0.7, toD: 0.3 },
          'DD': { toC: 0.2, toD: 0.8 }
        },
        conditionalCooperation: 0.8,
        conditionalDefection: 0.6,
        punishmentEscalation: 1.0,
        noiseTolerance: 0.2,
        strategyDrift: 0.1,
        exploitDetection: 0.7,
        cyclePattern: 'escalating',
        payoffResponse: 0.8,
        opponentModeling: 0.4
      },

      Pavlov: {
        firstMove: 'C',
        coopRate: 0.5,
        defectRate: 0.5,
        responseToC: 0.7,
        responseToD: 0.3,
        retaliationTrigger: 'payoff',
        punishmentLength: 'variable',
        forgivenessRate: 0.3,
        memoryDepth: 1,
        probeBehaviour: 0.1,
        randomnessLevel: 0.1,
        adaptationTrend: 0.1,
        transitions: {
          'CC': { toC: 0.8, toD: 0.2 },
          'CD': { toC: 0.3, toD: 0.7 },
          'DC': { toC: 0.7, toD: 0.3 },
          'DD': { toC: 0.2, toD: 0.8 }
        },
        conditionalCooperation: 0.7,
        conditionalDefection: 0.3,
        punishmentEscalation: 0.2,
        noiseTolerance: 0.3,
        strategyDrift: 0.1,
        exploitDetection: 0.4,
        cyclePattern: 'winstay_loseshift',
        payoffResponse: 1.0,
        opponentModeling: 0.2
      },

      SuspiciousPavlov: {
        firstMove: 'D',
        coopRate: 0.45,
        defectRate: 0.55,
        responseToC: 0.65,
        responseToD: 0.35,
        retaliationTrigger: 'payoff',
        punishmentLength: 'variable',
        forgivenessRate: 0.25,
        memoryDepth: 1,
        probeBehaviour: 0.2,
        randomnessLevel: 0.1,
        adaptationTrend: 0.1,
        transitions: {
          'CC': { toC: 0.75, toD: 0.25 },
          'CD': { toC: 0.35, toD: 0.65 },
          'DC': { toC: 0.65, toD: 0.35 },
          'DD': { toC: 0.25, toD: 0.75 }
        },
        conditionalCooperation: 0.65,
        conditionalDefection: 0.35,
        punishmentEscalation: 0.2,
        noiseTolerance: 0.25,
        strategyDrift: 0.1,
        exploitDetection: 0.5,
        cyclePattern: 'winstay_loseshift',
        payoffResponse: 0.95,
        opponentModeling: 0.25
      },

      AdaptivePavlov: {
        firstMove: 'C',
        coopRate: 0.55,
        defectRate: 0.45,
        responseToC: 0.75,
        responseToD: 0.4,
        retaliationTrigger: 'payoff',
        punishmentLength: 'adaptive',
        forgivenessRate: 0.35,
        memoryDepth: 3,
        probeBehaviour: 0.2,
        randomnessLevel: 0.15,
        adaptationTrend: 0.2,
        transitions: {
          'CC': { toC: 0.85, toD: 0.15 },
          'CD': { toC: 0.4, toD: 0.6 },
          'DC': { toC: 0.7, toD: 0.3 },
          'DD': { toC: 0.3, toD: 0.7 }
        },
        conditionalCooperation: 0.75,
        conditionalDefection: 0.4,
        punishmentEscalation: 0.4,
        noiseTolerance: 0.4,
        strategyDrift: 0.3,
        exploitDetection: 0.6,
        cyclePattern: 'adaptive_cycle',
        payoffResponse: 0.9,
        opponentModeling: 0.5
      },

      Prober: {
        firstMove: 'C',
        coopRate: 0.6,
        defectRate: 0.4,
        responseToC: 0.8,
        responseToD: 0.6,
        retaliationTrigger: 'probe_pattern',
        punishmentLength: 1,
        forgivenessRate: 0.4,
        memoryDepth: 3,
        probeBehaviour: 1.0,
        randomnessLevel: 0.1,
        adaptationTrend: 0.2,
        transitions: {
          'CC': { toC: 0.9, toD: 0.1 },
          'CD': { toC: 0.5, toD: 0.5 },
          'DC': { toC: 0.8, toD: 0.2 },
          'DD': { toC: 0.3, toD: 0.7 }
        },
        conditionalCooperation: 0.8,
        conditionalDefection: 0.6,
        punishmentEscalation: 0.2,
        noiseTolerance: 0.2,
        strategyDrift: 0.2,
        exploitDetection: 0.8,
        cyclePattern: 'probe_first',
        payoffResponse: 0.7,
        opponentModeling: 0.6
      },

      Prober2: {
        firstMove: 'C',
        coopRate: 0.55,
        defectRate: 0.45,
        responseToC: 0.75,
        responseToD: 0.55,
        retaliationTrigger: 'probe_pattern',
        punishmentLength: 2,
        forgivenessRate: 0.35,
        memoryDepth: 5,
        probeBehaviour: 1.0,
        randomnessLevel: 0.1,
        adaptationTrend: 0.2,
        transitions: {
          'CC': { toC: 0.85, toD: 0.15 },
          'CD': { toC: 0.45, toD: 0.55 },
          'DC': { toC: 0.75, toD: 0.25 },
          'DD': { toC: 0.25, toD: 0.75 }
        },
        conditionalCooperation: 0.75,
        conditionalDefection: 0.55,
        punishmentEscalation: 0.3,
        noiseTolerance: 0.2,
        strategyDrift: 0.2,
        exploitDetection: 0.85,
        cyclePattern: 'probe_twice',
        payoffResponse: 0.7,
        opponentModeling: 0.7
      },

      Prober3: {
        firstMove: 'D',
        coopRate: 0.5,
        defectRate: 0.5,
        responseToC: 0.7,
        responseToD: 0.5,
        retaliationTrigger: 'complex_probe',
        punishmentLength: 'variable',
        forgivenessRate: 0.3,
        memoryDepth: 7,
        probeBehaviour: 1.0,
        randomnessLevel: 0.15,
        adaptationTrend: 0.3,
        transitions: {
          'CC': { toC: 0.8, toD: 0.2 },
          'CD': { toC: 0.4, toD: 0.6 },
          'DC': { toC: 0.7, toD: 0.3 },
          'DD': { toC: 0.2, toD: 0.8 }
        },
        conditionalCooperation: 0.7,
        conditionalDefection: 0.5,
        punishmentEscalation: 0.4,
        noiseTolerance: 0.25,
        strategyDrift: 0.3,
        exploitDetection: 0.9,
        cyclePattern: 'complex_probe',
        payoffResponse: 0.75,
        opponentModeling: 0.8
      },

      Downing: {
        firstMove: 'C',
        coopRate: 0.55,
        defectRate: 0.45,
        responseToC: 0.7,
        responseToD: 0.5,
        retaliationTrigger: 'statistical',
        punishmentLength: 'adaptive',
        forgivenessRate: 0.4,
        memoryDepth: 10,
        probeBehaviour: 0.3,
        randomnessLevel: 0.1,
        adaptationTrend: 0.2,
        transitions: {
          'CC': { toC: 0.8, toD: 0.2 },
          'CD': { toC: 0.4, toD: 0.6 },
          'DC': { toC: 0.7, toD: 0.3 },
          'DD': { toC: 0.3, toD: 0.7 }
        },
        conditionalCooperation: 0.7,
        conditionalDefection: 0.5,
        punishmentEscalation: 0.3,
        noiseTolerance: 0.5,
        strategyDrift: 0.2,
        exploitDetection: 0.7,
        cyclePattern: 'statistical',
        payoffResponse: 0.8,
        opponentModeling: 0.9
      },

      Graaskamp: {
        firstMove: 'C',
        coopRate: 0.6,
        defectRate: 0.4,
        responseToC: 0.75,
        responseToD: 0.55,
        retaliationTrigger: 'pattern',
        punishmentLength: 'adaptive',
        forgivenessRate: 0.35,
        memoryDepth: 15,
        probeBehaviour: 0.4,
        randomnessLevel: 0.1,
        adaptationTrend: 0.25,
        transitions: {
          'CC': { toC: 0.85, toD: 0.15 },
          'CD': { toC: 0.45, toD: 0.55 },
          'DC': { toC: 0.75, toD: 0.25 },
          'DD': { toC: 0.25, toD: 0.75 }
        },
        conditionalCooperation: 0.75,
        conditionalDefection: 0.55,
        punishmentEscalation: 0.3,
        noiseTolerance: 0.45,
        strategyDrift: 0.25,
        exploitDetection: 0.8,
        cyclePattern: 'pattern_detection',
        payoffResponse: 0.75,
        opponentModeling: 0.95
      },

      TidemanChieruzzi: {
        firstMove: 'C',
        coopRate: 0.6,
        defectRate: 0.4,
        responseToC: 0.8,
        responseToD: 0.6,
        retaliationTrigger: 'complex',
        punishmentLength: 'increasing',
        forgivenessRate: 0.25,
        memoryDepth: 20,
        probeBehaviour: 0.3,
        randomnessLevel: 0.05,
        adaptationTrend: 0.1,
        transitions: {
          'CC': { toC: 0.9, toD: 0.1 },
          'CD': { toC: 0.3, toD: 0.7 },
          'DC': { toC: 0.8, toD: 0.2 },
          'DD': { toC: 0.2, toD: 0.8 }
        },
        conditionalCooperation: 0.8,
        conditionalDefection: 0.6,
        punishmentEscalation: 0.8,
        noiseTolerance: 0.3,
        strategyDrift: 0.2,
        exploitDetection: 0.8,
        cyclePattern: 'complex_pattern',
        payoffResponse: 0.85,
        opponentModeling: 0.7
      },

      Nydegger: {
        firstMove: 'C',
        coopRate: 0.58,
        defectRate: 0.42,
        responseToC: 0.78,
        responseToD: 0.58,
        retaliationTrigger: 'pattern_rules',
        punishmentLength: 'rule_based',
        forgivenessRate: 0.3,
        memoryDepth: 3,
        probeBehaviour: 0.2,
        randomnessLevel: 0.05,
        adaptationTrend: 0.1,
        transitions: {
          'CC': { toC: 0.88, toD: 0.12 },
          'CD': { toC: 0.35, toD: 0.65 },
          'DC': { toC: 0.78, toD: 0.22 },
          'DD': { toC: 0.22, toD: 0.78 }
        },
        conditionalCooperation: 0.78,
        conditionalDefection: 0.58,
        punishmentEscalation: 0.3,
        noiseTolerance: 0.25,
        strategyDrift: 0.1,
        exploitDetection: 0.6,
        cyclePattern: 'rule_based',
        payoffResponse: 0.7,
        opponentModeling: 0.5
      },

      Feld: {
        firstMove: 'C',
        coopRate: 0.7,
        defectRate: 0.3,
        responseToC: 0.85,
        responseToD: 0.4,
        retaliationTrigger: 'increasing',
        punishmentLength: 'increasing',
        forgivenessRate: 0.2,
        memoryDepth: 10,
        probeBehaviour: 0.2,
        randomnessLevel: 0.1,
        adaptationTrend: -0.3,
        transitions: {
          'CC': { toC: 0.9, toD: 0.1 },
          'CD': { toC: 0.3, toD: 0.7 },
          'DC': { toC: 0.8, toD: 0.2 },
          'DD': { toC: 0.2, toD: 0.8 }
        },
        conditionalCooperation: 0.85,
        conditionalDefection: 0.4,
        punishmentEscalation: 0.5,
        noiseTolerance: 0.2,
        strategyDrift: -0.3,
        exploitDetection: 0.6,
        cyclePattern: 'decreasing_coop',
        payoffResponse: 0.7,
        opponentModeling: 0.4
      },

      Tullock: {
        firstMove: 'C',
        coopRate: 0.65,
        defectRate: 0.35,
        responseToC: 0.8,
        responseToD: 0.5,
        retaliationTrigger: 'time_based',
        punishmentLength: 'increasing',
        forgivenessRate: 0.15,
        memoryDepth: 15,
        probeBehaviour: 0.2,
        randomnessLevel: 0.1,
        adaptationTrend: -0.4,
        transitions: {
          'CC': { toC: 0.85, toD: 0.15 },
          'CD': { toC: 0.25, toD: 0.75 },
          'DC': { toC: 0.75, toD: 0.25 },
          'DD': { toC: 0.15, toD: 0.85 }
        },
        conditionalCooperation: 0.8,
        conditionalDefection: 0.5,
        punishmentEscalation: 0.6,
        noiseTolerance: 0.15,
        strategyDrift: -0.4,
        exploitDetection: 0.7,
        cyclePattern: 'increasing_defect',
        payoffResponse: 0.75,
        opponentModeling: 0.3
      },

      TitForTwoTats: {
        firstMove: 'C',
        coopRate: 0.65,
        defectRate: 0.35,
        responseToC: 0.9,
        responseToD: 0.3,
        retaliationTrigger: 2,
        punishmentLength: 1,
        forgivenessRate: 0.6,
        memoryDepth: 2,
        probeBehaviour: 0.0,
        randomnessLevel: 0.0,
        adaptationTrend: 0.0,
        transitions: {
          'CC': { toC: 0.95, toD: 0.05 },
          'CD': { toC: 0.7, toD: 0.3 },
          'DC': { toC: 0.9, toD: 0.1 },
          'DD': { toC: 0.3, toD: 0.7 }
        },
        conditionalCooperation: 0.9,
        conditionalDefection: 0.3,
        punishmentEscalation: 0.0,
        noiseTolerance: 0.5,
        strategyDrift: 0.0,
        exploitDetection: 0.4,
        cyclePattern: 'patient',
        payoffResponse: 0.6,
        opponentModeling: 0.3
      },

      ReverseTFT: {
        firstMove: 'D',
        coopRate: 0.4,
        defectRate: 0.6,
        responseToC: 0.1,
        responseToD: 0.1,
        retaliationTrigger: 'opposite',
        punishmentLength: 1,
        forgivenessRate: 0.9,
        memoryDepth: 1,
        probeBehaviour: 0.1,
        randomnessLevel: 0.1,
        adaptationTrend: 0.0,
        transitions: {
          'CC': { toC: 0.1, toD: 0.9 },
          'CD': { toC: 0.9, toD: 0.1 },
          'DC': { toC: 0.1, toD: 0.9 },
          'DD': { toC: 0.9, toD: 0.1 }
        },
        conditionalCooperation: 0.1,
        conditionalDefection: 0.1,
        punishmentEscalation: 0.0,
        noiseTolerance: 0.2,
        strategyDrift: 0.0,
        exploitDetection: 0.2,
        cyclePattern: 'reverse',
        payoffResponse: 0.3,
        opponentModeling: 0.2
      },

      AdaptiveCoop: {
        firstMove: 'C',
        coopRate: 0.7,
        defectRate: 0.3,
        responseToC: 0.9,
        responseToD: 0.5,
        retaliationTrigger: 'adaptive',
        punishmentLength: 'adaptive',
        forgivenessRate: 0.5,
        memoryDepth: 5,
        probeBehaviour: 0.2,
        randomnessLevel: 0.1,
        adaptationTrend: 0.2,
        transitions: {
          'CC': { toC: 0.95, toD: 0.05 },
          'CD': { toC: 0.5, toD: 0.5 },
          'DC': { toC: 0.9, toD: 0.1 },
          'DD': { toC: 0.4, toD: 0.6 }
        },
        conditionalCooperation: 0.9,
        conditionalDefection: 0.5,
        punishmentEscalation: 0.3,
        noiseTolerance: 0.5,
        strategyDrift: 0.2,
        exploitDetection: 0.6,
        cyclePattern: 'adaptive_coop',
        payoffResponse: 0.7,
        opponentModeling: 0.6
      },

      ZDExtortion: {
        firstMove: 'C',
        coopRate: 0.5,
        defectRate: 0.5,
        responseToC: 0.7,
        responseToD: 0.6,
        retaliationTrigger: 'payoff_manipulation',
        punishmentLength: 'strategic',
        forgivenessRate: 0.2,
        memoryDepth: 3,
        probeBehaviour: 0.3,
        randomnessLevel: 0.0,
        adaptationTrend: 0.1,
        transitions: {
          'CC': { toC: 0.8, toD: 0.2 },
          'CD': { toC: 0.3, toD: 0.7 },
          'DC': { toC: 0.7, toD: 0.3 },
          'DD': { toC: 0.2, toD: 0.8 }
        },
        conditionalCooperation: 0.7,
        conditionalDefection: 0.6,
        punishmentEscalation: 0.4,
        noiseTolerance: 0.2,
        strategyDrift: 0.1,
        exploitDetection: 0.9,
        cyclePattern: 'extortion',
        payoffResponse: 1.0,
        opponentModeling: 0.8
      },

      ZDGenerous: {
        firstMove: 'C',
        coopRate: 0.7,
        defectRate: 0.3,
        responseToC: 0.9,
        responseToD: 0.5,
        retaliationTrigger: 'generous_zd',
        punishmentLength: 'minimal',
        forgivenessRate: 0.6,
        memoryDepth: 3,
        probeBehaviour: 0.1,
        randomnessLevel: 0.0,
        adaptationTrend: 0.1,
        transitions: {
          'CC': { toC: 0.95, toD: 0.05 },
          'CD': { toC: 0.5, toD: 0.5 },
          'DC': { toC: 0.9, toD: 0.1 },
          'DD': { toC: 0.4, toD: 0.6 }
        },
        conditionalCooperation: 0.9,
        conditionalDefection: 0.5,
        punishmentEscalation: 0.2,
        noiseTolerance: 0.6,
        strategyDrift: 0.1,
        exploitDetection: 0.5,
        cyclePattern: 'generous_zd',
        payoffResponse: 0.8,
        opponentModeling: 0.6
      }
    };
  }

  analyze(myMoves, opponentMoves) {
    if (myMoves.length < 5) {
      return this.getInsufficientDataResult(myMoves.length);
    }

    const params = this.extractParameters(myMoves, opponentMoves);
    const probabilities = this.calculateProbabilities(params);
    const sortedStrategies = this.sortProbabilities(probabilities);
    const personality = this.analyzePersonality(probabilities);
    const confidence = this.calculateConfidence(sortedStrategies);
    const adaptive = this.checkAdaptiveNeeds(sortedStrategies, myMoves.length);

    return {
      personality: personality,
      primaryStrategy: sortedStrategies[0],
      topStrategies: sortedStrategies.slice(0, 7),
      totalRounds: myMoves.length,
      confidence: confidence,
      needsMoreRounds: adaptive.needsMore,
      suggestedRounds: adaptive.suggested,
      reason: adaptive.reason
    };
  }

  extractParameters(myMoves, opponentMoves) {
    const rounds = myMoves.length;
    const firstMove = myMoves[0];
    const coopCount = myMoves.filter(m => m === 'C').length;
    const coopRate = coopCount / rounds;
    const defectRate = 1 - coopRate;

    let cFollowedByC = 0, totalAfterC = 0;
    let dFollowedByD = 0, totalAfterD = 0;

    for (let i = 1; i < rounds; i++) {
      if (opponentMoves[i - 1] === 'C') {
        totalAfterC++;
        if (myMoves[i] === 'C') cFollowedByC++;
      } else {
        totalAfterD++;
        if (myMoves[i] === 'D') dFollowedByD++;
      }
    }

    const responseToC = totalAfterC > 0 ? cFollowedByC / totalAfterC : 0.5;
    const responseToD = totalAfterD > 0 ? dFollowedByD / totalAfterD : 0.5;

    const transitions = this.calculateMarkovTransitions(myMoves, opponentMoves);
    const { retaliationTrigger, punishmentLength } = this.detectRetaliationPattern(myMoves, opponentMoves);
    const forgivenessRate = this.calculateForgivenessRate(myMoves, opponentMoves);
    const memoryDepth = this.estimateMemoryDepth(myMoves, opponentMoves);
    const probeBehaviour = this.detectProbeBehaviour(myMoves, opponentMoves);
    const randomnessLevel = this.calculateRandomnessLevel(myMoves, opponentMoves);
    const adaptationTrend = this.detectAdaptationTrend(myMoves);
    const { conditionalCooperation, conditionalDefection } = this.calculateConditionalProbs(myMoves, opponentMoves);
    const punishmentEscalation = this.detectPunishmentEscalation(myMoves, opponentMoves);
    const noiseTolerance = this.calculateNoiseTolerance(myMoves, opponentMoves);
    const strategyDrift = this.calculateStrategyDrift(myMoves);
    const exploitDetection = this.detectExploitBehaviour(myMoves, opponentMoves);
    const cyclePattern = this.detectCyclePattern(myMoves);
    const payoffResponse = this.calculatePayoffResponse(myMoves, opponentMoves);
    const opponentModeling = this.detectOpponentModeling(myMoves, opponentMoves);

    return {
      firstMove, coopRate, defectRate, responseToC, responseToD,
      retaliationTrigger, punishmentLength, forgivenessRate, memoryDepth, probeBehaviour,
      randomnessLevel, adaptationTrend, transitions, conditionalCooperation, conditionalDefection,
      punishmentEscalation, noiseTolerance, strategyDrift, exploitDetection, cyclePattern,
      payoffResponse, opponentModeling
    };
  }

  calculateProbabilities(params) {
    let probabilities = {};
    for (const key of Object.keys(this.strategies)) {
      probabilities[key] = this.calculateStrategyProbability(key, params);
    }
    const total = Object.values(probabilities).reduce((a, b) => a + b, 0);
    for (let key in probabilities) {
      probabilities[key] = probabilities[key] / total;
    }
    return probabilities;
  }

  calculateStrategyProbability(strategyKey, observed) {
    const expected = this.expectedProfiles[strategyKey];
    if (!expected) return this.probabilityThreshold;

    let logProb = 0;
    const weights = this.weights;

    if (expected.firstMove !== null && expected.firstMove !== undefined && observed.firstMove) {
      const sim = (expected.firstMove === observed.firstMove) ? 0.9 : 0.1;
      logProb += Math.log(sim) * weights.firstMove;
    }

    logProb += Math.log(this.calculateTransitionSimilarity(expected.transitions, observed.transitions) + this.probabilityThreshold) * weights.transitions;

    const numericParams = [
      'coopRate', 'responseToC', 'responseToD', 'forgivenessRate', 'randomnessLevel',
      'adaptationTrend', 'probeBehaviour', 'conditionalCooperation', 'conditionalDefection',
      'punishmentEscalation', 'noiseTolerance', 'strategyDrift', 'exploitDetection',
      'payoffResponse', 'opponentModeling', 'retaliationTrigger', 'punishmentLength', 'memoryDepth'
    ];

    for (let param of numericParams) {
      if (expected[param] !== undefined && observed[param] !== undefined && typeof expected[param] === 'number') {
        const diff = Math.abs(expected[param] - observed[param]);
        const sensitivity = this.sensitivities[param] || 4;
        const sim = Math.exp(-diff * sensitivity);
        logProb += Math.log(sim + this.probabilityThreshold) * (weights[param] || 0.01);
      }
    }

    if (expected.cyclePattern && observed.cyclePattern) {
      const sim = (expected.cyclePattern === observed.cyclePattern) ? 0.8 : 0.2;
      logProb += Math.log(sim) * weights.cyclePattern;
    }

    return Math.exp(logProb);
  }

  calculateMarkovTransitions(myMoves, opponentMoves) {
    const transitions = {
      'CC': { toC: 0, toD: 0, total: 0 },
      'CD': { toC: 0, toD: 0, total: 0 },
      'DC': { toC: 0, toD: 0, total: 0 },
      'DD': { toC: 0, toD: 0, total: 0 }
    };

    for (let i = 1; i < myMoves.length; i++) {
      const prevState = opponentMoves[i - 1] + myMoves[i - 1];
      const currentMove = myMoves[i];
      if (transitions[prevState]) {
        transitions[prevState].total++;
        if (currentMove === 'C') transitions[prevState].toC++;
        else transitions[prevState].toD++;
      }
    }
    return transitions;
  }

  calculateTransitionSimilarity(expectedTrans, observedTrans) {
    let similarity = 0;
    let count = 0;
    for (let state of ['CC', 'CD', 'DC', 'DD']) {
      if (expectedTrans[state] && observedTrans[state] && observedTrans[state].total > 0) {
        const expToC = expectedTrans[state].toC;
        const obsToC = observedTrans[state].toC / observedTrans[state].total;
        const diff = Math.abs(expToC - obsToC);
        similarity += Math.exp(-diff * 5);
        count++;
      }
    }
    return count > 0 ? similarity / count : 0.5;
  }

  analyzePersonality(probabilities) {
    const categoryScores = {};
    for (const [category, data] of Object.entries(this.personalityCategories)) {
      let score = 0;
      for (const strategyKey of data.strategies) {
        if (probabilities[strategyKey]) score += probabilities[strategyKey];
      }
      categoryScores[category] = score;
    }
    return Object.entries(categoryScores)
      .sort(([, a], [, b]) => b - a)
      .map(([category, score]) => ({
        category,
        description: this.personalityCategories[category].description,
        color: this.personalityCategories[category].color,
        probability: Math.round(score * 1000) / 1000,
        percentage: Math.round(score * 100)
      }));
  }

  sortProbabilities(probabilities) {
    return Object.entries(probabilities)
      .sort(([, a], [, b]) => b - a)
      .map(([key, value]) => ({
        strategy: key,
        name: this.strategies[key].name,
        code: this.strategies[key].code,
        category: this.strategies[key].category,
        probability: Math.round(value * 1000) / 1000
      }));
  }

  calculateConfidence(sortedStrategies) {
    if (sortedStrategies.length < 2) return 1;
    const top = sortedStrategies[0].probability;
    const second = sortedStrategies[1].probability;
    let conf = Math.min((top - second) * 5 + 0.3, 1);
    return Math.round(conf * 1000) / 1000;
  }

  checkAdaptiveNeeds(sortedStrategies, currentLength) {
    if (sortedStrategies.length < 2) return { needsMore: false, suggested: 0, reason: "Sufficient data" };

    const top1 = sortedStrategies[0].probability;
    const top2 = sortedStrategies[1].probability;
    const gap = top1 - top2;

    if (currentLength < this.roundsRequired) {
      return { needsMore: true, suggested: this.roundsRequired - currentLength, reason: "Minimum rounds not met" };
    }
    if (top1 < 0.25) {
      return { needsMore: true, suggested: 5, reason: "Confidence too low" };
    }
    if (gap < 0.05) {
      return { needsMore: true, suggested: 5, reason: "Top strategies are too similar" };
    }
    return { needsMore: false, suggested: 0, reason: "Analysis complete" };
  }

  getInsufficientDataResult(len) {
    return {
      personality: [{ category: "Undetected", description: "Insufficient data", color: "#6B7280", probability: 0, percentage: 0 }],
      primaryStrategy: { strategy: "Unknown", name: "Insufficient Data", probability: 0 },
      topStrategies: [],
      totalRounds: len,
      confidence: 0,
      needsMoreRounds: true,
      suggestedRounds: this.roundsRequired - len,
      reason: "Need more data"
    };
  }

  detectRetaliationPattern(myMoves, opponentMoves) {
    let retaliationTrigger = 1;
    let punishmentLength = 1;

    let maxConsecutiveDefects = 0;
    let consecutiveDefects = 0;
    for (let i = 0; i < opponentMoves.length; i++) {
      if (opponentMoves[i] === 'D') {
        consecutiveDefects++;
      } else {
        if (consecutiveDefects > maxConsecutiveDefects) {
          maxConsecutiveDefects = consecutiveDefects;
        }
        consecutiveDefects = 0;
      }
    }
    retaliationTrigger = Math.min(maxConsecutiveDefects || 1, 5);

    let inPunishment = false;
    let currentPunishment = 0;
    let punishments = [];
    for (let i = 1; i < myMoves.length; i++) {
      if (opponentMoves[i - 1] === 'D' && myMoves[i] === 'D' && !inPunishment) {
        inPunishment = true;
        currentPunishment = 1;
      } else if (inPunishment) {
        if (myMoves[i] === 'D') {
          currentPunishment++;
        } else {
          inPunishment = false;
          punishments.push(currentPunishment);
        }
      }
    }
    if (inPunishment) punishments.push(currentPunishment);
    if (punishments.length > 0) {
      punishmentLength = Math.round(punishments.reduce((a, b) => a + b, 0) / punishments.length);
    }
    return { retaliationTrigger, punishmentLength };
  }

  calculateForgivenessRate(myMoves, opponentMoves) {
    let conflicts = 0;
    let forgiveness = 0;
    for (let i = 1; i < myMoves.length; i++) {
      if (opponentMoves[i - 1] === 'D' && myMoves[i - 1] === 'C') {
        conflicts++;
        if (myMoves[i] === 'C') forgiveness++;
      }
    }
    return conflicts > 0 ? forgiveness / conflicts : 0.5;
  }

  estimateMemoryDepth(myMoves, opponentMoves) {
    if (myMoves.length < 4) return 1;
    let match2 = 0;
    for (let i = 2; i < myMoves.length; i++) {
      if (myMoves[i] === opponentMoves[i - 2]) match2++;
    }
    if (match2 / (myMoves.length - 2) > 0.6) return 2;
    return 1;
  }

  detectProbeBehaviour(myMoves, opponentMoves) {
    if (myMoves.length < 4) return 0;
    if (myMoves[0] === 'D' && myMoves[1] === 'C') return 1.0;
    if (myMoves[0] === 'C' && myMoves[1] === 'D' && myMoves[2] === 'C') return 1.0;
    return 0.0;
  }

  calculateRandomnessLevel(myMoves, opponentMoves) {
    let switches = 0;
    for (let i = 1; i < myMoves.length; i++) {
      if (myMoves[i] !== myMoves[i - 1]) switches++;
    }
    const switchRate = switches / (myMoves.length - 1);
    return 1 - Math.abs(switchRate - 0.5) * 2;
  }

  detectAdaptationTrend(myMoves) {
    if (myMoves.length < 10) return 0;
    const first = myMoves.slice(0, 5).filter(m => m === 'C').length / 5;
    const last = myMoves.slice(-5).filter(m => m === 'C').length / 5;
    return last - first;
  }

  calculateConditionalProbs(myMoves, opponentMoves) {
    let coopAfterCoop = 0, coopSequences = 0;
    let defectAfterDefect = 0, defectSequences = 0;
    for (let i = 2; i < myMoves.length; i++) {
      if (opponentMoves[i - 2] === 'C' && opponentMoves[i - 1] === 'C') {
        coopSequences++;
        if (myMoves[i] === 'C') coopAfterCoop++;
      }
      if (opponentMoves[i - 2] === 'D' && opponentMoves[i - 1] === 'D') {
        defectSequences++;
        if (myMoves[i] === 'D') defectAfterDefect++;
      }
    }
    return {
      conditionalCooperation: coopSequences > 0 ? coopAfterCoop / coopSequences : 0.5,
      conditionalDefection: defectSequences > 0 ? defectAfterDefect / defectSequences : 0.5
    };
  }

  detectPunishmentEscalation(myMoves, opponentMoves) {
    let punishments = [];
    let currentPunishment = 0;
    let inPunishment = false;
    for (let i = 1; i < myMoves.length; i++) {
      if (opponentMoves[i - 1] === 'D' && myMoves[i] === 'D' && !inPunishment) {
        inPunishment = true;
        currentPunishment = 1;
      } else if (inPunishment) {
        if (myMoves[i] === 'D') {
          currentPunishment++;
        } else {
          inPunishment = false;
          punishments.push(currentPunishment);
        }
      }
    }
    if (punishments.length < 2) return 0;
    let escalation = 0;
    for (let i = 1; i < punishments.length; i++) {
      if (punishments[i] > punishments[i - 1]) escalation++;
    }
    return escalation / (punishments.length - 1);
  }

  calculateNoiseTolerance(myMoves, opponentMoves) {
    let forgives = 0, opportunities = 0;
    for (let i = 2; i < myMoves.length; i++) {
      if (opponentMoves[i - 2] === 'D' && opponentMoves[i - 1] === 'C') {
        opportunities++;
        if (myMoves[i] === 'C') forgives++;
      }
    }
    return opportunities > 0 ? forgives / opportunities : 0.5;
  }

  calculateStrategyDrift(myMoves) {
    if (myMoves.length < 10) return 0;
    const windowSize = Math.floor(myMoves.length / 3);
    const firstWindow = myMoves.slice(0, windowSize);
    const lastWindow = myMoves.slice(-windowSize);
    const firstCoop = firstWindow.filter(m => m === 'C').length / windowSize;
    const lastCoop = lastWindow.filter(m => m === 'C').length / windowSize;
    return lastCoop - firstCoop;
  }

  detectExploitBehaviour(myMoves, opponentMoves) {
    let exploitAttempts = 0, opportunities = 0;
    for (let i = 2; i < myMoves.length; i++) {
      if (opponentMoves[i - 2] === 'C' && opponentMoves[i - 1] === 'C') {
        opportunities++;
        if (myMoves[i] === 'D') exploitAttempts++;
      }
    }
    return opportunities > 0 ? exploitAttempts / opportunities : 0;
  }

  detectCyclePattern(myMoves) {
    if (myMoves.length < 4) return null;
    for (let i = 1; i < myMoves.length; i++) {
      if (myMoves[i] === myMoves[i - 1]) return 'random';
    }
    return 'alternating';
  }

  calculatePayoffResponse(myMoves, opponentMoves) {
    let changes = 0, total = 0;
    for (let i = 2; i < myMoves.length; i++) {
      const p1 = this.getPayoff(myMoves[i - 1], opponentMoves[i - 1]);
      const p2 = this.getPayoff(myMoves[i - 2], opponentMoves[i - 2]);
      if (p1 !== p2) {
        total++;
        if (myMoves[i] !== myMoves[i - 1]) changes++;
      }
    }
    return total > 0 ? changes / total : 0.5;
  }

  getPayoff(myMove, oppMove) {
    if (myMove === 'C' && oppMove === 'C') return 3;
    if (myMove === 'C' && oppMove === 'D') return 0;
    if (myMove === 'D' && oppMove === 'C') return 5;
    return 1;
  }

  detectOpponentModeling(myMoves, opponentMoves) {
    let predictionAccuracy = 0, attempts = 0;
    for (let i = 3; i < myMoves.length; i++) {
      const recentOpponent = opponentMoves.slice(i - 3, i);
      if (recentOpponent.every(m => m === 'C')) {
        attempts++;
        if (myMoves[i] === 'D') predictionAccuracy++;
      } else if (recentOpponent.every(m => m === 'D')) {
        attempts++;
        if (myMoves[i] === 'D') predictionAccuracy++;
      }
    }
    return attempts > 0 ? predictionAccuracy / attempts : 0.5;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = IPDStrategyAnalyzer;
}