import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { WORLDS } from '@/data/content';

export function generateStaticParams() {
  const adventures: { slug: string }[] = [];
  for (const w of WORLDS) {
    for (const a of (w.adventures || [])) adventures.push({ slug: a.slug });
  }
  return adventures;
}

export default async function AdventureSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let adventure: any = null;
  let world: any = null;
  for (const w of WORLDS) {
    const found = w.adventures?.find((a: any) => a.slug === slug);
    if (found) { adventure = found; world = w; break; }
  }
  if (!adventure || !world) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center"><h1 className="text-2xl font-bold mb-2">Aventure non trouvee</h1><Link href="/dashboard" className="text-indigo-400 hover:underline">Retour au dashboard</Link></div>
    </div>
  );
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href={`/worlds/${world.slug}`} className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors"><ArrowLeft className="w-4 h-4" /> Retour à {world.name}</Link>
        <div className={`rounded-2xl p-6 mb-6 bg-gradient-to-r ${world.gradient} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative">
            <h1 className="text-2xl font-bold mb-1">{adventure.title}</h1>
            <p className="text-white/80 text-sm">{adventure.description}</p>
            <div className="mt-3 text-sm text-white/60">+{adventure.xp_reward} XP</div>
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
          <p className="text-gray-300 leading-relaxed whitespace-pre-line">{adventure.story || adventure.description}</p>
        </div>
        <div className="flex justify-end">
          <Link href="/dashboard">
            <button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold px-6 py-2 rounded-xl hover:opacity-90 transition-opacity">
              Terminer l'aventure (+{adventure.xp_reward} XP)
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
