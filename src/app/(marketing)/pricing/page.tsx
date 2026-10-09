import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarX,
  Check,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { SectionHeading } from "@/components/ui/section-heading";
import { PageShell } from "@/components/ui/page-shell";
import { Motif } from "@/components/brand/motif";
import { PageTransition } from "@/components/motion/page-transition";

// ─────────────────────────────────────────────────────────────────────────────
// Tarifs (marketing) — page 100 % serveur. La FAQ utilise <details>/<summary>
// natifs : accessible, zéro JS client. Toutes les couleurs passent par les
// tokens (l'or reste réservé aux récompenses — pas de gold ici).
// ─────────────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Tarifs",
  description:
    "Essai gratuit de 7 jours, puis 5 000 FCFA/mois par enfant. Paiement Orange Money, MTN MoMo, Wave, Visa/Mastercard ou virement.",
};

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Essaie gratuit 7 jours",
    price: "0",
    period: "FCFA · 7 jours",
    icon: "🌱",
    features: [
      "1 monde complet",
      "3 aventures gratuites",
      "Quiz de base",
      "Badge premier projet",
      "Dashboard",
      "Coach IA basique",
    ],
    cta: "Essayer 7 jours gratuitement",
    ctaLink: "/auth/signup",
    popular: false,
  },
  {
    id: "monthly",
    name: "Explorateur",
    tagline: "Accès complet mensuel",
    price: "5 000",
    period: "FCFA/mois (par enfant)",
    icon: "⚡",
    features: [
      "Tous les mondes",
      "Aventures illimitées",
      "Quiz IA avancé",
      "Badges illimités",
      "Passport complet",
      "Feedback IA",
      "Coach IA premium",
      "Support prioritaire",
      "1 enfant",
    ],
    cta: "Commencer l'aventure",
    ctaLink: "/auth/signup",
    popular: true,
  },
  {
    id: "annual",
    name: "Pro",
    tagline: "Économise 38 %",
    price: "35 000",
    period: "FCFA/an",
    icon: "👑",
    features: [
      "Tout Explorateur",
      "10 mois offerts",
      "Certificats",
      "Rapport parent détaillé",
      "Coach IA VIP",
      "Accès anticipé",
      "Badge exclusif",
      "Africa Makers",
      "Webinaires privés",
    ],
    cta: "Devenir Pro",
    ctaLink: "/auth/signup",
    popular: false,
  },
] as const;

const PAYMENTS = [
  { name: "Orange Money", icon: "🟠", available: true },
  { name: "MTN MoMo", icon: "🟡", available: true },
  { name: "Wave", icon: "🔵", available: true },
  { name: "Visa / Mastercard", icon: "💳", available: true },
  { name: "PayPal", icon: "🅿️", available: false },
  { name: "Virement", icon: "🏦", available: true },
] as const;

const FAQS = [
  {
    q: "Pourquoi 7 jours gratuits ?",
    a: "Tu peux tester l'application pendant une semaine sans rien payer.",
  },
  {
    q: "Qu'est-ce que le Coach IA ?",
    a: "Un assistant intelligent qui guide ton enfant dans chaque aventure, corrige les quiz et propose des défis adaptés.",
  },
  {
    q: "Modes de paiement ?",
    a: "Orange Money, MTN MoMo, Wave, Visa/Mastercard, virement bancaire.",
  },
  {
    q: "Changer de plan ?",
    a: "Oui, upgrader ou downgrader à tout moment, au prorata.",
  },
  {
    q: "Combien d'enfants ?",
    a: "Gratuit : 1 enfant. Explorateur : 1 enfant (5 000 FCFA/mois). Pro : 3 enfants (35 000 FCFA/an).",
  },
  {
    q: "Garantie ?",
    a: "7 jours satisfait ou remboursé.",
  },
  {
    q: "Tarif écoles ?",
    a: "Contacte ecoles@digitalexplorers.africa pour un devis.",
  },
] as const;

