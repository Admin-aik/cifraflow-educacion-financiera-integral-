import React, { useState, useEffect, useCallback } from 'react';
import {
  CharacterArchetype,
  DreamGoal,
  GameState,
  BoardTile,
  OpportunityCard,
  DoodadCard,
  MarketCard,
  Asset,
  Liability,
  StudentProfile,
  TeenAvatar,
  AppPhase,
  ScoreState,
  EducationalQuestion,
} from './types';
import {
  ARCHETYPES,
  DREAM_GOALS,
  RAT_RACE_TILES,
  FAST_TRACK_TILES,
  SMALL_DEALS,
  BIG_DEALS,
  FAST_TRACK_DEALS,
  DOODADS,
  MARKET_CARDS,
} from './data/gameData';
import { TEEN_AVATARS, LEARNING_MODULES } from './data/cifraFlowData';
import { Board3D } from './components/Board3D';
import { HUD } from './components/HUD';
import { FinancialSheetDrawer } from './components/FinancialSheetDrawer';
import { CardModal } from './components/CardModal';
import { AIMentorModal } from './components/AIMentorModal';
import { SetupModal } from './components/SetupModal';
import { VictoryModal } from './components/VictoryModal';
import { TopNavigationBar } from './components/TopNavigationBar';
import { RightSideHUD } from './components/RightSideHUD';
import { StudentLoginPhase0 } from './components/StudentLoginPhase0';
import { AvatarSelectionPhase1 } from './components/AvatarSelectionPhase1';
import { ModuleSelectionPhase2 } from './components/ModuleSelectionPhase2';
import { GameplayPhase3 } from './components/GameplayPhase3';
import { TransitionPhase4 } from './components/TransitionPhase4';
import { FinalEvaluationPhase5 } from './components/FinalEvaluationPhase5';
import { sound } from './utils/audio';
import { Trophy, ArrowLeft, Gamepad2 } from 'lucide-react';

