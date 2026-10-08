// ─────────────────────────────────────────────────────────────────────────────
// Layout (auth) — login, signup, onboarding, callback.
//
// Pass-through volontaire : ces écrans n'affichent aucune navigation
// (comportement historique des pages /auth/*). On matérialise le groupe pour
// documenter cette intention.
// ─────────────────────────────────────────────────────────────────────────────

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
