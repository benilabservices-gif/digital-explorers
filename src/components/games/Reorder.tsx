'use client';

import { useState } from 'react';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import type { ReorderConfig } from '@/data/interactives';
import { GameShell, WinBanner } from './GameShell';

/** Mélange les indices 0..n-1 en évitant l'ordre initial (sinon rien à faire). */
function shuffledOrder(length: number): number[] {
  const order = Array.from({ length }, (_, i) => i);
  if (length < 2) return order;
  do {
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
  } while (order.every((v, i) => v === i));
  return order;
}

/** Remets les étapes dans l'ordre : flèches pour déplacer, vérification
 *  qui colore chaque étape à sa place (vert) ou pas encore (rouge). */
export default function Reorder({ config }: { config: ReorderConfig }) {
  const [order, setOrder] = useState<number[]>(() => shuffledOrder(config.items.length));
  const [checked, setChecked] = useState(false);
  const [won, setWon] = useState(false);

  function move(position: number, direction: -1 | 1) {
    if (won) return;
    const target = position + direction;
    if (target < 0 || target >= order.length) return;
    const next = [...order];
    [next[position], next[target]] = [next[target], next[position]];
    setOrder(next);
    setChecked(false);
  }

  function verify() {
    const allCorrect = order.every((itemIndex, position) => itemIndex === position);
    setChecked(true);
    setWon(allCorrect);
  }

  function replay() {
    setOrder(shuffledOrder(config.items.length));
    setChecked(false);
    setWon(false);
  }

  return (
    <GameShell title={config.title} goal={config.goal}>
      {won ? (
        <WinBanner onReplay={replay} note="Toutes les étapes sont dans le bon ordre." />
      ) : (
        <>
          <ol className="space-y-3">
            {order.map((itemIndex, position) => {
              const isRight = checked && itemIndex === position;
              const isWrong = checked && itemIndex !== position;
              return (
                <li
                  key={itemIndex}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 transition-all ${
                    isRight
                      ? 'border-emerald-500/50 bg-emerald-500/10'
                      : isWrong
                        ? 'border-red-500/50 bg-red-500/10'
                        : 'border-white/10'
                  }`}
                >
                  <span className="flex flex-col gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => move(position, -1)}
                      disabled={position === 0}
                      aria-label="Monter cette étape"
                      className="p-1 rounded-md border border-white/10 text-gray-400 hover:text-white hover:border-white/30 disabled:opacity-20 transition-all"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(position, 1)}
                      disabled={position === order.length - 1}
                      aria-label="Descendre cette étape"
                      className="p-1 rounded-md border border-white/10 text-gray-400 hover:text-white hover:border-white/30 disabled:opacity-20 transition-all"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </span>
                  <span className="w-6 h-6 shrink-0 rounded-full border border-white/15 text-gray-400 text-xs font-bold flex items-center justify-center">
                    {position + 1}
                  </span>
                  <span className="text-sm text-gray-200 leading-relaxed flex-1">{config.items[itemIndex]}</span>
                  {isRight && <span className="text-emerald-400 font-bold shrink-0">✓</span>}
                </li>
              );
            })}
          </ol>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={verify}
              className="px-6 py-2.5 rounded-full border world-border world-bg-soft world-accent font-semibold transition-all hover:opacity-80 flex items-center gap-2"
            >
              <ArrowUpDown className="w-4 h-4" aria-hidden="true" /> Vérifier l’ordre
            </button>
            {checked && !won && (
              <p className="text-sm text-red-300">Presque : en rouge, les étapes encore mal placées.</p>
            )}
          </div>
        </>
      )}
    </GameShell>
  );
}
