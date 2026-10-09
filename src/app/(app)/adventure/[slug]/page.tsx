// ─────────────────────────────────────────────────────────────────────────────
// Coquille serveur de /adventure/[slug] (Phase 2).
//
// Rend serveur : métadonnées (generateMetadata, fetch partagé via cache),
// thème du monde, filigrane, breadcrumb et en-tête d'aventure (h1). Le cœur
// interactif (leçons, quiz, complétion, récompenses) vit dans AdventureClient.
// Token-only : le dégradé du monde reste un contrat DB ; tout le reste de la
// page utilise les tokens « Carnet de l'Explorateur » (ratchet final vide).
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, CheckCircle, Lock, Star } from 'lucide-react';
import { isWorldReady } from '@/data/content';
import WorldThemeProvider from '@/components/world/WorldThemeProvider';
import WorldBackdrop from '@/components/world/WorldBackdrop';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getAdventureBySlug } from '@/lib/queries/adventures';
import { getActiveChild } from '@/lib/queries/children';
import { PageTransition } from '@/components/motion/page-transition';
import AdventureClient from './AdventureClient';

type AdventureParams = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: AdventureParams): Promise<Metadata> {
  const { slug } = await params;
  const adventure = await getAdventureBySlug(slug);
  if (!adventure) return { title: 'Aventure introuvable' };
  return {
    title: `${adventure.title} — ${adventure.world.name}`,
    description: adventure.description,
  };
}

export default async function AdventureSlugPage({ params }: AdventureParams) {
  const { slug } = await params;
  const [adventure, child] = await Promise.all([
    getAdventureBySlug(slug),
    getActiveChild(),
  ]);
  if (!adventure) notFound();

  const alreadyDone = child?.completedAdventureSlugs.includes(adventure.slug) ?? false;

  return (
    <PageTransition>
    <WorldThemeProvider
      slug={adventure.world.slug}
      className="relative min-h-screen bg-night-950 text-ink pb-32 overflow-hidden"
    >
      {/* Halos de fond + particules du monde */}
      <div className="absolute inset-0 world-bg-glow" aria-hidden="true" />
      <WorldBackdrop slug={adventure.world.slug} density={30} />

      <div className="relative pt-24 px-6 max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <Link
          href={`/worlds/${adventure.world.slug}`}
          className="inline-flex items-center gap-2 text-ink-soft hover:text-ink text-sm mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> {adventure.world.icon} {adventure.world.name}
        </Link>

        {/* Adventure header — dégradé du monde (contrat DB), habillage tokens */}
        <div className={`rounded-2xl p-6 mb-6 bg-gradient-to-r ${adventure.world.gradient} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-night-950/30" />
          <div className="relative">
            <div className="text-4xl mb-2">{adventure.world.icon}</div>
            <h1 className="text-2xl font-bold mb-1">{adventure.title}</h1>
            <p className="text-ink text-sm">{adventure.description}</p>
            <div className="mt-3 flex items-center gap-3 text-sm text-ink-soft">
              <span className="flex items-center gap-1"><Star className="w-4 h-4 text-gold-400" /> +{adventure.xpReward} XP</span>
              {alreadyDone && <span className="flex items-center gap-1 text-success-300"><CheckCircle className="w-4 h-4" /> Terminée</span>}
            </div>
          </div>
        </div>

        {isWorldReady(adventure.world.slug) ? (
          <AdventureClient adventure={adventure} child={child} alreadyDone={alreadyDone} />
        ) : (
          /* Monde encore en cours de rédaction : la version enrichie arrive bientôt. */
          <div className="pt-8 flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-line bg-night-850">
                <Lock className="w-10 h-10 text-gold-400" />
              </div>
              <p className="text-ink-soft mb-2">
                Cette aventure fait partie du monde {adventure.world.name}, qui arrive bientôt.
              </p>
              <p className="mb-8 text-sm text-ink-faint">
                Le contenu est encore en cours de rédaction. Explore les mondes déjà disponibles en attendant !
              </p>
              <Link href="/worlds" className={cn(buttonVariants())}>
                Voir les mondes disponibles
              </Link>
            </div>
          </div>
        )}
      </div>
    </WorldThemeProvider>
    </PageTransition>
  );
}
