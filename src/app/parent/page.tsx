import Link from 'next/link';
import { ArrowLeft, BookOpen, Trophy, FolderOpen, Rocket, Shield } from 'lucide-react';

export default function ParentPage() {
  return (
    <div className="min-h-screen bg-[#060810] text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#060810]/70 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff6b6b] to-[#8b5cf6] flex items-center justify-center text-sm font-bold">DE</div><span className="font-bold text-lg tracking-tight">Digital Explorers</span></Link>
          <div className="flex items-center gap-3">
            <Link href="/auth/login"><button className="px-4 py-2 text-sm border border-white/10 rounded-full text-gray-300 hover:bg-white/5 transition-all">Connexion</button></Link>
            <Link href="/auth/signup"><button className="px-5 py-2 text-sm bg-gradient-to-r from-[#ff6b6b] to-[#8b5cf6] rounded-full font-semibold hover:opacity-90 transition-opacity">Commencer</button></Link>
          </div>
        </div>
      </nav>
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors"><ArrowLeft className="w-4 h-4" /> Retour au dashboard</Link>
          <div className="bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-violet-500/30 rounded-2xl p-8 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs mb-4">👨‍👩‍👧 Espace sécurisé</div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Espace Parent</h1>
            <p className="text-gray-400">Suis la progression de ton enfant en toute transparence.</p>
          </div>
        </div>
      </section>
      <section className="py-8 px-6 pb-24">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {icon:BookOpen,title:'Progression',desc:"Aventures terminées, compétences acquises",color:'text-blue-400'},
              {icon:Trophy,title:'Badges',desc:'Récompenses obtenues par ton enfant',color:'text-yellow-400'},
              {icon:FolderOpen,title:'Projets',desc:'Créations et soumissions',color:'text-emerald-400'},
              {icon:Rocket,title:'Digital Bridge',desc:"Recommandations vers GeekCoding4Kids",color:'text-orange-400'},
            ].map((card,i) => (
              <div key={i} className="bg-[#111827] border border-white/5 rounded-xl p-6 hover:border-white/10 transition-colors">
                <card.icon className={`w-8 h-8 ${card.color} mb-3`} /><h3 className="font-bold text-lg mb-1">{card.title}</h3><p className="text-sm text-gray-400">{card.desc}</p>
              </div>
            ))}
          </div>
          <div className="bg-[#111827] border border-white/5 rounded-xl p-6">
            <h2 className="font-bold mb-3 flex items-center gap-2"><Shield className="w-5 h-5 text-emerald-400" /> Confidentialité & Sécurité</h2>
            <ul className="space-y-2 text-sm text-gray-400">
              {['Données minimales (RGPD)','Pas de publicité ciblée','Données chiffrées','Contrôle parental'].map((item,i) => (<li key={i} className="flex items-start gap-2"><span className="text-emerald-400">✓</span>{item}</li>))}
            </ul>
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
