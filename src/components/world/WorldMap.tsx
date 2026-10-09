'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Check, Lock, Star } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { fetchChildrenWithProgress, findActiveChild } from '@/lib/children';
import { getActiveChildId } from '@/lib/active-child';

interface MapAdventure {
  slug: string;
  title: string;
  xp_reward: number;
}

const COLS = 3; // nœuds par rangée (zigzag)
const ROW_HEIGHT = 150; // px par rangée

type NodeState = 'done' | 'current' | 'todo' | 'locked';

/** Positions en % des nœuds, en serpentin (gauche→droite, puis droite→gauche). */
function nodePoints(count: number): { x: number; y: number }[] {
  const rows = Math.max(1, Math.ceil(count / COLS));
  return Array.from({ length: count }, (_, i) => {
    const row = Math.floor(i / COLS);
    const inRow = i % COLS;
    const col = row % 2 === 0 ? inRow : COLS - 1 - inRow;
    return {
      x: ((col + 0.5) / COLS) * 100,
      y: ((row + 0.5) / rows) * 100,
    };
  });
}

/** Carte du monde : chaque aventure est une étape sur le chemin.
 *  La progression vient de l'enfant actif (complétions en base, RLS). */
export default function WorldMap({
  worldSlug,
  ready,
  adventures,
}: {
  worldSlug: string;
  ready: boolean;
  adventures: MapAdventure[];
}) {
  const [completed, setCompleted] = useState<Set<string> | null>(null); // null = chargement

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const supabase = createClient();
        const children = await fetchChildrenWithProgress(supabase);
        if (cancelled) return;
        const active = findActiveChild(children, getActiveChildId());
        setCompleted(new Set(active?.completedAdventureSlugs ?? []));
      } catch {
        if (!cancelled) setCompleted(new Set());
      }
    })();
    return () => { cancelled = true; };
  }, [worldSlug]);

  const points = nodePoints(adventures.length);
  const rows = Math.max(1, Math.ceil(adventures.length / COLS));
  const firstTodo = adventures.findIndex((a) => !completed?.has(a.slug));

  function stateOf(slug: string, index: number): NodeState {
    if (!ready) return 'locked';
    if (completed === null) return 'todo'; // chargement : neutre
    if (completed.has(slug)) return 'done';
    if (index === firstTodo) return 'current';
    return 'todo';
  }

  // Chemin pointillé reliant les étapes dans l'ordre des aventures.
  const trail = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  return (
    <div>
      <div className="relative w-full" style={{ height: `${rows * ROW_HEIGHT}px` }}>
        {/* Sentier sinueux derrière les nœuds */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
          aria-hidden="true"
        >
          <path
            d={trail}
            fill="none"
            stroke="rgba(239,244,255,0.18)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="1.2 2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* Nœuds */}
        {adventures.map((adv, i) => {
          const state = stateOf(adv.slug, i);
          const point = points[i];
          const clickable = ready;
          const badge = (
            <div
              className="absolute z-10 -translate-x-1/2 -translate-y-7 flex flex-col items-center"
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
            >
              <span
                className={`relative w-14 h-14 rounded-full border flex items-center justify-center text-lg font-bold transition-all ${
                  state === 'done'
                    ? 'border-success-500/60 bg-success-500/15 text-success-300'
                    : state === 'current'
                      ? 'world-border world-bg-soft world-accent world-glow scale-110'
                      : state === 'locked'
                        ? 'border-line bg-night-900/60 text-ink-faint'
                        : 'border-line-lit bg-night-900/60 text-ink-soft'
                }`}
              >
                {state === 'done' ? (
                  <Check className="w-6 h-6" aria-hidden="true" />
                ) : state === 'locked' ? (
                  <Lock className="w-5 h-5" aria-hidden="true" />
                ) : state === 'current' ? (
                  <Star className="w-6 h-6" aria-hidden="true" />
                ) : (
                  i + 1
                )}
                {state === 'current' && (
                  <span
                    className="absolute inset-0 rounded-full animate-ping"
                    style={{ background: 'var(--world-accent)', opacity: 0.15 }}
                    aria-hidden="true"
                  />
                )}
              </span>
              <span className="mt-2 w-28 text-center text-xs leading-snug text-ink-soft line-clamp-2">
                {adv.title}
              </span>
              {state !== 'locked' && (
                <span className="text-[10px] text-ink-faint">+{adv.xp_reward} XP</span>
              )}
            </div>
          );
          return clickable ? (
            <Link key={adv.slug} href={`/adventure/${adv.slug}`} aria-label={`Aventure : ${adv.title}`}>
              {badge}
            </Link>
          ) : (
            <div key={adv.slug} aria-disabled="true" className="select-none cursor-not-allowed">
              {badge}
            </div>
          );
        })}
      </div>

      {/* Légende */}
      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ink-soft">
        <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-success-400" aria-hidden="true" /> Terminée</span>
        <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 world-accent" aria-hidden="true" /> Prochaine étape</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full border border-line-lit inline-block" aria-hidden="true" /> À explorer</span>
        {completed && completed.size > 0 && (
          <span className="ml-auto font-semibold">{completed.size}/{adventures.length} aventures terminées</span>
        )}
      </div>
    </div>
  );
}
