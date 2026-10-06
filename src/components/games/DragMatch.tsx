'use client';

import { useMemo, useState } from 'react';
import type { DragMatchConfig } from '@/data/interactives';
import { GameShell, WinBanner } from './GameShell';

/** Mélange Fisher-Yates (pur : rng injectable). */
function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Associe les paires en tapant : un élément de gauche, un de droite.
 *  (Le tap remplace le glisser-déposer : même jeu, mobile-friendly.) */
export default function DragMatch({ config }: { config: DragMatchConfig }) {
  const [round, setRound] = useState(0); // relance → remélange
  const [matched, setMatched] = useState<Set<string>>(new Set()); // valeurs left appariées
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [wrongRight, setWrongRight] = useState<string | null>(null);

  const leftItems = useMemo(() => shuffle(config.pairs), [config, round]);
  const rightItems = useMemo(() => shuffle(config.pairs), [config, round]);

  function onLeft(left: string) {
    if (matched.has(left)) return;
    setWrongRight(null);
    setSelectedLeft((cur) => (cur === left ? null : left));
  }

  function onRight(right: string) {
    if (!selectedLeft) return;
    const pair = config.pairs.find((p) => p.left === selectedLeft);
    if (pair && pair.right === right) {
      setMatched((prev) => new Set(prev).add(selectedLeft));
      setSelectedLeft(null);
      setWrongRight(null);
    } else {
      setWrongRight(right);
    }
  }

  function replay() {
    setRound((r) => r + 1);
    setMatched(new Set());
    setSelectedLeft(null);
    setWrongRight(null);
  }

  const won = matched.size === config.pairs.length;

  return (
    <GameShell title={config.title} goal={config.goal}>
      {won ? (
        <WinBanner onReplay={replay} note={`${config.pairs.length} paires associées sans erreur.`} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Colonne de gauche */}
          <div className="space-y-3">
            {leftItems.map((pair) => {
              const isMatched = matched.has(pair.left);
              const isSelected = selectedLeft === pair.left;
              return (
                <button
                  key={pair.left}
                  type="button"
                  onClick={() => onLeft(pair.left)}
                  disabled={isMatched}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm leading-relaxed transition-all ${
                    isMatched
                      ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-200'
                      : isSelected
                        ? 'world-border world-bg-soft text-white'
                        : 'border-white/10 text-gray-200 hover:border-white/30'
                  }`}
                >
                  {pair.left}
                </button>
              );
            })}
          </div>
          {/* Colonne de droite */}
          <div className="space-y-3">
            {rightItems.map((pair) => {
              const isMatched = matched.has(pair.left);
              const isWrong = wrongRight === pair.right;
              return (
                <button
                  key={pair.right}
                  type="button"
                  onClick={() => onRight(pair.right)}
                  disabled={isMatched}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm leading-relaxed transition-all ${
                    isMatched
                      ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-200'
                      : isWrong
                        ? 'border-red-500/60 bg-red-500/10 text-red-200'
                        : 'border-white/10 text-gray-200 hover:border-white/30'
                  }`}
                >
                  {pair.right}
                </button>
              );
            })}
          </div>
        </div>
      )}
      {!won && selectedLeft && (
        <p className="text-sm text-gray-400">Maintenant, choisis à droite l’exemple qui va avec.</p>
      )}
    </GameShell>
  );
}
