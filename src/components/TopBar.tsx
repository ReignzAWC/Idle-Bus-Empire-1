import { formatMoney, formatNumber } from '@/game/format';
import { autoEarningsPerSec, potentialEarningsPerSec, busesOwned } from '@/game/engine';
import type { GameState } from '@/game/types';
import { Icon } from './Icon';

export function TopBar({
  state,
  onPrestige,
  onAchievements,
}: {
  state: GameState;
  onPrestige: () => void;
  onAchievements: () => void;
}) {
  const auto = autoEarningsPerSec(state);
  const potential = potentialEarningsPerSec(state);
  const owned = busesOwned(state);

  return (
    <div className="sticky top-0 z-30 bg-royal-700 text-white shadow-lg border-b-2 border-gold-400">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-2.5 flex items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gold-400 flex items-center justify-center shadow-md">
            <Icon name="Bus" className="w-5 h-5 text-royal-800" />
          </div>
          <div className="hidden sm:block">
            <div className="font-display font-bold text-sm leading-none">Idle Bus</div>
            <div className="font-display font-bold text-sm leading-none text-gold-300">Empire</div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-end gap-2 sm:gap-3 flex-wrap">
          <Stat icon="Wallet" label="Balance" value={formatMoney(state.money)} highlight />
          <Stat icon="TrendingUp" label="Auto/s" value={formatMoney(auto)} />
          <Stat icon="Bus" label="Buses" value={formatNumber(owned)} />
          {potential > auto && (
            <Stat icon="Zap" label="If all auto" value={formatMoney(potential)} muted />
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onAchievements}
            className="w-9 h-9 rounded-xl bg-royal-800/60 hover:bg-royal-800 flex items-center justify-center transition-colors"
            title="Achievements"
          >
            <Icon name="Trophy" className="w-4 h-4 text-gold-300" />
          </button>
          <button
            onClick={onPrestige}
            className="w-9 h-9 rounded-xl bg-royal-800/60 hover:bg-royal-800 flex items-center justify-center transition-colors"
            title="Prestige"
          >
            <Icon name="Sparkles" className="w-4 h-4 text-gold-300" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  highlight,
  muted,
}: {
  icon: string;
  label: string;
  value: string;
  highlight?: boolean;
  muted?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-xl px-2.5 sm:px-3 py-1.5 ${
        highlight ? 'bg-gold-400 text-royal-900' : muted ? 'bg-royal-800/40' : 'bg-royal-800/60'
      }`}
    >
      <Icon name={icon} className="w-4 h-4 shrink-0" />
      <div className="leading-none">
        <div className="text-[10px] uppercase tracking-wide opacity-70">{label}</div>
        <div className="font-mono font-bold text-sm">{value}</div>
      </div>
    </div>
  );
}
