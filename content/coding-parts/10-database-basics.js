export default {
  "slug": "database-basics",
  "title": "Les bases de données",
  "description": "Découvre les bases de données : tables, lignes, colonnes, et apprends à poser les bonnes questions à tes données avec des requêtes simples.",
  "story": "Chaque application que tu utilises, du mobile money au réseau social, manipule des milliers d'informations : comptes, soldes, messages, plats, commandes. Où sont-elles rangées ? Dans une base de données, le coffre-fort organisé du web. Dans cette aventure, tu apprends à structurer des données et à les interroger, la compétence qui sépare l'apprenti du développeur complet.",
  "xp_reward": 140,
  "lessons": [
    {
      "section_type": "discover",
      "title": "Pourquoi ranger les données dans une base",
      "content": "Imagine la gérante d'un grand maquis qui note tout dans un seul cahier : commandes, fournisseurs, recettes, salaires, mélangés page après page. Le jour où elle cherche le prix de l'attiéké du mardi, elle retourne tout le cahier. C'est exactement le problème que résout une base de données. Une base de données, c'est un espace organisé pour ranger de grandes quantités d'informations, les retrouver vite, et les modifier sans tout casser. Pourquoi ne pas utiliser un simple fichier ? Trois raisons. La vitesse : une base retrouve une information parmi des millions en quelques millisecondes, grâce à des index, sortes de sommaires ultra rapides. La sécurité : une base contrôle qui a le droit de lire ou de modifier chaque information, avec des comptes et des permissions. La solidité : si un problème survient au milieu d'une écriture, la base sait annuler proprement l'opération et laisser les données cohérentes. Dernier avantage, décisif : plusieurs applications et plusieurs utilisateurs peuvent lire et écrire en même temps, sans s'écraser. Le type de base le plus répandu s'appelle base relationnelle : les données vivent dans des tables qui se relient entre elles. C'est ce modèle que tu explores dans cette aventure, car il équipe la quasi-totalité des entreprises, de la banque au kiosque de quartier. Et bonne nouvelle : la langue pour parler aux bases relationnelles s'apprend vite, et ressemble à une phrase que tu dirais naturellement en français."
    },
    {
      "section_type": "play",
      "title": "La table : une grille de lignes et de colonnes",
      "content": "Une base relationnelle range ses données dans des tables, et une table ressemble à un tableau soigné : des colonnes verticales et des lignes horizontales. Prenons la table des plats d'un maquis. Chaque colonne représente une information précise, toujours la même pour tous : identifiant, nom du plat, catégorie, prix en francs CFA, disponible ou non. Chaque ligne, souvent appelée enregistrement, représente un plat concret : attiéké poisson, plat local, deux mille cinq cents, disponible. Deux règles d'or structurent une bonne table. Règle un : chaque ligne doit être unique et reconnaissable. Pour cela, chaque table possède une clé primaire, une colonne dont la valeur ne se répète jamais, souvent un identifiant numéro un, deux, trois, attribué automatiquement. Le nom d'un plat peut changer ; son identifiant, jamais. Règle deux : une information n'apparaît qu'à un seul endroit. Si le prix de l'attiéké change, on le modifie une fois dans la table des plats, pas dans dix cahiers différents. C'est le principe central des bases relationnelles : une table par sujet, une information à un seul endroit, des liens clairs entre les tables. Par exemple, la table des commandes ne recopie pas le nom du plat : elle note l'identifiant du plat, et le lien fait le reste. Ce voyage dans la structure t'apprend le réflexe fondamental du développeur : avant même d'écrire une ligne de code, il dessine ses tables au brouillon, colonnes, clés et liens. Exercice : dessine sur papier la table des élèves de ta classe, avec ses colonnes et sa clé primaire."
    },
    {
      "section_type": "experiment",
      "title": "Interroge les données : la requête de lecture",
      "content": "Ranger, c'est bien ; retrouver, c'est mieux. Pour parler aux bases relationnelles, on utilise une langue spécialisée, très répandue, dont le verbe préféré est lire. La requête la plus fréquente se décrit ainsi : lis les colonnes voulues dans la table indiquée. En mots clairs : donne-moi le nom et le prix, depuis la table des plats. La base répond en un clin d'œil, même si la table contient un million de lignes. Trois précisions qui font toute la différence. Précision un : on choisit les colonnes, donc on ne récupère que l'utile ; inutile de charger les photos de tous les plats pour afficher la carte. Précision deux : une étoile signifie toutes les colonnes, pratique pour explorer, mais à éviter en production : sur mobile, charger des colonnes inutiles gaspille le forfait internet de l'utilisateur. Précision trois : cette requête ne modifie jamais les données : elle lit, et c'est tout. C'est rassurant : un apprenti peut explorer sans risque. La même langue sert aussi à ajouter, modifier et supprimer, mais ces trois opérations sont plus puissantes, donc plus dangereuses : elles changent vraiment le contenu de la base. Les professionnels les réservent aux personnes autorisées, et c'est une excellente discipline à prendre dès maintenant : lis autant que tu veux, mais réfléchis deux fois avant d'écrire. Exercice mental : écris en français la requête qui listerait le prénom et la classe de tous les élèves de ton établissement, puis identifie les colonnes inutiles à ne pas demander, comme la photo de badge."
    },
    {
      "section_type": "build",
      "title": "Filtre et trie : pose les bonnes questions",
      "content": "Lire toute une table, c'est comme recopier tout le cahier de la gérante : rarement utile. La force d'une base, c'est de répondre à des questions précises. Premier outil, le filtre : on ajoute à la requête une condition, décrite ainsi : lis ces colonnes dans cette table, là où la condition est vraie. Par exemple : donne-moi le nom et le prix des plats, là où la catégorie est plat local. Ou : les plats, là où le prix est inférieur ou égal à deux mille francs. La base ne renvoie que les lignes qui passent le test. Les conditions se combinent avec et, ou : disponible et prix inférieur à mille, exactement comme tu formules en français. Deuxième outil, le tri : on ajoute classe par, suivi de la colonne qui décide de l'ordre. Par exemple : les plats, classés par prix du plus grand au plus petit, pour afficher les plats chers en premier ; ou du plus petit au plus grand pour mettre en avant les bonnes affaires. Filtre et tri se combinent dans la même requête : les plats locaux, disponibles, classés par prix croissant. C'est ici que la base montre sa vraie puissance : avec un million de lignes, la réponse arrive en millisecondes, ce qu'aucun humain ne pourrait faire. Astuce de pro : commence toujours par tester la requête sans filtre pour vérifier la table, puis ajoute les conditions une à une : si le résultat devient vide, tu sais exactement quelle condition est en cause. Exercice : formule en français trois questions utiles pour la gérante d'un maquis, chacune avec un filtre et un tri. Exemple : quels plats locaux sont disponibles, classés du moins cher au plus cher ?"
    },
    {
      "section_type": "mission",
      "title": "Mission : conçois la base du maquis",
      "content": "Mission de concepteur : dessine sur papier la base de données complète d'un maquis, avant même d'écrire la moindre requête. Procédons table par table. Table une, les plats : colonnes identifiant, nom, catégorie, prix, disponible ; clé primaire, l'identifiant. Table deux, les clients fidèles : identifiant, prénom, téléphone, quartier ; clé primaire, l'identifiant. Attention, réflexe du professionnel : pourquoi pas une table des clients pour un petit maquis ? Parce qu'une information mérite une table seulement si on gère plusieurs détails sur elle ; si le maquis note juste le numéro de téléphone sur la commande, pas besoin de table séparée. Apprends à te poser la question : ai-je vraiment besoin de cette table ? Table trois, les commandes : identifiant, date et heure, identifiant du client, statut, tel en préparation ou servie ; clé primaire, l'identifiant. Table quatre, le détail des commandes : identifiant, identifiant de la commande, identifiant du plat, quantité. Pourquoi cette quatrième table ? Parce qu'une commande contient plusieurs plats : on dit que la commande est reliée aux plats par une ligne d'intermédiaire. C'est le cœur du modèle relationnel : les liens se font par les identifiants, jamais en recopiant les informations. Vérifie ta conception avec trois questions : où est rangé le prix d'un plat, réponse dans la table des plats, une seule fois ; comment retrouve-t-on les plats d'une commande, réponse en suivant les identifiants ; que se passe-t-il si un plat change de nom, réponse rien à modifier ailleurs, le lien par identifiant reste valable. Ta mission aboutit à un dessin de quatre tables avec leurs liens : c'est exactement le document de travail des vrais développeurs, appelé modèle de données."
    },
    {
      "section_type": "project",
      "title": "Projet : la base de données de ton kiosque",
      "content": "Projet final : concevoir et utiliser la base de données d'un petit commerce, le kiosque de quartier, un abonnement à un service de base gratuit suffit. D'abord, choisis ton commerce : kiosque de recharges et réparations, boutique de gâteaux, vidéoclub du quartier, ou librairie scolaire. Ensuite, dessine trois tables minimum, en t'inspirant de la mission : par exemple produits, ventes, et le détail des ventes. Définis les colonnes de chaque table et souligne les clés primaires. Puis remplis à la main, sur papier, chaque table avec cinq lignes réalistes : produits avec prix en francs CFA, ventes avec dates. Vient le moment des questions : écris en français cinq questions utiles au gérant, chacune formulée avec un filtre et un tri. Exemples : la liste des produits en rupture ; les ventes du samedi ; le produit le plus vendu ; les ventes supérieures à cinq mille francs ; les produits classés du plus cher au moins cher. Puis, si tu as accès à un outil de base de données, crée les tables et entre les lignes, en traduisant tes questions en requêtes de lecture avec filtres et tris. Sinon, l'exercice papier reste complet : ce qui compte, c'est la rigueur du raisonnement, colonnes, clés, liens, filtres, tris. Compare ta structure à celle d'un camarade : deux modèles différents peuvent tous deux être corrects, mais discutez des choix. Ce projet t'installe dans la peau du développeur back-end, celui qui construit l'arrière-boutique invisible et solide : la compétence la plus demandée du marché, à Abidjan comme partout dans le monde."
    }
  ],
  "quiz": [
    {
      "question": "Quel est le rôle principal d'une base de données ?",
      "options": [
        "Afficher des vidéos",
        "Ranger de grandes quantités d'informations et les retrouver vite et sûrement",
        "Remplacer le clavier",
        "Charger la batterie du téléphone"
      ],
      "correct_index": 1,
      "explanation": "Une base de données organise les données pour les retrouver en millisecondes, contrôle les accès et garde les informations cohérentes."
    },
    {
      "question": "Dans une table, à quoi sert la clé primaire ?",
      "options": [
        "À décorer la table",
        "À identifier chaque ligne de façon unique, sans jamais se répéter",
        "À compter les colonnes",
        "À trier par ordre alphabétique"
      ],
      "correct_index": 1,
      "explanation": "La clé primaire, souvent un identifiant numérique, rend chaque ligne unique et reconnaissable, même si les autres valeurs changent."
    },
    {
      "question": "Pourquoi ne pas recopier le nom du plat dans la table des commandes ?",
      "options": [
        "Pour économiser du papier",
        "Parce qu'une information vit à un seul endroit : la commande garde l'identifiant du plat, et le lien fait le reste",
        "Parce que les noms de plats sont interdits",
        "Pour ralentir les requêtes"
      ],
      "correct_index": 1,
      "explanation": "C'est le principe relationnel : pas de recopie. Le lien passe par les identifiants, donc une modification du nom n'affecte qu'un seul endroit."
    },
    {
      "question": "Que fait une requête de lecture sur une base de données ?",
      "options": [
        "Elle modifie les lignes",
        "Elle lit les colonnes demandées, sans jamais changer les données",
        "Elle supprime la table",
        "Elle crée une nouvelle base"
      ],
      "correct_index": 1,
      "explanation": "La requête de lecture explore sans risque : elle renvoie des lignes, mais n'ajoute, ne modifie et ne supprime rien."
    },
    {
      "question": "À quoi sert le tri dans une requête ?",
      "options": [
        "À classer les résultats selon une colonne, par exemple du prix le moins cher au plus cher",
        "À crypter les données",
        "À supprimer les doublons de la table",
        "À traduire les données en anglais"
      ],
      "correct_index": 0,
      "explanation": "Le tri ordonne les résultats selon une colonne, croissante ou décroissante, et se combine avec les filtres pour répondre à des questions précises."
    }
  ]
}
