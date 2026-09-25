// Schéma du contrat contenu Digital Explorers.
// Source de vérité partagée entre scripts/validate-content.mjs (validation)
// et scripts/import-content.mjs (import en base).
// Les slugs / titres / XP reflètent exactement la table `adventures`
// peuplée par supabase/seed.sql — ne pas modifier sans remettre la base à jour.

// Les 6 sections de chaque aventure, dans cet ordre exact (sort_order 1 à 6).
export const LESSON_SEQUENCE = ['discover', 'play', 'experiment', 'build', 'mission', 'project'];

export const SECTION_GUIDES = {
  discover: 'Découvre : les concepts clés expliqués simplement, avec des exemples concrets.',
  play: 'Joue : une activité ludique de manipulation (mini-jeu, défi express, quiz imaginaire…).',
  experiment: 'Expérimente : un essai concret guidé que l\'explorateur réalise lui-même.',
  build: 'Construis : une création pas à pas, vérifiable à la fin.',
  mission: 'Mission : un défi concret contextualisé (Afrique, quotidien de l\'explorateur).',
  project: 'Projet : un mini-projet final réutilisable qui prolonge l\'aventure.',
};

export const WORLDS = {
  'web-digital': {
    name: 'Web & Digital',
    adventures: [
      { slug: 'internet-discover', title: "L'aventure d'Internet", xp: 100 },
      { slug: 'search-master', title: 'Maître de la Recherche', xp: 120 },
      { slug: 'web-history', title: 'Histoire du Web', xp: 110 },
      { slug: 'html-basics', title: 'HTML : les fondations', xp: 130 },
      { slug: 'css-style', title: "CSS : donner vie au Web", xp: 130 },
      { slug: 'social-media', title: 'Réseaux sociaux', xp: 110 },
      { slug: 'digital-citizenship', title: 'Citoyenneté numérique', xp: 100 },
      { slug: 'email-mastery', title: "Maîtrise l'email", xp: 110 },
      { slug: 'cloud-storage', title: 'Le cloud et le stockage', xp: 100 },
      { slug: 'web-projects', title: 'Crée ton premier site', xp: 150 },
      { slug: 'digital-africa', title: 'Le numérique en Afrique', xp: 120 },
      { slug: 'future-web', title: 'Le web de demain', xp: 130 },
    ],
  },
  'artificial-intelligence': {
    name: 'Intelligence Artificielle',
    adventures: [
      { slug: 'ia-decouverte', title: "Premiers pas avec l'IA", xp: 100 },
      { slug: 'prompting-mastery', title: 'Art du Prompting', xp: 130 },
      { slug: 'ai-ethics', title: 'IA et éthique', xp: 120 },
      { slug: 'machine-learning', title: 'Machine Learning expliqué', xp: 140 },
      { slug: 'ai-africa', title: 'IA en Afrique', xp: 110 },
      { slug: 'chatbots', title: 'Crée ton propre chatbot', xp: 150 },
      { slug: 'image-gen', title: "Génération d'images par IA", xp: 130 },
      { slug: 'ai-code', title: 'IA et programmation', xp: 140 },
      { slug: 'data-science', title: 'Introduction à la data science', xp: 130 },
      { slug: 'ai-tools', title: 'Outils IA gratuits', xp: 110 },
      { slug: 'future-ai', title: "Le futur de l'IA", xp: 120 },
      { slug: 'ai-project', title: 'Projet IA final', xp: 150 },
    ],
  },
  coding: {
    name: 'Coding',
    adventures: [
      { slug: 'algo-logique', title: 'Algorithmes et Logique', xp: 100 },
      { slug: 'html-css-firsts', title: 'Premiers pas en HTML/CSS', xp: 130 },
      { slug: 'python-basics', title: 'Introduction à Python', xp: 150 },
      { slug: 'js-basics', title: 'JavaScript : le langage du web', xp: 140 },
      { slug: 'git-basics', title: 'Git et le contrôle de version', xp: 120 },
      { slug: 'react-intro', title: 'Introduction à React', xp: 150 },
      { slug: 'python-projects', title: 'Projets Python concrets', xp: 160 },
      { slug: 'web-design', title: 'Design web et UX', xp: 130 },
      { slug: 'api-basics', title: 'Les APIs expliquées', xp: 120 },
      { slug: 'database-basics', title: 'Les bases de données', xp: 140 },
      { slug: 'coding-africa', title: 'Le coding en Afrique', xp: 110 },
      { slug: 'final-project', title: 'Projet de programmation final', xp: 200 },
    ],
  },
  blockchain: {
    name: 'Blockchain & Web3',
    adventures: [
      { slug: 'blockchain-simple', title: 'La blockchain expliquée simplement', xp: 120 },
      { slug: 'crypto-basics', title: 'Crypto-monnaies : les bases', xp: 130 },
      { slug: 'nft-explained', title: 'Les NFTs expliqués', xp: 120 },
      { slug: 'defi-intro', title: 'DeFi : finance décentralisée', xp: 140 },
      { slug: 'smart-contracts', title: 'Smart Contracts', xp: 130 },
      { slug: 'web3-games', title: 'Web3 Gaming', xp: 120 },
      { slug: 'african-blockchain', title: 'Blockchain en Afrique', xp: 110 },
      { slug: 'wallet-security', title: 'Sécurité des wallets', xp: 140 },
      { slug: 'dao-intro', title: 'Les DAO', xp: 130 },
      { slug: 'tokenomics', title: 'Tokenomics', xp: 120 },
      { slug: 'layer2', title: 'Layer 2 Solutions', xp: 130 },
      { slug: 'web3-project', title: 'Projet Web3 final', xp: 150 },
    ],
  },
  'digital-creator': {
    name: 'Digital Creator',
    adventures: [
      { slug: 'design-basics', title: 'Bases du Design', xp: 110 },
      { slug: 'color-theory', title: 'Théorie des couleurs', xp: 120 },
      { slug: 'typography', title: 'Typographie', xp: 110 },
      { slug: 'photo-basics', title: 'Photographie digitale', xp: 100 },
      { slug: 'video-editing', title: 'Montage vidéo', xp: 140 },
      { slug: 'motion-design', title: 'Motion Design', xp: 130 },
      { slug: 'audio-basics', title: 'Production audio', xp: 120 },
      { slug: 'storytelling', title: 'Storytelling digital', xp: 130 },
      { slug: 'social-content', title: 'Création de contenu réseaux sociaux', xp: 110 },
      { slug: 'branding', title: 'Branding personnel', xp: 120 },
      { slug: 'african-creators', title: 'Créateurs africains', xp: 100 },
      { slug: 'creator-project', title: 'Projet créateur final', xp: 150 },
    ],
  },
  'cyber-hero': {
    name: 'Cyber Hero',
    adventures: [
      { slug: 'cyber-securite-basics', title: 'Deviens un Cyber Hero', xp: 100 },
      { slug: 'password-security', title: 'Mots de passe solides', xp: 110 },
      { slug: 'phishing', title: 'Identifie le phishing', xp: 120 },
      { slug: 'social-engineering', title: 'Ingénierie sociale', xp: 110 },
      { slug: 'privacy-online', title: 'Confidentialité en ligne', xp: 120 },
      { slug: 'safe-browsing', title: 'Navigation sécurisée', xp: 100 },
      { slug: 'mobile-security', title: 'Sécurité mobile', xp: 110 },
      { slug: 'public-wifi', title: 'Wi-Fi public sécurisé', xp: 100 },
      { slug: 'family-security', title: 'Sécurité familiale', xp: 120 },
      { slug: 'african-cyber', title: 'Cybersécurité en Afrique', xp: 110 },
      { slug: 'bug-bounty', title: 'Bug Bounty pour débutants', xp: 130 },
      { slug: 'cyber-final', title: 'Mission finale Cyber Hero', xp: 150 },
    ],
  },
  'innovation-entrepreneurship': {
    name: 'Innovation & Entrepreneuriat',
    adventures: [
      { slug: 'design-thinking', title: 'Design Thinking', xp: 150 },
      { slug: 'problem-solving', title: 'Problem Solving', xp: 130 },
      { slug: 'lean-startup', title: 'Lean Startup', xp: 140 },
      { slug: 'business-model', title: 'Business Model Canvas', xp: 130 },
      { slug: 'pitching', title: 'Art du Pitch', xp: 120 },
      { slug: 'fintech-africa', title: 'Fintech en Afrique', xp: 140 },
      { slug: 'agritech', title: 'AgriTech', xp: 130 },
      { slug: 'edtech', title: 'EdTech', xp: 120 },
      { slug: 'social-impact', title: 'Impact Social', xp: 130 },
      { slug: 'digital-marketing', title: 'Marketing digital', xp: 110 },
      { slug: 'african-startups', title: 'Startups africaines à succès', xp: 120 },
      { slug: 'startup-project', title: 'Projet startup final', xp: 150 },
    ],
  },
};

