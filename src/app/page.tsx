'use client';
import Link from "next/link";
import { ArrowRight, Star, Shield, Users, Rocket } from "lucide-react";
import { WORLDS } from "@/data/content";
import Nav from "@/components/Nav";

const CHARACTERS = [
  { emoji: "👩🏾", name: "Awa", trait: "Créative", color: "#ec4899", bg: "from-pink-500/20 to-rose-500/10" },
  { emoji: "👦🏾", name: "Koffi", trait: "Logique", color: "#10b981", bg: "from-emerald-500/20 to-teal-500/10" },
  { emoji: "👦🏿", name: "Sami", trait: "Gaming", color: "#3b82f6", bg: "from-blue-500/20 to-cyan-500/10" },
  { emoji: "👩🏿", name: "Nadia", trait: "Entrepreneure", color: "#8b5cf6", bg: "from-violet-500/20 to-purple-500/10" },
  { emoji: "👦🏽", name: "Yann", trait: "Scientifique", color: "#f59e0b", bg: "from-amber-500/20 to-orange-500/10" },
];
const FEATURES = [
  { icon: "🗺️", title: "7 Mondes", desc: "Web, IA, Coding, Blockchain, Design, Cybersécurité, Innovation", color: "from-blue-500 to-cyan-400" },
  { icon: "🎮", title: "Apprendre en jouant", desc: "Des aventures interactives avec histoires, mini-jeux, quiz et missions", color: "from-purple-500 to-pink-400" },
  { icon: "🏆", title: "XP & Badges", desc: "Collectionne tes badges, grimpe en niveau et débloque des récompenses", color: "from-yellow-400 to-orange-400" },
  { icon: "🌍", title: "Fait pour l Afrique", desc: "Des contenus adaptés aux réalités africaines et aux ambitions de demain", color: "from-emerald-400 to-teal-500" },
];
const STATS = [
  { value: "7", label: "Mondes", icon: "🗺️" },
  { value: "20+", label: "Aventures", icon: "⚡" },
  { value: "50+", label: "Badges", icon: "🏆" },
  { value: "∞", label: "Possibilités", icon: "✨" },
];