const DATA_ROWS = [
  ["Mondes", "1", "Tous", "Tous"],
  ["Aventures", "3", "Illimité", "Illimité"],
  ["Quiz IA", "Non", "Oui", "Oui + VIP"],
  ["Coach IA", "Basique", "Premium", "VIP"],
  ["Feedback", "Non", "3/mois", "Illimité"],
  ["Badges", "1", "Tous", "Exclusifs"],
  ["Enfants", "1", "1", "3"],
  ["Certificats", "Non", "Non", "Oui"],
  ["Support", "Forum", "Prioritaire", "Dédié"],
] as const;

const gradientText =
  "bg-linear-to-r from-sunrise-400 via-sunrise-500 to-gleam-400 bg-clip-text text-transparent";

export default function PricingPage() {
  return (
    <PageTransition>
    <PageShell variant="marketing" className="overflow-x-hidden text-ink">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 pb-16 pt-32">
        <div className="orb left-1/4 top-0 h-96 w-96 bg-sunrise-500/10" />
        <div className="relative mx-auto max-w-4xl text-center">
          <Chip variant="warm" className="mb-6">
            <Sparkles className="h-4 w-4" /> Tarifs simples et transparents
          </Chip>
          <h1 className="mb-6 font-display text-display-lg font-bold tracking-tight">
            Investis dans l'avenir
            <br />
            <span className={gradientText}>de ton enfant</span>
          </h1>
          <p className="mx-auto max-w-2xl text-body-lg text-ink-soft">
            Commence par un essai gratuit de 7 jours, évolue à ton rythme.
          </p>
        </div>
      </section>

      <Motif variant="waves" className="h-2 text-gleam-400/40" />

      {/* ── Formules ────────────────────────────────────────────────────── */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 md:grid-cols-3">
            {PLANS.map((plan) => (
              <Card
                key={plan.id}
                variant={plan.popular ? "raised" : "flat"}
                className={cn(
                  "relative flex h-full flex-col p-8",
                  plan.popular &&
                    "border-sunrise-500/40 shadow-glow-sunrise md:-translate-y-2",
                )}
              >
                {plan.popular && (
                  <Chip
                    variant="warm"
                    className="absolute -top-3 left-1/2 -translate-x-1/2"
                  >
                    Populaire
                  </Chip>
                )}
                <div className="mb-6 text-center">
                  <div aria-hidden className="mb-3 text-4xl">
                    {plan.icon}
                  </div>
                  <h2 className="font-display text-2xl font-bold">{plan.name}</h2>
                  <p className="mb-4 text-sm text-ink-soft">{plan.tagline}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="font-display text-4xl font-bold">
                      {plan.price}
                    </span>
                    <span className="text-sm text-ink-soft">{plan.period}</span>
                  </div>
                  {plan.price === "0" && (
                    <p className="mt-2 text-xs text-success-300">
                      Pas de carte requise
                    </p>
                  )}
                </div>
                <ul className="mb-8 flex-1 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <Check
                        aria-hidden
                        className="h-5 w-5 shrink-0 text-success-400"
                      />
                      <span className="text-ink-soft">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.ctaLink}
                  className={cn(
                    buttonVariants({
                      variant: plan.popular ? "primary" : "secondary",
                    }),
                    "w-full",
                  )}
                >
                  {plan.cta}
                </Link>
              </Card>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-ink-faint">
            Tous les prix sont en FCFA. École ou association ?{" "}
            <Link
              href="/auth/signup"
              className="text-sunrise-300 transition-colors hover:text-sunrise-200 hover:underline"
            >
              Demande un devis
            </Link>
            .
          </p>
        </div>
      </section>

      {/* ── Modes de paiement ────────────────────────────────────────────── */}
      <section className="border-y border-line bg-night-900 px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <SectionHeading
            align="center"
            eyebrow="Paiement"
            title="Paye avec les moyens que tu connais"
          />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {PAYMENTS.map((pm) => (
              <Card
                key={pm.name}
                className={cn("p-4 text-center", !pm.available && "opacity-50")}
              >
                <div aria-hidden className="mb-2 text-2xl">
                  {pm.icon}
                </div>
                <div className="text-xs font-medium text-ink-soft">{pm.name}</div>
                {!pm.available && (
                  <Chip variant="outline" size="sm" className="mt-1">
                    Bientôt
                  </Chip>
                )}
              </Card>
            ))}
          </div>
          <p className="mt-6 flex items-center justify-center gap-2 text-xs text-ink-faint">
            <ShieldCheck aria-hidden className="h-4 w-4 text-success-400" />
            Paiements sécurisés et cryptés.
          </p>
        </div>
      </section>

      {/* ── Comparaison ──────────────────────────────────────────────────── */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            align="center"
            eyebrow="Comparatif"
            title="Tout, en un clin d'œil"
          />
          <div className="overflow-x-auto rounded-xl border border-line bg-night-850">
            <div className="min-w-xl">
              <div className="grid grid-cols-4 border-b border-line bg-night-800">
                <div className="p-4 text-sm text-ink-faint">Fonctionnalité</div>
                <div className="p-4 text-center text-sm font-semibold text-ink-soft">
                  Starter
                </div>
                <div className="p-4 text-center text-sm font-semibold text-sunrise-300">
                  Explorateur
                </div>
                <div className="p-4 text-center text-sm font-semibold text-gleam-300">
                  Pro
                </div>
              </div>
              {DATA_ROWS.map((row, i) => (
                <div
                  key={row[0]}
                  className={cn(
                    "grid grid-cols-4",
                    i % 2 === 0 && "bg-night-900/60",
                  )}
                >
                  <div className="border-r border-line p-4 text-sm text-ink-soft">
                    {row[0]}
                  </div>
                  <div className="border-r border-line p-4 text-center text-sm text-ink-faint">
                    {row[1]}
                  </div>
                  <div className="border-r border-line p-4 text-center text-sm text-sunrise-300">
                    {row[2]}
                  </div>
                  <div className="p-4 text-center text-sm text-gleam-300">
                    {row[3]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="border-y border-line bg-night-900 px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <SectionHeading align="center" eyebrow="FAQ" title="Questions fréquentes" />
          <div className="space-y-3">
            {FAQS.map((faq) => (
              <details
                key={faq.q}
                className="group overflow-hidden rounded-lg border border-line bg-night-850"
              >
                <summary className="flex w-full list-none cursor-pointer items-center justify-between p-5 transition-colors duration-250 hover:bg-night-800 [&::-webkit-details-marker]:hidden">
                  <span className="pr-4 text-sm font-semibold text-ink">
                    {faq.q}
                  </span>
                  <span
                    aria-hidden
                    className="text-xl font-light text-sunrise-400 transition-transform duration-250 ease-out-soft group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <div className="border-t border-line px-5 pb-5 pt-4 text-sm leading-relaxed text-ink-soft">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA final ────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 py-24">
        <div className="orb left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 bg-sunrise-500/10" />
        <div className="relative mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-display text-display-lg font-bold leading-tight">
            Prêt à lancer
            <br />
            <span className={gradientText}>l'aventure ?</span>
          </h2>
          <p className="mb-8 text-body-lg text-ink-soft">
            Crée ton compte gratuit et pars explorer les mondes prêts.
          </p>
          <Link href="/auth/signup" className={buttonVariants({ size: "lg" })}>
            Essayer 7 jours gratuitement <ArrowRight className="h-5 w-5" />
          </Link>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-ink-faint">
            <span className="flex items-center gap-2">
              <ShieldCheck aria-hidden className="h-4 w-4 text-success-400" />
              Paiement sécurisé
            </span>
            <span className="flex items-center gap-2">
              <CalendarX aria-hidden className="h-4 w-4 text-sunrise-400" />
              Annulation à tout moment
            </span>
            <span className="flex items-center gap-2">
              <Zap aria-hidden className="h-4 w-4 text-sunrise-400" />
              Coach IA inclus
            </span>
          </div>
          <p className="mt-8 flex items-center justify-center gap-2 text-sm text-ink-faint">
            <BadgeCheck aria-hidden className="h-4 w-4 text-sunrise-400" />
            Déjà 7 jours d'essai offerts, sans carte bancaire.
          </p>
        </div>
      </section>
    </PageShell>
    </PageTransition>
  );
}
