'use client';

import { useState } from 'react';
import type { ColorMixerConfig } from '@/data/interactives';
import { GameShell } from '../games/GameShell';

const TOLERANCE = 32; // tolérance par canal pour valider un défi

function hexToRgb(hex: string): [number, number, number] {
  const value = parseInt(hex.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

function toHex(channel: number): string {
  return channel.toString(16).padStart(2, '0').toUpperCase();
}

/** Mélangeur de couleurs : trois curseurs, une teinte, des défis. */
export default function ColorMixer({ config }: { config: ColorMixerConfig }) {
  const [red, setRed] = useState(160);
  const [green, setGreen] = useState(80);
  const [blue, setBlue] = useState(120);
  const [message, setMessage] = useState<string | null>(null);

  const hex = `#${toHex(red)}${toHex(green)}${toHex(blue)}`;

  function pickSwatch(label: string, hexColor: string, note: string) {
    const [r, g, b] = hexToRgb(hexColor);
    setRed(r);
    setGreen(g);
    setBlue(b);
    setMessage(`${label} — ${note}`);
  }

  const solved = config.challenges.filter((challenge) => {
    const [r, g, b] = hexToRgb(challenge.hex);
    return (
      Math.abs(r - red) <= TOLERANCE &&
      Math.abs(g - green) <= TOLERANCE &&
      Math.abs(b - blue) <= TOLERANCE
    );
  });

  return (
    <GameShell title={config.title} goal={config.goal}>
      {/* Aperçu */}
      <div className="rounded-2xl border border-white/10 overflow-hidden">
        <div className="h-32 transition-colors duration-150" style={{ backgroundColor: hex }} />
        <div className="bg-black/30 px-4 py-3 flex items-center justify-between">
          <span className="font-mono text-lg text-white">{hex}</span>
          <span className="text-xs text-gray-400 font-mono">rgb({red}, {green}, {blue})</span>
        </div>
      </div>

      {/* Curseurs */}
      <div className="space-y-3">
        {(
          [
            ['Rouge', red, setRed, 'accent-red-400'],
            ['Vert', green, setGreen, 'accent-emerald-400'],
            ['Bleu', blue, setBlue, 'accent-blue-400'],
          ] as const
        ).map(([label, value, setter, accent]) => (
          <div key={label} className="flex items-center gap-3">
            <label htmlFor={`slider-${label}`} className="text-sm text-gray-300 w-14 shrink-0">
              {label}
            </label>
            <input
              id={`slider-${label}`}
              type="range"
              min={0}
              max={255}
              value={value}
              onChange={(event) => setter(Number(event.target.value))}
              className={`flex-1 ${accent}`}
            />
            <span className="text-xs text-gray-400 font-mono w-8 text-right">{value}</span>
          </div>
        ))}
      </div>

      {message && <p className="text-sm text-gray-300 leading-relaxed">{message}</p>}

      {/* Palette */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider world-accent mb-2">Palette de départ</p>
        <div className="flex flex-wrap gap-3">
          {config.palette.map((swatch) => (
            <button
              key={swatch.label}
              type="button"
              onClick={() => pickSwatch(swatch.label, swatch.hex, swatch.message)}
              className="group text-center"
              aria-label={`Charger la couleur ${swatch.label}`}
            >
              <span
                className="block w-12 h-12 rounded-xl border border-white/15 transition-transform group-hover:scale-110"
                style={{ backgroundColor: swatch.hex }}
              />
              <span className="block text-xs text-gray-400 mt-1">{swatch.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Défis */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider world-accent mb-2">
          Défis ({solved.length}/{config.challenges.length})
        </p>
        <div className="space-y-3">
          {config.challenges.map((challenge) => {
            const [r, g, b] = hexToRgb(challenge.hex);
            const isSolved =
              Math.abs(r - red) <= TOLERANCE &&
              Math.abs(g - green) <= TOLERANCE &&
              Math.abs(b - blue) <= TOLERANCE;
            return (
              <div
                key={challenge.label}
                className={`flex items-center gap-3 rounded-xl border p-3 ${
                  isSolved ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-white/10'
                }`}
              >
                <span
                  className="w-8 h-8 rounded-lg border border-white/15 shrink-0"
                  style={{ backgroundColor: challenge.hex }}
                />
                <span className={`text-sm flex-1 ${isSolved ? 'text-emerald-300' : 'text-gray-300'}`}>
                  {challenge.label}
                </span>
                <span className="text-sm">{isSolved ? '✓' : ''}</span>
              </div>
            );
          })}
        </div>
      </div>
    </GameShell>
  );
}
