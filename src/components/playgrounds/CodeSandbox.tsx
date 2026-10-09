'use client';

import { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import type { CodeSandboxConfig } from '@/data/interactives';
import { GameShell } from '../games/GameShell';

/** Mini-éditeur : modifie le code à gauche, regarde le résultat à droite.
 *  L'iframe est isolée (sandbox="allow-scripts") : rien ne sort du cadre. */
export default function CodeSandbox({ config }: { config: CodeSandboxConfig }) {
  const [code, setCode] = useState(config.starter);
  const [preview, setPreview] = useState(config.starter); // exécution au montage

  return (
    <GameShell title={config.title} goal={config.goal}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label htmlFor="sandbox-code" className="block text-sm font-semibold text-ink mb-2">
            Ton code
          </label>
          <textarea
            id="sandbox-code"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            spellCheck={false}
            autoComplete="off"
            className="w-full h-64 rounded-xl border border-line bg-night-900/60 p-3 font-mono text-xs text-success-300 leading-relaxed focus:outline-none focus:border-line-lit"
          />
          <div className="flex flex-wrap gap-2 mt-3">
            <button
              type="button"
              onClick={() => setPreview(code)}
              className="px-5 py-2 rounded-full border world-border world-bg-soft world-accent font-semibold text-sm transition-all hover:opacity-80 flex items-center gap-2"
            >
              <Play className="w-4 h-4" aria-hidden="true" /> Exécuter
            </button>
            <button
              type="button"
              onClick={() => {
                setCode(config.starter);
                setPreview(config.starter);
              }}
              className="px-5 py-2 rounded-full border border-line text-ink-soft font-semibold text-sm transition-all hover:border-line-lit flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" /> Recommencer
            </button>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-ink mb-2">Aperçu</p>
          <iframe
            title="Aperçu de ta page"
            sandbox="allow-scripts"
            srcDoc={preview}
            className="w-full h-64 lg:h-72 rounded-xl border border-line bg-white"
          />
        </div>
      </div>

      <div className="rounded-xl border border-line p-4">
        <p className="text-xs font-bold uppercase tracking-wider world-accent mb-2">À réussir</p>
        <ul className="space-y-1.5">
          {config.checklist.map((item) => (
            <li key={item} className="text-sm text-ink-soft flex items-start gap-2">
              <span className="world-accent shrink-0" aria-hidden="true">▢</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </GameShell>
  );
}
