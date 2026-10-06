'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { Crown, Zap } from 'lucide-react';
import XpCounter from '@/components/rewards/XpCounter';
import LevelUpOverlay from '@/components/rewards/LevelUpOverlay';
import BadgeToast from '@/components/rewards/BadgeToast';
import QuestSummary from '@/components/rewards/QuestSummary';
import { celebrate } from '@/lib/celebrate';

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

/** Overlay de récompenses (Phase 4 : confettis, compteur qui roule, toasts).
 *  Contrats e2e à préserver : div.fixed.inset-0 unique, textes « 🎉 »,
 *  « +N XP » (XpCounter y aboutit), « Quiz : x/y », boutons « Dashboard » /
 *  « Continuer ». */
export default function RewardOverlay({ result, hasQuiz, onContinue }: RewardOverlayProps) {
  // Fanfare de fin d'aventure une seule fois, à l'apparition de l'overlay.
  useEffect(() => {
    if (!result.alreadyCompleted) celebrate('adventure');
    // result est figé tant que l'overlay est affiché : pas de re-déclenchement.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {result.leveledUp && <LevelUpOverlay level={result.newLevel} />}
      <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6">
        <div className="scene-in bg-[#111827] border border-violet-500/30 rounded-3xl p-8 max-w-sm w-full text-center">
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
                <XpCounter value={result.xpAwarded} />
              </div>
              {hasQuiz && (
                <div className="mb-4 text-sm text-gray-400">
                  Quiz : {result.quizScore}/{result.quizMax}
                </div>
              )}
              {result.newBadges.length > 0 && (
                <div className="mb-6">
                  <div className="text-sm text-gray-400 mb-2">Nouveaux badges :</div>
                  <div className="flex justify-center gap-3 flex-wrap">
                    {result.newBadges.map((badge, index) => (
                      <BadgeToast
                        key={badge.slug}
                        badge={badge}
                        index={index}
                        total={result.newBadges.length}
                      />
                    ))}
                  </div>
                </div>
              )}
              <QuestSummary
                totalXp={result.newXp}
                quizScore={result.quizScore}
                quizMax={result.quizMax}
                hasQuiz={hasQuiz}
                badgeCount={result.newBadges.length}
              />
            </>
          )}
          <div className="flex gap-3">
            <Link href="/dashboard"><button className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 rounded-xl font-bold transition-colors">Dashboard</button></Link>
            <button onClick={onContinue} className="flex-1 py-3 bg-violet-600 hover:bg-violet-500 rounded-xl font-bold transition-colors">Continuer</button>
          </div>
        </div>
      </div>
    </>
  );
}
