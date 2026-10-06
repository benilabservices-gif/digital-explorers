'use client';

import { Sparkles, CheckCircle, XCircle, Trophy } from 'lucide-react';

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
}

/** Étape quiz — extraction à l'identique de l'ancien JSX inline de la page
 *  aventure. Contrats à préserver pour le smoke e2e :
 *  - un seul élément au texte exact « Quiz » (l'en-tête),
 *  - exactement une div.space-y-2 par question (locateur e2e),
 *  - bouton « Valider mes réponses ». */
export default function QuizStep({ quiz, answers, onAnswer, quizDone, showRewards, canValidate, onValidate }: QuizStepProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4"><Sparkles className="w-5 h-5 world-accent" /><span className="font-bold world-accent">Quiz</span></div>
      {quiz.map((q, qi) => (
        <div key={qi} className="mb-6">
          <p className="font-semibold mb-3">{qi + 1}. {q.question}</p>
          <div className="space-y-2">
            {q.options.map((opt, oi) => (
              <button key={oi} onClick={() => { if (!quizDone) onAnswer(qi, oi); }}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                  answers[qi] === oi ? 'border-violet-500 bg-violet-500/20' :
                  quizDone && oi === q.correct_index ? 'border-emerald-500 bg-emerald-500/20' :
                  quizDone && answers[qi] === oi && oi !== q.correct_index ? 'border-red-500 bg-red-500/20' :
                  'border-white/10 hover:border-white/30'
                }`}>
                {opt}
                {quizDone && oi === q.correct_index && <CheckCircle className="w-4 h-4 inline text-emerald-400 ml-2" />}
                {quizDone && answers[qi] === oi && oi !== q.correct_index && <XCircle className="w-4 h-4 inline text-red-400 ml-2" />}
              </button>
            ))}
          </div>
          {quizDone && q.explanation && (
            <p className="mt-2 text-sm text-gray-400">💡 {q.explanation}</p>
          )}
        </div>
      ))}
      {showRewards && (
        <div className="flex items-center gap-2 text-emerald-400"><Trophy className="w-5 h-5" /><span>Récompenses ajoutées à ton profil !</span></div>
      )}
      {!quizDone && (
        <button onClick={onValidate} disabled={!canValidate} className="px-6 py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 rounded-xl font-semibold transition-colors">
          Valider mes réponses
        </button>
      )}
    </div>
  );
}
