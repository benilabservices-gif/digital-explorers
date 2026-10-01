export default {
  "slug": "web3-project",
  "title": "Projet Web3 final",
  "description": "Aventure de synthèse : conçois ton premier projet Web3 complet, du cahier des charges à la spécification de contrat, en passant par la gouvernance et la sécurité.",
  "story": "Onze aventures, onze outils dans ta sacoche : les blocs et les chaînes, les wallets et leurs clés, les contrats intelligents, les NFT, les DAO, la tokenomics et les secondes couches. Aujourd'hui, tu ne vas plus apprendre des pièces séparées : tu vas les assembler. Ton défi final : concevoir, sur papier, un petit projet Web3 complet pour ton quartier, depuis l'idée jusqu'aux règles de sécurité. Aucun code réel, aucune promesse de gain : un cahier des charges, des choix techniques argumentés, et un prototype jouable en papier. C'est l'aventure qui transforme tout ce que tu as appris en compétence de concepteur.",
  "xp_reward": 150,
  "lessons": [
    {
      "section_type": "discover",
      "title": "Le cahier des charges : partir d'un vrai problème",
      "content": "Tout projet, Web3 ou non, commence par une question de terrain : quel problème concret résous-tu, et pour qui ? La plus grande erreur des débutants est de choisir la technologie d'abord, et le problème ensuite. Fais l'inverse. Parcours ta journée de quartier, et note les frictions : la tontine du marché qui tient ses comptes dans un cahier que personne ne peut vérifier à distance ; les tickets papier du pressoir que l'on falsifie ; la cotisation du club informatique dont le trésorier doit rendre des comptes chaque semaine. Chacun de ces problèmes partage une signature commune : plusieurs parties qui doivent se faire confiance autour d'un registre, sans autorité centrale disponible. Cette signature, tu la reconnais maintenant, c'est exactement le terrain de la blockchain. Ton cahier des charges, à remplir par écrit, suit cinq questions. Un : le problème. Décris-le en une phrase précise : qui souffre de quoi, à quelle fréquence, pour quel coût. Deux : les utilisateurs. Nomme tes trois profils, avec leurs niveaux techniques : une commerçante au marché, un trésorier, une jeune élève ; leurs contraintes d'appareil, souvent un simple smartphone ; leur accès à internet, parfois intermittent. Trois : l'apport du Web3. Quelle pièce de ta sacoche résout quoi : un registre partagé ? Un contrat automatique ? Un vote vérifiable ? Si aucune pièce n'apporte de réponse nette, dis-le honnêtement et garde un simple cahier : tous les problèmes n'ont pas besoin de blockchain, et le savoir est une compétence. Quatre : les risques. Énumère-les : perte de clés, frais, compréhension des utilisateurs, réglementation locale. Cinq : le critère de réussite. Une phrase mesurable : au bout d'un mois, si les membres du club peuvent vérifier la cotisation sans demander au trésorier, le projet réussit. Ce cahier des charges, soigne-le : c'est la fondation de tout le reste.",
    },
    {
      "section_type": "play",
      "title": "Choisir la bonne pièce : le matching technologie-problème",
      "content": "Ta sacoche contient onze outils ; le cœur du métier de concepteur, c'est le matching : faire correspondre le bon outil au bon problème, ni plus, ni moins. Reprenons les pièces une à une, avec leur emploi idéal. Le registre partagé, la blockchain simple : parfait quand plusieurs parties doivent voir le même historique inaltérable, comme les cotisations d'une tontine ou les ventes d'un pressoir. Le contrat intelligent : parfait quand des règles automatiques doivent s'appliquer sans intermédiaire, comme verser la part du vendeur dès la vente scellée, ou libérer la caution d'un prêt au terme convenu. Le NFT : parfait pour prouver la propriété d'un objet unique, un billet d'événement, une œuvre, une carte de membre ; inadapté pour des choses interchangeables, comme des unités d'argent. La DAO : parfaite quand un groupe doit décider ensemble, voter des dépenses, approuver des règles, sans chef. La tokenomics : le plan d'approvisionnement d'un jeton utile, à ne dessiner qu'avec prudence et à des fins d'usage, jamais de spéculation. La seconde couche : le bon choix quand les petits montants fréquents dominent, car les frais doivent rester dérisoires. Le wallet : l'interface entre l'utilisateur et tout le reste, à choisir simple et sécurisé. À l'inverse, apprends le contre-emploi, l'anti-modèle : utiliser une blockchain là où une base de données classique suffit, une situation d'unique propriétaire sans besoin de confiance partagée ; utiliser un jeton là où un simple système de points suffit ; utiliser un vote sur chaîne là où un groupe de cinq amis décide très bien autour d'un thé. Exerce-toi : prends trois problèmes de ta liste de terrain, et pour chacun, écris en une phrase quelle pièce tu emploierais, et surtout laquelle tu écartes, avec la raison. Ce discernement, la capacité à dire non à la technologie inutile, est la marque des concepteurs sérieux, et elle impressionne davantage que n'importe quel jargon.",
    },
    {
      "section_type": "experiment",
      "title": "Spécifier un contrat intelligent sans code",
      "content": "Maintenant, plonge au cœur technique : la spécification de ton contrat intelligent, c'est-à-dire sa description complète en langage courant, avant toute ligne de code. Les vraies équipes rédigent toujours cette spécification d'abord ; le code n'est que sa traduction. Prenons un exemple fil rouge : le contrat de cagnotte du club informatique, une cagnotte transparente où les cotisations s'accumulent, où le trésorier ne peut pas toucher seul aux fonds, et où chaque dépense est votée. La spécification se rédige en cinq blocs. Bloc un, les états : ce que le contrat retient. Pour chaque membre : son identité, sa cotisation versée ; pour la cagnotte : son solde total ; pour chaque dépense proposée : son montant, sa raison, ses votes pour et contre. Bloc deux, les règles d'évolution : ce que le contrat fait. Quand un membre verse sa cotisation, son compteur augmente et le solde total aussi ; rien d'autre ne peut augmenter un solde : règle absolue. Bloc trois, les actions externes : ce que les humains peuvent demander. Verser une cotisation ; proposer une dépense avec un montant plafonné ; voter pour ou contre ; exécuter une dépense approuvée. Bloc quatre, les gardes-fous : ce que le contrat refuse, la partie la plus importante. Refuser toute dépense non approuvée par la majorité ; refuser qu'une même personne vote deux fois ; refuser toute modification du contrat par son créateur après déploiement ; refuser les montants au-dessus du plafond, même approuvés. Bloc cinq, les événements notés : ce que le contrat annonce publiquement à chaque action, pour que tout membre puisse suivre. Exercice : rédige ces cinq blocs pour ton propre projet, puis passe-le à l'épreuve du méchant : imagine trois attaques qu'un membre malhonnête tenterait, et vérifie que tes gardes-fous les bloquent chacun. Un contrat bien spécifié, c'est un contrat où le méchant a déjà perdu avant de commencer.",
    },
    {
      "section_type": "build",
      "title": "Gouvernance et sécurité : les deux piliers du sérieux",
      "content": "Un projet Web3 bien spécifié doit encore répondre à deux questions qui décident de sa survie : qui décide, et comment se protège-t-on ? Premier pilier : la gouvernance, en empruntant à la sagesse des DAO. Écris tes règles de gouvernance en quatre points. Un : la proposition. Qui peut en faire : tout membre, ou seulement ceux qui ont cotisé au moins un mois ? Deux : le vote. Comment vote-t-on : à main levée sur papier pour le prototype, chaque voix comptant une fois, avec vérification publique des listes. Trois : le quorum. Quel minimum de participation pour qu'une décision soit valide : fixe-le assez haut pour éviter la tyrannie de la minorité active, cette leçon que tu connais des DAO. Quatre : les délais. Combien de temps entre la proposition et le vote, entre le vote et l'exécution : des délais courts pour l'urgence, mais jamais zéro, car un délai est une protection contre la précipitation. Second pilier : la sécurité, en empruntant aux aventures wallets et ponts. Dresse ta checklist de sécurité projet, avec les réflexes que tu as déjà acquis. Les clés : jamais partagées, jamais photographiées, écrites à la main et rangées ; pour le prototype, des jetons de jeu, pas de vraies valeurs. Les montants : tester d'abord petit, toujours, sans exception. Les permissions : le principe du moindre pouvoir, chaque rôle ne peut faire que ce qui est écrit ; personne, pas même le créateur, ne détient un passe-droits. Les mises à jour : les règles changent par vote, jamais en secret. Les sauvegardes : le registre papier est doublé, chaque membre garde une copie des soldes. Et l'humilité technique, la règle d'or : tout ce qui n'a pas été testé est considéré cassé ; tout ce qui a été testé est considéré à re-tester. Les projets qui durent ne sont pas ceux qui n'ont jamais eu d'incident : ce sont ceux qui avaient déjà écrit, avant l'incident, ce qu'ils feraient après.",
    },
    {
      "section_type": "mission",
      "title": "Mission : le pitch de ton projet",
      "content": "Mission de communication : présenter ton projet en trois minutes, à la manière d'un concours de jeunes créateurs. Ce format est standard dans l'écosystème des startups africaines, et il forge ta clarté. Prépare un pitch en cinq temps. Temps un, le problème, trente secondes : raconte-le par une histoire courte et vraie, sans jargon : chaque semaine, le trésorier recopie les cotisations à la main, et deux membres contestent déjà les comptes. Temps deux, la solution, trente secondes : une phrase simple : un registre partagé que chacun peut vérifier, et un contrat qui bloque les dépenses non votées. Évite absolument le jargon dans ces deux temps : pas de distribution, pas de couche, pas de finance décentralisée : des mots de quartier. Temps trois, la démonstration, soixante secondes : montre ton prototype papier : voici le cahier du club, voici la carte de membre, voici comment on vote, voici ce que le contrat refuse : fais vivre la scène en manipulant les objets, une démonstration vaut dix discours. Temps quatre, la prudence, trente secondes : surprends ton public en annonçant toi-même les limites : voici nos risques, voici ce que nous ne ferons pas, voici comment nous protégerons les débutants : cette lucidité est la marque des projets crédibles, elle rassure plus qu'elle n'inquiète. Temps cinq, l'appel, trente secondes : ce que tu demandes : cinq membres pour tester le prototype pendant un mois. Puis entraîne-toi : chronomètre-toi, enregistre-toi sur ton téléphone, réécoute, raccourcis. Présente devant ta famille, puis devant ton club. Livrable : ta fiche pitch d'une page, tes objets de démonstration, et une présentation réalisée devant au moins trois personnes, avec leurs trois questions notées par écrit : les questions du public sont le meilleur radar des zones floues de ton projet.",
    },
    {
      "section_type": "project",
      "title": "Projet final : la simulation du club, prototype jouable",
      "content": "Projet de synthèse : construire et jouer la simulation complète de ton projet, en papier, avec quatre personnes minimum. Contexte fil rouge : le club informatique du quartier veut remplacer son cahier de trésorerie par un registre partagé et un contrat de cagnotte. Matériel : un cahier registre, des fiches membres, des billets de jeu, des jetons de vote, et la carte du contrat, où sont écrits les gardes-fous en grosses lettres. Déroulé en six scènes. Scène un, l'assemblée fondatrice : les membres lisent la carte du contrat à voix haute, signent la charte du club, et élisent un gardien du registre, qui ne fait qu'écrire, jamais décider. Scène deux, les cotisations : chaque membre verse ses billets de jeu et voit la ligne s'inscrire au registre, avec date et montant : n'importe qui peut recopier le registre chez soi, c'est la réplication. Scène trois, l'attaque du trésorier : le trésorier tente une dépense sans vote : la carte du contrat le refuse, le gardien l'annonce à tous : débriez ce moment, c'est le cœur du système. Scène quatre, la proposition et le vote : un membre propose d'acheter un clavier neuf pour le club, avec montant et raison ; le vote se déroule à jetons, chaque membre une voix, les pour et contre affichés ; le quorum est atteint, la dépense est approuvée. Scène cinq, l'exécution et l'inscription : la dépense est payée en billets de jeu, la ligne s'inscrit au registre, et le solde est recalculé devant tous. Scène six, le comité de sécurité : passe la checklist : clés protégées, permissions minimales, petits montants d'abord, délais respectés. Puis échangez les rôles et rejouez, avec une variante : un membre tente de voter deux fois ; le registre est perdu, un membre le restaure depuis sa copie ; une proposition dépasse le plafond. À chaque variante, la carte du contrat doit triompher : sinon, corrigez vos gardes-fous, c'est le vrai travail des concepteurs. Débriefe final : ce que ton prototype a prouvé, ce qu'il ne prouve pas, et ce que tu construirais ensuite. Tu viens de faire tourner, en papier, tout ce que tu as appris en douze aventures : un registre, un contrat, un vote, des gardes-fous, et une communauté qui n'a plus besoin de se faire confiance à l'aveugle. C'est cela, le Web3 compris jusqu'au bout : pas une machine à enrichir, mais un outil d'organisation honnête, entre personnes qui veulent bien faire ensemble.",
    }
  ],
  "quiz": [
    {
      "question": "Par quoi commence tout projet Web3 bien conçu ?",
      "options": [
        "Par l'achat d'un ordinateur puissant",
        "Par un vrai problème de terrain et un cahier des charges",
        "Par le choix de la blockchain la plus rapide",
        "Par la création d'un jeton"
      ],
      "correct_index": 1,
      "explanation": "On choisit le problème d'abord, la technologie ensuite : tous les problèmes n'ont pas besoin de blockchain, et le savoir est une compétence de concepteur."
    },
    {
      "question": "Dans la spécification d'un contrat intelligent, que sont les gardes-fous ?",
      "options": [
        "Les personnes qui surveillent le contrat",
        "Les règles de refus : ce que le contrat interdit, comme une dépense non votée ou un double vote",
        "Les frais de fonctionnement",
        "Le nom du contrat"
      ],
      "correct_index": 1,
      "explanation": "Les gardes-fous sont la partie la plus importante de la spécification : tout ce que le contrat refuse absolument, même à son créateur."
    },
    {
      "question": "Pour prouver la propriété d'un billet d'événement unique, quelle pièce employer ?",
      "options": [
        "Un NFT, conçu pour les objets uniques",
        "Une DAO",
        "Un contrat de cagnotte",
        "Une seconde couche"
      ],
      "correct_index": 0,
      "explanation": "Le NFT est l'outil des objets uniques et identifiables : billets, œuvres, cartes de membre ; les choses interchangeables, comme l'argent, n'en ont pas besoin."
    },
    {
      "question": "Pourquoi un délai entre le vote et l'exécution est-il une protection ?",
      "options": [
        "Pour que les membres aient le temps de changer d'avis",
        "Parce que les délais protègent contre la précipitation et laissent vérifier les décisions",
        "Pour que le trésorier puisse refuser",
        "Pour augmenter les frais"
      ],
      "correct_index": 1,
      "explanation": "Un délai minimal empêche les décisions prises dans la précipitation, donne le temps de vérifier, et protège la communauté contre les coups de force."
    },
    {
      "question": "Que doit montrer un bon prototype de projet Web3 en papier ?",
      "options": [
        "Un registre consultable par tous, un contrat aux gardes-fous testés, un vote vérifiable et des rôles limités",
        "Une promesse de gains rapides",
        "Un logo et un nom accrocheurs",
        "La liste des blockchains existantes"
      ],
      "correct_index": 0,
      "explanation": "Le prototype prouve l'essentiel : transparence du registre, refus automatiques des abus, votes vérifiables et moindre pouvoir pour chaque rôle ; le reste est habillage."
    }
  ]
}
