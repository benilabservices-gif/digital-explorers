-- =====================================================================
-- Digital Explorers — seed (contenu initial, idempotent)
-- Exécuté par `supabase db reset`. Remplacé progressivement par le
-- contenu réel importé via scripts/import-content (Phase 3).
-- =====================================================================

-- ---------- Mondes ----------
insert into public.worlds (slug, name, icon, description, color, gradient, phase, sort_order) values
  ('web-digital', 'Web & Digital', '🌐', $$Découvre Internet, le Web, les réseaux sociaux et la culture numérique. 12 aventures pour maîtriser le monde digital.$$, '#3B82F6', 'from-blue-500 to-cyan-400', 'explorer', 1),
  ('artificial-intelligence', 'Intelligence Artificielle', '🤖', $$Découvre l'IA, comment elle fonctionne, et comment l'utiliser de manière éthique. 12 aventures pour maîtriser l'intelligence artificielle.$$, '#8B5CF6', 'from-violet-500 to-purple-400', 'explorer', 2),
  ('coding', 'Coding', '💻', $$Apprends les bases de la programmation et crée tes premiers programmes. 12 aventures pour devenir un codeur confirmé.$$, '#10B981', 'from-emerald-500 to-teal-400', 'creator', 3),
  ('blockchain', 'Blockchain & Web3', '⛓️', $$Comprends la blockchain sans spéculation. Technologie éducative. 12 aventures pour maîtriser le Web3.$$, '#F59E0B', 'from-amber-500 to-orange-400', 'builder', 4),
  ('digital-creator', 'Digital Creator', '🎨', $$Design, vidéo, audio, storytelling — deviens créateur de contenu. 12 aventures pour exprimer ta créativité.$$, '#EC4899', 'from-pink-500 to-rose-400', 'creator', 5),
  ('cyber-hero', 'Cyber Hero', '🔐', $$Deviens un héros du cyberespace : protège tes données et celles des autres. 12 aventures pour la cybersécurité.$$, '#EF4444', 'from-red-500 to-rose-400', 'explorer', 6),
  ('innovation-entrepreneurship', 'Innovation & Entrepreneuriat', '🚀', $$Identifie des problèmes, crée des solutions, construis ton avenir. 12 aventures pour devenir entrepreneur.$$, '#06B6D4', 'from-cyan-500 to-blue-400', 'builder', 7)
on conflict (slug) do update
  set name = excluded.name, icon = excluded.icon, description = excluded.description,
      color = excluded.color, gradient = excluded.gradient, phase = excluded.phase,
      sort_order = excluded.sort_order;

-- ---------- Aventures (stubs repris du front actuel) ----------
insert into public.adventures (world_id, slug, title, description, story, xp_reward, sort_order)
select w.id, v.slug, v.title, v.description, v.story, v.xp_reward, v.sort_order
from (values
  -- Web & Digital
  ('web-digital','internet-discover',$$L'aventure d'Internet$$,$$Comment le monde entier s'est connecté en un clic ?$$,$$Il était une fois, un réseau secret appelé ARPANET. Aujourd'hui, Internet connecte plus de 5 milliards de personnes !$$,100,1),
  ('web-digital','search-master',$$Maître de la Recherche$$,$$Apprends à trouver l'information fiable sur Internet.$$,$$Sur Internet, il y a autant d'informations vraies que fausses. Savoir chercher et vérifier est essentiel.$$,120,2),
  ('web-digital','web-history',$$Histoire du Web$$,$$De Tim Berners-Lee au Web 3.0.$$,$$Le World Wide Web a été inventé en 1989. Depuis, il a transformé notre monde.$$,110,3),
  ('web-digital','html-basics',$$HTML : les fondations$$,$$Construis la structure de toute page web.$$,$$HTML est le squelette du Web. Chaque site que tu visites est construit avec ces balises.$$,130,4),
  ('web-digital','css-style',$$CSS : donner vie au Web$$,$$Apprends à styliser tes pages web.$$,$$CSS est la peau et les vêtements du Web. Il rend chaque page unique et belle.$$,130,5),
  ('web-digital','social-media',$$Réseaux sociaux$$,$$Comprendre les plateformes qui connectent l'Afrique.$$,$$LinkedIn, Twitter, TikTok... Les réseaux sociaux sont des outils puissants pour apprendre et créer.$$,110,6),
  ('web-digital','digital-citizenship',$$Citoyenneté numérique$$,$$Être un bon citoyen dans le monde digital.$$,$$En ligne comme hors ligne, nos actions ont des conséquences. Apprends à naviguer responsablement.$$,100,7),
  ('web-digital','email-mastery',$$Maîtrise l'email$$,$$Communication professionnelle depuis ton bureau.$$,$$L'email reste l'outil professionnel n°1. Apprends à écrire des mails efficaces.$$,110,8),
  ('web-digital','cloud-storage',$$Le cloud et le stockage$$,$$Tes fichiers partout, tout le temps.$$,$$Google Drive, Dropbox... Le cloud transforme la façon dont nous travaillons et créons.$$,100,9),
  ('web-digital','web-projects',$$Crée ton premier site$$,$$Mets en pratique tout ce que tu as appris.$$,$$Passons de la théorie à la pratique ! Crée ta première page web complète.$$,150,10),
  ('web-digital','digital-africa',$$Le numérique en Afrique$$,$$Comment l'Afrique transforme le monde digital.$$,$$Du mobile money aux startups tech, l'Afrique est en tête de l'innovation numérique.$$,120,11),
  ('web-digital','future-web',$$Le web de demain$$,$$Web3, métavers, et au-delà.$$,$$Que réserve l'avenir du web ? Explore les tendances qui vont changer notre façon de vivre en ligne.$$,130,12),
  -- Intelligence Artificielle
  ('artificial-intelligence','ia-decouverte',$$Premiers pas avec l'IA$$,$$Qu'est-ce que l'intelligence artificielle ?$$,$$Awa adore dessiner. Un jour, elle demande à une IA de l'aider à créer une image.$$,100,1),
  ('artificial-intelligence','prompting-mastery',$$Art du Prompting$$,$$Maîtrise l'art de dialoguer avec les IA génératives.$$,$$Koffi veut utiliser une IA pour l'aider à comprendre un concept complexe.$$,130,2),
  ('artificial-intelligence','ai-ethics',$$IA et éthique$$,$$Utiliser l'IA de manière responsable.$$,$$L'intelligence artificielle soulève des questions importantes : biais, vie privée, emploi.$$,120,3),
  ('artificial-intelligence','machine-learning',$$Machine Learning expliqué$$,$$Comment les machines apprennent toutes seules.$$,$$Le machine learning permet aux ordinateurs d'apprendre à partir de données, sans être programmés explicitement.$$,140,4),
  ('artificial-intelligence','ai-africa',$$IA en Afrique$$,$$Les innovations africaines en intelligence artificielle.$$,$$Des startups africaines utilisent l'IA pour résoudre des problèmes locaux : agriculture, santé, éducation.$$,110,5),
  ('artificial-intelligence','chatbots',$$Crée ton propre chatbot$$,$$Construis un assistant intelligent.$$,$$Apprends les bases de la création de chatbots avec des outils accessibles à tous.$$,150,6),
  ('artificial-intelligence','image-gen',$$Génération d'images par IA$$,$$Crée des visuels impressionnants avec l'IA.$$,$$DALL-E, Midjourney, Stable Diffusion... L'IA générative révolutionne la création visuelle.$$,130,7),
  ('artificial-intelligence','ai-code',$$IA et programmation$$,$$Comment l'IA aide les développeurs.$$,$$GitHub Copilot, ChatGPT... L'IA devient un allié puissant pour coder plus vite et mieux.$$,140,8),
  ('artificial-intelligence','data-science',$$Introduction à la data science$$,$$Les données sont le nouveau pétrole.$$,$$La data science combine statistiques, programmation et domaine métier pour extraire des insights.$$,130,9),
  ('artificial-intelligence','ai-tools',$$Outils IA gratuits$$,$$Les meilleurs outils IA gratuits disponibles.$$,$$Teste ChatGPT, Gemini, Claude, et bien d'autres outils IA gratuitement.$$,110,10),
  ('artificial-intelligence','future-ai',$$Le futur de l'IA$$,$$Vers une intelligence générale ?$$,$$Quelles seront les prochaines avancées de l'IA et comment vont-elles transformer notre quotidien ?$$,120,11),
  ('artificial-intelligence','ai-project',$$Projet IA final$$,$$Réalise ton premier projet d'intelligence artificielle.$$,$$Récapitule tout ce que tu as appris en créant un projet IA complet de A à Z.$$,150,12),
  -- Coding
  ('coding','algo-logique',$$Algorithmes et Logique$$,$$La programmation commence par la logique.$$,$$Sami veut créer un jeu vidéo. Mais avant de coder, il doit apprendre à penser comme un programmeur.$$,100,1),
  ('coding','html-css-firsts',$$Premiers pas en HTML/CSS$$,$$Crée ta première page web structurée et stylée.$$,$$Nadia veut créer son propre site web. Elle a entendu parler de HTML et CSS.$$,130,2),
  ('coding','python-basics',$$Introduction à Python$$,$$Le langage le plus populaire pour débuter en programmation.$$,$$Yann a entendu dire que Python est le langage des IA.$$,150,3),
  ('coding','js-basics',$$JavaScript : le langage du web$$,$$Rends tes pages web interactives.$$,$$JavaScript donne vie aux pages web. C'est le langage qui fait bouger, cliquer, et réagir.$$,140,4),
  ('coding','git-basics',$$Git et le contrôle de version$$,$$Sauvegarde et partage ton code comme un pro.$$,$$Git est l'outil indispensable de tout développeur. Apprends à versionner tes projets.$$,120,5),
  ('coding','react-intro',$$Introduction à React$$,$$Crée des interfaces modernes avec React.$$,$$React est la bibliothèque la plus populaire pour créer des interfaces utilisateur dynamiques.$$,150,6),
  ('coding','python-projects',$$Projets Python concrets$$,$$Construis des programmes utiles en Python.$$,$$Automatisation, traitement de données, jeux... Python est incroyablement polyvalent.$$,160,7),
  ('coding','web-design',$$Design web et UX$$,$$Crée des sites beaux et faciles à utiliser.$$,$$Un bon code ne suffit pas. Apprends les principes du design web et de l'expérience utilisateur.$$,130,8),
  ('coding','api-basics',$$Les APIs expliquées$$,$$Comment les applications communiquent entre elles.$$,$$Les APIs sont les intermédiaires invisibles qui font fonctionner le web moderne.$$,120,9),
  ('coding','database-basics',$$Les bases de données$$,$$Stocke et organise tes données efficacement.$$,$$SQL et NoSQL... Comprends comment les applications stockent et récupèrent les informations.$$,140,10),
  ('coding','coding-africa',$$Le coding en Afrique$$,$$Les développeurs africains qui changent le monde.$$,$$Des startups comme Andela, Flutterwave et Paystack montrent que l'Afrique produit des talents tech exceptionnels.$$,110,11),
  ('coding','final-project',$$Projet de programmation final$$,$$Construis ton application complète.$$,$$Récapitule tout ton apprentissage en créant une application web complète de A à Z.$$,200,12),
  -- Blockchain & Web3
  ('blockchain','blockchain-simple',$$La blockchain expliquée simplement$$,$$Une technologie qui change la façon dont on fait confiance.$$,$$Sami et Koffi veulent comprendre cette histoire de blockchain.$$,120,1),
  ('blockchain','crypto-basics',$$Crypto-monnaies : les bases$$,$$Bitcoin, Ethereum et au-delà.$$,$$Les crypto-monnaies ne sont pas que des spéculations. Elles représentent une nouvelle façon de penser l'argent.$$,130,2),
  ('blockchain','nft-explained',$$Les NFTs expliqués$$,$$L'art numérique et la propriété digitale.$$,$$Les NFTs permettent de prouver la propriété d'un objet numérique. Une révolution pour les créateurs africains.$$,120,3),
  ('blockchain','defi-intro',$$DeFi : finance décentralisée$$,$$La finance du futur, accessible à tous.$$,$$La DeFi permet d'emprunter, prêter et investir sans banque. Une opportunité immense pour l'Afrique.$$,140,4),
  ('blockchain','smart-contracts',$$Smart Contracts$$,$$Des contrats qui s'exécutent seuls.$$,$$Un smart contract est un programme qui s'exécute automatiquement quand les conditions sont remplies.$$,130,5),
  ('blockchain','web3-games',$$Web3 Gaming$$,$$Les jeux blockchain et le play-to-earn.$$,$$Le gaming blockchain permet aux joueurs de posséder vraiment leurs objets virtuels.$$,120,6),
  ('blockchain','african-blockchain',$$Blockchain en Afrique$$,$$Les cas d'usage africains de la blockchain.$$,$$Du paiement transfrontalier au traçage agricole, l'Afrique explore la blockchain de manière innovante.$$,110,7),
  ('blockchain','wallet-security',$$Sécurité des wallets$$,$$Protège tes actifs numériques.$$,$$Apprends à créer et sécuriser ton wallet crypto. La sécurité est la priorité numéro un.$$,140,8),
  ('blockchain','dao-intro',$$Les DAO$$,$$Gouvernance décentralisée et collaborative.$$,$$Une DAO est une organisation sans chef, où les membres votent ensemble. Le futur de la gouvernance ?$$,130,9),
  ('blockchain','tokenomics',$$Tokenomics$$,$$Comprendre l'économie des tokens.$$,$$Un token n'est pas qu'un jeton. Il a une utilité, une valeur, et une économie derrière.$$,120,10),
  ('blockchain','layer2',$$Layer 2 Solutions$$,$$Rendre la blockchain plus rapide et moins chère.$$,$$Ethereum Layer 2 comme Arbitrum et Optimism résolvent les problèmes de vitesse et de coût.$$,130,11),
  ('blockchain','web3-project',$$Projet Web3 final$$,$$Construis ta première dApp.$$,$$Récapitule tout ton apprentissage en créant une application décentralisée simple.$$,150,12),
  -- Digital Creator
  ('digital-creator','design-basics',$$Bases du Design$$,$$Les principes fondamentaux du design visuel.$$,$$Nadia veut créer des visuels impactants mais ne sait pas par où commencer.$$,110,1),
  ('digital-creator','color-theory',$$Théorie des couleurs$$,$$Crée des palettes harmonieuses.$$,$$Comprendre les couleurs est essentiel pour tout créateur. Apprends à les combiner avec style.$$,120,2),
  ('digital-creator','typography',$$Typographie$$,$$Le pouvoir des lettres et des polices.$$,$$La typographie influence comment on lit et ressent un message. Maîtrise l'art des polices.$$,110,3),
  ('digital-creator','photo-basics',$$Photographie digitale$$,$$Capture des moments parfaits.$$,$$Avec un smartphone, tu peux créer des photos remarquables. Apprends les bases de la composition.$$,100,4),
  ('digital-creator','video-editing',$$Montage vidéo$$,$$Crée des vidéos captivantes.$$,$$Le montage vidéo est un super-pouvoir. Transforme tes rushes en histoires captivantes.$$,140,5),
  ('digital-creator','motion-design',$$Motion Design$$,$$Donne vie à tes créations avec le mouvement.$$,$$Les animations captivent l'attention. Apprends les bases du motion design.$$,130,6),
  ('digital-creator','audio-basics',$$Production audio$$,$$Enregistre et mixe comme un pro.$$,$$Le son est 50% de l'expérience vidéo. Apprends à enregistrer et nettoyer ton audio.$$,120,7),
  ('digital-creator','storytelling',$$Storytelling digital$$,$$Raconte des histoires qui marquent.$$,$$Un bon récit peut changer le monde. Apprends l'art du storytelling numérique.$$,130,8),
  ('digital-creator','social-content',$$Création de contenu réseaux sociaux$$,$$Deviens influent de manière positive.$$,$$YouTube, TikTok, Instagram... Apprends à créer du contenu qui engage et inspire.$$,110,9),
  ('digital-creator','branding',$$Branding personnel$$,$$Construis ton identité visuelle.$$,$$Ton brand c'est toi. Apprends à créer une identité cohérente et mémorable.$$,120,10),
  ('digital-creator','african-creators',$$Créateurs africains$$,$$Inspirons-nous des talents du continent.$$,$$Des créateurs africains dominent YouTube, TikTok et Instagram. Découvrez leurs secrets.$$,100,11),
  ('digital-creator','creator-project',$$Projet créateur final$$,$$Crée ta première campagne complète.$$,$$De la conception à la publication, réalise une campagne créative complète de A à Z.$$,150,12),
  -- Cyber Hero
  ('cyber-hero','cyber-securite-basics',$$Deviens un Cyber Hero$$,$$Les bases de la cybersécurité pour les jeunes.$$,$$Yann a reçu un message suspect. Est-ce un hameçonnage ?$$,100,1),
  ('cyber-hero','password-security',$$Mots de passe solides$$,$$Protège tes comptes comme un pro.$$,$$Un mot de passe faible est la porte ouverte aux pirates. Apprends à créer des mots de passe infranchissables.$$,110,2),
  ('cyber-hero','phishing',$$Identifie le phishing$$,$$Ne te fais jamais avoir.$$,$$Le phishing est l'attaque la plus courante. Apprends à reconnaître les pièges avant qu'il ne soit trop tard.$$,120,3),
  ('cyber-hero','social-engineering',$$Ingénierie sociale$$,$$Comprendre comment on nous manipule.$$,$$Les pirates ne hackent pas toujours les machines — parfois ils hackent les humains.$$,110,4),
  ('cyber-hero','privacy-online',$$Confidentialité en ligne$$,$$Protège tes données personnelles.$$,$$Chaque fois que tu te connectes, tu laisses des traces. Apprends à les minimiser.$$,120,5),
  ('cyber-hero','safe-browsing',$$Navigation sécurisée$$,$$Navigue sur le web en toute sécurité.$$,$$HTTPS, VPN, bloqueurs de pub... Les outils pour naviguer sans danger.$$,100,6),
  ('cyber-hero','mobile-security',$$Sécurité mobile$$,$$Protège ton smartphone.$$,$$Ton téléphone contient toutes tes informations. Apprends à le sécuriser efficacement.$$,110,7),
  ('cyber-hero','public-wifi',$$Wi-Fi public sécurisé$$,$$Utilise le Wi-Fi public sans risque.$$,$$Le Wi-Fi des cafés et aéroports est dangereux. Voici comment t'en protéger.$$,100,8),
  ('cyber-hero','family-security',$$Sécurité familiale$$,$$Protège toute ta famille en ligne.$$,$$Enseigne à tes proches les bonnes pratiques de sécurité. Protégez-vous ensemble.$$,120,9),
  ('cyber-hero','african-cyber',$$Cybersécurité en Afrique$$,$$Le paysage africain de la sécurité numérique.$$,$$L'Afrique fait face à des défis uniques en cybersécurité. Découvre comment le continent répond.$$,110,10),
  ('cyber-hero','bug-bounty',$$Bug Bounty pour débutants$$,$$Trouve des failles et gagne des récompenses.$$,$$Les bug bounties permettent aux hackers éthiques de gagner de l'argent en signalant des vulnérabilités.$$,130,11),
  ('cyber-hero','cyber-final',$$Mission finale Cyber Hero$$,$$Prouve que tu es un vrai héros du cyber.$$,$$Teste toutes tes compétences dans un scénario complet de cybersécurité.$$,150,12),
  -- Innovation & Entrepreneuriat
  ('innovation-entrepreneurship','design-thinking',$$Design Thinking$$,$$La méthode pour résoudre les problèmes avec créativité.$$,$$Nadia voit un problème dans son quartier : les déchets.$$,150,1),
  ('innovation-entrepreneurship','problem-solving',$$Problem Solving$$,$$Devenir un résolveur de problèmes.$$,$$Chaque problème est une opportunité déguisée. Apprends la méthode pour identifier et résoudre n'importe quel problème.$$,130,2),
  ('innovation-entrepreneurship','lean-startup',$$Lean Startup$$,$$Construis ton entreprise sans gaspiller.$$,$$Le Lean Startup t'apprend à tester tes idées rapidement et à faible coût avant de tout miser.$$,140,3),
  ('innovation-entrepreneurship','business-model',$$Business Model Canvas$$,$$Conçois ton modèle économique.$$,$$Un business model canvas est une page qui résume comment ton entreprise crée, délivre et capture de la valeur.$$,130,4),
  ('innovation-entrepreneurship','pitching',$$Art du Pitch$$,$$Convaincre en 2 minutes.$$,$$Un bon pitch peut changer ta vie. Apprends à présenter ton idée de manière convaincante.$$,120,5),
  ('innovation-entrepreneurship','fintech-africa',$$Fintech en Afrique$$,$$Les innovations financières africaines.$$,$$M-Pesa, Flutterwave, Paystack... L'Afrique est le leader mondial de l'innovation financière mobile.$$,140,6),
  ('innovation-entrepreneurship','agritech',$$AgriTech$$,$$La technologie au service de l'agriculture.$$,$$L'AgriTech utilise la tech pour augmenter la productivité agricole en Afrique. Des drones aux apps de prédiction.$$,130,7),
  ('innovation-entrepreneurship','edtech',$$EdTech$$,$$L'éducation par la technologie.$$,$$Du Nigeria au Kenya, les startups EdTech révolutionnent l'accès à l'éducation sur le continent.$$,120,8),
  ('innovation-entrepreneurship','social-impact',$$Impact Social$$,$$Entreprendre pour changer le monde.$$,$$Le plus grand entrepreneur est celui qui résout les problèmes de sa communauté. L'impact social est ta force.$$,130,9),
  ('innovation-entrepreneurship','digital-marketing',$$Marketing digital$$,$$Faire connaître ton projet en ligne.$$,$$YouTube, Instagram, TikTok... Les réseaux sociaux sont ton meilleur outil de marketing gratuit.$$,110,10),
  ('innovation-entrepreneurship','african-startups',$$Startups africaines à succès$$,$$Inspire-toi des réussites du continent.$$,$$Andela, Jambo Health, Kobo360... Découvre les parcours de ceux qui ont réussi.$$,120,11),
  ('innovation-entrepreneurship','startup-project',$$Projet startup final$$,$$Lance ton propre projet entrepreneurial.$$,$$De l'idée au prototype, construis ton premier projet entrepreneurial en appliquant tout ce que tu as appris.$$,150,12)
) as v(world_slug, slug, title, description, story, xp_reward, sort_order)
join public.worlds w on w.slug = v.world_slug
on conflict (slug) do update
  set title = excluded.title, description = excluded.description, story = excluded.story,
      xp_reward = excluded.xp_reward, sort_order = excluded.sort_order;

-- ---------- Sections génériques pour les aventures sans contenu réel ----------
insert into public.lessons (adventure_id, section_type, sort_order, title, content)
select
  a.id,
  (array['story','discover','mission','project','reflect','build'])[g.i],
  g.i,
  case g.i
    when 1 then '📖 L''histoire'
    when 2 then '🔍 Découvre'
    when 3 then '🎯 Mission'
    when 4 then '🛠️ Projet'
    when 5 then '💭 Réflexion'
    else '🚀 Va plus loin'
  end,
  case g.i
    when 1 then a.story
    when 2 then a.description || ' ' || left(a.story, 150)
    else 'Contenu en cours de rédaction — disponible très bientôt !'
  end
from public.adventures a
cross join generate_series(1, 6) as g(i)
where not exists (select 1 from public.lessons l where l.adventure_id = a.id);

-- ---------- Quiz réels (9 aventures pilotes, repris du front) ----------
insert into public.quiz_questions (adventure_id, question, options, correct_index, sort_order)
select a.id, q.question, q.options::jsonb, q.correct_index, q.ord
from (values
  ('internet-discover', $$Qu'est-ce qu'Internet ?$$, $$["Un jeu vidéo","Un réseau mondial d'ordinateurs connectés","Un téléphone portable","Un site web"]$$, 1, 1),
  ('internet-discover', $$Combien de personnes utilisent Internet dans le monde ?$$, $$["100 millions","1 milliard","Plus de 5 milliards","10 milliards"]$$, 2, 2),
  ('internet-discover', $$Quel pays a créé ARPANET, le prédécesseur d'Internet ?$$, $$["France","Allemagne","États-Unis","Brésil"]$$, 2, 3),
  ('search-master', $$Quel type de site est le plus fiable ?$$, $$["Un blog personnel","Un site .gov ou .edu","Un réseau social","Un forum anonyme"]$$, 1, 1),
  ('search-master', $$Pour vérifier une information, que dois-tu faire ?$$, $$["Croire le premier résultat","Chercher sur plusieurs sites","Partager sans vérifier","Ignorer la date"]$$, 1, 2),
  ('html-basics', $$Que signifie HTML ?$$, $$["HyperText Markup Language","High Tech Modern Language","Home Tool Markup Language","Hyper Transfer Markup Language"]$$, 0, 1),
  ('html-basics', $$Quelle balise crée un titre principal ?$$, $$["<text>","<h1>","<title>","<header>"]$$, 1, 2),
  ('html-basics', $$Quelle balise crée un paragraphe ?$$, $$["<p>","<par>","<text>","<block>"]$$, 0, 3),
  ('ia-decouverte', $$Qu'est-ce que l'IA ?$$, $$["Un robot physique","Une technologie qui permet aux machines d'apprendre","Un jeu vidéo","Un réseau social"]$$, 1, 1),
  ('ia-decouverte', $$L'IA peut-elle créer des images ?$$, $$["Non, jamais","Oui, avec des outils comme DALL-E","Seulement en noir et blanc","Oui mais c'est interdit"]$$, 1, 2),
  ('prompting-mastery', $$Quel est le meilleur prompt ?$$, $$["Dis quelque chose","Explique l'IA en 3 points avec des exemples africains","Qu'est-ce que l'IA ?","Parle-moi d'IA"]$$, 1, 1),
  ('prompting-mastery', $$Un bon prompt doit être :$$, $$["Vague","Précis et contextuel","Très long","En anglais uniquement"]$$, 1, 2),
  ('ai-ethics', $$Pourquoi l'IA peut-elle avoir des biais ?$$, $$["Elle est cassée","Elle apprend de données humaines biaisées","C'est un virus","L'IA n'a pas de biais"]$$, 1, 1),
  ('ai-ethics', $$Comment utiliser l'IA de manière éthique ?$$, $$["Sans réfléchir","Vérifier les résultats et protéger les données","Ne jamais l'utiliser","Partager toutes les données"]$$, 1, 2),
  ('algo-logique', $$Qu'est-ce qu'un algorithme ?$$, $$["Un type de jeu","Une suite d'instructions pour résoudre un problème","Un langage de programmation","Un ordinateur"]$$, 1, 1),
  ('algo-logique', $$Lequel est un exemple d'algorithme ?$$, $$["Une recette de cuisine","Un arbre","Une pierre","Un nuage"]$$, 0, 2),
  ('html-css-firsts', $$À quoi sert CSS ?$$, $$["Structurer le contenu","Styliser et mettre en page","Créer des bases de données","Faire des calculs"]$$, 1, 1),
  ('html-css-firsts', $$Quelle propriété CSS change la couleur du texte ?$$, $$["font-size","color","background","margin"]$$, 1, 2),
  ('python-basics', $$Pourquoi Python est populaire ?$$, $$["Parce qu'il est difficile","Parce qu'il est simple et puissant","Parce qu'il ne fonctionne que sur Mac","Parce qu'il est ancien"]$$, 1, 1),
  ('python-basics', $$Quelle fonction affiche du texte en Python ?$$, $$["print()","show()","display()","echo()"]$$, 0, 2)
) as q(slug, question, options, correct_index, ord)
join public.adventures a on a.slug = q.slug
where not exists (
  select 1 from public.quiz_questions qq where qq.adventure_id = a.id
);

-- ---------- Badges ----------
insert into public.badges (slug, name, description, icon, rarity, xp_required, world_id, required_completions, sort_order)
select b.slug, b.name, b.description, b.icon, b.rarity, b.xp_required, w.id, b.required_completions, b.sort_order
from (values
  ('web-explorer','Web Explorer',$$Tu as exploré le monde du Web$$,'🌐','common',100,'web-digital',0,1),
  ('web-master',$$Maître du Web$$,$$12 aventures Web terminées$$,'🕸️','rare',500,'web-digital',12,2),
  ('ai-explorer','AI Explorer',$$Premiers pas dans l'IA$$,'🤖','common',100,'artificial-intelligence',0,3),
  ('ai-master',$$Maître de l'IA$$,$$12 aventures IA terminées$$,'🧠','rare',500,'artificial-intelligence',12,4),
  ('junior-coder','Junior Coder',$$Tu as écrit ton premier programme$$,'💻','common',150,'coding',0,5),
  ('code-master','Code Master',$$12 aventures Coding terminées$$,'⚙️','rare',500,'coding',12,6),
  ('blockchain-explorer','Blockchain Explorer',$$Tu comprends la blockchain$$,'⛓️','rare',200,'blockchain',0,7),
  ('blockchain-master','Blockchain Master',$$12 aventures Blockchain terminées$$,'🔗','epic',500,'blockchain',12,8),
  ('digital-creator',$$Digital Creator$$,$$Tu as créé ton premier contenu$$,'🎨','common',150,'digital-creator',0,9),
  ('creator-master',$$Créateur Master$$,$$12 aventures Design terminées$$,'✨','rare',500,'digital-creator',12,10),
  ('cyber-hero',$$Cyber Hero$$,$$Tu es un héros de la cybersécurité$$,'🔐','rare',200,'cyber-hero',0,11),
  ('cyber-master',$$Cyber Master$$,$$12 aventures Cybersécurité terminées$$,'🛡️','epic',500,'cyber-hero',12,12),
  ('young-innovator','Young Innovator',$$Tu as présenté un projet innovant$$,'🚀','epic',300,'innovation-entrepreneurship',0,13),
  ('innovator-master',$$Innovator Master$$,$$12 aventures Innovation terminées$$,'💡','epic',500,'innovation-entrepreneurship',12,14),
  ('first-project',$$Premier Projet$$,$$Ton premier projet soumis$$,'⭐','common',0,null,0,15),
  ('explorer-legend',$$Légende Exploratrice$$,$$Tu as accumulé 2000 XP$$,'👑','legendary',2000,null,0,16),
  ('multi-children',$$Grand Frère / Grande Soeur$$,$$Parent avec 2+ enfants$$,'👨‍👩‍👧‍👦','rare',0,null,0,17),
  ('starter-complete',$$Starter Finished$$,$$Terminé les 7 jours starter$$,'🌱','common',0,null,0,18)
) as b(slug, name, description, icon, rarity, xp_required, world_slug, required_completions, sort_order)
left join public.worlds w on w.slug = b.world_slug
on conflict (slug) do update
  set name = excluded.name, description = excluded.description, icon = excluded.icon,
      rarity = excluded.rarity, xp_required = excluded.xp_required, world_id = excluded.world_id,
      required_completions = excluded.required_completions, sort_order = excluded.sort_order;

-- ---------- Ponts (GeekCoding4Kids) ----------
insert into public.digital_bridges (slug, name, description, target_url, icon, color, world_id, sort_order) values
  ('coding-start', $$Commence ton aventure code$$, $$Tu as découvert les bases de la programmation.$$, 'https://geekcoding4kids.online', '💻', 'from-emerald-500 to-teal-400', (select id from public.worlds where slug = 'coding'), 1),
  ('web-build', $$Construis ton premier site$$, $$Tu connais HTML/CSS ? Va plus loin.$$, 'https://geekcoding4kids.online', '🌐', 'from-blue-500 to-cyan-400', (select id from public.worlds where slug = 'web-digital'), 2),
  ('ai-create', $$Crée avec l'IA$$, $$Découvre comment maîtriser l'IA.$$, 'https://geekcoding4kids.online', '🤖', 'from-violet-500 to-purple-400', (select id from public.worlds where slug = 'artificial-intelligence'), 3)
on conflict (slug) do update
  set name = excluded.name, description = excluded.description, target_url = excluded.target_url,
      icon = excluded.icon, color = excluded.color, world_id = excluded.world_id, sort_order = excluded.sort_order;

-- ---------- Plans ----------
insert into public.plans (code, name, tagline, price_fcfa, period, max_children, max_worlds, features, sort_order) values
  ('starter', 'Starter', $$Essaie gratuit 7 jours$$, 0, '7 jours', 1, 1,
   $$["1 monde complet","3 aventures gratuites","Quiz de base","Badge premier projet","Dashboard","Coach IA basique"]$$, 1),
  ('explorer', 'Explorateur', $$Accès complet mensuel$$, 5000, 'mois', 1, 99,
   $$["Tous les mondes","Aventures illimitées","Quiz IA avancé","Badges illimités","Passport complet","Feedback IA","Coach IA premium","Support prioritaire","1 enfant"]$$, 2),
  ('pro', 'Pro', $$Économise 38%$$, 35000, 'an', 3, 99,
   $$["Tout Explorateur","10 mois offerts","Certificats","Rapport parent détaillé","Coach IA VIP","Accès anticipé","Badge exclusif","Africa Makers","Webinaires privés"]$$, 3)
on conflict (code) do update
  set name = excluded.name, tagline = excluded.tagline, price_fcfa = excluded.price_fcfa,
      period = excluded.period, max_children = excluded.max_children, max_worlds = excluded.max_worlds,
      features = excluded.features, sort_order = excluded.sort_order;

-- ---------- Défis (rotation quotidienne/hebdo calculée par l'app) ----------
insert into public.challenges (type, slug, title, description, world_slug, xp_reward, badge_slug) values
  ('daily','find-fake-news',$$Chasseur de fake news$$,$$Trouve une information suspecte sur Internet et explique pourquoi tu la trouves douteuse.$$,'web-digital',50,null),
  ('daily','write-prompt',$$Maître du prompt$$,$$Écris un prompt créatif pour générer une image d'un héros africain futuriste.$$,'artificial-intelligence',50,null),
  ('daily','draw-algo',$$Algorithme dessin$$,$$Dessine un algorithme simple (ex : comment faire un verre d'eau) en 5 étapes.$$,'coding',50,null),
  ('daily','spot-phishing',$$Détective phishing$$,$$Trouve un exemple de phishing (hameçonnage) et explique comment le reconnaître.$$,'cyber-hero',50,null),
  ('daily','app-idea',$$Idée d'application$$,$$Imagine une application qui résoudrait un problème dans ton quartier. Décris-la en 3 phrases.$$,'innovation-entrepreneurship',50,null),
  ('daily','explain-blockchain',$$Explique la blockchain$$,$$Explique la blockchain à un ami de 10 ans en utilisant une analogie avec des Lego.$$,'blockchain',50,null),
  ('daily','design-poster',$$Poster digital$$,$$Crée (même sur papier) un poster pour sensibiliser à la sécurité en ligne.$$,'digital-creator',50,null),
  ('weekly','explorer-web',$$Explorer le Web$$,$$Termine 3 aventures dans le monde Web & Digital cette semaine.$$,'web-digital',200,'web-explorer'),
  ('weekly','devenir-codesmith',$$Devenir Codesmith$$,$$Termine 2 aventures Coding et complète le quiz final.$$,'coding',200,'code-master'),
  ('weekly','master-ia',$$Master de l'IA$$,$$Explore le monde IA et crée ton premier prompt créatif.$$,'artificial-intelligence',200,'ai-master'),
  ('weekly','cyber-sentinel',$$Cyber Sentinel$$,$$Termine toutes les aventures Cyber Hero et passe le quiz final.$$,'cyber-hero',250,'cyber-master'),
  ('weekly','createur-digital',$$Créateur Digital$$,$$Produis 3 créations dans le monde Digital Creator.$$,'digital-creator',200,'creator-master')
on conflict (slug) do update
  set title = excluded.title, description = excluded.description, world_slug = excluded.world_slug,
      xp_reward = excluded.xp_reward, badge_slug = excluded.badge_slug;
