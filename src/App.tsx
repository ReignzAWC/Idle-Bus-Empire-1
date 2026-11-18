import { useState } from 'react';
import { useGame } from '@/game/useGame';
import { TopBar } from '@/components/TopBar';
import { BusLane } from '@/components/BusLane';
import { RoutesBar } from '@/components/RoutesBar';
import { QuizPanel } from '@/components/QuizPanel';
import { ToastStack } from '@/components/ToastStack';
import { OfflineModal } from '@/components/OfflineModal';
import { PrestigeModal } from '@/components/PrestigeModal';
import { AchievementsModal } from '@/components/AchievementsModal';
import { Icon } from '@/components/Icon';
import { BUS_TYPES } from '@/game/data';

function App() {
  const game = useGame();
  const [showPrestige, setShowPrestige] = useState(false);
  const [showAch, setShowAch] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-royal-50">
      <TopBar
        state={game.state}
        onPrestige={() => setShowPrestige(true)}
        onAchievements={() => setShowAch(true)}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-4 py-4 pb-28">
        <div className="grid lg:grid-cols-[1fr_320px] gap-3">
          {/* Bus lanes — main column */}
          <div className="space-y-3 min-w-0">
            {BUS_TYPES.map((bt) => (
              <BusLane
                key={bt.id}
                state={game.state}
                busId={bt.id}
                onDispatch={game.dispatchBus}
                onUnlock={game.unlockBus}
                onUpgrade={game.buyUpgrade}
                onAutoDispatch={game.buyAutoDispatch}
                onBuyStar={game.buyStar}
              />
            ))}
          </div>

          {/* Side column — quiz + routes */}
          <div className="space-y-3 lg:sticky lg:top-20 self-start">
            <QuizPanel
              state={game.state}
              quizFeedback={game.quizFeedback}
              onStart={game.startQuiz}
              onAnswer={game.answerQuiz}
            />
            <RoutesBar state={game.state} onBuy={game.buyRoute} />
          </div>
        </div>

        {/* reset */}
        <div className="flex justify-center pt-4">
          {confirmReset ? (
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-red-50 border border-red-200">
              <span className="text-sm text-red-700 font-semibold">Erase all progress?</span>
              <button
                onClick={() => {
                  game.hardReset();
                  setConfirmReset(false);
                }}
                className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-sm font-bold hover:bg-red-700"
              >
                Yes, reset
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="px-3 py-1.5 rounded-lg bg-white text-royal-700 text-sm font-bold border border-royal-200"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmReset(true)}
              className="flex items-center gap-1.5 text-xs text-royal-400 hover:text-red-500 transition-colors"
            >
              <Icon name="RotateCcw" className="w-3.5 h-3.5" />
              Reset game
            </button>
          )}
        </div>
      </main>

      <ToastStack toasts={game.toasts} onDismiss={game.dismissToast} />

      {game.offlineReport && (
        <OfflineModal
          earned={game.offlineReport.earned}
          seconds={game.offlineReport.seconds}
          onClaim={game.claimOffline}
          onDismiss={game.dismissOffline}
        />
      )}

      {showPrestige && (
        <PrestigeModal
          state={game.state}
          onClose={() => setShowPrestige(false)}
          onPrestige={() => {
            game.doPrestige();
            setShowPrestige(false);
          }}
          onBuy={game.buyPrestige}
        />
      )}

      {showAch && <AchievementsModal state={game.state} onClose={() => setShowAch(false)} />}
    </div>
  );
}

export default App;
