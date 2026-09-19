import Link from 'next/link';
import { WORLDS } from '@/data/content';
import { ArrowLeft } from 'lucide-react';

export default function WorldsPage() {
  return (
    <div className="min-h-screen bg-[#060810] text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#060810]/70 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff6b6b] to-[#8b5cf6] flex items-center justify-center text-sm font-bold">DE</div><span className="font-bold text-lg tracking-tight">Digital Explorers</span></Link>
          <div className="flex items-center gap-3">
            <Link href="/pricing"><button className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors">Tarifs</button></Link>
            <Link href="/auth/login"><button className="px-4 py-2 text-sm border border-white/10 rounded-full text-gray-300 hover:bg-white/5 transition-all">Connexion</button></Link>
            <Link href="/auth/signup"><button className="px-5 py-2 text-sm bg-gradient-to-r from-[#ff6b6b] to-[#8b5cf6] rounded-full font-semibold hover:opacity-90 transition-opacity">Commencer</button></Link>
          </div>
        </div>
      </nav>
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors"><ArrowLeft className="w-4 h-4" /> Retour au dashboard</Link>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm mb-4">🗺️ 7 univers interactifs</div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">Les 7 Mondes</h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Explore le numérique à travers des univers fascinants conçus pour les jeunes africains.</p>
          </div>
        </div>
      </section>
      <section className="py-8 px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {WORLDS.map(world => (
              <Link key={world.id} href={`/worlds/${world.slug}`} className="group relative p-6 rounded-2xl bg-[#111827] border border-white/5 hover:border-violet-500/30 transition-all hover:-translate-y-1">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${world.gradient} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>{world.icon}</div>
                <h2 className="text-lg font-bold mb-2">{world.name}</h2>
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">{world.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">{world.adventures?.length || 0} aventures</span>
                  <span className={`px-3 py-1 rounded-full ${world.phase==='explorer'?'bg-blue-500/10 text-blue-400':world.phase==='creator'?'bg-emerald-500/10 text-emerald-400':'bg-orange-500/10 text-orange-400'}`}>
                    {world.phase==='explorer'?'Explorer':world.phase==='creator'?'Créer':'Construire'}
                  </span>
                </div>
              </Link>
            ))}
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
