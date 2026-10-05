'use client';

import { useEffect, useRef } from 'react';
import { getWorldTheme } from '@/data/world-themes';

// ---------------------------------------------------------------------------
// Fond animé du monde — canvas 2D natif, zéro dépendance. Un style de
// particules par monde : réseau (web), neural (IA), pluie de code (coding),
// chaîne de blocs (blockchain), éclats de peinture (créateur), radar
// (cyber), orbites (innovation).
//
// Bonnes pratiques : devicePixelRatio plafonné à 2, pause quand l'onglet est
// masqué, rendu statique si prefers-reduced-motion, nettoyage complet.
// ---------------------------------------------------------------------------

interface Particle {
  /** position normalisée 0-1 (résiste aux redimensionnements) */
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  /** décalage de phase pour les pulsations/bobbing */
  phase: number;
  /** glyphe (coderain) */
  glyph?: string;
  /** vitesse orbitale (orbit) */
  speed?: number;
  /** rayon de l'anneau en cours (radar) */
  ring?: number;
}

const CODE_GLYPHS = ['0', '1', '{', '}', '<', '>', '/', '*', '=', '+', '#', ';', 'a'];

function makeParticles(density: number): Particle[] {
  const rnd = (a: number, b: number) => a + Math.random() * (b - a);
  return Array.from({ length: density }, (_, i) => ({
    x: Math.random(),
    y: Math.random(),
    vx: rnd(-0.05, 0.05),
    vy: rnd(-0.05, 0.05),
    size: rnd(1.4, 3.4),
    phase: rnd(0, Math.PI * 2),
    glyph: CODE_GLYPHS[i % CODE_GLYPHS.length],
    speed: rnd(0.2, 0.9) * (Math.random() > 0.5 ? 1 : -1),
    ring: Math.random() * 90,
  }));
}

