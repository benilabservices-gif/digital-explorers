// ─────────────────────────────────────────────────────────────────────────────
// Requêtes serveur — aventures (Phase 2).
//
// Consommé par la coquille serveur de /adventure/[slug] (page + metadata).
// cache() permet à generateMetadata ET au rendu de page de partager le même
// fetch sans double aller-retour Supabase.
// ─────────────────────────────────────────────────────────────────────────────

import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';

/** Monde parent tel qu'affiché par l'aventure. */
export interface AdventureWorld {
  slug: string;
  name: string;
  icon: string;
  gradient: string;
}

/** Données d'une aventure pour le rendu de /adventure/[slug]. */
export interface AdventurePageData {
  slug: string;
  title: string;
  description: string;
  story: string;
  xpReward: number;
  world: AdventureWorld;
}

/**
 * Aventure publiée par slug, avec son monde (join). Null si introuvable,
 * non publiée, ou si la relation monde manque (donnée incohérente).
 */
export const getAdventureBySlug = cache(
  async (slug: string): Promise<AdventurePageData | null> => {
    const supabase = await createClient();

    const { data } = await supabase
      .from('adventures')
      .select('slug,title,description,story,xp_reward,worlds(slug,name,icon,gradient)')
      .eq('slug', slug)
      .eq('is_published', true)
      .maybeSingle();

    // Le join FK n'est pas typé de façon fiable ici — cast explicite.
    const row = data as unknown as
      | {
          slug: string;
          title: string;
          description: string;
          story: string;
          xp_reward: number;
          worlds: AdventureWorld | null;
        }
      | null;

    if (!row?.worlds) return null;

    return {
      slug: row.slug,
      title: row.title,
      description: row.description,
      story: row.story,
      xpReward: row.xp_reward,
      world: row.worlds,
    };
  }
);
