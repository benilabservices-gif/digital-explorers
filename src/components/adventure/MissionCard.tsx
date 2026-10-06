'use client';

import { useState } from 'react';
import { Target } from 'lucide-react';
import { splitMission, type LessonBlock } from '@/lib/lesson-parser';
import KeyPointCard from './KeyPointCard';

/** Texte brut d'un bloc, pour les affichages simples (briefing, conclusion). */
function textOf(block: LessonBlock): string {
  switch (block.kind) {
    case 'paragraph':
    case 'dialogue':
    case 'tip':
      return block.text;
    case 'definition':
      return block.text;
    case 'list':
      return block.items.join(' ');
  }
}

/** Mission : briefing toujours visible, étapes à cocher une à une
 *  (checklist locale, aucun XP ni persistance), soutien en cartes et
 *  conclusion narrative. Le parent reset la checklist via key={section.id}. */
export default function MissionCard({ blocks }: { blocks: LessonBlock[] }) {
  const { briefing, steps, support, closing } = splitMission(blocks);
  const [done, setDone] = useState<Set<number>>(new Set());

  if (blocks.length === 0) return null;

  const toggle = (index: number) => {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {/* Briefing */}
      <div className="rounded-2xl border world-border world-bg-soft p-5">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-5 h-5 world-accent" aria-hidden="true" />
          <span className="text-xs font-bold uppercase tracking-wider world-accent">Mission</span>
        </div>
        {briefing.map((block, i) => (
          <p key={i} className="text-gray-200 leading-relaxed">{textOf(block)}</p>
        ))}
      </div>

      {/* Checklist d'étapes */}
      {steps.length > 0 && (
        <div className="space-y-3">
          {steps.map((step, i) => {
            const checked = done.has(i);
            return (
              <button
                key={i}
                type="button"
                onClick={() => toggle(i)}
                aria-pressed={checked}
                className={`w-full text-left flex items-start gap-3 rounded-xl border px-4 py-3 transition-all ${
                  checked ? 'world-border world-bg-soft' : 'border-white/10 hover:border-white/25'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`mt-0.5 w-5 h-5 shrink-0 rounded-full border flex items-center justify-center text-[11px] font-bold ${
                    checked ? 'world-border world-bg-soft world-accent' : 'border-white/20 text-gray-400'
                  }`}
                >
                  {checked ? '✓' : i + 1}
                </span>
                <span className={`text-sm leading-relaxed ${checked ? 'line-through text-gray-500' : 'text-gray-200'}`}>
                  {step}
                </span>
              </button>
            );
          })}
          {done.size > 0 && (
            <p className="text-sm world-accent font-medium">
              {done.size} étape{done.size > 1 ? 's' : ''} faite{done.size > 1 ? 's' : ''}
            </p>
          )}
        </div>
      )}

      {/* Soutien : astuces, définitions, dialogues */}
      {support.map((block, i) => {
        if (block.kind === 'tip') {
          return <KeyPointCard key={`support-${i}`} icon="💡" title="Astuce" text={block.text} />;
        }
        if (block.kind === 'definition') {
          return <KeyPointCard key={`support-${i}`} icon="📖" title="Définition" term={block.term} text={block.text} />;
        }
        return (
          <p key={`support-${i}`} className="text-gray-300 italic leading-relaxed">{textOf(block)}</p>
        );
      })}

      {/* Conclusion narrative */}
      {closing.length > 0 && (
        <div className="rounded-xl border-l-4 world-border bg-white/5 px-4 py-3">
          {closing.map((block, i) => (
            <p key={i} className="italic text-gray-300 leading-relaxed">{textOf(block)}</p>
          ))}
        </div>
      )}
    </div>
  );
}
