'use client';

import { useEffect, useRef, useState } from 'react';
import type { LessonBlock } from '@/lib/lesson-parser';
import type { WorldGuide } from '@/data/world-themes';
import DialogueBubble from './DialogueBubble';
import KeyPointCard from './KeyPointCard';

function renderBlock(block: LessonBlock, guide: WorldGuide) {
  switch (block.kind) {
    case 'paragraph':
      return <p className="text-ink-soft leading-relaxed">{block.text}</p>;
    case 'list':
      return <KeyPointCard icon="📌" title="À retenir" items={block.items} ordered={block.ordered} />;
    case 'dialogue':
      return <DialogueBubble guide={guide}>{block.text}</DialogueBubble>;
    case 'tip':
      return <KeyPointCard icon="💡" title="Astuce" text={block.text} />;
    case 'definition':
      return <KeyPointCard icon="📖" title="Définition" term={block.term} text={block.text} />;
  }
}

/** Leçon immersive : les blocs parsés se révèlent un par un (« Continuer »),
 *  avec une sortie de secours « Tout afficher » pour l'accessibilité. Le
 *  parent reset l'état via `key={section.id}` à chaque changement d'étape.
 *  NB : aucun libellé de bouton ne doit matcher /^(Suivant|Aller au quiz)$/
 *  (le smoke e2e avance de section via « Suivant »). */
export default function LessonScene({ blocks, guide }: { blocks: LessonBlock[]; guide: WorldGuide }) {
  const [revealed, setRevealed] = useState(1);
  const lastRef = useRef<HTMLDivElement | null>(null);

  // Fait glisser jusqu'au bloc fraîchement révélé, en respectant
  // prefers-reduced-motion.
  useEffect(() => {
    if (revealed <= 1) return;
    const el = lastRef.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' });
  }, [revealed]);

  if (blocks.length === 0) return null;
  const visible = blocks.slice(0, Math.min(revealed, blocks.length));

  return (
    <div>
      <div className="space-y-4">
        {visible.map((block, i) => (
          <div
            key={i}
            ref={i === visible.length - 1 ? lastRef : undefined}
            className="scene-in"
          >
            {renderBlock(block, guide)}
          </div>
        ))}
      </div>
      {revealed < blocks.length && (
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => setRevealed((r) => Math.min(r + 1, blocks.length))}
            className="px-6 py-2.5 rounded-full border world-border world-bg-soft world-accent font-semibold transition-all hover:opacity-80"
          >
            Continuer
          </button>
          <button
            type="button"
            onClick={() => setRevealed(blocks.length)}
            className="text-sm text-ink-soft hover:text-ink underline underline-offset-4 transition-colors"
          >
            Tout afficher
          </button>
        </div>
      )}
    </div>
  );
}