const str = (v) => typeof v === 'string';
const len = (v) => (str(v) ? v.trim().length : -1);
const int = (v) => Number.isInteger(v);

/**
 * Valide un fichier de contenu contre le contrat.
 * @param {*} data contenu JSON parsé
 * @param {string} expectedWorld slug du monde attendu (stem du nom de fichier)
 * @returns {{ ok: boolean, errors: string[], stats: object | null }}
 */
export function validateContent(data, expectedWorld) {
  const errors = [];
  const world = WORLDS[expectedWorld];
  if (!world) {
    return {
      ok: false,
      errors: [
        `Monde inconnu « ${expectedWorld} ». Fichiers attendus : ${Object.keys(WORLDS)
          .map((w) => `content/${w}.json`)
          .join(', ')}.`,
      ],
      stats: null,
    };
  }

  if (data === null || typeof data !== 'object' || Array.isArray(data)) {
    return { ok: false, errors: ['Le fichier doit contenir un objet JSON { world, adventures }.'], stats: null };
  }

  // --- Clés du premier niveau ---
  const expectedKeys = ['world', 'adventures'];
  for (const k of Object.keys(data)) {
    if (!expectedKeys.includes(k)) errors.push(`Clé inattendue au premier niveau : « ${k} » (attendues : world, adventures).`);
  }
  if (data.world !== expectedWorld) {
    errors.push(`world = ${JSON.stringify(data.world)} — attendu « ${expectedWorld} ».`);
  }

  // --- Tableau d'aventures ---
  if (!Array.isArray(data.adventures)) {
    errors.push('adventures doit être un tableau de 12 aventures.');
    return { ok: false, errors, stats: null };
  }
  if (data.adventures.length !== 12) {
    errors.push(`${data.adventures.length} aventures trouvées — attendu exactement 12.`);
  }

  const expectedBySlug = new Map(world.adventures.map((a) => [a.slug, a]));
  const seenSlugs = new Set();
  let totalQuestions = 0;
  let totalChars = 0;

  const advKeys = ['slug', 'title', 'description', 'story', 'xp_reward', 'lessons', 'quiz'];
  const lessonKeys = ['section_type', 'title', 'content'];
  const quizKeys = ['question', 'options', 'correct_index', 'explanation'];

  data.adventures.forEach((adv, idx) => {
    const p = `Aventure ${idx + 1}`;
    if (adv === null || typeof adv !== 'object' || Array.isArray(adv)) {
      errors.push(`${p} : doit être un objet.`);
      return;
    }
    const slug = str(adv.slug) ? adv.slug : `#${idx + 1}`;
    const label = `${p} (${slug})`;
    const expected = expectedBySlug.get(slug);

    for (const k of Object.keys(adv)) {
      if (!advKeys.includes(k)) errors.push(`${label} : clé inattendue « ${k} ».`);
    }
    for (const k of advKeys) {
      if (!(k in adv)) errors.push(`${label} : clé manquante « ${k} ».`);
    }

    if (!str(adv.slug)) {
      errors.push(`${label} : slug doit être une chaîne.`);
    } else if (!expected) {
      errors.push(`${label} : slug inconnu pour le monde « ${expectedWorld} ».`);
    } else {
      seenSlugs.add(adv.slug);
      if (adv.title !== expected.title) {
        errors.push(`${label} : title doit être exactement « ${expected.title} » (reçu : ${JSON.stringify(adv.title)}).`);
      }
      if (!int(adv.xp_reward) || adv.xp_reward !== expected.xp) {
        errors.push(`${label} : xp_reward doit être exactement ${expected.xp} (reçu : ${JSON.stringify(adv.xp_reward)}).`);
      }
    }

    if (!str(adv.title) || len(adv.title) < 3 || len(adv.title) > 120) {
      errors.push(`${label} : title doit être une chaîne de 3 à 120 caractères.`);
    }
    if (!str(adv.description) || len(adv.description) < 20 || len(adv.description) > 300) {
      errors.push(`${label} : description doit être une chaîne de 20 à 300 caractères.`);
    }
    if (!str(adv.story) || len(adv.story) < 80 || len(adv.story) > 2000) {
      errors.push(`${label} : story doit être une chaîne de 80 à 2000 caractères.`);
    }
    totalChars += str(adv.description) ? adv.description.length : 0;
    totalChars += str(adv.story) ? adv.story.length : 0;

    // --- Leçons ---
    if (!Array.isArray(adv.lessons)) {
      errors.push(`${label} : lessons doit être un tableau de 6 sections.`);
    } else {
      if (adv.lessons.length !== 6) {
        errors.push(`${label} : ${adv.lessons.length} leçons — attendu exactement 6.`);
      }
      adv.lessons.forEach((les, li) => {
        const lp = `${label} · leçon ${li + 1}`;
        if (les === null || typeof les !== 'object' || Array.isArray(les)) {
          errors.push(`${lp} : doit être un objet.`);
          return;
        }
        for (const k of Object.keys(les)) {
          if (!lessonKeys.includes(k)) errors.push(`${lp} : clé inattendue « ${k} ».`);
        }
        for (const k of lessonKeys) {
          if (!(k in les)) errors.push(`${lp} : clé manquante « ${k} ».`);
        }
        if (les.section_type !== LESSON_SEQUENCE[li]) {
          errors.push(`${lp} : section_type doit être « ${LESSON_SEQUENCE[li]} » (reçu : ${JSON.stringify(les.section_type)}).`);
        }
        if (!str(les.title) || len(les.title) < 3 || len(les.title) > 120) {
          errors.push(`${lp} : title doit être une chaîne de 3 à 120 caractères.`);
        }
        if (!str(les.content) || len(les.content) < 200 || len(les.content) > 4000) {
          errors.push(`${lp} : content doit faire entre 200 et 4000 caractères (reçu : ${len(les.content)}).`);
        }
        totalChars += str(les.content) ? les.content.length : 0;
      });
    }

    // --- Quiz ---
    if (!Array.isArray(adv.quiz)) {
      errors.push(`${label} : quiz doit être un tableau de 3 à 5 questions.`);
    } else {
      if (adv.quiz.length < 3 || adv.quiz.length > 5) {
        errors.push(`${label} : ${adv.quiz.length} questions — attendu entre 3 et 5.`);
      }
      totalQuestions += adv.quiz.length;
      adv.quiz.forEach((q, qi) => {
        const qp = `${label} · question ${qi + 1}`;
        if (q === null || typeof q !== 'object' || Array.isArray(q)) {
          errors.push(`${qp} : doit être un objet.`);
          return;
        }
        for (const k of Object.keys(q)) {
          if (!quizKeys.includes(k)) errors.push(`${qp} : clé inattendue « ${k} ».`);
        }
        for (const k of quizKeys) {
          if (!(k in q)) errors.push(`${qp} : clé manquante « ${k} ».`);
        }
        if (!str(q.question) || len(q.question) < 15 || len(q.question) > 300) {
          errors.push(`${qp} : question doit faire entre 15 et 300 caractères.`);
        }
        if (!Array.isArray(q.options) || q.options.length < 3 || q.options.length > 5) {
          errors.push(`${qp} : options doit être un tableau de 3 à 5 chaînes.`);
        } else {
          q.options.forEach((opt, oi) => {
            if (!str(opt) || opt.trim().length < 1 || opt.length > 200) {
              errors.push(`${qp} · option ${oi + 1} : doit être une chaîne de 1 à 200 caractères.`);
            }
          });
          const dup = new Set(q.options.map((o) => (str(o) ? o.trim() : o)));
          if (dup.size !== q.options.length) {
            errors.push(`${qp} : options en double.`);
          }
        }
        if (!int(q.correct_index) || (Array.isArray(q.options) && (q.correct_index < 0 || q.correct_index >= q.options.length))) {
          errors.push(`${qp} : correct_index doit être un entier entre 0 et ${Array.isArray(q.options) ? q.options.length - 1 : 'n'}-1.`);
        }
        if (!str(q.explanation) || len(q.explanation) < 30 || len(q.explanation) > 2000) {
          errors.push(`${qp} : explanation doit faire entre 30 et 2000 caractères.`);
        }
        totalChars += str(q.question) ? q.question.length : 0;
        totalChars += str(q.explanation) ? q.explanation.length : 0;
      });
    }
  });

  const missing = world.adventures.filter((a) => !seenSlugs.has(a.slug)).map((a) => a.slug);
  if (missing.length > 0) {
    errors.push(`Aventures manquantes pour « ${expectedWorld} » : ${missing.join(', ')}.`);
  }

  const stats = {
    world: expectedWorld,
    worldName: world.name,
    adventures: data.adventures.length,
    lessons: data.adventures.length * 6,
    questions: totalQuestions,
    chars: totalChars,
  };

  return { ok: errors.length === 0, errors, stats };
}
