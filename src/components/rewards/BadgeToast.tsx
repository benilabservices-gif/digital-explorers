'use client';

import { useEffect } from 'react';
import { celebrate } from '@/lib/celebrate';

export interface BadgeLike {
  slug: string;
  name: string;
  icon: string;
}

/** Toast de badge : pop échelonné dans l'overlay de récompenses. */
export default function BadgeToast({ badge, index, total }: { badge: BadgeLike; index: number; total: number }) {
  useEffect(() => {
    // Une seule salve pour toute la série, quand le dernier badge apparaît.
    if (index === total - 1) {
      const delay = 300 + index * 220;
      const timer = setTimeout(() => celebrate('badge'), delay);
      return () => clearTimeout(timer);
    }
  }, [index, total]);

  return (
    <div
      className="badge-pop rounded-xl border border-gold-400/40 bg-gold-400/10 px-4 py-3 flex flex-col items-center w-24"
      style={{ animationDelay: `${index * 0.22}s` }}
    >
      <span className="text-3xl" aria-hidden="true">{badge.icon}</span>
      <span className="text-xs text-gold-300/90 mt-1 text-center leading-tight">{badge.name}</span>
    </div>
  );
}
