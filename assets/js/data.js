/* ============================================================
   AktibCode — contenu éditorial
   Pour publier un article : ajoutez un objet dans ARTICLES,
   puis exécutez `node build.mjs` pour générer sa page.
   ============================================================ */

const SITE = {
  name: "AktibCode",
  baseline: "La tech, sans le jargon.",
  description:
    "AktibCode décrypte la tech pour celles et ceux qui n’ont pas fait d’informatique. Des articles clairs, honnêtes et sans condescendance.",
  email: "mbairassem@aktibcode.com",
  year: 2026,
};

const CATEGORIES = {
  "Décryptage": { color: "#E8491D" },
  "Intelligence artificielle": { color: "#6A4BFF", short: "IA" },
  "Sécurité": { color: "#1F6B54" },
  "Fondamentaux": { color: "#2C5FD6" },
  "Culture": { color: "#A97600" },
};

const ARTICLES = [
  {
    slug: "api-prise-electrique",
    title: "Une API, c’est une prise électrique pour logiciels",
    dek: "Derrière chaque paiement en ligne, chaque bulletin météo et chaque réponse de chatbot, il y a une API. Voici ce que c’est, sans jargon.",
    category: "Décryptage",
    date: "2026-11-18",
    author: "Mbairassem",
    cover: "assets/images/api.jpg",
    coverAlt: "Mbarassem, en chemise noire brodée, pose à côté d’une grande prise électrique orange reliée à deux serveurs verts.",
    featured: true,
    pullQuote: "Une API ne vous donne pas la centrale électrique. Elle vous donne une prise aux normes, et le mode d’emploi.",
    blocks: [
      { type: "p", text: "Vous réservez un train, vous payez par carte, vous consultez la météo sur votre téléphone. Dans les trois cas, un logiciel demande quelque chose à un autre logiciel — et reçoit une réponse en une fraction de seconde. Ce dialogue a un nom : <strong>API</strong>, pour <em>Application Programming Interface</em>, ou « interface de programmation applicative »." },
      { type: "p", text: "Le mot impressionne. La chose est plus simple qu’elle n’y paraît : une API est un mode d’emploi pour faire parler deux programmes entre eux, sans qu’aucun des deux n’ait besoin de connaître les entrailles de l’autre." },
      { type: "h2", text: "Deux logiciels qui ne parlent pas la même langue" },
      { type: "p", text: "Imaginez une librairie qui veut afficher les avis de ses clients, mais qui n’a pas d’équipe pour construire un service de modération. Elle utilise une API de modération : elle envoie le texte, reçoit un verdict. Elle n’a pas besoin de savoir quel modèle tourne derrière, ni sur quel serveur, ni dans quel langage il est écrit." },
      { type: "p", text: "Sans API, il faudrait recopier les données à la main, ou connecter directement les deux systèmes. C’est fragile, lent, et chaque changement d’un côté casserait l’autre. L’API ajoute une <strong>frontière stable</strong> : tant que le contrat ne change pas, chacun peut évoluer de son côté." },
      { type: "h2", text: "La prise, le voltage et le mode d’emploi" },
      { type: "p", text: "L’analogie de la prise électrique fonctionne étonnamment bien. Une prise standardise trois choses : la <strong>forme</strong> (les broches entrent ou non), la <strong>tension</strong> (ce qui circule) et les <strong>règles de sécurité</strong> (ce qu’on peut brancher sans tout faire disjoncter)." },
      { type: "p", text: "Une API fait pareil. Elle définit des adresses (les <em>endpoints</em>), un format d’échange (souvent du JSON, un texte structuré en clés et valeurs) et des règles : quelles données envoyer, ce qui est autorisé, ce qui sera renvoyé en cas d’erreur. Vous branchez votre logiciel, vous respectez le contrat, ça marche." },
      { type: "quote", text: "Une API ne vous donne pas la centrale électrique. Elle vous donne une prise aux normes, et le mode d’emploi." },
      { type: "h2", text: "Requête, réponse : le dialogue en pratique" },
      { type: "p", text: "La plupart des API du web suivent le même rituel. Le logiciel client envoie une <strong>requête</strong> à une adresse, avec une méthode (lire, créer, modifier, supprimer), éventuellement des paramètres et une clé d’identification. Le service répond avec un code (200 si tout va bien, 404 si la ressource n’existe pas) et des données." },
      { type: "code", lang: "http", code: "GET /v1/meteo?ville=Ndjamena\nAuthorization: Bearer CLE_SECRETE\n\n→ 200 OK\n{ \"temperature\": 34, \"ciel\": \"dégagé\" }" },
      { type: "p", text: "Ce aller-retour se produit des milliards de fois par jour : quand votre application bancaire vérifie un solde, quand un site affiche une carte, quand un assistant génère une réponse. Vous ne voyez que le résultat. La plomberie, elle, est faite d’API." },
      { type: "h2", text: "Un contrat, pas une télécommande magique" },
      { type: "p", text: "Une API n’ouvre pas un accès illimité. Elle expose volontairement une partie d’un système, avec des limites : un nombre de requêtes par minute, un périmètre de données, une clé révocable. C’est une <strong>porte avec un videur</strong>, pas un trou dans le mur." },
      { type: "p", text: "C’est aussi une dépendance. Si le fournisseur change son contrat, augmente ses prix ou ferme le service, votre produit peut s’arrêter du jour au lendemain. Les équipes sérieuses surveillent donc trois choses : la stabilité de l’API, son prix à l’échelle, et ce qui se passe si elle disparaît." },
      { type: "h2", text: "Trois idées reçues à jeter" },
      { type: "list", items: [
        "<strong>« Une API, c’est une interface graphique. »</strong> Non : pas d’écran, pas de boutons. C’est une interface pour programmes.",
        "<strong>« Une API publique est gratuite. »</strong> Pas forcément. Publique signifie accessible ; gratuite est une décision commerciale, souvent limitée dans le temps ou en volume.",
        "<strong>« C’est un sujet de développeurs. »</strong> Les API décident de ce que votre entreprise peut faire, à quel prix et avec quelles données. C’est aussi un sujet de direction."
      ] },
      { type: "note", title: "Le mot du lexique", text: "Retrouvez la définition d’<a href='lexique.html#api'>API</a> et de <a href='lexique.html#protocole'>protocole</a> dans notre lexique." }
    ],
    takeaways: [
      "Une API est un contrat qui permet à deux logiciels de se parler sans se connaître.",
      "Elle standardise l’adresse, le format des données et les règles d’accès.",
      "Elle crée de la modularité, mais aussi une dépendance à surveiller."
    ]
  },
  {
    slug: "ia-perroquet-statistique",
    title: "L’IA générative est un perroquet statistique",
    dek: "Elle ne comprend pas ce qu’elle écrit. Elle calcule ce qui a le plus de chances de venir après. Et c’est déjà une petite révolution.",
    category: "Intelligence artificielle",
    date: "2026-11-12",
    author: "Mbairassem",
    cover: "assets/images/ia.jpg",
    coverAlt: "Mbarassem tend un jeton orange vers un perroquet mécanique en circuits imprimés, entouré de graphiques.",
    pullQuote: "Un modèle de langage ne cherche pas la vérité. Il cherche la suite la plus probable.",
    blocks: [
      { type: "p", text: "Demandez à un modèle de langage de vous expliquer la photosynthèse, d’écrire un poème sur les réseaux ou de corriger un e-mail. La réponse arrive, fluide, souvent convaincante. D’où vient-elle ? Pas d’une base de données de réponses toute faites, ni d’une compréhension humaine. D’un calcul de probabilités, répété mot après mot." },
      { type: "h2", text: "Un moteur à deviner la suite" },
      { type: "p", text: "Un modèle de langage est entraîné sur d’immenses quantités de textes. Il apprend des régularités : quels mots apparaissent souvent ensemble, dans quels contextes, avec quelles tournures. On pourrait le décrire comme un <strong>perroquet statistique</strong> : il a une mémoire prodigieuse des formes du langage, mais aucune expérience du monde." },
      { type: "p", text: "Quand il écrit, il découpe votre demande en petites unités (des <em>tokens</em>) et estime, pour chacune, la suite la plus plausible. Il choisit un token, l’ajoute au texte, recommence. Cette mécanique explique beaucoup de ses forces — et de ses failles." },
      { type: "quote", text: "Un modèle de langage ne cherche pas la vérité. Il cherche la suite la plus probable." },
      { type: "h2", text: "Pourquoi elle invente parfois" },
      { type: "p", text: "On appelle <strong>hallucination</strong> le fait d’affirmer avec aplomb une chose fausse : une référence inexistante, une date inventée, une loi qui n’a jamais existé. Ce n’est pas un bug isolé, mais une conséquence de la méthode. Le modèle ne vérifie pas les faits ; il produit une suite vraisemblable. Et une source inventée peut être statistiquement très crédible." },
      { type: "p", text: "C’est pourquoi les outils sérieux ajoutent des garde-fous : recherche dans des documents fournis, citation des sources, calculs exécutés par un programme, relecture humaine. L’IA ne remplace pas la vérification. Elle déplace le travail vers elle." },
      { type: "h2", text: "D’où viennent les réponses ?" },
      { type: "p", text: "Les modèles sont entraînés sur des corpus constitués de pages web, de livres, de code et parfois de données achetées ou produites en interne. Ces corpus contiennent des biais, des erreurs, des contenus protégés, des langues sur-représentées et d’autres presque absentes. Un modèle francophone de qualité ne va pas de soi : il dépend de ce qu’on lui a donné à lire." },
      { type: "p", text: "Il faut aussi distinguer l’entraînement des réglages. Les concepteurs ajustent ensuite le modèle pour qu’il réponde poliment, refuse certaines demandes ou suive des consignes. Ces réglages sont des choix humains. L’outil n’est donc pas neutre : il incarne une vision de ce qu’une « bonne réponse » doit être." },
      { type: "h2", text: "Ce qu’elle sait bien faire" },
      { type: "list", items: [
        "Reformuler, résumer, changer de ton ou de niveau de langue.",
        "Proposer une première version d’un texte, d’un plan, d’un bout de code.",
        "Expliquer un concept de plusieurs façons, jusqu’à trouver celle qui passe.",
        "Classer, extraire, comparer des informations dans un corpus fourni.",
        "Servir de partenaire de brainstorming, à condition de garder l’esprit critique."
      ] },
      { type: "h2", text: "Les angles morts" },
      { type: "p", text: "Un modèle n’a pas de mémoire fiable de votre conversation passée, pas de sens commun garanti, pas d’accès spontané à l’actualité, et aucune obligation de dire « je ne sais pas ». Il peut aussi reproduire des stéréotypes présents dans ses données. Enfin, l’usage de ces outils pose des questions concrètes : confidentialité des textes envoyés, coût énergétique, droit d’auteur, dépendance à quelques fournisseurs." },
      { type: "note", title: "Une bonne habitude", text: "Traitez la réponse d’une IA comme la proposition d’un collègue brillant mais pressé : utile pour démarrer, jamais suffisante pour publier sans relire." },
      { type: "p", text: "L’IA générative n’est ni magique ni stupide. C’est une technologie de langage, puissante et faillible. La bonne question n’est pas « a-t-elle raison ? », mais « comment vérifier, et à quelle étape ? »." }
    ],
    takeaways: [
      "Un modèle de langage prédit la suite probable d’un texte, il ne consulte pas une vérité.",
      "Les hallucinations sont inhérentes à la méthode : la vérification reste indispensable.",
      "Ses bons usages reposent sur des sources fiables et un regard humain."
    ]
  },
  {
    slug: "https-cadenas",
    title: "HTTPS : ce qui se passe quand le cadenas apparaît",
    dek: "Le petit cadenas ne dit pas que le site est honnête. Il dit que la conversation est scellée. La nuance vaut de l’or.",
    category: "Sécurité",
    date: "2026-11-05",
    author: "Mbairassem",
    cover: "assets/images/https.jpg",
    coverAlt: "Mbarassem devant une enveloppe scellée, un grand cadenas vert et une clé orange.",
    pullQuote: "HTTPS protège le trajet, pas l’intention. Un site de phishing peut très bien avoir un cadenas.",
    blocks: [
      { type: "p", text: "Quand vous saisissez un mot de passe, le petit cadenas à côté de l’adresse vous rassure. Mais que garantit-il exactement ? Pour le comprendre, il faut regarder ce qui circule entre votre navigateur et le serveur — et ce qui pourrait l’intercepter." },
      { type: "h2", text: "HTTP, la carte postale" },
      { type: "p", text: "Le web historique utilise HTTP, un protocole simple : votre navigateur envoie une demande, le serveur renvoie une réponse. Le problème, c’est que cette conversation voyage en clair. Sur un Wi-Fi public, un opérateur ou un routeur mal configuré peut lire vos requêtes, vos cookies de session, vos formulaires. C’est comme envoyer une carte postale : tout le monde sur le trajet peut la lire." },
      { type: "p", text: "HTTPS ajoute une couche de chiffrement, TLS, entre votre navigateur et le serveur. Le contenu devient illisible pour les intermédiaires. Mais HTTPS ne fait pas que chiffrer : il authentifie aussi le serveur et garantit que le message n’a pas été modifié en route." },
      { type: "h2", text: "TLS, l’enveloppe scellée" },
      { type: "p", text: "L’image de l’enveloppe scellée est utile, à condition d’ajouter une étape : avant de s’écrire, les deux parties doivent se mettre d’accord sur une clé secrète, sans que personne ne l’entende. C’est le fameux <strong>échange de clés</strong>. La cryptographie asymétrique permet de transmettre cette clé de façon sûre ; ensuite, la conversation utilise un chiffrement symétrique, plus rapide." },
      { type: "p", text: "Concrètement, en quelques allers-retours de quelques millisecondes, le navigateur et le serveur se présentent, négocient une version de TLS, vérifient l’identité du serveur, puis établissent une clé de session. Tout le reste — la page, les formulaires, les cookies — voyage dans un tunnel chiffré." },
      { type: "h2", text: "Le certificat, la carte d’identité" },
      { type: "p", text: "Comment savoir que le serveur en face est bien celui de votre banque, et pas un imposteur ? Grâce à un <strong>certificat</strong>, délivré par une autorité de certification reconnue. Le certificat associe un nom de domaine à une clé publique, et l’autorité garantit avoir vérifié que le demandeur contrôle bien ce domaine." },
      { type: "p", text: "Votre navigateur vérifie ce certificat : est-il valide, signé par une autorité de confiance, encore en date, et correspond-il au nom du site ? Si ce n’est pas le cas, un avertissement s’affiche. Il ne faut pas le contourner à la légère." },
      { type: "quote", text: "HTTPS protège le trajet, pas l’intention. Un site de phishing peut très bien avoir un cadenas." },
      { type: "h2", text: "Ce que le cadenas ne garantit pas" },
      { type: "list", items: [
        "Que le site est honnête : un escroc peut obtenir un certificat pour son propre domaine.",
        "Que le contenu est vrai : HTTPS protège l’intégrité du message, pas sa sincérité.",
        "Que votre ordinateur est sain : un logiciel malveillant peut lire l’écran avant le chiffrement.",
        "Que votre correspondant est bien votre banque si vous avez tapé une adresse trompeuse.",
        "Que les métadonnées sont cachées : le nom du site visité reste souvent visible."
      ] },
      { type: "h2", text: "Trois réflexes utiles" },
      { type: "p", text: "Un, vérifiez le <strong>nom de domaine</strong>, pas seulement le cadenas : « banque-secure.net » n’est pas « banque.com ». Deux, ne saisissez jamais un mot de passe après avoir ignoré un avertissement de certificat. Trois, activez la double authentification : même si un mot de passe fuit, elle limite les dégâts." },
      { type: "p", text: "HTTPS est une brique essentielle, pas un sceau de confiance absolu. Le cadenas dit « la conversation est protégée ». À vous de vérifier avec qui vous parlez." }
    ],
    takeaways: [
      "HTTPS chiffre la conversation et authentifie le serveur grâce à un certificat.",
      "Il ne garantit ni l’honnêteté du site, ni la véracité de son contenu.",
      "Vérifiez toujours le nom de domaine, même quand le cadenas est présent."
    ]
  },
  {
    slug: "cloud-beton",
    title: "Le cloud n’existe pas — il est en béton quelque part",
    dek: "« Dans le cloud » ne veut pas dire « dans les airs ». Cela veut dire : sur l’ordinateur de quelqu’un d’autre, dans un bâtiment très réel.",
    category: "Décryptage",
    date: "2026-10-28",
    author: "Mbairassem",
    cover: "assets/images/cloud.jpg",
    coverAlt: "Mbarassem dans une allée de serveurs verts, sous un nuage de béton relié par des câbles.",
    pullQuote: "Le cloud, c’est l’informatique de quelqu’un d’autre, facturée à l’usage, derrière un contrat.",
    blocks: [
      { type: "p", text: "Vos photos, vos e-mails, les vidéos que vous regardez : une partie de votre vie numérique vit « dans le cloud ». L’expression suggère quelque chose de léger, d’aérien, presque immatériel. La réalité est plus lourde : des bâtiments, des climatiseurs, des câbles sous-marins et des groupes électrogènes." },
      { type: "h2", text: "Le nuage est un bâtiment" },
      { type: "p", text: "Un centre de données est une usine à calculer. Des milliers de serveurs empilés dans des racks, alimentés en électricité, refroidis en permanence, connectés à plusieurs opérateurs réseau. On y trouve des batteries, des générateurs, des systèmes anti-incendie, et des équipes qui se relaient 24 heures sur 24." },
      { type: "p", text: "Ces bâtiments consomment beaucoup d’énergie et d’eau, occupent des terrains et ont une empreinte matérielle bien réelle : béton, cuivre, terres rares, composants électroniques. Le cloud n’efface pas l’informatique. Il la déplace et la mutualise." },
      { type: "h2", text: "Pourquoi on appelle ça « cloud »" },
      { type: "p", text: "Dans les schémas techniques des années 1990, on dessinait un nuage pour représenter « le réseau » : un ensemble de machines dont on ne voulait pas détailler le fonctionnement. L’image est restée. Elle arrangeait tout le monde : côté utilisateur, tout paraît simple ; côté fournisseur, la complexité est cachée dans le contrat." },
      { type: "quote", text: "Le cloud, c’est l’informatique de quelqu’un d’autre, facturée à l’usage, derrière un contrat." },
      { type: "h2", text: "Ce qu’on loue exactement" },
      { type: "p", text: "Le cloud regroupe plusieurs couches. On peut louer des machines brutes (IaaS), une plateforme prête à exécuter des applications (PaaS), ou un logiciel complet accessible par navigateur (SaaS). On peut aussi louer du stockage, des bases de données, des services d’intelligence artificielle, des réseaux." },
      { type: "list", items: [
        "<strong>IaaS</strong> : des serveurs et du stockage virtuels, que vous administrez.",
        "<strong>PaaS</strong> : un environnement d’exécution, sans gérer la machine.",
        "<strong>SaaS</strong> : l’application finie, comme une messagerie ou un outil de gestion."
      ] },
      { type: "p", text: "L’intérêt est réel : pas d’achat de matériel, une capacité qui s’adapte à la demande, des sauvegardes et une sécurité de base souvent incluses. Pour une petite structure, c’est parfois plus sûr qu’un serveur mal configuré dans un placard." },
      { type: "h2", text: "Les coûts cachés" },
      { type: "p", text: "La facture cloud est élastique, dans les deux sens. Les tarifs à l’usage peuvent sembler minuscules, puis devenir vertigineux quand le trafic explose ou qu’une erreur fait tourner des machines inutiles. Les sorties de données (egress) sont souvent facturées, parfois cher. Et chaque service managé ajoute sa propre ligne." },
      { type: "p", text: "Il y a aussi des coûts moins visibles : la complexité des architectures, la dépendance à un fournisseur, la difficulté à changer d’hébergeur, et la perte de compétences internes. Une équipe qui ne sait plus administrer un serveur devient captivante pour son fournisseur." },
      { type: "h2", text: "Souveraineté et dépendance" },
      { type: "p", text: "Où sont stockées les données ? Qui peut y accéder ? Quel droit s’applique ? Ces questions comptent pour une administration, une banque, un hôpital. Le cloud dit « mondial », mais les lois, elles, restent territoriales. Choisir un fournisseur, c’est aussi choisir un régime juridique et une chaîne de sous-traitants." },
      { type: "note", title: "À vérifier avant de signer", text: "Localisation des données, conditions de sortie, engagement de disponibilité, coût des transferts, procédure en cas de panne, et ce qui se passe si vous voulez partir." },
      { type: "p", text: "Le cloud est un outil formidable, à condition de savoir ce qu’on loue. Ce n’est pas un lieu magique : c’est un contrat, des machines et des câbles. Les regarder en face évite les mauvaises surprises." }
    ],
    takeaways: [
      "Le cloud repose sur des centres de données physiques, énergivores et territoriaux.",
      "On loue des machines, des plateformes ou des logiciels — avec des contrats et des limites.",
      "La dépendance et les coûts de sortie méritent d’être anticipés dès le départ."
    ]
  },
  {
    slug: "base-de-donnees-classeur",
    title: "Une base de données, c’est un classeur avec des règles",
    dek: "Sans base de données, votre boutique en ligne vendrait le même livre à deux personnes. Ou perdrait la moitié de ses commandes au redémarrage.",
    category: "Fondamentaux",
    date: "2026-10-20",
    author: "Mbairassem",
    cover: "assets/images/base-de-donnees.jpg",
    coverAlt: "Mbarassem ouvre un tiroir de classeur rempli de fiches orange dans une salle d’archives.",
    pullQuote: "Une base de données ne stocke pas seulement des informations. Elle fait respecter des promesses.",
    blocks: [
      { type: "p", text: "Un tableur suffit pour gérer une liste d’invités. Il devient vite dangereux pour une boutique, une banque ou un hôpital. Pourquoi ? Parce qu’une base de données ne se contente pas d’enregistrer : elle garantit que les informations restent cohérentes, même quand plusieurs personnes écrivent en même temps." },
      { type: "h2", text: "Le carnet de notes ne suffit pas" },
      { type: "p", text: "Imaginez un cahier où chaque vente est notée à la main. Deux vendeurs consultent le stock, voient « 1 exemplaire restant », le vendent chacun. Résultat : deux clients, un livre. Le problème n’est pas la vitesse d’écriture, mais l’absence de règle partagée au moment de la décision." },
      { type: "p", text: "Une base de données résout ce type de situation avec des <strong>transactions</strong> : un ensemble d’opérations qui réussit entièrement ou échoue entièrement. Réserver un livre puis décrémenter le stock se fait dans une même unité. Si l’une des étapes échoue, tout est annulé." },
      { type: "h2", text: "Tables, lignes, colonnes" },
      { type: "p", text: "La base relationnelle, la plus répandue, range les données en <strong>tables</strong>. Une table « clients » contient des lignes (un client par ligne) et des colonnes (nom, e-mail, date d’inscription). Une table « commandes » contient les commandes. Chaque colonne a un type : texte, nombre, date, booléen." },
      { type: "p", text: "Ce cadre paraît rigide. C’est justement sa force : impossible d’inscrire « hier » dans une colonne de date, ou de créer une commande sans client. La base refuse les données qui ne respectent pas les règles qu’on lui a données." },
      { type: "h2", text: "La clé qui relie tout" },
      { type: "p", text: "Chaque ligne possède souvent un identifiant unique, la <strong>clé primaire</strong>. Une commande référence le client par sa clé : c’est une <strong>clé étrangère</strong>. Ces liens évitent de recopier le nom et l’adresse du client dans chaque commande — une source classique d’incohérences." },
      { type: "p", text: "Relier les tables permet ensuite de poser des questions : « quels clients ont commandé plus de trois fois ce mois-ci ? », « quel produit revient le plus souvent ? ». C’est le rôle du langage <strong>SQL</strong>, qui reste, des décennies après sa création, l’une des compétences les plus utiles en informatique." },
      { type: "quote", text: "Une base de données ne stocke pas seulement des informations. Elle fait respecter des promesses." },
      { type: "h2", text: "Trouver vite : les index" },
      { type: "p", text: "Chercher dans un million de lignes sans index, c’est feuilleter tout un dictionnaire pour trouver un mot. Un <strong>index</strong> est une structure de tri qui permet d’aller directement à la bonne page. Il accélère les lectures, mais ralentit un peu les écritures et occupe de l’espace : tout est affaire de compromis." },
      { type: "h2", text: "SQL, NoSQL : un choix, pas une religion" },
      { type: "p", text: "Les bases relationnelles excellent quand les données sont structurées et les liens importants. Les bases dites NoSQL (documents, clé-valeur, graphes) proposent d’autres modèles, souvent plus souples ou plus distribués. Elles ne remplacent pas les premières : elles répondent à d’autres contraintes, comme des volumes massifs ou des schémas très changeants." },
      { type: "p", text: "Une base de données correctement conçue est invisible. Elle ne se remarque que le jour où elle manque : quand un doublon apparaît, qu’une commande disparaît ou qu’un fichier est écrasé. C’est une infrastructure discrète, mais c’est souvent le cœur d’un service." }
    ],
    takeaways: [
      "Une base garantit la cohérence des données grâce à des règles et des transactions.",
      "Les clés relient les tables et évitent les duplications dangereuses.",
      "Les index accélèrent les recherches, au prix d’un peu d’espace et d’écriture."
    ]
  },
  {
    slug: "clic-page-300ms",
    title: "Du clic à la page : le voyage de 300 millisecondes",
    dek: "Vous tapez une adresse, vous appuyez sur Entrée, la page apparaît. Entre les deux, une chaîne logistique invisible.",
    category: "Fondamentaux",
    date: "2026-10-09",
    author: "Mbairassem",
    cover: "assets/images/web.jpg",
    coverAlt: "Mbarassem appuie sur un gros bouton orange devant un chronomètre et des fenêtres empilées.",
    pullQuote: "Chaque page web est le résultat d’une négociation entre des dizaines de machines qui ne se sont jamais vues.",
    blocks: [
      { type: "p", text: "Un clic, et la page est là. Cette immédiateté cache une séquence précise : traduire un nom en adresse, ouvrir une connexion, demander un document, le fabriquer, le mettre en page. Comprendre ce trajet aide à diagnostiquer les lenteurs — et à mieux comprendre le web." },
      { type: "h2", text: "Le GPS : le DNS" },
      { type: "p", text: "Vous tapez « aktibcode.com ». Votre ordinateur ne sait pas où se trouve ce serveur. Il interroge donc le <strong>DNS</strong>, l’annuaire d’Internet, qui traduit le nom en adresse IP — une suite de chiffres qui identifie une machine. C’est le bottin du web, distribué et mis en cache un peu partout pour répondre vite." },
      { type: "p", text: "Si l’entrée est en cache, la réponse arrive en quelques millisecondes. Sinon, la requête remonte une chaîne de serveurs DNS jusqu’à trouver l’adresse. C’est souvent la première source de lenteur perçue, surtout sur un réseau mobile instable." },
      { type: "h2", text: "La prise de contact" },
      { type: "p", text: "Une fois l’adresse connue, votre navigateur ouvre une connexion avec le serveur (TCP), puis négocie le chiffrement (TLS) si l’adresse est en HTTPS. Ces étapes ajoutent des allers-retours. Sur une connexion lente, chaque aller-retour coûte cher ; d’où l’importance de les limiter et de les réutiliser." },
      { type: "h2", text: "La commande : HTTP" },
      { type: "p", text: "Le navigateur envoie ensuite une requête HTTP : « donne-moi cette page », avec des en-têtes qui précisent la langue, le type de contenu accepté, les cookies, etc. Le serveur répond avec un code de statut, des en-têtes et un corps de page." },
      { type: "code", lang: "http", code: "GET /articles HTTP/2\nHost: aktibcode.com\n\n→ 200 OK\nContent-Type: text/html; charset=utf-8" },
      { type: "h2", text: "La cuisine du serveur" },
      { type: "p", text: "Derrière, le serveur (ou une fonction, une API) prépare la réponse : il interroge une base de données, applique des règles, assemble un gabarit HTML. Parfois la page est déjà prête et stockée en <strong>cache</strong> ; c’est souvent ce qui fait la différence entre 50 et 500 millisecondes." },
      { type: "p", text: "La réponse traverse ensuite des réseaux, des opérateurs et parfois un CDN, un réseau de serveurs proches de vous qui garde des copies des fichiers. Plus la copie est proche, plus le voyage est court." },
      { type: "h2", text: "Le montage dans le navigateur" },
      { type: "p", text: "Le navigateur lit le HTML, découvre des styles (CSS) et des scripts (JavaScript), télécharge les images et les polices, construit l’arbre de la page, calcule la mise en page, puis peint les pixels. Chaque ressource manquante est une nouvelle requête. Une image lourde ou un script bloquant peut retarder l’affichage de toute la page." },
      { type: "quote", text: "Chaque page web est le résultat d’une négociation entre des dizaines de machines qui ne se sont jamais vues." },
      { type: "h2", text: "Pourquoi tout peut ralentir" },
      { type: "list", items: [
        "Le DNS ou la connexion mettent trop de temps à répondre.",
        "Le serveur fabrique la page à chaque visite, sans cache.",
        "Les images sont énormes et les scripts bloquent le rendu.",
        "Le réseau mobile est mauvais, ou le Wi-Fi saturé.",
        "Le navigateur est ralenti par des extensions ou un appareil ancien."
      ] },
      { type: "p", text: "La vitesse n’est pas qu’une question de confort : chaque seconde d’attente fait perdre des visiteurs. Mais elle est aussi une question de sobriété : une page plus légère consomme moins de données, d’énergie et de matériel. Le meilleur octet reste celui qu’on n’envoie pas." }
    ],
    takeaways: [
      "Une visite web enchaîne DNS, connexion, requête, réponse, puis rendu.",
      "Le cache et la proximité des serveurs réduisent fortement les délais.",
      "Alléger les pages améliore à la fois l’expérience et l’empreinte environnementale."
    ]
  },
  {
    slug: "open-source-licence",
    title: "Open source : le code qui appartient à tout le monde",
    dek: "Ce n’est pas « gratuit », ce n’est pas un modèle économique, et ce n’est pas toujours un cadeau désintéressé. C’est d’abord une licence.",
    category: "Culture",
    date: "2026-09-30",
    author: "Mbairassem",
    cover: "assets/images/open-source.jpg",
    coverAlt: "Mbarassem dans un atelier, un document scellé à la main, entouré d’outils et de plans.",
    pullQuote: "Open source ne veut pas dire gratuit. Cela veut dire : le code source est disponible, et vous avez le droit de l’utiliser, de l’étudier, de le modifier et de le partager.",
    blocks: [
      { type: "p", text: "Linux, Firefox, VLC, Blender, une grande partie des serveurs du web : l’open source est partout. Pourtant, l’expression reste floue pour beaucoup. On la confond avec « gratuit », avec « communautaire », ou avec une idéologie. La définition est plus précise, et plus intéressante." },
      { type: "h2", text: "Quatre libertés" },
      { type: "p", text: "Un logiciel est open source si sa licence garantit quatre libertés : exécuter le programme comme on veut, étudier son fonctionnement et accéder au code source, le modifier, et redistribuer des copies, modifiées ou non. Ces libertés sont des droits juridiques, pas des intentions affichées." },
      { type: "p", text: "C’est pour cela que la licence compte autant que le code visible. Un dépôt public sur lequel on peut « juste regarder » n’est pas forcément open source. Sans licence, le droit d’auteur s’applique par défaut : personne n’a le droit de réutiliser." },
      { type: "h2", text: "Gratuit n’est pas libre" },
      { type: "p", text: "En anglais, <em>free</em> signifie à la fois « libre » et « gratuit ». La confusion a traversé les décennies. Un logiciel libre peut être vendu, et un logiciel gratuit peut être fermé. Ce qui distingue l’open source, c’est ce que la licence autorise, pas le prix affiché." },
      { type: "p", text: "Les licences varient. Certaines, dites permissives (MIT, Apache 2.0), autorisent presque tout, y compris l’intégration dans un produit propriétaire. D’autres, dites copyleft (GPL), imposent que les versions modifiées restent sous la même licence. Ce n’est pas une nuance de détail : c’est la frontière entre un commun et une appropriation privée." },
      { type: "quote", text: "Open source ne veut pas dire gratuit. Cela veut dire : le code source est disponible, et vous avez le droit de l’utiliser, de l’étudier, de le modifier et de le partager." },
      { type: "h2", text: "Qui paie les mainteneurs ?" },
      { type: "p", text: "Derrière chaque bibliothèque open source, il y a souvent une poignée de bénévoles, parfois une seule personne. Des entreprises entières dépendent de leur travail, sans toujours contribuer financièrement. Quand un mainteneur s’épuise ou disparaît, la chaîne peut casser." },
      { type: "p", text: "Les incidents de sécurité comme Log4Shell ou la porte dérobée de xz ont mis en lumière cette fragilité : des infrastructures critiques reposaient sur des projets peu financés. L’open source est un commun, mais il n’est pas gratuit à produire. La question du financement n’est pas annexe, elle est structurelle." },
      { type: "h2", text: "La sécurité par les regards… en théorie" },
      { type: "p", text: "« Avec assez d’yeux, tous les bugs sautent aux yeux. » L’adage est célèbre, mais trompeur. Un code lisible n’est pas un code lu. Si personne ne finance l’audit, les regards ne se posent jamais. La transparence aide, mais elle ne remplace ni les tests, ni les revues, ni la maintenance." },
      { type: "h2", text: "Comment aider sans coder" },
      { type: "list", items: [
        "Signaler un bug avec des étapes claires, plutôt qu’une critique vague.",
        "Améliorer la documentation : c’est souvent le premier besoin.",
        "Traduire, concevoir, tester sur différents appareils.",
        "Financer le projet, directement ou via une fondation.",
        "Contribuer à la gouvernance, aux règles de conduite, à l’accueil des nouveaux."
      ] },
      { type: "note", title: "Un principe à retenir", text: "Si votre organisation dépend d’un projet open source critique, elle a une responsabilité : contribuer, financer ou, au minimum, prévoir un plan si le projet s’arrête." },
      { type: "p", text: "L’open source n’est pas une utopie sans conflits, ni un simple catalogue gratuit. C’est une manière de construire des communs numériques, avec des règles, des tensions et des responsabilités. Le comprendre, c’est déjà mieux choisir ce qu’on utilise." }
    ],
    takeaways: [
      "L’open source est défini par une licence qui garantit quatre libertés, pas par un prix.",
      "Les modèles de financement des mainteneurs sont un enjeu de sécurité et de durabilité.",
      "La transparence du code ne remplace ni l’audit ni la maintenance."
    ]
  },
  {
    slug: "telephone-qui-rame",
    title: "Pourquoi votre téléphone rame au bout de deux ans",
    dek: "Ce n’est pas (toujours) une conspiration. C’est un mélange de mises à jour, de batterie fatiguée, de stockage saturé et d’applis qui grossissent.",
    category: "Culture",
    date: "2026-09-22",
    author: "Mbairassem",
    cover: "assets/images/smartphone.jpg",
    coverAlt: "Mbarassem tient un smartphone orange surchauffé, entouré de câbles emmêlés, d’engrenages et d’un escargot.",
    pullQuote: "Un téléphone n’est pas un objet figé : c’est un équilibre instable entre du matériel qui vieillit et du logiciel qui grossit.",
    blocks: [
      { type: "p", text: "Le scénario est familier. Le premier jour, tout est fluide. Deux ans plus tard, les applications mettent dix secondes à s’ouvrir, la batterie fond et l’appareil chauffe. On parle d’obsolescence programmée — parfois à raison, souvent à tort. Le mécanisme réel est plus nuancé, et plus intéressant." },
      { type: "h2", text: "La batterie perd sa forme" },
      { type: "p", text: "Une batterie lithium-ion s’use chimiquement. Sa capacité diminue, sa résistance interne augmente. Conséquence : elle fournit moins d’énergie, chauffe davantage, et peut ne plus soutenir les pics de puissance. Les systèmes d’exploitation réduisent alors les performances pour éviter les extinctions brutales — une décision qui ressemble à un ralentissement volontaire, mais qui vise d’abord la stabilité." },
      { type: "p", text: "Remplacer la batterie peut redonner un second souffle à un téléphone. Encore faut-il que l’appareil soit conçu pour être réparé, ce qui n’a rien d’évident dans un marché où la colle et le verre dominent." },
      { type: "h2", text: "Le logiciel grossit, le matériel reste" },
      { type: "p", text: "Les applications et les systèmes d’exploitation ajoutent des fonctionnalités, des animations, des bibliothèques, des services en arrière-plan. Le matériel, lui, ne change pas. Un modèle conçu pour 4 Go de mémoire se retrouve à en gérer 6 ou 8 dans les usages réels. La marge se réduit, et chaque tâche coûte plus cher." },
      { type: "p", text: "Les mises à jour de sécurité restent indispensables. Mais les mises à jour majeures peuvent aussi alourdir un appareil ancien. C’est un arbitrage délicat pour les fabricants : maintenir la sécurité sans promettre une fluidité impossible." },
      { type: "quote", text: "Un téléphone n’est pas un objet figé : c’est un équilibre instable entre du matériel qui vieillit et du logiciel qui grossit." },
      { type: "h2", text: "Le stockage plein ralentit tout" },
      { type: "p", text: "Un téléphone saturé à 95 % n’a plus de place pour les fichiers temporaires, les caches, les mises à jour. La mémoire flash elle-même voit ses performances chuter quand elle est presque pleine. Supprimer des vidéos, vider les caches, désinstaller les applications inutilisées : ces gestes simples règlent parfois plus de lenteurs qu’un redémarrage." },
      { type: "h2", text: "La chaleur, l’ennemi discret" },
      { type: "p", text: "Un processeur qui chauffe réduit sa fréquence pour se protéger. En été, en charge, ou dans une coque épaisse, votre téléphone peut donc ralentir sans être « vieux ». La chaleur accélère aussi le vieillissement de la batterie, créant un cercle vicieux." },
      { type: "h2", text: "Obsolescence : programmée ou négligée ?" },
      { type: "p", text: "Il existe de vrais cas d’obsolescence programmée : des pièces non remplaçables, des mises à jour qui cessent trop tôt, des réparations impossibles. Mais beaucoup de ralentissements relèvent plutôt d’une obsolescence <em>négligée</em> : des logiciels pensés pour le matériel le plus récent, des batteries non remplaçables, un support logiciel trop court." },
      { type: "p", text: "Des lois émergent pour allonger la durée de vie : indices de réparabilité, obligations de mises à jour, pièces détachées disponibles. Le mouvement est lent, mais il change la donne. Un téléphone bien conçu et bien entretenu peut rester utile bien au-delà de deux ans." },
      { type: "h2", text: "Que faire vraiment" },
      { type: "list", items: [
        "Vérifier l’état de la batterie et la faire remplacer si possible.",
        "Libérer du stockage et désinstaller les applications inutilisées.",
        "Désactiver les animations et les services en arrière-plan superflus.",
        "Éviter les températures extrêmes et les chargeurs de mauvaise qualité.",
        "Choisir, au prochain achat, un modèle réparable et suivi plus longtemps."
      ] },
      { type: "p", text: "La lenteur d’un téléphone n’est pas une fatalité individuelle. C’est le résultat de choix de conception, de durée de support et de modèles économiques. En tant qu’utilisateur, vous pouvez agir un peu. En tant que consommateur et citoyen, vous pouvez demander davantage." }
    ],
    takeaways: [
      "La batterie et le stockage sont les deux causes les plus fréquentes de ralentissement.",
      "Le logiciel évolue plus vite que le matériel, ce qui réduit progressivement les marges.",
      "Réparabilité et durée des mises à jour sont des critères d’achat décisifs."
    ]
  }
];

