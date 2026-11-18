import { useCallback, useEffect, useRef, useState } from 'react';
import {
  BUS_TYPES,
  ROUTE_TYPES,
  ACHIEVEMENTS,
  PRESTIGE_TRACKS,
  QUIZ_QUESTIONS,
  SAVE_KEY,
  TICK_MS,
  AUTO_SAVE_MS,
  OFFLINE_CAP_SECONDS,
  QUIZ_COOLDOWN,
  upgradeCost,
  autoDispatchCost,
} from './data';
import type { GameState, BusState } from './types';
import { MAX_LEVELS } from './types';
import {
  defaultState,
  defaultBusState,
  busStats,
  loadTime,
  tripEarnings,
  costReduction,
  busesOwned,
  routesOwned,
  totalStars,
  autoEarningsPerSec,
  offlineMul,
  prestigePointsGained,
  quizReward,
  getStarCost,
  isMaxed,
} from './engine';

function loadState(): { state: GameState; offlineEarned: number; offlineSeconds: number } {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return { state: defaultState(), offlineEarned: 0, offlineSeconds: 0 };
    const parsed = JSON.parse(raw) as Partial<GameState>;
    const base = defaultState();
    const buses: Record<string, BusState> = {};
    for (const b of BUS_TYPES) {
      buses[b.id] = parsed.buses?.[b.id]
        ? { ...defaultBusState(b.id), ...parsed.buses[b.id] }
        : defaultBusState(b.id);
    }
    const state: GameState = {
      ...base,
      ...parsed,
      buses,
      routes: { ...base.routes, ...parsed.routes },
      achievements: { ...parsed.achievements },
      prestige: { ...parsed.prestige },
      quizCorrect: parsed.quizCorrect ?? 0,
      currentQuiz: null,
      quizCooldown: parsed.quizCooldown ?? 0,
    };
    const now = Date.now();
    const elapsed = Math.min(OFFLINE_CAP_SECONDS, Math.max(0, (now - (state.lastSeen ?? now)) / 1000));
    const earned = Math.floor(autoEarningsPerSec(state) * elapsed * offlineMul(state));
    return { state, offlineEarned: earned, offlineSeconds: elapsed };
  } catch {
    return { state: defaultState(), offlineEarned: 0, offlineSeconds: 0 };
  }
}

function saveState(state: GameState) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({ ...state, lastSeen: Date.now() }));
  } catch {
    // ignore
  }
}

export interface Toast {
  id: number;
  title: string;
  desc: string;
  icon: string;
  type: 'good' | 'bad' | 'info' | 'achievement';
}

let toastId = 0;

