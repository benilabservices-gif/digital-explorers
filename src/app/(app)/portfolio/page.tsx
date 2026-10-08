'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowLeft, Award, FolderOpen, Zap, Sparkles, Star, Crown, Download, Share2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { fetchChildrenWithProgress, findActiveChild, type ChildData } from '@/lib/children';
import { fetchBadges, fetchWorldsWithAdventures, type WorldWithAdventures } from '@/lib/content-queries';
import { isWorldReady } from '@/data/content';
import { getActiveChildId } from '@/lib/active-child';
import { getLevelTitle, type BadgeLike } from '@/lib/game';

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

  if (loading) return <div className="min-h-screen bg-[#060810] flex items-center justify-center"><div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!child) {
    return (
      <div className="min-h-screen bg-[#060810] text-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">🧭</div>
          <h1 className="font-display text-2xl font-bold mb-2">Aucun enfant sélectionné</h1>
          <p className="text-gray-400 mb-6">Choisis un enfant depuis le dashboard pour voir son passeport.</p>
          <Link href="/dashboard"><button className="px-8 py-3 bg-gradient-to-r from-[#ff6b6b] to-[#8b5cf6] rounded-full font-semibold hover:opacity-90">Aller au dashboard</button></Link>
        </div>
      </div>
    );
  }

  const levelTitle = getLevelTitle(child.xp);
  const childBadges = badges.filter(b => child.badgeSlugs.includes(b.slug));
  const lockedBadges = badges.filter(b => !child.badgeSlugs.includes(b.slug));

  return (
    <div className="min-h-screen bg-[#060810] text-white">
      <section className="pt-28 pb-8 px-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6"><ArrowLeft className="w-4 h-4" /> Retour au dashboard</Link>

          {/* Digital Passport */}
          <div className="bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-violet-500/20 rounded-2xl p-8 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-violet-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="relative flex items-center gap-6">
              <div className="text-7xl">{child.avatar}</div>
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs mb-3"><Sparkles className="w-3 h-3" /> Digital Passport</div>
                <h1 className="font-display text-3xl md:text-4xl font-bold mb-1">{child.name}</h1>
                <p className="text-gray-400 mb-3">{child.gradeLevel} • {child.age} ans • <span className="text-violet-400">{levelTitle}</span></p>
                <div className="flex items-center gap-6 text-sm flex-wrap">
                  <span className="flex items-center gap-1"><Crown className="w-4 h-4 text-yellow-400" /> Niveau {child.level}</span>
                  <span className="flex items-center gap-1"><Zap className="w-4 h-4 text-violet-400" /> {child.xp} XP</span>
                  <span className="flex items-center gap-1"><Award className="w-4 h-4 text-pink-400" /> {childBadges.length} badges</span>
                  <span className="flex items-center gap-1"><FolderOpen className="w-4 h-4 text-emerald-400" /> {child.completedAdventureSlugs.length} aventures</span>
                </div>
              </div>
              <div className="hidden md:flex gap-2">
                <button className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"><Download className="w-5 h-5" /></button>
                <button className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"><Share2 className="w-5 h-5" /></button>
              </div>
            </div>
          </div>

          {/* Skills — XP réel par monde */}
          <div className="bg-[#111827] border border-white/5 rounded-xl p-6 mb-8">
            <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2"><Star className="w-5 h-5 text-yellow-400" /> Compétences</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {worlds.map(world => {
                const xp = child.worldXp[world.slug] ?? 0;
                // chaque monde culmine à ~1 500 XP (12 aventures)
                const pct = Math.min(100, Math.round((xp / 1500) * 100));
                const currentLevel = xp >= 1000 ? 'master' : xp >= 500 ? 'apply' : xp > 0 ? 'practice' : 'discover';
                const ready = isWorldReady(world.slug);
                return (
                  <div key={world.id} className={`bg-[#0f172a] rounded-xl p-4 text-center ${ready ? '' : 'opacity-40 grayscale'}`}>
                    <div className="text-lg font-bold text-violet-300 mb-1">{world.icon} {world.name}</div>
                    <div className="text-xs text-gray-500 capitalize">{ready ? `${currentLevel} • ${xp} XP` : 'Bientôt disponible'}</div>
                    <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Badges */}
          <div className="mb-8">
            <h2 className="font-display text-xl font-bold mb-4">🏆 Badges</h2>
            <div className="bg-[#111827] border border-white/5 rounded-xl p-5">
              {childBadges.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {childBadges.map(badge => (
                    <div key={badge.slug} className="flex flex-col items-center gap-1 p-4 rounded-xl bg-[#0f172a] min-w-[90px]">
                      <span className="text-3xl">{badge.icon}</span>
                      <span className="text-xs text-center font-medium">{badge.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Award className="w-10 h-10 mx-auto mb-3 opacity-30" /><p>Aucun badge pour le moment.</p><p className="text-sm">Termine des aventures pour en gagner !</p>
                </div>
              )}
            </div>
          </div>

          {/* Adventures Completed */}
          <div className="mb-8">
            <h2 className="font-display text-xl font-bold mb-4">📚 Aventures terminées</h2>
            <div className="bg-[#111827] border border-white/5 rounded-xl overflow-hidden">
              {child.completions.length > 0 ? (
                child.completions.slice().reverse().map((adv, i) => (
                  <div key={adv.adventureSlug} className={`p-4 flex items-center gap-4 ${i > 0 ? 'border-t border-white/5' : ''}`}>
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold text-sm flex-shrink-0">✓</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{adv.adventureTitle}</div>
                      <div className="text-xs text-gray-500">{adv.worldName} • complétée le {new Date(adv.completedAt).toLocaleDateString('fr-FR')}</div>
                    </div>
                    <div className="text-sm text-yellow-400 font-medium flex-shrink-0">+{adv.xpReward} XP</div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-30" /><p className="font-medium mb-1">Aucune aventure terminée</p><p className="text-sm">Complète ton premier monde pour commencer !</p>
                </div>
              )}
            </div>
          </div>

          {/* Unlocked Badges */}
          {lockedBadges.length > 0 && (
            <div>
              <h2 className="font-display text-xl font-bold mb-4">🔜 Badges à débloquer</h2>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {lockedBadges.slice(0, 10).map(badge => (
                  <div key={badge.slug} className="flex flex-col items-center gap-1 p-3 rounded-xl bg-[#111827] border border-white/5 opacity-40">
                    <span className="text-2xl grayscale">{badge.icon}</span>
                    <span className="text-xs text-center font-medium">{badge.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
