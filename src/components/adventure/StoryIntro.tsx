'use client';

import { useEffect, useRef } from 'react';
import { Play, FastForward } from 'lucide-react';
import type { WorldGuide } from '@/data/world-themes';
import { Button } from '@/components/ui/button';
import { playSfx } from '@/lib/sfx';
import { TESTIDS } from '@/lib/testids';

/** Ouverture cinématique de l'aventure : le guide raconte l'histoire en
 *  plein écran avant la première étape. « Passer » ou Escape pour entrer
 *  direct. Contrats e2e : testid `adventure.skipIntro` sur « Passer
 *  l'introduction » ; aucun bouton /^(Suivant|Aller au quiz)$/. */
export default function StoryIntro({
  guide,
  story,
  onDone,
}: {
  guide: WorldGuide;
  story: string;
  onDone: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement | null>(null);

  function finish() {
    playSfx('tick');
    onDone();
  }

  // a11y : focus initial sur le dialog (Tab → CTA), Escape = passer.
  useEffect(() => {
    dialogRef.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') finish();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // onDone est figé pour la durée de l'intro (setState du parent).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Ouverture de l'aventure"
      tabIndex={-1}
      className="fixed top-0 left-0 right-0 bottom-0 z-40 bg-night-950/85 backdrop-blur-sm flex items-center justify-center p-6 focus:outline-none"
    >
      <div className="scene-in max-w-lg w-full rounded-3xl border world-border world-bg-soft p-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span
            aria-hidden="true"
            className="w-16 h-16 rounded-full border world-border bg-night-900/60 flex items-center justify-center text-3xl"
          >
            {guide.emoji}
          </span>
          <div className="text-left">
            <p className="text-xs font-bold uppercase tracking-wider world-accent">Ouverture</p>
            <p className="font-bold text-ink">{guide.name} te raconte l'histoire…</p>
          </div>
        </div>
        <p className="italic text-ink-soft leading-relaxed text-lg">{story}</p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={finish} size="lg">
            <Play className="w-4 h-4" aria-hidden="true" /> Commencer l'aventure
          </Button>
          <Button variant="secondary" onClick={finish} size="lg" data-testid={TESTIDS.adventure.skipIntro}>
            <FastForward className="w-4 h-4" aria-hidden="true" /> Passer l'introduction
          </Button>
        </div>
      </div>
    </div>
  );
}
