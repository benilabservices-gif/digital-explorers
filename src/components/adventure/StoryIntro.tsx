'use client';

import { Play, FastForward } from 'lucide-react';
import type { WorldGuide } from '@/data/world-themes';
import { playSfx } from '@/lib/sfx';

/** Ouverture cinématique de l'aventure : le guide raconte l'histoire en
 *  plein écran avant la première étape. « Passer » pour entrer direct.
 *  NB contrats e2e : pas de fixed.inset-0 (réservé à RewardOverlay),
 *  aucun bouton /^(Suivant|Aller au quiz)$/ — le smoke clique « Passer ». */
export default function StoryIntro({
  guide,
  story,
  onDone,
}: {
  guide: WorldGuide;
  story: string;
  onDone: () => void;
}) {
  function finish() {
    playSfx('tick');
    onDone();
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Ouverture de l’aventure"
      className="fixed top-0 left-0 right-0 bottom-0 z-40 bg-black/85 backdrop-blur-sm flex items-center justify-center p-6"
    >
      <div className="scene-in max-w-lg w-full rounded-3xl border world-border world-bg-soft p-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span
            aria-hidden="true"
            className="w-16 h-16 rounded-full border world-border bg-black/30 flex items-center justify-center text-3xl"
          >
            {guide.emoji}
          </span>
          <div className="text-left">
            <p className="text-xs font-bold uppercase tracking-wider world-accent">Ouverture</p>
            <p className="font-bold text-white">{guide.name} te raconte l'histoire…</p>
          </div>
        </div>
        <p className="italic text-gray-200 leading-relaxed text-lg">{story}</p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={finish}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-[#ff6b6b] to-[#8b5cf6] font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Play className="w-4 h-4" aria-hidden="true" /> Commencer l'aventure
          </button>
          <button
            type="button"
            onClick={finish}
            className="px-6 py-3 rounded-full border border-white/15 text-gray-300 hover:border-white/35 font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <FastForward className="w-4 h-4" aria-hidden="true" /> Passer l'introduction
          </button>
        </div>
      </div>
    </div>
  );
}
