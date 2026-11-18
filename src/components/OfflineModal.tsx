import { Icon } from './Icon';
import { formatMoney, formatTime } from '@/game/format';

export function OfflineModal({
  earned,
  seconds,
  onClaim,
  onDismiss,
}: {
  earned: number;
  seconds: number;
  onClaim: () => void;
  onDismiss: () => void;
}) {
  if (earned <= 0) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-royal-950/50 p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 text-center border-2 border-gold-300">
        <div className="w-16 h-16 rounded-2xl bg-royal-600 mx-auto flex items-center justify-center mb-3 shadow-lg">
          <Icon name="Moon" className="w-8 h-8 text-gold-300" />
        </div>
        <h2 className="font-display text-xl font-bold text-royal-800">Welcome Back!</h2>
        <p className="text-sm text-royal-500 mt-1">
          Your buses ran for {formatTime(seconds)} while you were away.
        </p>
        <div className="my-4 py-4 bg-gold-50 rounded-2xl border border-gold-200">
          <div className="text-xs uppercase tracking-wide text-gold-700">Fares collected</div>
          <div className="font-mono font-bold text-3xl text-royal-700">{formatMoney(earned)}</div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onDismiss}
            className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition-colors"
          >
            Discard
          </button>
          <button
            onClick={onClaim}
            className="flex-1 py-2.5 rounded-xl bg-royal-600 text-white font-bold hover:bg-royal-700 active:scale-95 transition-all shadow-md"
          >
            Collect
          </button>
        </div>
      </div>
    </div>
  );
}
