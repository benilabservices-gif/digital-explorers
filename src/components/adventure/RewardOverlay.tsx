'use client';

import Link from 'next/link';
import { Crown, Zap } from 'lucide-react';

/** Réponse de /api/adventures/complete (contrat inchangé). */
export interface RewardResult {
  alreadyCompleted: boolean;
  xpAwarded: number;
  quizScore: number;
  quizMax: number;
  newXp: number;
  newLevel: number;
  leveledUp: boolean;
  newBadges: { slug: string; name: string; icon: string }[];
}

interface RewardOverlayProps {
  result: RewardResult;
  hasQuiz: boolean;
  /** ferme l'overlay et retourne au dashboard (bouton « Continuer ») */
  onContinue: () => void;
}

/** Overlay de récompenses — extraction à l'identique de l'ancien JSX inline.
 *  Contrats e2e : div.fixed.inset-0 unique, textes « 🎉 », « +N XP »,
 *  « Quiz : x/y », boutons « Dashboard » / « Continuer ». */
export default function RewardOverlay({ result, hasQuiz, onContinue }: RewardOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6">
      <div className="bg-[#111827] border border-violet-500/30 rounded-3xl p-8 max-w-sm w-full text-center">
        <div className="text-6xl mb-4">🎉</div>
        {result.alreadyCompleted ? (
          <p className="text-gray-300 mb-4">Tu avais déjà terminé cette aventure — aucun XP supplémentaire.</p>
        ) : (
          <>
            {result.leveledUp && (
              <div className="mb-4 flex items-center justify-center gap-2 text-yellow-400">
                <Crown className="w-6 h-6" /><span className="font-bold text-xl">Niveau {result.newLevel} atteint !</span>
              </div>
            )}
            <div className="mb-2 flex items-center justify-center gap-2 text-violet-300">
              <Zap className="w-5 h-5" />
              <span className="font-bold text-lg">+{result.xpAwarded} XP</span>
            </div>
            {hasQuiz && (
              <div className="mb-4 text-sm text-gray-400">
                Quiz : {result.quizScore}/{result.quizMax}
              </div>
            )}
            {result.newBadges.length > 0 && (
              <div className="mb-6">
                <div className="text-sm text-gray-400 mb-2">Nouveaux badges :</div>
                <div className="flex justify-center gap-3">
                  {result.newBadges.map(b => (
                    <div key={b.slug} className="flex flex-col items-center">
                      <span className="text-3xl">{b.icon}</span>
                      <span className="text-xs text-gray-400 mt-1">{b.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
        <div className="flex gap-3">
          <Link href="/dashboard"><button className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 rounded-xl font-bold transition-colors">Dashboard</button></Link>
          <button onClick={onContinue} className="flex-1 py-3 bg-violet-600 hover:bg-violet-500 rounded-xl font-bold transition-colors">Continuer</button>
        </div>
      </div>
    </div>
  );
}
