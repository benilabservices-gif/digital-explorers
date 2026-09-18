import Link from 'next/link';
import { WORLDS } from '@/data/content';
import { ArrowLeft } from 'lucide-react';

export default function WorldsPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Retour au dashboard
        </Link>
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Les 7 Mondes</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">Explore le numérique à travers 7 univers fascinants.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {WORLDS.map(world => (
            <Link key={world.id} href={`/worlds/${world.slug}`} className="group relative p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-indigo-500/50 transition-all hover:-translate-y-1">
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${world.gradient} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>{world.icon}</div>
              <h2 className="text-lg font-bold mb-2">{world.name}</h2>
              <p className="text-sm text-gray-400 mb-4 line-clamp-2">{world.description}</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">{world.adventures?.length || 0} aventures</span>
                <span className={`px-2 py-1 rounded-full ${world.phase==='explorer'?'bg-blue-500/10 text-blue-400':world.phase==='creator'?'bg-emerald-500/10 text-emerald-400':'bg-orange-500/10 text-orange-400'}`}>
                  {world.phase==='explorer'?'Explorer':world.phase==='creator'?'Creer':'Construire'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
