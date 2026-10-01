export default {
  "slug": "api-basics",
  "title": "Les APIs expliquées",
  "description": "Comprends enfin les APIs : comment les applications se parlent entre elles, du menu du restaurant au format JSON, et interroge une vraie API météo.",
  "story": "Quand tu vérifies la météo, ton solde mobile money ou les résultats de foot, ton application ne contient pas ces informations : elle va les demander ailleurs, à une API. Chaque application que tu adores est en réalité une bande d'applications qui se parlent en coulisses. Prépare-toi à comprendre la conversation : après cette aventure, tu sauras décoder ce qui se passe derrière chaque écran de chargement.",
  "xp_reward": 120,
  "lessons": [
    {
      "section_type": "discover",
      "title": "Une API, c'est un serveur qui prend les commandes",
      "content": "Imagine un maquis très organisé. Toi, client, tu ne rentres pas dans la cuisine : tu regardes le menu, tu passes commande au comptoir, et la cuisine te renvoie ton plat. Une API fonctionne exactement ainsi. API signifie interface de programmation d'application : c'est un service auquel une application envoie une demande précise, et qui répond avec exactement l'information demandée. Quand ton application météo affiche trente degrés à Abidjan, elle ne devine rien : elle envoie une demande à l'API d'un service météo, et celui-ci renvoie les données. Pourquoi ce système est-il génial ? Parce que chaque équipe se concentre sur son talent : le service météo entretient ses capteurs et ses calculs, l'application se concentre sur son écran. Ils n'ont même pas besoin de se connaître : l'API définit une fois pour toutes le menu, c'est-à-dire la liste des demandes possibles et le format des réponses. Ce menu s'appelle la documentation de l'API : c'est le document que lit tout développeur avant de commencer. Grâce aux APIs, une petite équipe peut construire une application en réutilisant des services puissants : cartes, paiements, météo, messages. C'est pour cela que les APIs sont le plombier et l'électricien du web : invisibles, mais partout. Dans cette aventure, tu apprends à passer commande, à lire les réponses, et même à construire ta première demande de données."
    },
    {
      "section_type": "play",
      "title": "Requêtes et réponses : le dialogue qui se répète",
      "content": "Chaque conversation avec une API suit le même rituel en quatre temps. Temps un : ton application envoie une requête, c'est-à-dire un message qui dit trois choses : où frapper, l'adresse de l'API ; quoi faire, le type de la demande ; et parfois des détails, comme la ville dont tu veux la météo. Temps deux : l'API réfléchit, parfois en quelques millisecondes. Temps trois : l'API renvoie une réponse avec deux parties : un code de statut, qui résume comment s'est passée la demande, et le contenu, les données demandées. Temps quatre : ton application lit la réponse et met l'écran à jour. Les codes de statut se lisent comme des compte-rendus : le code deux cents signifie tout va bien, voici tes données ; le code quatre cent quatre, introuvable, signifie que l'adresse demandée n'existe pas ; le code quatre cent un signifie que tu n'es pas autorisé, il manque une identification ; le code cinq cents signifie que le serveur a un problème, réessaie plus tard. Tu as déjà croisé ces codes déguisés : l'écran d'erreur d'un site affiche souvent quatre cent quatre. Comprendre ce rituel t'évite des heures de confusion : quand une application plante, le développeur regarde d'abord quel code de statut l'API a renvoyé. C'est le premier réflexe de diagnostic, avant même de lire le contenu. Exercice mental : décris la requête et la réponse attendue pour obtenir le solde d'un compte mobile money."
    },
    {
      "section_type": "experiment",
      "title": "Le JSON : la langue commune des applications",
      "content": "Il reste un détail crucial : sous quelle forme l'API renvoie-t-elle ses données ? La réponse, presque toujours, c'est le JSON, un format de texte structuré que tous les langages comprennent. Le JSON ressemble furieusement au JavaScript que tu connais : des accolades délimitent un objet, à l'intérieur des paires clé et valeur, comme ville deux-points Abidjan, température deux-points trente. Les objets s'imbriquent et se rangent dans des listes avec des crochets : la météo du jour est un objet, les prévisions de la semaine une liste d'objets. Ce format a trois qualités : il est lisible par un humain, il est interprétable par tous les langages de programmation, et il est compact, donc rapide à envoyer, même avec un petit forfait internet. Exemple concret de réponse d'API météo, décrite en mots : un objet avec la clé ville de valeur Abidjan, la clé temperature de valeur trente, et la clé humidite de valeur quatre-vingts. Un programmeur JavaScript n'a rien à décoder : il reçoit déjà un objet utilisable, et accède aux valeurs par leurs clés avec le point. Même chose en Python, qui transforme le texte en dictionnaire. C'est toute l'élégance du JSON : les données voyagent comme du texte simple, et arrivent prêtes à l'emploi. Exercice : imagine la réponse JSON d'une API de résultats de foot : quelles clés placerais-tu pour un match ? Équipe à domicile, équipe extérieure, score, minute. Tu viens de concevoir ta première structure de données."
    },
    {
      "section_type": "build",
      "title": "Les clés API : ton badge d'accès personnel",
      "content": "Toutes les APIs ne laissent pas entrer n'importe qui. La plupart exigent une clé API, une longue chaîne de caractères unique, qui joue le rôle de ton badge nominatif. La clé sert à trois choses : identifier qui fait la demande, compter l'usage, et refuser les indésirables. Quand tu t'inscris sur le site d'un fournisseur d'API, il te délivre une clé avec des limites d'usage, par exemple mille demandes gratuites par jour. Chaque demande part avec ta clé, et le fournisseur décompte. Règle de sécurité absolue : une clé API est un secret. Ne l'écris jamais dans un message WhatsApp, ne la publie jamais dans ton code envoyé sur un dépôt public, ne la prête jamais. Une clé volée, c'est quelqu'un qui consomme ton quota, voire qui fait des actions en ton nom. La bonne pratique des professionnels : ranger la clé dans une variable d'environnement, hors du code, et ne jamais copier le fichier qui la contient. Si une clé fuite, la plupart des fournisseurs permettent de la révoquer, c'est-à-dire de la rendre immédiatement invalide, et d'en générer une nouvelle. Autre notion utile : certaines informations ne doivent pas partir dans une requête. Une API météo demande une ville, pas ton nom. Le réflexe du développeur : envoyer le minimum de données nécessaires. Dans ce monde numérique, la donnée voyage vite, mais le badge perdu voyage plus vite encore. Garde ta clé comme ton code de recharge le plus précieux : personnelle, secrète, rechargeable."
    },
    {
      "section_type": "mission",
      "title": "Mission : traque les APIs de ta journée",
      "content": "Mission d'observation : pendant une journée entière, note chaque fois qu'une application de ton téléphone parle probablement à une API. Le matin : ton application météo interroge l'API du service météo national ou mondial. Le prix du trajet en ligne ? L'application demande l'itinéraire à une API de cartes et le tarif à une API du service de transport. À midi : tu consultes les réseaux sociaux ; chaque fil d'actualité est une cascade de demandes, une pour les publications, une pour les notifications, une pour les messages. L'après-midi : un paiement mobile money vérifie ton solde et confirme la transaction, deux échanges d'API au moins. Le soir : un match en direct affiche le score minute par minute : l'application interroge l'API sportive toutes les trente secondes. Pour chaque cas, note trois choses : l'application, l'information affichée, et l'API probable derrière. Puis classe tes observations en deux colonnes : les informations qui changent souvent, score, solde, météo, et celles qui changent rarement, le menu d'un restaurant par exemple. Tu comprendras pourquoi certaines applications rafraîchissent sans arrêt : elles refont des requêtes en permanence. Cette mission t'installe la vision système : derrière chaque écran, un dialogue requête réponse se joue en silence. Le développeur qui voit ce dialogue imagine des applications qui combinent plusieurs APIs : la météo plus la carte, le paiement plus le message de confirmation. Demain, ces idées seront les tiennes."
    },
    {
      "section_type": "project",
      "title": "Projet : interroge une vraie API météo",
      "content": "Place à la pratique : tu vas interroger une vraie API, sans rien installer, grâce à un outil que tout développeur connaît : le navigateur. Beaucoup d'APIs publiques acceptent des demandes simples par adresse web : tu écris l'adresse de l'API avec les paramètres dans la barre d'adresse, et le navigateur affiche la réponse JSON brute. Trouve dans la documentation d'une API météo gratuite l'adresse de demande, appelée point d'accès, souvent le mot anglais endpoint, et repère comment passer le nom de ta ville, souvent après un point d'interrogation. Tape l'adresse complète avec Abidjan, et observe : la réponse JSON s'affiche, avec les clés température, humidité, description. Si la réponse est illisible en un bloc, sers-toi d'un formateur JSON en ligne gratuit pour l'indenter. Ensuite, trois défis progressifs. Défi un : repère dans le JSON la valeur de la température du jour et note son chemin exact, par exemple objet principal, clé actuelle, clé temperature. Défi deux : demande la météo d'une autre ville, par exemple Dakar ou Douala, en changeant le paramètre, et compare les réponses. Défi trois : rédige en une phrase, pour un ami, la météo du jour à partir du JSON, en français clair : tu viens de faire le travail que fait l'application météo. Pour aller plus loin, cherche une API gratuite sur les devises ou les blagues et recommence le rituel : documentation, point d'accès, paramètres, lecture du JSON. Ce rituel est universel : il est identique chez tous les fournisseurs d'API du monde."
    }
  ],
  "quiz": [
    {
      "question": "Qu'est-ce qu'une API ?",
      "options": [
        "Un service auquel une application envoie des demandes et qui répond avec les données",
        "Un écran d'affichage pour téléphones",
        "Une sorte de batterie externe",
        "Un langage de programmation"
      ],
      "correct_index": 0,
      "explanation": "Une API prend des demandes précises et renvoie des données précises, comme un comptoir de maquis : on ne rentre pas dans la cuisine."
    },
    {
      "question": "Que signifie un code de statut deux cents dans une réponse d'API ?",
      "options": [
        "Le serveur est en maintenance",
        "La demande a réussi et les données sont fournies",
        "L'adresse demandée n'existe pas",
        "Ta clé API a expiré"
      ],
      "correct_index": 1,
      "explanation": "Le code deux cents, deux cent un ou deux cent quatre signale le succès. Quatre cent quatre, c'est introuvable ; cinq cents, un souci côté serveur."
    },
    {
      "question": "Pourquoi le format JSON est-il la langue commune des applications ?",
      "options": [
        "Il est lisible, compact et compréhensible par tous les langages de programmation",
        "Il ne fonctionne que sur ordinateur",
        "Il est obligé par la loi",
        "Il traduit automatiquement les langues"
      ],
      "correct_index": 0,
      "explanation": "Le JSON combine lisibilité humaine, compacité et interprétation universelle : idéal pour voyager sur les réseaux, même avec un petit forfait."
    },
    {
      "question": "Comment traiter une clé API comme un professionnel ?",
      "options": [
        "La partager avec ses amis de classe",
        "La garder secrète, hors du code, dans une variable d'environnement",
        "L'afficher fièrement dans sa biographie",
        "L'envoyer par message à chaque utilisation"
      ],
      "correct_index": 1,
      "explanation": "Une clé API est un badge nominatif secret : on la range hors du code, on ne la publie jamais, et on la révoque immédiatement en cas de fuite."
    },
    {
      "question": "Pourquoi une application de score en direct fait-elle des requêtes répétées ?",
      "options": [
        "Pour vider la batterie du téléphone",
        "Parce que l'information change souvent et doit être rafraîchie sans arrêt",
        "Parce que l'API refuse de répondre",
        "Pour compter les utilisateurs"
      ],
      "correct_index": 1,
      "explanation": "Les données qui changent souvent, comme un score, exigent des requêtes fréquentes pour que l'écran reste à jour, alors qu'un menu change rarement."
    }
  ]
}
