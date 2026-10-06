'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { WORLDS, isWorldReady } from '@/data/content';
import { getWorldTheme } from '@/data/world-themes';
import { createClient } from '@/lib/supabase/client';
import { fetchChildrenWithProgress, findActiveChild, type ChildData } from '@/lib/children';
import { getActiveChildId } from '@/lib/active-child';
import { Lock, Sparkles } from 'lucide-react';
import Nav from '@/components/Nav';

/** Variables CSS du monde posées sur chaque carte pour le survol teinté. */
function worldCardStyle(slug: string): CSSProperties {
  const t = getWorldTheme(slug);
  return { '--world-accent': t.accent, '--world-glow': t.glow } as CSSProperties;
}

const RING_RADIUS = 34;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

/** Anneau de progression (Phase 5) : arc SVG à la couleur du monde,
 *  autour de l'icône. Progression de l'enfant actif (complétions en base). */
function ProgressRing({ progress, color }: { progress: number; color: string }) {
  const clamped = Math.max(0, Math.min(1, progress));
  return (
    <svg viewBox="0 0 80 80" aria-hidden="true" className="absolute inset-0 w-full h-full -rotate-90">
      <circle cx="40" cy="40" r={RING_RADIUS} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
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

export default function WorldsPage() {
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeChild, setActiveChild] = useState<ChildData | null>(null);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (cancelled) return;
      setAuth(!!user);
      if (user) {
        try {
          const children = await fetchChildrenWithProgress(supabase);
          if (!cancelled) setActiveChild(findActiveChild(children, getActiveChildId()));
        } catch {
          // progression optionnelle : sans enfant chargé, la constellation reste neutre
        }
      }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060810] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!auth) {
    return (
      <div className="min-h-screen bg-[#060810] text-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-violet-400" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">Connecte-toi pour explorer</h1>
          <p className="text-gray-400 mb-8 text-lg">Les 7 mondes t attendent. Crée ton compte gratuit et commence ton aventure avec le Coach IA.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <button className="px-8 py-3 bg-gradient-to-r from-[#ff6b6b] to-[#8b5cf6] rounded-full font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" /> Créer mon compte gratuit
              </button>
            </Link>
            <Link href="/auth/login">
              <button className="px-8 py-3 border border-white/10 rounded-full text-gray-300 hover:bg-white/5 transition-all">
                J ai déjà un compte
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060810] text-white">
      <Nav />
      <section className="relative overflow-hidden pt-32 pb-16 px-6">
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
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm mb-4"><Sparkles className="w-4 h-4" /> 7 univers interactifs</div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">Les 7 Mondes</h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Explore le numérique à travers des univers fascinants conçus pour les jeunes africains. Coach IA inclus.</p>
            {activeChild && (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300">
                <span aria-hidden="true">{activeChild.avatar}</span>
                Progression de {activeChild.name}
              </div>
            )}
          </div>
        </div>
      </section>
      <section className="py-8 px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {WORLDS.map(world => {
              const ready = isWorldReady(world.slug);
              const total = world.adventures?.length ?? 0;
              const done = activeChild?.completionsPerWorld?.[world.slug] ?? 0;
              const progress = total > 0 ? Math.min(1, done / total) : 0;
              const inner = (
                <>
                  <div className="relative w-20 h-20 mb-4 flex items-center justify-center">
                    {ready && <ProgressRing progress={progress} color={getWorldTheme(world.slug).accent} />}
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${world.gradient} flex items-center justify-center text-3xl ${ready ? 'group-hover:scale-110 transition-transform' : ''}`}>{world.icon}</div>
                  </div>
                  <h2 className="text-lg font-bold mb-2">{world.name}</h2>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">{world.description}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">
                      {ready && activeChild ? `${done}/${total} aventures` : `${total} aventures`}
                    </span>
                    <span className={`px-3 py-1 rounded-full ${world.phase==='explorer'?'bg-blue-500/10 text-blue-400':world.phase==='creator'?'bg-emerald-500/10 text-emerald-400':'bg-orange-500/10 text-orange-400'}`}>
                      {world.phase==='explorer'?'Explorer':world.phase==='creator'?'Créer':'Construire'}
                    </span>
                  </div>
                </>
              );
              if (!ready) {
                return (
                  <div key={world.id} aria-disabled style={worldCardStyle(world.slug)} className="world-card relative p-6 rounded-2xl bg-[#111827] opacity-50 grayscale cursor-not-allowed select-none">
                    <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-white/10 text-xs text-gray-300">
                      <Lock className="w-3 h-3" /> Bientôt disponible
                    </div>
                    {inner}
                  </div>
                );
              }
              return (
                <Link key={world.id} href={`/worlds/${world.slug}`} style={worldCardStyle(world.slug)} className="world-card group relative p-6 rounded-2xl bg-[#111827] hover:-translate-y-1">
                  {inner}
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-500">
          <p>© 2026 Digital Explorers — BENILAB. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
