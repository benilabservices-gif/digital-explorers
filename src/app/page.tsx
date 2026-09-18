import Link from "next/link";
import { ArrowRight, Rocket, Star, Shield, Users } from "lucide-react";
import { WORLDS } from "@/data/content";

const CHARACTERS = [
  { emoji: "👩🏾", name: "Awa", trait: "Créative", bio: "Passionnée par l'IA et le design", color: "#ec4899" },
  { emoji: "👦🏾", name: "Koffi", trait: "Logique", bio: "Bricoleur, amoureux du code", color: "#10b981" },
  { emoji: "👦🏿", name: "Sami", trait: "Gaming", bio: "Créateur de jeux et d'aventures", color: "#3b82f6" },
  { emoji: "👩🏿", name: "Nadia", trait: "Entrepreneure", bio: "Solutionneuse, visionnaire", color: "#8b5cf6" },
  { emoji: "👦🏽", name: "Yann", trait: "Scientifique", bio: "Curieux, passionné de robotique", color: "#f59e0b" },
];

const FEATURES = [
  { icon: "🗺️", title: "7 Mondes à explorer", desc: "Web, IA, Coding, Blockchain, Design, Cybersecurité, Innovation" },
  { icon: "🎮", title: "Apprendre en jouant", desc: "Des aventures interactives avec histoires, quiz et missions" },
  { icon: "🏆", title: "Gagné par XP & Badges", desc: "Collectionne tes badges et progresse à ton rythme" },
  { icon: "🌍", title: "Fait pour l'Afrique", desc: "Contenu adapté aux réalités et ambitions africaines" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-sm font-bold">DE</div>
            <span className="font-display font-bold text-lg tracking-tight">Digital Explorers</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/worlds"><button className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors">Mondes</button></Link>
            <Link href="/portfolio"><button className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors">Portfolio</button></Link>
            <Link href="/auth/login"><button className="btn-outline text-sm">Connexion</button></Link>
            <Link href="/auth/signup"><button className="btn-primary text-sm px-5">Commencer</button></Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-32 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Plateforme éducative africaine — 6e à Terminale
              </div>

              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6">
                <span className="text-white">Découvre le</span>
                <br />
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  monde numérique
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-400 leading-relaxed mb-8 max-w-lg">
                Trouve ta voie. Imagine ton futur.
                <br />
                <span className="text-gray-500">Explore 7 mondes, termine des aventures, gagne des badges et construit ton portfolio.</span>
              </p>

              <div className="flex flex-wrap gap-3">
                <Link href="/auth/signup">
                  <button className="btn-primary px-7 py-3.5 text-base gap-2">
                    Commencer l'aventure
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
                <Link href="/worlds">
                  <button className="btn-outline px-7 py-3.5 text-base">
                    Explorer les mondes
                  </button>
                </Link>
              </div>

              <div className="flex items-center gap-6 mt-10 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-400" />
                  <span>+2 000 explorateurs</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>4.8/5 évaluation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>Sécurisé & RGPD</span>
                </div>
              </div>
            </div>

            {/* Hero visual — character cards */}
            <div className="hidden lg:flex relative justify-center">
              <div className="relative w-full max-w-sm">
                {/* Top card */}
                <div className="absolute -top-4 left-0 right-0 bg-surface-2 border border-border rounded-2xl p-4 flex items-center gap-3 animate-float">
                  <div className="text-3xl">👩🏾</div>
                  <div>
                    <div className="font-semibold text-sm">Awa</div>
                    <div className="text-xs text-gray-400">Exploratrice IA</div>
                  </div>
                  <div className="ml-auto badge badge-primary">Nv. 12</div>
                </div>
                {/* Center large card */}
                <div className="bg-surface border border-border-light rounded-2xl p-6 shadow-glow mt-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center text-2xl">👦🏾</div>
                    <div>
                      <div className="font-semibold text-base">Koffi</div>
                      <div className="text-xs text-gray-400">Codeur en herbe</div>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="h-1.5 w-20 bg-zinc-700 rounded-full overflow-hidden">
                          <div className="h-full w-3/4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
                        </div>
                        <span className="text-xs text-gray-500">75%</span>
                      </div>
                    </div>
                    <div className="ml-auto text-right">
                      <div className="text-2xl font-display font-bold text-yellow-400">2 450</div>
                      <div className="text-xs text-gray-500">XP total</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {["🌐","🤖","💻"].map((icon,i) => (
                      <div key={i} className="bg-zinc-800/60 border border-border rounded-lg p-2 text-center text-lg">{icon}</div>
                    ))}
                  </div>
                </div>
                {/* Bottom card */}
                <div className="absolute -bottom-4 right-0 bg-surface-2 border border-border rounded-2xl p-3 flex items-center gap-3 animate-float" style={{animationDelay:"1s"}}>
                  <div className="text-2xl">👩🏿</div>
                  <div>
                    <div className="font-semibold text-xs">Nadia</div>
                    
