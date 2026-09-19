'use client';
import { useState } from "react";
import Link from "next/link";
import { Check, Star, Shield, ArrowRight, Zap, Sparkles } from "lucide-react";

const PLANS = [
  { id:"free", name:"Explorateur", tagline:"Découvrir gratuitement", price:"0", period:"Jamais", icon:"🌱", features:["1 monde complet","3 aventures gratuites","Quiz de base","Badge premier projet","Dashboard","1 espace Parent"], cta:"Commencer gratuitement", ctaLink:"/auth/signup", popular:false },
  { id:"monthly", name:"Aventurier", tagline:"Accès complet mois par mois", price:"2 500", period:"FCFA/mois", icon:"⚡", badge:"Populaire", features:["7 mondes complets","Aventures illimitées","Quiz IA","Badges illimités","Passport complet","Feedback IA","Early Features","Support prioritaire","3 enfants"], cta:"Démarrer l aventure", ctaLink:"/auth/signup", popular:true },
  { id:"annual", name:"Pro", tagline:"Économise 33%", price:"20 000", period:"FCFA/an", icon:"👑", badge:"Meilleur rapport", features:["Tout Aventurier","3 mois offerts","Certificats","Rapport parent","Accès anticipé","Badge exclusif","Africa Makers","Webinaires"], cta:"Devenir Pro", ctaLink:"/auth/signup", popular:false },
];

const PAYMENTS = [
  { name:"Orange Money", icon:"🟠", color:"text-orange-400", available:true },
  { name:"MTN MoMo", icon:"🟡", color:"text-yellow-400", available:true },
  { name:"Wave", icon:"🔵", color:"text-blue-400", available:true },
  { name:"Visa/MC", icon:"💳", color:"text-violet-400", available:true },
  { name:"PayPal", icon:"🅿️", color:"text-blue-300", available:false },
  { name:"Virement", icon:"🏦", color:"text-gray-400", available:true },
];

const FAQS = [
  { q:"Est-ce vraiment gratuit ?", a:"Oui ! 1 monde complet + 3 aventures gratuitement." },
  { q:"Modes de paiement ?", a:"Orange Money, MTN MoMo, Wave, Visa/MC, virement bancaire." },
  { q:"Changer de plan ?", a:"Oui, upgrader ou downgrader à tout moment, au prorata." },
  { q:"Combien d enfants ?", a:"Gratuit: 1. Aventurier: 3. Pro: 5." },
  { q:"Garantie ?", a:"7 jours satisfait ou remboursé." },
  { q:"Tarif écoles ?", a:"Contacte ecoles@digitalexplorers.africa pour un devis." },
];

export default function PricingPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  return (
    <div className="min-h-screen bg-[#060810] text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#060810]/70 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff6b6b] to-[#8b5cf6] flex items-center justify-center text-sm font-bold">DE</div><span className="font-bold text-lg tracking-tight">Digital Explorers</span></Link>
          <div className="flex items-center gap-3">
            <Link href="/worlds"><button className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors">Mondes</button></Link>
            <Link href="/auth/login"><button className="px-4 py-2 text-sm border border-white/10 rounded-full text-gray-300 hover:bg-white/5 transition-all">Connexion</button></Link>
            <Link href="/auth/signup"><button className="px-5 py-2 text-sm bg-gradient-to-r from-[#ff6b6b] to-[#8b5cf6] rounded-full font-semibold hover:opacity-90 transition-opacity">Commencer</button></Link>
          </div>
        </div>
      </nav>
      <section className="relative pt-32 pb-16 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px]" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm mb-6"><Sparkles className="w-4 h-4" /> Tarifs simples et transparents</div>
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">Investis dans l avenir<br /><span className="bg-gradient-to-r from-[#ff6b6b] via-[#8b5cf6] to-[#ec4899] bg-clip-text text-transparent">de ton enfant</span></h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-12">Commence gratuitement, évolue à ton rythme.</p>
        </div>
      </section>
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {PLANS.map((plan) => {
              const bc = plan.popular ? "border-violet-500/50 shadow-lg shadow-violet-500/10" : "border-white/5 hover:border-white/20";
              const bcl = plan.popular ? "bg-gradient-to-r from-[#ff6b6b] to-[#8b5cf6] hover:opacity-90 text-white shadow-lg" : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10";
              return (
                <div key={plan.id} className={`relative bg-[#111827] border rounded-3xl p-8 transition-all hover:-translate-y-1 ${bc}`}>
                  {plan.badge && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs font-bold shadow-lg">{plan.badge}</div>}
                  <div className="text-center mb-6"><div className="text-4xl mb-3">{plan.icon}</div><h3 className="font-display text-2xl font-bold mb-1">{plan.name}</h3><p className="text-sm text-gray-400 mb-4">{plan.tagline}</p><div className="flex items-baseline justify-center gap-1"><span className="text-4xl font-bold">{plan.price}</span><span className="text-gray-400 text-sm">{plan.period}</span></div>{plan.price === "0" && <p className="text-xs text-emerald-400 mt-2">Pour toujours gratuit</p>}</div>
                  <ul className="space-y-3 mb-8">{plan.features.map((f, i) => (<li key={i} className="flex items-start gap-3 text-sm"><Check className="w-5 h-5 flex-shrink-0 text-violet-400" /><span className="text-gray-300">{f}</span></li>))}</ul>
                  <Link href={plan.ctaLink}><button className={`w-full py-3.5 rounded-xl font-semibold transition-all ${bcl}`}>{plan.cta}</button></Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="py-16 px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-3xl font-bold mb-4">Modes de paiement</h2>
          <p className="text-gray-400 mb-10">Paye avec les moyens que tu connais</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {PAYMENTS.map((pm) => {
              const cc = pm.available ? "border-white/10 bg-[#111827]" : "border-white/5 bg-white/5 opacity-50";
              const tc = pm.available ? pm.color : "text-gray-500";
              return (<div key={pm.name} className={`p-4 rounded-2xl border ${cc}`}><div className="text-2xl mb-2">{pm.icon}</div><div className={`text-xs font-medium ${tc}`}>{pm.name}</div>{!pm.available && <div className="text-xs text-gray-600 mt-1">Bientôt</div>}</div>);
            })}
          </div>
          <p className="text-xs text-gray-500 mt-6">Paiements sécurisés et cryptés.</p>
        </div>
      </section>
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-center mb-10">Comparaison</h2>
          <div className="bg-[#111827] border border-white/5 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-4 gap-0 border-b border-white/5">
              <div className="p-4 text-sm text-gray-400">Fonctionnalité</div>
              <div className="p-4 text-center text-sm font-semibold">Gratuit</div>
              <div className="p-4 text-center text-sm font-semibold text-violet-400">Aventurier</div>
              <div className="p-4 text-center text-sm font-semibold text-amber-400">Pro</div>
            </div>
            {[["Mondes","1","7","7"],["Aventures","3","Illimité","Illimité"],["Quiz IA","Non","Oui","Oui"],["Feedback","Non","3/mois","Illimité"],["Badge
