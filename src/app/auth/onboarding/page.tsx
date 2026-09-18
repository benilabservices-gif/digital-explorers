'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('de_profile');
    if (!saved) { router.push('/auth/signup'); return; }
    setProfile(JSON.parse(saved));
  }, [router]);

  if (!profile) return null;

  const steps = [
    { title: 'Quel type de contenu préfères-tu ?', options: ['Jeux interactifs', 'Histoires', 'Expériences', 'Projets créatifs'] },
    { title: 'Combien de temps par session ?', options: ['15-20 min', '30-45 min', '1h+'] },
    { title: 'Tu veux apprendre en ?', options: ['Solo', 'Avec des amis', 'En classe'] },
  ];

  const current = steps[step];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Digital Explorers</Link>
          <p className="text-gray-400 mt-2">Diagnostic — Étape {step + 1}/3</p>
        </div>
        <div className="flex gap-2 mb-8">
          {steps.map((_, i) => (<div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-zinc-800'}`} />))}
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-2">{current.title}</h2>
          <p className="text-gray-400 mb-6">Bonjour {profile.pseudonym}, nous allons personnaliser ton parcours !</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {current.options.map((opt, i) => (
              <button key={i} onClick={() => setStep(Math.min(step + 1, steps.length - 1))} className="px-6 py-4 rounded-xl bg-zinc-800 border border-zinc-700 text-left hover:border-indigo-500/50 hover:bg-zinc-700 transition-all font-medium">
                {opt}
              </button>
            ))}
          </div>
          {step === steps.length - 1 && (
            <div className="mt-8 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-xl font-bold mb-2">Ton parcours est prêt !</h3>
              <p className="text-gray-400 mb-6">Nous t&apos;avons préparé un itinéraire sur mesure.</p>
              <Link href="/dashboard"><button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity">Accéder à mon Dashboard</button></Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
