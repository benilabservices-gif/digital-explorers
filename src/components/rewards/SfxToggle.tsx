'use client';

import { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { isSfxMuted, setSfxMuted, playSfx } from '@/lib/sfx';

/** Interrupteur son de l'aventure : mute persistant entre les sessions.
 *  L'état initial est lu après montage (localStorage n'existe pas en SSR). */
export default function SfxToggle() {
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    setMuted(isSfxMuted());
  }, []);

  function toggle() {
    const next = !muted;
    setMuted(next);
    setSfxMuted(next);
    if (!next) playSfx('tick'); // feedback immédiat du rétablissement
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={muted}
      aria-label={muted ? 'Réactiver le son' : 'Couper le son'}
      title={muted ? 'Réactiver le son' : 'Couper le son'}
      className="p-1.5 rounded-full border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-colors"
    >
      {muted ? <VolumeX className="w-4 h-4" aria-hidden="true" /> : <Volume2 className="w-4 h-4" aria-hidden="true" />}
    </button>
  );
}
