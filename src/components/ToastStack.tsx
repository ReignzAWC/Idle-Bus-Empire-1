import { Icon } from './Icon';
import type { Toast } from '@/game/useGame';

export function ToastStack({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: number) => void;
}) {
  return (
    <div className="fixed top-16 right-3 z-50 flex flex-col gap-2 w-72 max-w-[calc(100vw-1.5rem)]">
      {toasts.map((t) => {
        const styles =
          t.type === 'good'
            ? 'bg-emerald-600'
            : t.type === 'bad'
            ? 'bg-red-600'
            : t.type === 'achievement'
            ? 'bg-gold-500 text-royal-900'
            : 'bg-royal-700';
        return (
          <button
            key={t.id}
            onClick={() => onDismiss(t.id)}
            className={`animate-slide-in text-left text-white p-3 rounded-2xl shadow-xl flex items-start gap-3 ${styles}`}
          >
            <Icon name={t.icon} className="w-6 h-6 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="font-display font-bold text-sm">{t.title}</div>
              <div className="text-xs opacity-90">{t.desc}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
