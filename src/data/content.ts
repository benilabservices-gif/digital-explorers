export type WorldSlug = 'web-digital' | 'artificial-intelligence' | 'coding' | 'blockchain' | 'digital-creator' | 'cyber-hero' | 'innovation-entrepreneurship';
export type Phase = 'explorer' | 'creator' | 'builder';

export interface Badge {
  id: string; slug: string; name: string; description: string; icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary'; xp_required: number; world_id: string | null;
}

export interface DigitalBridge {
  id: string; slug: string; name: string; description: string; targetUrl: string;
  icon: string; color: string; worldId: string | null; order: number; isActive: boolean;
}

export const BADGES: Badge[] = [
  { id: 'web-explorer', slug: 'web-explorer', name: 'Web Explorer', description: 'Tu as exploré le monde du Web', icon: '🌐', rarity: 'common', xp_required: 100, world_id: 'web-digital' },
  { id: 'ai-explorer', slug: 'ai-explorer', name: 'AI Explorer', description: "Premiers pas dans l'IA", icon: '🤖', rarity: 'common', xp_required: 100, world_id: 'artificial-intelligence' },
  { id: 'junior-coder', slug: 'junior-coder', name: 'Junior Coder', description: "Tu as écrit ton premier programme", icon: '💻', rarity: 'common', xp_required: 150, world_id: 'coding' },
  { id: 'blockchain-explorer', slug: 'blockchain-explorer', name: 'Blockchain Explorer', description: "Tu comprends la blockchain", icon: '⛓️', rarity: 'rare', xp_required: 200, world_id: 'blockchain' },
  { id: 'digital-creator-badge', slug: 'digital-creator', name: 'Digital Creator', description: 'Tu as créé ton premier contenu', icon: '🎨', rarity: 'common', xp_required: 150, world_id: 'digital-creator' },
  { id: 'cyber-hero-badge', slug: 'cyber-hero', name: 'Cyber Hero', description: 'Tu es un héros de la cybersécurité', icon: '🔐', rarity: 'rare', xp_required: 200, world_id: 'cyber-hero' },
  { id: 'young-innovator', slug: 'young-innovator', name: 'Young Innovator', description: 'Tu as présenté un projet innovant', icon: '🚀', rarity: 'epic', xp_required: 300, world_id: 'innovation-entrepreneurship' },
  { id: 'first-project', slug: 'first-project', name: 'Premier Projet', description: 'Ton premier projet soumis', icon: '⭐', rarity: 'common', xp_required: 0, world_id: null },
  { id: 'explorer-legend', slug: 'explorer-legend', name: 'Légende Exploratrice', description: 'Tu as accumulé 2000 XP', icon: '👑', rarity: 'legendary', xp_required: 2000, world_id: null },
];

export const DIGITAL_BRIDGES: DigitalBridge[] = [
  { id: '1', slug: 'coding-start', name: 'Commence ton aventure code', description: "Tu as découvert les bases de la programmation.", targetUrl: 'https://geekcoding4kids.online', icon: '💻', color: 'from-emerald-500 to-teal-400', worldId: 'coding', order: 1, isActive: true },
  { id: '2', slug: 'web-build', name: 'Construis ton premier site', description: 'Tu connais HTML/CSS ? Va plus loin.', targetUrl: 'https://geekcoding4kids.online', icon: '🌐', color: 'from-blue-500 to-cyan-400', worldId: 'web-digital', order: 2, isActive: true },
  { id: '3', slug: 'ai-create', name: 'Crée avec l\'IA', description: "Découvre comment maîtriser l'IA.", targetUrl: 'https://geekcoding4kids.online', icon: '🤖', color: 'from-violet-500 to-purple-400', worldId: 'artificial-intelligence', order: 3, isActive: true },
];

export interface World {
  id: string; slug: WorldSlug; name: string; icon: string; description: string;
  color: string; gradient: string; phase: Phase; adventures?: Adventure[];
}

export interface Lesson {
  id: string; type: string; order: number; title: string; content: string;
}

export interface Adventure {
  id: string; slug: string; title: string; description: string; story: string;
  xp_reward: number; lessons?: Lesson[];
}

