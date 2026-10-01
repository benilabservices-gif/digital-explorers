import Link from 'next/link';
import { ArrowLeft, Lock } from 'lucide-react';
import { WORLDS, isWorldReady } from '@/data/content';

export function generateStaticParams() {
  return WORLDS.map(w => ({ slug: w.slug }));
}

export default async function WorldSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const world = WORLDS.find(w => w.slug === slug);
  if (!world) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center"><h1 className="text-2xl font-bold mb-2">Monde non trouve</h1><Link href="/dashboard" className="text-indigo-400 hover:underline">Retour au dashboard</Link></div>
    </div>
  );
  const ready = isWorldReady(world.slug);
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors"><ArrowLeft className="w-4 h-4" /> Retour au dashboard</Link>
        <div className={`rounded-2xl p-8 mb-8 bg-gradient-to-br ${world.gradient} relative overflow-hidden ${ready ? '' : 'grayscale opacity-80'}`}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative">
            <div className="text-5xl mb-3">{world.icon}</div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{world.name}</h1>
            <p className="text-white/80 text-lg">{world.description}</p>
          </div>
        </div>
        {!ready && (
          <div className="mb-8 p-5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
            <Lock className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <h2 className="font-bold text-amber-300 mb-1">Ce monde arrive bientôt !</h2>
              <p className="text-sm text-gray-400">Les aventures ci-dessous sont en cours de rédaction. En attendant, explore les 5 mondes déjà disponibles et continue à gagner de l'XP.</p>
              <Link href="/worlds" className="inline-block mt-3 px-4 py-2 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 text-sm font-medium hover:bg-amber-500/30 transition-colors">Voir les mondes disponibles</Link>
            </div>
          </div>
        )}
        <h2 className="text-xl font-bold mb-4">Aventures</h2>
        <div className="space-y-4">
          {world.adventures?.map((adv, idx) => {
            const item = (
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${world.gradient} flex items-center justify-center font-bold text-lg flex-shrink-0`}>{idx + 1}</div>
                <div className="flex-1"><h3 className="font-bold text-lg">{adv.title}</h3><p className="text-gray-400 text-sm mt-1">{adv.description}</p></div>
                <div className="text-yellow-400 font-bold text-sm">+{adv.xp_reward} XP</div>
              </div>
            );
            if (!ready) {
              return (
                <div key={adv.id} className="block p-5 rounded-xl bg-zinc-900 border border-zinc-800 opacity-50 grayscale cursor-not-allowed select-none">
                  {item}
                </div>
              );
            }
            return (
              <Link key={adv.id} href={`/adventure/${adv.slug}`} className="block p-5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-indigo-500/40 transition-all">
                {item}
              </Link>
            );
          })}
        </div>
        <div className="mt-8 p-5 rounded-xl bg-zinc-900 border border-zinc-800">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🌉</span>
            <div>
              <h3 className="font-bold mb-1">Tu veux aller plus loin ?</h3>
              <p className="text-sm text-gray-400 mb-3">Passe à l&apos;action sur GeekCoding4Kids !</p>
              <a href="https://geekcoding4kids.online" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium hover:opacity-90 transition-opacity">
                Continuer sur GeekCoding4Kids →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
