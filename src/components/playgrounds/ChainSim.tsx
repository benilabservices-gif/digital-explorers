'use client';

import { useState } from 'react';
import { Plus, Pencil, RotateCcw, AlertTriangle, Link2 } from 'lucide-react';
import type { ChainSimConfig } from '@/data/interactives';
import { GameShell } from '../games/GameShell';

interface Block {
  data: string;
  prevHash: string;
}

const GENESIS_PREV = '00000000';

/** Empreinte factice type FNV-1a : suffit pour voir la chaîne casser. */
function fakeHash(input: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

function blockHash(block: Block): string {
  return fakeHash(`${block.prevHash}|${block.data}`);
}

function genesis(config: ChainSimConfig): Block {
  return { data: `Bloc 0 : ${config.transactions[0]}`, prevHash: GENESIS_PREV };
}

/** Une blockchain de bureau : mine des blocs, puis tente de tricher sur un
 *  vieux bloc et regarde toutes les empreintes suivantes casser. */
export default function ChainSim({ config }: { config: ChainSimConfig }) {
  const [blocks, setBlocks] = useState<Block[]>(() => [genesis(config)]);
  const [txCursor, setTxCursor] = useState(1);
  const [tamperMode, setTamperMode] = useState(false);

  function mineBlock() {
    setBlocks((prev) => {
      const last = prev[prev.length - 1];
      const data = `Bloc ${prev.length} : ${config.transactions[txCursor % config.transactions.length]}`;
      return [...prev, { data, prevHash: blockHash(last) }];
    });
    setTxCursor((c) => c + 1);
  }

  function editData(index: number, data: string) {
    setBlocks((prev) => prev.map((block, i) => (i === index ? { ...block, data } : block)));
  }

  function reset() {
    setBlocks([genesis(config)]);
    setTxCursor(1);
    setTamperMode(false);
  }

  // Un bloc est valide si l'empreinte du précédent colle toujours.
  const brokenFrom = (() => {
    for (let i = 1; i < blocks.length; i++) {
      if (blocks[i].prevHash !== blockHash(blocks[i - 1])) return i;
    }
    return null;
  })();

  return (
    <GameShell title={config.title} goal={config.goal}>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={mineBlock}
          className="px-5 py-2 rounded-full border world-border world-bg-soft world-accent font-semibold text-sm transition-all hover:opacity-80 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" aria-hidden="true" /> Miner un bloc
        </button>
        <button
          type="button"
          onClick={() => setTamperMode((v) => !v)}
          aria-pressed={tamperMode}
          className={`px-5 py-2 rounded-full border font-semibold text-sm transition-all flex items-center gap-2 ${
            tamperMode
              ? 'border-danger-500/50 bg-danger-500/10 text-danger-300'
              : 'border-line text-ink-soft hover:border-line-lit'
          }`}
        >
          <Pencil className="w-4 h-4" aria-hidden="true" /> {tamperMode ? 'Quitter le mode triche' : 'Tenter de tricher'}
        </button>
        <button
          type="button"
          onClick={reset}
          className="px-5 py-2 rounded-full border border-line text-ink-soft font-semibold text-sm transition-all hover:border-line-lit flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" /> Recommencer
        </button>
      </div>

      {tamperMode && (
        <p aria-live="polite" className="text-sm text-gleam-400 leading-relaxed">
          Mode triche activé : modifie le contenu d’un ancien bloc et regarde ce qui se passe…
        </p>
      )}
      {brokenFrom !== null && (
        <div role="alert" className="rounded-xl border border-danger-500/50 bg-danger-500/10 p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-danger-400 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm text-danger-300 leading-relaxed">
            La chaîne est cassée à partir du bloc {brokenFrom} : son lien vers le bloc précédent
            ne correspond plus. Tout le réseau rejetterait cette version !
          </p>
        </div>
      )}

      <div className="space-y-3">
        {blocks.map((block, index) => {
          const isBroken = brokenFrom !== null && index >= brokenFrom;
          return (
            <div
              key={index}
              className={`rounded-xl border p-4 ${
                isBroken ? 'border-danger-500/50 bg-danger-500/5' : 'border-line bg-night-900/60'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <p className="font-bold text-ink text-sm">Bloc n°{index}</p>
                {isBroken && (
                  <span className="text-xs font-semibold text-danger-300 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" /> empreinte cassée
                  </span>
                )}
              </div>
              {tamperMode ? (
                <textarea
                  value={block.data}
                  onChange={(event) => editData(index, event.target.value)}
                  rows={2}
                  className="w-full rounded-lg border border-line bg-night-900/60 p-2 text-sm text-ink leading-relaxed focus:outline-none focus:border-line-lit"
                />
              ) : (
                <p className="text-sm text-ink-soft leading-relaxed">{block.data}</p>
              )}
              <div className="mt-2 flex flex-col gap-1 text-xs font-mono text-ink-soft">
                <p className="flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  précédent : <span className={isBroken ? 'text-danger-300' : 'text-ink-soft'}>{block.prevHash}</span>
                </p>
                <p>
                  empreinte : <span className={isBroken ? 'text-danger-300' : 'text-success-300'}>{blockHash(block)}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-sm text-ink-soft leading-relaxed">
        Chaque empreinte dépend du bloc précédent : impossible de réécrire l’histoire sans
        casser toute la chaîne.
      </p>
    </GameShell>
  );
}
