// ---------------------------------------------------------------------------
// Registre des interactifs (Phase 3) — clés « slug-aventure:section_type ».
//
// Zéro migration base de données : le texte des leçons reste la base, ce
// registre s'inscrit côté code. Sans entrée, la section reste en lecteur
// immersif (Phase 2). Aucun XP local : l'XP ne vient que du quiz serveur.
// Les configs sont rédigées à partir du contenu réel des leçons.
// ---------------------------------------------------------------------------

export interface QuizTapConfig {
  kind: 'quiz-tap';
  title: string;
  statements: { text: string; answer: boolean; why: string }[];
}

export interface DragMatchConfig {
  kind: 'drag-match';
  title: string;
  goal: string;
  pairs: { left: string; right: string }[];
}

export interface ReorderConfig {
  kind: 'reorder';
  title: string;
  goal: string;
  /** les items dans l'ordre correct — le jeu les mélange */
  items: string[];
}

export interface MemoryPairsConfig {
  kind: 'memory-pairs';
  title: string;
  goal: string;
  pairs: { a: string; b: string }[];
}

export interface FillBlankConfig {
  kind: 'fill-blank';
  title: string;
  goal: string;
  /** texte avec des trous notés {1}, {2}… */
  text: string;
  /** options par trou (indexé par le numéro du trou, 1-indexé) */
  blanks: { options: string[]; answer: string }[];
}

export interface HotspotConfig {
  kind: 'hotspot';
  title: string;
  prompt: string;
  items: { emoji: string; label: string; risky?: boolean; why?: string }[];
}

export interface CodeSandboxConfig {
  kind: 'code-sandbox';
  title: string;
  goal: string;
  checklist: string[];
  /** document HTML de départ complet */
  starter: string;
}

export interface PromptLabConfig {
  kind: 'prompt-lab';
  title: string;
  goal: string;
  /** message system envoyé à /api/chat */
  system: string;
  starter: string;
}

export interface ChainSimConfig {
  kind: 'chain-sim';
  title: string;
  goal: string;
  /** exemples de transactions à miner */
  transactions: string[];
}

export interface ColorMixerConfig {
  kind: 'color-mixer';
  title: string;
  goal: string;
  palette: { label: string; hex: string; message: string }[];
  challenges: { label: string; hex: string }[];
}

export interface PasswordMeterConfig {
  kind: 'password-meter';
  title: string;
  goal: string;
  practices: { label: string; detail: string }[];
}

export type InteractiveConfig =
  | QuizTapConfig
  | DragMatchConfig
  | ReorderConfig
  | MemoryPairsConfig
  | FillBlankConfig
  | HotspotConfig
  | CodeSandboxConfig
  | PromptLabConfig
  | ChainSimConfig
  | ColorMixerConfig
  | PasswordMeterConfig;

