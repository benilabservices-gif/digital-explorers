# Contrat contenu pédagogique — `content/<monde>.json`

Ce document **fige** le format des fichiers de contenu Digital Explorers.
Chaque monde est livré dans un fichier JSON unique : `content/web-digital.json`,
`content/artificial-intelligence.json`, `content/coding.json`,
`content/blockchain.json`, `content/digital-creator.json`, `content/cyber-hero.json`,
`content/innovation-entrepreneurship.json`.

Un fichier est accepté ** uniquement** s'il passe :
`node scripts/validate-content.mjs content/<monde>.json`
Le validateur est la source de vérité : en cas de doute, c'est lui qui fait foi.

## Format JSON

```json
{
  "world": "web-digital",
  "adventures": [
    {
      "slug": "internet-discover",
      "title": "L'aventure d'Internet",
      "description": "Partez à la découverte du plus grand réseau du monde et comprenez comment il relie des milliards de personnes, de Cocody à Tokyo.",
      "story": "Awa regarde une vidéo sur son téléphone à Abidjan. En une seconde, des images voyagent depuis un serveur à des milliers de kilomètres. Comment est-ce possible ? Plonge dans les coulisses d'Internet et découvre la magie invisible qui connecte le monde entier.",
      "xp_reward": 100,
      "lessons": [
        { "section_type": "discover", "title": "Qu'est-ce qu'Internet ?", "content": "…texte de la leçon (200 à 4000 caractères)…" },
        { "section_type": "play", "title": "…", "content": "…" },
        { "section_type": "experiment", "title": "…", "content": "…" },
        { "section_type": "build", "title": "…", "content": "…" },
        { "section_type": "mission", "title": "…", "content": "…" },
        { "section_type": "project", "title": "…", "content": "…" }
      ],
      "quiz": [
        {
          "question": "Qu'est-ce qu'Internet ?",
          "options": ["Un jeu vidéo", "Un réseau mondial d'ordinateurs connectés", "Un téléphone portable", "Un site web"],
          "correct_index": 1,
          "explanation": "Internet est un réseau qui relie des milliards d'appareils à travers le monde."
        }
      ]
    }
  ]
}
```

(L'exemple est raccourci : chaque aventure réelle contient **12 aventures**, **6 leçons complètes** et **3 à 5 questions**.)

## Règles par champ

| Champ | Règle |
|---|---|
| `world` | Slug exact du monde, identique au nom de fichier (sans `.json`) |
| `adventures` | Tableau d'exactement **12** aventures, slugs imposés (tableaux ci-dessous) |
| `slug` | Un des 12 slugs imposés du monde — aucun inventé, aucun manquant |
| `title` | **Titre exact** imposé (voir tableaux) — copier-coller à l'identique |
| `description` | 20 à 300 caractères — résumé affiché sur la carte de l'aventure |
| `story` | 80 à 2000 caractères — accroche narrative à la 2ᵉ personne (« Tu vas… ») |
| `xp_reward` | Entier **exact** imposé (voir tableaux) |
| `lessons` | Exactement **6** sections, dans cet ordre imposé |
| `lessons[i].section_type` | Séquence imposée : `discover`, `play`, `experiment`, `build`, `mission`, `project` |
| `lessons[i].title` | 3 à 120 caractères |
| `lessons[i].content` | 200 à 4000 caractères de contenu pédagogique réel |
| `quiz` | 3 à 5 questions |
| `quiz[i].question` | 15 à 300 caractères |
| `quiz[i].options` | 3 à 5 chaînes de 1 à 200 caractères, sans doublons |
| `quiz[i].correct_index` | Entier, index (0-based) de la bonne option |
| `quiz[i].explanation` | 30 à 2000 caractères — pourquoi c'est la bonne réponse |

Aucune autre clé n'est autorisée (ni au premier niveau, ni dans les aventures,
leçons ou questions).

## Les 6 sections — intention pédagogique

