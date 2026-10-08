import Link from "next/link";
import { ArrowRight, CalendarCheck, CreditCard, Heart, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { Badge } from "@/components/ui/badge";
import { StatTile } from "@/components/ui/stat-tile";
import { SectionHeading } from "@/components/ui/section-heading";
import { PageShell } from "@/components/ui/page-shell";
import { Avatar } from "@/components/brand/avatar";
import { WorldEmblem } from "@/components/brand/world-emblem";
import { Motif } from "@/components/brand/motif";
import { WORLDS, BADGES, GRADES, isWorldReady } from "@/data/content";
import { WORLD_THEMES } from "@/data/world-themes";
import { GUIDES } from "@/data/characters";

// ─────────────────────────────────────────────────────────────────────────────
// Home (marketing) — « Carnet de l'Explorateur ».
// Page 100 % serveur : les CTA sont des liens (plus de useRouter), la copy est
// vérité produit (chiffres calculés depuis les données) et toutes les couleurs
// passent par les tokens (règle tokens-only, design:check).
// ─────────────────────────────────────────────────────────────────────────────

/** Chiffres vérité, calculés depuis la source de données — jamais codés en dur. */
const READY_COUNT = WORLDS.filter((w) => isWorldReady(w.slug)).length;
const ADVENTURE_COUNT = WORLDS.filter((w) => isWorldReady(w.slug)).reduce(
  (n, w) => n + (w.adventures?.length ?? 0),
  0,
);
const BADGE_COUNT = BADGES.length;
const GRADE_RANGE = `${GRADES[0]} → ${GRADES[GRADES.length - 1]}`;

const FEATURES = [
  {
    icon: "🗺️",
    title: `${READY_COUNT} mondes prêts · ${ADVENTURE_COUNT} aventures`,
    desc: "Web & Digital, IA, Coding, Blockchain et Création — 12 aventures par monde, deux mondes en préparation.",
  },
  {
    icon: "🎮",
    title: "Apprendre en jouant",
    desc: "Des aventures interactives avec histoires, mini-jeux, quiz et missions.",
  },
  {
    icon: "🤖",
    title: "Coach IA inclus",
    desc: "Un assistant intelligent qui guide, encourage et propose des défis adaptés.",
  },
  {
    icon: "🏆",
    title: "XP & Badges",
    desc: "Collectionne tes badges, grimpe en niveau et débloque des récompenses.",
  },
  {
    icon: "👨‍👩‍👧",
    title: "Suivi parental",
    desc: "Les parents suivent la progression de chacun en temps réel.",
  },
  {
    icon: "🌍",
    title: "Fait pour l'Afrique",
    desc: "Des contenus adaptés aux réalités africaines et aux ambitions de demain.",
  },
] as const;

const PHASE_CHIP = {
  explorer: { label: "Explorer", variant: "neutral" },
  creator: { label: "Créer", variant: "success" },
  builder: { label: "Construire", variant: "warm" },
} as const;

/** Particules déterministes : même rendu serveur/client (pas de Math.random). */
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  top: `${(i * 37) % 100}%`,
  left: `${(i * 53) % 100}%`,
  animation: `pulse-glow ${2 + (i % 5) * 0.7}s ease-in-out infinite`,
  animationDelay: `${(i % 7) * 0.4}s`,
}));

const gradientText =
  "bg-linear-to-r from-sunrise-400 via-sunrise-500 to-gleam-400 bg-clip-text text-transparent";

