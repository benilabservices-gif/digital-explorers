'use client';

import { useMemo, useState } from 'react';
import { Eye } from 'lucide-react';
import type { PasswordMeterConfig } from '@/data/interactives';
import { GameShell } from '../games/GameShell';

/** Mots de passe trop prévisibles : rejetés net. */
const COMMON_WORDS = [
  'password', 'motdepasse', 'azerty', 'qwerty', '123456', '1234567890',
  'soleil', 'bonjour', 'iloveyou', 'admin', 'abc123',
];

interface Check {
  label: string;
  passed: boolean;
}

function evaluate(secret: string): Check[] {
  const lower = secret.toLowerCase();
  const hasCommonWord = COMMON_WORDS.some((word) => lower.includes(word));
  return [
    { label: '12 caractères ou plus', passed: secret.length >= 12 },
    { label: 'Des MAJUSCULES et des minuscules', passed: /[a-z]/.test(secret) && /[A-Z]/.test(secret) },
    { label: 'Au moins un chiffre', passed: /\d/.test(secret) },
    { label: 'Au moins un symbole (!, ?, *, …)', passed: /[^a-zA-Z0-9]/.test(secret) },
    { label: 'Aucun mot trop courant', passed: !hasCommonWord },
  ];
}

/** Forge un mot de passe de trésor et regarde le radar réagir en direct. */
export default function PasswordMeter({ config }: { config: PasswordMeterConfig }) {
  const [secret, setSecret] = useState('');
  const checks = useMemo(() => evaluate(secret), [secret]);
  const passed = checks.filter((check) => check.passed).length;

  const strengthLabel = passed <= 1 ? 'Fragile' : passed <= 3 ? 'Moyen' : passed === 4 ? 'Costaud' : 'En béton';

  return (
    <GameShell title={config.title} goal={config.goal}>
      <div>
        <label htmlFor="password-input" className="block text-sm font-semibold text-ink mb-2">
          Ton mot de passe de trésor
        </label>
        <input
          id="password-input"
          type="text"
          inputMode="text"
          autoComplete="off"
          spellCheck={false}
          value={secret}
          onChange={(event) => setSecret(event.target.value)}
          placeholder="Essaie quelque chose d’imparable…"
          className="w-full rounded-xl border border-line bg-night-900/60 px-4 py-3 text-sm text-ink focus:outline-none focus:border-line-lit"
        />
        <p className="mt-2 text-xs text-ink-faint flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5" aria-hidden="true" />
          Champ d’entraînement : rien n’est envoyé nulle part, teste sans crainte.
        </p>
      </div>

      {/* Jauge */}
      <div>
        <div className="flex items-center justify-between text-sm mb-1.5">
          <span className="text-ink-soft">Force du mot de passe</span>
          <span aria-live="polite" className={passed === 5 ? 'text-success-300 font-semibold' : 'text-ink-soft'}>
            {strengthLabel}
          </span>
        </div>
        <div className="h-2 rounded-full bg-night-600 overflow-hidden flex gap-0.5">
          {checks.map((check) => (
            <div
              key={check.label}
              className={`h-full flex-1 rounded-full transition-colors ${
                check.passed ? (passed === 5 ? 'bg-success-400' : 'world-progress-fill') : 'bg-transparent'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Vérifications */}
      <ul className="space-y-1.5">
        {checks.map((check) => (
          <li key={check.label} className="flex items-center gap-2.5 text-sm">
            <span
              className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs shrink-0 ${
                check.passed
                  ? 'border-success-500/50 bg-success-500/15 text-success-300'
                  : 'border-line text-ink-faint'
              }`}
              aria-hidden="true"
            >
              {check.passed ? '✓' : '•'}
            </span>
            <span className={check.passed ? 'text-ink' : 'text-ink-soft'}>{check.label}</span>
          </li>
        ))}
      </ul>

      {/* Bonnes pratiques */}
      <div className="rounded-2xl border world-border world-bg-soft p-4">
        <p className="text-xs font-bold uppercase tracking-wider world-accent mb-2">Les règles d’or</p>
        <ul className="space-y-1.5">
          {config.practices.map((practice) => (
            <li key={practice.label} className="text-sm text-ink-soft leading-relaxed">
              <span className="font-semibold text-ink">{practice.label}</span>
              <span className="block text-ink-soft">{practice.detail}</span>
            </li>
          ))}
        </ul>
      </div>
    </GameShell>
  );
}
