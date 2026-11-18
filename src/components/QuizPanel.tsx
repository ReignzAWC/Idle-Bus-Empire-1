import { Icon } from './Icon';
import { formatMoney } from '@/game/format';
import { QUIZ_QUESTIONS, QUIZ_COOLDOWN } from '@/game/data';
import { quizReward } from '@/game/engine';
import type { GameState } from '@/game/types';

interface Props {
  state: GameState;
  quizFeedback: { correct: boolean; reward: number } | null;
  onStart: () => void;
  onAnswer: (index: number) => void;
}

export function QuizPanel({ state, quizFeedback, onStart, onAnswer }: Props) {
  const question = QUIZ_QUESTIONS.find((q) => q.id === state.currentQuiz);
  const reward = quizReward(state);
  const onCooldown = state.quizCooldown > 0;
  const cooldownCeil = Math.ceil(state.quizCooldown);

  return (
    <div className="rounded-2xl bg-gradient-to-br from-royal-600 to-royal-800 text-white shadow-lg overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2 bg-royal-900/40">
        <Icon name="Brain" className="w-4 h-4 text-gold-300" />
        <span className="font-display font-bold text-sm">Bus & City Quiz</span>
        <span className="ml-auto text-xs text-gold-300 font-mono">
          Correct: {state.quizCorrect}
        </span>
      </div>

      <div className="p-4">
        {quizFeedback ? (
          // feedback state
          <div className={`text-center py-4 ${quizFeedback.correct ? 'animate-fade-in' : 'animate-shake'}`}>
            <Icon
              name={quizFeedback.correct ? 'CheckCircle' : 'XCircle'}
              className={`w-12 h-12 mx-auto ${quizFeedback.correct ? 'text-emerald-400' : 'text-red-400'}`}
            />
            <div className="font-display font-bold text-lg mt-2">
              {quizFeedback.correct ? 'Correct!' : 'Wrong!'}
            </div>
            {quizFeedback.correct && (
              <div className="font-mono text-gold-300 font-bold text-xl mt-1">
                +{formatMoney(quizFeedback.reward)}
              </div>
            )}
            <div className="text-xs opacity-70 mt-2">
              Next question in {QUIZ_COOLDOWN}s...
            </div>
          </div>
        ) : question ? (
          // question active
          <div className="animate-fade-in">
            <div className="text-xs text-gold-300 font-bold uppercase tracking-wide mb-1">
              {question.category}
            </div>
            <p className="font-display font-semibold text-sm mb-3">{question.question}</p>
            <div className="grid grid-cols-1 gap-2">
              {question.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => onAnswer(i)}
                  className="text-left px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-[0.98] transition-all font-medium text-sm border border-white/10 hover:border-gold-300"
                >
                  {opt}
                </button>
              ))}
            </div>
            <div className="text-xs text-gold-300 text-center mt-2 font-mono">
              Reward: {formatMoney(reward)}
            </div>
          </div>
        ) : onCooldown ? (
          // cooldown
          <div className="text-center py-4">
            <Icon name="Clock" className="w-10 h-10 mx-auto text-royal-300" />
            <div className="font-display font-bold text-lg mt-2">On Cooldown</div>
            <div className="text-sm opacity-70">Next quiz in {cooldownCeil}s</div>
            <div className="w-full h-2 bg-royal-900/40 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-gold-400 rounded-full transition-all"
                style={{ width: `${((QUIZ_COOLDOWN - state.quizCooldown) / QUIZ_COOLDOWN) * 100}%` }}
              />
            </div>
          </div>
        ) : (
          // ready to start
          <div className="text-center py-3">
            <Icon name="HelpCircle" className="w-10 h-10 mx-auto text-gold-300" />
            <div className="font-display font-bold text-base mt-2">Quiz Ready!</div>
            <p className="text-xs opacity-70 mb-3">
              Answer bus history & city trivia for a cash bonus.
            </p>
            <button
              onClick={onStart}
              className="px-6 py-2.5 rounded-xl bg-gold-400 text-royal-900 font-display font-bold hover:bg-gold-300 active:scale-95 transition-all shadow-md"
            >
              Start Quiz
            </button>
            <div className="text-xs text-gold-300 mt-2 font-mono">
              Reward: {formatMoney(reward)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