export default function HomePage() {
  return (
    <PageShell variant="marketing" className="overflow-x-hidden text-ink">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[92vh] items-center overflow-hidden px-6 pb-24 pt-36">
        <div className="orb left-1/4 top-0 h-96 w-96 bg-sunrise-500/10 animate-pulse-glow" />
        <div className="orb bottom-0 right-0 h-80 w-80 bg-gleam-500/10" />
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {PARTICLES.map((p, i) => (
            <div
              key={i}
              aria-hidden
              className="absolute h-1 w-1 rounded-full bg-ink/15"
              style={p}
            />
          ))}
        </div>

        <div className="relative mx-auto w-full max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <Chip variant="outline" className="mb-8">
                <span
                  aria-hidden
                  className="h-2 w-2 rounded-full bg-success-400 motion-safe:animate-pulse"
                />
                Plateforme éducative panafricaine — {GRADE_RANGE}
              </Chip>
              <h1 className="mb-8 font-display text-display-xl font-bold tracking-tight">
                Découvre le
                <br />
                <span className={gradientText}>monde numérique</span>
              </h1>
              <p className="mb-4 text-body-lg leading-relaxed text-ink-soft">
                Trouve ta voie. Imagine ton futur.
              </p>
              <p className="mb-10 text-base text-ink-faint">
                {READY_COUNT} mondes prêts · {ADVENTURE_COUNT} aventures · Coach
                IA · Suivi parental — dès 5&nbsp;000 FCFA/mois.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/auth/signup"
                  className={cn(buttonVariants({ size: "lg" }))}
                >
                  Commencer l'aventure <ArrowRight className="h-5 w-5" />
                </Link>
                <a
                  href="#mondes"
                  className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}
                >
                  Explorer les mondes
                </a>
              </div>
              <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-ink-faint">
                <span className="flex items-center gap-2">
                  <CalendarCheck className="h-4 w-4 text-sunrise-400" />
                  7 jours d'essai offerts
                </span>
                <span className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-sunrise-400" />
                  Sans carte bancaire
                </span>
                <span className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-sunrise-400" />
                  Fait en Afrique
                </span>
              </div>
            </div>

            {/* Aperçus du carnet de l'explorateur (décor, illustration de
                l'interface réelle du produit — pas de fausses stats). */}
            <div
              aria-hidden
              className="relative hidden h-[560px] lg:block"
            >
              <div className="animate-float absolute left-0 top-0 w-48 rounded-2xl border border-line bg-night-850 p-4 shadow-card">
                <div className="mb-3 flex justify-center">
                  <Avatar id="awa" size={72} />
                </div>
                <div className="text-sm font-semibold text-ink">Awa</div>
                <div className="text-xs text-ink-faint">Exploratrice IA</div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-night-600">
                  <div className="h-full w-3/4 rounded-full bg-linear-to-r from-sunrise-500 to-gleam-400" />
                </div>
                <div className="mt-1 text-xs font-semibold text-gold-300">
                  Nv. 12
                </div>
              </div>

              <div
                className="animate-float absolute left-1/2 top-20 w-60 -translate-x-1/2 rounded-2xl border border-line bg-night-800 p-5 shadow-lift"
                style={{ animationDelay: "0.5s" }}
              >
                <div className="mb-4 flex items-center gap-4">
                  <Avatar id="koffi" size={56} />
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-ink">Koffi</div>
                    <div className="text-xs text-ink-faint">Codeur en herbe</div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-night-600">
                      <div className="h-full w-3/4 rounded-full bg-linear-to-r from-sunrise-500 to-gleam-400" />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-xl font-bold text-gold-300">
                      2 450
                    </div>
                    <div className="text-xs text-ink-faint">XP</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    ["web-digital", "artificial-intelligence", "coding"] as const
                  ).map((slug) => (
                    <div
                      key={slug}
                      className="flex items-center justify-center rounded-lg border border-line bg-night-850 p-2"
                      style={{ color: WORLD_THEMES[slug].accent }}
                    >
                      <WorldEmblem slug={slug} size={28} />
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="animate-float absolute bottom-12 right-0 w-44 rounded-2xl border border-line bg-night-850 p-3 shadow-card"
                style={{ animationDelay: "1s" }}
              >
                <div className="flex items-center gap-3">
                  <Avatar id="nadia" size={36} tile={false} />
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-ink">Nadia</div>
                    <div className="truncate text-xs text-ink-faint">
                      vient de finir une aventure
                    </div>
                  </div>
                  <div className="ml-auto text-xs font-bold text-gold-300">
                    +100 XP
                  </div>
                </div>
              </div>

              <div
                className="animate-float absolute bottom-32 left-0 w-40 rounded-2xl border border-line bg-night-850 p-3 shadow-card"
                style={{ animationDelay: "1.5s" }}
              >
                <div className="flex items-center gap-3">
                  <Avatar id="sami" size={36} tile={false} />
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-ink">Sami</div>
                    <div className="text-xs text-ink-faint">a gagné</div>
                  </div>
                </div>
                <div className="mt-2">
                  <Badge rarity="rare">🔐 Cyber Hero</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Motif variant="kente" className="h-2 text-sunrise-500/50" />

      {/* ── Chiffres vérité ──────────────────────────────────────────────── */}
      <section className="border-b border-line bg-night-900 px-6 py-12">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          <StatTile value={READY_COUNT} label="Mondes prêts à explorer" icon="🗺️" />
          <StatTile value={ADVENTURE_COUNT} label="Aventures interactives" icon="⚡" />
          <StatTile value={BADGE_COUNT} label="Badges à débloquer" icon="🏆" tone="gold" />
          <StatTile
            value={GRADE_RANGE}
            label="De la 6e à la Terminale"
            icon="🎓"
            tone="muted"
          />
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            align="center"
            eyebrow="Pourquoi nous choisir"
            title={
              <>
                Une aventure <span className={gradientText}>conçue pour toi</span>
              </>
            }
            description="Conçue par et pour les jeunes Africains curieux du numérique."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <Card key={f.title} variant="interactive" className="p-6">
                <div
                  aria-hidden
                  className="mb-5 flex h-14 w-14 items-center justify-center rounded-lg border border-line bg-night-800 text-2xl"
                >
                  {f.icon}
                </div>
                <h3 className="mb-2 font-display text-lg font-bold text-ink">
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed text-ink-soft">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Les 7 mondes ────────────────────────────────────────────────── */}
      <section id="mondes" className="border-y border-line bg-night-900 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Les 7 mondes"
              title={
                <>
                  Explore, <span className={gradientText}>crée</span>,
                  inspires-toi
                </>
              }
              className="mb-0"
            />
            <Link
              href="/worlds"
              className={cn(
                buttonVariants({ variant: "secondary", size: "sm" }),
                "hidden sm:inline-flex",
              )}
            >
              Voir tous les mondes <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {WORLDS.map((world) => {
              const ready = isWorldReady(world.slug);
              const phase = PHASE_CHIP[world.phase];
              return (
                <Link
                  key={world.id}
                  href="/worlds"
                  className="rounded-xl focus-visible:outline-offset-4"
                >
                  <Card
                    variant="interactive"
                    className={cn("flex h-full flex-col p-5", !ready && "opacity-75")}
                  >
                    <div className="relative mb-5 flex h-32 items-center justify-center rounded-lg border border-line bg-night-900">
                      <span
                        className={cn(!ready && "opacity-40")}
                        style={{
                          color: ready
                            ? WORLD_THEMES[world.slug].accent
                            : undefined,
                        }}
                      >
                        <WorldEmblem slug={world.slug} size={64} />
                      </span>
                      {!ready && (
                        <Chip
                          variant="outline"
                          size="sm"
                          className="absolute right-2 top-2"
                        >
                          Bientôt
                        </Chip>
                      )}
                    </div>
                    <h3 className="mb-2 font-display text-lg font-bold text-ink">
                      {world.name}
                    </h3>
                    <p className="mb-4 line-clamp-2 flex-1 text-sm text-ink-soft">
                      {world.description}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-ink-faint">
                        {world.adventures?.length ?? 0} aventures
                      </span>
                      <Chip size="sm" variant={phase.variant}>
                        {phase.label}
                      </Chip>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link href="/worlds" className={buttonVariants({ variant: "secondary" })}>
              Voir tous les mondes →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Les guides ──────────────────────────────────────────────────── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl text-center">
          <SectionHeading
            align="center"
            eyebrow="La Team"
            title={
              <>
                Rencontre <span className={gradientText}>tes guides</span>
              </>
            }
            description="Awa, Koffi, Sami, Nadia et Yann t'accompagnent dans chaque aventure."
          />
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-5">
            {GUIDES.map((guide) => (
              <div key={guide.id} className="group flex flex-col items-center gap-3">
                <span className="transition-transform duration-250 ease-out-soft group-hover:-translate-y-1 group-hover:rotate-2">
                  <Avatar id={guide.id} size={96} />
                </span>
                <div>
                  <div className="font-display text-base font-bold text-ink">
                    {guide.name}
                  </div>
                  <div className="text-xs text-ink-soft">{guide.trait}</div>
                </div>
                <p className="text-[11px] italic leading-relaxed text-ink-faint">
                  « {guide.tagline} »
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Teaser pricing / CTA final ───────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 py-24">
        <div className="orb left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 bg-sunrise-500/10" />
        <div className="relative mx-auto max-w-4xl text-center">
          <Chip variant="warm" className="mb-8">
            <Sparkles className="h-4 w-4" />
            7 jours d'essai offerts · Sans carte bancaire · Fait avec ❤️ en
            Afrique
          </Chip>
          <h2 className="mb-6 font-display text-display-lg font-bold leading-tight">
            Prêt à commencer
            <br />
            <span className={gradientText}>ton exploration ?</span>
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-body-lg text-ink-soft">
            Crée ton compte parent en 2 minutes et offre à ton enfant un
            parcours éducatif unique.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/auth/signup" className={buttonVariants({ size: "lg" })}>
              Créer mon compte parent <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/pricing"
              className={buttonVariants({ variant: "secondary", size: "lg" })}
            >
              Voir les tarifs
            </Link>
          </div>
          <p className="mt-6 text-sm text-ink-faint">
            Déjà un compte ?{" "}
            <Link
              href="/auth/login"
              className="text-sunrise-300 transition-colors hover:text-sunrise-200 hover:underline"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </section>

    </PageShell>
  );
}
