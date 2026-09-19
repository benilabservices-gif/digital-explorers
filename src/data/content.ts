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

export interface Lesson {
  id: string; type: string; order: number; title: string; content: string;
}

export interface Adventure {
  id: string; slug: string; title: string; description: string; story: string;
  xp_reward: number; lessons?: Lesson[];
}

export interface World {
  id: string; slug: WorldSlug; name: string; icon: string; description: string;
  color: string; gradient: string; phase: Phase; adventures?: Adventure[];
}

export interface ChildProfile {
  id: string; name: string; age: number; gradeLevel: string; avatar: string;
  xp: number; level: number; phase: Phase;
  badges: string[]; adventuresCompleted: string[]; interests: string[];
  createdAt: string;
}

export interface ParentProfile {
  id: string; email: string; name: string; phone?: string;
  plan: 'starter' | 'monthly' | 'annual'; planEnd?: string;
  children: ChildProfile[];
  createdAt: string;
}

export const BADGES: Badge[] = [
  { id: 'web-explorer', slug: 'web-explorer', name: 'Web Explorer', description: 'Tu as exploré le monde du Web', icon: '🌐', rarity: 'common', xp_required: 100, world_id: 'web-digital' },
  { id: 'web-master', slug: 'web-master', name: 'Maître du Web', description: '12 aventures Web terminées', icon: '🕸️', rarity: 'rare', xp_required: 500, world_id: 'web-digital' },
  { id: 'ai-explorer', slug: 'ai-explorer', name: 'AI Explorer', description: "Premiers pas dans l'IA", icon: '🤖', rarity: 'common', xp_required: 100, world_id: 'artificial-intelligence' },
  { id: 'ai-master', slug: 'ai-master', name: 'Maître de l\'IA', description: '12 aventures IA terminées', icon: '🧠', rarity: 'rare', xp_required: 500, world_id: 'artificial-intelligence' },
  { id: 'junior-coder', slug: 'junior-coder', name: 'Junior Coder', description: "Tu as écrit ton premier programme", icon: '💻', rarity: 'common', xp_required: 150, world_id: 'coding' },
  { id: 'code-master', slug: 'code-master', name: 'Code Master', description: '12 aventures Coding terminées', icon: '⚙️', rarity: 'rare', xp_required: 500, world_id: 'coding' },
  { id: 'blockchain-explorer', slug: 'blockchain-explorer', name: 'Blockchain Explorer', description: "Tu comprends la blockchain", icon: '⛓️', rarity: 'rare', xp_required: 200, world_id: 'blockchain' },
  { id: 'blockchain-master', slug: 'blockchain-master', name: 'Blockchain Master', description: '12 aventures Blockchain terminées', icon: '🔗', rarity: 'epic', xp_required: 500, world_id: 'blockchain' },
  { id: 'digital-creator-badge', slug: 'digital-creator', name: 'Digital Creator', description: 'Tu as créé ton premier contenu', icon: '🎨', rarity: 'common', xp_required: 150, world_id: 'digital-creator' },
  { id: 'creator-master', slug: 'creator-master', name: 'Créateur Master', description: '12 aventures Design terminées', icon: '✨', rarity: 'rare', xp_required: 500, world_id: 'digital-creator' },
  { id: 'cyber-hero-badge', slug: 'cyber-hero', name: 'Cyber Hero', description: 'Tu es un héros de la cybersécurité', icon: '🔐', rarity: 'rare', xp_required: 200, world_id: 'cyber-hero' },
  { id: 'cyber-master', slug: 'cyber-master', name: 'Cyber Master', description: '12 aventures Cybersécurité terminées', icon: '🛡️', rarity: 'epic', xp_required: 500, world_id: 'cyber-hero' },
  { id: 'young-innovator', slug: 'young-innovator', name: 'Young Innovator', description: 'Tu as présenté un projet innovant', icon: '🚀', rarity: 'epic', xp_required: 300, world_id: 'innovation-entrepreneurship' },
  { id: 'innovator-master', slug: 'innovator-master', name: 'Innovator Master', description: '12 aventures Innovation terminées', icon: '💡', rarity: 'epic', xp_required: 500, world_id: 'innovation-entrepreneurship' },
  { id: 'first-project', slug: 'first-project', name: 'Premier Projet', description: 'Ton premier projet soumis', icon: '⭐', rarity: 'common', xp_required: 0, world_id: null },
  { id: 'explorer-legend', slug: 'explorer-legend', name: 'Légende Exploratrice', description: 'Tu as accumulé 2000 XP', icon: '👑', rarity: 'legendary', xp_required: 2000, world_id: null },
  { id: 'multi-children', slug: 'multi-children', name: 'Grand Frère/Soeur', description: 'Parent avec 2+ enfants', icon: '👨‍👩‍👧‍👦', rarity: 'rare', xp_required: 0, world_id: null },
  { id: 'starter-complete', slug: 'starter-complete', name: 'Starter Finished', description: 'Terminé les 7 jours starter', icon: '🌱', rarity: 'common', xp_required: 0, world_id: null },
];

