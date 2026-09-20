// Daily Challenges Data
export interface DailyChallenge {
  id: string;
  slug: string;
  title: string;
  description: string;
  world_slug: string | null;
  xp_reward: number;
  badge_slug: string | null;
  date: string;
  active: boolean;
}

export const DAILY_CHALLENGES: DailyChallenge[] = [
  { id: 'd1', slug: 'find-fake-news', title: 'Chasseur de fake news', description: 'Trouve une information suspecte sur Internet et explique pourquoi tu la trouves douteuse.', world_slug: 'web-digital', xp_reward: 50, badge_slug: 'daily-challenger', date: '2026-09-20', active: true },
  { id: 'd2', slug: 'write-prompt', title: 'Maître du prompt', description: 'Écris un prompt créatif pour générer une image d\'un héros africain futuriste.', world_slug: 'artificial-intelligence', xp_reward: 50, badge_slug: 'daily-challenger', date: '2026-09-20', active: true },
  { id: 'd3', slug: 'draw-algo', title: 'Algorithme dessin', description: 'Dessine un algorithme simple (ex: comment faire un verre d\'eau) en 5 étapes.', world_slug: 'coding', xp_reward: 50, badge_slug: 'daily-challenger', date: '2026-09-20', active: true },
  { id: 'd4', slug: 'spot-phishing', title: 'Détective phishing', description: 'Trouve un exemple de phishing (hameçonnage) et explique comment le reconnaître.', world_slug: 'cyber-hero', xp_reward: 50, badge_slug: 'daily-challenger', date: '2026-09-20', active: true },
  { id: 'd5', slug: 'app-idea', title: 'Ide d\'application', description: 'Imagine une application qui résoudrait un problème dans ton quartier. Décris-la en 3 phrases.', world_slug: 'innovation-entrepreneurship', xp_reward: 50, badge_slug: 'daily-challenger', date: '2026-09-20', active: true },
  { id: 'd6', slug: 'explain-blockchain', title: 'Explique la blockchain', description: 'Explique la blockchain à un ami de 10 ans en utilisant une analogie avec des Lego.', world_slug: 'blockchain', xp_reward: 50, badge_slug: 'daily-challenger', date: '2026-09-20', active: true },
  { id: 'd7', slug: 'design-poster', title: 'Poster digital', description: 'Crée (même sur papier) un poster pour sensibiliser à la sécurité en ligne.', world_slug: 'digital-creator', xp_reward: 50, badge_slug: 'daily-challenger', date: '2026-09-20', active: true },
];

// Skill Tree Data
export interface SkillNode {
  id: string;
  name: string;
  icon: string;
  world: string;
  levels: ('discover' | 'practice' | 'apply' | 'master')[];
  prerequisites?: string[];
}

