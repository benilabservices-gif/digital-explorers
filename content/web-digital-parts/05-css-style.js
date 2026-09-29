export default {
  "slug": "css-style",
  "title": "CSS : donner vie au Web",
  "description": "Le HTML pose les murs, le CSS peint la maison. Apprends à changer les couleurs, les tailles et les mises en page : ta carte de visite web va prendre un style qui te ressemble.",
  "story": "Tu as construit ta page web dans l'aventure HTML : elle fonctionne, mais elle ressemble à un chantier. Texte noir sur fond blanc, tout collé, austère. Imagine maintenant la même page avec tes couleurs, des espaces qui respirent, des titres qui claquent. C'est le travail du CSS, la langue du style. Dans cette aventure, tu vas apprendre à choisir l'aspect de chaque élément, comme un décorateur transforme une maison. À la fin, ta page sera unique : personne d'autre n'aura la même.",
  "xp_reward": 130,
  "lessons": [
    {
      "section_type": "discover",
      "title": "La langue qui habille les pages",
      "content": "CSS veut dire feuilles de style en cascade. Où HTML structure le contenu, CSS décrit son apparence. Une règle CSS s'écrit toujours pareil : un sélecteur, qui choisit les éléments visés, puis entre accolades des paires propriété-valeur séparées par deux-points. Par exemple, si tu écris p puis accolade, puis color : bleu ; puis accolade fermante, tous les paragraphes deviennent bleus. Chaque propriété commande un détail : la couleur du texte, la couleur du fond, la taille de police, l'épaisseur des bordures, les marges autour d'un élément. Le mot cascade cache une règle importante : quand plusieurs règles touchent le même élément, c'est la plus précise, ou la dernière déclarée à précision égale, qui gagne. C'est pour cela qu'on peut commencer avec un style général, puis affiner titre par titre. Le CSS vit soit dans un fichier séparé relié à la page, soit à l'intérieur de la page elle-même. Pour débuter, un fichier style.css à côté de ta page suffit : une seule feuille pour habiller tout le site."
    },
    {
      "section_type": "play",
      "title": "Le salon de relooking",
      "content": "Jouons au décorateur sans ordinateur. Dessine sur une feuille une maison en coupe : un salon, une chambre, une cuisine. Prépare une dizaine d'étiquettes, une par règle CSS imaginaire : par exemple, la règle numéro un cible les murs du salon, entre accolades, couleur : vert menthe. La règle numéro deux cible les murs du salon, couleur : ocre. La règle numéro trois cible toutes les portes, couleur : rouge. À deux joueurs, chacun pioche des étiquettes et les applique dans l'ordre sur son dessin, en respectant la cascade : si deux règles visent le même élément, la dernière gagne, mais une règle plus précise, qui vise un élément seul, gagne sur une règle générale. Vérifiez vos dessins : qui a appliqué la cascade sans se tromper ? Ce jeu fait ressentir dans les mains ce que le navigateur calcule en millisecondes sur chaque page que tu visites."
    },
    {
      "section_type": "experiment",
      "title": "Habille ta page en dix minutes",
      "content": "Expérience concrète : reprends ta page mapage.html de l'aventure HTML. Crée un nouveau fichier dans le même dossier, nomme-le style.css. Dedans, écris trois règles : une pour le fond de la page, avec la propriété background-color et une couleur douce ; une pour les titres, avec la propriété color et une couleur qui te plaît ; une pour les paragraphes, avec la propriété font-size et une valeur comme 18px. Relie la feuille à ta page : dans la partie head de ton fichier html, écris une balise link qui pointe vers style.css. Enregistre, puis ouvre ta page dans le navigateur : les changements apparaissent comme par magie. Maintenant amuse-toi : change la couleur du fond, réenregistre, recharge. Teste ensuite des propriétés nouvelles une par une, en notant leur effet : text-align pour centrer, margin pour créer de l'espace autour d'un élément, border pour encadrer. Dix minutes de tests valent une heure de théorie : le navigateur est ton laboratoire."
    },
    {
      "section_type": "build",
      "title": "Construis ta mini bibliothèque de styles",
      "content": "Construis maintenant un outil que tu réutiliseras sur tous tes sites : ta bibliothèque personnelle de styles. Crée un fichier styles-perso.css et remplis-le au fur et à mesure en testant dans ta page : 1) une palette de trois couleurs pour ton identité : une couleur principale, une couleur de fond, une couleur de lien ; 2) une taille de texte lisible pour le corps, par exemple 16 ou 18px ; 3) un style pour tes titres avec une propriété font-family pour choisir la police ; 4) un encadré à toi : une classe que tu nommes encadre, avec bordure, coins arrondis via border-radius, et une marge intérieure via padding. Pour l'appliquer à un seul élément, utilise l'attribut class dans le HTML et cible-le dans le CSS avec un point devant le nom. Teste chaque brique dans ta page carte de visite, une par une, en rechargeant le navigateur à chaque fois. Ta bibliothèque est réussie quand tu peux changer l'ambiance complète de ta page en modifiant trois lignes seulement."
    },
    {
      "section_type": "mission",
      "title": "Mission : détective du design local",
      "content": "Ta mission : évaluer le design de vrais sites autour de toi. Choisis trois sites que connaît ta famille ou ton quartier : par exemple le site d'une école, d'une boutique, d'un média ivoirien ou d'une administration. Pour chaque site, remplis une grille sur cinq points : les couleurs sont-elles cohérentes ou criardes ? Le texte est-il lisible, assez grand, avec du contraste ? Trouve-t-on le menu du premier coup d'œil ? La page fonctionne-t-elle bien sur ton téléphone, pas seulement sur un grand écran ? Y a-t-il des éléments qui bougent et attirent l'œil au bon moment ? Note chaque site sur dix et écris pour chacun un conseil concret de style, comme : centrer le titre, augmenter la taille du texte, ajouter une couleur de fond douce. Envoie ou montre ta grille au propriétaire d'un des sites si tu le connais : tu découvriras que ton œil neuf vaut de l'or."
    },
    {
      "section_type": "project",
      "title": "Projet : ta carte de visite stylée",
      "content": "Projet final : transformer ta carte de visite web de l'aventure HTML en une page dont tu seras fier. Objectif : une page claire, lisible et originale, entièrement stylée par ton fichier CSS. Contraintes à respecter : au moins trois couleurs cohérentes, un titre centré, des sections séparées par des marges généreuses, un encadré pour tes compétences, et une adaptation mobile : teste la page sur un téléphone et ajoute si besoin une règle qui réduit la taille des titres sur petit écran. Écris ta palette au début de ton fichier CSS en commentaire pour t'en souvenir : mes trois couleurs. Termine par le test des trois regards : montre la page à trois personnes et demande-leur le mot qui décrit le style. Si les trois répondent dans l'esprit de ce que tu voulais exprimer, ton style parle. Garde ta bibliothèque de styles : elle servira dans l'aventure où tu créeras ton premier site complet."
    }
  ],
  "quiz": [
    {
      "question": "À quoi sert le langage CSS ?",
      "options": ["À structurer le contenu d'une page", "À décrire l'apparence et le style des éléments", "À stocker les données des utilisateurs", "À se connecter à Internet"],
      "correct_index": 1,
      "explanation": "Le CSS décrit l'apparence : couleurs, tailles, marges, disposition. Le contenu, lui, est structuré par le HTML. Les deux langages travaillent ensemble."
    },
    {
      "question": "Comment se compose une règle CSS ?",
      "options": ["Un sélecteur, puis des paires propriété-valeur entre accolades", "Une liste de mots-clés séparés par des virgules", "Uniquement un nom de couleur", "Une adresse de site web"],
      "correct_index": 0,
      "explanation": "Une règle CSS commence par un sélecteur qui vise les éléments concernés, suivi d'accolades contenant des paires propriété-valeur, par exemple color : bleu."
    },
    {
      "question": "Que signifie le C de cascade dans CSS ?",
      "options": ["Que les pages défilent de haut en bas", "Que les règles se combinent selon un ordre de priorité", "Que le CSS ne fonctionne que sur ordinateur", "Que chaque site doit écrire ses règles dans l'ordre alphabétique"],
      "correct_index": 1,
      "explanation": "La cascade est la règle qui décide quelle instruction gagne quand plusieurs visent le même élément : la plus précise l'emporte, et à précision égale, la dernière déclarée s'applique."
    },
    {
      "question": "Tu veux appliquer un style à un seul élément bien précis, pas à tous les paragraphes. Que utilises-tu ?",
      "options": ["Une classe, ciblée dans le CSS avec un point", "Une couleur plus foncée", "Une règle pour la balise p", "Un titre plus long"],
      "correct_index": 0,
      "explanation": "Une classe, ajoutée dans le HTML via l'attribut class, permet de viser un ou quelques éléments choisis : dans le CSS, on la cible en écrivant un point suivi du nom de la classe."
    }
  ]
};
