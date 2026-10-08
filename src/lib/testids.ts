// ─────────────────────────────────────────────────────────────────────────────
// Constantes `data-testid` partagées entre composants et spec e2e.
// Règle : chaque surface contractuelle porte un testid STABLE issu d'ici —
// la spec e2e (e2e/smoke.spec.ts) migre progressivement des sélecteurs CSS
// fragiles vers ces testids + rôles ARIA. Ne jamais renommer sans mettre à
// jour la spec dans le même commit.
// ─────────────────────────────────────────────────────────────────────────────

export const TESTIDS = {
  nav: {
    dashboard: "nav-dashboard",
    worlds: "nav-worlds",
    challenges: "nav-challenges",
    pricing: "nav-pricing",
    admin: "nav-admin",
    parent: "nav-parent",
    login: "nav-login",
    signup: "nav-signup",
    logout: "nav-logout",
    profile: "nav-profile",
  },
  child: {
    selector: "child-selector",
    selectorItem: "child-selector-item",
    add: "child-add",
  },
  dashboard: {
    greeting: "dashboard-greeting",
    xp: "dashboard-xp",
    progress: "dashboard-progress",
  },
  adventure: {
    skipIntro: "adventure-skip-intro",
    progress: "adventure-progress",
    next: "adventure-next",
    quiz: "adventure-quiz",
    quizOption: "adventure-quiz-option",
    validate: "adventure-validate",
    rewardsOverlay: "adventure-rewards-overlay",
    overlayDashboard: "adventure-overlay-dashboard",
  },
  auth: {
    loginEmail: "login-email",
    loginPassword: "login-password",
    loginSubmit: "login-submit",
    childName: "child-name",
    childAge: "child-age",
    childGrade: "child-grade",
    childSubmit: "child-submit",
  },
} as const;

export type Testid = (typeof TESTIDS)[keyof typeof TESTIDS][keyof (typeof TESTIDS)[keyof typeof TESTIDS]];