1. `discover` — **Découvre** : les concepts clés expliqués simplement, avec des exemples concrets du quotidien.
2. `play` — **Joue** : une activité ludique (mini-défi, jeu d'observation, quiz express…).
3. `experiment` — **Expérimente** : un essai concret guidé que l'explorateur réalise lui-même.
4. `build` — **Construis** : une création pas à pas, vérifiable à la fin.
5. `mission` — **Mission** : un défi concret, contextualisé (Afrique, quartier, école, famille).
6. `project` — **Projet** : un mini-projet final réutilisable qui prolonge l'aventure.

## Mise en forme du contenu

- L'interface affiche `content` en **texte brut** (les sauts de ligne sont conservés).
- **Pas de markdown** (`**gras**`, `# titres`, backticks) ni de HTML : écrire des phrases normales.
- Paragraphes séparés par une ligne vide ; listes simples avec `1.`, `2.` ou `- `.
- Emojis autorisés avec modération ; exemples de code courts en texte brut acceptés.

## Ton et qualité

- Public : **12-18 ans**, collégiens et lycéens d'Afrique francophone (Côte d'Ivoire en tête).
- Tutoiement, phrases courtes, vocabulaire simple, ton enthousiaste sans infantiliser.
- Ancrer les exemples dans le quotidien africain : Abidjan, mobile money, WhatsApp, marchés, école, startups locales…
- Contenu original, factuel et adapté à l'âge. Aucune donnée personnelle réelle.
- Chaque aventure doit être **autoporteuse** : un explorateur qui commence par celle-ci doit tout comprendre.

### Consignes par monde

- **web-digital** — navigateurs, moteurs de recherche, réseaux sociaux, citoyenneté numérique ; exemples d'usages africains du web.
- **artificial-intelligence** — outils IA gratuits, prompting, biais et éthique ; cas d'usage africains (agriculture, santé, éducation).
- **coding** — HTML/CSS, Python, JavaScript, Git ; outils 100 % gratuits, premier code guidé.
- **blockchain** — pédagogie technique uniquement : **aucun conseil d'investissement, aucune promesse de gain** ; prudence et sécurité avant tout.
- **digital-creator** — création avec un smartphone, outils gratuits (Canva, CapCut…) ; storytelling et branding personnel.
- **cyber-hero** — scénarios réalistes (SMS frauduleux, arnaques WhatsApp, Wi-Fi public) ; bonnes pratiques pour toute la famille.
- **innovation-entrepreneurship** — accent **fintech / agritech / edtech africaines**, exemples de startups du continent (M-Pesa, Flutterwave, Wave…).

## Slugs, titres et XP imposés

### web-digital

| slug | titre exact | XP |
|---|---|---|
| internet-discover | L'aventure d'Internet | 100 |
| search-master | Maître de la Recherche | 120 |
| web-history | Histoire du Web | 110 |
| html-basics | HTML : les fondations | 130 |
| css-style | CSS : donner vie au Web | 130 |
| social-media | Réseaux sociaux | 110 |
| digital-citizenship | Citoyenneté numérique | 100 |
| email-mastery | Maîtrise l'email | 110 |
| cloud-storage | Le cloud et le stockage | 100 |
| web-projects | Crée ton premier site | 150 |
| digital-africa | Le numérique en Afrique | 120 |
| future-web | Le web de demain | 130 |

### artificial-intelligence

| slug | titre exact | XP |
|---|---|---|
| ia-decouverte | Premiers pas avec l'IA | 100 |
| prompting-mastery | Art du Prompting | 130 |
| ai-ethics | IA et éthique | 120 |
| machine-learning | Machine Learning expliqué | 140 |
| ai-africa | IA en Afrique | 110 |
| chatbots | Crée ton propre chatbot | 150 |
| image-gen | Génération d'images par IA | 130 |
| ai-code | IA et programmation | 140 |
| data-science | Introduction à la data science | 130 |
| ai-tools | Outils IA gratuits | 110 |
| future-ai | Le futur de l'IA | 120 |
| ai-project | Projet IA final | 150 |

