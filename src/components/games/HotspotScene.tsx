'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import type { HotspotConfig } from '@/data/interactives';
import { GameShell, WinBanner } from './GameShell';

/** Chasse aux risques : tape les cartes qui te semblent dangereuses.
 *  Chaque vrai risque explique pourquoi ; les pièges inoffensifs te le disent aussi. */
export default function HotspotScene({ config }: { config: HotspotConfig }) {
  const [found, setFound] = useState<Set<number>>(new Set()); // indices des risques trouvés
  const [wrongPick, setWrongPick] = useState<number | null>(null);
  const [lastWhy, setLastWhy] = useState<{ label: string; why: string } | null>(null);

  const riskyIndices = config.items.map((item, i) => (item.risky ? i : -1)).filter((i) => i >= 0);

  // Le flash rouge d'un faux risque s'efface de lui-même.
  useEffect(() => {
    if (wrongPick === null) return;
    const timer = setTimeout(() => setWrongPick(null), 1300);
    return () => clearTimeout(timer);
  }, [wrongPick]);

  function pick(index: number) {
    const item = config.items[index];
    if (item.risky) {
      setFound((prev) => new Set(prev).add(index));
      setLastWhy({ label: item.label, why: item.why ?? '' });
      setWrongPick(null);
    } else {
      setWrongPick(index);
      setLastWhy(null);
    }
  }

  function replay() {
    setFound(new Set());
    setWrongPick(null);
    setLastWhy(null);
  }

  const won = found.size === riskyIndices.length;

  return (
    <GameShell title={config.title} goal={config.prompt}>
      {won ? (
        <WinBanner onReplay={replay} note={`${riskyIndices.length} risques repérés sans te tromper.`} />
      ) : (
        <>
          <div className="flex items-center justify-between text-sm text-ink-soft">
            <span>Risques trouvés : {found.size}/{riskyIndices.length}</span>
            <Search className="w-4 h-4" aria-hidden="true" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {config.items.map((item, index) => {
              const isFound = found.has(index);
              const isWrong = wrongPick === index;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => pick(index)}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    isFound
                      ? 'border-success-500/50 bg-success-500/10'
                      : isWrong
                        ? 'border-danger-500/60 bg-danger-500/10'
                        : 'border-line hover:border-line-lit hover:-translate-y-0.5'
                  }`}
                >
                  <span className="text-3xl block mb-2" aria-hidden="true">{item.emoji}</span>
                  <span className="text-sm text-ink leading-snug">{item.label}</span>
                </button>
              );
            })}
          </div>
          <div aria-live="polite">
            {lastWhy && (
              <div className="rounded-2xl border border-success-500/40 bg-success-500/10 p-4">
                <p className="font-bold text-success-300 mb-1 text-sm">⚠ {lastWhy.label}</p>
                <p className="text-sm text-ink-soft leading-relaxed">{lastWhy.why}</p>
              </div>
            )}
            {wrongPick !== null && (
              <p className="text-sm text-danger-300">Celle-ci est inoffensive… mais reste vigilant·e !</p>
            )}
          </div>
        </>
      )}
    </GameShell>
  );
}