export const DIGITAL_BRIDGES: DigitalBridge[] = [
  { id: '1', slug: 'coding-start', name: 'Commence ton aventure code', description: "Tu as découvert les bases de la programmation.", targetUrl: 'https://geekcoding4kids.online', icon: '💻', color: 'from-emerald-500 to-teal-400', worldId: 'coding', order: 1, isActive: true },
  { id: '2', slug: 'web-build', name: 'Construis ton premier site', description: 'Tu connais HTML/CSS ? Va plus loin.', targetUrl: 'https://geekcoding4kids.online', icon: '🌐', color: 'from-blue-500 to-cyan-400', worldId: 'web-digital', order: 2, isActive: true },
  { id: '3', slug: 'ai-create', name: 'Crée avec l\'IA', description: "Découvre comment maîtriser l'IA.", targetUrl: 'https://geekcoding4kids.online', icon: '🤖', color: 'from-violet-500 to-purple-400', worldId: 'artificial-intelligence', order: 3, isActive: true },
];

export const CHILD_AVATARS = ['👦🏾','👧🏾','👦🏿','👧🏿','👦🏽','👧🏽','🧑🏾','👩🏾','👨🏿','👩🏿'];
export const CHILD_INTERESTS = ['Jeux vidéo','Dessin','Musique','Sport','Science','Programmation','Réseaux sociaux','Cinéma','Lecture','Entrepreneuriat','Environnement','Robotique','Photographie','Cuisine','Mode','Voyage'];
export const GRADES = ['6e','5e','4e','3e','2nde','1ère','Terminale'];

function makeAdventure(slug: string, title: string, desc: string, story: string, xp: number, lessonCount: number): Adventure {
  const lessons: Lesson[] = [];
  const types = ['story','discover','play','experiment','build','mission','reflect'];
  for (let i = 0; i < lessonCount; i++) {
    lessons.push({
      id: `l${i+1}`,
      type: types[i % types.length],
      order: i + 1,
      title: `Étape ${i+1}: ${title.split(' ').slice(0,3).join(' ')}`,
      content: `Découvre et apprends à ton rythme. Chaque étape te rapproche de ta prochaine récompense.`,
    });
  }
  return { id: `a_${slug}_${Date.now()}`, slug, title, description: desc, story, xp_reward: xp, lessons };
}

