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
        <label htmlFor="password-input" className="block text-sm font-semibold text-white mb-2">
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
          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-gray-100 focus:outline-none focus:border-white/30"
        />
        <p className="mt-2 text-xs text-gray-500 flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5" aria-hidden="true" />
          Champ d’entraînement : rien n’est envoyé nulle part, teste sans crainte.
        </p>
      </div>

      {/* Jauge */}
      <div>
        <div className="flex items-center justify-between text-sm mb-1.5">
          <span className="text-gray-400">Force du mot de passe</span>
          <span className={passed === 5 ? 'text-emerald-300 font-semibold' : 'text-gray-300'}>
            {strengthLabel}
          </span>
        </div>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden flex gap-0.5">
          {checks.map((check) => (
            <div
              key={check.label}
              className={`h-full flex-1 rounded-full transition-colors ${
                check.passed ? (passed === 5 ? 'bg-emerald-400' : 'world-progress-fill') : 'bg-transparent'
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
                  ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-300'
                  : 'border-white/15 text-gray-500'
              }`}
              aria-hidden="true"
            >
              {check.passed ? '✓' : '•'}
            </span>
            <span className={check.passed ? 'text-gray-200' : 'text-gray-400'}>{check.label}</span>
          </li>
        ))}
      </ul>

      {/* Bonnes pratiques */}
      <div className="rounded-2xl border world-border world-bg-soft p-4">
        <p className="text-xs font-bold uppercase tracking-wider world-accent mb-2">Les règles d’or</p>
        <ul className="space-y-1.5">
          {config.practices.map((practice) => (
            <li key={practice.label} className="text-sm text-gray-300 leading-relaxed">
              <span className="font-semibold text-gray-200">{practice.label}</span>
              <span className="block text-gray-400">{practice.detail}</span>
            </li>
          ))}
        </ul>
      </div>
    </GameShell>
  );
}
