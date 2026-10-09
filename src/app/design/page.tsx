import type { Metadata } from "next";
import { Rocket, Zap, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { Badge } from "@/components/ui/badge";
import { StatTile } from "@/components/ui/stat-tile";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeading } from "@/components/ui/section-heading";
import { EmptyState } from "@/components/ui/empty-state";
import { Avatar } from "@/components/brand/avatar";
import { WorldEmblem } from "@/components/brand/world-emblem";
import { Motif } from "@/components/brand/motif";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { WORLDS } from "@/data/content";
import { WORLD_THEMES } from "@/data/world-themes";
import { GUIDES } from "@/data/characters";
import { PageTransition } from "@/components/motion/page-transition";

// ─────────────────────────────────────────────────────────────────────────────
// /design — vitrine interne du design system (noindex). Validation visuelle des
// tokens et primitives AVANT la migration des pages (Phases 2→5).
// ─────────────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Design System",
  description: "Vitrine interne — tokens, primitives et composants de marque.",
  robots: { index: false, follow: false },
};

function Swatch({ token, className }: { token: string; className: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className={cn("h-16 rounded-lg border border-line", className)} />
      <code className="text-[11px] leading-tight text-ink-soft">{token}</code>
    </div>
  );
}

function Demo({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-20">
      <h2 className="mb-6 font-display text-display-sm font-bold text-ink">{title}</h2>
      {children}
    </section>
  );
}

