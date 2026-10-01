export default {
  "slug": "react-intro",
  "title": "Introduction à React",
  "description": "Découvre React, la bibliothèque JavaScript qui fait tourner WhatsApp Web et Instagram, et construis ta première interface interactive composant par composant.",
  "story": "Tu as déjà remarqué comme WhatsApp Web réagit instantanément : un message arrive, l'écran bouge tout seul, sans jamais recharger la page. Derrière cette magie se cache React, l'outil le plus demandé du web. Aujourd'hui, tu entre dans la cour des grands : tu vas construire ta première interface interactive, brique par brique, comme les développeurs d'Abidjan aux startups les plus modernes.",
  "xp_reward": 150,
  "lessons": [
    {
      "section_type": "discover",
      "title": "Bienvenue dans le monde de React",
      "content": "React est une bibliothèque JavaScript créée en 2013 par les ingénieurs de Facebook, aujourd'hui Meta. Une bibliothèque, c'est une boîte à outils déjà écrite par d'autres développeurs : tu l'utilises pour aller plus vite au lieu de tout réinventer. WhatsApp Web, Instagram, Netflix ou encore Airbnb utilisent React. Quand tu fais défiler une page et que tout bouge sans recharger, il y a de fortes chances que React soit derrière. L'idée centrale est simple : au lieu d'écrire des pages entières comme en HTML pur, tu construis des briques réutilisables appelées composants. Un composant, c'est un peu comme un plat au maquis : chaque plat a sa recette, et tu peux le commander autant de fois que tu veux sans réécrire la recette. Un composant CartePlat, une fois écrit, peut afficher cent plats différents. Pourquoi c'est puissant ? Parce que tu écris moins, tu réutilises plus, et ton code reste organisé même quand l'application grandit. Autre bon point : React s'utilise avec du simple JavaScript, donc tout ce que tu as appris dans l'aventure JavaScript te sert directement. Et pour tester React, nul besoin d'un ordinateur coûteux : un navigateur et un outil en ligne gratuit suffisent. Dans cette aventure, tu vas créer ton premier composant, passer des informations avec les props, mémoriser des données avec le state et afficher une liste dynamique. À la fin, tu auras construit une mini carte de profil interactive, comme une vraie application."
    },
    {
      "section_type": "play",
      "title": "Écris ton premier composant",
      "content": "Un composant React, c'est une fonction JavaScript qui retourne ce qui doit s'afficher à l'écran. Voici comment on le décrit : tu écris le mot clé function, puis un nom qui commence par une majuscule, par exemple CartePlat, puis entre parenthèses rien ou des données reçues, et la fonction retourne le HTML que tu veux afficher. En React, on écrit le HTML directement à l'intérieur du JavaScript : ce mélange s'appelle du JSX. Par exemple, ta fonction CartePlat peut retourner une balise div qui contient une balise h deux avec le texte Attiéké poisson et une balise paragraphe avec le texte Deux mille francs CFA. Pour utiliser ton composant, tu l'écris ailleurs comme une balise : le mot CartePlat entre chevrons, comme si c'était une nouvelle balise inventée par toi. Le navigateur affiche alors ta carte. Règles importantes du JSX : ton retour doit être enveloppé dans une seule balise racine, par exemple une div qui contient tout ; toute balise doit être fermée, même celles qui n'ont pas de contenu comme la balise image ; et les noms de composants commencent toujours par une majuscule, sinon React ne les reconnaît pas. Fais le test mental : si tu écris deux fois la balise CartePlat, tu obtiens deux cartes identiques sans dupliquer ton code. C'est toute la magie de React : écrire une fois, afficher partout."
    },
    {
      "section_type": "experiment",
      "title": "Les props : transmets des informations",
      "content": "Un composant serait vite ennuyeux s'il affichait toujours la même chose. Les props, abréviation de propriétés, servent justement à transmettre des informations à un composant, exactement comme des arguments passés à une fonction. Reprenons CartePlat : quand tu utilises la balise CartePlat, tu peux lui passer nom et prix, par exemple nom égal Attiéké poisson et prix égal deux mille. Dans la définition de la fonction, tu reçois ces valeurs entre parenthèses, comme des paramètres. Pour les afficher dans le JSX, tu ouvres des accolades et tu y mets la variable : les accolades signifient insère ici du JavaScript. Entre accolades, tu peux mettre une variable, un calcul, même du texte assemblé. Résultat : le même composant affiche Attiéké poisson à deux mille francs ici, et Kedjenou à trois mille là-bas. C'est comme un flyer de maquis : le modèle est unique, seuls le nom du plat et le prix changent. Astuce de pro : les props sont en lecture seule. Un composant ne modifie jamais les props qu'il reçoit, il les affiche ou les transmet. Si une donnée doit changer toute seule, ce n'est plus le rôle des props mais celui du state, que tu découvres dans la prochaine leçon. En attendant, entraîne-toi : imagine un composant CarteAmi qui reçoit un prénom et une ville, et affiche un message de salutation personnalisé."
    },
    {
      "section_type": "build",
      "title": "Le state : une mémoire qui réagit",
      "content": "Jusqu'ici tes composants affichent des informations figées. Mais une vraie application bouge : on clique, on ajoute, on compte. Pour cela, React propose le state, une donnée que le composant garde en mémoire et qui, quand elle change, met l'écran à jour automatiquement. Exemple concret : un compteur de likes sous une photo. On utilise la fonction use state fournie par React. On la décrit ainsi : elle prend la valeur de départ, par exemple zéro, et renvoie deux choses : la valeur actuelle du compteur, et une fonction spéciale qui sert à la changer. On écrit ces deux choses entre crochets, séparées par une virgule. Dans le JSX, tu affiches la valeur entre accolades. Sur le bouton, tu définis que lors d'un clic, la fonction de mise à jour est appelée avec la nouvelle valeur, c'est-à-dire l'ancienne valeur plus un. Résultat : à chaque clic, l'écran affiche un nombre de plus, sans recharger quoi que ce soit. C'est exactement le solde de ton compte mobile money : quand la donnée change, l'affichage change aussitôt. Règle d'or : ne modifie jamais la valeur du state directement, comme si c'était une variable normale. Passe toujours par la fonction de mise à jour, sinon React ne saura pas que quelque chose a changé et ton écran restera figé. Entraîne-toi mentalement : un bouton qui augmente le compteur, un autre qui le remet à zéro, et observe comment chaque clic rafraîchit l'affichage."
    },
    {
      "section_type": "mission",
      "title": "Mission : la carte du maquis en liste",
      "content": "Mission du jour : afficher la liste complète des plats d'un maquis sans copier-coller vingt composants. Pour transformer une liste de données en éléments affichés, React utilise la méthode map des tableaux JavaScript, celle que tu as déjà croisée dans l'aventure JavaScript. Le principe : tu ranges tes plats dans un tableau d'objets, chaque objet contenant par exemple nom et prix. Dans le JSX, tu ouvres des accolades, tu écris le nom du tableau, un point, map, et entre parenthèses une fonction courte qui, pour chaque plat, retourne le composant CartePlat avec les props tirées du plat. En une seule ligne, React affiche autant de cartes qu'il y a de plats. Ajoute un plat au tableau : une carte apparaît, sans toucher au reste. Mais il existe une règle d'or : chaque élément retourné par map doit recevoir une prop spéciale appelée key, une clé unique, souvent l'identifiant du plat. Pourquoi ? Parce que React garde une mémoire de la structure de l'écran, et la clé lui permet de savoir précisément quel élément a été ajouté, modifié ou supprimé. Sans clé, React devine, et des erreurs d'affichage apparaissent quand la liste change. Piège classique du débutant : oublier la clé et voir un avertissement dans la console du navigateur. Ta mission concrète : construis un tableau de cinq plats de ton maquis préféré, affiche-les avec map et une clé pour chacun, puis ajoute un sixième plat et observe la mise à jour automatique de l'écran."
    },
    {
      "section_type": "project",
      "title": "Projet : ta carte de profil interactive",
      "content": "Projet final de l'aventure : une carte de profil interactive, comme sur un réseau social. Objectif : assembler tout ce que tu as appris : composants, props, state et map. Étape une : le composant CarteProfil, qui reçoit en props un prénom, un quartier et une liste de passions, et les affiche joliment. Étape deux : le composant BoutonSuivre, qui garde en state un nombre d'abonnés et un état suivi ou non suivi. Au clic, le state change : le texte du bouton passe de Suivre à Abonné et le compteur augmente de un. Étape trois : la liste des passions, affichée avec la méthode map, chaque passion avec sa clé unique. Étape quatre : l'assemblage dans un composant Application qui utilise CarteProfil une fois, avec tes propres informations. Pour coder sans installer quoi que ce soit, utilise CodeSandbox ou StackBlitz : ce sont des sites gratuits où tu écris du React directement dans le navigateur, parfait si tu travailles depuis un cybercafé ou un téléphone. Quand ta carte fonctionne, pousse plus loin : change les couleurs avec une classe et du CSS, ajoute une photo, crée un deuxième profil avec des props différentes. Défi bonus : un bouton like sur chaque passion qui compte ses clics, en combinant map et state. À la fin, tu détiens le cœur de React : la plupart des applications professionnelles ne sont rien d'autre que des composants, des props, du state et des listes. Bienvenue dans la cour des grands."
    }
  ],
  "quiz": [
    {
      "question": "En React, qu'est-ce qu'un composant ?",
      "options": [
        "Un fichier de style qui gère les couleurs",
        "Une fonction JavaScript qui retourne ce qui doit s'afficher",
        "Un serveur qui stocke les données",
        "Une balise du HTML classique"
      ],
      "correct_index": 1,
      "explanation": "Un composant est une fonction JavaScript, avec un nom en majuscule, qui retourne l'interface à afficher, souvent écrite en JSX."
    },
    {
      "question": "À quoi servent les props dans un composant React ?",
      "options": [
        "À transmettre des informations au composant, comme des arguments à une fonction",
        "À supprimer un composant de l'écran",
        "À fermer automatiquement le navigateur",
        "À changer la langue du site"
      ],
      "correct_index": 0,
      "explanation": "Les props transportent les données vers le composant, qui les affiche ou les transmet. Elles sont en lecture seule."
    },
    {
      "question": "Que se passe-t-il quand tu appelles la fonction de mise à jour d'un state ?",
      "options": [
        "Rien, il faut recharger la page entière",
        "React met automatiquement l'écran à jour avec la nouvelle valeur",
        "Le composant est supprimé de l'application",
        "Le navigateur affiche une erreur"
      ],
      "correct_index": 1,
      "explanation": "Le state est la mémoire du composant : dès qu'il change via sa fonction de mise à jour, React rafraîchit l'affichage concerné."
    },
    {
      "question": "Pourquoi chaque élément d'une liste affichée avec map doit-il avoir une clé unique ?",
      "options": [
        "Pour décorer l'élément avec des couleurs",
        "Pour que React identifie chaque élément lors des mises à jour",
        "Pour trier la liste par ordre alphabétique",
        "Pour sauvegarder la liste dans une base de données"
      ],
      "correct_index": 1,
      "explanation": "La clé permet à React de savoir exactement quel élément a changé, été ajouté ou supprimé quand la liste évolue."
    },
    {
      "question": "Quel outil gratuit permet de coder en React directement dans le navigateur ?",
      "options": [
        "Un lave-linge intelligent",
        "CodeSandbox ou StackBlitz",
        "Une clé USB",
        "Un tableur"
      ],
      "correct_index": 1,
      "explanation": "CodeSandbox et StackBlitz sont des éditeurs en ligne gratuits, parfaits pour apprendre React sans installer de logiciel."
    }
  ]
}