export function useGame() {
  const initial = useRef(loadState());
  const [state, setState] = useState<GameState>(initial.current.state);
  const [offlineReport, setOfflineReport] = useState<{
    earned: number;
    seconds: number;
  } | null>(initial.current.offlineEarned > 0 ? { earned: initial.current.offlineEarned, seconds: initial.current.offlineSeconds } : null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [quizFeedback, setQuizFeedback] = useState<{ correct: boolean; reward: number } | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  const pushToast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 4500);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((x) => x.id !== id));
  }, []);

  // Main tick — bus animation, timer-based loading, auto earnings, quiz cooldown
  useEffect(() => {
    const interval = setInterval(() => {
      setState((prev) => {
        const dt = TICK_MS / 1000;
        let money = prev.money;
        let totalEarned = prev.totalEarned;
        let totalTrips = prev.totalTrips;
        let quizCooldown = prev.quizCooldown;
        let changed = false;
        const buses = { ...prev.buses };

        if (quizCooldown > 0) {
          quizCooldown = Math.max(0, quizCooldown - dt);
          changed = true;
        }

        for (const bt of BUS_TYPES) {
          const bs = buses[bt.id];
          if (!bs.owned) continue;
          let { position, direction, passengers, waitingAtStop, onRoad, loading, loadTimer, loadTimerMax } = bs;
          const stats = busStats(prev, bt.id);
          const { speed, popularity, capacity } = stats;
          const lt = loadTime(prev, bt.id);

          // Stop always refills to full — passengers are always waiting
          waitingAtStop = popularity;
          changed = true;

          if (onRoad) {
            changed = true;

            if (loading) {
              // Timer counts down; when it hits 0, boarding complete
              loadTimer -= dt;
              if (loadTimer <= 0) {
                // Done loading — board passengers
                const board = Math.min(Math.floor(waitingAtStop), capacity);
                passengers = board;
                waitingAtStop = Math.max(0, waitingAtStop - board);
                loading = false;
                direction = 'back';
              }
            } else {
              position += speed * dt * (direction === 'out' ? 1 : -1);

              if (direction === 'out' && position >= 1) {
                // Arrived at stop — start loading timer
                position = 1;
                loading = true;
                loadTimer = lt;
                loadTimerMax = lt;
              } else if (direction === 'back' && position <= 0) {
                // Arrived back at depot — earn fare
                position = 0;
                direction = 'out';
                onRoad = false;
                const earned = tripEarnings(prev, bt.id);
                money += earned;
                totalEarned += earned;
                totalTrips += 1;
                passengers = 0;
                if (bs.autoDispatch) {
                  onRoad = true;
                }
              }
            }
          }

          buses[bt.id] = {
            ...bs,
            position,
            direction,
            passengers,
            waitingAtStop,
            onRoad,
            loading,
            loadTimer,
            loadTimerMax,
          };
        }

        if (!changed && money === prev.money) return prev;

        return {
          ...prev,
          buses,
          money,
          totalEarned,
          totalTrips,
          quizCooldown,
          playTime: prev.playTime + dt,
          maxMoney: Math.max(prev.maxMoney, money),
        };
      });
    }, TICK_MS);
    return () => clearInterval(interval);
  }, []);

  // Autosave
  useEffect(() => {
    const interval = setInterval(() => saveState(stateRef.current), AUTO_SAVE_MS);
    const handler = () => saveState(stateRef.current);
    window.addEventListener('beforeunload', handler);
    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handler);
      saveState(stateRef.current);
    };
  }, []);

  // Achievement checker
  useEffect(() => {
    const ctx = {
      totalEarned: state.totalEarned,
      totalTrips: state.totalTrips,
      busesOwned: busesOwned(state),
      routesOwned: routesOwned(state),
      prestigeCount: state.prestigeCount,
      playTime: state.playTime,
      quizCorrect: state.quizCorrect,
      totalStars: totalStars(state),
    };
    let changed = false;
    const ach = { ...state.achievements };
    for (const a of ACHIEVEMENTS) {
      if (!ach[a.id] && a.check(ctx)) {
        ach[a.id] = true;
        changed = true;
        pushToast({ title: 'Achievement!', desc: a.name, icon: a.icon, type: 'achievement' });
      }
    }
    if (changed) setState((p) => ({ ...p, achievements: ach }));
  }, [state.totalEarned, state.totalTrips, state.buses, state.routes, state.prestigeCount, state.playTime, state.quizCorrect, pushToast]);

  // Actions
  const dispatchBus = useCallback((busId: string) => {
    setState((prev) => {
      const bs = prev.buses[busId];
      if (!bs.owned || bs.onRoad) return prev;
      return {
        ...prev,
        buses: { ...prev.buses, [busId]: { ...bs, onRoad: true, direction: 'out', loading: false } },
      };
    });
  }, []);

  const unlockBus = useCallback((busId: string) => {
    setState((prev) => {
      const bt = BUS_TYPES.find((b) => b.id === busId)!;
      const cost = Math.floor(bt.unlockCost * (1 - costReduction(prev)));
      if (prev.money < cost) return prev;
      pushToast({ title: 'New Bus!', desc: `${bt.name} added to your fleet.`, icon: bt.icon, type: 'good' });
      return {
        ...prev,
        money: prev.money - cost,
        buses: { ...prev.buses, [busId]: { ...prev.buses[busId], owned: true } },
      };
    });
  }, [pushToast]);

  const buyUpgrade = useCallback((busId: string, stat: 'fare' | 'capacity' | 'speed' | 'popularity' | 'load') => {
    setState((prev) => {
      const bs = prev.buses[busId];
      if (!bs.owned) return prev;
      const level = bs[`${stat}Lvl` as keyof BusState] as number;
      if (isMaxed(stat, level)) return prev;
      const idx = BUS_TYPES.findIndex((b) => b.id === busId);
      const cost = Math.floor(upgradeCost(idx, BUS_TYPES[idx].baseFare, level) * (1 - costReduction(prev)));
      if (prev.money < cost) return prev;
      const key = `${stat}Lvl` as keyof BusState;
      return {
        ...prev,
        money: prev.money - cost,
        buses: { ...prev.buses, [busId]: { ...bs, [key]: level + 1 } },
      };
    });
  }, []);

  const buyAutoDispatch = useCallback((busId: string) => {
    setState((prev) => {
      const bs = prev.buses[busId];
      if (!bs.owned || bs.autoDispatch) return prev;
      const idx = BUS_TYPES.findIndex((b) => b.id === busId);
      const cost = Math.floor(autoDispatchCost(idx, BUS_TYPES[idx].baseFare) * (1 - costReduction(prev)));
      if (prev.money < cost) return prev;
      pushToast({ title: 'Auto-Dispatch!', desc: `${BUS_TYPES[idx].name} now runs automatically.`, icon: 'Bot', type: 'good' });
      return {
        ...prev,
        money: prev.money - cost,
        buses: { ...prev.buses, [busId]: { ...bs, autoDispatch: true } },
      };
    });
  }, [pushToast]);

  const buyStar = useCallback((busId: string) => {
    setState((prev) => {
      const bs = prev.buses[busId];
      if (!bs.owned || bs.stars >= 3) return prev;
      const cost = getStarCost(prev, busId);
      if (prev.money < cost) return prev;
      pushToast({ title: 'Depot Star!', desc: `${BUS_TYPES.find((b) => b.id === busId)!.name} depot earned a star!`, icon: 'Star', type: 'achievement' });
      return {
        ...prev,
        money: prev.money - cost,
        buses: { ...prev.buses, [busId]: { ...bs, stars: bs.stars + 1 } },
      };
    });
  }, [pushToast]);

  const buyRoute = useCallback((routeId: string) => {
    setState((prev) => {
      const r = ROUTE_TYPES.find((x) => x.id === routeId)!;
      if (prev.routes[routeId]) return prev;
      if (prev.money < r.cost) return prev;
      pushToast({ title: 'Route Unlocked!', desc: `${r.name} — ${r.city}`, icon: r.icon, type: 'good' });
      return {
        ...prev,
        money: prev.money - r.cost,
        routes: { ...prev.routes, [routeId]: true },
      };
    });
  }, [pushToast]);

  const startQuiz = useCallback(() => {
    setState((prev) => {
      if (prev.quizCooldown > 0 || prev.currentQuiz) return prev;
      const q = QUIZ_QUESTIONS[Math.floor(Math.random() * QUIZ_QUESTIONS.length)];
      return { ...prev, currentQuiz: q.id };
    });
  }, []);

  const answerQuiz = useCallback((answerIndex: number) => {
    setState((prev) => {
      if (!prev.currentQuiz) return prev;
      const q = QUIZ_QUESTIONS.find((x) => x.id === prev.currentQuiz);
      if (!q) return prev;
      const correct = answerIndex === q.answer;
      let money = prev.money;
      let totalEarned = prev.totalEarned;
      let quizCorrect = prev.quizCorrect;
      let reward = 0;
      if (correct) {
        reward = quizReward(prev);
        money += reward;
        totalEarned += reward;
        quizCorrect += 1;
      }
      setQuizFeedback({ correct, reward });
      setTimeout(() => setQuizFeedback(null), 2500);
      return {
        ...prev,
        currentQuiz: null,
        quizCooldown: QUIZ_COOLDOWN,
        money,
        totalEarned,
        quizCorrect,
        maxMoney: Math.max(prev.maxMoney, money),
      };
    });
  }, []);

  const buyPrestige = useCallback((trackId: string) => {
    setState((prev) => {
      const track = PRESTIGE_TRACKS.find((p) => p.id === trackId)!;
      const level = prev.prestige[trackId] ?? 0;
      if (level >= track.maxLevel) return prev;
      const cost = level + 1;
      if (prev.prestigePoints < cost) return prev;
      return {
        ...prev,
        prestigePoints: prev.prestigePoints - cost,
        prestige: { ...prev.prestige, [trackId]: level + 1 },
      };
    });
  }, []);

  const doPrestige = useCallback(() => {
    setState((prev) => {
      const gained = prestigePointsGained(prev);
      if (gained <= 0) return prev;
      const fresh = defaultState();
      return {
        ...fresh,
        prestigePoints: prev.prestigePoints + gained,
        prestige: prev.prestige,
        achievements: prev.achievements,
        prestigeCount: prev.prestigeCount + 1,
        playTime: prev.playTime,
        quizCorrect: prev.quizCorrect,
      };
    });
    pushToast({ title: 'Company Reborn!', desc: 'You gained prestige points.', icon: 'Sparkles', type: 'achievement' });
  }, [pushToast]);

  const hardReset = useCallback(() => {
    const fresh = defaultState();
    setState(fresh);
    saveState(fresh);
  }, []);

  const claimOffline = useCallback(() => {
    setState((prev) => ({
      ...prev,
      money: prev.money + (offlineReport?.earned ?? 0),
      totalEarned: prev.totalEarned + (offlineReport?.earned ?? 0),
    }));
    setOfflineReport(null);
  }, [offlineReport]);

  const dismissOffline = useCallback(() => setOfflineReport(null), []);

  return {
    state,
    toasts,
    offlineReport,
    quizFeedback,
    claimOffline,
    dismissOffline,
    dismissToast,
    dispatchBus,
    unlockBus,
    buyUpgrade,
    buyAutoDispatch,
    buyStar,
    buyRoute,
    startQuiz,
    answerQuiz,
    buyPrestige,
    doPrestige,
    hardReset,
  };
}

export { MAX_LEVELS };