export const WORLDS: World[] = [
  {
    id: 'web-digital', slug: 'web-digital', name: 'Web & Digital', icon: '🌐',
    description: 'Découvre Internet, le Web, les réseaux sociaux et la culture numérique. 12 aventures pour maîtriser le monde digital.',
    color: '#3B82F6', gradient: 'from-blue-500 to-cyan-400', phase: 'explorer',
    adventures: [
      makeAdventure('internet-discover','L\'aventure d\'Internet',"Comment le monde entier s'est connecté en un clic ?",'Il était une fois, un réseau secret appelé ARPANET. Aujourd\'hui, Internet connecte plus de 5 milliards de personnes !',100,12),
      makeAdventure('search-master','Maître de la Recherche','Apprends à trouver l\'information fiable sur Internet.','Sur Internet, il y a autant d\'informations vraies que fausses. Savoir chercher et vérifier est essentiel.',120,12),
      makeAdventure('web-history','Histoire du Web','De Tim Berners-Lee au Web 3.0.','Le World Wide Web a été inventé en 1989. Depuis, il a transformé notre monde.',110,12),
      makeAdventure('html-basics','HTML : les fondations','Construise la structure de toute page web.','HTML est le squelette du Web. Chaque site que tu visites est construit avec ces balises.',130,12),
      makeAdventure('css-style','CSS : donner vie au Web','Apprends à styliser tes pages web.','CSS est la peau et les vêtements du Web. Il rend chaque page unique et belle.',130,12),
      makeAdventure('social-media','Réseaux sociaux','Comprendre les plateformes qui connectent l\'Afrique.','LinkedIn, Twitter, TikTok... Les réseaux sociaux sont des outils puissants pour apprendre et créer.',110,12),
      makeAdventure('digital-citizenship','Citoyenneté numérique','Être un bon citoyen dans le monde digital.','En ligne comme hors ligne, nos actions ont des conséquences. Apprends à naviguer responsablement.',100,12),
      makeAdventure('email-mastery','Maîtrise l\'email','Communication professionnelle depuis ton bureau.','L\'email reste l\'outil professionnel n°1. Apprends à écrire des mails efficaces.',110,12),
      makeAdventure('cloud-storage','Le cloud et le stockage','Tes fichiers partout, tout le temps.','Google Drive, Dropbox... Le cloud transforme la façon dont nous travaillons et créons.',100,12),
      makeAdventure('web-projects','Crée ton premier site','Mets en pratique tout ce que tu as appris.','Passons de la théorie à la pratique ! Crée ta première page web complète.',150,12),
      makeAdventure('digital-africa','Le numérique en Afrique','Comment l\'Afrique transforme le monde digital.','Du mobile money aux startups tech, l\'Afrique est en tête de l\'innovation numérique.',120,12),
      makeAdventure('future-web','Le web de demain','Web3, métavers, et au-delà.','Que réserve l\'avenir du web ? Explore les tendances qui vont changer notre façon de vivre en ligne.',130,12),
    ]
  },
  {
    id: 'artificial-intelligence', slug: 'artificial-intelligence', name: 'Intelligence Artificielle', icon: '🤖',
    description: "Découvre l'IA, comment elle fonctionne, et comment l'utiliser de manière éthique. 12 aventures pour maîtriser l'intelligence artificielle.",
    color: '#8B5CF6', gradient: 'from-violet-500 to-purple-400', phase: 'explorer',
    adventures: [
      makeAdventure('ia-decouverte','Premiers pas avec l\'IA',"Qu'est-ce que l'intelligence artificielle ?","Awa adore dessiner. Un jour, elle demande à une IA de l'aider à créer une image.",100,12),
      makeAdventure('prompting-mastery','Art du Prompting','Maîtrise l\'art de dialoguer avec les IA génératives.','Koffi veut utiliser une IA pour l\'aider à comprendre un concept complexe.',130,12),
      makeAdventure('ai-ethics','IA et éthique','Utiliser l\'IA de manière responsable.','L\'intelligence artificielle soulève des questions importantes : bias, vie privée, emploi.',120,12),
      makeAdventure('machine-learning','Machine Learning expliqué','Comment les machines apprennent toutes seules.','Le machine learning permet aux ordinateurs d\'apprendre à partir de données, sans être programmés explicitement.',140,12),
      makeAdventure('ai-africa','IA en Afrique','Les innovations africaines en intelligence artificielle.','Des startups africaines utilisent l\'IA pour résoudre des problèmes locaux : agriculture, santé, éducation.',110,12),
      makeAdventure('chatbots','Crée ton propre chatbot','Construis un assistant intelligent.','Apprends les bases de la création de chatbots avec des outils accessibles à tous.',150,12),
      makeAdventure('image-gen','Génération d\'images par IA','Crée des visuels impressionnants avec l\'IA.','DALL-E, Midjourney, Stable Diffusion... L\'IA générative révolutionne la création visuelle.',130,12),
      makeAdventure('ai-code','IA et programmation','Comment l\'IA aide les développeurs.','GitHub Copilot, ChatGPT... L\'IA devient un alliée powerful pour coder plus vite et mieux.',140,12),
      makeAdventure('data-science','Introduction à la data science','Les données sont le nouveau pétrole.','La data science combine statistiques, programmation et domaine métier pour extraire des insights.',130,12),
      makeAdventure('ai-tools','Outils IA gratuits','Les meilleures outils IA gratuits disponibles.','Teste ChatGPT, Gemini, Claude, et bien d\'autres outils IA gratuitement.',110,12),
      makeAdventure('future-ai','Le futur de l\'IA','Vers une intelligence générale ?',\"Quelles seront les prochaines avancées de l'IA ? Et comment vont-elles affecter notre quotidien ?\",120,12),
      makeAdventure('ai-project','Projet IA final','Réalise ton premier projet d\'intelligence artificielle.','Récapitule tout ce que tu as appris en créant un projet IA complet de A à Z.',150,12),
    ]
  },
  {
    id: 'coding', slug: 'coding', name: 'Coding', icon: '💻',
    description: 'Apprends les bases de la programmation et crée tes premiers programmes. 12 aventures pour devenir un codeur confirmé.',
    color: '#10B981', gradient: 'from-emerald-500 to-teal-400', phase: 'creator',
    adventures: [
      makeAdventure('algo-logique','Algorithmes et Logique','La programmation commence par la logique.','Sami veut créer un jeu vidéo. Mais avant de coder, il doit apprendre à penser comme un programmeur.',100,12),
      makeAdventure('html-css-firsts','Premiers pas en HTML/CSS','Crée ta première page web structurée et stylée.','Nadia veut créer son propre site web. Elle a entendu parler de HTML et CSS.',130,12),
      makeAdventure('python-basics','Introduction à Python','Le langage le plus populaire pour débuter en programmation.','Yann a entendu dire que Python est le langage des IA.',150,12),
      makeAdventure('js-basics','JavaScript : le langage du web','Rends tes pages web interactives.','JavaScript donne vie aux pages web. C\'est le langage qui fait bouger, cliquer, et réagir.',140,12),
      makeAdventure('git-basics','Git et le contrôle de version','Sauvegarde et partage ton code comme un pro.','Git est l\'outil indispensable de tout développeur. Apprends à versionner tes projets.',120,12),
      makeAdventure('react-intro','Introduction à React','Crée des interfaces modernes avec React.','React est la bibliothèque la plus populaire pour créer des interfaces utilisateur dynamiques.',150,12),
      makeAdventure('python-projects','Projets Python concrets','Construis des programmes utiles en Python.','Automatisation, traitement de données, jeux... Python est incroyablement polyvalent.',160,12),
      makeAdventure('web-design','Design web et UX','Crée des sites beaux et faciles à utiliser.','Un bon code ne suffit pas. Apprends les principes du design web et de l\'expérience utilisateur.',130,12),
      makeAdventure('api-basics','Les APIs expliquées','Comment les applications communiquent entre elles.','Les APIs sont les intermédiaires invisibles qui font fonctionner le web moderne.',120,12),
      makeAdventure('database-basics','Les bases de données','Stocke et organise tes données efficacement.','SQL et NoSQL... Comprends comment les applications stockent et récupèrent les informations.',140,12),
      makeAdventure('coding-africa','Le coding en Afrique','Les developers africains qui changent le monde.','Des startups comme Andela, Flutterwave, et Paystack montrent que l\'Afrique produit des talents tech exceptionnels.',110,12),
      makeAdventure('final-project','Projet de programmation final','Construis ton application complète.','Récapitule tout ton apprentissage en créant une application web complète de A à Z.',200,12),
    ]
  },
  {
    id: 'blockchain', slug: 'blockchain', name: 'Blockchain & Web3', icon: '⛓️',
    description: 'Comprends la blockchain sans spéculation. Technologie éducative. 12 aventures pour maîtriser le Web3.',
    color: '#F59E0B', gradient: 'from-amber-500 to-orange-400', phase: 'builder',
    adventures: [
      makeAdventure('blockchain-simple','La blockchain expliquée simplement','Une technologie qui change la façon dont on fait confiance.','Sami et Koffi veulent comprendre cette histoire de blockchain.',120,12),
      makeAdventure('crypto-basics','Crypto-monnaies : les bases','Bitcoin, Ethereum et au-delà.','Les crypto-monnaies ne sont pas que des spéculations. Elles représentent une nouvelle façon de penser l\'argent.',130,12),
      makeAdventure('nft-explained','Les NFTs expliqués','L\'art numérique et la propriété digitale.','Les NFTs permettent de prouver la propriété d\'un objet numérique. Une révolution pour les créateurs africains.',120,12),
      makeAdventure('defi-intro','DeFi : finance décentralisée','La finance du futur, accessible à tous.','La DeFi permet d\'emprunter, prêter et investir sans banque. Une opportunity immense pour l\'Afrique.',140,12),
      makeAdventure('smart-contracts','Smart Contracts','Des contrats qui s\'exécutent seuls.','Un smart contract est un programme qui s\'exécute automatiquement quand les conditions sont remplies.',130,12),
      makeAdventure('web3-games','Web3 Gaming','Les jeux blockchain et le play-to-earn.','Le gaming blockchain permet aux joueurs de posséder vraiment leurs objets virtuels.',120,12),
      makeAdventure('african-blockchain','Blockchain en Afrique','Les use cases africains de la blockchain.','Du paiement transfrontalier au traçage agricole, l\'Afrique explore la blockchain de manière innovante.',110,12),
      makeAdventure('wallet-security','Sécurité des wallets','Protège tes actifs numériques.','Apprends à créer et sécuriser ton wallet crypto. La sécurité est la priorité numéro un.',140,12),
      makeAdventure('dao-intro','Les DAO','Governance décentralisée et collaborative.','Une DAO est une organisation sans chef, où les membres votent ensemble. Le futur de la gouvernance ?',130,12),
      makeAdventure('tokenomics','Tokenomics','Comprendre l\'économie des tokens.','Un token n\'est pas qu\'un jeton. Il a une utilité, une valeur, et une économie derrière.',120,12),
      makeAdventure('layer2','Layer 2 Solutions','Rendre la blockchain plus rapide et moins chère.','Ethereum Layer 2 comme Arbitrum et Optimism résolvent les problèmes de vitesse et de coût.',130,12),
      makeAdventure('web3-project','Projet Web3 final','Construire ton première dApp.','Récapitule tout ton apprentissage en créant une application décentralisée simple.',150,12),
    ]
  },
  {
    id: 'digital-creator', slug: 'digital-creator', name: 'Digital Creator', icon: '🎨',
    description: 'Design, vidéo, audio, storytelling — deviens créateur de contenu. 12 aventures pour exprimer ta créativité.',
    color: '#EC4899', gradient: 'from-pink-500 to-rose-400', phase: 'creator',
    adventures: [
      makeAdventure('design-basics','Bases du Design','Les principes fondamentaux du design visuel.','Nadia veut créer des visuels impactants mais ne sait pas par où commencer.',110,12),
      makeAdventure('color-theory','Théorie des couleurs','Crée des palettes harmonieuses.','Comprendre les couleurs est essentiel pour tout créateur. Apprends à les combiner avec style.',120,12),
      makeAdventure('typography','Typographie','Le pouvoir des lettres et des polices.','La typographie influence comment on lit et ressent un message. Maîtrise l\'art des polices.',110,12),
      makeAdventure('photo-basics','Photographie digitale','Capture des moments parfaits.','Avec un smartphone, tu peux créer des photos remarquables. Apprends les bases de la composition.',100,12),
      makeAdventure('video-editing','Montage vidéo','Crée des vidéos captivantes.','Le montage vidéo est un super-pouvoir. Transforme tes rushes en histoires captivantes.',140,12),
      makeAdventure('motion-design','Motion Design','Donne vie à tes créations avec le mouvement.','Les animations captivent l\'attention. Apprends les bases du motion design.',130,12),
      makeAdventure('audio-basics','Production audio','Enregistre et mixe comme un pro.','Le son est 50% de l\'expérience vidéo. Apprends à enregistrer et nettoyer ton audio.',120,12),
      makeAdventure('storytelling','Storytelling digital','Raconte des histoires qui marquent.','Un bon récit peut changer le monde. Apprends l\'art du storytelling numérique.',130,12),
      makeAdventure('social-content','Création de contenu réseaux sociaux','Devient influent de manière positive.','YouTube, TikTok, Instagram... Apprends à créer du contenu qui engage et inspire.',110,12),
      makeAdventure('branding','Branding personnel','Construis ton identité visuelle.','Ton brand c\'est toi. Apprends à créer une identité cohérente et mémorable.',120,12),
      makeAdventure('african-creators','Créateurs africains','Inspirons-nous des talents du continent.','Des créateurs africains dominent YouTube, TikTok et Instagram. Découvrez leurs secrets.',100,12),
      makeAdventure('creator-project','Projet créateur final','Crée ta première campagne complète.','De la conception à la publication, réalise une campagne créative complète de A à Z.',150,12),
    ]
  },
  {
    id: 'cyber-hero', slug: 'cyber-hero', name: 'Cyber Hero', icon: '🔐',
    description: 'Deviens un héros du cyberespace : protège tes données et celles des autres. 12 aventures pour la cybersécurité.',
    color: '#EF4444', gradient: 'from-red-500 to-rose-400', phase: 'explorer',
    adventures: [
      makeAdventure('cyber-securite-basics','Deviens un Cyber Hero','Les bases de la cybersécurité pour les jeunes.','Yann a reçu un message sospe. Est-ce un hameçonnage ?',100,12),
      makeAdventure('password-security','Mots de passe solides','Protège tes comptes comme un pro.','Un mot de passe faible est la porte ouverte aux pirates. Apprends à créer des passwords infranchissables.',110,12),
      makeAdventure('phishing','Identifie le phishing','Ne te fais jamais avoir.','Le phishing est l\'attaque la plus courante. Apprends à reconnaître les pièges avant qu\'il ne soit trop tard.',120,12),
      makeAdventure('social-engineering','Ingénierie sociale','Comprendre comment on nous manipule.','Les pirates ne hackent pas toujours les machines — parfois ils hackent les humains.',110,12),
      makeAdventure('privacy-online','Confidentialité en ligne','Protège tes données personnelles.','Chaque fois que tu te connectes, tu laisses des traces. Apprends à les minimiser.',120,12),
      makeAdventure('safe-browsing','Navigation sécurisée','Navigue sur le web en toute sécurité.','HTTPS, VPN, ad blockers... Les outils pour naviguer sans danger.',100,12),
      makeAdventure('mobile-security','Sécurité mobile','Protège ton smartphone.','Ton téléphone contient toutes tes informations. Apprends à le sécuriser efficacement.',110,12),
      makeAdventure('public-wifi','Wi-Fi public sécurisé','Utilise le Wi-Fi public sans risque.','Le Wi-Fi des cafés et aéroports est dangereux. Voici comment t\'en protéger.',100,12),
      makeAdventure('family-security','Sécurité familiale','Protège toute ta famille en ligne.','Enseigne à tes proches les bonnes pratiques de sécurité. Protégez ensemble.',120,12),
      makeAdventure('african-cyber','Cybersécurité en Afrique','Le paysage africain de la sécurité numérique.','L\'Afrique fait face à des défis uniques en cybersécurité. Découvre comment le continent répond.',110,12),
      makeAdventure('bug-bounty','Bug Bounty pour débutants','Trouve des failles et gagne des récompenses.','Les bug bounties permettent aux hackers éthiques de gagner de l\'argent en signalant des vulnérabilités.',130,12),
      makeAdventure('cyber-final','Mission finale Cyber Hero','Prouve que tu es un vrai héros du cyber.','Teste toutes tes compétences dans un scenario complet de cybersécurité.',150,12),
    ]
  },
  {
    id: 'innovation-entrepreneurship', slug: 'innovation-entrepreneurship', name: 'Innovation & Entrepreneuriat', icon: '🚀',
    description: 'Identifie des problèmes, crée des solutions, construis ton avenir. 12 aventures pour devenir entrepreneur.',
    color: '#06B6D4', gradient: 'from-cyan-500 to-blue-400', phase: 'builder',
    adventures: [
      makeAdventure('design-thinking','Design Thinking','La méthode pour résoudre les problèmes avec créativité.','Nadia voit un problème dans son quartier : les déchets.',150,12),
      makeAdventure('problem-solving','Problem Solving','Devenir un résolveur de problèmes','Chaque problème est une opportunité déguisée. Apprends la méthode pour identifier et résoudre n\'importe quel problème.',130,12),
      makeAdventure('lean-startup','Lean Startup','Construis ton entreprise sans gaspiller','Le Lean Startup t\'apprend à tester tes idées rapidement et à faible coût avant de tout miser.',140,12),
      makeAdventure('business-model','Business Model Canvas','Conçois ton modèle économique','Un business model canvas est une page qui résume comment ton entreprise crée, délivre et capture de la valeur.',130,12),
      makeAdventure('pitching','Art du Pitch','Convaincre en 2 minutes','Un bon pitch peut changer ta vie. Apprends à présenter ton idée de manière convaincante.',120,12),
      makeAdventure('fintech-africa','Fintech en Afrique','Les innovations financières africaines','M-Pesa, Flutterwave, Paystack... L\'Afrique est le leader mondial de l\'innovation financière mobile.',140,12),
      makeAdventure('agritech','AgriTech','La technologie au service de l\'agriculture','L\'AgriTech utilise la tech pour augmenter la productivité agricole en Afrique. Des drones aux apps de prediction.',130,12),
      makeAdventure('edtech','EdTech','L\'éducation par la technologie','Du Nigeria au Kenya, les startups EdTech révolutionnent l\'accès à l\'éducation sur le continent.',120,12),
      makeAdventure('social-impact','Impact Social','Entreprendre pour changer le monde','Le plus grand entrepreneur est celui qui résout les problèmes de sa communauté. L\'impact social est ta force.',130,12),
      makeAdventure('digital-marketing','Marketing digital','Faire connaître ton projet en ligne','YouTube, Instagram, TikTok... Les réseaux sociaux sont ton meilleur outil de marketing gratuit.',110,12),
      makeAdventure('african-startups','Startups africaines à succès','Inspire-toi des réussites du continent','Andela, Jambo Health, Kobo360... Découvre les parcours de ceux qui ont réussi.',120,12),
      makeAdventure('startup-project','Projet startup final','Lance ton propre projet entrepreneurial','De l\'idée au prototype, construis ton premier projet entrepreneurial en appliquant tout ce que tu as appris.',150,12),
    ]
  },
];