export default function HomePage() {
  function goToAuth() {
    window.location.href = '/auth/signup';
  }

  return (
    <div className="min-h-screen bg-[#060810] text-white overflow-x-hidden">
      <Nav />

      <section className="relative pt-36 pb-20 px-6 min-h-screen flex items-center">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#ff6b6b]/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({length:20}).map((_,i) => (
            <div key={i} className="absolute w-1 h-1 bg-white/15 rounded-full" style={{top:Math.random()*100+"%",left:Math.random()*100+"%",animation:"pulse-glow "+(2+Math.random()*3)+"s ease-in-out infinite",animationDelay:Math.random()*3+"s"}} />
          ))}
        </div>
        <div className="relative max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 mb-8">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />🌍 Plateforme éducative africaine — 6e à Terminale
              </div>
              <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight mb-8">
                <span className="text-white">Découvre le</span><br />
                <span className="bg-gradient-to-r from-[#ff6b6b] via-[#8b5cf6] to-[#ec4899] bg-clip-text text-transparent">monde numérique</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-4">Trouve ta voie. Imagine ton futur.</p>
              <p className="text-gray-500 text-lg mb-10">Explore 7 mondes, termine des aventures, gagne des badges et construis ton portfolio.</p>
              <div className="flex flex-wrap gap-4">
                <button onClick={goToAuth} className="px-8 py-4 bg-gradient-to-r from-[#ff6b6b] to-[#8b5cf6] rounded-full font-semibold hover:opacity-90 transition-all hover:-translate-y-0.5 flex items-center gap-2 text-base shadow-lg shadow-violet-500/25">Commencer l aventure <ArrowRight className="w-5 h-5" /></button>
                <a href="#mondes"><button className="px-8 py-4 border border-white/15 rounded-full font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-all text-base">Explorer les mondes</button></a>
              </div>
              <div className="flex items-center gap-8 mt-12 text-sm text-gray-500">
                <div className="flex items-center gap-2"><Users className="w-4 h-4 text-violet-400" /><span>+2 000 explorateurs</span></div>
                <div className="flex items-center gap-2"><Star className="w-4 h-4 text-yellow-400" /><span>4.8/5 évaluation</span></div>
                <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-emerald-400" /><span>Sécurisé & RGPD</span></div>
              </div>
            </div>
            <div className="hidden lg:block relative h-[560px]">
              <div className="absolute top-0 left-0 w-48 bg-[#111827] border border-white/10 rounded-2xl p-4 animate-float">
                <div className="w-full h-20 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/10 flex items-center justify-center text-3xl mb-3">👩🏾</div>
                <div className="font-semibold text-sm">Awa</div><div className="text-xs text-gray-400">Exploratrice IA</div>
                <div className="mt-2 h-1.5 w-full bg-white/10 rounded-full overflow-hidden"><div className="h-full w-3/4 bg-gradient-to-r from-pink-500 to-rose-400 rounded-full" /></div>
                <div className="text-xs text-pink-400 mt-1">Nv. 12</div>
              </div>
              <div className="absolute top-20 left-1/2 -translate-x-1/2 w-60 bg-[#111827] border border-white/10 rounded-2xl p-5 shadow-lg animate-float" style={{animationDelay:"0.5s"}}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-2xl">👦🏾</div>
                  <div className="flex-1"><div className="font-semibold text-base">Koffi</div><div className="text-xs text-gray-400">Codeur en herbe</div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mt-1.5"><div className="h-full w-3/4 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full" /></div>
                  </div><div className="text-right"><div className="text-xl font-bold text-yellow-400">2450</div><div className="text-xs text-gray-500">XP</div></div>
                </div>
                <div className="grid grid-cols-3 gap-2">{["🌐","🤖","💻"].map((ic,i) => (<div key={i} className="bg-white/5 border border-white/10 rounded-lg p-2 text-center text-lg">{ic}</div>))}</div>
              </div>
              <div className="absolute bottom-12 right-0 w-44 bg-[#111827] border border-white/10 rounded-2xl p-3 animate-float" style={{animationDelay:"1s"}}>
                <div className="flex items-center gap-3"><div className="text-2xl">👩🏿</div><div><div className="font-semibold text-xs">Nadia</div><div className="text-xs text-gray-400">vient de terminer une aventure</div></div><div className="ml-auto text-yellow-400 text-xs font-bold">+100 XP</div></div>
              </div>
              <div className="absolute bottom-32 left-0 w-40 bg-[#111827] border border-white/10 rounded-2xl p-3 animate-float" style={{animationDelay:"1.5s"}}>
                <div className="flex items-center gap-3"><div className="text-xl">👦🏿</div><div><div className="font-semibold text-xs">Sami</div><div className="text-xs text-gray-400">a gagné le badge 🔐 Cyber Hero</div></div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-6 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s,i) => (
              <div key={i} className="text-center">
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#ff6b6b] to-[#8b5cf6] bg-clip-text text-transparent">{s.value}</div>
                <div className="text-sm text-gray-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm text-violet-400 font-medium uppercase tracking-wider mb-3">Pourquoi nous choisir</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">Une aventure <span className="bg-gradient-to-r from-[#ff6b6b] to-[#8b5cf6] bg-clip-text text-transparent">conçue pour toi</span></h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Conçue par et pour les jeunes Africains curieux du numérique.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f,i) => (
              <div key={i} className="bg-[#111827] border border-white/5 rounded-2xl p-6 hover:border-violet-500/30 transition-all duration-300 hover:-translate-y-1">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-2xl mb-5`}>{f.icon}</div>
                <h3 className="font-display font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="mondes" className="py-24 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div><p className="text-sm text-violet-400 font-medium uppercase tracking-wider mb-3">Les 7 Mondes</p><h2 className="font-display text-4xl md:text-5xl font-bold">Explore, <span className="bg-gradient-to-r from-[#ff6b6b] to-[#8b5cf6] bg-clip-text text-transparent">crée</span>, inspires-toi</h2></div>
            <button onClick={goToAuth} className="px-4 py-2 text-sm border border-white/10 rounded-full text-gray-300 hover:bg-white/5 hover:text-white transition-all hidden sm:flex items-center gap-1">Commencer <ArrowRight className="w-3.5 h-3.5" /></button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {WORLDS.slice(0,4).map(world => (
              <div key={world.id} onClick={goToAuth} className="group cursor-pointer bg-[#111827] border border-white/5 rounded-2xl p-5 hover:border-violet-500/30 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                <div className={`w-full h-32 rounded-xl bg-gradient-to-br ${world.gradient} flex items-center justify-center text-5xl mb-5 group-hover:scale-105 transition-transform duration-300`}>{world.icon}</div>
                <h3 className="font-display font-bold text-lg mb-2 group-hover:text-violet-300 transition-colors">{world.name}</h3>
                <p className="text-sm text-gray-400 line-clamp-2 mb-4 flex-1">{world.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">{world.adventures?.length || 0} aventures</span>
                  <span className={`px-3 py-1 rounded-full ${world.phase==="explorer"?"bg-blue-500/15 text-blue-300":world.phase==="creator"?"bg-emerald-500/15 text-emerald-300":"bg-orange-500/15 text-orange-300"}`}>
                    {world.phase==="explorer"?"🌍 Explorer":world.phase==="creator"?"🛠️ Créer":"🚀 Construire"}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden"><button onClick={goToAuth} className="px-6 py-3 border border-white/10 rounded-full text-gray-300 hover:bg-white/5 transition-all">Voir tous les mondes →</button></div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm text-violet-400 font-medium uppercase tracking-wider mb-3">Ta team</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">Rencontre <span className="bg-gradient-to-r from-[#ff6b6b] to-[#8b5cf6] bg-clip-text text-transparent">tes guides</span></h2>
          <p className="text-gray-400 text-lg mb-16 max-w-xl mx-auto">Awa, Koffi, Sami, Nadia et Yann t accompagnent dans chaque aventure.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {CHARACTERS.map(char => (
              <div key={char.name} className="flex flex-col items-center gap-3 group cursor-pointer">
                <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${char.bg} border border-white/10 flex items-center justify-center text-5xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>{char.emoji}</div>
                <div><div className="font-display font-bold text-base">{char.name}</div><div className="text-xs text-gray-400">{char.trait}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px]" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm mb-8"><Rocket className="w-4 h-4" /> Gratuit · Pas de publicité · Fait avec ❤️ en Afrique</div>
          <h2 className="font-display text-5xl md:text-6xl font-bold mb-6 leading-tight">Prêt à commencer<br /><span className="bg-gradient-to-r from-[#ff6b6b] to-[#8b5cf6] bg-clip-text text-transparent">ton exploration ?</span></h2>
          <p className="text-gray-400 text-xl mb-10 max-w-xl mx-auto">Crée ton profil en 2 minutes et découvre ton premier parcours personnalisé.</p>
          <button onClick={goToAuth} className="px-12 py-5 bg-gradient-to-r from-[#ff6b6b] to-[#8b5cf6] rounded-full font-semibold text-lg hover:opacity-90 transition-opacity hover:-translate-y-0.5 flex items-center gap-3 mx-auto shadow-lg shadow-violet-500/25">Créer mon profil gratuitement <ArrowRight className="w-5 h-5" /></button>
          <p className="text-gray-500 text-sm mt-6">Déjà un compte ? <Link href="/auth/login" className="text-violet-400 hover:underline">Se connecter</Link></p>
        </div>
      </section>

      <footer className="border-t border-white/5 py-16 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4"><div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#ff6b6b] to-[#8b5cf6] flex items-center justify-center text-sm font-bold">DE</div><span className="font-display font-bold text-lg">Digital Explorers</span></div>
              <p className="text-sm text-gray-400 leading-relaxed">Découvre le monde numérique. Trouve ta voie. Imagine ton futur.</p>
            </div>
            <div><h4 className="font-semibold text-sm mb-4 text-gray-300">Mondes</h4><ul className="space-y-2 text-sm text-gray-500">{WORLDS.slice(0,4).map(w => <li key={w.id}><button onClick={goToAuth} className="hover:text-white transition-colors cursor-pointer">{w.name}</button></li>)}</ul></div>
            <div><h4 className="font-semibold text-sm mb-4 text-gray-300">Espaces</h4><ul className="space-y-2 text-sm text-gray-500"><li><button onClick={goToAuth} className="hover:text-white transition-colors cursor-pointer">Dashboard</button></li><li><button onClick={goToAuth} className="hover:text-white transition-colors cursor-pointer">Portfolio</button></li><li><button onClick={goToAuth} className="hover:text-white transition-colors cursor-pointer">Espace Parent</button></li></ul></div>
            <div><h4 className="font-semibold text-sm mb-4 text-gray-300">Liens</h4><ul className="space-y-2 text-sm text-gray-500"><li><span className="hover:text-white transition-colors cursor-pointer">À propos</span></li><li><span className="hover:text-white transition-colors cursor-pointer">Confidentialité</span></li><li><Link href="https://geekcoding4kids.online" target="_blank" className="hover:text-white transition-colors">GeekCoding4Kids</Link></li></ul></div>
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
            <p>© 2026 Digital Explorers — BENILAB. Fait avec ❤️ en Afrique.</p>
            <div className="flex items-center gap-4"><Link href="https://github.com/benilabservices-gif" target="_blank" className="hover:text-white transition-colors">GitHub</Link><span>·</span><span>v2.2.0</span></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
