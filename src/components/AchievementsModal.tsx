import { Icon } from './Icon';
import { ACHIEVEMENTS } from '@/game/data';
import { busesOwned, routesOwned, totalStars } from '@/game/engine';
import { formatMoney, formatTime } from '@/game/format';
import type { GameState } from '@/game/types';

export function AchievementsModal({
  state,
  onClose,
}: {
  state: GameState;
  onClose: () => void;
}) {
  const unlocked = Object.values(state.achievements).filter(Boolean).length;
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

  const statCards = [
    { icon: 'Coins', label: 'Total Earned', value: formatMoney(state.totalEarned) },
    { icon: 'Bus', label: 'Trips Done', value: state.totalTrips.toLocaleString() },
    { icon: 'BusFront', label: 'Buses Owned', value: `${busesOwned(state)}/8` },
    { icon: 'Map', label: 'Routes', value: `${routesOwned(state)}/7` },
    { icon: 'Star', label: 'Depot Stars', value: `${totalStars(state)}/24` },
    { icon: 'Sparkles', label: 'Prestiges', value: state.prestigeCount.toString() },
    { icon: 'Brain', label: 'Quiz Correct', value: state.quizCorrect.toString() },
    { icon: 'Wallet', label: 'Peak Balance', value: formatMoney(state.maxMoney) },
    { icon: 'Clock', label: 'Play Time', value: formatTime(state.playTime) },
  ];

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-royal-950/50 p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto border-2 border-royal-200">
        <div className="sticky top-0 bg-royal-700 text-white p-4 flex items-center gap-3 rounded-t-3xl">
          <Icon name="Trophy" className="w-6 h-6 text-gold-300" />
          <div className="flex-1">
            <h2 className="font-display font-bold text-lg leading-none">Achievements</h2>
            <p className="text-xs opacity-70">{unlocked}/{ACHIEVEMENTS.length} unlocked</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center hover:bg-white/30">
            <Icon name="X" className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {statCards.map((c) => (
              <div key={c.label} className="p-2.5 rounded-xl bg-royal-50 border border-royal-100">
                <Icon name={c.icon} className="w-4 h-4 text-royal-500 mb-1" />
                <div className="text-[10px] uppercase tracking-wide text-royal-400">{c.label}</div>
                <div className="font-mono font-bold text-royal-800 text-sm">{c.value}</div>
              </div>
            ))}
          </div>

          {/* list */}
          <div className="grid sm:grid-cols-2 gap-2">
            {ACHIEVEMENTS.map((a) => {
              const done = state.achievements[a.id];
              return (
                <div
                  key={a.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                    done ? 'bg-gold-50 border-gold-300' : 'bg-gray-50 border-gray-200 opacity-70'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${done ? 'bg-gold-400' : 'bg-gray-200'}`}>
                    <Icon name={done ? a.icon : 'Lock'} className={`w-4 h-4 ${done ? 'text-royal-800' : 'text-gray-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-bold text-royal-800 text-sm">{a.name}</div>
                    <div className="text-xs text-royal-400">{a.desc}</div>
                  </div>
                  {done && <Icon name="Check" className="w-4 h-4 text-emerald-600 shrink-0" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