export default function App() {
  // Convert tiles with 3D positions
  const innerTiles: BoardTile[] = RAT_RACE_TILES.map((t, idx) => {
    const angle = (idx / RAT_RACE_TILES.length) * Math.PI * 2;
    return {
      ...t,
      position: [Math.cos(angle) * 12, 0.2, Math.sin(angle) * 12],
    };
  });

  const outerTiles: BoardTile[] = FAST_TRACK_TILES.map((t, idx) => {
    const angle = (idx / FAST_TRACK_TILES.length) * Math.PI * 2;
    return {
      ...t,
      position: [Math.cos(angle) * 21, 1.2, Math.sin(angle) * 21],
    };
  });

  // Main Game State
  const [gameState, setGameState] = useState<GameState>(() => {
    const defaultArchetype = ARCHETYPES[0];
    const defaultDream = DREAM_GOALS[0];

    const initialLiabilities: Liability[] = [
      {
        id: 'liab_student',
        name: 'Préstamo Estudiantil',
        type: 'STUDENT_LOAN',
        principalBalance: defaultArchetype.startingLiabilities.studentLoan,
        monthlyPayment: defaultArchetype.startingExpenses.studentLoanPayment,
        canPayOff: true,
      },
      {
        id: 'liab_car',
        name: 'Préstamo de Vehículo / Movilidad',
        type: 'CAR_LOAN',
        principalBalance: defaultArchetype.startingLiabilities.carLoan,
        monthlyPayment: defaultArchetype.startingExpenses.carLoanPayment,
        canPayOff: true,
      },
      {
        id: 'liab_cc',
        name: 'Tarjeta de Crédito (Alto Interés)',
        type: 'CREDIT_CARD',
        principalBalance: defaultArchetype.startingLiabilities.creditCardDebt,
        monthlyPayment: defaultArchetype.startingExpenses.creditCardPayment,
        canPayOff: true,
      },
    ];

    const totalLoanExp = initialLiabilities.reduce((s, l) => s + l.monthlyPayment, 0);
    const totalExp =
      defaultArchetype.startingExpenses.taxes +
      defaultArchetype.startingExpenses.housing +
      defaultArchetype.startingExpenses.lifestyle +
      defaultArchetype.startingExpenses.otherExpenses +
      totalLoanExp;

    return {
      gameStarted: false,
      gameWon: false,
      turnCount: 1,
      currentTileIndex: 0,
      isOnFastTrack: false,
      selectedArchetype: defaultArchetype,
      selectedDream: defaultDream,
      financials: {
        cash: defaultArchetype.startingSavings,
        salary: defaultArchetype.startingSalary,
        passiveIncome: 0,
        totalIncome: defaultArchetype.startingSalary,
        taxes: defaultArchetype.startingExpenses.taxes,
        housing: defaultArchetype.startingExpenses.housing,
        lifestyle: defaultArchetype.startingExpenses.lifestyle,
        otherExpenses: defaultArchetype.startingExpenses.otherExpenses,
        childExpenses: 0,
        loanExpenses: totalLoanExp,
        totalExpenses: totalExp,
        monthlyCashflow: defaultArchetype.startingSalary - totalExp,
      },
      assets: [],
      liabilities: initialLiabilities,
      charityTurnsRemaining: 0,
      hasFastTrackAchieved: false,
      logs: [],
      isRolling: false,
      diceResult: [],
      activeModal: null,
      activeCardData: null,
    };
  });

  const [cameraMode, setCameraMode] = useState<'isometric' | 'topdown' | 'follow'>('isometric');
  const [isFinancialSheetOpen, setIsFinancialSheetOpen] = useState(false);
  const [isAIMentorOpen, setIsAIMentorOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showVictoryModal, setShowVictoryModal] = useState(true);

  // Educational Platform State (CIFRA FLOW FINANCIERO)
  const [currentPhase, setCurrentPhase] = useState<AppPhase>('PHASE_0_LOGIN');
  const [phaseHistory, setPhaseHistory] = useState<AppPhase[]>([]);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(() => {
    try {
      const saved = localStorage.getItem('cifraflow_student_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [selectedTeenAvatar, setSelectedTeenAvatar] = useState<TeenAvatar | null>(() => {
    try {
      const saved = localStorage.getItem('cifraflow_teen_avatar');
      return saved ? JSON.parse(saved) : TEEN_AVATARS[0];
    } catch {
      return TEEN_AVATARS[0];
    }
  });

  const [scoreState, setScoreState] = useState<ScoreState>({
    currentScore: 0,
    totalErrors: 0,
    totalHits: 0,
    moduleScores: {},
    challengeIndex: 0,
    streak: 0,
  });

  // Active challenges queue
  const [activeChallengesQueue, setActiveChallengesQueue] = useState<EducationalQuestion[]>(() => {
    return LEARNING_MODULES.flatMap((m) => m.challenges);
  });
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState<number>(0);

  // Transition data for Phase 4
  const [transitionData, setTransitionData] = useState<{
    completedTopic: string;
    pointsEarned: number;
    penalties: number;
    isLastChallenge: boolean;
  }>({
    completedTopic: '',
    pointsEarned: 0,
    penalties: 0,
    isLastChallenge: false,
  });

  // Accessibility Text Scale (0.85, 1.0, 1.15, 1.3)
  const [textScale, setTextScale] = useState<number>(1.0);

  // Navigation handlers
  const navigateToPhase = (phase: AppPhase) => {
    setPhaseHistory((prev) => [...prev, currentPhase]);
    setCurrentPhase(phase);
  };

  const navigateBack = () => {
    if (phaseHistory.length === 0) {
      if (currentPhase !== 'PHASE_0_LOGIN') {
        setCurrentPhase('PHASE_2_MODULE_SELECT');
      }
      return;
    }
    const prevPhase = phaseHistory[phaseHistory.length - 1];
    setPhaseHistory((prev) => prev.slice(0, prev.length - 1));
    setCurrentPhase(prevPhase);
  };

  const handleCompleteLogin = (profile: StudentProfile) => {
    setStudentProfile(profile);
    try {
      localStorage.setItem('cifraflow_student_profile', JSON.stringify(profile));
    } catch {}
    navigateToPhase('PHASE_1_AVATAR_SELECT');
  };

  const handleSelectTeenAvatar = (avatar: TeenAvatar) => {
    setSelectedTeenAvatar(avatar);
    try {
      localStorage.setItem('cifraflow_teen_avatar', JSON.stringify(avatar));
    } catch {}

    // Sync avatar into 3D simulator archetype
    const matchedArchetype =
      ARCHETYPES.find((a) => a.id.toLowerCase().includes(avatar.id.toLowerCase())) ||
      ARCHETYPES[0];
    if (matchedArchetype) {
      setGameState((prev) => ({
        ...prev,
        selectedArchetype: {
          ...matchedArchetype,
          name: `${avatar.name} (${avatar.title})`,
          startingSalary: avatar.startingStats.salary,
          startingSavings: avatar.startingStats.savings,
        },
      }));
    }
  };

  const handleStartCampaign = () => {
    const allChallenges = LEARNING_MODULES.flatMap((m) => m.challenges);
    setActiveChallengesQueue(allChallenges);
    setCurrentChallengeIndex(0);
    navigateToPhase('PHASE_3_GAMEPLAY');
  };

  const handleSelectModule = (moduleId: string) => {
    const mod = LEARNING_MODULES.find((m) => m.id === moduleId);
    if (mod && mod.challenges.length > 0) {
      setActiveChallengesQueue(mod.challenges);
      setCurrentChallengeIndex(0);
      navigateToPhase('PHASE_3_GAMEPLAY');
    }
  };

  const handleCorrectAnswer = (pointsEarned: number, errorsMade: number) => {
    const penalties = errorsMade * 35;
    const currentQ = activeChallengesQueue[currentChallengeIndex];
    const isLast = currentChallengeIndex >= activeChallengesQueue.length - 1;

    setScoreState((prev) => ({
      ...prev,
      currentScore: prev.currentScore + pointsEarned,
      totalHits: prev.totalHits + 1,
      streak: prev.streak + 1,
      moduleScores: {
        ...prev.moduleScores,
        [currentQ.moduleTitle]: (prev.moduleScores[currentQ.moduleTitle] || 0) + pointsEarned,
      },
    }));

    setTransitionData({
      completedTopic: currentQ.topic,
      pointsEarned: pointsEarned,
      penalties: penalties,
      isLastChallenge: isLast,
    });

    navigateToPhase('PHASE_4_TRANSITION');
  };

  const handleWrongAnswerPenalty = (penalty: number) => {
    // Penalty is negative (e.g. -35), score reduces and can stay negative
    setScoreState((prev) => ({
      ...prev,
      currentScore: prev.currentScore + penalty,
      totalErrors: prev.totalErrors + 1,
      streak: 0,
    }));
  };

  const handleProceedNextChallenge = () => {
    if (transitionData.isLastChallenge) {
      navigateToPhase('PHASE_5_FINAL_EVALUATION');
    } else {
      setCurrentChallengeIndex((prev) => prev + 1);
      navigateToPhase('PHASE_3_GAMEPLAY');
    }
  };

  const handleRestartAll = () => {
    setScoreState({
      currentScore: 0,
      totalErrors: 0,
      totalHits: 0,
      moduleScores: {},
      challengeIndex: 0,
      streak: 0,
    });
    setCurrentChallengeIndex(0);
    navigateToPhase('PHASE_2_MODULE_SELECT');
  };

  const handleOpen3DSimulator = () => {
    setGameState((prev) => ({ ...prev, gameStarted: true }));
    navigateToPhase('SIMULATOR_3D');
  };

  // Recalculate Player Financials helper
  const recalculateFinancials = useCallback(
    (
      currentFinancials: GameState['financials'],
      assetsList: Asset[],
      liabilitiesList: Liability[],
      salaryVal?: number
    ): GameState['financials'] => {
      const passiveInc = assetsList.reduce((sum, a) => sum + a.monthlyCashFlow, 0);
      const salary = salaryVal !== undefined ? salaryVal : currentFinancials.salary;
      const totalInc = salary + passiveInc;
      const totalLoanExp = liabilitiesList.reduce((sum, l) => sum + l.monthlyPayment, 0);
      const totalExp =
        currentFinancials.taxes +
        currentFinancials.housing +
        currentFinancials.lifestyle +
        currentFinancials.otherExpenses +
        currentFinancials.childExpenses +
        totalLoanExp;

      return {
        ...currentFinancials,
        salary,
        passiveIncome: passiveInc,
        totalIncome: totalInc,
        loanExpenses: totalLoanExp,
        totalExpenses: totalExp,
        monthlyCashflow: totalInc - totalExp,
      };
    },
    []
  );

  // Start game handler
  const handleStartGame = (archetype: CharacterArchetype, dream: DreamGoal) => {
    sound.playLevelUp();
    const initialLiabilities: Liability[] = [
      {
        id: 'liab_student',
        name: 'Préstamo Estudiantil',
        type: 'STUDENT_LOAN',
        principalBalance: archetype.startingLiabilities.studentLoan,
        monthlyPayment: archetype.startingExpenses.studentLoanPayment,
        canPayOff: true,
      },
      {
        id: 'liab_car',
        name: 'Préstamo de Vehículo / Movilidad',
        type: 'CAR_LOAN',
        principalBalance: archetype.startingLiabilities.carLoan,
        monthlyPayment: archetype.startingExpenses.carLoanPayment,
        canPayOff: true,
      },
      {
        id: 'liab_cc',
        name: 'Tarjeta de Crédito (Alto Interés)',
        type: 'CREDIT_CARD',
        principalBalance: archetype.startingLiabilities.creditCardDebt,
        monthlyPayment: archetype.startingExpenses.creditCardPayment,
        canPayOff: true,
      },
    ];

    const totalLoanExp = initialLiabilities.reduce((s, l) => s + l.monthlyPayment, 0);
    const totalExp =
      archetype.startingExpenses.taxes +
      archetype.startingExpenses.housing +
      archetype.startingExpenses.lifestyle +
      archetype.startingExpenses.otherExpenses +
      totalLoanExp;

    setGameState((prev) => ({
      ...prev,
      gameStarted: true,
      gameWon: false,
      turnCount: 1,
      currentTileIndex: 0,
      isOnFastTrack: false,
      selectedArchetype: archetype,
      selectedDream: dream,
      financials: {
        cash: archetype.startingSavings,
        salary: archetype.startingSalary,
        passiveIncome: 0,
        totalIncome: archetype.startingSalary,
        taxes: archetype.startingExpenses.taxes,
        housing: archetype.startingExpenses.housing,
        lifestyle: archetype.startingExpenses.lifestyle,
        otherExpenses: archetype.startingExpenses.otherExpenses,
        childExpenses: 0,
        loanExpenses: totalLoanExp,
        totalExpenses: totalExp,
        monthlyCashflow: archetype.startingSalary - totalExp,
      },
      assets: [],
      liabilities: initialLiabilities,
      charityTurnsRemaining: 0,
      hasFastTrackAchieved: false,
      logs: [
        {
          id: 'log_start',
          turn: 1,
          timestamp: new Date().toLocaleTimeString(),
          type: 'SYSTEM',
          title: 'Carrera Iniciada',
          details: `Jugando como ${archetype.title}. Objetivo: ¡Escapar de la Carrera de Ratas!`,
        },
      ],
      isRolling: false,
      diceResult: [],
      activeModal: null,
      activeCardData: null,
    }));
  };

  // Roll Dice & Move Pawn
  const handleRollDice = () => {
    if (gameState.isRolling || gameState.activeModal !== null) return;

    sound.playDiceRoll();
    setGameState((prev) => ({ ...prev, isRolling: true }));

    setTimeout(() => {
      // If charity is active, roll 2 dice, else 1
      const numDice = gameState.charityTurnsRemaining > 0 ? 2 : 1;
      const rolls: number[] = [];
      for (let i = 0; i < numDice; i++) {
        rolls.push(Math.floor(Math.random() * 6) + 1);
      }
      const totalRoll = rolls.reduce((a, b) => a + b, 0);

      const activeTiles = gameState.isOnFastTrack ? outerTiles : innerTiles;
      const prevIndex = gameState.currentTileIndex;
      const newIndex = (prevIndex + totalRoll) % activeTiles.length;

      // Check if passed Paycheck station
      const passedPaycheck = newIndex < prevIndex || newIndex === 0;
      let cashBonus = 0;
      if (passedPaycheck) {
        cashBonus = Math.max(0, gameState.financials.monthlyCashflow);
        sound.playCashChime();
      }

      setGameState((prev) => {
        const updatedCash = prev.financials.cash + cashBonus;
        const newCharityTurns = Math.max(0, prev.charityTurnsRemaining - 1);
        const landingTile = activeTiles[newIndex];

        return {
          ...prev,
          isRolling: false,
          diceResult: rolls,
          currentTileIndex: newIndex,
          turnCount: prev.turnCount + 1,
          charityTurnsRemaining: newCharityTurns,
          financials: {
            ...prev.financials,
            cash: updatedCash,
          },
        };
      });

      // Handle Landing Tile Event
      setTimeout(() => {
        const landingTile = (gameState.isOnFastTrack ? outerTiles : innerTiles)[newIndex];
        triggerTileAction(landingTile);
      }, 500);
    }, 700);
  };

  // Trigger Tile Action
  const triggerTileAction = (tile: BoardTile) => {
    sound.playStep();

    if (!gameState.isOnFastTrack) {
      // RAT RACE TILES
      switch (tile.type) {
        case 'PAYCHECK':
          sound.playCashChime();
          // Cash is already collected via pass/land logic
          break;
        case 'OPPORTUNITY_SMALL':
        case 'OPPORTUNITY_BIG':
          // Prompt user to pick Small or Big Deal
          setGameState((prev) => ({
            ...prev,
            activeModal: 'DEAL_CHOICE',
          }));
          break;
        case 'DOODAD':
          sound.playDoodadPenalty();
          const randomDoodad = DOODADS[Math.floor(Math.random() * DOODADS.length)];
          setGameState((prev) => ({
            ...prev,
            activeModal: 'DOODAD',
            activeCardData: randomDoodad,
          }));
          break;
        case 'MARKET':
          sound.playAssetAcquired();
          const randomMarket = MARKET_CARDS[Math.floor(Math.random() * MARKET_CARDS.length)];
          setGameState((prev) => ({
            ...prev,
            activeModal: 'MARKET',
            activeCardData: randomMarket,
          }));
          break;
        case 'SIDE_HUSTLE':
          sound.playCashChime();
          setGameState((prev) => ({
            ...prev,
            activeModal: 'SIDE_HUSTLE',
          }));
          break;
        case 'LIFESTYLE_INFLATION':
          setGameState((prev) => ({
            ...prev,
            activeModal: 'LIFESTYLE',
          }));
          break;
        case 'CHARITY':
          setGameState((prev) => ({
            ...prev,
            activeModal: 'CHARITY',
          }));
          break;
        default:
          break;
      }
    } else {
      // FAST TRACK TILES
      switch (tile.type) {
        case 'PAYCHECK':
          sound.playCashChime();
          // Fast Track Paycheck gives 100x monthly cashflow
          setGameState((prev) => {
            const ftPayout = Math.max(10000, prev.financials.monthlyCashflow * 50);
            return {
              ...prev,
              financials: {
                ...prev.financials,
                cash: prev.financials.cash + ftPayout,
              },
            };
          });
          break;
        case 'DREAM_GOAL':
          // Check if this matches selected dream or any dream
          if (tile.index === gameState.selectedDream.tileIndex) {
            if (gameState.financials.cash >= gameState.selectedDream.cost) {
              // VICTORY!
              sound.playLevelUp();
              setGameState((prev) => ({
                ...prev,
                gameWon: true,
                activeModal: 'VICTORY',
                winReason: `¡Caíste en tu meta soñada y compraste "${gameState.selectedDream.title}" por $${gameState.selectedDream.cost.toLocaleString()}!`,
              }));
            }
          }
          break;
        case 'MEGA_DEAL':
          sound.playAssetAcquired();
          const randomMega = FAST_TRACK_DEALS[Math.floor(Math.random() * FAST_TRACK_DEALS.length)];
          setGameState((prev) => ({
            ...prev,
            activeModal: 'OPPORTUNITY',
            activeCardData: randomMega,
          }));
          break;
        case 'FAST_CASH':
          sound.playCashChime();
          setGameState((prev) => ({
            ...prev,
            financials: {
              ...prev.financials,
              cash: prev.financials.cash + 65000,
            },
          }));
          break;
        case 'ANGEL_INVEST':
          sound.playAssetAcquired();
          // 50% chance of 4x return on $20,000 investment
          const success = Math.random() > 0.4;
          const payout = success ? 80000 : -20000;
          setGameState((prev) => ({
            ...prev,
            financials: {
              ...prev.financials,
              cash: Math.max(0, prev.financials.cash + payout),
            },
          }));
          break;
        case 'PHILANTHROPY':
          sound.playLevelUp();
          setGameState((prev) => {
            const updated = {
              ...prev.financials,
              passiveIncome: prev.financials.passiveIncome + 4000,
              totalIncome: prev.financials.totalIncome + 4000,
              monthlyCashflow: prev.financials.monthlyCashflow + 4000,
            };
            return {
              ...prev,
              financials: updated,
            };
          });
          break;
        case 'AUDIT':
          sound.playDoodadPenalty();
          setGameState((prev) => ({
            ...prev,
            financials: {
              ...prev.financials,
              cash: Math.round(prev.financials.cash * 0.9),
            },
          }));
          break;
        default:
          break;
      }
    }
  };

  // User selected Small or Big Deal tier
  const handleSelectDealType = (dealType: 'SMALL' | 'BIG') => {
    const deck = dealType === 'SMALL' ? SMALL_DEALS : BIG_DEALS;
    const randomDeal = deck[Math.floor(Math.random() * deck.length)];
    setGameState((prev) => ({
      ...prev,
      activeModal: 'OPPORTUNITY',
      activeCardData: randomDeal,
    }));
  };

  // Buy Opportunity
  const handleBuyOpportunity = (card: OpportunityCard, useLoan?: boolean) => {
    sound.playAssetAcquired();

    const newAsset: Asset = {
      id: `asset_${Date.now()}`,
      name: card.title,
      category: card.category,
      cost: card.cost,
      downPayment: card.downPayment,
      monthlyCashFlow: card.monthlyCashFlow,
      sharesOrUnits: card.sharesOrUnits,
      pricePerUnit: card.pricePerUnit,
      symbol: card.symbol,
      roiAnnualPercent: Math.round(((card.monthlyCashFlow * 12) / Math.max(1, card.downPayment)) * 100),
      educationalTip: card.richDadInsight,
    };

    setGameState((prev) => {
      let updatedCash = prev.financials.cash;
      let updatedLiabilities = [...prev.liabilities];

      if (useLoan) {
        const cashAvailable = Math.max(0, updatedCash);
        const cashUsed = Math.min(cashAvailable, card.downPayment);
        const loanNeeded = card.downPayment - cashUsed;
        const roundedLoan = Math.ceil(loanNeeded / 1000) * 1000;
        const monthlyInterest = Math.round(roundedLoan * 0.1);

        updatedCash -= cashUsed;
        updatedLiabilities.push({
          id: `liab_bank_${Date.now()}`,
          name: `Apalancamiento Bancario para ${card.title}`,
          type: 'BANK_LOAN',
          principalBalance: roundedLoan,
          monthlyPayment: monthlyInterest,
          canPayOff: true,
        });
      } else {
        updatedCash -= card.downPayment;
      }

      const updatedAssets = [...prev.assets, newAsset];
      const recalculated = recalculateFinancials(prev.financials, updatedAssets, updatedLiabilities);

      // Check if Fast Track win condition met via passive income
      let gameWon = prev.gameWon;
      let winReason = prev.winReason;
      if (prev.isOnFastTrack && recalculated.passiveIncome >= 50000) {
        gameWon = true;
        winReason = '¡Acumulaste más de $50,000/mes en flujo de caja pasivo puro en la Vía Rápida!';
      }

      return {
        ...prev,
        financials: {
          ...recalculated,
          cash: updatedCash,
        },
        assets: updatedAssets,
        liabilities: updatedLiabilities,
        activeModal: gameWon ? 'VICTORY' : null,
        activeCardData: null,
        gameWon,
        winReason,
      };
    });
  };

  // Pay Doodad
  const handlePayDoodad = (card: DoodadCard) => {
    setGameState((prev) => {
      let updatedCash = prev.financials.cash - card.cost;
      let updatedLiabilities = [...prev.liabilities];

      // If negative cash, automatically create emergency bank loan
      if (updatedCash < 0) {
        const deficit = Math.abs(updatedCash);
        const loanAmount = Math.ceil(deficit / 1000) * 1000;
        updatedCash += loanAmount;
        updatedLiabilities.push({
          id: `liab_emergency_${Date.now()}`,
          name: `Línea de Crédito de Emergencia (${card.title})`,
          type: 'BANK_LOAN',
          principalBalance: loanAmount,
          monthlyPayment: Math.round(loanAmount * 0.1),
          canPayOff: true,
        });
      }

      const recalculated = recalculateFinancials(prev.financials, prev.assets, updatedLiabilities);

      return {
        ...prev,
        financials: {
          ...recalculated,
          cash: updatedCash,
        },
        liabilities: updatedLiabilities,
        activeModal: null,
        activeCardData: null,
      };
    });
  };

  // Sell Asset in Market
  const handleSellAssetInMarket = (assetId: string, sellPrice: number) => {
    sound.playCashChime();
    setGameState((prev) => {
      const updatedAssets = prev.assets.filter((a) => a.id !== assetId);
      const recalculated = recalculateFinancials(prev.financials, updatedAssets, prev.liabilities);
      return {
        ...prev,
        assets: updatedAssets,
        financials: {
          ...recalculated,
          cash: prev.financials.cash + sellPrice,
        },
        activeModal: null,
        activeCardData: null,
      };
    });
  };

  // Accept Charity
  const handleAcceptCharity = () => {
    sound.playCashChime();
    setGameState((prev) => {
      const charityAmount = Math.round(prev.financials.cash * 0.1);
      return {
        ...prev,
        charityTurnsRemaining: 3,
        financials: {
          ...prev.financials,
          cash: prev.financials.cash - charityAmount,
        },
        activeModal: null,
      };
    });
  };

  // Collect Side Hustle
  const handleCollectSideHustle = (amount: number) => {
    sound.playCashChime();
    setGameState((prev) => ({
      ...prev,
      financials: {
        ...prev.financials,
        cash: prev.financials.cash + amount,
      },
      activeModal: null,
    }));
  };

  // Accept Lifestyle Inflation
  const handleAcceptLifestyle = (amount: number, title: string) => {
    sound.playDoodadPenalty();
    setGameState((prev) => {
      const updated = {
        ...prev.financials,
        lifestyle: prev.financials.lifestyle + amount,
      };
      const recalculated = recalculateFinancials(updated, prev.assets, prev.liabilities);
      return {
        ...prev,
        financials: recalculated,
        activeModal: null,
      };
    });
  };

  // Pay Off Liability
  const handlePayOffLiability = (liabilityId: string) => {
    const liab = gameState.liabilities.find((l) => l.id === liabilityId);
    if (!liab || gameState.financials.cash < liab.principalBalance) return;

    sound.playCashChime();
    setGameState((prev) => {
      const updatedLiabilities = prev.liabilities.filter((l) => l.id !== liabilityId);
      const recalculated = recalculateFinancials(prev.financials, prev.assets, updatedLiabilities);

      return {
        ...prev,
        financials: {
          ...recalculated,
          cash: prev.financials.cash - liab.principalBalance,
        },
        liabilities: updatedLiabilities,
      };
    });
  };

  // Take Bank Loan
  const handleTakeBankLoan = (amount: number) => {
    sound.playCashChime();
    const newLiab: Liability = {
      id: `liab_loan_${Date.now()}`,
      name: `Préstamo Personal Bancario ($${amount.toLocaleString()})`,
      type: 'BANK_LOAN',
      principalBalance: amount,
      monthlyPayment: Math.round(amount * 0.1),
      canPayOff: true,
    };

    setGameState((prev) => {
      const updatedLiabilities = [...prev.liabilities, newLiab];
      const recalculated = recalculateFinancials(prev.financials, prev.assets, updatedLiabilities);

      return {
        ...prev,
        financials: {
          ...recalculated,
          cash: prev.financials.cash + amount,
        },
        liabilities: updatedLiabilities,
      };
    });
  };

  // Promote to Fast Track
  const handlePromoteToFastTrack = () => {
    sound.playLevelUp();
    setGameState((prev) => {
      const fastTrackStartingCash = Math.max(50000, prev.financials.monthlyCashflow * 100);
      return {
        ...prev,
        isOnFastTrack: true,
        currentTileIndex: 0,
        hasFastTrackAchieved: true,
        financials: {
          ...prev.financials,
          cash: prev.financials.cash + fastTrackStartingCash,
        },
        activeModal: null,
      };
    });
  };

  // Pass card
  const handlePassCard = () => {
    setGameState((prev) => ({
      ...prev,
      activeModal: null,
      activeCardData: null,
    }));
  };

  // Toggle Mute
  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  // Reset Game
  const handleResetGame = () => {
    setGameState((prev) => ({ ...prev, gameStarted: false, gameWon: false }));
  };

  return (
    <div
      className="relative w-screen h-screen overflow-x-hidden overflow-y-auto bg-slate-950 text-slate-100 flex flex-col font-sans select-none"
      style={{ fontSize: `${textScale * 100}%` }}
    >
      {/* Universal Top Navigation Bar with Infinity Logo, BCV Rate, Accessibility Scale & Student Status */}
      <TopNavigationBar
        currentPhase={currentPhase}
        phaseHistory={phaseHistory}
        onNavigateBack={navigateBack}
        onNavigateToPhase={navigateToPhase}
        studentProfile={studentProfile}
        selectedAvatar={selectedTeenAvatar}
        textScale={textScale}
        setTextScale={setTextScale}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Universal Right-Side HUD (Right-HUD Panel) — shows cumulative score, negative numbers, avatar perk */}
      <RightSideHUD
        scoreState={scoreState}
        selectedAvatar={selectedTeenAvatar}
        currentLevelName={
          currentPhase === 'PHASE_3_GAMEPLAY'
            ? `Reto ${currentChallengeIndex + 1}/${activeChallengesQueue.length}`
            : currentPhase === 'SIMULATOR_3D'
            ? 'Simulador 3D'
            : undefined
        }
      />

      {/* Active Phase Content */}
      <div className="flex-1 w-full relative z-10 flex flex-col">
        {currentPhase === 'PHASE_0_LOGIN' && (
          <StudentLoginPhase0
            onCompleteLogin={handleCompleteLogin}
            initialProfile={studentProfile}
            textScale={textScale}
          />
        )}

        {currentPhase === 'PHASE_1_AVATAR_SELECT' && studentProfile && (
          <AvatarSelectionPhase1
            studentProfile={studentProfile}
            selectedAvatar={selectedTeenAvatar}
            onSelectAvatar={handleSelectTeenAvatar}
            onProceed={() => navigateToPhase('PHASE_2_MODULE_SELECT')}
            onBack={navigateBack}
            textScale={textScale}
          />
        )}

        {currentPhase === 'PHASE_2_MODULE_SELECT' && studentProfile && selectedTeenAvatar && (
          <ModuleSelectionPhase2
            studentProfile={studentProfile}
            selectedAvatar={selectedTeenAvatar}
            scoreState={scoreState}
            onSelectModule={handleSelectModule}
            onStartCampaign={handleStartCampaign}
            onOpen3DSimulator={handleOpen3DSimulator}
            textScale={textScale}
          />
        )}

        {currentPhase === 'PHASE_3_GAMEPLAY' && selectedTeenAvatar && studentProfile && (
          <GameplayPhase3
            question={activeChallengesQueue[currentChallengeIndex] || activeChallengesQueue[0]}
            challengeNumber={currentChallengeIndex + 1}
            totalChallenges={activeChallengesQueue.length}
            selectedAvatar={selectedTeenAvatar}
            studentProfile={studentProfile}
            onCorrectAnswer={handleCorrectAnswer}
            onWrongAnswerPenalty={handleWrongAnswerPenalty}
            onBackToModules={() => navigateToPhase('PHASE_2_MODULE_SELECT')}
            textScale={textScale}
          />
        )}

        {currentPhase === 'PHASE_4_TRANSITION' && selectedTeenAvatar && (
          <TransitionPhase4
            completedTopic={transitionData.completedTopic}
            pointsEarnedInReto={transitionData.pointsEarned}
            penaltiesInReto={transitionData.penalties}
            scoreState={scoreState}
            selectedAvatar={selectedTeenAvatar}
            isLastChallenge={transitionData.isLastChallenge}
            onProceedNext={handleProceedNextChallenge}
            textScale={textScale}
          />
        )}

        {currentPhase === 'PHASE_5_FINAL_EVALUATION' && studentProfile && selectedTeenAvatar && (
          <FinalEvaluationPhase5
            studentProfile={studentProfile}
            selectedAvatar={selectedTeenAvatar}
            scoreState={scoreState}
            onRestartAll={handleRestartAll}
            onOpen3DSimulator={handleOpen3DSimulator}
            textScale={textScale}
          />
        )}

        {currentPhase === 'SIMULATOR_3D' && (
          <div className="flex-1 w-full h-[calc(100vh-65px)] relative flex flex-col">
            {/* Top Bar inside 3D Simulator to easily return to pedagogical modules */}
            <div className="absolute top-3 left-4 z-30 flex items-center gap-2">
              <button
                onClick={() => {
                  sound.playClick();
                  navigateToPhase('PHASE_2_MODULE_SELECT');
                }}
                id="return-to-modules-from-3d-btn"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/95 hover:bg-slate-800 border border-cyan-400 text-cyan-300 hover:text-white font-mono text-xs font-bold shadow-xl transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>VOLVER A MISIONES FORMATIVAS</span>
              </button>
            </div>

            {/* HUD Header */}
            {gameState.gameStarted && (
              <div className="p-3 sm:p-4 z-20">
                <HUD
                  gameState={gameState}
                  onRollDice={handleRollDice}
                  onOpenFinancialSheet={() => setIsFinancialSheetOpen(true)}
                  onOpenAIMentor={() => setIsAIMentorOpen(true)}
                  onToggleMute={handleToggleMute}
                  isMuted={isMuted}
                  onResetGame={handleResetGame}
                  cameraMode={cameraMode}
                  setCameraMode={setCameraMode}
                />
              </div>
            )}

            {/* Main 3D Canvas Board */}
            <main className="flex-1 w-full h-full relative z-10">
              <Board3D
                innerTiles={innerTiles}
                outerTiles={outerTiles}
                playerIndex={gameState.currentTileIndex}
                isOnFastTrack={gameState.isOnFastTrack}
                archetype={gameState.selectedArchetype}
                isMoving={gameState.isRolling}
                diceValue={gameState.diceResult}
                isRolling={gameState.isRolling}
                onTileClick={(tile) => {
                  // Optional preview or inspection
                }}
                cameraMode={cameraMode}
              />
            </main>

            {/* Setup / Character Creation Modal */}
            {!gameState.gameStarted && <SetupModal onStartGame={handleStartGame} />}

            {/* Financial Statement & Balance Sheet Drawer */}
            <FinancialSheetDrawer
              isOpen={isFinancialSheetOpen}
              onClose={() => setIsFinancialSheetOpen(false)}
              gameState={gameState}
              onPayOffLiability={handlePayOffLiability}
              onTakeBankLoan={handleTakeBankLoan}
              onPromoteToFastTrack={handlePromoteToFastTrack}
            />

            {/* Card & Action Modals (Opportunity, Doodad, Market, etc.) */}
            <CardModal
              gameState={gameState}
              onSelectDealType={handleSelectDealType}
              onBuyOpportunity={handleBuyOpportunity}
              onPassCard={handlePassCard}
              onPayDoodad={handlePayDoodad}
              onSellAssetInMarket={handleSellAssetInMarket}
              onAcceptCharity={handleAcceptCharity}
              onCollectSideHustle={handleCollectSideHustle}
              onAcceptLifestyle={handleAcceptLifestyle}
              onBuyDreamGoal={() => {
                sound.playLevelUp();
                setShowVictoryModal(true);
                setGameState((prev) => ({
                  ...prev,
                  gameWon: true,
                  activeModal: 'VICTORY',
                }));
              }}
              onPromoteToFastTrack={handlePromoteToFastTrack}
            />

            {/* CyberKiyosaki AI Advisor Modal */}
            <AIMentorModal
              isOpen={isAIMentorOpen}
              onClose={() => setIsAIMentorOpen(false)}
              gameState={gameState}
            />

            {/* Victory Celebration Modal */}
            {gameState.gameWon && showVictoryModal && (
              <VictoryModal
                gameState={gameState}
                onRestart={handleResetGame}
                onClose={() => setShowVictoryModal(false)}
              />
            )}

            {/* Floating Victory Reopen Button if player closed the modal to inspect the board */}
            {gameState.gameWon && !showVictoryModal && (
              <div className="fixed bottom-6 right-6 z-40 animate-bounce">
                <button
                  onClick={() => setShowVictoryModal(true)}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 text-slate-950 font-mono font-extrabold text-xs shadow-2xl shadow-emerald-500/50 hover:scale-105 active:scale-95 transition-all"
                >
                  <Trophy className="w-4 h-4 text-slate-950" />
                  <span>VER RESUMEN DE VICTORIA</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
