export default {
  "slug": "final-project",
  "title": "Projet de programmation final",
  "description": "L'aventure de synthèse : cadre, découpe, construis, teste et livre ton premier vrai projet web complet, du cahier des charges à la présentation finale.",
  "story": "Voici l'aventure que tu attends depuis le début du monde coding : le grand projet. Seul, comme un vrai développeur, tu vas mener une application de bout en bout : cadrer le besoin, découper le travail, construire avec HTML, CSS et JavaScript, traquer les bugs, versionner ton avancée et présenter le résultat devant public. Ce que tu vas vivre ici, c'est le quotidien réel du métier. Sors ton cahier : la synthèse commence.",
  "xp_reward": 200,
  "lessons": [
    {
      "section_type": "discover",
      "title": "Le grand défi : un projet complet, de bout en bout",
      "content": "Jusqu'ici, chaque aventure t'a fait pratiquer une compétence : le HTML, le Python, JavaScript, Git, les APIs, les bases de données. Le moment est venu de tout relier. Ton défi final : construire une petite application web complète, utile à quelqu'un de réel, et la mener jusqu'à la présentation. Trois règles rendent ce projet formateur. Règle un : la petitesse est une qualité. Un projet petit mais fini vaut infiniment mieux qu'un projet ambitieux abandonné à soixante pour cent. Vise quelque chose de livrable en une dizaine de séances de travail. Règle deux : un utilisateur réel. Ta mère qui vend des gâteaux, ton cousin qui gère un kiosque, ton club de lycée, ta chorale : quelqu'un doit pouvoir dire merci, et surtout formuler des besoins concrets. Règle trois : la totalité du cycle. Pas seulement coder : cadrer, concevoir, construire, tester, versionner, présenter. C'est cette chaîne complète qui fait de toi un développeur, et non un exécutant de tutoriels. Idées de projets à ta portée, avec tes acquis : une carte de menus pour un maquis, avec plats du jour et prix ; un carnet de recettes de quartier ; un petit formulaire d'inscription pour les membres d'un club, avec liste affichée ; une page de vœux interactive pour les fêtes de fin d'année ; un quiz culturel sur la Côte d'Ivoire. Chaque idée se construit avec les mêmes briques : structure en HTML, style en CSS, interactivité en JavaScript, données rangées proprement. Choisis ton projet maintenant, note-le, et passe à la phase de cadrage : un projet sans cadrage est un projet qui dérive."
    },
    {
      "section_type": "play",
      "title": "Cadrer le projet : le cahier des charges",
      "content": "Avant toute ligne de code, écris le cahier des charges de ton projet : une page qui décrit précisément ce que tu vas construire, pour qui, et pourquoi. C'est le contrat que tu passes avec ton utilisateur, et avec toi-même. Structure ton cahier en cinq parties. Partie un, le problème : une phrase qui décrit le besoin. Exemple : la gérante du maquis n'a pas de carte en ligne, et les clients appellent tout le temps pour demander les prix. Partie deux, l'utilisateur : qui utilisera l'application, sur quel appareil. Réponse probable : un téléphone, d'où une conception mobile d'abord. Partie trois, les fonctionnalités : liste courte, au pluriel interdit. Trois fonctionnalités maximum : afficher les plats par catégorie, montrer les prix en francs CFA, indiquer les plats disponibles du jour. Tout le reste est hors périmètre, et tu l'écris noir sur blanc dans une section nommée non inclus. Partie quatre, les contenus : quelles informations l'application doit afficher, et d'où viennent-elles. Le plus simple pour un premier projet : des données rangées dans ton code JavaScript, comme un tableau de plats, facile à modifier. Partie cinq, le critère de réussite : une phrase testable. Exemple : ma tante peut trouver le prix du kedjenou en moins de dix secondes depuis son téléphone. Astuce de pro : fais valider le cahier des charges par l'utilisateur concerné avant de coder. Deux minutes de discussion maintenant t'évitent des heures de refaire plus tard. Et garde le cahier court : une page. Les cahiers de dix pages ne sont jamais relus."
    },
    {
      "section_type": "experiment",
      "title": "Découper le travail : le plan d'étapes",
      "content": "Un projet qui semble énorme devient gérable dès qu'on le découpe. Les professionnels découpent leurs projets en étapes livrables : à la fin de chaque étape, quelque chose marche, même imparfait. Voici le découpage recommandé pour ton projet, dans l'ordre. Étape un, la maquette : dessine à main levée l'écran principal et ses deux ou trois variantes. Dix minutes suffisent, et tu sauras où tu vas. Étape deux, la structure : construis la page en HTML pur, avec de vrais textes, sans aucun style. La page est moche mais complète : tous les contenus s'affichent. Étape trois, le style : applique le CSS, en suivant tes acquis du design : palette de trois couleurs, hiérarchie claire, boutons visibles. La page devient présentable sur téléphone. Étape quatre, l'interactivité : ajoute le JavaScript, une fonctionnalité à la fois : d'abord l'affichage des plats depuis le tableau de données avec la méthode map, puis le filtre par catégorie, puis la gestion du disponible ou épuisé. Étape cinq, la finition : textes relus, prix vérifiés, essais sur un vrai téléphone. Étape six, la livraison : versionner avec Git, préparer la présentation. Deux règles font vivre ce plan. Règle de la marche visible : ne passe à l'étape suivante que lorsque la précédente fonctionne, même grossièrement. Règle du retour arrière : garde chaque étape dans un commit Git, comme tu l'as appris : si tu casses tout, tu reviens en arrière sereinement. Écris ce plan à la suite de ton cahier des charges, avec une case à cocher par étape : cocher tes avancées devient ton carburant."
    },
    {
      "section_type": "build",
      "title": "Assemble toutes tes briques techniques",
      "content": "Place à la construction : voici comment tes acquis s'emboîtent dans un même projet. La structure d'abord : ton fichier HTML contient l'ossature, avec ses sections : en-tête avec le nom du maquis, zone principale où s'afficheront les plats, pied de page avec le contact. Le style ensuite : ton fichier CSS habille l'ossature : disposition en colonne pour le téléphone, cartes pour chaque plat, couleur d'accent pour les boutons. L'interactivité enfin : ton fichier JavaScript prend le relais. C'est lui qui range les données : un tableau d'objets, chaque objet un plat avec son nom, sa catégorie, son prix, son statut. C'est lui qui affiche : une fonction qui parcourt le tableau avec la méthode map et remplit la zone principale de cartes générées. C'est lui qui réagit : quand l'utilisateur appuie sur un bouton de catégorie, la fonction de filtre n'affiche que les plats correspondants ; quand la gérante change un statut dans le tableau, l'écran reflète le changement au rechargement. Ce trio HTML, CSS, JavaScript suit une règle de pro : chaque langue son rôle. Le HTML porte le contenu, le CSS porte l'apparence, le JavaScript porte le comportement. Mélanger les trois partout donne du code spaghetti impossible à corriger. Astuce pour l'erreur la plus fréquente : si rien ne réagit quand tu appuies sur un bouton, vérifie trois choses dans l'ordre : le script est-il chargé, l'écouteur d'événement est-il bien attaché à l'élément, la fonction appelée contient-elle une faute dans son nom ? Et n'oublie pas le réflexe de Git : un commit par étape qui marche, avec un message clair. À ce stade, tu n'écris plus des lignes isolées : tu orchestres un système complet, et c'est exactement le métier."
    },
    {
      "section_type": "mission",
      "title": "Mission : tester comme un professionnel",
      "content": "Une application qui marche chez toi peut planter chez ta cousine : la mission du jour est de tester, systématiquement, comme un professionnel. Premier test, le parcours de l'utilisateur : prends le rôle de l'utilisateur réel et parcours l'application du début à la fin, en notant chaque friction : un texte peu clair, un bouton trop petit pour le pouce, un prix mal aligné. Note tout, sans corriger tout de suite : d'abord la liste complète, ensuite les corrections. Deuxième test, les cas limites : essaie de faire mal faire à l'application. Que se passe-t-il si aucune catégorie ne contient de plats ? Si le tableau de données est vide ? Si un nom de plat contient un accent ou une apostrophe ? Les cas limites révèlent les vraies faiblesses, toujours. Troisième test, le multi-appareil : essaie sur un grand écran, puis sur un téléphone, puis sur un autre téléphone. Le site tient-il la route partout ? Quatrième test, le test extérieur : confie l'application à deux personnes qui n'ont pas travaillé dessus, avec une consigne simple : trouve le prix d'un plat et dis-moi ce que tu en penses. Observe-les sans intervenir, et retiens leurs hésitations : chaque hésitation est un défaut à corriger. Cinquième test, la relecture : relis tes textes à voix haute : les fautes d'orthographe décrédibilisent une application plus vite qu'un bouton mal placé. Trie ensuite ta liste de problèmes en deux colonnes : bloquant, qui empêche l'utilisation, et gênant, qui gêne sans bloquer. Corrige d'abord tous les blocages, puis ce que tu peux des gênes. Chaque correction importante mérite un commit. Un dernier état d'esprit : un bug n'est pas une honte, c'est une information. Le professionnel n'est pas celui qui ne fait jamais d'erreurs : c'est celui qui les traque méthodiquement."
    },
    {
      "section_type": "project",
      "title": "Livrer et présenter : la dernière ligne droite",
      "content": "Un projet fini cache reste un projet invisible : dernière étape du cycle, la livraison et la présentation. Trois livrables attendus. Livrable un : le code propre et versionné. Dernier commit avec un message clair ; relecture des noms de fichiers ; arborescence propre : les images dans leur dossier, les scripts ensemble. Un code rangé inspire confiance à quiconque le reprendra, y compris toi dans six mois. Livrable deux : la démonstration. Prépare une présentation de trois minutes, chronométrée, avec un plan simple : le problème, une phrase ; la solution, une démonstration en direct sur l'application, pas des captures d'écran si possible ; les choix techniques, deux phrases pour l'utilisateur curieux ; les limites et les suites possibles, une phrase honnête. Entraîne-toi à voix haute deux fois : la première sera laborieuse, la deuxième sera fluide, c'est normal. Livrable trois : le retour. Présente à ton utilisateur réel, puis à un public : ta famille, ta classe, ta communauté tech. Collecte trois retours concrets et note-les : que l'on a aimé, ce qui manque, ce qui surprend. Rien de plus formateur qu'un retour réel. Et voici la bonne nouvelle : les suites ne manquent pas. Ton projet peut grandir : ajouter un formulaire de commande, connecter une vraie base de données, publier le site en ligne sur un hébergement gratuit, utiliser les APIs découvertes dans une autre aventure. Chaque suite devient un prochain projet. Termine cette aventure par un geste symbolique : écris en bas de ton cahier de charges la date de livraison, et signe. Tu viens de boucler ton premier cycle complet de développement. Le monde coding t'a donné les briques ; désormais, tu construis. Que construiseras-tu ensuite ?"
    }
  ],
  "quiz": [
    {
      "question": "Pourquoi viser un petit projet plutôt qu'un projet ambitieux ?",
      "options": [
        "Parce que les petits projets sont plus jolis",
        "Parce qu'un projet petit mais terminé vaut mieux qu'un projet ambitieux abandonné en route",
        "Parce que les grands projets sont interdits",
        "Pour dépenser moins de forfait internet"
      ],
      "correct_index": 1,
      "explanation": "La règle d'or du premier projet : viser le livrable. Finir un projet complet enseigne le cycle réel, abandonner un géant n'enseigne que la frustration."
    },
    {
      "question": "Que contient le cahier des charges d'un projet ?",
      "options": [
        "Le code source complet",
        "Le problème, l'utilisateur, les fonctionnalités, les contenus et le critère de réussite",
        "La liste de tous les langages de programmation",
        "Uniquement le budget"
      ],
      "correct_index": 1,
      "explanation": "Une page suffit : problème en une phrase, utilisateur ciblé, trois fonctionnalités maximum, sources des contenus, et un critère de réussite testable."
    },
    {
      "question": "Dans le trio HTML, CSS, JavaScript, quel est le rôle du JavaScript ?",
      "options": [
        "Porter le contenu de la page",
        "Porter l'apparence de la page",
        "Porter le comportement : affichage dynamique des données, réactions aux clics",
        "Remplacer les deux autres"
      ],
      "correct_index": 2,
      "explanation": "Chaque langue son rôle : HTML pour le contenu, CSS pour l'apparence, JavaScript pour le comportement et les données dynamiques."
    },
    {
      "question": "Pourquoi faire un commit Git à chaque étape qui marche ?",
      "options": [
        "Pour économiser la batterie",
        "Pour garder un point de retour en arrière si une étape casse le projet",
        "Parce que Git refuse les gros fichiers",
        "Pour impressionner les recruteurs uniquement"
      ],
      "correct_index": 1,
      "explanation": "Chaque commit est une photographie saine du projet : en cas de casse, on revient à l'étape précédente sereinement, sans perdre le travail accompli."
    },
    {
      "question": "Que révèlent les tests de cas limites sur une application ?",
      "options": [
        "La couleur des boutons",
        "Les vraies faiblesses : liste vide, texte manquant, catégorie sans plats",
        "La vitesse du téléphone",
        "Le prix de l'hébergement"
      ],
      "correct_index": 1,
      "explanation": "Chercher à faire mal tourner l'application, avec des données vides ou inattendues, expose les faiblesses que le parcours idéal ne montre jamais."
    }
  ]
}
