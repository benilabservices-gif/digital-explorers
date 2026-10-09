'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { Crown, Zap } from 'lucide-react';
import XpCounter from '@/components/rewards/XpCounter';
import LevelUpOverlay from '@/components/rewards/LevelUpOverlay';
import BadgeToast from '@/components/rewards/BadgeToast';
import QuestSummary from '@/components/rewards/QuestSummary';
import { Button, buttonVariants } from '@/components/ui/button';
import { celebrate } from '@/lib/celebrate';
import { cn } from '@/lib/utils';
import { TESTIDS } from '@/lib/testids';

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

/** Overlay de récompenses (confettis, compteur qui roule, toasts).
 *  Contrats e2e (testids) : `adventure.rewardsOverlay` (dialog modal), textes
 *  « 🎉 », « +N XP » (XpCounter y aboutit), « Quiz : x/y »,
 *  `adventure.overlayDashboard` (→ /dashboard), bouton « Continuer ».
 *  a11y : focus piégé au montage, Escape = Continuer. */
export default function RewardOverlay({ result, hasQuiz, onContinue }: RewardOverlayProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);

  // Fanfare de fin d'aventure + focus initial, une seule fois à l'apparition.
  useEffect(() => {
    if (!result.alreadyCompleted) celebrate('adventure');
    dialogRef.current?.focus();
    // result est figé tant que l'overlay est affiché : pas de re-déclenchement.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // a11y : Escape ferme l'overlay comme « Continuer ».
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onContinue();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onContinue]);

  return (
    <>
      {result.leveledUp && <LevelUpOverlay level={result.newLevel} />}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Récompenses de l'aventure"
        tabIndex={-1}
        data-testid={TESTIDS.adventure.rewardsOverlay}
        className="fixed inset-0 z-50 bg-night-950/80 flex items-center justify-center p-6 focus:outline-none"
      >
        <div className="scene-in bg-night-850 border border-gold-400/40 rounded-3xl p-8 max-w-sm w-full text-center">
          <div className="text-6xl mb-4" aria-hidden="true">🎉</div>
          {result.alreadyCompleted ? (
            <p className="text-ink-soft mb-4">Tu avais déjà terminé cette aventure — aucun XP supplémentaire.</p>
          ) : (
            <>
              {result.leveledUp && (
                <div className="mb-4 flex items-center justify-center gap-2 text-gold-400">
                  <Crown className="w-6 h-6" aria-hidden="true" /><span className="font-bold text-xl">Niveau {result.newLevel} atteint !</span>
                </div>
              )}
              <div className="mb-2 flex items-center justify-center gap-2 text-gold-300">
                <Zap className="w-5 h-5" aria-hidden="true" />
                <XpCounter value={result.xpAwarded} />
              </div>
              {hasQuiz && (
                <div className="mb-4 text-sm text-ink-soft">
                  Quiz : {result.quizScore}/{result.quizMax}
                </div>
              )}
              {result.newBadges.length > 0 && (
                <div className="mb-6">
                  <div className="text-sm text-ink-soft mb-2">Nouveaux badges :</div>
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
            <Link
              href="/dashboard"
              data-testid={TESTIDS.adventure.overlayDashboard}
              className={cn(buttonVariants(), 'flex-1')}
            >
              Dashboard
            </Link>
            <Button variant="secondary" onClick={onContinue} className="flex-1">
              Continuer
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
