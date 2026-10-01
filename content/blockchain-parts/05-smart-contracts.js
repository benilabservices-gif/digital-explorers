export default {
  "slug": "smart-contracts",
  "title": "Smart Contracts",
  "description": "Découvre les contrats intelligents : des programmes autonomes sur blockchain qui exécutent les accords automatiquement, sans juge ni gendarme.",
  "story": "Imagine un pari avec ton cousin sur le match des Éléphants : d'habitude, il faut un arbitre de confiance pour garder l'argent et trancher à la fin. Un contrat intelligent supprime l'arbitre : c'est un programme qui garde les sommes et exécute l'accord tout seul, exactement comme écrit, sans favoritisme possible. Dans cette aventure, tu apprends à écrire la logique de ces programmes dans ta tête, et à repérer pourquoi le code est devenu le nouveau contrat.",
  "xp_reward": 130,
  "lessons": [
    {
      "section_type": "discover",
      "title": "Le contrat qui s'exécute tout seul",
      "content": "Un contrat classique, papier, a un défaut de taille : il ne fait rien tout seul. Il a besoin que des humains le lisent, l'interprètent, l'appliquent, et parfois le respectent malgré eux, avec l'aide d'un juge, lent et coûteux. Un contrat intelligent, lui, est un programme déposé sur une blockchain, et il fait exactement ce qui est écrit : recevoir, mémoriser, vérifier, exécuter. Reprenons le pari du match. Toi et ton cousin envoyez chacun vos dix mille francs de mise vers le contrat : le programme les garde. À la fin du match, n'importe qui peut lui transmettre le résultat, mais le programme n'accepte que si la source du résultat est celle convenue à l'avance, par exemple le compte officiel de la fédération. Le programme vérifie, puis envoie automatiquement les vingt mille francs au gagnant. Personne ne peut annuler, personne ne peut tergiverser, personne ne peut fuir avec la caisse. Trois propriétés rendent ce résultat possible. La transparence : le code du contrat est public, tout le monde peut le lire avant d'envoyer sa mise, donc personne ne découvre les règles après avoir joué. L'automaticité : l'exécution ne dépend d'aucune bonne volonté, seulement des conditions programmées. L'inviolabilité : une fois déployé, le contrat ne peut plus être modifié, ce qui est sa force, et parfois son piège, car un contrat intelligent contient aussi les bugs de son code, sans possibilité de correction discrète. Ce trio explique l'expression souvent entendue : le code est le contrat. Dans cette aventure, tu apprends à lire la logique de ces programmes, à en imaginer la logique toi-même, et à comprendre pourquoi cette invention ouvre des portes fascinantes, à condition d'en connaître les angles."
    },
    {
      "section_type": "play",
      "title": "Anatomie d'un contrat intelligent",
      "content": "Ouvrons le capot d'un contrat intelligent typique, en décrivant sa structure comme pour un programme que tu écrirais. Un contrat commence par ses variables, la mémoire du contrat : par exemple la liste des participants, la date limite de participation, le montant de la mise, et l'adresse du bénéficiaire. Ces valeurs vivent sur la blockchain, ce qui signifie qu'elles sont publiques, inviolables, et lisibles par tous. Vient ensuite la partie la plus importante : les règles de garde, appelées conditions d'accès. Un contrat bien écrit commence par vérifier qui agit et dans quel état se trouve le contrat : est-ce bien un participant enregistré qui appelle cette fonction ? sommes-nous avant la date limite ? le contrat a-t-il déjà été payé ? Sans ces vérifications, n'importe qui pourrait appeler n'importe quoi : la sécurité d'un contrat tient d'abord à ses contrôles d'entrée. Puis les fonctions, les actions possibles : rejoindre le pari, soumettre un résultat, réclamer le gain. Chaque fonction suit la même logique qu'un algorithme : vérifier les conditions, mettre à jour les variables, déclencher l'effet, par exemple le transfert des fonds. Enfin, les événements, les traces officielles : le contrat émet des annonces, enregistrées sur la blockchain, du style un participant a rejoint, le résultat a été soumis, le gain a été versé. Ces annonces permettent à tous, humains comme programmes, de suivre l'activité du contrat sans lire sa mémoire interne. Exercice mental : écris sur papier, en français, les variables et les fonctions d'un contrat de vente de billets de spectacle : variables, prix, quantité restante, liste des détenteurs ; fonctions, acheter, rembourser, vérifier un billet ; conditions d'accès, les billets restants, le prix exact envoyé. Ce plan s'appelle spécifier un contrat, la première étape du métier de développeur blockchain, avant même la moindre ligne de code."
    },
    {
      "section_type": "experiment",
      "title": "Quand le code rencontre la réalité",
      "content": "Les contrats intelligents sont rigoureux, et cette rigueur produit des situations enseignantes. Première situation : la conformité littérale. Un contrat exécute ce qui est écrit, pas ce qui était voulu. Si le contrat dit verser le gain au premier qui soumet un résultat, sans préciser la source, il versera à celui qui soumet le premier, même un résultat faux : le contrat n'a pas de jugement, il a des instructions. La leçon : la qualité d'un contrat intelligent se joue dans sa spécification, avant le code. Deuxième situation : le bug figé. Un contrat déployé ne se modifie plus ; si le code contient une faille, elle est publique, définitive, et convoitée : l'histoire de la blockchain compte des contrats vidés de plusieurs millions par une simple ligne mal protégée. Les développeurs sérieux adoptent des pratiques de parade : faire relire le code par des auditeurs indépendants, déployer d'abord une version limitée avec des sommes modestes, prévoir des mécanismes de mise à jour ou d'urgence, quitte à réintroduire une dose de confiance, ce qui est un choix d'ingénierie à assumer. Troisième situation : l'oracle, la frontière du monde réel. Un contrat vit sur la blockchain, mais le résultat du match, le prix du cacao ou la pluie tombée à Bouaké vivent dehors : il faut donc des porte-parole, appelés oracles, chargés d'apporter ces faits au contrat. D'où la grande question de la DeFi et des contrats : en qui peut-on faire confiance pour rapporter la réalité ? Des systèmes tentent d'y répondre avec plusieurs sources indépendantes, des mises en jeu perdues en cas de mensonge, des vérifications croisées : la confiance ne disparaît pas, elle se déplace. Retiens la formule du professionnel : un contrat intelligent garantit l'exécution fidèle de la règle, jamais la vérité de ce qu'on lui rapporte, ni la sagesse de la règle elle-même."
    },
    {
      "section_type": "build",
      "title": "Des usages concrets, du pari au foncier",
      "content": "Passons en revue les applications réelles des contrats intelligents, en commençant par les plus simples à imaginer. La cagnotte conditionnelle : un contrat collecte des fonds pour un projet de quartier, et ne les libère que si la somme visée est atteinte avant la date limite ; sinon, chaque donateur est remboursé automatiquement, sans comité ni trésorier. Ce mécanisme, appelé financement conditionnel, règle une vraie douleur des cotisations communes : la crainte que la caisse ne disparaisse si le projet avorte. La loterie transparente : l'algorithme du tirage est public, la cagnotte est visible, les gains sont versés automatiquement : l'improbité devient quasi impossible. La réputation inviolable : un prestataire de services accumule des évaluations enregistrées une à une, sans possibilité de suppression sélective : les faux avis deviennent plus difficiles à organiser. L'escrow, le tiers séquestre : pour une transaction entre un acheteur et un vendeur qui ne se connaissent pas, le contrat garde la somme et ne la libère qu'à la confirmation de livraison, l'équivalent programmé du vendeur de confiance du marché. Les micro-paiements à l'usage : un cycle de location partagé, où chaque minute d'usage déclenche un paiement infime, impossible à gérer par un employé, trivial pour un contrat. La gestion foncière et documentaire : des projets, notamment africains, enregistrent titres et actes notariés avec horodatage inviolable, pour lutter contre les doubles ventes de terrains, un fléau réel : le contrat ne remplace pas l'État, il lui fournit un cahier inaltérable. Pour chaque usage, applique ta grille d'analyse : quel problème réel ? quelle confiance remplacée ? quel coût de transaction évité ? Et souviens-toi de la question du professionnel : une base de données classique avec un gestionnaire honnête suffirait-elle ? Si oui, le contrat intelligent est un luxe ; si la confiance est le problème central, il devient une solution."
    },
    {
      "section_type": "mission",
      "title": "Mission : spécifie ton premier contrat",
      "content": "Mission de concepteur : rédiger la spécification complète d'un contrat intelligent, sans écrire de code, en français structuré. Choisis un cas utile à ton quotidien : la cagnotte de la tontine numérique, la billeterie du match de quartier, la vente de places pour la sortie de classe, ou le prêt de matériel du club informatique. Ta spécification comportera cinq rubriques, comme les documents réels des équipes blockchain. Rubrique un, les rôles : qui interagit avec le contrat ? Par exemple : l'organisateur, les participants, un vérificateur. Décris ce que chacun a le droit de faire, et surtout ce qu'il n'a pas le droit de faire. Rubrique deux, les variables : quelles informations le contrat mémorise ? Solde, liste des participants, date limite, seuil de réussite. Nomme chacune précisément. Rubrique trois, les fonctions : les actions possibles, chacune décrite en quatre temps : qui peut l'appeler, quelles conditions doivent être vraies, quelles variables changent, quels effets externes se produisent, comme un versement. Rubrique quatre, les cas limites : que se passe-t-il si personne ne participe ? si un même participant paie deux fois ? si la date limite tombe un jour de coupure d'électricité généralisée ? si un versement échoue ? Traite chaque cas explicitement : les cas limites sont là où les contrats réels se brisent. Rubrique cinq, le tableau de bord : quelles informations le contrat rend publiques à chaque étape, pour que chacun vérifie sans demander à personne. Livrable : une page structurée. Puis fais faire à ta spécification son premier audit : montre-la à un camarade et demande-lui de la casser en imaginant trois façons de tricher : s'il en trouve une que ta spécification n'interdit pas, tu viens d'apprendre ce que les auditeurs appellent un vecteur d'attaque, et tu l'enrayeras avant le code. Bienvenue dans l'ingénierie des contrats."
    },
    {
      "section_type": "project",
      "title": "Projet : le contrat du match en papier",
      "content": "Projet final : faire vivre un contrat intelligent complet, joué sur papier par des humains qui jouent le rôle du code, avec la discipline de fer des machines. Contexte : un pari sur un match, avec une cagnotte de bonpoints, trois joueurs et un fournisseur de résultats. Étape un : la rédaction. Écris noir sur blanc le contrat du pari, en style contractuel : chaque participant envoie cinq bonpoints avant la date limite ; le fournisseur de résultats, désigné à l'avance, est le seul à pouvoir soumettre un résultat ; dès qu'un résultat valide est soumis, la cagnotte entière part au camp gagnant ; aucune annulation, aucune exception. Étape deux : le déploiement. Nomme un joueur-machine, dont le seul rôle est d'appliquer le texte, lettre par lettre, sans intelligence et sans pitié : il ne répond jamais au feeling, il ne modifie jamais une virgule. Étape trois : la vie du contrat. Les parieurs déposent leurs mises, le joueur-machine les refuse après la date limite, fût-ce une seconde, car le texte dit avant la date limite. Le fournisseur soumet le résultat ; le joueur-machine vérifie l'identité du soumetteur et verse la cagnotte, sans commentaire. Étape quatre : les tentatives de corruption. Chaque joueur tente une tricherie : payer en retard, soumettre un faux résultat soi-même, supplier le joueur-machine de faire une exception, réclamer un remboursement. Note chaque refus et la règle exacte qui l'a fondé. Étape cinq : l'accident. Change le scénario : le fournisseur de résultats soumet un résultat faux. Le joueur-machine verse quand même : le contrat n'a pas de jugement. Étape six : le débriefe d'ingénieur. Comment aurait-on pu empêcher l'accident ? Plusieurs fournisseurs avec mise en jeu ? Un vote des participants ? Un délai de contestation ? Chaque proposition s'appelle une amélioration de conception, et c'est ainsi que progressent les vrais contrats : par des incidents simulés, des audits, des versions. Ton pari de bonpoints t'aura appris le métier."
    }
  ],
  "quiz": [
    {
      "question": "Qu'est-ce qu'un contrat intelligent ?",
      "options": [
        "Un contrat papier signé par un avocat",
        "Un programme sur blockchain qui exécute automatiquement les règles écrites, sans intermédiaire",
        "Une promesse verbale entre amis",
        "Un document Word protégé par mot de passe"
      ],
      "correct_index": 1,
      "explanation": "Le contrat intelligent reçoit, vérifie et exécute : le code est le contrat, public, automatique et inviolable une fois déployé."
    },
    {
      "question": "Que signifie l'expression le code est le contrat ?",
      "options": [
        "Que les développeurs gagnent toujours les procès",
        "Que le contrat exécute exactement ce qui est écrit, pas ce qui était voulu ou espéré",
        "Que le code est illisible",
        "Que la blockchain écrit les contrats toute seule"
      ],
      "correct_index": 1,
      "explanation": "La conformité est littérale : un oubli dans le code devient une règle, et une faille reste publique et définitive. D'où l'importance de la spécification."
    },
    {
      "question": "Pourquoi les conditions d'accès sont-elles capitales dans un contrat ?",
      "options": [
        "Pour le décorer",
        "Parce qu'elles vérifient qui agit et dans quel état : sans elles, n'importe qui pourrait appeler n'importe quelle fonction",
        "Pour économiser du papier",
        "Pour traduire le contrat"
      ],
      "correct_index": 1,
      "explanation": "La sécurité tient aux contrôles d'entrée : chaque fonction commence par vérifier l'identité de l'appelant et les conditions de l'état, avant tout effet."
    },
    {
      "question": "Qu'est-ce qu'un oracle dans l'écosystème des contrats ?",
      "options": [
        "Un vieil ordinateur magique",
        "Un service chargé d'apporter au contrat des faits du monde réel, comme un résultat de match",
        "Une base de données secrète",
        "Un type de blockchain"
      ],
      "correct_index": 1,
      "explanation": "Le contrat vit sur la blockchain, la réalité vit dehors : les oracles rapportent les faits, et la confiance se déplace sur la fiabilité de ces sources."
    },
    {
      "question": "Quel usage un contrat intelligent résout-il avec la cagnotte conditionnelle ?",
      "options": [
        "La disparition des fonds si le projet échoue : le contrat rembourse automatiquement",
        "Le choix du menu du maquis",
        "La météo du week-end",
        "Les notes de classe"
      ],
      "correct_index": 0,
      "explanation": "Le financement conditionnel : la somme n'est libérée que si l'objectif est atteint avant la date limite, sinon remboursement automatique de chacun."
    }
  ]
}
