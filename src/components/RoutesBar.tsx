import { Icon } from './Icon';
import { formatMoney, formatPercent } from '@/game/format';
import { ROUTE_TYPES } from '@/game/data';
import { globalMul } from '@/game/engine';
import type { GameState } from '@/game/types';

export function RoutesBar({
  state,
  onBuy,
}: {
  state: GameState;
  onBuy: (id: string) => void;
}) {
  const currentMul = globalMul(state);
  return (
    <div className="bg-royal-700 text-white rounded-2xl shadow-lg overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2 bg-royal-800">
        <Icon name="Map" className="w-4 h-4 text-gold-300" />
        <span className="font-display font-bold text-sm">Routes & Cities</span>
        <span className="ml-auto text-xs font-mono text-gold-300">
          Total bonus: ×{currentMul.toFixed(2)}
        </span>
      </div>
      <div className="flex gap-2 p-3 overflow-x-auto">
        {ROUTE_TYPES.map((r) => {
          const owned = state.routes[r.id];
          const unlocked = state.totalEarned >= r.unlockAt || owned;
          const canAfford = state.money >= r.cost;

          if (!unlocked) {
            return (
              <div
                key={r.id}
                className="shrink-0 w-36 rounded-xl bg-royal-800/60 border border-royal-600 p-2 text-center"
              >
                <Icon name="Lock" className="w-5 h-5 text-royal-400 mx-auto" />
                <div className="text-[10px] text-royal-300 mt-1">
                  Earn {formatMoney(r.unlockAt)}
                </div>
              </div>
            );
          }

          return (
            <button
              key={r.id}
              onClick={() => !owned && onBuy(r.id)}
              disabled={owned || !canAfford}
              className={`shrink-0 w-36 rounded-xl p-2 text-center transition-all border-2 ${
                owned
                  ? `${r.color} border-transparent cursor-default`
                  : canAfford
                  ? 'bg-royal-800 border-gold-400 hover:bg-royal-600 active:scale-95 cursor-pointer'
                  : 'bg-royal-800/60 border-royal-600 cursor-not-allowed'
              }`}
            >
              <Icon name={r.icon} className="w-5 h-5 text-white mx-auto" />
              <div className="font-display font-bold text-xs mt-1 text-white truncate">{r.name}</div>
              <div className="text-[10px] text-white/70 truncate">{r.city}</div>
              {owned ? (
                <div className="text-[10px] font-mono text-gold-200 mt-0.5">
                  Active ×{r.earningsMul.toFixed(2)}
                </div>
              ) : (
                <div className={`text-[10px] font-mono mt-0.5 ${canAfford ? 'text-gold-300' : 'text-royal-400'}`}>
                  {formatMoney(r.cost)} · +{formatPercent(r.earningsMul - 1)}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
