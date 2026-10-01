export default {
  "slug": "defi-intro",
  "title": "DeFi : finance décentralisée",
  "description": "Explore la finance décentralisée : prêts, échanges et garanties automatisés par des contrats, avec leurs promesses réelles et leurs risques sérieux.",
  "story": "Emprunter sans banque, échanger sans guichet, épargner sans intermédiaire : la DeFi automatise la finance en remplaçant les institutions par des programmes. Fascinant sur le plan technique, hasardeux sur le plan pratique : dans cette aventure, tu ouvres le capot des services financiers décentralisés, pour comprendre leurs mécanismes réels, leurs forces et surtout leurs risques, avec une règle : ici on apprend, on ne risque rien.",
  "xp_reward": 140,
  "lessons": [
    {
      "section_type": "discover",
      "title": "La finance sans guichet",
      "content": "DeFi signifie finance décentralisée : des services financiers reconstruits sur blockchain, où les programmes remplacent les institutions. Prenons une image : dans la finance classique, quand tu empruntes, il y a un employé, un dossier, un guichet, une institution qui décide. En DeFi, il y a un programme, appelé protocole, qui applique les mêmes règles à tout le monde, sans jugement, sans horaires, sans guichet. Les services de base : échanger un actif numérique contre un autre, comme au marché, mais par programme interposé ; prêter et emprunter, avec des garanties automatisées ; placer des actifs dans des mécanismes qui génèrent un rendement, un peu comme un compte d'épargne, mais géré par du code. Trois différences fondamentales avec la finance classique. Un : pas d'intermédiaire : tu interagis directement avec le programme, personne ne peut refuser ton dossier. Deux : tout est public : les règles du programme sont écrites dans le code, visible et vérifiable ; les volumes gérés aussi. Trois : la responsabilité bascule entièrement vers toi : pas de service client, pas de réclamation possible, pas de garantie d'État : si le programme a un défaut ou si tu fais une erreur d'adresse, personne ne te rembourse. La DeFi a déjà connu des épisodes retentissants de piratage de programmes, d'effondrement de mécanismes fragiles et de pertes totales pour des utilisateurs. C'est précisément pourquoi cette aventure est pensée comme un cours de compréhension, en aucun cas comme une invitation : à ton âge, tu ne risques rien, tu apprends tout, pour savoir un jour lire ce monde, en professionnel lucide et prudent."
    },
    {
      "section_type": "play",
      "title": "L'échange automatisé : le marché sans vendeur",
      "content": "Le service le plus emblématique de la DeFi : échanger un actif contre un autre, sans trouver d'acheteur ni de vendeur. Comment ? Grâce à une invention remarquable, le marché automatisé. Principe : au lieu d'apparier acheteurs et vendeurs, un programme détient une réserve de deux actifs, disons l'actif A et l'actif B, fournie par des apporteurs de liquidité, des personnes qui déposent leurs deux actifs dans la réserve commune, contre une participation aux frais générés. Quand tu veux échanger, le programme te rend des unités de B, calculées selon une formule simple basée sur les quantités disponibles : plus la réserve de B est abondante, plus ton échange a d'impact faible ; plus elle est vide, plus le prix devient punitif : c'est l'économie de la rareté qui te joue ce tour. Cette mécanique accomplit des prouesses : un marché ouvert jour et nuit, sans intermédiaire, disponible depuis un téléphone, avec des frais partagés entre les apporteurs de liquidité, incités à alimenter le marché. Elle a aussi des limites bien réelles : les frais montent pour les gros échanges ; la formule peut être désavantagée lors de mouvements brutaux de prix, au profit de joueurs plus rapides ; et surtout, le programme lui-même peut contenir un défaut exploité par des pirates : l'histoire de la DeFi compte des dizaines de réserves vidées en une nuit. Retiens la logique de l'apporteur de liquidité : il gagne des fractions de frais, mais il porte le risque de la réserve ; aucun rendement dans ce monde ne tombe du ciel, chacun rémunère un risque ou un service. Cette phrase, garde-la comme boussole permanente pour tous tes cours de finance, décentralisée ou pas."
    },
    {
      "section_type": "experiment",
      "title": "Prêts et garanties : le collatéral",
      "content": "Deuxième service emblématique : emprunter, sans banque. La mécanique s'appelle le prêt sur garantie, et elle est rudimentaire de franchise. Pour emprunter, tu déposes d'abord un dépôt de garantie, appelé collatéral : des actifs numériques d'une valeur supérieure à ce que tu empruntes. Le programme prête alors une autre somme, et tu récupères ta garantie quand tu rembourses, avec les intérêts. Tant que le prêt court, le programme surveille sans relâche le rapport entre ta garantie et ta dette. Si la valeur de ta garantie tombe trop bas, parce que les prix ont bougé, le programme vend automatiquement une partie de ta garantie pour se rembourser : c'est la liquidation, exécutée sans avertissement, sans discussion, par du code. Pourquoi cette exigence de sur-garantie ? Parce que le programme ne connaît ni ton visage, ni ton bulletin de salaire, ni ta parole : la garantie est sa seule assurance. Point culturel à connaître : ce mécanisme s'inspire du microcrédit inversé et des tontines, où la confiance s'appuie sur des engagements tangibles plutôt que sur des dossiers ; il ouvre théoriquement l'accès au crédit à des personnes sans compte bancaire classique, une promesse séduisante pour le continent. Mais regarde la face sombre : si les prix chutent vite, ta garantie fond, la liquidation s'exécute au pire moment, et tu perds de quoi rembourser : c'est arrivé à des milliers d'utilisateurs lors des chutes de marché. Et le risque du programme s'ajoute au risque des prix : un défaut dans le code de liquidation, et c'est la garantie entière qui disparaît. Leçon d'ingénierie financière à retenir : tout rendement de prêt rémunère un risque réel ; toute absence de dossier est compensée par une exigence de garantie ; et toute automatisation applique aussi, sans pitié, ce qui a été mal réglé."
    },
    {
      "section_type": "build",
      "title": "Les risques : ta liste de contrôle de sécurité",
      "content": "Puisqu'on ne comprend vraiment un système qu'en connaissant ses points de rupture, voici la cartographie des risques de la DeFi, classée par origine. Risque de programme : le code public peut contenir des failles ; des équipes de spécialistes, appelées auditeurs, relisent les programmes avant leur lancement, mais des failles passent entre les mailles : des protocoles réputés ont été vidés malgré des audits. Ce qui réduit ce risque : plusieurs audits par des cabinets indépendants, du temps de fonctionnement sans incident, un code simple et lisible, une couverture partielle en cas de piratage. Risque d'actif sous-jacent : si la mécanique repose sur un jeton dont le prix s'effondre ou dont l'émetteur s'avère malhonnête, toute la tour s'écroule : la DeFi empile parfois plusieurs briques douteuses les unes sur les autres : ce sont les imbrications de protocoles. Risque de liquidité : dans les moments de panique, les frais d'échange explosent, les mécanismes se grippent, et sortir de sa position coûte très cher. Risque humain, le plus fréquent de tous : erreur d'adresse, signature d'une transaction piège, clé privée exposée, appât du rendement irréaliste : la grande majorité des pertes individuelles vient de là, pas des pirates. Face à cette carte, la liste de contrôle de sécurité, à connaître par cœur pour toi et les tiens : vérifier toujours l'adresse exacte du site, lettre par lettre, car les clones trompeurs pullulent ; ne jamais signer une transaction sans comprendre ce qu'elle autorise ; refuser tout rendement garanti élevé, qui est toujours un leurre ou une chaîne de Ponzi ; ne jamais engager une somme dont on ne peut pas accepter la perte totale ; et se méfier du premier venu qui offre son aide non sollicitée. Garde cette grille : elle servira à ta famille bien au-delà de la DeFi, car ses pièges sont ceux de toute la finance en ligne."
    },
    {
      "section_type": "mission",
      "title": "Mission : audite les promesses de la DeFi",
      "content": "Mission d'auditeur : apprendre à évaluer un protocole DeFi sur des critères objectifs, sans jamais y engager le moindre argent. Protocole de mission en cinq étapes. Étape une : la sélection. Choisis un protocole DeFi connu, présenté dans un article, une vidéo ou un forum, peu importe sa réputation, bonne ou mauvaise : ton but est la méthode, pas le verdict attendu. Étape deux : le document fondateur. Cherche sa documentation technique : un protocole sérieux publie ses règles, sa formule d'échange ou de prêt, ses mécanismes de garantie, et l'adresse vérifiable de ses programmes. Si tu ne trouves aucune documentation, note-le : premier signal rouge. Étape trois : les audits. Cherche les rapports d'audit indépendants : qui a relu le code, quand, et ce que les auditeurs ont exigé comme corrections. Un protocole sans aucun audit mérite la méfiance ; un protocole audité reste perfectible, mais prouve une démarche sérieuse. Étape quatre : l'historique public. Sur un explorateur de blockchain, observe la durée de fonctionnement, les volumes récents, les incidents passés : piratages, interruptions, litiges. Étape cinq : la grille de notation. Note de zéro à trois chaque critère : documentation, audits, historique, transparence de l'équipe, simplicité du mécanisme, et réalisme des rendements annoncés. Puis rédige ta conclusion en trois formats : une phrase pour un enfant, un paragraphe pour un adulte pressé, une page pour un lecteur sérieux. Compare ton audit avec celui d'un camarade sur le même protocole : vos écarts de notation vous apprendront autant l'un que l'autre. Ce que tu viens de faire porte un nom dans le métier : l'analyse de risque, la compétence financière la plus demandée au monde, et la plus rare."
    },
    {
      "section_type": "project",
      "title": "Projet : ta banque de cour en papier",
      "content": "Projet final : faire tourner une banque DeFi simplifiée, en papier et en bonpoints, pour comprendre chaque mécanisme en le vivant. Recrute trois volontaires : un gérant de réserve, un emprunteur, un apporteur de liquidité. Matériel : un cahier de comptes, des billets de papier, des jetons de garantie, style cauris, et des règles écrites au tableau. Mécanisme un : la réserve. L'apporteur dépose dix billets et dix cauris dans la réserve commune ; le gérant inscrit les dépôts dans le cahier, et l'apporteur reçoit une part de réserve, qui lui donnera droit aux frais. Mécanisme deux : l'échange. Un visiteur veut échanger trois billets contre des cauris ; le gérant applique la formule du marché automatisé : il prélève une commission d'un pour cent, partagée avec l'apporteur. Joue dix échanges et observe la balance des frais revenant à l'apporteur. Mécanisme trois : le prêt sur garantie. L'emprunteur dépose six cauris de garantie et reçoit quatre billets de prêt ; le gérant surveille le ratio, selon les cours affichés au tableau, que tu fais varier à chaque tour de jeu. Mécanisme quatre : la liquidation. Annonce une chute des cauris : le ratio de l'emprunteur casse le seuil ; le gérant exécute la liquidation sans discussion, en vendant la garantie, et note l'opération au cahier. Fais vivre à ton emprunteur la frustration d'une liquidation à contretemps : c'est le cœur pédagogique du jeu. Mécanisme cinq : le comité de sécurité. Rédige avec tes joueurs les trois règles qui auraient évité les pertes de la partie : fixer un seuil plus prudent, limiter les sommes engagées, vérifier chaque inscription. Débriefe en reliant chaque mécanisme au monde réel : la réserve, c'est le marché automatisé ; le ratio, c'est le collatéral ; la vente forcée, c'est la liquidation ; tes trois règles, c'est exactement le travail des ingénieurs de risque."
    }
  ],
  "quiz": [
    {
      "question": "Que remplace principalement un protocole DeFi ?",
      "options": [
        "Les professeurs de mathématiques",
        "Les intermédiaires financiers : des programmes appliquent des règles connues à l'avance",
        "Les marchés de légumes",
        "Les réseaux sociaux"
      ],
      "correct_index": 1,
      "explanation": "La DeFi remplace guichets et dossiers par des programmes : mêmes règles pour tous, sans horaires ni jugement, mais aussi sans recours en cas d'erreur."
    },
    {
      "question": "Comment fonctionne un marché automatisé d'échange ?",
      "options": [
        "Il apparie acheteurs et vendeurs entre eux",
        "Un programme détient une réserve des deux actifs et calcule les échanges selon les quantités disponibles",
        "Il envoie un SMS au banquier",
        "Il attend la nuit pour changer les prix"
      ],
      "correct_index": 1,
      "explanation": "Pas de confrontation entre acheteur et vendeur : la réserve commune et sa formule de prix font le marché, et les frais rémunèrent les apporteurs de liquidité."
    },
    {
      "question": "Pourquoi un prêt DeFi exige-t-il une garantie supérieure au montant emprunté ?",
      "options": [
        "Pour décorer la blockchain",
        "Parce que le programme ne connaît pas l'emprunteur : la garantie est sa seule assurance, vendue automatiquement si elle tombe trop bas",
        "Parce que la loi l'interdit autrement",
        "Pour faire des économies de papier"
      ],
      "correct_index": 1,
      "explanation": "Sans dossier ni visage, la sur-garantie protège le programme : si sa valeur casse le seuil, la liquidation s'exécute automatiquement, sans avertissement."
    },
    {
      "question": "Que se passe-t-il lors d'une liquidation en DeFi ?",
      "options": [
        "Le programme vend automatiquement la garantie pour se rembourser, quand sa valeur passe sous le seuil",
        "Un banquier appelle pour négocier",
        "Le prêt est pardonné",
        "L'emprunteur reçoit un bonus"
      ],
      "correct_index": 0,
      "explanation": "La liquidation est l'exécution automatique et sans pitié du code : souvent au pire moment pour l'emprunteur, elle peut dépasser le montant de sa dette."
    },
    {
      "question": "Quel est le risque le plus fréquent de perte individuelle en DeFi ?",
      "options": [
        "La foudre sur les serveurs",
        "L'erreur humaine : mauvaise adresse, transaction piège signée, clé exposée, appât du rendement irréaliste",
        "La pluie sur la blockchain",
        "Le changement de fuseau horaire"
      ],
      "correct_index": 1,
      "explanation": "La grande majorité des pertes individuelles vient d'erreurs humaines et d'appâts, avant même les failles de code : d'où la liste de contrôle de sécurité à connaître par cœur."
    }
  ]
}