export const SKILL_TREE: Record<string, SkillNode[]> = {
  'web-digital': [
    { id: 's1', name: 'Internet', icon: '🌐', world: 'web-digital', levels: ['discover', 'practice', 'apply', 'master'] },
    { id: 's2', name: 'Recherche', icon: '🔍', world: 'web-digital', levels: ['discover', 'practice', 'apply', 'master'], prerequisites: ['s1'] },
    { id: 's3', name: 'HTML/CSS', icon: '📝', world: 'web-digital', levels: ['discover', 'practice', 'apply', 'master'], prerequisites: ['s1'] },
    { id: 's4', name: 'UX Design', icon: '🎨', world: 'web-digital', levels: ['discover', 'practice', 'apply', 'master'], prerequisites: ['s3'] },
    { id: 's5', name: 'Cybersécurité Web', icon: '🔐', world: 'web-digital', levels: ['discover', 'practice', 'apply', 'master'], prerequisites: ['s2'] },
  ],
  'artificial-intelligence': [
    { id: 's1', name: 'Introduction IA', icon: '🤖', world: 'artificial-intelligence', levels: ['discover', 'practice', 'apply', 'master'] },
    { id: 's2', name: 'Prompting', icon: '💬', world: 'artificial-intelligence', levels: ['discover', 'practice', 'apply', 'master'], prerequisites: ['s1'] },
    { id: 's3', name: 'Éthique IA', icon: '⚖️', world: 'artificial-intelligence', levels: ['discover', 'practice', 'apply', 'master'], prerequisites: ['s1'] },
    { id: 's4', name: 'ML Basics', icon: '📊', world: 'artificial-intelligence', levels: ['discover', 'practice', 'apply', 'master'], prerequisites: ['s2'] },
    { id: 's5', name: 'IA Créative', icon: '✨', world: 'artificial-intelligence', levels: ['discover', 'practice', 'apply', 'master'], prerequisites: ['s2'] },
  ],
  'coding': [
    { id: 's1', name: 'Logique', icon: '🧠', world: 'coding', levels: ['discover', 'practice', 'apply', 'master'] },
    { id: 's2', name: 'HTML/CSS', icon: '📝', world: 'coding', levels: ['discover', 'practice', 'apply', 'master'], prerequisites: ['s1'] },
    { id: 's3', name: 'JavaScript', icon: '⚡', world: 'coding', levels: ['discover', 'practice', 'apply', 'master'], prerequisites: ['s2'] },
    { id: 's4', name: 'Python', icon: '🐍', world: 'coding', levels: ['discover', 'practice', 'apply', 'master'], prerequisites: ['s2'] },
    { id: 's5', name: 'Git', icon: '📦', world: 'coding', levels: ['discover', 'practice', 'apply', 'master'], prerequisites: ['s3'] },
    { id: 's6', name: 'Projet Final', icon: '🚀', world: 'coding', levels: ['discover', 'practice', 'apply', 'master'], prerequisites: ['s4', 's5'] },
  ],
  'blockchain': [
    { id: 's1', name: 'Blockchain', icon: '⛓️', world: 'blockchain', levels: ['discover', 'practice', 'apply', 'master'] },
    { id: 's2', name: 'Crypto', icon: '🪙', world: 'blockchain', levels: ['discover', 'practice', 'apply', 'master'], prerequisites: ['s1'] },
    { id: 's3', name: 'Smart Contracts', icon: '📜', world: 'blockchain', levels: ['discover', 'practice', 'apply', 'master'], prerequisites: ['s2'] },
    { id: 's4', name: 'Web3', icon: '🌐', world: 'blockchain', levels: ['discover', 'practice', 'apply', 'master'], prerequisites: ['s3'] },
  ],
  'digital-creator': [
    { id: 's1', name: 'Design', icon: '🎨', world: 'digital-creator', levels: ['discover', 'practice', 'apply', 'master'] },
    { id: 's2', name: 'Photo', icon: '📷', world: 'digital-creator', levels: ['discover', 'practice', 'apply', 'master'], prerequisites: ['s1'] },
    { id: 's3', name: 'Vidéo', icon: '🎬', world: 'digital-creator', levels: ['discover', 'practice', 'apply', 'master'], prerequisites: ['s1'] },
    { id: 's4', name: 'Audio', icon: '🎵', world: 'digital-creator', levels: ['discover', 'practice', 'apply', 'master'], prerequisites: ['s1'] },
    { id: 's5', name: 'Branding', icon: '⭐', world: 'digital-creator', levels: ['discover', 'practice', 'apply', 'master'], prerequisites: ['s2', 's3'] },
  ],
  'cyber-hero': [
    { id: 's1', name: 'Bases Cyber', icon: '🔐', world: 'cyber-hero', levels: ['discover', 'practice', 'apply', 'master'] },
    { id: 's2', name: 'Mots de passe', icon: '🔑', world: 'cyber-hero', levels: ['discover', 'practice', 'apply', 'master'], prerequisites: ['s1'] },
    { id: 's3', name: 'Phishing', icon: '🎣', world: 'cyber-hero', levels: ['discover', 'practice', 'apply', 'master'], prerequisites: ['s1'] },
    { id: 's4', name: 'Navigation sûre', icon: '🛡️', world: 'cyber-hero', levels: ['discover', 'practice', 'apply', 'master'], prerequisites: ['s2'] },
    { id: 's5', name: 'Vie privée', icon: '👁️', world: 'cyber-hero', levels: ['discover', 'practice', 'apply', 'master'], prerequisites: ['s2'] },
  ],
  'innovation-entrepreneurship': [
    { id: 's1', name: 'Design Thinking', icon: '💡', world: 'innovation-entrepreneurship', levels: ['discover', 'practice', 'apply', 'master'] },
    { id: 's2', name: 'Problem Solving', icon: '🧩', world: 'innovation-entrepreneurship', levels: ['discover', 'practice', 'apply', 'master'], prerequisites: ['s1'] },
    { id: 's3', name: 'Lean Startup', icon: '🚀', world: 'innovation-entrepreneurship', levels: ['discover', 'practice', 'apply', 'master'], prerequisites: ['s2'] },
    { id: 's4', name: 'Pitching', icon: '🎤', world: 'innovation-entrepreneurship', levels: ['discover', 'practice', 'apply', 'master'], prerequisites: ['s3'] },
    { id: 's5', name: 'Fintech Africa', icon: '💰', world: 'innovation-entrepreneurship', levels: ['discover', 'practice', 'apply', 'master'], prerequisites: ['s3'] },
  ],
};

// Weekly Quests
export interface WeeklyQuest {
  id: string;
  title: string;
  description: string;
  xp_reward: number;
  badge_slug: string | null;
  deadline: string;
  world_slug: string | null;
}

export const WEEKLY_QUESTS: WeeklyQuest[] = [
  { id: 'w1', title: 'Explorer le Web', description: 'Termine 3 aventures dans le monde Web & Digital cette semaine.', xp_reward: 200, badge_slug: 'web-explorer', deadline: '2026-09-27', world_slug: 'web-digital' },
  { id: 'w2', title: 'Devenir Codesmith', description: 'Termine 2 aventures Coding et complète le quiz final.', xp_reward: 200, badge_slug: 'code-master', deadline: '2026-09-27', world_slug: 'coding' },
  { id: 'w3', title: 'Master de l\'IA', description: 'Explore le monde IA et crée ton premier prompt créatif.', xp_reward: 200, badge_slug: 'ai-master', deadline: '2026-09-27', world_slug: 'artificial-intelligence' },
  { id: 'w4', title: 'Cyber Sentinel', description: 'Termine toutes les aventures Cyber Hero et passe le quiz final.', xp_reward: 250, badge_slug: 'cyber-master', deadline: '2026-09-27', world_slug: 'cyber-hero' },
  { id: 'w5', title: 'Créateur Digital', description: 'Produis 3 créations dans le monde Digital Creator.', xp_reward: 200, badge_slug: 'creator-master', deadline: '2026-09-27', world_slug: 'digital-creator' },
];
