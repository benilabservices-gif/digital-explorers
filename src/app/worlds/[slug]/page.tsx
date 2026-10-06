import Link from 'next/link';
import { ArrowLeft, Lock, Sparkles } from 'lucide-react';
import { WORLDS, isWorldReady } from '@/data/content';
import { getWorldTheme } from '@/data/world-themes';
import Nav from '@/components/Nav';
import WorldThemeProvider from '@/components/world/WorldThemeProvider';
import WorldBackdrop from '@/components/world/WorldBackdrop';
import WorldMap from '@/components/world/WorldMap';

export function generateStaticParams() {
  return WORLDS.map(w => ({ slug: w.slug }));
}

export default async function WorldSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const world = WORLDS.find(w => w.slug === slug);
  if (!world) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center"><h1 className="text-2xl font-bold mb-2">Monde non trouvé</h1><Link href="/dashboard" className="text-indigo-400 hover:underline">Retour au dashboard</Link></div>
    </div>
  );
  const ready = isWorldReady(world.slug);
  const theme = getWorldTheme(world.slug);

  return (
    <WorldThemeProvider slug={world.slug} className="relative min-h-screen overflow-hidden">
      {/* Halos de fond + particules du monde */}
      <div className="absolute inset-0 world-bg-glow" aria-hidden="true" />
      <WorldBackdrop slug={world.slug} density={36} />
      <Nav />

      <div className="relative pt-28 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/worlds" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors"><ArrowLeft className="w-4 h-4" /> Tous les mondes</Link>

          {/* En-tête du monde */}
          <div className={`rounded-3xl p-8 mb-8 bg-gradient-to-br ${world.gradient} relative overflow-hidden ${ready ? '' : 'grayscale opacity-80'}`}>
            <div className="absolute inset-0 bg-black/25" />
            <div className="relative">
              <div className="text-5xl mb-3">{world.icon}</div>
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">{world.name}</h1>
              <p className="text-white/80 text-lg max-w-2xl">{world.description}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/30 border border-white/15">
                  <span className="text-base">{theme.guide.emoji}</span>
                  <span>Ton guide : <strong>{theme.guide.name}</strong> · {theme.guide.trait}</span>
                </span>
                <span className="px-3 py-1.5 rounded-full bg-black/30 border border-white/15">{world.adventures?.length ?? 0} aventures</span>
              </div>
            </div>
          </div>

          {!ready && (
            <div className="mb-8 p-5 rounded-xl world-bg-soft border world-border flex items-start gap-3">
              <Lock className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'var(--world-accent)' }} />
              <div>
                <h2 className="font-bold mb-1 world-accent">Ce monde arrive bientôt !</h2>
                <p className="text-sm text-gray-400">Les aventures ci-dessous sont en cours de rédaction. En attendant, explore les 5 mondes déjà disponibles et continue à gagner de l'XP.</p>
                <Link href="/worlds" className="inline-block mt-3 px-4 py-2 rounded-lg world-bg-soft border world-border text-sm font-medium world-accent hover:opacity-80 transition-opacity">Voir les mondes disponibles</Link>
              </div>
            </div>
          )}

          {/* Carte interactive du monde (Phase 5) */}
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Sparkles className="w-5 h-5 world-accent" /> Le chemin du monde</h2>
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

          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Sparkles className="w-5 h-5 world-accent" /> Toutes les aventures</h2>
          <div className="space-y-3">
            {world.adventures?.map((adv, idx) => {
              const item = (
                <div className="flex items-start gap-4">
                  <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border world-border flex items-center justify-center font-bold text-lg flex-shrink-0 world-accent">
                    {idx + 1}
                    {idx === 0 && ready && <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full animate-pulse" style={{ background: 'var(--world-accent)' }} />}
                  </div>
                  <div className="flex-1"><h3 className="font-bold text-lg">{adv.title}</h3><p className="text-gray-400 text-sm mt-1">{adv.description}</p></div>
                  <div className="font-bold text-sm world-accent">+{adv.xp_reward} XP</div>
                </div>
              );
              if (!ready) {
                return (
                  <div key={adv.id} className="block p-5 rounded-2xl bg-[#111827] border border-white/5 opacity-50 grayscale cursor-not-allowed select-none">
                    {item}
                  </div>
                );
              }
              return (
                <Link key={adv.id} href={`/adventure/${adv.slug}`} className="block p-5 rounded-2xl bg-[#111827] world-card hover:-translate-y-0.5">
                  {item}
                </Link>
              );
            })}
          </div>

          <div className="mt-8 p-5 rounded-2xl bg-[#111827] border border-white/5">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🌉</span>
              <div>
                <h3 className="font-bold mb-1">Tu veux aller plus loin ?</h3>
                <p className="text-sm text-gray-400 mb-3">Passe à l'action sur GeekCoding4Kids !</p>
                <a href="https://geekcoding4kids.online" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium hover:opacity-90 transition-opacity">
                  Continuer sur GeekCoding4Kids →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WorldThemeProvider>
  );
}
