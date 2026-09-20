'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Award, FolderOpen, Zap, Sparkles, Star, Crown, Shield, Download, Share2 } from 'lucide-react';
import { BADGES as CONTENT_BADGES } from '@/data/content';
import type { ChildProfile } from '@/data/content';
import Nav from '@/components/Nav';

export default function PortfolioPage() {
  const router = useRouter();
  const [child, setChild] = useState<ChildProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('de_auth');
    if (!token) { router.push('/auth/login'); return; }
    setAuth(true);
    const active = localStorage.getItem('de_active_child');
    if (active) setChild(JSON.parse(active));
    setLoading(false);
  }, [router]);

  if (loading) return <div className="min-h-screen bg-[#060810] flex items-center justify-center"><div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!auth || !child) return null;

  const levelTitle = child.xp >= 4000 ? 'Innovateur' : child.xp >= 2000 ? 'Maker' : child.xp >= 1000 ? 'Créateur' : child.xp >= 500 ? 'Apprenti' : 'Explorateur';

  return (
    <div className="min-h-screen bg-[#060810] text-white">
      <Nav />
      <section className="pt-28 pb-8 px-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6"><ArrowLeft className="w-4 h-4" /> Retour au dashboard</Link>
          
          {/* Digital Passport */}
          <div className="bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-violet-500/20 rounded-2xl p-8 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-violet-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="relative flex items-center gap-6">
              <div className="text-7xl">{child.avatar}</div>
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs mb-3"><Sparkles className="w-3 h-3" /> Digital Passport</div>
                <h1 className="font-display text-3xl md:text-4xl font-bold mb-1">{child.name}</h1>
                <p className="text-gray-400 mb-3">{child.gradeLevel} • {child.age} ans • <span className="text-violet-400">{levelTitle}</span></p>
                <div className="flex items-center gap-6 text-sm">
                  <span className="flex items-center gap-1"><Crown className="w-4 h-4 text-yellow-400" /> Niveau {child.level}</span>
                  <span className="flex items-center gap-1"><Zap className="w-4 h-4 text-violet-400" /> {child.xp} XP</span>
                  <span className="flex items-center gap-1"><Award className="w-4 h-4 text-pink-400" /> {child.badges.length} badges</span>
                  <span className="flex items-center gap-1"><FolderOpen className="w-4 h-4 text-emerald-400" /> {child.adventuresCompleted.length} aventures</span>
                </div>
              </div>
              <div className="hidden md:flex gap-2">
                <button className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"><Download className="w-5 h-5" /></button>
                <button className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"><Share2 className="w-5 h-5" /></button>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-[#111827] border border-white/5 rounded-xl p-6 mb-8">
            <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2"><Star className="w-5 h-5 text-yellow-400" /> Compétences</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Web', 'IA', 'Coding', 'Créativité', 'Cybersécurité', 'Blockchain', 'Innovation', 'Résolution'].map((skill, i) => {
                const levels = ['discover', 'practice', 'apply', 'master'];
                const currentLevel = levels[Math.min(i % 4, 3)];
                const colors = ['text-blue-400', 'text-violet-400', 'text-emerald-400', 'text-yellow-400'];
                return (
                  <div key={skill} className="bg-[#0f172a] rounded-xl p-4 text-center">
                    <div className={`text-lg font-bold ${colors[i % 4]} mb-1`}>{skill}</div>
                    <div className="text-xs text-gray-500 capitalize">{currentLevel}</div>
                    <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full" style={{ width: `${(i + 1) * 15}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Badges */}
          <div className="mb-8">
            <h2 className="font-display text-xl font-bold mb-4">🏆 Badges</h2>
            <div className="bg-[#111827] border border-white/5 rounded-xl p-5">
              {child.badges.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {child.badges.map(slug => {
                    const badge = CONTENT_BADGES.find(b => b.slug === slug);
                    if (!badge) return null;
                    return (
                      <div key={slug} className="flex flex-col items-center gap-1 p-4 rounded-xl bg-[#0f172a] min-w-[90px]">
                        <span className="text-3xl">{badge.icon}</span>
                        <span className="text-xs text-center font-medium">{badge.name}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Award className="w-10 h-10 mx-auto mb-3 opacity-30" /><p>Aucun badge pour le moment.</p><p className="text-sm">Termine des aventures pour en gagner !</p>
                </div>
              )}
            </div>
          </div>

          {/* Adventures Completed */}
          <div className="mb-8">
            <h2 className="font-display text-xl font-bold mb-4">📚 Aventures terminées</h2>
            <div className="bg-[#111827] border border-white/5 rounded-xl overflow-hidden">
              {child.adventuresCompleted.length > 0 ? (
                child.adventuresCompleted.map((adv, i) => (
                  <div key={i} className={`p-4 flex items-center gap-4 ${i > 0 ? 'border-t border-white/5' : ''}`}>
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold text-sm flex-shrink-0">✓</div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{adv}</div>
                      <div className="text-xs text-gray-500">Aventure complétée</div>
                    </div>
                    <div className="text-sm text-yellow-400 font-medium">+XP</div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-30" /><p className="font-medium mb-1">Aucune aventure terminée</p><p className="text-sm">Complète ton premier monde pour commencer !</p>
                </div>
              )}
            </div>
          </div>

          {/* Unlocked Badges */}
          {child.badges.length < CONTENT_BADGES.length && (
            <div>
              <h2 className="font-display text-xl font-bold mb-4">🔜 Badges à débloquer</h2>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {CONTENT_BADGES.slice(child.badges.length, child.badges.length + 10).map(badge => (
                  <div key={badge.id} className="flex flex-col items-center gap-1 p-3 rounded-xl bg-[#111827] border border-white/5 opacity-40">
                    <span className="text-2xl grayscale">{badge.icon}</span>
                    <span className="text-xs text-center font-medium">{badge.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
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
