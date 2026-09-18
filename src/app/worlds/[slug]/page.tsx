import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { WORLDS } from '@/data/content';

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
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors"><ArrowLeft className="w-4 h-4" /> Retour au dashboard</Link>
        <div className={`rounded-2xl p-8 mb-8 bg-gradient-to-br ${world.gradient} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative">
            <div className="text-5xl mb-3">{world.icon}</div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{world.name}</h1>
            <p className="text-white/80 text-lg">{world.description}</p>
          </div>
        </div>
        <h2 className="text-xl font-bold mb-4">Aventures</h2>
        <div className="space-y-4">
          {world.adventures?.map((adv: any, idx: number) => (
            <Link key={adv.id} href={`/adventure/${adv.slug}`} className="block p-5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-indigo-500/40 transition-all">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${world.gradient} flex items-center justify-center font-bold text-lg flex-shrink-0`}>{idx + 1}</div>
                <div className="flex-1"><h3 className="font-bold text-lg">{adv.title}</h3><p className="text-gray-400 text-sm mt-1">{adv.description}</p></div>
                <div className="text-yellow-400 font-bold text-sm">+{adv.xp_reward} XP</div>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8 p-5 rounded-xl bg-zinc-900 border border-zinc-800">
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
  );
}