### coding

| slug | titre exact | XP |
|---|---|---|
| algo-logique | Algorithmes et Logique | 100 |
| html-css-firsts | Premiers pas en HTML/CSS | 130 |
| python-basics | Introduction à Python | 150 |
| js-basics | JavaScript : le langage du web | 140 |
| git-basics | Git et le contrôle de version | 120 |
| react-intro | Introduction à React | 150 |
| python-projects | Projets Python concrets | 160 |
| web-design | Design web et UX | 130 |
| api-basics | Les APIs expliquées | 120 |
| database-basics | Les bases de données | 140 |
| coding-africa | Le coding en Afrique | 110 |
| final-project | Projet de programmation final | 200 |

### blockchain

| slug | titre exact | XP |
|---|---|---|
| blockchain-simple | La blockchain expliquée simplement | 120 |
| crypto-basics | Crypto-monnaies : les bases | 130 |
| nft-explained | Les NFTs expliqués | 120 |
| defi-intro | DeFi : finance décentralisée | 140 |
| smart-contracts | Smart Contracts | 130 |
| web3-games | Web3 Gaming | 120 |
| african-blockchain | Blockchain en Afrique | 110 |
| wallet-security | Sécurité des wallets | 140 |
| dao-intro | Les DAO | 130 |
| tokenomics | Tokenomics | 120 |
| layer2 | Layer 2 Solutions | 130 |
| web3-project | Projet Web3 final | 150 |

### digital-creator

| slug | titre exact | XP |
|---|---|---|
| design-basics | Bases du Design | 110 |
| color-theory | Théorie des couleurs | 120 |
| typography | Typographie | 110 |
| photo-basics | Photographie digitale | 100 |
| video-editing | Montage vidéo | 140 |
| motion-design | Motion Design | 130 |
| audio-basics | Production audio | 120 |
| storytelling | Storytelling digital | 130 |
| social-content | Création de contenu réseaux sociaux | 110 |
| branding | Branding personnel | 120 |
| african-creators | Créateurs africains | 100 |
| creator-project | Projet créateur final | 150 |

### cyber-hero

| slug | titre exact | XP |
|---|---|---|
| cyber-securite-basics | Deviens un Cyber Hero | 100 |
| password-security | Mots de passe solides | 110 |
| phishing | Identifie le phishing | 120 |
| social-engineering | Ingénierie sociale | 110 |
| privacy-online | Confidentialité en ligne | 120 |
| safe-browsing | Navigation sécurisée | 100 |
| mobile-security | Sécurité mobile | 110 |
| public-wifi | Wi-Fi public sécurisé | 100 |
| family-security | Sécurité familiale | 120 |
| african-cyber | Cybersécurité en Afrique | 110 |
| bug-bounty | Bug Bounty pour débutants | 130 |
| cyber-final | Mission finale Cyber Hero | 150 |

### innovation-entrepreneurship

| slug | titre exact | XP |
|---|---|---|
| design-thinking | Design Thinking | 150 |
| problem-solving | Problem Solving | 130 |
| lean-startup | Lean Startup | 140 |
| business-model | Business Model Canvas | 130 |
| pitching | Art du Pitch | 120 |
| fintech-africa | Fintech en Afrique | 140 |
| agritech | AgriTech | 130 |
| edtech | EdTech | 120 |
| social-impact | Impact Social | 130 |
| digital-marketing | Marketing digital | 110 |
| african-startups | Startups africaines à succès | 120 |
| startup-project | Projet startup final | 150 |

## Validation et import

```bash
# Valider (les agents font tourner cette commande avant de livrer)
node scripts/validate-content.mjs content/<monde>.json

# Importer en base (lead uniquement) — upsert idempotent via psql
node scripts/import-content.mjs content/<monde>.json

# Aperçu du SQL généré sans toucher la base
node scripts/import-content.mjs --dry-run content/<monde>.json
```
