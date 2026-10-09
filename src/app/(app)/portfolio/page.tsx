'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowLeft, Award, FolderOpen, Zap, Sparkles, Star, Crown, Download, Share2 } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { createClient } from '@/lib/supabase/client';
import { fetchChildrenWithProgress, findActiveChild, type ChildData } from '@/lib/children';
import { fetchBadges, fetchWorldsWithAdventures, type WorldWithAdventures } from '@/lib/content-queries';
import { isWorldReady } from '@/data/content';
import { getActiveChildId } from '@/lib/active-child';
import { getLevelTitle, type BadgeLike } from '@/lib/game';
import { PageTransition } from '@/components/motion/page-transition';

// ─────────────────────────────────────────────────────────────────────────────
// Portfolio — « Digital Passport » de l'enfant actif : niveau, compétences par
// monde (XP réel), badges (rareté), aventures terminées. Îlot client conservé.
// ─────────────────────────────────────────────────────────────────────────────

export default function PortfolioPage() {
  const [child, setChild] = useState<ChildData | null>(null);
  const [worlds, setWorlds] = useState<WorldWithAdventures[]>([]);
  const [badges, setBadges] = useState<BadgeLike[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setLoading(false); return; }
      if (cancelled) return;

      const [kids, worldRows, badgeRows] = await Promise.all([
        fetchChildrenWithProgress(supabase),
        fetchWorldsWithAdventures(supabase),
        fetchBadges(supabase),
      ]);
      if (cancelled) return;

      setChild(findActiveChild(kids, getActiveChildId()));
      setWorlds(worldRows);
      setBadges(badgeRows);
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, []);

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-night-950"><div className="h-12 w-12 animate-spin rounded-full border-4 border-sunrise-500 border-t-transparent" /></div>;
  if (!child) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-night-950 px-6 text-ink">
        <EmptyState
          icon={<span className="text-3xl">🧭</span>}
          title="Aucun enfant sélectionné"
          description="Choisis un enfant depuis le dashboard pour voir son passeport."
          action={<Link href="/dashboard" className={buttonVariants()}>Aller au dashboard</Link>}
        />
      </div>
    );
  }

  const levelTitle = getLevelTitle(child.xp);
  const childBadges = badges.filter(b => child.badgeSlugs.includes(b.slug));
  const lockedBadges = badges.filter(b => !child.badgeSlugs.includes(b.slug));

  return (
    <PageTransition>
    <div className="min-h-screen bg-night-950 text-ink">
      <section className="px-6 pb-8 pt-28">
        <div className="mx-auto max-w-4xl">
          <Link href="/dashboard" className="mb-6 inline-flex items-center gap-2 text-sm text-ink-soft transition-colors hover:text-ink"><ArrowLeft className="h-4 w-4" /> Retour au dashboard</Link>

          {/* Digital Passport */}
          <Card className="relative mb-8 overflow-hidden rounded-2xl border-sunrise-500/20 bg-linear-to-r from-sunrise-500/10 to-gleam-400/10 p-8">
            <div className="orb absolute -top-1/2 right-0 h-48 w-48 translate-x-1/2 bg-sunrise-500/10" aria-hidden="true" />
            <div className="relative flex items-center gap-6">
              <div className="text-7xl">{child.avatar}</div>
              <div className="flex-1">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-sunrise-500/20 bg-sunrise-500/10 px-3 py-1 text-xs text-sunrise-300"><Sparkles className="h-3 w-3" /> Digital Passport</div>
                <h1 className="font-display mb-1 text-3xl font-bold md:text-4xl">{child.name}</h1>
                <p className="mb-3 text-ink-soft">{child.gradeLevel} • {child.age} ans • <span className="text-sunrise-400">{levelTitle}</span></p>
                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <span className="flex items-center gap-1"><Crown className="h-4 w-4 text-gold-300" /> Niveau {child.level}</span>
                  <span className="flex items-center gap-1"><Zap className="h-4 w-4 text-gold-300" /> {child.xp} XP</span>
                  <span className="flex items-center gap-1"><Award className="h-4 w-4 text-sunrise-400" /> {childBadges.length} badges</span>
                  <span className="flex items-center gap-1"><FolderOpen className="h-4 w-4 text-success-400" /> {child.completedAdventureSlugs.length} aventures</span>
                </div>
              </div>
              <div className="hidden gap-2 md:flex">
                <Button variant="secondary" size="icon" aria-label="Télécharger le passeport"><Download className="h-5 w-5" /></Button>
                <Button variant="secondary" size="icon" aria-label="Partager le passeport"><Share2 className="h-5 w-5" /></Button>
              </div>
            </div>
          </Card>

          {/* Skills — XP réel par monde */}
          <Card className="mb-8 p-6">
            <h2 className="font-display mb-4 flex items-center gap-2 text-xl font-bold"><Star className="h-5 w-5 text-gold-300" /> Compétences</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {worlds.map(world => {
                const xp = child.worldXp[world.slug] ?? 0;
                // chaque monde culmine à ~1 500 XP (12 aventures)
                const pct = Math.min(100, Math.round((xp / 1500) * 100));
                const currentLevel = xp >= 1000 ? 'master' : xp >= 500 ? 'apply' : xp > 0 ? 'practice' : 'discover';
                const ready = isWorldReady(world.slug);
                return (
                  <div key={world.id} className={`rounded-xl border border-line bg-night-900 p-4 text-center ${ready ? '' : 'opacity-40 grayscale'}`}>
                    <div className="mb-1 text-lg font-bold text-sunrise-300">{world.icon} {world.name}</div>
                    <div className="text-xs capitalize text-ink-faint">{ready ? `${currentLevel} • ${xp} XP` : 'Bientôt disponible'}</div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-night-600">
                      <div className="h-full rounded-full bg-linear-to-r from-sunrise-500 to-gleam-400" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Badges */}
          <div className="mb-8">
            <h2 className="font-display mb-4 flex items-center gap-2 text-xl font-bold"><span aria-hidden="true">🏆</span> Badges</h2>
            <Card className="p-5">
              {childBadges.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {childBadges.map(badge => (
                    <Badge key={badge.slug} rarity={badge.rarity}>
                      <span className="text-base" aria-hidden="true">{badge.icon}</span> {badge.name}
                    </Badge>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<Award className="h-7 w-7 text-gold-400" />}
                  title="Aucun badge pour le moment."
                  description="Termine des aventures pour en gagner !"
                />
              )}
            </Card>
          </div>

          {/* Adventures Completed */}
          <div className="mb-8">
            <h2 className="font-display mb-4 flex items-center gap-2 text-xl font-bold"><span aria-hidden="true">📚</span> Aventures terminées</h2>
            <Card className="overflow-hidden">
              {child.completions.length > 0 ? (
                child.completions.slice().reverse().map((adv, i) => (
                  <div key={adv.adventureSlug} className={`flex items-center gap-4 p-4 ${i > 0 ? 'border-t border-line' : ''}`}>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-success-500/10 text-sm font-bold text-success-400" aria-hidden="true">✓</div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{adv.adventureTitle}</div>
                      <div className="text-xs text-ink-faint">{adv.worldName} • complétée le {new Date(adv.completedAt).toLocaleDateString('fr-FR')}</div>
                    </div>
                    <div className="shrink-0 text-sm font-medium text-gold-300">+{adv.xpReward} XP</div>
                  </div>
                ))
              ) : (
                <EmptyState
                  icon={<FolderOpen className="h-9 w-9 text-ink-faint" />}
                  title="Aucune aventure terminée"
                  description="Complète ton premier monde pour commencer !"
                />
              )}
            </Card>
          </div>

          {/* Unlocked Badges */}
          {lockedBadges.length > 0 && (
            <div>
              <h2 className="font-display mb-4 flex items-center gap-2 text-xl font-bold"><span aria-hidden="true">🔜</span> Badges à débloquer</h2>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                {lockedBadges.slice(0, 10).map(badge => (
                  <div key={badge.slug} className="flex flex-col items-center gap-1 rounded-xl border border-line bg-night-850 p-3 opacity-40">
                    <span className="text-2xl grayscale" aria-hidden="true">{badge.icon}</span>
                    <span className="text-center text-xs font-medium">{badge.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
    </PageTransition>
  );
}
