'use client';

import { Sparkles, CheckCircle, XCircle, Trophy, RotateCcw } from 'lucide-react';
import { playSfx, vibrate } from '@/lib/sfx';

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
  /** Phase 4 : reset local pour rejouer (l'XP reste unique côté serveur) */
  onReplay?: () => void;
}

/** Étape quiz v2 — feedback immédiat par question : la bonne réponse devient
 *  verte et l'explication glisse dès qu'on répond, avant même la validation.
 *  Rejouable après complétion sans double XP (idempotence serveur).
 *  Contrats à préserver pour le smoke e2e :
 *  - un seul élément au texte exact « Quiz » (l'en-tête),
 *  - exactement une div.space-y-2 par question (locateur e2e),
 *  - bouton « Valider mes réponses ». */
export default function QuizStep({ quiz, answers, onAnswer, quizDone, showRewards, canValidate, onValidate, onReplay }: QuizStepProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4"><Sparkles className="w-5 h-5 world-accent" /><span className="font-bold world-accent">Quiz</span></div>
      {quiz.map((q, qi) => {
        const answered = answers[qi] !== undefined;
        return (
          <div key={qi} className="mb-6">
            <p className="font-semibold mb-3">{qi + 1}. {q.question}</p>
            <div className="space-y-2">
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
                      ? 'border-emerald-500 bg-emerald-500/20'
                      : showWrong
                        ? 'border-red-500 bg-red-500/20'
                        : 'border-white/10 hover:border-white/30'
                  }`}>
                    {opt}
                    {showCorrect && <CheckCircle className="w-4 h-4 inline text-emerald-400 ml-2" />}
                    {showWrong && <XCircle className="w-4 h-4 inline text-red-400 ml-2" />}
                  </button>
                );
              })}
            </div>
            {answered && q.explanation && (
              <p className="explanation-in mt-2 text-sm text-gray-400">💡 {q.explanation}</p>
            )}
          </div>
        );
      })}
      {showRewards && (
        <div className="flex items-center gap-2 text-emerald-400"><Trophy className="w-5 h-5" /><span>Récompenses ajoutées à ton profil !</span></div>
      )}
      {!quizDone ? (
        <button onClick={onValidate} disabled={!canValidate} className="px-6 py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 rounded-xl font-semibold transition-colors">
          Valider mes réponses
        </button>
      ) : (
        onReplay && (
          <button onClick={onReplay} className="mt-2 px-6 py-3 rounded-xl border border-white/15 text-gray-300 hover:border-white/35 font-semibold transition-colors flex items-center gap-2">
            <RotateCcw className="w-4 h-4" aria-hidden="true" /> Rejouer le quiz
          </button>
        )
      )}
    </div>
  );
}
