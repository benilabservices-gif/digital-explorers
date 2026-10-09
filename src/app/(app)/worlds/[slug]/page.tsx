import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, Lock, Sparkles } from 'lucide-react';
import { WORLDS, READY_WORLDS, isWorldReady } from '@/data/content';
import { getWorldTheme } from '@/data/world-themes';
import { buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import WorldThemeProvider from '@/components/world/WorldThemeProvider';
import WorldBackdrop from '@/components/world/WorldBackdrop';
import WorldMap from '@/components/world/WorldMap';
import { PageTransition } from '@/components/motion/page-transition';

export function generateStaticParams() {
  return WORLDS.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const world = WORLDS.find((w) => w.slug === slug);
  return { title: world ? world.name : 'Monde introuvable' };
}

export default async function WorldSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const world = WORLDS.find((w) => w.slug === slug);
  if (!world)
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="text-center">
          <h1 className="mb-2 font-display text-2xl font-bold text-ink">Monde non trouvé</h1>
          <Link href="/dashboard" className="text-sunrise-400 hover:underline">
            Retour au dashboard
          </Link>
        </div>
      </div>
    );
  const ready = isWorldReady(world.slug);
  const theme = getWorldTheme(world.slug);

  return (
    <PageTransition>
    <WorldThemeProvider slug={world.slug} className="relative min-h-screen overflow-hidden">
      {/* Halos de fond + particules du monde */}
      <div className="absolute inset-0 world-bg-glow" aria-hidden="true" />
      <WorldBackdrop slug={world.slug} density={36} />

      <div className="relative px-6 pb-16 pt-28">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/worlds"
            className="mb-6 inline-flex items-center gap-2 text-sm text-ink-soft transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" /> Tous les mondes
          </Link>

          {/* En-tête du monde — carte teintée à l'accent du monde (tokens + vars monde) */}
          <Card
            variant="raised"
            className={`world-border relative mb-8 overflow-hidden rounded-3xl p-8 ${ready ? '' : 'opacity-80 grayscale'}`}
          >
            <div className="absolute inset-0 world-bg-soft" aria-hidden="true" />
            <div className="relative">
              <div className="mb-3 text-5xl">{world.icon}</div>
              <h1 className="mb-2 font-display text-3xl font-bold text-ink md:text-4xl">{world.name}</h1>
              <p className="max-w-2xl text-lg text-ink-soft">{world.description}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Chip className="world-border world-bg-soft text-sm">
                  <span className="text-base" aria-hidden="true">
                    {theme.guide.emoji}
                  </span>
                  <span>
                    Ton guide : <strong>{theme.guide.name}</strong> · {theme.guide.trait}
                  </span>
                </Chip>
                <Chip className="world-border world-bg-soft text-sm">{world.adventures?.length ?? 0} aventures</Chip>
              </div>
            </div>
          </Card>

          {!ready && (
            <div className="world-bg-soft world-border mb-8 flex items-start gap-3 rounded-xl border p-5">
              <Lock className="mt-0.5 h-5 w-5 shrink-0" style={{ color: 'var(--world-accent)' }} />
              <div>
                <h2 className="world-accent mb-1 font-bold">Ce monde arrive bientôt !</h2>
                <p className="text-sm text-ink-soft">
                  Les aventures ci-dessous sont en cours de rédaction. En attendant, explore les{' '}
                  {READY_WORLDS.length} mondes déjà disponibles et continue à gagner de l'XP.
                </p>
                <Link
                  href="/worlds"
                  className="world-bg-soft world-border world-accent hover:opacity-80 mt-3 inline-block rounded-lg border px-4 py-2 text-sm font-medium transition-opacity"
                >
                  Voir les mondes disponibles
                </Link>
              </div>
            </div>
          )}

          {/* Carte interactive du monde */}
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
            <Sparkles className="world-accent h-5 w-5" /> Le chemin du monde
          </h2>
          <div className="mb-10">
            <WorldMap
              worldSlug={world.slug}
              ready={ready}
              adventures={(world.adventures ?? []).map((adv) => ({
                slug: adv.slug,
                title: adv.title,
                xp_reward: adv.xp_reward,
              }))}
            />
          </div>

          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
            <Sparkles className="world-accent h-5 w-5" /> Toutes les aventures
          </h2>
          <div className="space-y-3">
            {world.adventures?.map((adv, idx) => {
              const item = (
                <div className="flex items-start gap-4">
                  <div className="world-border world-accent relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border bg-night-800 font-display text-lg font-bold">
                    {idx + 1}
                    {idx === 0 && ready && (
                      <span
                        className="absolute -right-1.5 -top-1.5 h-3 w-3 animate-pulse rounded-full"
                        style={{ background: 'var(--world-accent)' }}
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">{adv.title}</h3>
                    <p className="mt-1 text-sm text-ink-soft">{adv.description}</p>
                  </div>
                  <div className="world-accent text-sm font-bold">+{adv.xp_reward} XP</div>
                </div>
              );
              if (!ready) {
                return (
                  <Card
                    key={adv.id}
                    aria-disabled
                    className="cursor-not-allowed rounded-2xl p-5 opacity-50 grayscale select-none"
                  >
                    {item}
                  </Card>
                );
              }
              return (
                <Link
                  key={adv.id}
                  href={`/adventure/${adv.slug}`}
                  className="world-card block rounded-2xl bg-night-850 p-5 transition-transform hover:-translate-y-0.5"
                >
                  {item}
                </Link>
              );
            })}
          </div>

          <Card className="mt-8 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <span className="text-2xl" aria-hidden="true">
                🌉
              </span>
              <div>
                <h3 className="mb-1 font-bold">Tu veux aller plus loin ?</h3>
                <p className="mb-3 text-sm text-ink-soft">Passe à l'action sur GeekCoding4Kids !</p>
                <a
                  href="https://geekcoding4kids.online"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({ size: 'sm' })}
                >
                  Continuer sur GeekCoding4Kids →
                </a>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </WorldThemeProvider>
    </PageTransition>
  );
}
