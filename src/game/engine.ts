import { BUS_TYPES, ROUTE_TYPES, PRESTIGE_TRACKS, starCost } from './data';
import type { GameState, BusState } from './types';
import { MAX_LEVELS } from './types';

export function defaultBusState(id: string): BusState {
  return {
    id,
    owned: id === 'minibus',
    fareLvl: 0,
    capacityLvl: 0,
    speedLvl: 0,
    popularityLvl: 0,
    loadLvl: 0,
    stars: 0,
    autoDispatch: false,
    position: 0,
    direction: 'out',
    passengers: 0,
    waitingAtStop: 0,
    onRoad: false,
    loading: false,
    loadTimer: 0,
    loadTimerMax: 0,
  };
}

export function defaultState(): GameState {
  const buses: Record<string, BusState> = {};
  for (const b of BUS_TYPES) {
    buses[b.id] = defaultBusState(b.id);
  }
  return {
    money: 0,
    buses,
    routes: { r1: true },
    achievements: {},
    prestigePoints: 0,
    prestige: {},
    totalEarned: 0,
    totalTrips: 0,
    prestigeCount: 0,
    playTime: 0,
    maxMoney: 0,
    quizCorrect: 0,
    currentQuiz: null,
    quizCooldown: 0,
    lastSeen: Date.now(),
    offlineEarnings: 0,
  };
}

/** Load time: linearly scales from baseLoadTime at level 0 to 0 at max level */
export function loadTime(state: GameState, busId: string): number {
  const bus = BUS_TYPES.find((b) => b.id === busId)!;
  const bs = state.buses[busId];
  const max = MAX_LEVELS.load;
  // each level removes baseLoadTime/max seconds
  const removed = (bs.loadLvl / max) * bus.baseLoadTime;
  return Math.max(0, bus.baseLoadTime - removed);
}

/** Effective stats for a bus after upgrades + prestige + stars */
export function busStats(state: GameState, busId: string) {
  const bus = BUS_TYPES.find((b) => b.id === busId)!;
  const bs = state.buses[busId];
  const starMul = 1 + bs.stars * 0.5;
  const fare = bus.baseFare * (1 + bs.fareLvl * 0.5) * starMul;
  const capacity = bus.baseCapacity + bs.capacityLvl;
  let speed = bus.baseSpeed * (1 + bs.speedLvl * 0.1);
  const pSpeed = state.prestige['p_speed'] ?? 0;
  speed *= 1 + PRESTIGE_TRACKS.find((p) => p.id === 'p_speed')!.value * pSpeed;
  let popularity = bus.basePopularity * (1 + bs.popularityLvl * 0.2);
  const pPop = state.prestige['p_popular'] ?? 0;
  popularity *= 1 + PRESTIGE_TRACKS.find((p) => p.id === 'p_popular')!.value * pPop;
  const lt = loadTime(state, busId);
  return { fare, capacity, speed, popularity, loadTime: lt, starMul };
}

export function globalMul(state: GameState): number {
  let mul = 1;
  for (const r of ROUTE_TYPES) {
    if (state.routes[r.id]) mul *= r.earningsMul;
  }
  const pFare = state.prestige['p_fare'] ?? 0;
  mul *= 1 + PRESTIGE_TRACKS.find((p) => p.id === 'p_fare')!.value * pFare;
  return mul;
}

export function costReduction(state: GameState): number {
  const pCost = state.prestige['p_cost'] ?? 0;
  return PRESTIGE_TRACKS.find((p) => p.id === 'p_cost')!.value * pCost;
}

export function isMaxed(stat: keyof typeof MAX_LEVELS, level: number): boolean {
  return level >= MAX_LEVELS[stat];
}

/** Estimated earnings per second for a bus */
export function busEarningsPerSec(state: GameState, busId: string): number {
  const bs = state.buses[busId];
  if (!bs.owned) return 0;
  const { fare, capacity, speed, popularity, loadTime: lt } = busStats(state, busId);
  const passengers = Math.min(capacity, popularity);
  const travelTime = 2 / speed;
  const tripTime = travelTime + lt;
  const tripEarning = passengers * fare * globalMul(state);
  return tripEarning / tripTime;
}

export function autoEarningsPerSec(state: GameState): number {
  let total = 0;
  for (const b of BUS_TYPES) {
    if (state.buses[b.id].owned && state.buses[b.id].autoDispatch) {
      total += busEarningsPerSec(state, b.id);
    }
  }
  return total;
}

export function potentialEarningsPerSec(state: GameState): number {
  let total = 0;
  for (const b of BUS_TYPES) {
    if (state.buses[b.id].owned) {
      total += busEarningsPerSec(state, b.id);
    }
  }
  return total;
}

export function tripEarnings(state: GameState, busId: string): number {
  const bs = state.buses[busId];
  const { fare, capacity } = busStats(state, busId);
  const passengers = Math.min(capacity, bs.passengers);
  return passengers * fare * globalMul(state);
}

export function getStarCost(state: GameState, busId: string): number {
  const idx = BUS_TYPES.findIndex((b) => b.id === busId);
  const bt = BUS_TYPES[idx];
  const bs = state.buses[busId];
  return Math.floor(starCost(idx, bt.baseFare, bs.stars) * (1 - costReduction(state)));
}

export function totalStars(state: GameState): number {
  return Object.values(state.buses).reduce((a, b) => a + b.stars, 0);
}

export function busesOwned(state: GameState): number {
  return Object.values(state.buses).filter((b) => b.owned).length;
}

export function routesOwned(state: GameState): number {
  return Object.values(state.routes).filter(Boolean).length;
}

export function quizReward(state: GameState): number {
  let bestTrip = 0;
  for (const bt of BUS_TYPES) {
    const bs = state.buses[bt.id];
    if (!bs.owned) continue;
    const { fare, capacity } = busStats(state, bt.id);
    const passengers = Math.min(capacity, Math.floor(busStats(state, bt.id).popularity));
    const trip = passengers * fare * globalMul(state);
    if (trip > bestTrip) bestTrip = trip;
  }
  if (bestTrip === 0) bestTrip = 5;
  return Math.floor(bestTrip * 10);
}

export function prestigePointsGained(state: GameState): number {
  const raw = Math.sqrt(state.totalEarned / 10000);
  return Math.max(0, Math.floor(raw));
}

export function offlineMul(state: GameState): number {
  let mul = 0.5;
  const pOff = state.prestige['p_offline'] ?? 0;
  mul += PRESTIGE_TRACKS.find((p) => p.id === 'p_offline')!.value * pOff;
  return Math.min(1, mul);
}
