import Link from 'next/link';
import { ArrowLeft, BookOpen, Trophy, FolderOpen, Rocket, Shield } from 'lucide-react';

export default function ParentPage() {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors"><ArrowLeft className="w-4 h-4" /> Retour au dashboard</Link>
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Espace Parent</h1>
          <p className="text-white/80">Suis la progression de ton enfant en toute transparence.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {icon:BookOpen,title:'Progression',desc:"Aventures terminees, competences acquises",color:'text-blue-400'},
            {icon:Trophy,title:'Badges',desc:'Recompenses obtenues par ton enfant',color:'text-yellow-400'},
            {icon:FolderOpen,title:'Projets',desc:'Creations et soumissions',color:'text-emerald-400'},
            {icon:Rocket,title:'Digital Bridge',desc:"Recommandations vers GeekCoding4Kids",color:'text-orange-400'},
          ].map((card,i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-indigo-500/30 transition-colors">
              <card.icon className={`w-8 h-8 ${card.color} mb-3`} /><h3 className="font-bold text-lg mb-1">{card.title}</h3><p className="text-sm text-gray-400">{card.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="font-bold mb-3 flex items-center gap-2"><Shield className="w-5 h-5 text-emerald-400" /> Confidentialite & Securite</h2>
          <ul className="space-y-2 text-sm text-gray-400">
            {['Donnees minimales (RGPD)','Pas de publicite ciblée','Donnees chiffrées','Controle parental'].map((item,i) => (<li key={i} className="flex items-start gap-2"><span className="text-emerald-400">✓</span>{item}</li>))}
          </ul>
        </div>
      </div>
    </div>
  );
}
