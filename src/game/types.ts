export interface BusType {
  id: string;
  name: string;
  desc: string;
  city: string;
  unlockCost: number;
  baseFare: number;
  baseCapacity: number;
  baseSpeed: number;
  basePopularity: number;
  baseLoadTime: number; // seconds to board all passengers at stop (level 0)
  color: string;
  roofColor: string;
  seatColor: string;
  length: number;
  height: number;
  icon: string;
}

export interface BusState {
  id: string;
  owned: boolean;
  fareLvl: number;
  capacityLvl: number;
  speedLvl: number;
  popularityLvl: number;
  loadLvl: number;
  stars: number;
  autoDispatch: boolean;
  // runtime
  position: number;
  direction: 'out' | 'back';
  passengers: number;
  waitingAtStop: number;
  onRoad: boolean;
  loading: boolean;
  loadTimer: number; // seconds remaining until boarding complete
  loadTimerMax: number; // total load time for this stop visit
}

export interface RouteType {
  id: string;
  name: string;
  city: string;
  desc: string;
  cost: number;
  earningsMul: number;
  unlockAt: number;
  icon: string;
  color: string;
}

export interface AchievementType {
  id: string;
  name: string;
  desc: string;
  icon: string;
  check: (ctx: AchievementCtx) => boolean;
}

export interface AchievementCtx {
  totalEarned: number;
  totalTrips: number;
  busesOwned: number;
  routesOwned: number;
  prestigeCount: number;
  playTime: number;
  quizCorrect: number;
  totalStars: number;
}

export interface PrestigeTrack {
  id: string;
  name: string;
  desc: string;
  icon: string;
  value: number;
  maxLevel: number;
}

export interface QuizQuestion {
  id: string;
  category: string;
  question: string;
  options: string[];
  answer: number;
}

export interface GameState {
  money: number;
  buses: Record<string, BusState>;
  routes: Record<string, boolean>;
  achievements: Record<string, boolean>;
  prestigePoints: number;
  prestige: Record<string, number>;
  totalEarned: number;
  totalTrips: number;
  prestigeCount: number;
  playTime: number;
  maxMoney: number;
  quizCorrect: number;
  currentQuiz: string | null;
  quizCooldown: number;
  lastSeen: number;
  offlineEarnings: number;
}

export const MAX_LEVELS = {
  fare: 20,
  capacity: 20,
  speed: 20,
  popularity: 20,
  load: 20,
};