export const INTERACTIVES: Record<string, InteractiveConfig> = {
  // ── Web & Digital (Sami) ────────────────────────────────────────────────
  'internet-discover:play': {
    kind: 'reorder',
    title: 'Le voyage des paquets',
    goal: 'Remets dans l’ordre le voyage d’un message sur Internet, comme dans le jeu des paquets.',
    items: [
      'Découpe ta phrase en petits papiers : ce sont les paquets.',
      'Chaque paquet part vers un routeur.',
      'Les routeurs font passer les paquets de main en main, en changeant parfois de chemin.',
      'Le destinataire réassemble les papiers dans l’ordre.',
      'Un paquet s’est perdu ? On le redemande à l’expéditeur.',
    ],
  },
  'search-master:play': {
    kind: 'quiz-tap',
    title: 'Vrai ou faux : la recherche',
    statements: [
      {
        text: 'Un seul mot comme « cacao » donne toujours de meilleurs résultats qu’une question précise.',
        answer: false,
        why: 'La requête précise de quatre à six mots gagne presque toujours : on choisit ses mots comme on choisit ses outils.',
      },
      {
        text: 'La première page de résultats est exactement la même pour tous les internautes.',
        answer: false,
        why: 'Les moteurs personnalisent les résultats : deux téléphones peuvent voir des pages différentes.',
      },
      {
        text: 'Un bon mot-clé annonce exactement le contenu de ce qu’on cherche.',
        answer: true,
        why: 'Une requête efficace dit précisément ce qu’elle veut trouver.',
      },
      {
        text: 'Au défi des requêtes, gagner c’est trouver le premier une information exacte et vérifiable.',
        answer: true,
        why: 'La précision et la vérifiabilité avant la vitesse : c’est la règle des professionnels.',
      },
    ],
  },
  'email-mastery:experiment': {
    kind: 'fill-blank',
    title: 'Le radar anti-arnaque',
    goal: 'Complète la fiche d’analyse de cet email suspect, comme un vrai analyste.',
    text:
      '« Cher client, votre compte sera suspendu dans 24 heures ! Cliquez vite ici : banque-securite-verification.com »\n\n' +
      'La formule d’appel est {1}. L’objet joue sur {2}. Le lien {3}. Le verdict : {4}.',
    blanks: [
      {
        options: ['générique : « Cher client »', 'personnalisé : ton prénom exact'],
        answer: 'générique : « Cher client »',
      },
      {
        options: ['la peur et l’urgence', 'une information utile et calme'],
        answer: 'la peur et l’urgence',
      },
      {
        options: ['ne correspond pas au vrai site de la banque', 'est bien celui du site officiel'],
        answer: 'ne correspond pas au vrai site de la banque',
      },
      {
        options: ['fraude certaine', 'email réel'],
        answer: 'fraude certaine',
      },
    ],
  },
  'digital-citizenship:experiment': {
    kind: 'hotspot',
    title: 'L’empreinte numérique',
    prompt: 'Voici un profil sur un réseau social. Clique sur les publications qu’un inconnu ne devrait jamais pouvoir voir.',
    items: [
      { emoji: '📸', label: 'Photo en uniforme devant l’école, le nom du lycée visible', risky: true, why: 'Ton visage + ton école = ton adresse et ton emploi du temps à la portée de tous.' },
      { emoji: '📅', label: 'Le programme du club de danse du quartier' },
      { emoji: '🕒', label: '« Je sors du cours à 17 h, je rentre par le marché »', risky: true, why: 'Ton horaire et ton trajet annoncés à voix haute : jamais ses routines en ligne.' },
      { emoji: '🍽️', label: 'Photo de l’attiéké du dimanche' },
      { emoji: '😡', label: 'Commentaire moqueur sur un camarade, écrit trop vite', risky: true, why: 'Un commentaire reste pour toujours : un recruteur le lira aussi un jour.' },
      { emoji: '🎨', label: 'Dessin fait en cours d’arts' },
    ],
  },

  // ── Intelligence Artificielle (Yann) ────────────────────────────────────
  'ia-decouverte:play': {
    kind: 'quiz-tap',
    title: 'La machine qui apprend',
    statements: [
      {
        text: 'Une IA apprend à partir d’exemples, comme toi avec tes papiers d’indices.',
        answer: true,
        why: 'Chaque exemple collecté rend tes questions — et les siennes — plus précises.',
      },
      {
        text: 'Une IA bien entraînée ne se trompe jamais.',
        answer: false,
        why: 'Piège des biais : entraînée sur des animaux de la savane, elle se trompe lourdement sur un poisson du fleuve.',
      },
      {
        text: 'Plus une IA collecte d’exemples, plus ses questions deviennent précises.',
        answer: true,
        why: 'C’est exactement l’apprentissage : les indices s’accumulent et affinent la devinette.',
      },
      {
        text: 'Une IA qui n’a vu que la savane devine sans faute un poisson du fleuve.',
        answer: false,
        why: 'Des données incomplètes = des erreurs sur l’inattendu : la machine hérite des limites de ses exemples.',
      },
      {
        text: 'La machine s’améliore par la répétition, comme toi à la deuxième manche.',
        answer: true,
        why: 'Réutiliser ses indices déjà collectés, c’est ça, l’entraînement.',
      },
    ],
  },
  'prompting-mastery:play': {
    kind: 'drag-match',
    title: 'Les cinq ingrédients du prompt',
    goal: 'Associe chaque ingrédient à son exemple dans un prompt complet.',
    pairs: [
      { left: 'Rôle', right: 'Tu es un professeur patient de mon collège' },
      { left: 'Contexte', right: 'J’ai un contrôle dans une semaine et des difficultés sur la partie deux' },
      { left: 'Tâche', right: 'Explique-moi ce chapitre' },
      { left: 'Format', right: 'Trois parties : l’essentiel, les pièges, cinq questions d’entraînement' },
      { left: 'Contrainte', right: 'Utilise des situations de la vie courante ivoirienne' },
    ],
  },
  'prompting-mastery:experiment': {
    kind: 'prompt-lab',
    title: 'Un besoin, cinq versions',
    goal: 'Écris un prompt complet avec les cinq ingrédients, envoie-le à l’IA, puis compare avec un prompt minimal comme « aide-moi avec mon cours ».',
    system:
      'Tu es un assistant pédagogique francophone pour un jeune de 10 à 14 ans. Réponds en français simple, structuré et bienveillant, en trois parties maximum.',
    starter:
      'Tu es un professeur patient de mon collège. J’ai un contrôle dans une semaine sur ce chapitre. ' +
      'Explique-moi ce chapitre en trois parties : l’essentiel en cinq phrases, les trois pièges possibles du contrôle, ' +
      'puis cinq questions d’entraînement avec les réponses. Utilise des exemples de la vie courante ivoirienne.',
  },

  // ── Coding (Koffi) ───────────────────────────────────────────────────────
  'algo-logique:play': {
    kind: 'reorder',
    title: 'Le robot rigide',
    goal: 'Le robot exécute TOUT au pied de la lettre. Remets son programme dans l’ordre pour ramasser le gobelet et le poser sur la table.',
    items: [
      'Avance de dix pas jusqu’au gobelet.',
      'Baisse le bras et ferme la main sur le gobelet.',
      'Lève le bras.',
      'Avance jusqu’à la table.',
      'Pose ce que ta main tient sur la table.',
    ],
  },
  'html-css-firsts:build': {
    kind: 'code-sandbox',
    title: 'Ta page vitrine',
    goal: 'Code une page complète qui présente un club, une équipe ou un commerce de ton choix. Écris les textes d’abord, code section par section, rafraîchis à chaque fois !',
    checklist: [
      'Un en-tête avec titre principal et sous-titre accrocheur',
      'Une présentation en deux paragraphes',
      'Une liste à puces d’au moins cinq activités',
      'Trois images décrites avec leur balise alt remplie',
      'Un contact avec un lien d’email et un bouton',
      'Un pied de page avec le nom de l’auteur et l’année',
    ],
    starter: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>Le club de danse du quartier</title>
  <style>
    body { font-family: sans-serif; margin: 0; color: #222; }
    header { background: #f59e0b; padding: 24px; text-align: center; }
    section { padding: 16px; border-bottom: 1px solid #ddd; }
    footer { padding: 16px; text-align: center; font-size: 14px; }
  </style>
</head>
<body>
  <!-- 1. En-tête : remplace les ? par ton titre et ton sous-titre -->
  <header>
    <h1>?</h1>
    <p>?</p>
  </header>

  <!-- 2. Présentation : deux paragraphes -->
  <section>
    <h2>Qui sommes-nous ?</h2>
    <p>Écris ici ton premier paragraphe.</p>
    <p>Et un deuxième.</p>
  </section>

  <!-- 3. Activités : une liste à puces d'au moins cinq éléments -->
  <section>
    <h2>Nos activités</h2>
    <ul>
      <li>?</li>
    </ul>
  </section>

  <!-- 4. Galerie : trois images, chacune avec son alt bien rempli -->
  <section>
    <h2>Galerie</h2>
    <p>Décris tes trois images ici, chacune avec son alt.</p>
  </section>

  <!-- 5. Contact : un lien d'email et un bouton -->
  <section>
    <h2>Contact</h2>
    <p>Écris-nous : <a href="mailto:club@exemple.ci">club@exemple.ci</a></p>
  </section>

  <!-- 6. Pied de page : le nom de l'auteur et l'année -->
  <footer>
    <p>Par ? — 2026</p>
  </footer>
</body>
</html>`,
  },
  'js-basics:experiment': {
    kind: 'code-sandbox',
    title: 'Le bouton vivant',
    goal: 'Donne un cerveau à ta page : fais parler le bouton, puis compte les clics. Le starter contient un bug à corriger — crie « bug », trouve-le, répare-le !',
    checklist: [
      'Trouve le bouton avec getElementById et range-le dans une const',
      'Attache-lui un écouteur avec addEventListener',
      'Compte les clics dans une let (une const ne change pas !)',
      'Affiche le compteur avec textContent',
      'À dix clics, change la couleur de fond du bouton avec une condition if',
    ],
    starter: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>Le bouton vivant</title>
  <style>
    body { font-family: sans-serif; text-align: center; padding-top: 40px; }
    button { font-size: 20px; padding: 16px 32px; border-radius: 12px; }
  </style>
</head>
<body>
  <h1>Ma page a un cerveau 🧠</h1>
  <button id="b1">Clique-moi</button>

  <script>
    // Défi 1 : affiche "cliqué" dans la console à chaque clic
    // Défi 2 : fais compter les clics sur le bouton
    // Défi 3 : à dix clics, change la couleur de fond du bouton

    const bouton = document.getElementById('b1');
    let compteur = 0;

    // ⚠ Piège : l'événement du clic ne s'écrit pas 'clic' — corrige-le !
    bouton.addEventListener('clic', function () {
      compteur = compteur + 1;
      bouton.textContent = 'Cliqué ' + compteur + ' fois';
    });
  </script>
</body>
</html>`,
  },

  // ── Blockchain (Nadia) ───────────────────────────────────────────────────
  'blockchain-simple:play': {
    kind: 'chain-sim',
    title: 'Le bloc et la chaîne',
    goal: 'Mine des blocs : chaque nouveau bloc scelle l’empreinte du précédent. Puis tente de tricher sur un vieux bloc et regarde la chaîne crier.',
    transactions: [
      'Awa envoie 2 bissaps à Koffi',
      'Sami achète un kiosque à Nadia',
      'Yann verse 500 francs à la tontine',
      'Koffi offre une carte virtuelle à Awa',
      'Nadia paie sa place de match à Yann',
    ],
  },
  'wallet-security:experiment': {
    kind: 'password-meter',
    title: 'Le trésor en douze mots',
    goal: 'Celui qui possède ta phrase secrète recrée ta clé : il est toi. Teste la solidité d’un mot de passe et apprends les réflexes qui protègent un trésor.',
    practices: [
      { label: 'Écris à la main, au stylo, sur papier', detail: 'Jamais en photo, jamais dans une note de téléphone, un courriel ou un message : tout support connecté est une fuite en sursis.' },
      { label: 'Garde le papier hors de toute vue', detail: 'Pas de lecture à voix haute devant d’autres, pas de mots écrits au dos d’un document que l’on montre.' },
      { label: 'Deux copies, deux lieux sûrs', detail: 'Contre le feu et la perte — les plus prudents séparent même en deux morceaux.' },
      { label: 'Prépare la succession', detail: 'Les adultes avisés informent une personne de confiance de l’existence du coffre, sinon l’accès est perdu pour toujours.' },
      { label: 'Méfiance absolue', detail: 'Le faux service client qui « vérifie » ta phrase, le faux site qui la demande : ce sont des attaques à reconnaître.' },
    ],
  },

  // ── Créateur Digital (Awa) ───────────────────────────────────────────────
  'color-theory:experiment': {
    kind: 'color-mixer',
    title: 'Ce que les couleurs disent',
    goal: 'La couleur parle avant les mots. Mélange tes propres teintes, lis leur message, puis reproduis les couleurs des pros.',
    palette: [
      { label: 'Rouge', hex: '#ef4444', message: 'Énergie, urgence, passion, danger' },
      { label: 'Bleu', hex: '#3b82f6', message: 'Confiance, calme, autorité — la couleur des banques' },
      { label: 'Jaune', hex: '#facc15', message: 'Lumière, joie, attention — attire l’œil mais fatigue vite' },
      { label: 'Vert', hex: '#22c55e', message: 'Nature, santé, croissance' },
      { label: 'Violet', hex: '#8b5cf6', message: 'Rareté, mystère, prestige, créativité' },
      { label: 'Orange', hex: '#f97316', message: 'Convivialité, énergie douce, appétit — le rouge joyeux des marchés' },
    ],
    challenges: [
      { label: 'Le vert santé', hex: '#22c55e' },
      { label: 'Le bleu confiance', hex: '#3b82f6' },
      { label: 'L’orange convivial des marchés', hex: '#f97316' },
    ],
  },
  'design-basics:play': {
    kind: 'memory-pairs',
    title: 'Les quatre principes du design',
    goal: 'Retrouve les paires : chaque principe et sa règle. Les designers du monde entier reviennent toujours à ces quatre amis.',
    pairs: [
      { a: 'Contraste', b: 'Si deux choses sont différentes, rends-les très différentes' },
      { a: 'Répétition', b: 'Mêmes couleurs, mêmes formes, mêmes espacements partout' },
      { a: 'Alignement', b: 'Rien ne flotte : chaque élément s’appuie sur une ligne invisible' },
      { a: 'Proximité', b: 'Ce qui va ensemble reste ensemble, les groupes se séparent' },
    ],
  },
  'storytelling:play': {
    kind: 'drag-match',
    title: 'Les trois actes',
    goal: 'Associe chaque acte du squelette universel à sa règle d’or.',
    pairs: [
      { left: 'Acte un : l’installation', right: 'Sois bref — le monde normal en une phrase ou une image' },
      { left: 'Acte deux : la confrontation', right: 'Ne jamais laisser le héros gagner trop vite' },
      { left: 'Acte trois : la résolution', right: 'Une fin inévitable, mais qui surprend une seconde avant' },
      { left: 'Le héros à la fin', right: 'N’est plus celui de l’acte un : il a changé' },
    ],
  },
};

/** Config interactive d'une section, ou null (→ lecteur immersif). */
export function getInteractive(adventureSlug: string, sectionType: string): InteractiveConfig | null {
  return INTERACTIVES[`${adventureSlug}:${sectionType}`] ?? null;
}
