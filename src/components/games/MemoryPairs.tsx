'use client';

import { useEffect, useMemo, useState } from 'react';
import type { MemoryPairsConfig } from '@/data/interactives';
import { GameShell, WinBanner } from './GameShell';

interface Card {
  pairId: number;
  text: string;
}

const FLIP_BACK_DELAY = 900; // ms avant de cacher une paire ratée

/** Le memory des paires : deux faces par paire (a ↔ b), retourne deux cartes
 *  à la fois et compte tes coups. */
export default function MemoryPairs({ config }: { config: MemoryPairsConfig }) {
  const [round, setRound] = useState(0);
  const [flipped, setFlipped] = useState<number[]>([]); // indices de cartes retournées
  const [matched, setMatched] = useState<Set<number>>(new Set()); // indices appariés
  const [moves, setMoves] = useState(0);

  const cards = useMemo<Card[]>(() => {
    const deck: Card[] = [];
    config.pairs.forEach((pair, pairId) => {
      deck.push({ pairId, text: pair.a });
      deck.push({ pairId, text: pair.b });
    });
    // Fisher-Yates
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }, [config, round]);

  // Deux cartes retournées qui ne vont pas ensemble → on les recache.
  useEffect(() => {
    if (flipped.length !== 2) return;
    const [first, second] = flipped;
    if (cards[first].pairId === cards[second].pairId) return; // paire trouvée : on garde
    const timer = setTimeout(() => setFlipped([]), FLIP_BACK_DELAY);
    return () => clearTimeout(timer);
  }, [flipped, cards]);

  function flip(index: number) {
    if (matched.has(index) || flipped.includes(index) || flipped.length === 2) return;
    const next = [...flipped, index];
    setFlipped(next);
    if (next.length === 2) setMoves((m) => m + 1);
  }

  // Paire retournée identique → on la verrouille.
  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      if (cards[first].pairId === cards[second].pairId) {
        setMatched((prev) => new Set(prev).add(first).add(second));
        setFlipped([]);
      }
    }
  }, [flipped, cards]);

  function replay() {
    setRound((r) => r + 1);
    setFlipped([]);
    setMatched(new Set());
    setMoves(0);
  }

  const won = matched.size === cards.length;

  return (
    <GameShell title={config.title} goal={config.goal}>
      {won ? (
        <WinBanner onReplay={replay} note={`Toutes les paires trouvées en ${moves} coups !`} />
      ) : (
        <>
          <p className="text-sm text-gray-400">Coups joués : {moves}</p>
          <div className="grid grid-cols-2 gap-3">
            {cards.map((card, index) => {
              const isFaceUp = flipped.includes(index) || matched.has(index);
              const isMatched = matched.has(index);
              return (
                <button
                  key={`${card.pairId}-${index}`}
                  type="button"
                  onClick={() => flip(index)}
                  aria-label={isFaceUp ? card.text : 'Carte retournée'}
                  className={`min-h-16 px-3 py-4 rounded-xl border text-sm leading-relaxed text-left transition-all ${
                    isMatched
                      ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-200'
                      : isFaceUp
                        ? 'world-border world-bg-soft text-white'
                        : 'border-white/10 bg-black/20 text-center text-2xl text-gray-500 hover:border-white/30'
                  }`}
                >
                  {isFaceUp ? card.text : '?'}
                </button>
              );
            })}
          </div>
          {flipped.length === 1 && (
            <p className="text-sm text-gray-400">Retourne une deuxième carte pour trouver la paire.</p>
          )}
        </>
      )}
    </GameShell>
  );
}