export default function DesignPage() {
  return (
    <PageTransition>
    <div className="min-h-screen bg-night-950 text-ink">
      <div className="mx-auto max-w-6xl px-6 py-16">
        {/* Intro */}
        <header className="mb-16">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-sunrise-400">
            Vitrine interne — noindex
          </p>
          <h1 className="font-display text-display-lg font-bold tracking-tight">
            Design system « Carnet de l'Explorateur »
          </h1>
          <p className="mt-4 max-w-2xl text-body-lg text-ink-soft">
            Nuit d'obsidienne, accent soleil levant (corail → ambre), or réservé aux
            récompenses, accents pédagogiques par monde. Validez ici les tokens et
            primitives avant la migration des pages.
          </p>
        </header>

        <Motif variant="kente" className="mb-16 h-2 text-sunrise-500/60" />

        {/* Palette */}
        <Demo title="Palette — fondations">
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
            <Swatch token="night-950" className="bg-night-950" />
            <Swatch token="night-900" className="bg-night-900" />
            <Swatch token="night-850" className="bg-night-850" />
            <Swatch token="night-800" className="bg-night-800" />
            <Swatch token="night-700" className="bg-night-700" />
            <Swatch token="night-600" className="bg-night-600" />
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4 sm:grid-cols-6">
            <Swatch token="line" className="bg-line" />
            <Swatch token="line-lit" className="bg-line-lit" />
            <Swatch token="ink" className="bg-ink" />
            <Swatch token="ink-soft" className="bg-ink-soft" />
            <Swatch token="ink-faint" className="bg-ink-faint" />
            <Swatch token="— (bordure)" className="border-dashed" />
          </div>
        </Demo>

        <Demo title="Palette — marque « Soleil levant » & or">
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-5">
            <Swatch token="sunrise-300" className="bg-sunrise-300" />
            <Swatch token="sunrise-400" className="bg-sunrise-400" />
            <Swatch token="sunrise-500" className="bg-sunrise-500" />
            <Swatch token="sunrise-600" className="bg-sunrise-600" />
            <Swatch token="sunrise-700" className="bg-sunrise-700" />
            <Swatch token="gleam-300" className="bg-gleam-300" />
            <Swatch token="gleam-400" className="bg-gleam-400" />
            <Swatch token="gleam-500" className="bg-gleam-500" />
            <Swatch token="gold-300" className="bg-gold-300" />
            <Swatch token="gold-400" className="bg-gold-400" />
          </div>
          <p className="mt-4 text-sm text-ink-faint">
            Le dégradé de CTA : <code>bg-linear-to-r from-sunrise-500 to-gleam-400</code> — l'or est
            réservé aux récompenses.
          </p>
        </Demo>

        <Demo title="Palette — sémantiques">
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-9">
            <Swatch token="success-300" className="bg-success-300" />
            <Swatch token="success-400" className="bg-success-400" />
            <Swatch token="success-500" className="bg-success-500" />
            <Swatch token="danger-300" className="bg-danger-300" />
            <Swatch token="danger-400" className="bg-danger-400" />
            <Swatch token="danger-500" className="bg-danger-500" />
            <Swatch token="info-300" className="bg-info-300" />
            <Swatch token="info-400" className="bg-info-400" />
            <Swatch token="info-500" className="bg-info-500" />
          </div>
        </Demo>

        {/* Typographie */}
        <Demo title="Typographie — Bricolage Grotesque (display) · Inter (texte) · JetBrains Mono (code)">
          <div className="space-y-6">
            <div>
              <div className="font-display text-display-xl font-bold tracking-tight">
                Découvre le monde numérique
              </div>
              <code className="text-[11px] text-ink-faint">text-display-xl · 4.5rem</code>
            </div>
            <div>
              <div className="font-display text-display-lg font-bold">
                Trouve ta voie. Imagine ton futur.
              </div>
              <code className="text-[11px] text-ink-faint">text-display-lg · 3.25rem</code>
            </div>
            <div>
              <div className="font-display text-display-md font-bold">Explore, crée, inspires-toi</div>
              <code className="text-[11px] text-ink-faint">text-display-md · 2.25rem</code>
            </div>
            <div>
              <p className="text-body-lg text-ink-soft">
                Corps éditorial (text-body-lg · 18px/1.7) : des aventures interactives avec
                histoires, mini-jeux, quiz et missions. Le corps de texte reste ≥ 16px pour un
                public jeune.
              </p>
            </div>
            <div>
              <code className="rounded-md bg-night-800 px-3 py-2 font-mono text-sm text-info-300">
                const aventure = await decouvrir("web-digital");
              </code>
            </div>
          </div>
        </Demo>

        {/* Rayons & ombres */}
        <Demo title="Rayons & ombres">
          <div className="flex flex-wrap gap-6">
            <div className="flex flex-col items-center gap-2">
              <div className="h-20 w-32 rounded-sm border border-line bg-night-850" />
              <code className="text-[11px] text-ink-faint">rounded-sm · 8px</code>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="h-20 w-32 rounded-lg border border-line bg-night-850" />
              <code className="text-[11px] text-ink-faint">rounded-lg · 16px</code>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="h-20 w-32 rounded-xl border border-line bg-night-850" />
              <code className="text-[11px] text-ink-faint">rounded-xl · 24px</code>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="h-20 w-32 rounded-2xl border border-line bg-night-850" />
              <code className="text-[11px] text-ink-faint">rounded-2xl · 32px</code>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="h-20 w-32 rounded-full border border-line bg-night-850" />
              <code className="text-[11px] text-ink-faint">rounded-full</code>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-6">
            <div className="h-24 w-48 rounded-xl border border-line bg-night-850 shadow-card" />
            <div className="h-24 w-48 rounded-xl border border-line bg-night-850 shadow-lift" />
            <div className="h-24 w-48 rounded-xl border border-gold-400/40 bg-night-850 shadow-glow-gold" />
            <div className="h-24 w-48 rounded-xl border border-sunrise-500/40 bg-night-850 shadow-glow-sunrise" />
          </div>
        </Demo>

        {/* Motion */}
        <Demo title="Motion — durées & courbes (tokens)">
          <div className="grid gap-3 sm:grid-cols-3">
            <Card className="p-5">
              <code className="font-mono text-sm text-sunrise-300">--motion-fast: 150ms</code>
              <p className="mt-2 text-sm text-ink-soft">Micro-feedback : press, toggle, focus.</p>
            </Card>
            <Card className="p-5">
              <code className="font-mono text-sm text-sunrise-300">--motion-base: 250ms</code>
              <p className="mt-2 text-sm text-ink-soft">Hover cartes, chips, changements de surface.</p>
            </Card>
            <Card className="p-5">
              <code className="font-mono text-sm text-sunrise-300">--motion-slow: 500ms</code>
              <p className="mt-2 text-sm text-ink-soft">Transitions de vue, apparitions de scène.</p>
            </Card>
          </div>
          <p className="mt-4 text-sm text-ink-faint">
            Courbes : <code>ease-out-soft</code> (standard) · <code>ease-spring</code> (récompenses).
            Survolez les composants ci-dessous pour ressentir le langage unifié.
          </p>
        </Demo>

        {/* Buttons */}
        <Demo title="Button — variantes & tailles">
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="primary">Commencer l'aventure</Button>
            <Button variant="secondary">Explorer les mondes</Button>
            <Button variant="ghost">Passer</Button>
            <Button variant="gold">
              <Trophy className="h-4 w-4" /> Niveau 12 !
            </Button>
            <Button disabled>Indisponible</Button>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Button size="sm" variant="secondary">Small</Button>
            <Button size="md" variant="secondary">Medium</Button>
            <Button size="lg" variant="secondary">Large</Button>
            <Button size="icon" variant="ghost"><Zap className="h-4 w-4" /></Button>
          </div>
        </Demo>

        {/* Cards */}
        <Demo title="Card — surfaces nuit">
          <div className="grid gap-6 sm:grid-cols-3">
            <Card className="p-6">
              <h3 className="font-display font-bold">flat</h3>
              <p className="mt-2 text-sm text-ink-soft">Surface 1 — contenu statique.</p>
            </Card>
            <Card variant="raised" className="p-6">
              <h3 className="font-display font-bold">raised</h3>
              <p className="mt-2 text-sm text-ink-soft">Surface 2 — panneaux mis en avant.</p>
            </Card>
            <Card variant="interactive" className="p-6">
              <h3 className="font-display font-bold">interactive</h3>
              <p className="mt-2 text-sm text-ink-soft">Survolez : bordure lumineuse + lever.</p>
            </Card>
          </div>
        </Demo>

        {/* Chips & Badges */}
        <Demo title="Chip (étiquettes) & Badge (récompenses)">
          <div className="flex flex-wrap items-center gap-3">
            <Chip>Explorer</Chip>
            <Chip variant="warm">Nouveau</Chip>
            <Chip variant="gold">Légendaire</Chip>
            <Chip variant="success">Terminé</Chip>
            <Chip variant="outline">Bientôt</Chip>
            <Chip size="sm">Small</Chip>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Badge rarity="common">🌱 Starter</Badge>
            <Badge rarity="rare">🤖 AI Explorer</Badge>
            <Badge rarity="epic">🚀 Young Innovator</Badge>
            <Badge rarity="legendary">👑 Légende Exploratrice</Badge>
          </div>
        </Demo>

        {/* StatTiles */}
        <Demo title="StatTile — tuiles statistiques">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatTile value="2 450" label="XP cumulés" icon="⚡" tone="gold" />
            <StatTile value="12" label="Niveau" icon="🎖️" />
            <StatTile value="1/60" label="Aventures terminées" icon="🗺️" tone="muted" />
          </div>
        </Demo>

        {/* SectionHeading / EmptyState / Skeleton */}
        <Demo title="SectionHeading · EmptyState · Skeleton">
          <SectionHeading
            eyebrow="Les 7 mondes"
            title="Explore, crée, inspires-toi"
            description="Chaque monde possède son emblème géométrique et son guide compagnon."
          />
          <EmptyState
            icon="🧭"
            title="Aucune aventure ici… pour l'instant"
            description="Ce monde ouvre bientôt ses portes. En attendant, pars explorer le Web & Digital !"
            action={<Button variant="secondary">Voir les mondes prêts</Button>}
          />
          <div className="mt-6 flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </Demo>

        {/* Nav unifiée */}
        <Demo title="SiteNav — invité & connecté (RSC, testid + rôles)">
          <div className="space-y-8">
            <div className="relative h-18 overflow-hidden rounded-xl border border-line [transform:translateZ(0)]">
              <SiteNav user={null} />
            </div>
            <div className="relative h-18 overflow-hidden rounded-xl border border-line [transform:translateZ(0)]">
              <SiteNav user={{ name: "Parent Smoke", isAdmin: true }} />
            </div>
          </div>
        </Demo>

        {/* Brand — avatars & emblèmes */}
        <Demo title="Brand — avatars des guides (SVG géométriques)">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-5">
            {GUIDES.map((g) => (
              <div key={g.id} className="flex flex-col items-center gap-3">
                <Avatar id={g.id} size={72} />
                <div className="text-center">
                  <div className="font-display font-bold">{g.name}</div>
                  <div className="text-xs text-ink-soft">{g.trait}</div>
                </div>
                <p className="text-center text-[11px] italic text-ink-faint">« {g.tagline} »</p>
              </div>
            ))}
          </div>
        </Demo>

        <Demo title="Brand — emblèmes des 7 mondes (teintés par leur accent)">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
            {WORLDS.map((w) => {
              const theme = WORLD_THEMES[w.slug];
              return (
                <Card key={w.id} className="flex flex-col items-center gap-3 p-5 text-center">
                  <span style={{ color: theme.accent }}>
                    <WorldEmblem slug={w.slug} size={56} />
                  </span>
                  <div>
                    <div className="text-sm font-semibold leading-tight">{w.name}</div>
                    <div className="mt-1 font-mono text-[10px] text-ink-faint">{theme.accent}</div>
                  </div>
                </Card>
              );
            })}
          </div>
        </Demo>

        <Demo title="Brand — motifs wax/kente (séparateurs, empty-states)">
          <div className="space-y-4">
            <div>
              <Motif variant="kente" className="h-3 text-sunrise-500/70" />
              <code className="text-[11px] text-ink-faint">kente — losanges alternés</code>
            </div>
            <div>
              <Motif variant="waves" className="h-3 text-gleam-400/70" />
              <code className="text-[11px] text-ink-faint">waves — ondulations</code>
            </div>
            <div>
              <Motif variant="zigzag" className="h-3 text-gold-300/70" />
              <code className="text-[11px] text-ink-faint">zigzag — éclairs ascendants</code>
            </div>
          </div>
        </Demo>

        {/* Footer */}
        <Demo title="SiteFooter — footer unique partagé">
          <div className="overflow-hidden rounded-xl border border-line">
            <SiteFooter />
          </div>
        </Demo>

        <footer className="flex items-center justify-between border-t border-line pt-8 text-sm text-ink-faint">
          <span>Vitrine interne — vérifiez <code>npm run design:check</code> à chaque commit.</span>
          <span className="flex items-center gap-2">
            <Rocket className="h-4 w-4 text-sunrise-400" /> Afro-futurisme solaire
          </span>
        </footer>
      </div>
    </div>
    </PageTransition>
  );
}