const LEXIQUE = [
  { term: "API", category: "Développement", definition: "Contrat qui permet à deux logiciels de communiquer : une adresse, un format de données et des règles d’accès. Pensez à une prise électrique standardisée.", article: "api-prise-electrique" },
  { term: "Algorithme", category: "Fondamentaux", definition: "Suite d’étapes précises pour résoudre un problème. Une recette de cuisine est un algorithme ; un programme est un algorithme écrit pour une machine.", article: "ia-perroquet-statistique" },
  { term: "Base de données", category: "Fondamentaux", definition: "Système qui stocke des informations structurées et garantit leur cohérence, même quand plusieurs personnes les consultent ou les modifient en même temps.", article: "base-de-donnees-classeur" },
  { term: "Cache", category: "Web", definition: "Copie temporaire de données conservée pour répondre plus vite. Le cache évite de refaire un calcul ou un téléchargement déjà effectué.", article: "clic-page-300ms" },
  { term: "Centre de données", category: "Infrastructure", definition: "Bâtiment rempli de serveurs, alimenté en électricité et refroidi en permanence. C’est l’infrastructure physique derrière le « cloud ».", article: "cloud-beton" },
  { term: "Chiffrement", category: "Sécurité", definition: "Transformation d’un message en contenu illisible sans la clé. Le chiffrement protège la confidentialité ; il ne garantit pas l’honnêteté de l’émetteur.", article: "https-cadenas" },
  { term: "Cloud", category: "Infrastructure", definition: "Location de ressources informatiques (serveurs, stockage, logiciels) accessibles par réseau. Le cloud est l’informatique de quelqu’un d’autre, dans un bâtiment réel.", article: "cloud-beton" },
  { term: "Code source", category: "Développement", definition: "Texte écrit par des humains dans un langage de programmation, qui décrit le fonctionnement d’un logiciel. Il est compilé ou interprété pour être exécuté.", article: "open-source-licence" },
  { term: "Cookie", category: "Web", definition: "Petit fichier déposé par un site dans votre navigateur. Il sert à mémoriser une session ou des préférences, et parfois à vous suivre à des fins publicitaires.", article: "https-cadenas" },
  { term: "DNS", category: "Web", definition: "Annuaire d’Internet : il traduit les noms de domaine (aktibcode.com) en adresses IP compréhensibles par les machines.", article: "clic-page-300ms" },
  { term: "HTTPS", category: "Sécurité", definition: "Version chiffrée et authentifiée du protocole HTTP. Elle protège la conversation entre le navigateur et le serveur au moyen de TLS.", article: "https-cadenas" },
  { term: "Index", category: "Fondamentaux", definition: "Structure qui trie certaines données pour accélérer les recherches, comme l’index d’un livre. Il accélère les lectures mais alourdit les écritures.", article: "base-de-donnees-classeur" },
  { term: "Latence", category: "Infrastructure", definition: "Délai entre une demande et le début de la réponse. Une latence faible donne une impression de réactivité ; elle dépend surtout de la distance et du réseau.", article: "clic-page-300ms" },
  { term: "LLM", category: "Intelligence artificielle", definition: "Grand modèle de langage (Large Language Model). Système entraîné à prédire la suite probable d’un texte, ce qui lui permet de rédiger, résumer ou converser.", article: "ia-perroquet-statistique" },
  { term: "Open source", category: "Culture", definition: "Logiciel dont la licence garantit le droit d’exécuter, d’étudier, de modifier et de redistribuer le code source. Ce n’est pas synonyme de gratuit.", article: "open-source-licence" },
  { term: "Phishing", category: "Sécurité", definition: "Hameçonnage : message ou site imitant une organisation de confiance pour vous pousser à révéler un mot de passe ou à effectuer un paiement.", article: "https-cadenas" },
  { term: "Protocole", category: "Web", definition: "Ensemble de règles qui permettent à des machines de communiquer. HTTP, TCP et TLS sont des protocoles aux rôles complémentaires.", article: "clic-page-300ms" },
  { term: "Serveur", category: "Infrastructure", definition: "Ordinateur ou logiciel qui répond à des demandes envoyées par d’autres machines (les clients). Il peut servir des pages web, des fichiers ou des API.", article: "clic-page-300ms" },
  { term: "Token", category: "Intelligence artificielle", definition: "Petite unité de texte (souvent un morceau de mot) utilisée par les modèles de langage. Le modèle prédit le token suivant, pas la phrase entière.", article: "ia-perroquet-statistique" },
  { term: "Transaction", category: "Fondamentaux", definition: "Ensemble d’opérations sur une base de données qui réussit entièrement ou est entièrement annulé. Elle empêche les états à moitié mis à jour.", article: "base-de-donnees-classeur" }
];

/* ---------- utilitaires partagés ---------- */

function getArticle(slug) {
  return ARTICLES.find((a) => a.slug === slug);
}

function formatDate(iso, style = "long") {
  const d = new Date(iso + "T12:00:00");
  if (style === "short") {
    return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(d);
  }
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(d);
}

function readingTime(article) {
  const text = article.blocks
    .map((b) => (b.text || "") + (b.items ? b.items.join(" ") : "") + (b.code || "") + (b.title || ""))
    .join(" ")
    .replace(/<[^>]+>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(3, Math.round(words / 190));
}

function categoryLabel(cat) {
  return CATEGORIES[cat] && CATEGORIES[cat].short ? CATEGORIES[cat].short : cat;
}

function sortArticles() {
  return [...ARTICLES].sort((a, b) => (a.date < b.date ? 1 : -1));
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { SITE, CATEGORIES, ARTICLES, LEXIQUE, getArticle, formatDate, readingTime, categoryLabel, sortArticles };
}
