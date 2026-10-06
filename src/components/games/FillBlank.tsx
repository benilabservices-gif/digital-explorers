'use client';

import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import type { FillBlankConfig } from '@/data/interactives';
import { GameShell, WinBanner } from './GameShell';

/** Découpe le texte en segments : morceaux de texte et numéros de trous. */
function parseSegments(text: string): (string | { hole: number })[] {
  const segments: (string | { hole: number })[] = [];
  const pattern = /\{(\d+)\}/;
  let rest = text;
  for (;;) {
    const match = rest.match(pattern);
    if (!match || match.index === undefined) {
      if (rest) segments.push(rest);
      return segments;
    }
    if (match.index > 0) segments.push(rest.slice(0, match.index));
    segments.push({ hole: Number(match[1]) });
    rest = rest.slice(match.index + match[0].length);
  }
}

/** Texte à trous : choisis la bonne option pour chaque {n}, puis vérifie. */
export default function FillBlank({ config }: { config: FillBlankConfig }) {
  const [choices, setChoices] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);

  const segments = parseSegments(config.text);
  const holeNumbers = segments.filter((s): s is { hole: number } => typeof s === 'object').map((s) => s.hole);

  function choose(hole: number, option: string) {
    if (checked) return;
    setChoices((prev) => ({ ...prev, [hole]: option }));
  }

  function verify() {
    if (holeNumbers.some((n) => !choices[n])) return; // tous les trous remplis
    setChecked(true);
  }

  function replay() {
    setChoices({});
    setChecked(false);
  }

  const allFilled = holeNumbers.every((n) => Boolean(choices[n]));
  const allCorrect = checked && holeNumbers.every((n) => choices[n] === config.blanks[n - 1].answer);

  return (
    <GameShell title={config.title} goal={config.goal}>
      {allCorrect ? (
        <WinBanner onReplay={replay} note="Chaque mot est à sa place." />
      ) : (
        <>
          {/* Texte à trous */}
          <p className="rounded-2xl border border-white/10 bg-black/20 p-5 text-gray-100 leading-loose">
            {segments.map((segment, i) => {
              if (typeof segment === 'string') {
                return <span key={i}>{segment}</span>;
              }
              const blank = config.blanks[segment.hole - 1];
              const chosen = choices[segment.hole];
              if (!chosen) {
                return (
                  <span
                    key={i}
                    className="inline-block min-w-16 mx-1 px-3 py-0.5 rounded-lg border border-dashed border-white/25 text-gray-500 text-sm text-center align-middle"
                  >
                    {segment.hole}
                  </span>
                );
              }
              const isCorrect = checked && chosen === blank.answer;
              const isWrong = checked && chosen !== blank.answer;
              return (
                <span
                  key={i}
                  className={`inline-block mx-1 px-3 py-0.5 rounded-lg text-sm font-semibold align-middle ${
                    isCorrect
                      ? 'bg-emerald-500/15 text-emerald-300'
                      : isWrong
                        ? 'bg-red-500/15 text-red-300 line-through'
                        : 'world-bg-soft world-border border world-accent'
                  }`}
                >
                  {chosen}
                </span>
              );
            })}
          </p>

          {/* Options par trou */}
          <div className="space-y-3">
            {holeNumbers.map((holeNumber) => {
              const blank = config.blanks[holeNumber - 1];
              return (
                <div key={holeNumber} className="rounded-xl border border-white/10 p-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Trou {holeNumber}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {blank.options.map((option) => {
                      const isChosen = choices[holeNumber] === option;
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => choose(holeNumber, option)}
                          className={`px-4 py-1.5 rounded-full border text-sm transition-all ${
                            isChosen
                              ? 'world-border world-bg-soft world-accent font-semibold'
                              : 'border-white/15 text-gray-300 hover:border-white/35'
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={verify}
              disabled={!allFilled}
              className="px-6 py-2.5 rounded-full border world-border world-bg-soft world-accent font-semibold transition-all hover:opacity-80 disabled:opacity-40 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" aria-hidden="true" /> Vérifier
            </button>
            {checked && !allCorrect && (
              <p className="text-sm text-red-300">Les mots barrés ne vont pas : réessaie !</p>
            )}
          </div>
        </>
      )}
    </GameShell>
  );
}
