export default {
  "slug": "wallet-security",
  "title": "Sécurité des wallets",
  "description": "Apprends à protéger un portefeuille numérique comme un pro : clés privées, phrases secrètes, portefeuilles chauds et froids, et le protocole anti-arnaque complet.",
  "story": "Un portefeuille numérique, c'est un trésor sans serrure physique : ta clé privée en est l'unique clé, et si elle tombe entre de mauvaises mains, aucun service client, aucun banquier, aucun gendarme ne peut annuler la transaction. D'où cette vérité : dans le monde blockchain, la sécurité n'est pas une option, c'est la compétence fondamentale. Dans cette aventure, tu apprends tout : comment fonctionnent les portefeuilles, comment on les vole, et surtout, comment on les rend quasi inviolables.",
  "xp_reward": 140,
  "lessons": [
    {
      "section_type": "discover",
      "title": "Ton portefeuille, ta seule banque",
      "content": "Un portefeuille numérique, souvent appelé wallet par l'anglais, n'a rien d'un sac : c'est un outil qui garde tes clés. Précisons le vocabulaire, car tout le reste en dépend. Ta clé privée, c'est le secret ultime : un code que toi seul dois connaître, et qui prouve que tu es le propriétaire des fonds associés à ton adresse. Ta clé publique et ton adresse, c'est la même information sous deux formes : à donner pour recevoir, visible par tous, inoffensive. Ta phrase secrète, souvent appelée phrase de récupération, c'est la forme humaine de ta clé privée : une suite de douze ou vingt-quatre mots simples, dans un ordre précis, qui régénère ta clé privée partout où tu la saisis. Retiens la règle des trois niveaux : l'adresse, à partager ; la clé privée et la phrase secrète, à ne jamais partager avec personne, jamais, ni famille, ni ami, ni prétendu service client. Pourquoi cette sévérité ? Parce que la transaction signée avec ta clé est irréversible : il n'y a ni opposition de carte, ni réclamation, ni assurance : celui qui signe avec ta clé est, aux yeux de la blockchain, toi. Deuxième conséquence : ton portefeuille, c'est aussi ta responsabilité d'adulte avant l'heure : le garder, c'est comme garder les clés de la maison, sauf que la maison, ici, se vide entièrement en une signature. Troisième conséquence, positive celle-là : bien protégé, un portefeuille est d'une robustesse remarquable : pas de banque à faire faillir, pas de carte à cloner, pas de guichet à braquer : la sécurité repose sur des mathématiques et ta discipline. Cette aventure t'installe justement cette discipline, réflexe après réflexe, pour toi, et pour accompagner les adultes de ton entourage.",
    },
    {
      "section_type": "play",
      "title": "Chaud, froid : les deux familles de portefeuilles",
      "content": "Tous les portefeuilles ne protègent pas pareil : la première distinction à maîtriser est celle du chaud et du froid. Le portefeuille chaud : une application sur téléphone ou ordinateur, connectée à internet, pratique pour envoyer et recevoir au quotidien. Sa faiblesse suit sa force : la clé privée vit sur un appareil connecté, donc exposé aux virus, aux faux logiciels, aux écrans espions : un téléphone infecté peut lire la clé et vider le portefeuille sans violence. On ne garde dans un chaud que le nécessaire de tous les jours, comme l'argent de poche du jour de marché. Le portefeuille froid : la clé privée vit hors ligne, sur un appareil dédié, souvent une petite carte électronique verrouillée, ou même sur papier dans un coffre, ce qu'on appelle le portefeuille papier. Pour signer une transaction, l'appareil cold exige une pression physique du doigt : un pirate à des milliers de kilomètres peut bien infecter ton ordinateur, sans l'appareil entre ses mains, il ne peut rien signer. Le froid, c'est le coffre du foyer : on y garde l'essentiel, et on n'y touche que rarement. La bonne architecture, celle des utilisateurs avertis, combine les deux : un chaud modeste pour les usages courants, et un froid pour le reste, avec des séparations strictes. Trois règles transversales complètent le tableau. Règle de provenance : ne télécharge un portefeuille que depuis le site officiel, vérifié, jamais depuis un lien reçu par message. Règle de petits montants : tout nouveau portefeuille, toute nouvelle pratique se teste d'abord avec une somme minuscule, que l'on envoie, puis que l'on récupère, avant d'engager quoi que ce soit de sérieux. Règle de double contrôle : toute adresse de destination se vérifie caractère par caractère, et le premier envoi vers un nouveau destinataire reste modeste. Ces trois réflexes valent d'ailleurs pour tous les portefeuilles du monde, chauds comme froids."
    },
    {
      "section_type": "experiment",
      "title": "La phrase secrète : le trésor en douze mots",
      "content": "Zoom sur l'objet le plus sensible de l'écosystème : ta phrase secrète. Douze ou vingt-quatre mots, choisis dans un dictionnaire standard par ton portefeuille, au moment de sa création : leur ordre exact régénère ta clé privée, et donc l'accès à tout ton portefeuille. Comprends bien le mécanisme : la phrase ne se stocke nulle part en ligne ; elle n'est montrée qu'une fois, à la création ; celui qui la possède recrée ta clé sur n'importe quel portefeuille du monde, sans mot de passe, sans code, sans question : il est toi. Comment la protéger ? Les bonnes pratiques, apprises des malheurs des autres. Un, l'écrire à la main, au stylo sur papier, jamais en photo, jamais dans une note de téléphone, jamais dans un courriel, jamais dans un message : tout support numérique connecté est une fuite en sursis. Deux, garder le papier hors de toute vue : pas de photo, pas de lecture à voix haute devant d'autres, pas de mots écrits au dos d'un document que l'on montre. Trois, préférer deux copies en deux lieux sûrs différents, contre le feu et la perte, éventuellement en deux morceaux séparés pour les plus prudents. Quatre, réfléchir à la succession : les adultes avisés informent une personne de confiance de l'existence du coffre, sinon leurs héritiers ne retrouveront jamais l'accès. Et maintenant, les attaques qui ciblent la phrase, à reconnaître absolument : le faux service client qui appelle ou écrit pour vérifier votre phrase ; le faux site de portefeuille qui demande de saisir la phrase pour restaurer un compte soi-disant bloqué ; le faux employé d'une société connue qui propose de la taper pour vous ; l'appareil de portefeuille trafiqué, reçu d'un inconnu avec une feuille de phrase déjà préremplie : c'est le piège complet, tendu d'avance. Toute demande de phrase est une attaque, à cent pour cent, sans exception : c'est la phrase que tu répéteras aux adultes de ta famille, et elle vaut son poids en café."
    },
    {
      "section_type": "build",
      "title": "La panoplie des attaques : savoir pour reconnaître",
      "content": "Cartographions les attaques réelles contre les portefeuilles, pour que chacune te soit familière avant de la rencontrer. Le hameçonnage, le plus fréquent : un message urgent, par courriel, SMS ou messagerie, imitant une entreprise connue, vous conduisant vers un site jumeau qui aspire identifiants et phrase ; la parade : ne jamais suivre un lien reçu, toujours taper soi-même l'adresse officielle, et se méfier de toute urgence. Le faux support : les escrocs épluchent les réseaux publics, écrivent aux utilisateurs qui posent une question, se prétendent du service d'assistance, et exigent la phrase ou un accès à distance ; la parade : aucun service sérieux ne répond en privé aux messages publics, ni ne demande de phrase. La drague de la connexion : sur les sites de finance décentralisée, une demande de connexion malveillante n'est pas un vol en soi : elle attend que vous signiez ; la parade : lire toute demande de signature, refuser les demandes incompréhensibles, ne jamais signer à la va-vite, et vérifier le site avant de connecter son portefeuille. Le logiciel espion : applications truquées, claviers modifiés, extensions de navigateur pirates : la parade : installations minimales, sources officielles, appareils propres. L'attaque physique et sociale : un proche, un technicien, un admirateur qui obtient un accès momentané à l'appareil déverrouillé ; la parade : verrouillage systématique, et séparation entre l'appareil du quotidien et celui des affaires sérieuses. Le piège à dessin, le plus retors : une transaction modifiée à votre insu, souvent un contrat qui se donne le droit de vider le portefeuille à tout moment ; la parade : la règle du portefeuille dédié : toute interaction avec un service inconnu se fait depuis un portefeuille jetable, contenant le strict nécessaire. La synthèse de cette panoplie : la quasi-totalité des vols repose sur l'ingénierie sociale, la manipulation des personnes, plus que sur la casse des mathématiques. Ta clé ne se craque pas, elle se fait raconter : d'où la dernière ligne de défense, toi, formé et méfiant au bon endroit."
    },
    {
      "section_type": "mission",
      "title": "Mission : le protocole de sécurité familiale",
      "content": "Mission de sécurité : bâtir et faire vivre le protocole de sécurité des portefeuilles pour ton entourage, car les adultes sont les cibles les plus visées. Étape un : l'audit des habitudes. Interroge discrètement, sans exposer qui que ce soit, les habitudes numériques de ta famille : qui utilise des applications financières ? qui clique sur les liens des messages ? qui utiliserait le même mot de passe partout ? dresse un état des lieux sans jugement. Étape deux : la rédaction du protocole. Une page, en langage clair, affichée et partagée, avec les dix règles d'or : ne jamais partager sa phrase secrète ; ne jamais suivre un lien reçu ; taper soi-même les adresses des sites ; vérifier chaque adresse de destinataire ; ne jamais signer ce qu'on ne comprend pas ; tester à blanc tout nouveau service ; garder l'essentiel hors ligne ; verrouiller ses appareils ; se méfier de l'aide non sollicitée ; et en cas de doute, ne rien faire, puis demander à un dépanneur de confiance. Étape trois : la répétition. Un protocole non répété ne sert à rien : organise une séance familiale de dix minutes, raconte les attaques réelles comme des histoires, fais réciter les règles à voix haute, et invente un signal familial, un mot convenu, pour toute demande d'argent urgent par téléphone. Étape quatre : le test de résistance. Avec l'accord des adultes, simule une tentative d'arnaque bénigne : un message fictif demandant une information sensible, envoyé par un complice : comptez qui y répond et qui résiste, puis débriefez sans moquerie, en félicitant les vigilants et en corrigeant les réflexes défaillants. Étape cinq : le suivi. Le protocole se relit chaque trimestre, comme on vérifie les extincteurs : les attaques évoluent, les règles s'ajustent. Cette mission n'a rien d'un exercice scolaire : dans plusieurs familles, une seule règle bien ancrée a évité des pertes équivalant à des années d'économies : ton protocole peut être ce mur.",
    },
    {
      "section_type": "project",
      "title": "Projet : le coffre-fort de cour",
      "content": "Projet final : construire et faire vivre un coffre-fort de documents familial, selon les principes du froid et de la séparation, exercice complet sans aucun actif réel. Étape un : le contenu. Avec les adultes, listez les documents précieux de la famille : actes, diplômes, titres, photos irremplaçables, mots de passe des comptes importants écrits en clair, et pour les familles qui en détiennent, la mention de l'existence d'un portefeuille numérique et de sa phrase, sans inscrire la phrase en clair sur la même feuille. Étape deux : le triple exemplaire. Chaque document critique existe en trois versions : une originale rangée au coffre, une copie numérique chiffrée sur deux supports distincts, une copie de travail à disposition courante. C'est la règle du trois-deux-un que suivent les professionnels : trois copies, deux supports différents, une hors du domicile. Étape trois : la séparation. Répartissez les lieux : le domicile pour la copie courante, un parent de confiance pour la première copie, un coffre bancaire ou une boîte scellée chez un second tiers pour la troisième ; notez les lieux dans un petit carnet que gardent deux personnes différentes. Étape quatre : la restauration, le test qui révèle tout : prélevez un document au hasard et chronométrez le temps de récupération : si la famille met un jour à retrouver un acte de naissance, le système rate son but ; simplifiez jusqu'à ce que chaque document se récupère en moins de dix minutes. Étape cinq : la succession. Rédigez la lettre d'accès : où sont les choses, qui détient quoi, que faire si un titulaire disparaît ; une page, reluée par tous, datée. Étape six : la maintenance trimestrielle : un quart d'heure, trois fois par an, pour ajouter les nouveaux documents, retirer l'obsolète, et vérifier les copies. Ce projet transfère au monde réel les principes du portefeuille froid : séparation, hors ligne, redondance, test de restauration, succession ; et il rend à ta famille un service que peu de familles ont : la certitude de retrouver l'essentiel, quoi qu'il arrive.",
    }
  ],
  "quiz": [
    {
      "question": "Que faut-il ne jamais partager avec quiconque ?",
      "options": [
        "Ton adresse publique de portefeuille",
        "Ta clé privée et ta phrase secrète de récupération",
        "Le nom de ton opérateur téléphonique",
        "Ta couleur préférée"
      ],
      "correct_index": 1,
      "explanation": "L'adresse se partage pour recevoir ; la clé privée et la phrase secrète ne se partagent jamais : celui qui les possède est, aux yeux de la blockchain, toi."
    },
    {
      "question": "Quelle est la différence entre un portefeuille chaud et un portefeuille froid ?",
      "options": [
        "Le chaud est rouge, le froid est bleu",
        "Le chaud reste connecté à internet, pratique mais exposé ; le froid garde la clé hors ligne, comme un coffre",
        "Le chaud coûte plus cher",
        "Le froid ne peut rien envoyer, jamais"
      ],
      "correct_index": 1,
      "explanation": "Chaud : connecté, pour le quotidien, avec l'essentiel limité. Froid : hors ligne, parfois sur appareil dédié à bouton, pour l'essentiel des avoirs."
    },
    {
      "question": "Comment conserver correctement sa phrase secrète de récupération ?",
      "options": [
        "En photo sur le téléphone, pour ne pas l'oublier",
        "Écrite à la main sur papier, gardée hors de vue, en plusieurs exemplaires sûrs",
        "Envoyée à soi-même par courriel",
        "Publiée sur les réseaux, avec un mot-dièse"
      ],
      "correct_index": 1,
      "explanation": "Papier, stylo, discrétion, plusieurs lieux : tout support numérique connecté est une fuite en sursis, et toute demande de phrase est une attaque, à cent pour cent."
    },
    {
      "question": "Comment réagir face à un prétendu service client qui demande de l'aide à distance ?",
      "options": [
        "On accepte, c'est le service client",
        "On refuse tout, on coupe la conversation, et on contacte soi-même le service par un canal officiel",
        "On donne la phrase pour aller plus vite",
        "On partage son écran et on attend"
      ],
      "correct_index": 1,
      "explanation": "Aucun service sérieux ne répond en privé aux messages publics ni ne demande une phrase : la règle est de couper, puis de vérifier par soi-même via le canal officiel."
    },
    {
      "question": "Que dit la règle du trois-deux-un des sauvegardes ?",
      "options": [
        "Trois mots de passe, deux téléphones, un seul compte",
        "Trois copies des données critiques, sur deux types de supports, dont une hors du domicile",
        "Trois jours de délai, deux essais, une seule question",
        "Trois portefeuilles, deux blockchains, une clé"
      ],
      "correct_index": 1,
      "explanation": "La règle professionnelle de robustesse : trois copies pour la redondance, deux supports contre la panne commune, un lieu externe contre l'incendie et le vol."
    }
  ]
}