export default function WorldBackdrop({
  slug,
  density = 40,
  className = '',
}: {
  slug: string;
  /** nombre de particules (40 ≈ léger ; monter à 60 pour les écrans larges) */
  density?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const theme = getWorldTheme(slug);
    const rgb = theme.accentRgb;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let raf = 0;
    let running = true;
    const parts = makeParticles(density);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const wrap = (v: number) => (v < -0.05 ? v + 1.1 : v > 1.05 ? v - 1.1 : v);

    const drawNetwork = (t: number, pulse: boolean) => {
      for (const p of parts) {
        p.x = wrap(p.x + p.vx * 0.016);
        p.y = wrap(p.y + p.vy * 0.016);
      }
      // liaisons entre points proches
      ctx.lineWidth = 1;
      for (let i = 0; i < parts.length; i++) {
        for (let j = i + 1; j < parts.length; j++) {
          const a = parts[i];
          const b = parts[j];
          const dx = (a.x - b.x) * width;
          const dy = (a.y - b.y) * height;
          const d = Math.hypot(dx, dy);
          if (d < 130) {
            ctx.strokeStyle = `rgba(${rgb},${(1 - d / 130) * 0.22})`;
            ctx.beginPath();
            ctx.moveTo(a.x * width, a.y * height);
            ctx.lineTo(b.x * width, b.y * height);
            ctx.stroke();
          }
        }
      }
      for (const p of parts) {
        const r = pulse ? p.size * (0.75 + 0.35 * Math.sin(t / 600 + p.phase)) : p.size;
        ctx.fillStyle = `rgba(${rgb},0.5)`;
        ctx.beginPath();
        ctx.arc(p.x * width, p.y * height, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const drawCoderain = (t: number) => {
      ctx.font = '13px "JetBrains Mono", monospace';
      for (const p of parts) {
        p.y += 0.0025 + p.size * 0.0008;
        if (p.y > 1.05) {
          p.y = -0.05;
          p.x = Math.random();
        }
        if (Math.random() < 0.04) p.glyph = CODE_GLYPHS[Math.floor(Math.random() * CODE_GLYPHS.length)];
        const x = p.x * width;
        const y = p.y * height;
        // tête plus lumineuse
        ctx.fillStyle = `rgba(${rgb},0.55)`;
        ctx.fillText(p.glyph ?? '0', x, y);
        ctx.fillStyle = `rgba(${rgb},0.14)`;
        ctx.fillText(p.glyph ?? '0', x, y - 18);
        ctx.fillStyle = `rgba(${rgb},0.06)`;
        ctx.fillText(p.glyph ?? '0', x, y - 36);
      }
    }

    const drawChain = (t: number) => {
      // blocs dérivant lentement, reliés séquentiellement
      const sorted = [...parts].sort((a, b) => a.x - b.x);
      ctx.lineWidth = 1.5;
      for (let i = 1; i < sorted.length; i++) {
        const a = sorted[i - 1];
        const b = sorted[i];
        const dx = (b.x - a.x) * width;
        const dy = (b.y - a.y) * height;
        if (Math.hypot(dx, dy) < 220) {
          ctx.strokeStyle = `rgba(${rgb},0.18)`;
          ctx.beginPath();
          ctx.moveTo(a.x * width, a.y * height);
          ctx.lineTo(b.x * width, b.y * height);
          ctx.stroke();
        }
      }
      for (const p of sorted) {
        p.x = wrap(p.x + 0.0035 + p.vx * 0.004);
        const bobY = p.y * height + Math.sin(t / 900 + p.phase) * 6;
        const s = 7 + p.size;
        ctx.save();
        ctx.translate(p.x * width, bobY);
        ctx.rotate(Math.sin(t / 1400 + p.phase) * 0.15);
        ctx.strokeStyle = `rgba(${rgb},0.45)`;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(-s / 2, -s / 2, s, s);
        ctx.fillStyle = `rgba(${rgb},0.10)`;
        ctx.fillRect(-s / 2, -s / 2, s, s);
        ctx.restore();
      }
    }

    const drawPaint = () => {
      for (const p of parts) {
        p.x = wrap(p.x + p.vx * 0.01);
        p.y = wrap(p.y + p.vy * 0.01);
        const r = 24 + p.size * 14;
        const g = ctx.createRadialGradient(p.x * width, p.y * height, 0, p.x * width, p.y * height, r);
        g.addColorStop(0, `rgba(${rgb},0.10)`);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x * width, p.y * height, r, 0, Math.PI * 2);
        ctx.fill();
        // étincelles
        ctx.fillStyle = `rgba(255,255,255,0.18)`;
        ctx.beginPath();
        ctx.arc(p.x * width, p.y * height, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const drawRadar = (t: number) => {
      for (const p of parts) {
        // anneaux qui s'étendent puis réapparaissent ailleurs
        p.ring = (p.ring ?? 0) + 0.35;
        if ((p.ring ?? 0) > 90) {
          p.ring = 0;
          p.x = Math.random();
          p.y = Math.random();
        }
        const alpha = 0.3 * (1 - (p.ring ?? 0) / 90);
        ctx.strokeStyle = `rgba(${rgb},${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(p.x * width, p.y * height, p.ring ?? 0, 0, Math.PI * 2);
        ctx.stroke();
        // point « menace » au centre
        ctx.fillStyle = `rgba(${rgb},0.5)`;
        ctx.beginPath();
        ctx.arc(p.x * width, p.y * height, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
      // balayage horizontal subtil
      const sweepY = ((t / 40) % (height + 200)) - 100;
      const grad = ctx.createLinearGradient(0, sweepY - 60, 0, sweepY);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(1, `rgba(${rgb},0.05)`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, sweepY - 60, width, 60);
    }

    const drawOrbit = (t: number) => {
      // deux centres d'orbite + étoiles qui tournent autour
      const centers = [
        { x: width * 0.22, y: height * 0.3 },
        { x: width * 0.78, y: height * 0.7 },
      ];
      parts.forEach((p, i) => {
        const c = centers[i % centers.length];
        const orbitR = 40 + p.size * 22;
        const angle = (t / 1000) * (p.speed ?? 0.5) + p.phase;
        const x = c.x + Math.cos(angle) * orbitR;
        const y = c.y + Math.sin(angle) * orbitR * 0.6;
        ctx.fillStyle = `rgba(${rgb},${0.25 + p.size * 0.08})`;
        ctx.beginPath();
        ctx.arc(x, y, 1.6, 0, Math.PI * 2);
        ctx.fill();
        // traînée
        ctx.fillStyle = `rgba(${rgb},0.08)`;
        ctx.beginPath();
        ctx.arc(c.x + Math.cos(angle - 0.25) * orbitR, c.y + Math.sin(angle - 0.25) * orbitR * 0.6, 1.2, 0, Math.PI * 2);
        ctx.fill();
      });
      // halos des centres
      for (const c of centers) {
        const g = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, 70);
        g.addColorStop(0, `rgba(${rgb},0.08)`);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(c.x, c.y, 70, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      switch (theme.particles) {
        case 'network':
          drawNetwork(t, false);
          break;
        case 'neural':
          drawNetwork(t, true);
          break;
        case 'coderain':
          drawCoderain(t);
          break;
        case 'chain':
          drawChain(t);
          break;
        case 'paint':
          drawPaint();
          break;
        case 'radar':
          drawRadar(t);
          break;
        case 'orbit':
          drawOrbit(t);
          break;
      }
    }

    const frame = (t: number) => {
      if (!running) return;
      draw(t);
      raf = requestAnimationFrame(frame);
    }

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!reduced) {
        running = true;
        raf = requestAnimationFrame(frame);
      }
    };

    resize();
    window.addEventListener('resize', resize);

    if (reduced) {
      draw(0); // rendu statique unique
      return () => window.removeEventListener('resize', resize);
    }

    document.addEventListener('visibilitychange', onVisibility);
    raf = requestAnimationFrame(frame);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [slug, density]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
