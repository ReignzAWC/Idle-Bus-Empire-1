import { Icon } from './Icon';
import { PRESTIGE_TRACKS } from '@/game/data';
import { prestigePointsGained } from '@/game/engine';
import type { GameState } from '@/game/types';

export function PrestigeModal({
  state,
  onClose,
  onPrestige,
  onBuy,
}: {
  state: GameState;
  onClose: () => void;
  onPrestige: () => void;
  onBuy: (id: string) => void;
}) {
  const wouldGain = prestigePointsGained(state);
  const canPrestige = wouldGain > 0;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-royal-950/50 p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto border-2 border-gold-300">
        <div className="sticky top-0 bg-gradient-to-r from-royal-700 to-royal-900 text-white p-4 flex items-center gap-3 rounded-t-3xl">
          <Icon name="Sparkles" className="w-6 h-6 text-gold-300" />
          <div className="flex-1">
            <h2 className="font-display font-bold text-lg leading-none">Prestige</h2>
            <p className="text-xs opacity-70">Reset for permanent bonuses</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center hover:bg-white/30">
            <Icon name="X" className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* prestige action */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-royal-600 to-royal-800 text-white text-center">
            <div className="text-xs uppercase tracking-wide opacity-70">Prestige Points</div>
            <div className="font-mono font-bold text-3xl text-gold-300">{state.prestigePoints}</div>
            <div className="text-xs opacity-70 mt-2">
              Prestige count: {state.prestigeCount}
            </div>
            <div className="mt-3 bg-royal-800/60 rounded-xl p-3">
              <div className="text-xs">You would gain</div>
              <div className="font-mono font-bold text-2xl text-gold-300">+{wouldGain} PP</div>
            </div>
            <button
              onClick={onPrestige}
              disabled={!canPrestige}
              className={`mt-3 w-full py-2.5 rounded-xl font-display font-bold transition-all ${
                canPrestige
                  ? 'bg-gold-400 text-royal-900 hover:bg-gold-300 active:scale-95 shadow-md'
                  : 'bg-royal-800 text-royal-400 cursor-not-allowed'
              }`}
            >
              {canPrestige ? 'Prestige Now' : 'Need more earnings'}
            </button>
            <p className="text-[10px] opacity-60 mt-2">
              Resets money & buses. Keeps prestige levels, points, and achievements.
            </p>
          </div>

          {/* tracks */}
          <div className="space-y-2">
            {PRESTIGE_TRACKS.map((p) => {
              const level = state.prestige[p.id] ?? 0;
              const maxed = level >= p.maxLevel;
              const cost = level + 1;
              const canAfford = state.prestigePoints >= cost;
              return (
                <div
                  key={p.id}
                  className="flex items-center gap-3 p-3 rounded-2xl border-2 border-gold-200 bg-gold-50/50"
                >
                  <div className="w-10 h-10 rounded-xl bg-gold-400 flex items-center justify-center shrink-0">
                    <Icon name={p.icon} className="w-5 h-5 text-royal-800" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-royal-800 text-sm">{p.name}</span>
                      <span className="text-[10px] bg-gold-200 text-gold-800 rounded-full px-1.5 font-mono">
                        {level}/{p.maxLevel}
                      </span>
                    </div>
                    <p className="text-xs text-royal-500">{p.desc}</p>
                  </div>
                  <button
                    onClick={() => onBuy(p.id)}
                    disabled={maxed || !canAfford}
                    className={`shrink-0 rounded-lg px-3 py-1.5 font-mono font-bold text-xs transition-all min-w-[55px] ${
                      maxed
                        ? 'bg-emerald-100 text-emerald-600 cursor-default'
                        : canAfford
                        ? 'bg-royal-600 text-white hover:bg-royal-700 active:scale-95'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {maxed ? 'MAX' : `${cost} PP`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
