import Link from "next/link";
import { ArrowRight, Rocket } from "lucide-react";
import { WORLDS } from "@/data/content";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-indigo-500/10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500 rounded-full blur-[128px] opacity-20" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full blur-[128px] opacity-15" />
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
            <span className="text-2xl">🌍</span>
            <span className="text-sm text-gray-300">Plateforme éducative africaine</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Digital Explorers
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-4">Découvre le monde numérique.</p>
          <p className="text-lg md:text-xl text-gray-400 mb-10">Trouve ta voie. Imagine ton futur.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold px-8 py-4 text-lg rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                Commencer l'aventure
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </Link>
            <Link href="/auth/login">
              <button className="border border-white/20 text-white font-medium px-8 py-4 text-lg rounded-xl hover:bg-white/10 transition-colors">
                Connexion
              </button>
            </Link>
          </div>
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[{icon:"🎯",label:"7 mondes",sub:"à explorer"},{icon:"🏆",label:"XP & Badges",sub:"gamification"},{icon:"🧠",label:"Adaptatif",sub:"par niveau"},{icon:"🌉",label:"Digital Bridge",sub:"vers GeekCoding4Kids"}].map((item,i) => (
              <div key={i} className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="font-semibold">{item.label}</div>
                <div className="text-sm text-gray-400">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Choisis ton parcours</h2>
          <p className="text-gray-400 text-center mb-12 text-lg">7 mondes t'attendent. Explore, apprends, crée.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {WORLDS.map(world => (
              <Link key={world.id} href={`/worlds/${world.slug}`} className="group relative p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-indigo-500/50 transition-all duration-300 hover:-translate-y-1">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${world.gradient} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>{world.icon}</div>
                <h3 className="text-lg font-bold mb-2">{world.name}</h3>
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">{world.description}</p>
                <div className="flex items-center text-indigo-400 text-sm font-medium">
                  Explorer <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 px-4 bg-zinc-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Rencontre ton équipe</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              {emoji:"👩🏾",name:"Awa",trait:"Créative",color:"from-pink-500 to-rose-400"},
              {emoji:"👦🏾",name:"Koffi",trait:"Logique",color:"from-emerald-500 to-teal-400"},
              {emoji:"👦🏿",name:"Sami",trait:"Gaming",color:"from-blue-500 to-cyan-400"},
              {emoji:"👩🏿",name:"Nadia",trait:"Entrepreneure",color:"from-violet-500 to-purple-400"},
              {emoji:"👦🏽",name:"Yann",trait:"Scientifique",color:"from-amber-500 to-orange-400"},
            ].map(char => (
              <div key={char.name} className="text-center">
                <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${char.color} flex items-center justify-center text-3xl mb-3`}>{char.emoji}</div>
                <div className="font-bold">{char.name}</div>
                <div className="text-xs text-gray-400">{char.trait}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Prêt à commencer ton exploration ?</h2>
          <p className="text-gray-400 text-lg mb-8">Rejoins des milliers de jeunes Africains qui découvrent le monde numérique.</p>
          <Link href="/auth/signup">
            <button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold px-10 py-4 text-lg rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto">
              Créer mon profil <Rocket className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </section>
      <footer className="border-t border-zinc-800 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center text-sm text-gray-500">
          <p>© 2026 Digital Explorers — BENILAB. Fait avec ❤️ en Afrique.</p>
        </div>
      </footer>
    </div>
  );
}
