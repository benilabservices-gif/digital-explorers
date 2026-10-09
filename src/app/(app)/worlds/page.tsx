import type { CSSProperties, ReactNode } from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Lock, Sparkles } from 'lucide-react';
import { WORLDS, READY_WORLDS, isWorldReady } from '@/data/content';
import { getWorldTheme } from '@/data/world-themes';
import { getActiveChild } from '@/lib/queries/children';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { SectionHeading } from '@/components/ui/section-heading';
import { WorldEmblem } from '@/components/brand/world-emblem';
import { PageTransition } from '@/components/motion/page-transition';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// Les mondes (app enfant) — page serveur. La progression vient de l'enfant
// actif (cookie, fallback premier enfant) : plus de fetch ni de spinner côté
// client, le layout (app) garantit déjà la session. Emblèmes SVG en contexte
// premium ; gating des mondes en rédaction conservé (isWorldReady).
// ─────────────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Mondes',
  description:
    'Les 7 mondes du numérique : Web & Digital, IA, Coding, Blockchain, Création, Cybersécurité et Innovation.',
};

/** Variables CSS du monde posées sur chaque carte pour le survol teinté. */
function worldCardStyle(slug: string): CSSProperties {
  const t = getWorldTheme(slug);
  return { '--world-accent': t.accent, '--world-glow': t.glow } as CSSProperties;
}

const RING_RADIUS = 34;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

/** Anneau de progression : arc SVG à la couleur du monde, autour de
 *  l'emblème. Progression de l'enfant actif (complétions en base). */
function ProgressRing({ progress, color }: { progress: number; color: string }) {
  const clamped = Math.max(0, Math.min(1, progress));
  return (
    <svg viewBox="0 0 80 80" aria-hidden="true" className="absolute inset-0 h-full w-full -rotate-90">
      <circle cx="40" cy="40" r={RING_RADIUS} fill="none" stroke="var(--color-line)" strokeWidth="5" />
      {clamped > 0 && (
        <circle
          cx="40"
          cy="40"
          r={RING_RADIUS}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={`${(RING_CIRCUMFERENCE * clamped).toFixed(2)} ${RING_CIRCUMFERENCE.toFixed(2)}`}
        />
      )}
    </svg>
  );
}

const PHASE_CHIP = {
  explorer: { label: 'Explorer', variant: 'neutral' },
  creator: { label: 'Créer', variant: 'success' },
  builder: { label: 'Construire', variant: 'warm' },
} as const;

/** Tuile d'un monde : emblème + anneau de progression + infos. */
function WorldTile({
  slug,
  name,
  description,
  phase,
  ready,
  progressText,
  progress,
  locked,
}: {
  slug: (typeof WORLDS)[number]['slug'];
  name: string;
  description: string;
  phase: keyof typeof PHASE_CHIP;
  ready: boolean;
  progressText: string;
  progress: number;
  locked: boolean;
}) {
  const accent = getWorldTheme(slug).accent;
  const inner: ReactNode = (
    <>
      <div className="relative mb-4 flex h-20 w-20 items-center justify-center">
        {ready && <ProgressRing progress={progress} color={accent} />}
        <span
          className={cn(
            'flex h-16 w-16 items-center justify-center rounded-xl border border-line bg-night-900 transition-transform duration-250 ease-out-soft',
            ready && 'group-hover:scale-110',
            locked && 'opacity-50',
          )}
          style={ready ? { color: accent } : undefined}
        >
          <WorldEmblem slug={slug} size={36} />
        </span>
      </div>
      <h2 className="mb-2 font-display text-lg font-bold text-ink">{name}</h2>
      <p className="mb-4 line-clamp-2 text-sm text-ink-soft">{description}</p>
      <div className="flex items-center justify-between text-xs">
        <span className="text-ink-faint">{progressText}</span>
        <Chip size="sm" variant={PHASE_CHIP[phase].variant}>
          {PHASE_CHIP[phase].label}
        </Chip>
      </div>
    </>
  );

  if (!ready) {
    return (
      <Card
        aria-disabled
        style={worldCardStyle(slug)}
        className={cn(
          'world-card relative cursor-not-allowed select-none p-6 opacity-50 grayscale',
          'border-line bg-night-850',
        )}
      >
        <Chip variant="outline" size="sm" className="absolute right-4 top-4 z-10">
          <Lock className="h-3 w-3" /> Bientôt
        </Chip>
        {inner}
      </Card>
    );
  }
  return (
    <Link
      href={`/worlds/${slug}`}
      style={worldCardStyle(slug)}
      className="world-card group relative block rounded-xl border border-line bg-night-850 p-6 transition-all duration-250 ease-out-soft hover:-translate-y-1"
    >
      {inner}
    </Link>
  );
}

export default async function WorldsPage() {
  const activeChild = await getActiveChild();

  return (
    <PageTransition>
    <div className="min-h-screen bg-night-950 text-ink">
      <section className="relative overflow-hidden px-6 pb-16 pt-32">
        {/* Ciel étoilé décoratif — la « constellation » des mondes */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              'radial-gradient(1.5px 1.5px at 25px 35px, rgba(255,255,255,0.5), transparent 100%),' +
              'radial-gradient(1px 1px at 95px 120px, rgba(255,255,255,0.35), transparent 100%),' +
              'radial-gradient(1px 1px at 165px 55px, rgba(255,255,255,0.45), transparent 100%),' +
              'radial-gradient(1.5px 1.5px at 215px 155px, rgba(255,255,255,0.3), transparent 100%)',
            backgroundSize: '240px 190px',
          }}
        />
        <div className="relative mx-auto max-w-6xl">
          <SectionHeading
            align="center"
            eyebrow={`${WORLDS.length} univers interactifs`}
            title={`Les ${WORLDS.length} Mondes`}
            description="Explore le numérique à travers des univers fascinants conçus pour les jeunes africains. Coach IA inclus."
          />
          {activeChild && (
            <div className="-mt-4 mb-2 flex justify-center">
              <Chip variant="outline">
                <span aria-hidden="true">{activeChild.avatar}</span>
                Progression de {activeChild.name}
              </Chip>
            </div>
          )}
        </div>
      </section>
      <section className="px-6 pb-24 pt-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {WORLDS.map((world) => {
              const ready = isWorldReady(world.slug);
              const total = world.adventures?.length ?? 0;
              const done = activeChild?.completionsPerWorld?.[world.slug] ?? 0;
              const progress = total > 0 ? Math.min(1, done / total) : 0;
              return (
                <WorldTile
                  key={world.id}
                  slug={world.slug}
                  name={world.name}
                  description={world.description}
                  phase={world.phase}
                  ready={ready}
                  progress={progress}
                  progressText={
                    ready && activeChild ? `${done}/${total} aventures` : `${total} aventures`
                  }
                  locked={!ready}
                />
              );
            })}
          </div>
          <p className="mt-10 flex items-center justify-center gap-2 text-sm text-ink-faint">
            <Sparkles aria-hidden className="h-4 w-4 text-sunrise-400" />
            {READY_WORLDS.length} mondes prêts · {WORLDS.length - READY_WORLDS.length} mondes en préparation — la constellation s'agrandit.
          </p>
        </div>
      </section>
    </div>
    </PageTransition>
  );
}
