'use client';

import { Zap, Target, Medal } from 'lucide-react';

interface QuestSummaryProps {
  totalXp: number;
  quizScore: number;
  quizMax: number;
  hasQuiz: boolean;
  badgeCount: number;
}

/** Récap de quête : trois stats côte à côte en bas de l'overlay.
 *  NB : la ligne canonique « +N XP » et « Quiz : x/y » reste portée par
 *  RewardOverlay/XpCounter — aucune duplication ici (strict mode e2e). */
export default function QuestSummary({ totalXp, quizScore, quizMax, hasQuiz, badgeCount }: QuestSummaryProps) {
  return (
    <div className="mb-6 grid grid-cols-3 gap-2" aria-label="Résumé de l’aventure">
      <div className="rounded-xl border border-white/10 bg-white/5 px-2 py-3 text-center">
        <Zap className="w-4 h-4 mx-auto mb-1 text-violet-300" aria-hidden="true" />
        <p className="text-sm font-bold text-white tabular-nums">{totalXp}</p>
        <p className="text-[11px] text-gray-400">XP au total</p>
      </div>
      {hasQuiz ? (
        <div className="rounded-xl border border-white/10 bg-white/5 px-2 py-3 text-center">
          <Target className="w-4 h-4 mx-auto mb-1 text-emerald-300" aria-hidden="true" />
          <p className="text-sm font-bold text-white tabular-nums">{quizScore}/{quizMax}</p>
          <p className="text-[11px] text-gray-400">au quiz</p>
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 bg-white/5 px-2 py-3 text-center">
          <Target className="w-4 h-4 mx-auto mb-1 text-gray-500" aria-hidden="true" />
          <p className="text-sm font-bold text-white">—</p>
          <p className="text-[11px] text-gray-400">sans quiz</p>
        </div>
      )}
      <div className="rounded-xl border border-white/10 bg-white/5 px-2 py-3 text-center">
        <Medal className="w-4 h-4 mx-auto mb-1 text-amber-300" aria-hidden="true" />
        <p className="text-sm font-bold text-white tabular-nums">+{badgeCount}</p>
        <p className="text-[11px] text-gray-400">badge{badgeCount > 1 ? 's' : ''}</p>
      </div>
    </div>
  );
}
