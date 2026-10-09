'use client';

import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import type { PromptLabConfig } from '@/data/interactives';
import { GameShell } from '../games/GameShell';

/** Laboratoire à prompts : écris, envoie, observe la différence. */
export default function PromptLab({ config }: { config: PromptLabConfig }) {
  const [prompt, setPrompt] = useState(config.starter);
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send() {
    if (loading || !prompt.trim()) return;
    setLoading(true);
    setError(null);
    setAnswer(null);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: config.system },
            { role: 'user', content: prompt },
          ],
        }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const text: unknown = data?.choices?.[0]?.message?.content;
      if (typeof text !== 'string' || !text.trim()) throw new Error('Réponse vide');
      setAnswer(text);
    } catch {
      setError('L’IA n’a pas pu répondre. Vérifie ta connexion, puis réessaie.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <GameShell title={config.title} goal={config.goal}>
      <div>
        <label htmlFor="prompt-input" className="block text-sm font-semibold text-ink mb-2">
          Ton prompt
        </label>
        <textarea
          id="prompt-input"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          rows={5}
          className="w-full rounded-xl border border-line bg-night-900/60 p-3 text-sm text-ink leading-relaxed focus:outline-none focus:border-line-lit"
        />
        <button
          type="button"
          onClick={send}
          disabled={loading}
          className="mt-3 px-6 py-2.5 rounded-full border world-border world-bg-soft world-accent font-semibold transition-all hover:opacity-80 disabled:opacity-40 flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> L’IA réfléchit…
            </>
          ) : (
            <>
              <Send className="w-4 h-4" aria-hidden="true" /> Envoyer à l’IA
            </>
          )}
        </button>
      </div>

      {error && (
        <p role="alert" className="rounded-xl border border-danger-500/50 bg-danger-500/10 p-4 text-sm text-danger-300">{error}</p>
      )}

      {answer && (
        <div className="rounded-2xl border world-border world-bg-soft p-5">
          <p className="text-xs font-bold uppercase tracking-wider world-accent mb-2">Réponse de l’IA</p>
          <p className="text-sm text-ink leading-relaxed whitespace-pre-wrap">{answer}</p>
        </div>
      )}

      <p className="text-sm text-ink-soft leading-relaxed">
        Astuce : reformule, ajoute des détails (« en 3 phrases », « pour un enfant de 10 ans »),
        et compare les réponses. C’est ça, le prompt engineering !
      </p>
    </GameShell>
  );
}
