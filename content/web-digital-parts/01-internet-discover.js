export default {
  "slug": "internet-discover",
  "title": "L'aventure d'Internet",
  "description": "Plonge dans les coulisses du plus grand réseau du monde : serveurs, câbles sous-marins, paquets de données. Comprends ce qui se passe vraiment quand tu ouvres une page depuis Abidjan.",
  "story": "Tu regardes une vidéo sur ton téléphone à Abidjan. Une seconde plus tard, des images arrivent depuis un serveur situé à des milliers de kilomètres. Comment est-ce possible ? Dans cette aventure, tu vas suivre le voyage secret des données, traverser des câbles sous l'océan et découvrir la magie invisible qui relie des milliards de personnes.",
  "xp_reward": 100,
  "lessons": [
    {
      "section_type": "discover",
      "title": "Comment Internet relie le monde",
      "content": "Internet est un réseau de réseaux : des millions d'appareils connectés entre eux partout sur la planète. Quand tu envoies un message WhatsApp, il ne voyage pas d'un seul bloc. Il est découpé en petits paquets de données, comme un puzzle. Chaque paquet prend éventuellement une route différente, à travers des machines appelées routeurs, puis tout se réassemble chez le destinataire. Les continents sont reliés par des câbles sous-marins posés au fond des océans : presque tout le trafic mondial passe par ces câbles, pas par satellite ! Ton fournisseur d'accès, en Côte d'Ivoire comme ailleurs, te connecte à ce réseau géant. Chaque appareil connecté possède une adresse, appelée adresse IP, comme une adresse postale pour les données."
    },
    {
      "section_type": "play",
      "title": "Le jeu des paquets",
      "content": "Jouons au voyage d'un message. Découpe une phrase en petits papiers, un ou deux mots par papier : ce sont tes paquets. Demande à trois camarades de jouer les routeurs, placés en ligne entre toi et un destinataire. Chaque papier passe de main en main, mais tu décides à chaque fois par quel camarade il passe, en changeant parfois de chemin. Une fois tous les papiers arrivés, le destinataire remet la phrase dans l'ordre : c'est la réassemblage des paquets. Si un papier se perd, demande-le à nouveau au seul expéditeur : c'est exactement ce que fait Internet quand un paquet n'arrive pas. Tu viens de rejouer, en vrai, le cœur du réseau mondial."
    },
    {
      "section_type": "experiment",
      "title": "Piste la route d'une page web",
      "content": "Expérimentons pour voir le réseau de tes propres yeux. 1) Sur un ordinateur, ouvre une invite de commande et tape : ping wikipedia.org puis Entrée. Tu vois des réponses avec un temps en millisecondes : c'est le temps d'aller-retour de tes paquets vers le serveur. 2) Si tu es sur smartphone, active le mode avion cinq secondes : plus rien ne charge. Rien n'est cassé, mais ta porte d'entrée vers le réseau vient de se fermer. 3) Relance la connexion et recharge une page en comptant : avant même d'afficher le site, ton appareil a demandé son adresse au réseau, puis téléchargé le contenu par paquets. Note dans un carnet ce que tu observes : le ping le plus rapide, le plus lent, et ce que le mode avion a bloqué exactement."
    },
    {
      "section_type": "build",
      "title": "Construis la carte de ton Internet",
      "content": "Construis le plan du réseau tel qu'il existe chez toi. Prends une feuille et dessine au centre ta box internet ou le hotspot de ton téléphone. Autour, dessine tous les appareils qui s'y connectent : téléphones, ordinateur, télévision, console. Chaque appareil reçoit une petite étiquette avec une adresse IP inventée, par exemple 192.168.1.10, 192.168.1.11 : toutes différentes, comme dans un vrai réseau. Puis dessine la suite du voyage : ta box, puis le fournisseur d'accès, puis un câble qui plonge vers l'océan, puis un serveur lointain où sont stockées tes vidéos. Termine en traçant en couleur le trajet exact d'un message qui part de ton téléphone vers ce serveur. Montre ta carte : n'importe qui doit pouvoir suivre le trajet du doigt sans explication supplémentaire."
    },
    {
      "section_type": "mission",
      "title": "Mission : enquête sur ton quartier",
      "content": "Ta mission d'explorateur : découvrir comment Internet travaille autour de toi. Choisis trois lieux différents, par exemple un cybercafé, une boutique qui utilise le mobile money et un taxi-moto qui utilise une application de course. Pour chaque lieu, mène une mini-enquête : à quoi sert Internet ici ? Grâce à quoi la connexion passe ? Que se passerait-il si la connexion tombait une journée ? Note les réponses dans un tableau : lieu, usage, risque si panne. Tu vas découvrir que derrière chaque paiement Wave ou Orange Money, chaque appel WhatsApp, il y a tout le voyage que tu viens d'apprendre : paquets, routeurs, câbles et serveurs. Ta rue est une autoroute de données sans le montrer."
    },
    {
      "section_type": "project",
      "title": "Projet : le réseau qui t'entoure",
      "content": "Pour clore l'aventure, crée un petit guide illustré : Internet autour de moi. Sur une ou deux pages : dessine ou décris le voyage d'un message de ton quartier vers l'autre bout du monde, raconte ce que tu as appris dans ton enquête sur les trois lieux, et ajoute une section conseil pour les débutants : comment bien utiliser sa connexion, éviter de saturer un forfait data, choisir le bon moment pour télécharger. Ajoute enfin cinq questions de quiz que tu inventes, avec leurs réponses, et fais passer le quiz à deux personnes de ta famille. Garde ce guide : il deviendra le premier objet de ton portfolio numérique d'explorateur."
    }
  ],
  "quiz": [
    {
      "question": "Comment un message voyage-t-il sur Internet ?",
      "options": ["En un seul bloc, comme une lettre", "Découpé en paquets qui se réassemblent à l'arrivée", "Par satellite uniquement", "Il ne voyage pas, il est recopié à la main"],
      "correct_index": 1,
      "explanation": "Les données sont découpées en petits paquets qui prennent des routes différentes puis se réassemblent chez le destinataire."
    },
    {
      "question": "Quelle entreprise fournit ton accès à Internet ?",
      "options": ["Un moteur de recherche", "Un réseau social", "Un fournisseur d'accès Internet", "Le magasin où tu as acheté ton téléphone"],
      "correct_index": 2,
      "explanation": "Le fournisseur d'accès Internet, souvent appelé FAI, est l'entreprise qui te connecte au réseau mondial, que ce soit par fibre, par 4G ou par câble."
    },
    {
      "question": "Comment les continents sont-ils principalement reliés ?",
      "options": ["Par des câbles sous-marins", "Uniquement par satellites", "Par des ballons stratosphériques", "Par des tourterelles voyageurs"],
      "correct_index": 0,
      "explanation": "La grande majorité du trafic mondial passe par des câbles posés au fond des océans, extrêmement rapides et fiables."
    }
  ]
};
