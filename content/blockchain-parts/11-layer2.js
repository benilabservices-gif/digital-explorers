export default {
  "slug": "layer2",
  "title": "Layer 2 Solutions",
  "description": "Comprends pourquoi les blockchains débordent et comment les secondes couches les soulagent : rollups, canaux, frais réduits et leurs compromis techniques.",
  "story": "Un samedi de marché à Adjamé, au plus fort de la journée : chaque transaction du monde entier passerait par un seul guichet, avec une file qui s'allonge et des frais qui montent. C'est le problème des grandes blockchains : trop de monde, pas assez de place dans chaque bloc. Les solutions de seconde couche, les layer 2, ouvrent des guichets parallèles qui comptent vite à l'extérieur, puis scellent le résumé à l'intérieur. Dans cette aventure, tu comprends cette architecture, la plus importante du web3 moderne.",
  "xp_reward": 130,
  "lessons": [
    {
      "section_type": "discover",
      "title": "Le problème de l'échelle : le guichet unique",
      "content": "Pourquoi les blockchains sont-elles parfois lentes et chères ? La réponse tient dans un choix de conception fondamental. Rappelons le fonctionnement : chaque transaction, chaque échange, chaque inscription attend d'être rangée dans un bloc ; chaque bloc est vérifié par des milliers de machines ; et l'espace de chaque bloc est volontairement limité, pour que ces machines ordinaires puissent toutes suivre et vérifier. Cette limitation, c'est le prix de la décentralisation : une blockchain que des ordinateurs modestes peuvent faire tourner, partout dans le monde, ne peut pas traiter autant de transactions qu'un serveur unique optimisé. Fais le calcul de situation : si le réseau peut traiter une quinzaine de transactions par seconde, et que des millions de personnes veulent agir en même temps, une file d'attente se forme, exactement devant un guichet unique. Or, une file a une conséquence implacable : ceux qui veulent passer vite surenchèrent. Les frais, qui servent à prioriser les transactions, montent : aux heures de pointe, une simple transaction peut coûter l'équivalent de plusieurs repas, ce qui disqualifie les petits montants et les usages quotidiens. C'est le trilemme bien connu des concepteurs : décentralisation, sécurité, et vitesse, trois qualités dont chaque blockchain doit choisir lesquelles maximiser, au détriment de la troisième. Le monde a cherché des solutions ; la plus influente s'appelle la seconde couche, et elle repose sur une idée à la fois simple et géniale que tu vas explorer : ne pas faire entrer chaque transaction dans le guichet unique, mais seulement des résumés scellés. Bienvenue dans l'architecture à deux niveaux qui porte déjà une large part du web3 d'aujourd'hui.",
    },
    {
      "section_type": "play",
      "title": "L'idée des secondes couches : compter à côté",
      "content": "L'idée centrale des solutions de seconde couche : déplacer le travail, pas la confiance. Décomposons avec une image précise. Imagine la blockchain principale comme le registre officiel d'un notaire : inviolable, mais lent, et facturant chaque page. Imagine une seconde couche comme un cahier de brouillon surveillé : à côté, les parties effectuent leurs échanges rapidement, presque gratuitement, en notant tout dans le brouillon ; périodiquement, un résumé du cahier, appuyé par une preuve mathématique, est déposé au registre officiel. Résultat : des centaines d'échanges n'occupent qu'une ligne du registre du notaire, et pourtant, la sécurité du notaire couvre l'ensemble : c'est cela, la seconde couche. Trois familles techniques réalisent cette idée, à connaître par leur logique. Les canaux de paiement : deux personnes qui s'échangent souvent, un vendeur de jus et son livreur par exemple, ouvrent un canal en déposant une garantie sur la chaîne principale ; ensuite, ils s'échangent des mises à jour signées entre eux, en direct, sans blockchain, aussi vite qu'un message ; à la clôture, seul le solde final retourne sur la chaîne. Les transactions à sommaire compact, souvent appelées rollups : des milliers de transactions sont traitées à l'extérieur, puis un sommaire compressé, accompagné de preuves permettant à quiconque de vérifier leur exactitude, s'inscrit sur la chaîne principale : les mathématiques vérifient en bloc ce que chaque nœud n'a pas calculé un par un. Les chaînes validatrices : des chaînes séparées qui vérifient mutuellement leurs blocs avec la chaîne principale, un modèle plus rapide, mais qui répartit différemment la confiance. Ce que tu dois retenir : toutes ces familles poursuivent le même but, décharger le guichet, en gardant le registre officiel pour les arbitrages et la sécurité ; leurs différences tiennent dans la manière de prouver que le brouillon est honnête.",
    },
    {
      "section_type": "experiment",
      "title": "Les rollups : le brouillon prouvé par les maths",
      "content": "Zoom sur la famille reine des secondes couches : les rollups, car ils portent la promesse la plus forte : la vitesse du dehors, la sécurité du dedans. Le fonctionnement, décrit pas à pas. Première phase, l'accumulation : les utilisateurs envoient leurs transactions à un opérateur de rollup, ou à un réseau d'opérateurs, qui les exécute hors de la chaîne principale, dans son brouillon. Deuxième phase, le regroupement : l'opérateur compacte ces centaines de transactions en un paquet, et calcule deux choses : le nouvel état, c'est-à-dire l'image finale des soldes et des contrats, et une preuve, un objet mathématique qui certifie que les règles ont été respectées, transaction par transaction. Troisième phase, le dépôt : l'opérateur inscrit sur la chaîne principale le paquet compacté, la preuve, et le nouvel état. Quatrième phase, la vérification : un contrat intelligent posé sur la chaîne principale vérifie la preuve : si elle est valide, le nouvel état est adopté ; si elle est invalide, le paquet est rejeté. Voici la prouesse : la chaîne principale n'a pas rejoué les centaines de transactions ; elle a vérifié une preuve courte qui les garantit toutes. Deux grandes écoles de preuve se disputent le marché, retiens leur logique : la première publie toutes les données des transactions sur la chaîne principale, ce qui permet à quiconque de rejouer et de contester : sécurité maximale par la transparence, coût un peu plus lourd ; la seconde publie uniquement la preuve mathématique de validité : plus léger et plus rapide, mais qui demande de faire confiance à la solidité des cryptographes. Les deux écoles réduisent les frais dans des proportions spectaculaires : là où une transaction sur la chaîne principale peut coûter des dollars, la même sur rollup se compte en centimes. Et c'est précisément pourquoi cette architecture compte pour l'Afrique : les micro-paiements, les transferts de petites sommes, les usages quotidiens redeviennent économiquement possibles.",
    },
    {
      "section_type": "build",
      "title": "Les ponts et les dangers de la circulation",
      "content": "Reste un maillon sensible dans l'architecture à deux niveaux : le passage entre les couches, appelé pont. Un pont relie la chaîne principale et une seconde couche : il verrouille tes actifs d'un côté et crée leur représentation de l'autre, que tu peux utiliser à grande vitesse ; et quand tu reviens, il te restitue les originaux. Ce mécanisme a une conséquence redoutable : à un instant donné, des fortunes considérables dorment dans les coffres des ponts, sous forme d'actifs verrouillés qui attendent leurs propriétaires. Les pirates l'ont compris : les plus grands vols de l'histoire du secteur n'ont pas attaqué les blockchains elles-mêmes, mais leurs ponts, en exploitant des défauts dans les contrats de verrouillage : des centaines de millions envolés en une nuit, plusieurs fois. D'où la question que tout usager lucide apprend à poser : de quel type de pont s'agit-il ? Les ponts les plus solides sont natifs, c'est-à-dire construits par la chaîne principale elle-même, avec ses propres garanties de sécurité. Les ponts indépendants, plus pratiques pour relier des mondes différents, ajoutent leur propre couche de confiance, avec leurs validateurs, leurs signatures, leurs clés : chaque couche ajoutée est une surface d'attaque supplémentaire. Les règles de prudence de circulation, valables pour tout usager : vérifier la nature du pont avant de l'emprunter ; ne transférer que ce qu'on est prêt à voir en transit ; tester d'abord avec un petit montant, réflexe que tu connais ; et se rappeler que les ponts récents, même brillants, n'ont pas d'historique : l'ancienneté, dans ce monde, est une preuve de survie. Leçon d'architecture générale, qui dépasse la blockchain : dans tout système, les frontières entre sous-systèmes sont les points fragiles ; les ingénieurs passent plus de temps à sécuriser les jonctions qu'à renforcer les pièces. Retiens cette loi, elle s'applique aux ponts de blockchains comme aux habits que tu portes : les coutures lâchent avant le tissu.",
    },
    {
      "section_type": "mission",
      "title": "Mission : le comparatif des frais",
      "content": "Mission d'économie appliquée : comparer les frais réels de la chaîne principale et des secondes couches, et construire ton tableau de bord. Étape un : la préparation. Munis-toi de trois sources : un explorateur public de la chaîne principale, qui affiche les frais moyens actuels des transactions ; les sites publics des principaux réseaux de seconde couche, qui publient leurs frais ; et un convertisseur de devises, pour traduire en francs CFA. Étape deux : la collecte. Note, pour un jour donné : le frais moyen d'un simple transfert sur la chaîne principale ; le même sur deux secondes couches différentes ; et le frais moyen d'un échange de jetons, souvent plus coûteux qu'un transfert. Étape trois : la conversion. Traduis chaque chiffre en francs CFA, et surtout en équivalents du quotidien : ce frais vaut combien de trajets de woro-woro ? combien de sachets d'eau ? combien de plats de maquis ? Ces équivalents rendent les chiffres parlants, et tu les retiendras mieux que des décimales. Étape quatre : l'analyse. Réponds par écrit : à partir de quel montant la chaîne principale devient-elle économiquement raisonnable ? quels usages les secondes couches rendent-elles possibles que la chaîne principale interdit de fait, par exemple les micro-paiements ? les écarts se maintiennent-ils aux heures de pointe ? Étape cinq : le suivi dans le temps. Refais la mesure une semaine plus tard, aux mêmes heures : les frais varient avec l'affluence, et un bon tableau de bord s'appuie sur des tendances, pas sur des instantanés. Livrable : un tableau comparatif d'une page, avec tes équivalents du quotidien et tes trois conclusions argumentées. Ce tableau fera de toi la personne la mieux informée de ta famille sur les vrais coûts de ces technologies : une expertise qui s'acquiert en une heure de calcul, et qui impressionnera plus d'un adulte pressé de discourir sur le sujet.",
    },
    {
      "section_type": "project",
      "title": "Projet : ton réseau à deux couches en papier",
      "content": "Projet final : construire et faire tourner un réseau à deux couches complet, en papier, pour comprendre l'architecture en la vivant. Participants : quatre joueurs minimum : un notaire, qui tient le registre officiel ; un opérateur de brouillon ; et deux usagers, Aminata et Boubacar. Étape un : la chaîne principale. Le notaire tient un cahier sacré : chaque page accepte exactement six lignes, pas une de plus, et chaque ligne coûte dix bonpoints de frais. Ce carcan volontaire, c'est la limitation des blocs. Étape deux : l'ouverture. Chaque usager dépose cent bonpoints au notaire, qui les inscrit au registre : leurs fonds vivent désormais sur la chaîne principale. Étape trois : le brouillon. L'opérateur ouvre son cahier de rollup : les usagers lui transmettent leurs transactions, il les exécute au fur et à mesure, en une seconde chacune, sans frais pour la version papier, ou un bonpoint symbolique. Étape quatre : la journée de marché. Fais vivre vingt transactions entre les deux usagers sur le brouillon : achats, ventes, remboursements, tout y passe, à grande vitesse, pendant que le notaire, lui, reste assis. Étape cinq : le dépôt du sommaire. En fin de journée, l'opérateur compte son brouillon, calcule les soldes finaux, les écrit en résumé, et présente ce sommaire au notaire avec la liste des vingt transactions. Le notaire vérifie, constate la cohérence, inscrit une seule ligne de résumé, encaisse dix bonpoints, et met à jour les soldes officiels. Compte ensemble : vingt transactions auraient coûté deux cents bonpoints sur la chaîne ; elles en ont coûté dix, au total, en passant par le brouillon. Étape six : la contestation. Boubacar prétend que l'opérateur a triché : la parade du système, c'est que le brouillon est public et vérifiable : rejouez ensemble les vingt lignes, tranchez le litige avec le sommaire, et si l'opérateur a vraiment triché, rejouez avec la règle des preuves. Débriefe : chaque rôle illustre une pièce réelle : le notaire, la chaîne principale ; l'opérateur, le rollup ; le carcan des six lignes, la limitation des blocs ; le sommaire vérifié, la preuve mathématique. Ton réseau de papier fonctionne comme ceux qui portent des milliards : même architecture, autre échelle.",
    }
  ],
  "quiz": [
    {
      "question": "Pourquoi les blockchains limitent-elles la taille de leurs blocs ?",
      "options": [
        "Pour économiser du papier",
        "Pour que des machines ordinaires partout dans le monde puissent toutes vérifier le registre",
        "Parce que internet est lent",
        "Pour faire payer plus de frais"
      ],
      "correct_index": 1,
      "explanation": "Des blocs modestes gardent le réseau vérifiable par tous, donc décentralisé : la limite est le prix de la décentralisation, pas une panne technique."
    },
    {
      "question": "Que fait principalement une solution de seconde couche ?",
      "options": [
        "Elle remplace la blockchain principale",
        "Elle traite les transactions à l'extérieur, puis scelle des résumés vérifiés sur la chaîne principale",
        "Elle efface les frais pour toujours",
        "Elle imprime plus de jetons"
      ],
      "correct_index": 1,
      "explanation": "La seconde couche déplace le travail, pas la confiance : le brouillon vit dehors, les résumés et preuves s'inscrivent dedans, sous la sécurité du notaire."
    },
    {
      "question": "Que garantit la preuve mathématique d'un rollup ?",
      "options": [
        "Que l'opérateur est riche",
        "Que le paquet de transactions respecte les règles, sans rejouer chaque transaction",
        "Que les frais augmenteront",
        "Que la chaîne principale disparaîtra"
      ],
      "correct_index": 1,
      "explanation": "La preuve compacte certifie la validité de tout le paquet : la chaîne vérifie un objet court au lieu de recalculer des milliers d'opérations, sans perdre la garantie."
    },
    {
      "question": "Pourquoi les ponts sont-ils des cibles privilégiées des pirates ?",
      "options": [
        "Parce qu'ils sont jolis",
        "Parce qu'ils verrouillent d'immenses fortunes en attente, derrière des contrats parfois défaillants",
        "Parce qu'ils sont lents",
        "Parce qu'ils n'ont pas de mots de passe"
      ],
      "correct_index": 1,
      "explanation": "Les coffres des ponts concentrent les actifs verrouillés : les plus grands vols du secteur ont visé leurs contrats de verrouillage, pas les blockchains elles-mêmes."
    },
    {
      "question": "Quel usage les secondes couches rendent-elles économiquement possible ?",
      "options": [
        "Les micro-paiements quotidiens, grâce à des frais réduits à quelques centimes",
        "Les voyages spatiaux",
        "L'impression de billets",
        "La location de satellites"
      ],
      "correct_index": 0,
      "explanation": "Des frais divisés par cent rendent enfin rentables les petits montants : transferts quotidiens, micro-paiements, usages que la chaîne principale interdit de fait."
    }
  ]
}
