import type { ReactNode } from 'react';
import type { WorldGuide } from '@/data/world-themes';

/** Bulle de dialogue du guide : avatar emoji + nom + paroles, teintés par
 *  l'accent du monde (variables CSS posées par WorldThemeProvider). */
export default function DialogueBubble({ guide, children }: { guide: WorldGuide; children: ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span
        aria-hidden="true"
        className="w-10 h-10 shrink-0 rounded-full border world-border world-bg-soft flex items-center justify-center text-xl"
      >
        {guide.emoji}
      </span>
      <div className="bubble-in flex-1 min-w-0 rounded-2xl rounded-tl-md border world-border world-bg-soft px-4 py-3">
        <p className="text-xs font-semibold world-accent mb-1">{guide.name} · {guide.trait}</p>
        <p className="text-gray-200 leading-relaxed">{children}</p>
      </div>
    </div>
  );
}
