import { Icon } from './Icon';
import { formatMoney, formatNumber } from '@/game/format';
import { BUS_TYPES, upgradeCost, autoDispatchCost } from '@/game/data';
import { MAX_LEVELS } from '@/game/types';
import { busStats, costReduction, tripEarnings, getStarCost, isMaxed } from '@/game/engine';
import type { GameState, BusState } from '@/game/types';

interface Props {
  state: GameState;
  busId: string;
  onDispatch: (id: string) => void;
  onUnlock: (id: string) => void;
  onUpgrade: (id: string, stat: 'fare' | 'capacity' | 'speed' | 'popularity' | 'load') => void;
  onAutoDispatch: (id: string) => void;
  onBuyStar: (id: string) => void;
}

export function BusLane({ state, busId, onDispatch, onUnlock, onUpgrade, onAutoDispatch, onBuyStar }: Props) {
  const bt = BUS_TYPES.find((b) => b.id === busId)!;
  const bs = state.buses[busId];
  const idx = BUS_TYPES.findIndex((b) => b.id === busId);
  const stats = busStats(state, busId);
  const reduction = costReduction(state);

  if (!bs.owned) {
    const cost = Math.floor(bt.unlockCost * (1 - reduction));
    const canAfford = state.money >= cost;
    return (
      <div className="rounded-2xl bg-gray-100 border-2 border-gray-200 p-4 flex items-center gap-4">
        <div className="w-16 h-16 rounded-xl bg-gray-300 flex items-center justify-center shrink-0">
          <Icon name="Lock" className="w-7 h-7 text-gray-500" />
        </div>
        <div className="flex-1">
          <div className="font-display font-bold text-gray-600 text-lg">{bt.name}</div>
          <div className="text-xs text-gray-500">{bt.desc} · {bt.city}</div>
        </div>
        <button
          onClick={() => onUnlock(busId)}
          disabled={!canAfford}
          className={`px-4 py-2.5 rounded-xl font-mono font-bold text-sm transition-all ${
            canAfford ? 'bg-royal-600 text-white hover:bg-royal-700 active:scale-95 shadow-md' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {formatMoney(cost)}
        </button>
      </div>
    );
  }

  const fareCost = Math.floor(upgradeCost(idx, bt.baseFare, bs.fareLvl) * (1 - reduction));
  const capCost = Math.floor(upgradeCost(idx, bt.baseFare, bs.capacityLvl) * (1 - reduction));
  const spdCost = Math.floor(upgradeCost(idx, bt.baseFare, bs.speedLvl) * (1 - reduction));
  const popCost = Math.floor(upgradeCost(idx, bt.baseFare, bs.popularityLvl) * (1 - reduction));
  const loadCost = Math.floor(upgradeCost(idx, bt.baseFare, bs.loadLvl) * (1 - reduction));
  const autoCost = Math.floor(autoDispatchCost(idx, bt.baseFare) * (1 - reduction));
  const starCost = getStarCost(state, busId);
  const tripEarn = tripEarnings(state, busId);

  return (
    <div className="rounded-2xl bg-white border-2 border-royal-100 shadow-sm overflow-hidden">
      {/* Lane header with stars */}
      <div className="flex items-center gap-2 px-4 py-2 bg-royal-50 border-b border-royal-100">
        <Icon name={bt.icon} className="w-4 h-4 text-royal-600" />
        <span className="font-display font-bold text-royal-800 text-sm">{bt.name}</span>
        <span className="text-xs text-royal-400">{bt.city}</span>
        {/* depot stars */}
        <div className="flex items-center gap-0.5">
          {[0, 1, 2].map((s) => (
            <Icon
              key={s}
              name="Star"
              className={`w-3.5 h-3.5 ${s < bs.stars ? 'text-gold-500 fill-gold-500' : 'text-gray-300'}`}
            />
          ))}
        </div>
        <span className="text-xs text-royal-400 ml-auto font-mono">{formatMoney(tripEarn)}/trip</span>
      </div>

      {/* Road scene */}
      <div className="relative h-28 bg-gradient-to-b from-sky-100 to-green-100 overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-green-200" />
        <div className="absolute bottom-6 left-0 right-0 h-10 bg-gray-400">
          <div
            className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-0.5"
            style={{ backgroundImage: 'repeating-linear-gradient(90deg, #fff 0 20px, transparent 20px 40px)' }}
          />
        </div>

        {/* depot */}
        <div className="absolute bottom-12 left-2 flex flex-col items-center z-10">
          <div className="text-[9px] font-bold text-royal-600 bg-white/80 rounded px-1">DEPOT</div>
          <div className="w-8 h-8 bg-royal-600 rounded-t-lg border-2 border-royal-700 flex items-center justify-center">
            <Icon name="Warehouse" className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* bus stop */}
        <div className="absolute bottom-12 right-2 flex flex-col items-center z-10">
          <div className="text-[9px] font-bold text-royal-600 bg-white/80 rounded px-1">
            {Math.floor(bs.waitingAtStop)} waiting
          </div>
          <div className="flex items-end gap-0.5">
            <div className="w-10 h-8 bg-royal-300 rounded-t border-2 border-royal-500 flex items-end justify-center pb-0.5">
              <div className="flex gap-0.5 flex-wrap justify-center max-w-[32px]">
                {Array.from({ length: Math.min(Math.floor(stats.popularity), 12) }).map((_, i) => (
                  <span
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full ${i < Math.floor(bs.waitingAtStop) ? 'bg-royal-700' : 'bg-royal-200'}`}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="w-1 h-4 bg-gray-500" />
        </div>

        {/* the bus on road */}
        {bs.onRoad && (
          <div
            className="absolute z-20"
            style={{
              left: `calc(${bs.position * 100}% - ${bs.position * bt.length}px)`,
              bottom: '30px',
              transform: bs.direction === 'back' ? 'scaleX(-1)' : 'scaleX(1)',
            }}
          >
            <BusSprite busType={bt} passengers={bs.passengers} capacity={stats.capacity} />
            {/* loading indicator */}
            {bs.loading && (
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gold-400 text-royal-900 text-[9px] font-bold rounded-full px-2 py-0.5 whitespace-nowrap shadow-md flex flex-col items-center gap-0.5">
                <span>Boarding {bs.loadTimerMax > 0 ? bs.loadTimer.toFixed(1) : ''}s</span>
                {bs.loadTimerMax > 0 && (
                  <div className="w-16 h-1 bg-royal-200 rounded-full overflow-hidden">
                    <div className="h-full bg-royal-600 rounded-full" style={{ width: `${((bs.loadTimerMax - bs.loadTimer) / bs.loadTimerMax) * 100}%` }} />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* bus idle at depot */}
        {!bs.onRoad && (
          <div className="absolute z-20" style={{ left: '4px', bottom: '30px' }}>
            <BusSprite busType={bt} passengers={0} capacity={stats.capacity} idle />
          </div>
        )}
      </div>

      {/* Controls + upgrades */}
      <div className="p-3 space-y-2">
        {/* dispatch / auto */}
        <div className="flex gap-2">
          <button
            onClick={() => onDispatch(busId)}
            disabled={bs.onRoad}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl font-bold text-sm transition-all ${
              bs.onRoad
                ? 'bg-gray-100 text-gray-400 cursor-default'
                : bs.autoDispatch
                ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                : 'bg-gold-400 text-royal-900 hover:bg-gold-300 active:scale-95 shadow-md'
            }`}
          >
            {bs.onRoad ? (
              <>
                <Icon name="Loader" className="w-4 h-4 animate-spin" /> {bs.loading ? 'Boarding...' : 'On the road...'}
              </>
            ) : bs.autoDispatch ? (
              <>
                <Icon name="Bot" className="w-4 h-4" /> Auto-running
              </>
            ) : (
              <>
                <Icon name="Send" className="w-4 h-4" /> Dispatch
              </>
            )}
          </button>
          {!bs.autoDispatch && (
            <button
              onClick={() => onAutoDispatch(busId)}
              disabled={state.money < autoCost}
              className={`flex items-center gap-1 py-2 px-3 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${
                state.money >= autoCost ? 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Icon name="Bot" className="w-3.5 h-3.5" /> Auto <span className="font-mono">{formatMoney(autoCost)}</span>
            </button>
          )}
        </div>

        {/* upgrade grid — 5 stats with progress bars */}
        <div className="grid grid-cols-5 gap-1.5">
          <UpgradeBtn icon="Ticket" label="Fare" level={bs.fareLvl} maxLevel={MAX_LEVELS.fare} value={formatMoney(stats.fare)} cost={fareCost} canAfford={state.money >= fareCost} maxed={isMaxed('fare', bs.fareLvl)} onClick={() => onUpgrade(busId, 'fare')} />
          <UpgradeBtn icon="Users" label="Seats" level={bs.capacityLvl} maxLevel={MAX_LEVELS.capacity} value={`${stats.capacity}`} cost={capCost} canAfford={state.money >= capCost} maxed={isMaxed('capacity', bs.capacityLvl)} onClick={() => onUpgrade(busId, 'capacity')} />
          <UpgradeBtn icon="Gauge" label="Speed" level={bs.speedLvl} maxLevel={MAX_LEVELS.speed} value={`${(stats.speed * 100).toFixed(0)}%`} cost={spdCost} canAfford={state.money >= spdCost} maxed={isMaxed('speed', bs.speedLvl)} onClick={() => onUpgrade(busId, 'speed')} />
          <UpgradeBtn icon="Star" label="Popular" level={bs.popularityLvl} maxLevel={MAX_LEVELS.popularity} value={formatNumber(Math.floor(stats.popularity))} cost={popCost} canAfford={state.money >= popCost} maxed={isMaxed('popularity', bs.popularityLvl)} onClick={() => onUpgrade(busId, 'popularity')} />
          <UpgradeBtn icon="DoorOpen" label="Load" level={bs.loadLvl} maxLevel={MAX_LEVELS.load} value={`${stats.loadTime.toFixed(1)}s`} cost={loadCost} canAfford={state.money >= loadCost} maxed={isMaxed('load', bs.loadLvl)} onClick={() => onUpgrade(busId, 'load')} />
        </div>

        {/* depot star purchase */}
        {bs.stars < 3 && (
          <button
            onClick={() => onBuyStar(busId)}
            disabled={state.money < starCost}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl font-bold text-sm transition-all ${
              state.money >= starCost
                ? 'bg-gradient-to-r from-gold-400 to-gold-500 text-royal-900 hover:brightness-105 active:scale-95 shadow-md'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Icon name="Star" className={`w-4 h-4 ${state.money >= starCost ? 'text-royal-800 fill-royal-800' : ''}`} />
            Buy Depot Star ({bs.stars}/3)
            <span className="font-mono">{formatMoney(starCost)}</span>
            <span className="text-xs opacity-70">+50% earnings</span>
          </button>
        )}
        {bs.stars >= 3 && (
          <div className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-gold-100 text-gold-700 font-bold text-sm">
            <Icon name="Star" className="w-4 h-4 fill-gold-500 text-gold-500" />
            All 3 stars earned! Max depot.
          </div>
        )}
      </div>
    </div>
  );
}

function UpgradeBtn({
  icon,
  label,
  level,
  maxLevel,
  value,
  cost,
  canAfford,
  maxed,
  onClick,
}: {
  icon: string;
  label: string;
  level: number;
  maxLevel: number;
  value: string;
  cost: number;
  canAfford: boolean;
  maxed: boolean;
  onClick: () => void;
}) {
  const progress = (level / maxLevel) * 100;
  return (
    <button
      onClick={onClick}
      disabled={maxed || !canAfford}
      className={`flex flex-col items-center gap-0.5 py-1.5 px-1 rounded-lg border text-center transition-all ${
        maxed
          ? 'bg-emerald-50 border-emerald-300 cursor-default'
          : canAfford
          ? 'bg-white border-royal-200 hover:border-royal-400 hover:bg-royal-50 active:scale-95'
          : 'bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed'
      }`}
    >
      <Icon name={icon} className={`w-3.5 h-3.5 ${maxed ? 'text-emerald-500' : 'text-royal-500'}`} />
      <span className="text-[9px] font-bold text-royal-700">{label}</span>
      {/* progress bar */}
      <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${maxed ? 'bg-emerald-500' : 'bg-royal-500'}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-[9px] text-royal-400 font-mono">Lv{level}/{maxLevel}</span>
      <span className="text-[9px] text-royal-600 font-mono font-bold">{value}</span>
      {maxed ? (
        <span className="text-[9px] text-emerald-600 font-bold">MAX</span>
      ) : (
        <span className={`text-[9px] font-mono font-bold ${canAfford ? 'text-emerald-600' : 'text-gray-400'}`}>
          {formatMoney(cost)}
        </span>
      )}
    </button>
  );
}

function BusSprite({
  busType,
  passengers,
  capacity,
  idle,
}: {
  busType: typeof BUS_TYPES[number];
  passengers: number;
  capacity: number;
  idle?: boolean;
}) {
  const fillRatio = capacity > 0 ? passengers / capacity : 0;
  return (
    <div className={`relative ${idle ? 'animate-bus-bob' : ''}`} style={{ width: busType.length, height: busType.height }}>
      <div className={`absolute inset-0 ${busType.color} rounded-md shadow-lg`} />
      <div className={`absolute top-0 left-1 right-1 h-1.5 ${busType.roofColor} rounded-t-md`} />
      <div className="absolute top-2 left-1.5 right-1.5 flex gap-0.5 h-3">
        {Array.from({ length: Math.floor(busType.length / 16) }).map((_, i) => (
          <div key={i} className="flex-1 bg-sky-200 rounded-sm" />
        ))}
      </div>
      <div className="absolute bottom-2 left-1.5 right-1.5 h-1.5 bg-black/20 rounded-full overflow-hidden">
        <div className={`h-full ${busType.seatColor} transition-all duration-300`} style={{ width: `${fillRatio * 100}%` }} />
      </div>
      <div className="absolute -bottom-1 left-1 w-3 h-3 bg-gray-800 rounded-full border border-gray-900" />
      <div className="absolute -bottom-1 right-1 w-3 h-3 bg-gray-800 rounded-full border border-gray-900" />
      <div className="absolute top-1/2 -right-0.5 w-1 h-1.5 bg-gold-300 rounded-full" />
    </div>
  );
}
