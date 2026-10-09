'use client';

import { useEffect, type ReactNode } from 'react';
import { Gamepad2 } from 'lucide-react';
import { celebrate } from '@/lib/celebrate';

/** Cadre commun des mini-jeux : en-tête teinté par l'accent du monde. */
export function GameShell({ title, goal, children }: { title: string; goal?: string; children: ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border world-border world-bg-soft p-5">
        <div className="flex items-center gap-2 mb-1">
          <Gamepad2 className="w-5 h-5 world-accent" aria-hidden="true" />
          <span className="text-xs font-bold uppercase tracking-wider world-accent">Mini-jeu</span>
        </div>
        <h3 className="font-bold text-lg text-ink">{title}</h3>
        {goal && <p className="text-sm text-ink-soft mt-1 leading-relaxed">{goal}</p>}
      </div>
      {children}
    </div>
  );
}

/** Bannière de réussite. Aucun XP ici : l'XP ne vient que du quiz serveur. */
export function WinBanner({ onReplay, note }: { onReplay: () => void; note?: string }) {
  // Le moment de gloire : confettis + fanfare de mini-jeu + vibration mobile.
  useEffect(() => {
    celebrate('win');
  }, []);

  return (
    <div role="status" className="rounded-2xl border border-success-500/40 bg-success-500/10 p-5 text-center">
      <p className="text-3xl mb-2" aria-hidden="true">🎉</p>
      <p className="font-bold text-success-300 mb-1">Bravo, tu as réussi !</p>
      {note && <p className="text-sm text-ink-soft mb-3">{note}</p>}
      <button
        type="button"
        onClick={onReplay}
        className="mt-1 px-5 py-2 rounded-full border border-success-500/50 bg-success-500/10 text-success-300 font-semibold text-sm transition-all hover:bg-success-500/20"
      >
        Rejouer
      </button>
    </div>
  );
}
