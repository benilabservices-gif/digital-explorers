export default {
  "slug": "blockchain-simple",
  "title": "La blockchain expliquée simplement",
  "description": "Comprends enfin la blockchain : le grand cahier partagé, inviolable et sans chef, qui fait tourner le Bitcoin et bien plus.",
  "story": "Quand tu envoies de l'argent par mobile money, c'est l'entreprise qui tient le cahier des comptes : elle vérifie, elle enregistre, elle peut se tromper ou être attaquée. La blockchain propose l'inverse : un cahier partagé entre des milliers d'ordinateurs, où personne ne commande seul et où rien ne s'efface. Comment est-ce possible ? C'est ce que tu vas comprendre, brique par brique, avec des exemples de ton quotidien.",
  "xp_reward": 120,
  "lessons": [
    {
      "section_type": "discover",
      "title": "Le grand cahier partagé",
      "content": "Commençons par une image simple : la blockchain, c'est un immense cahier de comptes, copié en même temps chez des milliers de personnes partout dans le monde. Chaque fois que quelqu'un y inscrit quelque chose, par exemple Alice envoie dix unités à Kouassi, l'inscription est recopiée chez tout le monde. Résultat : personne ne peut effacer une ligne, car il faudrait effacer la même ligne chez tous les détenteurs du cahier en même temps, chose pratiquement impossible. Compare avec le monde habituel : ton carnet d'ordre à la banque n'existe qu'à la banque ; si la banque brûle ou se fait pirater, ton carnet est en danger. La blockchain supprime ce point unique de défaillance. Deuxième différence majeure : pas de chef. Personne ne peut décider seul d'annuler une transaction ou de modifier les règles : le système avance grâce à un accord collectif entre les participants, appelé consensus. Troisième caractéristique : l'historique est public. N'importe qui peut vérifier les inscriptions du cahier, sans forcément connaître l'identité des personnes : les comptes sont des codes, pas des noms. Ce trio, cahier distribué, consensus, historique vérifiable, explique pourquoi tant d'ingénieurs s'enthousiasment pour cette technologie. Attention tout de suite à une chose : une blockchain ne règle pas tous les problèmes, elle en résout certains, en crée d'autres, et son monde regorge d'arnaques. Cette aventure te donne les fondations techniques pour comprendre et garder ton esprit critique : le but est que personne ne puisse te raconter n'importe quoi sur ce mot magique."
    },
    {
      "section_type": "play",
      "title": "Le bloc et la chaîne : l'assemblage",
      "content": "Le mot blockchain se décompose tout seul : des blocs, enchaînés. Un bloc, c'est une page du cahier : il regroupe une série d'inscriptions, les transactions, puis il se referme pour toujours. Comment une page se referme-t-elle ? Grâce à un procédé remarquable appelé l'empreinte numérique. Une empreinte, c'est un code unique calculé à partir du contenu du bloc : change une virgule dans une transaction, et l'empreinte devient complètement différente. C'est comme un sceau impossible à contrefaire. Et voici le génial : chaque nouveau bloc contient l'empreinte du bloc précédent. Les pages sont donc cousues entre elles : la page dix scelle la page neuf, qui scellait la page huit, et ainsi de suite jusqu'à la première page. Vérifions pourquoi c'est solide. Imagine un malhonnête qui veut modifier une transaction dans la page trois. En la changeant, l'empreinte de la page trois change. Mais la page quatre contenait l'ancienne empreinte : l'incohérence saute aux yeux de tout le réseau. Pour cacher sa fraude, le malhonnête devrait recalculer les empreintes de toutes les pages suivantes, plus vite que tout le réseau n'en crée de nouvelles : une course perdue d'avance quand des milliers de machines honnêtes participent. Voilà ce que signifie la fameuse expression blockchain inviolable : ce n'est pas de la magie, c'est de la couture mathématique. Fais le test mental du cahier d'école : si chaque page portait le résumé exact de la précédente, un camarade pourrait-il changer une vieille note sans que ça se voie ? Non, et c'est exactement le principe."
    },
    {
      "section_type": "experiment",
      "title": "Le consensus : écrire sans chef",
      "content": "Reste une question redoutable : si personne ne commande, qui a le droit d'écrire la page suivante ? La réponse tient en un mot : un concours, répété en permanence. Les volontaires, souvent appelés validateurs, mettent leurs ordinateurs au service du réseau et jouent à un jeu mathématique : chercher le résultat d'un calcul très coûteux, basé sur les transactions en attente. Le premier qui trouve annonce sa solution ; tous les autres vérifient, la vérification étant infiniment plus rapide que la recherche ; si la page est correcte, tout le monde l'ajoute à son cahier, et le jeu recommence pour la page suivante. Ce mécanisme de preuve de travail récompense le gagnant, ce qui motive la participation, mais surtout : il rend la triche économiquement absurde. Pour espérer tromper le réseau, il faudrait contrôler la majorité de la puissance de calcul mondiale impliquée, dépense colossale pour un gain douteux, puisque la triche détruirait la confiance et donc la valeur du système lui-même. Il existe d'autres familles de consensus : la preuve d'enjeu, où le droit d'écrire dépend de la quantité que l'on garantit et qu'on peut perdre si l'on triche, mécanisme moins gourmand en électricité. Retiens l'essentiel : l'astuce de la blockchain n'est pas d'empêcher les erreurs ou les malveillances, mais de rendre la fraude détectable et plus coûteuse que l'honnêteté. Note aussi les limites, car un esprit critique doit les connaître : ces concours consomment parfois beaucoup d'énergie, le nombre de transactions par seconde reste modeste sur les grandes chaînes, et le système ne dit rien de la véracité du monde réel : si on inscrit une information fausse dans le cahier, la blockchain la conserve aussi fidèlement qu'une information vraie."
    },
    {
      "section_type": "build",
      "title": "Ce que la blockchain rend possible",
      "content": "Maintenant que tu comprends la mécanique, voyons ce qu'on en construit concrètement. Premier usage, historique : les monnaies numériques, dont le Bitcoin est le pionnier, permettent de transférer de la valeur entre deux personnes sans intermédiaire financier. Second usage : les contrats intelligents, que tu exploreras dans une aventure entière : des programmes qui s'exécutent automatiquement sur la blockchain, sans que personne puisse les arrêter ni les modifier. Troisième usage, très prometteur pour l'Afrique : la traçabilité. Suivre un cacao du producteur ivoirien jusqu'au chocolat européen, enregistrer chaque étape de façon inviolable, pour lutter contre les fraudes et mieux rémunérer les producteurs. Des projets réels testent ce principe sur le cacao, le café, les minerais. Quatrième usage : les diplômes et certificats inviolables. Des établissements inscrivent les diplômes sur blockchain : l'employeur vérifie l'authenticité en quelques secondes, plus besoin de courir après des attestations, et les faux diplômes deviennent détectables. Cinquième usage : l'identité numérique. Des systèmes permettent de prouver qui tu es ou que tu possèdes un titre foncier, sans dépendre d'un guichet unique. Sixième usage en plein essor : les mécanismes de financement collectif transparents, où chaque don est traçable. Garde pourtant ton esprit critique : pour chacun de ces usages, la blockchain n'est pas toujours la meilleure solution. Une base de données classique suffit souvent, et s'avère plus rapide et moins coûteuse. La question du professionnel : ai-je réellement besoin d'un cahier inviolable sans chef ? Si un acteur de confiance central suffit, la blockchain est un marteau pour écraser une mouche. Savoir le dire, c'est déjà être plus malin que bien des vendeurs de rêve."
    },
    {
      "section_type": "mission",
      "title": "Mission : explique-la à ta famille",
      "content": "La vraie maîtrise d'une notion, c'est de savoir l'expliquer simplement. Ta mission : expliquer la blockchain à trois personnes de ton entourage, d'âges différents, et mesurer ta réussite. Protocole. Choisis tes trois personnes : par exemple un parent, un camarade de classe, et une personne âgée de ta cour. Interdiction formelle d'utiliser les mots techniques sans les traduire : pas de consensus, d'empreinte ou de distributed, sans explication immédiate en bon français. Utilise plutôt des images : le cahier copié chez tout le monde ; la page scellée par un sceau mathématique ; le concours de calcul pour le droit d'écrire ; la couture des pages par les empreintes. Pour chaque personne, raconte l'histoire en deux minutes maximum, puis pose une seule question de vérification : selon toi, pourquoi est-il si difficile de tricher dans ce système ? Trois issues possibles. Si la personne répond juste, note sa formulation : elle est probablement meilleure que la tienne, garde-la. Si elle hésite, repère l'image qui a coincé et remplace-la. Si elle décroche avant la fin, ton récit était trop long ou trop abstrait : coupe. Second test de la mission : la question piège. Demande à chaque personne : la blockchain peut-elle empêcher quelqu'un d'écrire un mensonge dans le cahier ? La bonne réponse est non : la blockchain garantit que ce qui est écrit ne peut plus être changé, pas que c'était vrai au départ. Si tu sais expliquer cette nuance à voix haute, tu as tout compris. Compte rendu de mission : note pour chaque personne l'image qui a marché, la longueur idéale de ton récit, et les deux questions qu'on t'a posées. Ce carnet te servira toute la vie : vulgariser est la compétence la plus rentable du technicien."
    },
    {
      "section_type": "project",
      "title": "Projet : ta blockchain papier",
      "content": "Projet final : construire une vraie blockchain, sur papier, avec tes mains, pour voir fonctionner chaque mécanisme de l'intérieur. Matériel : des feuilles, un crayon, et trois volontaires, des camarades ou des frères et sœurs. Étape un : les cahiers. Chaque volontaire tient une feuille identique, son cahier, avec la même page blanche numérotée un. Étape deux : les transactions. Chacun écrit sur un bout de papier trois ou quatre transferts fictifs du style Alice donne cinq unités à Yao, et vous les échangez pour que tout le monde en connaisse quelques-unes. Étape trois : le sceau. Pour chaque page, calculez une empreinte simplifiée : concaténez la première lettre de chaque transaction, le numéro de la page, et comptez les lettres du total : le nombre obtenu fait office d'empreinte, simple mais régulier. Étape quatre : la couture. Sur la page deux, chaque volontaire recopie d'abord l'empreinte de la page un, puis ses transactions, puis calcule la nouvelle empreinte de la page deux. Vos trois cahiers doivent rester identiques : comparez à chaque tour. Étape cinq : l'attaque. Un volontaire joue le fraudeur : il modifie secrètement une transaction de sa page un, puis recopie l'ancienne empreinte sur sa page deux. Les deux autres comparent les cahiers : l'incohérence éclate immédiatement, car l'empreinte calculée sur la vraie page un ne colle plus. Étape six : l'écriture. Débriefe chaque étape en reliant au vrai mécanisme : nos pages sont des blocs, nos empreintes sont des fonctions de hachage simplifiées, notre comparaison est le consensus, notre fraudeur démasqué illustre l'inviolabilité. Tu comprendras la blockchain mieux que la plupart des adultes qui en parlent à la télévision : toi, tu en as construit une."
    }
  ],
  "quiz": [
    {
      "question": "Comment définir simplement une blockchain ?",
      "options": [
        "Un cahier de comptes partagé entre des milliers d'ordinateurs, sans chef unique",
        "Un ordinateur très puissant caché en Suisse",
        "Une application de messagerie sécurisée",
        "Une banque en ligne moderne"
      ],
      "correct_index": 0,
      "explanation": "La blockchain est un registre distribué : copié partout, mis à jour collectivement, et sans autorité centrale capable de modifier l'historique seule."
    },
    {
      "question": "Pourquoi modifier une vieille transaction est-il quasi impossible ?",
      "options": [
        "Parce que les ordinateurs sont éteints la nuit",
        "Parce que chaque bloc scelle le précédent via son empreinte : changer un bloc casse toute la chaîne",
        "Parce que la police surveille le réseau",
        "Parce que les transactions sont chiffrées à l'écriture"
      ],
      "correct_index": 1,
      "explanation": "Chaque bloc contient l'empreinte du précédent : modifier un vieux bloc change son empreinte et rend visibles toutes les suites incohérentes."
    },
    {
      "question": "Que garantit l'empreinte numérique d'un bloc ?",
      "options": [
        "Que le bloc est écrit en français",
        "Qu'une modification même minime du contenu change complètement l'empreinte, rendant la fraude détectable",
        "Que le bloc voyage vite sur internet",
        "Que le bloc est le plus long du réseau"
      ],
      "correct_index": 1,
      "explanation": "L'empreinte est un sceau mathématique : une virgule modifiée produit une empreinte totalement différente, ce qui expose immédiatement toute altération."
    },
    {
      "question": "À quoi sert le mécanisme de consensus d'une blockchain ?",
      "options": [
        "À élire un président du réseau",
        "À choisir collectivement et loyalement qui écrit le bloc suivant, sans chef",
        "À traduire les messages des utilisateurs",
        "À augmenter le prix des transactions"
      ],
      "correct_index": 1,
      "explanation": "Le consensus organise le concours d'écriture : le gagnant propose le bloc, tous vérifient, tous l'adoptent. Personne ne commande seul."
    },
    {
      "question": "La blockchain peut-elle empêcher d'inscrire une information fausse ?",
      "options": [
        "Oui, elle vérifie chaque information",
        "Non : elle garantit que l'inscription ne change plus, pas qu'elle était vraie",
        "Oui, si l'information vient d'un smartphone",
        "Non, elle efface les erreurs automatiquement"
      ],
      "correct_index": 1,
      "explanation": "Nuance clé : la blockchain est inviolable, pas infaillible sur le fond. Un mensonge y est conservé aussi fidèlement qu'une vérité."
    }
  ]
}
