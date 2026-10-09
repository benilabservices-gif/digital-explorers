'use client';

import { Sparkles, CheckCircle, XCircle, Trophy, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { playSfx, vibrate } from '@/lib/sfx';
import { TESTIDS } from '@/lib/testids';

export interface QuizQuestionData {
  question: string;
  options: string[];
  correct_index: number;
  explanation: string | null;
}

interface QuizStepProps {
  quiz: QuizQuestionData[];
  answers: Record<number, number>;
  onAnswer: (questionIndex: number, optionIndex: number) => void;
  quizDone: boolean;
  /** ligne « Récompenses ajoutées à ton profil ! » après complétion serveur */
  showRewards: boolean;
  canValidate: boolean;
  onValidate: () => void;
  /** reset local pour rejouer (l'XP reste unique côté serveur) */
  onReplay?: () => void;
}

/** Étape quiz — feedback immédiat par question : la bonne réponse devient
 *  verte et l'explication glisse dès qu'on répond, avant même la validation.
 *  Rejouable après complétion sans double XP (idempotence serveur).
 *  Contrats e2e (testids) : `adventure.quiz` (en-tête), un groupe
 *  `adventure.quizOption` par question, `adventure.validate`
 *  (« Valider mes réponses »), « Rejouer le quiz » (role button).
 *  a11y : explication annoncée via aria-live, icônes décoratives masquées. */
export default function QuizStep({ quiz, answers, onAnswer, quizDone, showRewards, canValidate, onValidate, onReplay }: QuizStepProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 world-accent" aria-hidden="true" />
        <span className="font-bold world-accent" data-testid={TESTIDS.adventure.quiz}>Quiz</span>
      </div>
      {quiz.map((q, qi) => {
        const answered = answers[qi] !== undefined;
        return (
          <div key={qi} className="mb-6">
            <p className="font-semibold mb-3">{qi + 1}. {q.question}</p>
            <div className="space-y-2" data-testid={TESTIDS.adventure.quizOption}>
              {q.options.map((opt, oi) => {
                const showCorrect = answered && oi === q.correct_index;
                const showWrong = answered && answers[qi] === oi && oi !== q.correct_index;
                return (
                  <button key={oi} onClick={() => {
                    if (quizDone) return;
                    if (oi === q.correct_index) { playSfx('correct'); vibrate(15); }
                    else { playSfx('wrong'); }
                    onAnswer(qi, oi);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                    showCorrect
                      ? 'border-success-500 bg-success-500/20'
                      : showWrong
                        ? 'border-danger-500 bg-danger-500/20'
                        : 'border-line hover:border-line-lit'
                  }`}>
                    {opt}
                    {showCorrect && <CheckCircle className="w-4 h-4 inline text-success-400 ml-2" aria-hidden="true" />}
                    {showWrong && <XCircle className="w-4 h-4 inline text-danger-400 ml-2" aria-hidden="true" />}
                  </button>
                );
              })}
            </div>
            {answered && q.explanation && (
              <p aria-live="polite" className="explanation-in mt-2 text-sm text-ink-soft">💡 {q.explanation}</p>
            )}
          </div>
        );
      })}
      {showRewards && (
        <div role="status" className="flex items-center gap-2 text-success-400">
          <Trophy className="w-5 h-5" aria-hidden="true" /><span>Récompenses ajoutées à ton profil !</span>
        </div>
      )}
      {!quizDone ? (
        <Button onClick={onValidate} disabled={!canValidate} data-testid={TESTIDS.adventure.validate}>
          Valider mes réponses
        </Button>
      ) : (
        onReplay && (
          <Button variant="secondary" onClick={onReplay} className="mt-2">
            <RotateCcw className="w-4 h-4" aria-hidden="true" /> Rejouer le quiz
          </Button>
        )
      )}
    </div>
  );
}
