import Link from "next/link";
import { ArrowRight, Rocket, Star, Shield, Users } from "lucide-react";
import { WORLDS } from "@/data/content";

const CHARACTERS = [
  { emoji: "👩🏾", name: "Awa", trait: "Créative", color: "#ec4899" },
  { emoji: "👦🏾", name: "Koffi", trait: "Logique", color: "#10b981" },
  { emoji: "👦🏿", name: "Sami", trait: "Gaming", color: "#3b82f6" },
  { emoji: "👩🏿", name: "Nadia", trait: "Entrepreneure", color: "#8b5cf6" },
  { emoji: "👦🏽", name: "Yann", trait: "Scientifique", color: "#f59e0b" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold">DE</div>
            <span className="font-semibold text-lg tracking-tight">Digital Explorers</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/worlds"><button className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors">Mondes</button></Link>
            <Link href="/portfolio"><button className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors">Portfolio</button></Link>
            <Link href="/auth/login"><button className="px-4 py-2 text-sm border border-zinc-700 rounded-lg text-gray-300 hover:bg-zinc-800 transition-all">Connexion</button></Link>
            <Link href="/auth/signup"><button className="px-4 py-2 text-sm bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg font-medium hover:opacity-90 transition-opacity">Commencer</button></Link>
          </div>
        </div>
      </nav>
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-32 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-[120px]" />
        </div>
        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Plateforme éducative africaine — 6e à Terminale
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6">
                <span className="text-white">Découvre le</span><br />
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">monde numérique</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-400 leading-relaxed mb-8 max-w-lg">
                Trouve ta voie. Imagine ton futur.
                <span className="text-gray-500 block mt-2">Explore 7 mondes, termine des aventures, gagne des badges et construit ton portfolio.</span>
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/auth/signup">
                  <button className="px-7 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl font-semibold hover:opacity-90 transition-all hover:-translate-y-0.5 flex items-center gap-2 text-base">
                    Commencer l'aventure <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
                <Link href="/worlds">
                  <button className="px-7 py-3.5 border border-zinc-700 rounded-xl font-medium text-gray-300 hover:bg-zinc-800 hover:text-white transition-all text-base">Explorer les mondes</button>
                </Link>
              </div>
              <div className="flex items-center gap-6 mt-10 text-sm text-gray-500">
                <div className="flex items-center gap-2"><Users className="w-4 h-4 text-indigo-400" /><span>+2 000 explorateurs</span></div>
                <div className="flex items-center gap-2"><Star className="w-4 h-4 text-yellow-400" /><span>4.8/5 évaluation</span></div>
                <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-emerald-400" /><span>Sécurisé & RGPD</span></div>
              </div>
            </div>
            <div className="hidden lg:flex relative justify-center">
              <div className="relative w-full max-w-sm">
                <div className="absolute -top-4 left-0 right-0 bg-[#111118] border border-zinc-800 rounded-2xl p-4 flex items-center gap-3 animate-float">
                  <div className="text-3xl">👩🏾</div>
                  <div><div className="font-semibold text-sm">Awa</div><div className="text-xs text-gray-400">Exploratrice IA</div></div>
                  <div className="ml-auto px-2 py-1 rounded-full bg-indigo-500/15 text-indigo-300 text-xs font-medium">Nv. 12</div>
                </div>
                <div className="bg-[#111118] border border-zinc-700 rounded-2xl p-6 shadow-lg mt-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-2xl">👦🏾</div>
                    <div className="flex-1"><div className="font-semibold text-base">Koffi</div><div className="text-xs text-gray-400">Codeur en herbe</div>
                      <div className="flex items-center gap-2 mt-2"><div className="h-1.5 w-full bg-zinc-700 rounded-full overflow-hidden"><div className="h-full w-3/4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" /></div><span className="text-xs text-gray-500">75%</span></div>
                    </div>
                    <div className="text-right"><div className="text-xl font-bold text-yellow-400">2 450</div><div className="text-xs text-gray-500">XP</div></div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {["🌐","🤖","💻"].map((icon,i) => (<div key={i} className="bg-zinc-800/60 border border-zinc-700 rounded-lg p-2 text-center text-lg">{icon}</div>))}
                  </div>
                </div>
                <div className="absolute -bottom-4 right-0 bg-[#111118] border border-zinc-800 rounded-2xl p-3 flex items-center gap-3 animate-float" style={{animationDelay:"1s"}}>
                  <div className="text-2xl">👩🏿</div>
                  <div><div className="font-semibold text-xs">Nadia</div><div className="text-xs text-gray-400">vient de terminer une aventure</div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm text-indigo-400 font-medium uppercase tracking-wider mb-3">Pourquoi nous choisir</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Une plateforme pensée pour toi</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Conçue par et pour les jeunes Africains curieux du numérique.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: "🗺️", title: "7 Mondes", desc: "Web, IA, Coding, Blockchain, Design, Cybersécurité, Innovation" },
              { icon: "🎮", title: "Apprendre en jouant", desc: "Des aventures interactives avec histoires, quiz et missions" },
              { icon: "🏆", title: "Gagne par XP & Badges", desc: "Collectionne tes badges et progresse à ton rythme" },
              { icon: "🌍", title: "Fait pour l'Afrique", desc: "Contenu adapté aux réalités et ambitions africaines" },
            ].map((f, i) => (
              <div key={i} className="bg-[#111118] border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-base mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sm text-indigo-400 font-medium uppercase tracking-wider mb-2">Les 7 Mondes</p>
              <h2 className="text-3xl md:text-4xl font-bold">Explore, apprends, crée</h2>
            </div>
            <Link href="/worlds">
              <button className="px-4 py-2 text-sm border border-zinc-700 rounded-lg text-gray-300 hover:bg-zinc-800 hover:text-white transition-all hidden sm:flex items-center gap-1">
                Voir tout <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {WORLDS.map(world => (
              <Link key={world.id} href={`/worlds/${world.slug}`} className="bg-[#111118] border border-zinc-800 rounded-xl p-5 hover:border-zinc-600 transition-all group cursor-pointer">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${world.gradient} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>{world.icon}</div>
                <h3 className="font-semibold text-base mb-1 group-hover:text-indigo-300 transition-colors">{world.name}</h3>
                <p className="text-sm text-gray-400 line-clamp-2 mb-4">{world.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">{world.adventures?.length || 0} aventures</span>
                  <span className={`px-2 py-0.5 rounded-full ${world.phase==='explorer'?'bg-blue-500/15 text-blue-300':world.phase==='creator'?'bg-emerald-500/15 text-emerald-300':'bg-orange-500/15 text-orange-300'}`}>
                    {world.phase==='explorer'?'Explorer':world.phase==='creator'?'Créer':'Construire'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm text-indigo-400 font-medium uppercase tracking-wider mb-3">Ton équipe</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Rencontre tes guides</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {CHARACTERS.map(char => (
              <div key={char.name} className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl" style={{ background: `${char.color}20`, border: `1px solid ${char.color}40` }}>
                  {char.emoji}
                </div>
                <div>
                  <div className="font-semibold text-sm">{char.name}</div>
                  <div className="text-xs text-gray-400">{char.trait}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm mb-6">
            <Rocket className="w-4 h-4" /> Gratuit · Pas de publicité · Conçu pour toi
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">
            Prêt à commencer<br /><span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">ton exploration ?</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">Crée ton profil en 2 minutes et découvre ton premier parcours personnalisé.</p>
          <Link href="/auth/signup">
            <button className="px-10 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity hover:-translate-y-0.5 flex items-center gap-2 mx-auto">
              Créer mon profil gratuitement <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4"><div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold">DE</div><span className="font-semibold">Digital Explorers</span></div>
              <p className="text-sm text-gray-500 leading-relaxed">Découvre le monde numérique. Trouve ta voie. Imagine ton futur.</p>
            </div>
            <div><h4 className="font-semibold text-sm mb-4 text-gray-300">Mondes</h4><ul className="space-y-2 text-sm text-gray-500">{WORLDS.slice(0,4).map(w => <li key={w.id}><Link href={`/worlds/${w.slug}`} className="hover:text-white transition-colors">{w.name}</Link></li>)}</ul></div>
            <div><h4 className="font-semibold text-sm mb-4 text-gray-300">Espaces</h4><ul className="space-y-2 text-sm text-gray-500"><li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li><li><Link href="/portfolio" className="hover:text-white transition-colors">Portfolio</Link></li><li><Link href="/parent" className="hover:text-white transition-colors">Espace Parent</Link></li></ul></div>
            <div><h4 className="font-semibold text-sm mb-4 text-gray-300">Liens</h4><ul className="space-y-2 text-sm text-gray-500"><li><span className="hover:text-white transition-colors cursor-pointer">À propos</span></li><li><span className="hover:text-white transition-colors cursor-pointer">Confidentialité</span></li><li><Link href="https://geekcoding4kids.online" target="_blank" className="hover:text-white transition-colors">GeekCoding4Kids</Link></li></ul></div>
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
            <p>© 2026 Digital Explorers — BENILAB. Fait avec ❤️ en Afrique.</p>
            <div className="flex items-center gap-4"><Link href="https://github.com/benilabservices-gif" target="_blank" className="hover:text-white transition-colors">GitHub</Link><span>·</span><span>v1.0.0</span></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