export const WORLDS: World[] = [
  {
    id: 'web-digital', slug: 'web-digital', name: 'Web & Digital', icon: '🌐',
    description: 'Découvre Internet, le Web, les réseaux sociaux et la culture numérique.',
    color: '#3B82F6', gradient: 'from-blue-500 to-cyan-400', phase: 'explorer',
    adventures: [
      { id: 'a1', slug: 'internet-discover', title: "L'aventure d'Internet", description: "Comment le monde entier s'est connecté en un clic ?", story: "Il était une fois, un réseau secret appelé ARPANET. Aujourd'hui, Internet connecte plus de 5 milliards de personnes !", xp_reward: 100,
        lessons: [
          { id: 'l1', type: 'story', order: 1, title: 'Le début d\'Internet', content: 'ARPANET était né pendant la Guerre Froide. Deux universités américaines ont relié leurs ordinateurs pour partager des informations.' },
          { id: 'l2', type: 'discover', order: 2, title: 'Comment fonctionne Internet ?', content: 'Internet est un réseau de réseaux. Des câbles sous-marins relient les continents.' },
          { id: 'l3', type: 'play', order: 3, title: 'Mini-jeu: Connexion', content: 'Relie chaque élément à sa fonction dans le réseau Internet.' },
          { id: 'l4', type: 'experiment', order: 4, title: 'Explore le Web', content: 'Ouvre ton navigateur et cherche l\'histoire d\'Internet.' },
          { id: 'l5', type: 'build', order: 5, title: 'Ma première page Web', content: 'Crée ta première page HTML avec ton nom et une photo.' },
          { id: 'l6', type: 'mission', order: 6, title: 'Mission: Enquêteur du Net', content: 'Raconte comment Internet a changé le monde en 100 mots.' },
          { id: 'l7', type: 'reflect', order: 7, title: 'Réflexion', content: "Qu'est-ce qui t'a le plus surpris dans cette aventure ?" },
        ]
      },
      { id: 'a2', slug: 'search-master', title: 'Maitre de la Recherche', description: 'Apprends à trouver l\'information fiable sur Internet.', story: "Sur Internet, il y a autant d'informations vraies que fausses. Savoir chercher et vérifier est essentiel.", xp_reward: 120,
        lessons: [
          { id: 'l1', type: 'story', order: 1, title: 'L\'information, une ressource precieuse', content: 'Chaque jour, des milliards de recherches sont faites sur Google.' },
          { id: 'l2', type: 'discover', order: 2, title: 'Les moteurs de recherche', content: 'Google, Bing, Qwant... Chaque moteur fonctionne différemment.' },
          { id: 'l3', type: 'play', order: 3, title: 'Quiz: Vrai ou Faux ?', content: 'Teste ta capacité à distinguer les sources fiables.' },
          { id: 'l4', type: 'experiment', order: 4, title: 'Compare les résultats', content: 'Recherche le même sujet sur 3 moteurs différents.' },
          { id: 'l5', type: 'build', order: 5, title: 'Crée un guide de recherche', content: 'Rédige un mini-guide avec tes astuces.' },
          { id: 'l6', type: 'mission', order: 6, title: 'Mission: Détective du Web', content: 'Trouve 3 sources fiables sur un sujet.' },
          { id: 'l7', type: 'reflect', order: 7, title: 'Réflexion', content: 'Pourquoi est-il important de vérifier ses sources ?' },
        ]
      },
    ]
  },
  {
    id: 'artificial-intelligence', slug: 'artificial-intelligence', name: 'Intelligence Artificielle', icon: '🤖',
    description: "Découvre l'IA, comment elle fonctionne, et comment l'utiliser de manière éthique.",
    color: '#8B5CF6', gradient: 'from-violet-500 to-purple-400', phase: 'explorer',
    adventures: [
      { id: 'a1', slug: 'ia-decouverte', title: 'Premiers pas avec l\'IA', description: "Qu'est-ce que l'intelligence artificielle ?", story: "Awa adore dessiner. Un jour, elle demande à une IA de l'aider à créer une image.", xp_reward: 100,
        lessons: [
          { id: 'l1', type: 'story', order: 1, title: "L'histoire de l'IA", content: "Depuis les années 1950, les chercheurs rêvent de créer des machines intelligentes." },
          { id: 'l2', type: 'discover', order: 2, title: 'Comment l\'IA apprend ?', content: "L'IA apprend à partir d'exemples. On lui montre des milliers d'images." },
          { id: 'l3', type: 'play', order: 3, title: 'Jeu: Entraîne ton IA', content: 'Classifie des images pour aider l\'IA à apprendre !' },
          { id: 'l4', type: 'experiment', order: 4, title: 'Experimente avec un chatbot', content: 'Discute avec une IA et observe comment elle répond.' },
          { id: 'l5', type: 'build', order: 5, title: 'Crée ton propre prompt', content: 'Écris un prompt efficace pour demander à une IA de t\'aider.' },
          { id: 'l6', type: 'mission', order: 6, title: 'Mission: L\'IA au service des Africains', content: 'Imagine comment l\'IA peut résoudre un problème dans ta communauté.' },
          { id: 'l7', type: 'reflect', order: 7, title: 'Réflexion', content: 'Quelles sont les limites de l\'IA ?' },
        ]
      },
      { id: 'a2', slug: 'prompting-mastery', title: 'Art du Prompting', description: "Maîtrise l'art de dialoguer avec les IA génératives.", story: "Koffi veut utiliser une IA pour l'aider à comprendre un concept complexe.", xp_reward: 130,
        lessons: [
          { id: 'l1', type: 'story', order: 1, title: "Le pouvoir des mots", content: "Une bonne question donne une bonne réponse." },
          { id: 'l2', type: 'discover', order: 2, title: 'Les ingrédients d\'un bon prompt', content: 'Contexte + Tâche + Format + Exemple = Prompt efficace.' },
          { id: 'l3', type: 'play', order: 3, title: 'Challenge: Améliore ce prompt', content: 'Voici un prompt faible. Peux-tu le rendre meilleur ?' },
          { id: 'l4', type: 'experiment', order: 4, title: 'Compare les réponses', content: 'Pose la même question de 3 façons différentes.' },
          { id: 'l5', type: 'build', order: 5, title: "Crée ton guide de prompting", content: 'Rédige un mini-guide avec tes meilleures astuces.' },
          { id: 'l6', type: 'mission', order: 6, title: 'Mission: L\'expert en prompts', content: 'Utilise le prompting pour résoudre un problème réel.' },
          { id: 'l7', type: 'reflect', order: 7, title: 'Réflexion', content: "Qu'est-ce qui rend un prompt vraiment efficace ?" },
        ]
      },
    ]
  },
  {
    id: 'coding', slug: 'coding', name: 'Coding', icon: '💻',
    description: 'Apprends les bases de la programmation et crée tes premiers programmes.',
    color: '#10B981', gradient: 'from-emerald-500 to-teal-400', phase: 'creator',
    adventures: [
      { id: 'a1', slug: 'algo-logique', title: 'Algorithmes et Logique', description: 'La programmation commence par la logique.', story: 'Sami veut créer un jeu vidéo. Mais avant de coder, il doit apprendre à penser comme un programmeur.', xp_reward: 100,
        lessons: [
          { id: 'l1', type: 'story', order: 1, title: 'Qu\'est-ce qu\'un algorithme ?', content: 'Un algorithme est une suite d\'instructions précises pour résoudre un problème.' },
          { id: 'l2', type: 'discover', order: 2, title: 'Les blocs de construction', content: 'Séquence, condition, boucle : voici les 3 piliers de tout programme.' },
          { id: 'l3', type: 'play', order: 3, title: 'Jeu: Programme le robot', content: 'Guide un robot à travers un labyrinthe en lui donnant des instructions.' },
          { id: 'l4', type: 'experiment', order: 4, title: 'Décompose un problème', content: 'Prends un problème quotidien et écris les étapes pour le résoudre.' },
          { id: 'l5', type: 'build', order: 5, title: 'Crée ton premier pseudo-code', content: 'Écris un algorithme en langage naturel.' },
          { id: 'l6', type: 'mission', order: 6, title: 'Mission: Le résolveur de problèmes', content: 'Propose un algorithme pour un problème de ta vie quotidienne.' },
          { id: 'l7', type: 'reflect', order: 7, title: 'Réflexion', content: "Comment la pensée algorithmique t'aide-t-elle au quotidien ?" },
        ]
      },
      { id: 'a2', slug: 'html-css-firsts', title: 'Premiers pas en HTML/CSS', description: 'Crée ta première page web structurée et stylée.', story: 'Nadia veut créer son propre site web. Elle a entendu parler de HTML et CSS.', xp_reward: 130,
        lessons: [
          { id: 'l1', type: 'story', order: 1, title: 'Les fondations du Web', content: 'HTML est le squelette, CSS est la peau.' },
          { id: 'l2', type: 'discover', order: 2, title: 'Structure HTML', content: 'Les balises h1, p, div, img sont les briques de base.' },
          { id: 'l3', type: 'play', order: 3, title: 'Jeu: Assemble les balises', content: 'Remets les balises dans le bon ordre pour construire une page.' },
          { id: 'l4', type: 'experiment', order: 4, title: 'Experimente avec CodePen', content: 'Modifie du code HTML/CSS en direct et observe les changements.' },
          { id: 'l5', type: 'build', order: 5, title: 'Ma première page', content: "Crée une page avec ton nom, une photo et tes passions." },
          { id: 'l6', type: 'mission', order: 6, title: 'Mission: Portfolio personnel', content: "Crée une page qui présente qui tu es." },
          { id: 'l7', type: 'reflect', order: 7, title: 'Réflexion', content: 'Quelle balise as-tu trouvée la plus utile ?' },
        ]
      },
      { id: 'a3', slug: 'python-basics', title: 'Introduction à Python', description: 'Le langage le plus populaire pour débuter en programmation.', story: "Yann a entendu dire que Python est le langage des IA.", xp_reward: 150,
        lessons: [
          { id: 'l1', type: 'story', order: 1, title: 'Pourquoi Python ?', content: 'Python est simple, puissant et utilisé partout : IA, web, data, automation...' },
          { id: 'l2', type: 'discover', order: 2, title: 'Variables et types', content: "Les variables stockent des informations. Texte, nombres, booléens." },
          { id: 'l3', type: 'play', order: 3, title: "Jeu: Devine le résultat", content: "Quel sera le résultat de ce code ? Teste tes compétences !" },
          { id: 'l4', type: 'experiment', order: 4, title: 'Experimente avec des variables', content: 'Crée des variables et manipule-les.' },
          { id: 'l5', type: 'build', order: 5, title: 'Ton premier programme', content: 'Écris un programme qui demande ton nom et te salue.' },
          { id: 'l6', type: 'mission', order: 6, title: 'Mission: Calculateur de notes', content: 'Crée un programme qui calcule la moyenne d’un élève.' },
          { id: 'l7', type: 'reflect', order: 7, title: 'Réflexion', content: "Qu'est-ce qui te plaît le plus dans Python ?" },
        ]
      },
    ]
  },
  {
    id: 'blockchain', slug: 'blockchain', name: 'Blockchain & Web3', icon: '⛓️',
    description: 'Comprends la blockchain sans spéculation. Technologie éducative.',
    color: '#F59E0B', gradient: 'from-amber-500 to-orange-400', phase: 'builder',
    adventures: [
      { id: 'a1', slug: 'blockchain-simple', title: 'La blockchain expliquée simplement', description: "Une technologie qui change la façon dont on fait confiance.", story: "Sami et Koffi veulent comprendre cette histoire de blockchain.", xp_reward: 120,
        lessons: [
          { id: 'l1', type: 'story', order: 1, title: "L'histoire de la confiance", content: "Depuis toujours, on a besoin de faire confiance à quelqu'un pour échanger." },
          { id: 'l2', type: 'discover', order: 2, title: "Qu'est-ce qu'un bloc ?", content: "Imagine un cahier où chaque page contient des informations scellées." },
          { id: 'l3', type: 'play', order: 3, title: 'Jeu: Deviens mineur', content: 'Résous un puzzle pour valider un bloc et rejoindre la chaîne.' },
          { id: 'l4', type: 'experiment', order: 4, title: 'Simule une blockchain', content: 'Crée ta propre petite blockchain sur papier.' },
          { id: 'l5', type: 'build', order: 5, title: 'Documente ta compréhension', content: 'Rédige une explication simple de la blockchain pour un ami.' },
          { id: 'l6', type: 'mission', order: 6, title: 'Mission: Blockchain pour le bien', content: 'Propose un usage de la blockchain qui aide ta communauté.' },
          { id: 'l7', type: 'reflect', order: 7, title: 'Réflexion', content: "Quelles différences avec un système traditionnel ?" },
        ]
      },
    ]
  },
  {
    id: 'digital-creator', slug: 'digital-creator', name: 'Digital Creator', icon: '🎨',
    description: 'Design, vidéo, audio, storytelling — deviens créateur de contenu.',
    color: '#EC4899', gradient: 'from-pink-500 to-rose-400', phase: 'creator',
    adventures: [
      { id: 'a1', slug: 'design-basics', title: 'Bases du Design', description: 'Les principes fondamentaux du design visuel.', story: "Nadia veut créer des visuels impactants mais ne sait pas par où commencer.", xp_reward: 110,
        lessons: [
          { id: 'l1', type: 'story', order: 1, title: "L'oeil du créateur", content: "Le design, c'est l'art de communiquer visuellement." },
          { id: 'l2', type: 'discover', order: 2, title: 'Les 5 principes du design', content: 'Contraste, alignment, répétition, proximité, échelle.' },
          { id: 'l3', type: 'play', order: 3, title: 'Jeu: Trouve l\'erreur', content: 'Repère les erreurs de design dans ces exemples.' },
          { id: 'l4', type: 'experiment', order: 4, title: 'Experimente avec Canva', content: 'Crée 3 variations d’un même visuel.' },
          { id: 'l5', type: 'build', order: 5, title: 'Crée ton poster', content: 'Crée un poster sur un sujet qui te passionne.' },
          { id: 'l6', type: 'mission', order: 6, title: 'Mission: Redesign inspirant', content: 'Améliore un visuel existant en appliquant les principes.' },
          { id: 'l7', type: 'reflect', order: 7, title: 'Réflexion', content: 'Quel principe as-tu le plus aimé appliquer ?' },
        ]
      },
    ]
  },
  {
    id: 'cyber-hero', slug: 'cyber-hero', name: 'Cyber Hero', icon: '🔐',
    description: 'Deviens un héros du cyberespace : protège tes données et celles des autres.',
    color: '#EF4444', gradient: 'from-red-500 to-rose-400', phase: 'explorer',
    adventures: [
      { id: 'a1', slug: 'cyber-securite-basics', title: 'Deviens un Cyber Hero', description: "Les bases de la cybersécurité pour les jeunes.", story: "Yann a reçu un message sospe. Est-ce un hameçonnage ?", xp_reward: 100,
        lessons: [
          { id: 'l1', type: 'story', order: 1, title: 'Le monde numérique a des risques', content: "Sur Internet, il faut être vigilant." },
          { id: 'l2', type: 'discover', order: 2, title: 'Mots de passe solides', content: "Un bon mot de passe : 12 caractères minimum, mélange de lettres, chiffres et symboles." },
          { id: 'l3', type: 'play', order: 3, title: 'Jeu: Crée un mot de passe fort', content: 'Teste la solidité de ton mot de passe.' },
          { id: 'l4', type: 'experiment', order: 4, title: 'Identifie le phishing', content: 'Reconnaît les emails et messages piégés.' },
          { id: 'l5', type: 'build', order: 5, title: 'Crée ton plan de sécurité', content: 'Établis tes règles personnelles de sécurité en ligne.' },
          { id: 'l6', type: 'mission', order: 6, title: 'Mission: Protège ta communauté', content: "Enseigne une règle de cybersécurité à quelqu'un." },
          { id: 'l7', type: 'reflect', order: 7, title: 'Réflexion', content: "Quelle habitude vas-tu changer dès aujourd'hui ?" },
        ]
      },
    ]
  },
  {
    id: 'innovation-entrepreneurship', slug: 'innovation-entrepreneurship', name: 'Innovation & Entrepreneuriat', icon: '🚀',
    description: 'Identifie des problèmes, crée des solutions, construis ton avenir.',
    color: '#06B6D4', gradient: 'from-cyan-500 to-blue-400', phase: 'builder',
    adventures: [
      { id: 'a1', slug: 'design-thinking', title: 'Design Thinking', description: 'La méthode pour résoudre les problèmes avec créativité.', story: 'Nadia voit un problème dans son quartier : les déchets.', xp_reward: 150,
        lessons: [
          { id: 'l1', type: 'story', order: 1, title: 'Chacun peut innover', content: "L'innovation n'est pas réservée aux grands génies." },
          { id: 'l2', type: 'discover', order: 2, title: 'Les 5 étapes du Design Thinking', content: 'Empathie, Define, Ideate, Prototype, Test.' },
          { id: 'l3', type: 'play', order: 3, title: 'Jeu: Identifie le problème', content: 'À partir d\'une situation, identifie le vrai problème.' },
          { id: 'l4', type: 'experiment', order: 4, title: 'Brainstorming', content: 'Génère 10 idées pour résoudre un problème.' },
          { id: 'l5', type: 'build', order: 5, title: 'Prototype ta solution', content: 'Crée un prototype simple.' },
          { id: 'l6', type: 'mission', order: 6, title: 'Mission: Ton projet d’impact', content: "Présente ton projet qui résout un problème local." },
          { id: 'l7', type: 'reflect', order: 7, title: 'Réflexion', content: "Qu'est-ce que tu as appris sur toi-même ?" },
        ]
      },
    ]
  },
];
