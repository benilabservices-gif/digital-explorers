import type { WorldGuide } from '@/data/world-themes';

/** Ouverture narrative inline : le guide du monde raconte l'histoire de
 *  l'aventure (champ `story`, chargé mais jamais affiché avant cette phase).
 *  Panneau volontairement non bloquant — la version cinématique arrive en
 *  Phase 5 (StoryIntro). */
export default function StoryOpening({ guide, story }: { guide: WorldGuide; story: string }) {
  return (
    <section className="mb-6 rounded-2xl border world-border world-bg-soft p-5">
      <div className="flex items-center gap-3 mb-3">
        <span
          aria-hidden="true"
          className="w-10 h-10 shrink-0 rounded-full border world-border bg-night-900/60 flex items-center justify-center text-xl"
        >
          {guide.emoji}
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider world-accent">Ouverture</p>
          <p className="text-sm font-semibold text-ink">{guide.name} te raconte l'histoire…</p>
        </div>
      </div>
      <p className="italic text-ink-soft leading-relaxed">{story}</p>
    </section>
  );
}
