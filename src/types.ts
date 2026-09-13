export type TrackType = 'RAT_RACE' | 'FAST_TRACK';

export type TileType =
  | 'PAYCHECK'
  | 'OPPORTUNITY_SMALL'
  | 'OPPORTUNITY_BIG'
  | 'DOODAD'
  | 'MARKET'
  | 'SIDE_HUSTLE'
  | 'LIFESTYLE_INFLATION'
  | 'CHARITY'
  | 'DREAM_GOAL'
  | 'MEGA_DEAL'
  | 'FAST_CASH'
  | 'ANGEL_INVEST'
  | 'PHILANTHROPY'
  | 'AUDIT';

export interface BoardTile {
  id: number;
  track: TrackType;
  index: number;
  name: string;
  type: TileType;
  description: string;
  iconName: string;
  color: string;
  position: [number, number, number];
}

export interface CharacterArchetype {
  id: string;
  title: string;
  role: string;
  avatar: string;
  bio: string;
  startingSalary: number;
  startingSavings: number;
  startingExpenses: {
    taxes: number;
    housing: number;
    lifestyle: number;
    studentLoanPayment: number;
    carLoanPayment: number;
    creditCardPayment: number;
    otherExpenses: number;
  };
  startingLiabilities: {
    studentLoan: number;
    carLoan: number;
    creditCardDebt: number;
  };
  color: string;
}

export interface DreamGoal {
  id: string;
  title: string;
  description: string;
  cost: number;
  cashFlowRequirement: number;
  icon: string;
  tileIndex: number;
}

export type AssetCategory =
  | 'CRYPTO_NODE'
  | 'REAL_ESTATE'
  | 'DIGITAL_SAAS'
  | 'MICRO_FRANCHISE'
  | 'STOCKS_DIVIDENDS'
  | 'AUTOMATION_BIZ'
  | 'MEGA_CORP';

export interface Asset {
  id: string;
  name: string;
  category: AssetCategory;
  cost: number;
  downPayment: number;
  monthlyCashFlow: number;
  sharesOrUnits?: number;
  pricePerUnit?: number;
  symbol?: string;
  loanAmount?: number;
  roiAnnualPercent: number;
  educationalTip: string;
}

export interface Liability {
  id: string;
  name: string;
  type: 'STUDENT_LOAN' | 'CAR_LOAN' | 'CREDIT_CARD' | 'MORTGAGE' | 'LIFESTYLE_DEBT' | 'BANK_LOAN';
  principalBalance: number;
  monthlyPayment: number;
  canPayOff: boolean;
}

export interface OpportunityCard {
  id: string;
  dealType: 'SMALL' | 'BIG' | 'MEGA';
  title: string;
  description: string;
  category: AssetCategory;
  cost: number;
  downPayment: number;
  monthlyCashFlow: number;
  debtAllowed?: boolean;
  sharesOrUnits?: number;
  pricePerUnit?: number;
  symbol?: string;
  tradingRange?: string;
  richDadInsight: string;
}

export interface DoodadCard {
  id: string;
  title: string;
  cost: number;
  description: string;
  richDadInsight: string;
  canBorrow?: boolean;
}

export interface MarketCard {
  id: string;
  title: string;
  description: string;
  affectedCategory?: AssetCategory;
  stockSymbol?: string;
  newPricePerUnit?: number;
  cashOfferPerAsset?: number;
  multiplier?: number;
  richDadInsight: string;
}

export interface PlayerFinancials {
  cash: number;
  salary: number;
  passiveIncome: number;
  totalIncome: number;
  taxes: number;
  housing: number;
  lifestyle: number;
  otherExpenses: number;
  childExpenses: number;
  loanExpenses: number;
  totalExpenses: number;
  monthlyCashflow: number;
}

export interface TransactionLog {
  id: string;
  turn: number;
  timestamp: string;
  type: 'INCOME' | 'EXPENSE' | 'ASSET' | 'LIABILITY' | 'MARKET' | 'SYSTEM';
  title: string;
  amount?: number;
  details: string;
}

export interface StudentProfile {
  fullName: string;
  idNumber: string; // Formato V- / E-
  institution: string; // Liceo, Colegio o Universidad
  registeredAt?: string;
}

export interface TeenAvatar {
  id: string;
  name: string;
  stage: 'Adolescente';
  title: string;
  specialty: string;
  appearance: string;
  perkTitle: string;
  perkDescription: string;
  glowColor: string; // Fucsia '#ff007f', Cian '#00f3ff', Esmeralda '#34d399', Ámbar '#fbbf24'
  avatarIcon: string;
  badge: string;
  bonusEffect: string;
  imageUrl?: string;
  startingStats: {
    salary: number;
    savings: number;
    cashflowBonus: number;
  };
}

export interface EducationalOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface EducationalQuestion {
  id: string;
  moduleNumber: number;
  moduleTitle: string;
  topic: string;
  question: string;
  contextDocument?: string;
  options: EducationalOption[];
  pointsReward: number; // 100 a 150 pts
  penaltyAmount: number; // -25 a -50 pts
  richInsight: string;
}

export interface LearningModule {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  category: 'LECTURA' | 'BANCO' | 'EMPRENDIMIENTO' | 'BVC' | 'CIBERSEGURIDAD';
  description: string;
  iconName: string;
  color: string;
  badge: string;
  challenges: EducationalQuestion[];
}

export type AppPhase =
  | 'PHASE_0_LOGIN'
  | 'PHASE_1_AVATAR_SELECT'
  | 'PHASE_2_MODULE_SELECT'
  | 'PHASE_3_GAMEPLAY'
  | 'PHASE_4_TRANSITION'
  | 'PHASE_5_FINAL_EVALUATION'
  | 'SIMULATOR_3D';

export interface ScoreState {
  currentScore: number;
  totalErrors: number;
  totalHits: number;
  moduleScores: Record<string, number>;
  challengeIndex: number;
  streak: number;
}

export interface BCVRateData {
  rate: number;
  rateRaw?: number;
  euroRate?: number;
  euroRaw?: number;
  currency: string;
  source: string;
  valueDate: string;
  lastUpdated: string;
  success: boolean;
}

export interface GameState {
  gameStarted: boolean;
  gameWon: boolean;
  winReason?: string;
  turnCount: number;
  currentTileIndex: number;
  isOnFastTrack: boolean;
  selectedArchetype: CharacterArchetype;
  selectedDream: DreamGoal;
  financials: PlayerFinancials;
  assets: Asset[];
  liabilities: Liability[];
  charityTurnsRemaining: number;
  hasFastTrackAchieved: boolean;
  logs: TransactionLog[];
  isRolling: boolean;
  diceResult: number[];
  activeModal:
    | null
    | 'DEAL_CHOICE'
    | 'OPPORTUNITY'
    | 'DOODAD'
    | 'MARKET'
    | 'SIDE_HUSTLE'
    | 'LIFESTYLE'
    | 'CHARITY'
    | 'FAST_TRACK_PROMOTION'
    | 'VICTORY'
    | 'BANKRUPT_WARNING'
    | 'FINANCIAL_SHEET'
    | 'AI_MENTOR';
  activeCardData?: OpportunityCard | DoodadCard | MarketCard | any;
}
