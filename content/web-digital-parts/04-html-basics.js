export default {
  "slug": "html-basics",
  "title": "HTML : les fondations",
  "description": "Apprends la langue dans laquelle sont écrites toutes les pages du web. Balises, titres, liens, images : à la fin de cette aventure, tu auras construit ta première page web de tes propres mains.",
  "story": "Devant chaque site web que tu visites se cache une langue secrète : le HTML. Sans elle, pas de page, pas de bouton, pas de vidéo. Bonne nouvelle : c'est une langue très simple, inventée pour être lue par les machines et écrite par les humains. Dans cette aventure, tu vas apprendre à assembler les briques d'une page web, comme un maçon construit une maison, brique par brique. À la fin, ta première page vivra dans un navigateur. Prêt à poser ta première brique ?",
  "xp_reward": 130,
  "lessons": [
    {
      "section_type": "discover",
      "title": "Les briques invisibles des pages",
      "content": "Fais ce test : sur n'importe quel site, fais un clic droit puis choisis afficher la source de la page. Tu verras apparaître du texte étrange rempli de mots entourés de chevrons : ce sont des balises, et cette langue, c'est le HTML. Le HTML structure le contenu : chaque balise dit au navigateur ce qu'est un élément. Une balise de titre dit : ceci est un titre important. Une balise de paragraphe dit : ceci est un texte courant. Une balise image dit : affiche cette photo ici. Une balise lien dit : en cliquant ici, on va vers cette autre page. La plupart des balises fonctionnent en paires : une balise ouvrante au début de l'élément, une balise fermante à la fin, marquée par une barre oblique. Le navigateur lit ce texte et construit l'affichage que tu vois : sans HTML, il n'y a que du texte en vrac. Retiens l'image de la maison : le HTML est les murs, les pièces, les portes. C'est la structure de tout ce qui existe sur le web, du plus petit blog au plus grand réseau social."
    },
    {
      "section_type": "play",
      "title": "Le jeu des étiquettes",
      "content": "Jouons à être un navigateur. Découpe dix étiquettes en papier. Sur chacune, écris une balise en toutes lettres : un titre principal, un paragraphe, une image, un lien, un titre secondaire, une liste. Sur d'autres papiers, écris des morceaux de contenu : une phrase d'accroche, le nom de ton plat préféré, la description de ton quartier, l'adresse d'un site. Mélange tout, puis reconstruct une page logique : pose les étiquettes balises autour des contenus, comme un navigateur assemble une page. Défi à deux : chacun construit sa page, puis l'autre joue le navigateur et lit la page à voix haute en expliquant ce qu'il affiche à chaque balise : ici un grand titre, ici un paragraphe, ici une image. Le gagnant est celui dont la page se lit le plus naturellement. Tu comprends en jouant la logique profonde du HTML : des boîtes qui contiennent du contenu."
    },
    {
      "section_type": "experiment",
      "title": "Ta première page dans un bloc-notes",
      "content": "Expérience historique : créer une vraie page web sans aucun logiciel spécial. Ouvre un éditeur de texte simple, comme le bloc-notes ou un éditeur libre. Tape exactement ces lignes en texte brut. Première ligne : la balise html entre chevrons. Deuxième ligne : la balise head, puis dedans la balise title avec le mot Bienvenue, puis la fermeture des deux. Ensuite la balise body, puis un titre principal avec la balise h un contenant ton prénom, puis un paragraphe avec la balise p contenant une phrase qui te présente, et referme body puis html. Enregistre le fichier sous le nom : mapage.html, en choisissant tous les fichiers comme type. Puis ouvre ce fichier avec ton navigateur : ta page est en ligne, sur ta machine. Change le titre, réenregistre, recharge la page dans le navigateur : la modification apparaît. Tu viens de faire exactement le métier de développeur web : écrire, enregistrer, recharger, corriger."
    },
    {
      "section_type": "build",
      "title": "Construis ta page présentation",
      "content": "Construis maintenant une vraie page de présentation, étape par étape. Repars de ton fichier mapage.html et enrichis-le. 1) Ajoute trois niveaux de titres : un grand titre avec ton prénom, un titre de section pour mes passions, un autre pour mes projets. 2) Sous chaque titre, écris un paragraphe de deux phrases. 3) Crée une liste de tes trois activités préférées avec la balise de liste et ses éléments. 4) Ajoute un lien vers un site que tu aimes, avec la balise lien et son adresse. 5) Ajoute une image : pour l'instant, cherche une image libre de droits en ligne et copie son adresse dans la balise image. 6) Enregistre, recharge, vérifie chaque point de cette liste dans ton navigateur. Ta page est réussie quand les six éléments s'affichent tous correctement et qu'un camarade peut la lire et cliquer sur le lien sans que rien ne casse. C'est ta première oeuvre web : garde-la précieusement."
    },
    {
      "section_type": "mission",
      "title": "Mission : auditeur de sites",
      "content": "Ta mission : auditer un vrai site comme un professionnel. Choisis le site simple d'une école, d'une association ou d'une petite entreprise de ton quartier. Parcours la page d'accueil et remplis une fiche d'audit en quatre colonnes : les titres utilisés, combien de liens vers d'autres pages, les images présentes, et les informations manquantes. Pour les informations manquantes, pose-toi la question d'un visiteur pressé : est-ce que je trouve en trois clics le contact, le lieu, les horaires ? Ensuite, fais la même inspection technique : clic droit, afficher la source, et cherche la présence des balises de titre, de lien et d'image dans le code. Termine par un mini rapport de trois phrases : ce que ce site fait bien, ce qu'il devrait ajouter, et l'élément HTML que tu lui conseillerais en priorité. Ton audit éveillera peut-être des vocations : c'est exactement le premier travail d'un web designer."
    },
    {
      "section_type": "project",
      "title": "Projet : ta carte de visite numérique",
      "content": "Projet final : une carte de visite web qui te représente, réutilisable pour toujours. Sur une seule page : ton prénom en grand titre, une phrase de présentation percutante, ta liste de trois compétences en cours d'acquisition, un lien vers ta page présentation de l'activité construis, et une image qui te plaît. Ajoute une section contact avec un simple texte indiquant comment te joindre, sans donner d'information personnelle réelle en ligne : prénom et initiale suffisent. Vérifie la page dans un navigateur, puis demande à deux personnes de la lire pendant trente secondes et de te dire ce qu'elles retiennent. Si elles retiennent qui tu es et ce que tu aimes, ta carte fonctionne. Dans l'aventure suivante, tu lui donneras des couleurs et du style avec le CSS. Le squelette est prêt : l'aventure de l'apparence commence."
    }
  ],
  "quiz": [
    {
      "question": "À quoi sert le langage HTML ?",
      "options": ["À structurer le contenu d'une page web", "À colorer les pages", "À se connecter à Internet", "À créer des mots de passe"],
      "correct_index": 0,
      "explanation": "Le HTML structure le contenu : titres, paragraphes, images, liens. C'est le squelette de chaque page web. Les couleurs, elles, sont gérées par le CSS."
    },
    {
      "question": "Que fait le navigateur avec le code HTML d'une page ?",
      "options": ["Il l'imprime automatiquement", "Il lit les balises et construit l'affichage", "Il le traduit en anglais", "Il le transforme en image"],
      "correct_index": 1,
      "explanation": "Le navigateur lit les balises une par une et construit la page affichée : chaque balise lui indique la nature et l'organisation de chaque élément."
    },
    {
      "question": "Comment fonctionnent la plupart des balises HTML ?",
      "options": ["Seulement en version anglaise", "En paires : une balise ouvrante et une balise fermante", "Uniquement avec des majuscules", "Elles n'existent qu'en version payante"],
      "correct_index": 1,
      "explanation": "La plupart des balises vont par paires : une balise ouvrante marque le début de l'élément, une balise fermante marquée d'une barre oblique marque sa fin."
    }
  ]
};
