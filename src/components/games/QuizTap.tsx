'use client';

import { useEffect, useState } from 'react';
import type { QuizTapConfig } from '@/data/interactives';
import { GameShell, WinBanner } from './GameShell';
import { playSfx, vibrate } from '@/lib/sfx';

const TIME_PER_STATEMENT = 12; // secondes par affirmation

/** Vrai ou faux contre la montre : une affirmation, un chrono, une explication. */
export default function QuizTap({ config }: { config: QuizTapConfig }) {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<boolean | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_STATEMENT);
  const [done, setDone] = useState(false);

  const statement = config.statements[index];

  // Chrono de l'affirmation courante (s'arrête dès qu'on répond).
  useEffect(() => {
    if (picked !== null || done) return;
    if (timeLeft <= 0) {
      setTimedOut(true);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, picked, done]);

  function answer(pick: boolean) {
    if (picked !== null || timedOut || !statement) return;
    setPicked(pick);
    if (pick === statement.answer) {
      setScore((s) => s + 1);
      playSfx('correct');
      vibrate(15);
    } else {
      playSfx('wrong');
    }
  }

  function nextStatement() {
    if (index + 1 >= config.statements.length) {
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
    setPicked(null);
    setTimedOut(false);
    setTimeLeft(TIME_PER_STATEMENT);
  }

  function replay() {
    setIndex(0);
    setScore(0);
    setPicked(null);
    setTimedOut(false);
    setTimeLeft(TIME_PER_STATEMENT);
    setDone(false);
  }

  if (done || !statement) {
    return (
      <GameShell title={config.title}>
        <WinBanner
          onReplay={replay}
          note={`Score : ${score}/${config.statements.length} affirmations justes.`}
        />
      </GameShell>
    );
  }

  const revealed = picked !== null || timedOut;
  const isCorrect = revealed && picked === statement.answer;

  return (
    <GameShell title={config.title} goal="Vrai ou faux ? Réponds avant la fin du chrono !">
      {/* Progression + chrono */}
      <div className="flex items-center justify-between text-sm text-ink-soft mb-1">
        <span>Affirmation {index + 1}/{config.statements.length}</span>
        <span className="tabular-nums">{revealed ? '—' : `${timeLeft}s`}</span>
      </div>
      <div className="h-1.5 rounded-full bg-night-600 overflow-hidden mb-5">
        <div
          className="h-full world-progress-fill rounded-full transition-all duration-1000 ease-linear"
          style={{ width: `${(timeLeft / TIME_PER_STATEMENT) * 100}%` }}
        />
      </div>

      {/* Affirmation */}
      <div className="rounded-2xl border border-line bg-night-900/60 p-5 mb-5">
        <p className="text-ink leading-relaxed font-medium">{statement.text}</p>
      </div>

      {/* Réponses */}
      {!revealed ? (
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => answer(true)}
            className="py-4 rounded-2xl border border-success-500/40 bg-success-500/10 text-success-300 font-bold text-lg transition-all hover:bg-success-500/20 active:scale-95"
          >
            VRAI
          </button>
          <button
            type="button"
            onClick={() => answer(false)}
            className="py-4 rounded-2xl border border-danger-500/40 bg-danger-500/10 text-danger-300 font-bold text-lg transition-all hover:bg-danger-500/20 active:scale-95"
          >
            FAUX
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div
            aria-live="polite"
            className={`rounded-2xl border p-4 ${
              isCorrect
                ? 'border-success-500/50 bg-success-500/10'
                : 'border-danger-500/50 bg-danger-500/10'
            }`}
          >
            <p className={`font-bold mb-1 ${isCorrect ? 'text-success-300' : 'text-danger-300'}`}>
              {isCorrect ? '✓ Juste !' : timedOut ? '⏰ Trop tard !' : '✗ Raté…'}
              {!isCorrect && ` La bonne réponse : ${statement.answer ? 'VRAI' : 'FAUX'}.`}
            </p>
            <p className="text-sm text-ink-soft leading-relaxed">{statement.why}</p>
          </div>
          <button
            type="button"
            onClick={nextStatement}
            className="px-6 py-2.5 rounded-full border world-border world-bg-soft world-accent font-semibold transition-all hover:opacity-80"
          >
            {index + 1 >= config.statements.length ? 'Voir mon score' : 'Affirmation suivante'}
          </button>
        </div>
      )}
    </GameShell>
  );
}
