export default {
  "slug": "python-projects",
  "title": "Projets Python concrets",
  "description": "Passe de la théorie à la pratique : construis quatre vrais programmes Python, du générateur de proverbes à l'assistant de tontine.",
  "story": "Tu connais maintenant les bases de Python : variables, conditions, boucles et fonctions. Mais la vraie programmation s'apprend en construisant, pas en lisant. Dans cette aventure, tu vas écrire quatre petits programmes complets et utiles, pensés pour la vie de tous les jours à Abidjan, puis un projet final qui les réunit tous : ton premier vrai logiciel de gestion.",
  "xp_reward": 160,
  "lessons": [
    {
      "section_type": "discover",
      "title": "Pourquoi les projets forgent le développeur",
      "content": "Lire du code, c'est bien. En écrire, c'est mieux. C'est en construisant de vrais petits programmes que ton cerveau transforme la théorie en réflexes. Un développeur qui a déjà construit dix petits projets résout en cinq minutes ce qu'un débutant qui n'a lu que des cours cherche pendant des heures. Voici la méthode qu'on applique ensemble : chaque projet répond à un besoin réel, se code en moins de cinquante lignes, et réutilise exactement ce que tu as appris : variables, conditions, boucles, fonctions, listes et dictionnaires. Premier réflexe avant de coder : définir ce que le programme doit faire, étape par étape, en français. C'est ce qu'on appelle l'algorithme, comme dans la première aventure du monde coding. Deuxième réflexe : coder petit morceau par petit morceau, en testant après chaque ajout avec la fonction print. Troisième réflexe : accepter les erreurs. Un message d'erreur n'est pas une punition, c'est un indice : Python indique presque toujours la ligne du problème et sa cause. Quatrième réflexe : nommer clairement tes variables, pour te relire comme si tu étais quelqu'un d'autre. Dans cette aventure, tu construis quatre projets de plus en plus ambitieux : un générateur de proverbes, un convertisseur de devises, un carnet de dépenses et un jeu de devinettes. Le projet final les dépasse tous : un assistant de tontine complet. Prépare ton éditeur, on code."
    },
    {
      "section_type": "play",
      "title": "Projet 1 : le générateur de proverbes",
      "content": "Premier projet : un programme qui affiche un proverbe africain au hasard, pour inspirer ta journée. De quoi as-tu besoin ? D'une liste de proverbes et du module random qui choisit un élément au hasard. Voici la construction, décrite en mots. D'abord, tu importes le module random tout en haut du fichier avec le mot clé import. Ensuite, tu crées une liste appelée proverbes, avec des chaînes de caractères entre guillemets : par exemple, seul on va plus vite, ensemble on va plus loin, ou encore, tant que les lions n'auront pas leurs propres historiens, l'histoire de la chasse continuera de glorifier le chasseur. Puis tu demandes au module random sa fonction choice, à qui tu passes ta liste : elle renvoie un élément au hasard que tu stockes dans une variable. Enfin, tu affiches le résultat avec la fonction print. Améliorations possibles : demander à l'utilisateur s'il veut un nouveau proverbe avec la fonction input, et boucler avec while tant qu'il répond oui. Et pour pimenter : crée un dictionnaire qui associe chaque proverbe à sa signification, et affiche les deux, le proverbe puis son explication. Ce projet te fait réviser les listes, les chaînes, les boucles et le module random, tout en créant quelque chose que ta famille voudra utiliser chaque matin."
    },
    {
      "section_type": "experiment",
      "title": "Projet 2 : le convertisseur de devises",
      "content": "Deuxième projet : un convertisseur qui transforme des euros en francs CFA, ou l'inverse. Utile quand tu repères un prix sur un site étranger. Le taux est arrondi pour l'exercice : un euro vaut environ six cent cinquante-six francs CFA. Construction : tu demandes le montant à l'utilisateur avec la fonction input, qui renvoie toujours une chaîne de caractères. Piège classique : pour calculer, il faut convertir cette chaîne en nombre avec la fonction float, sinon Python colle les textes au lieu d'additionner. Ensuite, tu demandes le sens de la conversion : l'utilisateur tape un pour euros vers CFA, ou b pour l'inverse. Tu gères ce choix avec une condition if, elif, else. S'il choisit un, tu multiplies le montant par le taux ; sinon, tu divises. Puis tu affiches le résultat proprement avec la fonction print et l'arrondi de la fonction round à deux chiffres après la virgule. Améliorations : vérifier que le montant tapé est bien un nombre, sinon afficher un message clair ; ajouter le dollar américain comme troisième devise ; ou transformer le convertisseur en fonction, réutilisable autant de fois que tu veux. Ce projet révise input, les conversions de types, les conditions et les opérations. Détail important : la fonction input affiche le message placé entre ses parenthèses, profites-en pour poser une question claire à l'utilisateur, il te remerciera."
    },
    {
      "section_type": "build",
      "title": "Projet 3 : le carnet de dépenses",
      "content": "Troisième projet : suivre tes dépenses de la semaine, comme un vrai budget de lycéen. Objectif : l'utilisateur ajoute des dépenses une par une, puis le programme affiche le total, la plus grosse dépense et la moyenne. Construction : tu crées une liste vide appelée depenses. Dans une boucle while, tu demandes à chaque tour un libellé et un montant ; si l'utilisateur tape le mot fini comme libellé, la boucle s'arrête avec break. Sinon, tu ajoutes à la liste un dictionnaire avec deux clés : libelle et montant, le montant converti en float. À la fin, trois calculs : le total avec la fonction sum appliquée à la liste des montants ; la plus grosse dépense avec la fonction max sur la même liste ; la moyenne en divisant le total par le nombre d'éléments, obtenu avec la fonction len. Attention au piège : si la liste est vide, la division par zéro plante le programme. Un bon développeur prévoit ce cas avec une condition : si la liste est vide, affiche un message disant qu'aucune dépense n'est enregistrée. Améliorations : transformer chaque calcul en fonction séparée, nommée clairement ; compter combien de fois l'utilisateur a dépensé pour le transport ; ou préparer un résumé en chaîne de caractères, prêt à copier dans un message WhatsApp. Ce projet est le plus proche de la vie réelle : gérer un budget, c'est exactement ce que font les applications de comptabilité utilisées par les entreprises."
    },
    {
      "section_type": "mission",
      "title": "Projet 4 : le jeu de devinettes",
      "content": "Quatrième projet, le plus amusant : un jeu de devinettes en console. Le programme choisit un nombre secret entre un et cent, et le joueur doit le trouver en aussi peu d'essais que possible. Construction : commence par importer le module random et choisis le secret avec sa fonction randint, qui prend deux bornes : un et cent. Puis initialise deux variables : essais, un compteur qui démarre à zéro, et trouve, un booléen parti sur faux. La boucle while tourne tant que le joueur n'a pas trouvé. À chaque tour, tu demandes une proposition avec input, tu la convertis en entier avec la fonction int, tu augmentes le compteur de un, puis trois cas avec if, elif et else : si la proposition est plus petite que le secret, affiche c'est plus grand ; si elle est plus grande, affiche c'est plus petit ; sinon, passe trouve à vrai et félicite le joueur en affichant son nombre d'essais. Pour aller plus loin, ajoute une limite de sept essais : si le compteur atteint sept sans succès, le jeu s'arrête et révèle le nombre secret. Défi d'artiste : affiche un message différent selon la performance, bravo spectaculaire si le secret est trouvé du premier coup. Ce projet assemble boucles, conditions, variables, modules et gestion des entrées : exactement la trame de tous les jeux vidéo, en plus simple. Teste-le avec ton petit frère ou ta petite sœur, tu verras son sourire."
    },
    {
      "section_type": "project",
      "title": "Projet final : l'assistant de tontine",
      "content": "Projet final : un assistant de tontine, la fameuse caisse commune que les familles ivoiriennes animent chaque mois. Objectif : gérer les membres, enregistrer les cotisations et calculer qui reçoit la main ce mois-ci. Construction complète : d'abord une liste de dictionnaires, chaque dictionnaire représentant un membre avec les clés nom, quartier et cotisation. Ensuite une fonction ajouterMembre qui demande les informations avec input et ajoute un dictionnaire à la liste. Puis une fonction enregistrerCotisation qui demande le nom, cherche le membre dans une boucle for, et met à jour sa cotisation ; si le nom est inconnu, affiche un message clair. Ajoute aussi une fonction totalCaisse qui additionne toutes les cotisations avec une boucle, et une fonction prochainBeneficiaire qui suit l'ordre d'inscription et indique à qui revient la main. Enfin, une boucle principale propose un menu avec input : taper un pour ajouter un membre, deux pour enregistrer une cotisation, trois pour voir le total de la caisse, quatre pour le prochain bénéficiaire, et zéro pour quitter. Chaque choix appelle la fonction correspondante dans une condition if, elif, else. Ce menu en boucle, c'est la base de tous les logiciels de gestion : caisses, boutiques, stock de kiosque. Prends ton temps, fonction par fonction, en testant chaque morceau avec print. À la fin, tu possèdes un vrai programme d'environ soixante lignes, écrit de tes mains : ta première application utile de gestion."
    }
  ],
  "quiz": [
    {
      "question": "Avant de coder un projet, quelle est la première étape recommandée ?",
      "options": [
        "Acheter un nouvel ordinateur",
        "Définir en français ce que le programme doit faire, étape par étape",
        "Choisir la couleur de l'interface",
        "Supprimer les anciens fichiers"
      ],
      "correct_index": 1,
      "explanation": "Décrire le comportement attendu en étapes claires, c'est écrire l'algorithme : la fondation de tout programme."
    },
    {
      "question": "Que renvoie toujours la fonction input de Python ?",
      "options": [
        "Toujours une chaîne de caractères",
        "Toujours un nombre entier",
        "Toujours une liste",
        "Un fichier texte"
      ],
      "correct_index": 0,
      "explanation": "input renvoie toujours du texte : pour faire des calculs, il faut convertir le résultat avec int ou float."
    },
    {
      "question": "Dans le jeu de devinettes, pourquoi convertir la proposition du joueur avec la fonction int ?",
      "options": [
        "Pour l'afficher en gras",
        "Pour comparer des nombres entre eux et non des textes",
        "Pour accélérer l'ordinateur",
        "Pour traduire le jeu en anglais"
      ],
      "correct_index": 1,
      "explanation": "Les comparaisons numériques exigent des nombres : sans int, la comparaison avec le secret ne fonctionne pas correctement."
    },
    {
      "question": "Comment éviter une division par zéro dans le carnet de dépenses ?",
      "options": [
        "En éteignant l'ordinateur",
        "En vérifiant que la liste n'est pas vide avant de calculer la moyenne",
        "En supprimant la boucle while",
        "En utilisant le module random"
      ],
      "correct_index": 1,
      "explanation": "Un bon développeur anticipe les cas limites, comme une liste vide, avec une condition avant le calcul."
    },
    {
      "question": "Dans l'assistant de tontine, à quoi sert la boucle du menu principal ?",
      "options": [
        "À refuser les nouveaux membres",
        "À laisser l'utilisateur choisir une action jusqu'à ce qu'il quitte",
        "À effacer l'écran",
        "À trier les noms par ordre alphabétique"
      ],
      "correct_index": 1,
      "explanation": "La boucle du menu affiche les choix en boucle et appelle la fonction correspondante jusqu'à ce que l'utilisateur tape le code de sortie."
    }
  ]
}
