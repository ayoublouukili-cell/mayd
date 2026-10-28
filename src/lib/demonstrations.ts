// Editorial concepts only. These records never enter the projects database.
export type DemoItem = {
  title: string;
  type: string;
  mode: string;
  price: string;
  image: number;
  photo?: string;
  details: string;
  features: string[];
};
export type Demo = {
  slug: string;
  name: string;
  sector: string;
  handle: string;
  initials: string;
  theme: string;
  headline: string;
  intro: string;
  bio: string;
  action: string;
  collection: string;
  images: string[];
  captions: string[];
  stories: string[];
  services: { name: string; price: string; text: string }[];
  items: DemoItem[];
  events: { title: string; text: string }[];
  menu?: { name: string; description: string; price: string; image: number }[];
};
const photos = (sector: string) =>
  Array.from({ length: 6 }, (_, i) => `/showroom/${sector}-${i + 1}.jpg`);
export const DEMOS: Demo[] = [
  {
    slug: "nexplay-gaming",
    name: "NEXPLAY Gaming",
    sector: "Salle de jeux & gaming center",
    handle: "nexplay.concept",
    initials: "NX",
    theme: "gaming",
    headline: "Passez au niveau supérieur.",
    intro:
      "Du premier match à la dernière manche : un espace imaginé pour jouer ensemble, progresser et partager la même passion.",
    bio: "PC, consoles et esprit d’équipe. Découvrez notre univers gaming, nos sessions et nos rendez-vous communautaires.",
    action: "Simuler une réservation",
    collection: "Choisissez votre terrain de jeu",
    images: photos("gaming"),
    stories: ["L’espace", "PC & consoles", "Forfaits", "Événements"],
    captions: [
      "Votre prochain terrain de jeu",
      "Le setup qui change tout",
      "Une partie entre amis",
      "Précision. Immersion. Émotion.",
      "Dans les coulisses du gaming",
      "Prêts pour la prochaine manche ?",
    ],
    services: [
      {
        name: "Session découverte",
        price: "30 MAD / heure",
        text: "Un poste PC et une heure pour entrer dans la partie.",
      },
      {
        name: "Duo console",
        price: "50 MAD / heure",
        text: "Une console et deux manettes pour partager la session.",
      },
      {
        name: "Pass escouade",
        price: "200 MAD / session",
        text: "Quatre postes PC pendant deux heures, pour jouer en équipe.",
      },
    ],
    items: [],
    events: [
      {
        title: "La soirée des équipes",
        text: "Concept de rencontre : parties coopératives et découverte des jeux du moment.",
      },
      {
        title: "Le défi du week-end",
        text: "Concept de tournoi amical sur console. Programme et date à définir.",
      },
    ],
  },
  {
    slug: "horizon-immobilier",
    name: "Horizon Immobilier",
    sector: "Agence immobilière",
    handle: "horizon.immo.concept",
    initials: "HI",
    theme: "immobilier",
    headline: "Un lieu. Une nouvelle vie.",
    intro:
      "Des espaces lumineux, des lignes singulières et une recherche qui commence par vos envies. Imaginez votre prochaine adresse.",
    bio: "Des lieux à vivre, des projets à imaginer. Sélection de biens fictifs à découvrir en achat et en location.",
    action: "Simuler une demande de visite",
    collection: "Des lieux qui vous ressemblent",
    images: photos("immobilier"),
    stories: ["À vendre", "À louer", "Intérieurs", "Conseils"],
    captions: [
      "L’art de se sentir chez soi",
      "Lumière naturelle, chaque jour",
      "Une autre idée de l’espace",
      "Des détails qui font un lieu",
      "Votre prochain chapitre",
      "Un intérieur à imaginer",
    ],
    services: [
      {
        name: "Achat",
        price: "Sur étude du projet",
        text: "Un parcours de recherche pensé autour de votre mode de vie.",
      },
      {
        name: "Location",
        price: "Selon le bien",
        text: "Comparez les espaces et trouvez la configuration qui vous convient.",
      },
      {
        name: "Accompagnement",
        price: "À définir",
        text: "Une présentation claire du bien et de ses caractéristiques.",
      },
    ],
    items: [
      {
        title: "Appartement Lumière",
        type: "Appartement",
        mode: "Achat",
        price: "1 450 000 MAD",
        image: 0,
        details:
          "Un appartement fictif ouvert sur une pièce de vie lumineuse, avec terrasse et cuisine intégrée.",
        features: ["95 m²", "2 chambres", "Terrasse"],
      },
      {
        title: "Villa Jardin",
        type: "Villa",
        mode: "Achat",
        price: "3 800 000 MAD",
        image: 1,
        details:
          "Une villa de démonstration avec volumes généreux, jardin privatif et espaces de détente.",
        features: ["240 m²", "4 chambres", "Jardin"],
      },
      {
        title: "Appartement Atelier",
        type: "Appartement",
        mode: "Location",
        price: "7 500 MAD / mois",
        image: 2,
        details:
          "Un intérieur fictif aux matières douces, imaginé pour un quotidien simple et confortable.",
        features: ["70 m²", "2 chambres", "Cuisine équipée"],
      },
      {
        title: "Villa Patio",
        type: "Villa",
        mode: "Location",
        price: "18 000 MAD / mois",
        image: 3,
        details:
          "Une maison de démonstration organisée autour de la lumière, avec un patio pour les moments calmes.",
        features: ["190 m²", "3 chambres", "Patio"],
      },
    ],
    events: [],
  },
  {
    slug: "eclat-studio",
    name: "Éclat Studio",
    sector: "Salon de coiffure",
    handle: "eclat.studio.concept",
    initials: "ÉS",
    theme: "coiffure",
    headline: "Votre style, naturellement.",
    intro:
      "Un moment pour vous. Des gestes précis, des matières chaleureuses et une approche de la coiffure qui respecte votre personnalité.",
    bio: "Coupes, couleurs et soins. Un salon fictif où le détail et le bien-être prennent toute leur place.",
    action: "Simuler un rendez-vous",
    collection: "Une attention pour chaque envie",
    images: photos("coiffure"),
    stories: ["Le salon", "Coupes", "Couleurs", "Soins"],
    captions: [
      "Le luxe de prendre son temps",
      "Une coupe, du mouvement",
      "La couleur en douceur",
      "Le geste et la matière",
      "Un rituel pour vos cheveux",
      "Révéler votre éclat",
    ],
    services: [
      {
        name: "Coupe & coiffage",
        price: "À partir de 180 MAD",
        text: "Un diagnostic, une coupe personnalisée et une finition soignée.",
      },
      {
        name: "Couleur & lumière",
        price: "À partir de 450 MAD",
        text: "Une proposition de nuances adaptée à votre style et à vos envies.",
      },
      {
        name: "Rituel de soin",
        price: "À partir de 150 MAD",
        text: "Un temps de soin et de détente pour sublimer la matière.",
      },
    ],
    items: [],
    events: [],
  },
  {
    slug: "atlas-drive",
    name: "Atlas Drive",
    sector: "Location de voitures",
    handle: "atlas.drive.concept",
    initials: "AD",
    theme: "voitures",
    headline: "La liberté prend la route.",
    intro:
      "Une citadine pour le quotidien, un SUV pour s’évader, une berline pour le plaisir du voyage. Imaginez la prochaine étape.",
    bio: "L’envie de prendre la route. Découvrez notre collection fictive de véhicules pour chaque type de trajet.",
    action: "Simuler une réservation",
    collection: "À chaque voyage, sa voiture",
    images: photos("voitures"),
    stories: ["Citadines", "SUV", "Berlines", "Voyages"],
    captions: [
      "Le départ d’une nouvelle histoire",
      "La ville à votre rythme",
      "L’élégance en mouvement",
      "Cap sur les grands espaces",
      "Le plaisir du détail",
      "Votre prochaine escapade",
    ],
    services: [
      {
        name: "Escapade urbaine",
        price: "Dès 300 MAD / jour",
        text: "Une sélection compacte pour vos trajets du quotidien.",
      },
      {
        name: "Voyage en famille",
        price: "Dès 650 MAD / jour",
        text: "Plus d’espace pour les bagages et les longues distances.",
      },
      {
        name: "Trajet premium",
        price: "Dès 900 MAD / jour",
        text: "Confort et élégance pour les occasions particulières.",
      },
    ],
    items: [
      {
        title: "Citadine Essentielle",
        type: "Citadine",
        mode: "Manuelle",
        price: "300 MAD / jour",
        image: 0,
        photo: "/showroom/voitures-compacte.jpg",
        details:
          "Véhicule fictif compact, pensé pour les déplacements urbains. Photo d’ambiance non contractuelle.",
        features: ["5 places", "Climatisation", "Essence"],
      },
      {
        title: "SUV Évasion",
        type: "SUV",
        mode: "Automatique",
        price: "650 MAD / jour",
        image: 1,
        details:
          "Véhicule fictif spacieux pour voyager ensemble. Photo d’ambiance non contractuelle.",
        features: ["5 places", "Grand coffre", "Climatisation"],
      },
      {
        title: "Berline Signature",
        type: "Berline",
        mode: "Automatique",
        price: "900 MAD / jour",
        image: 2,
        details:
          "Véhicule fictif alliant confort et lignes élégantes. Photo d’ambiance non contractuelle.",
        features: ["5 places", "Intérieur premium", "Climatisation"],
      },
      {
        title: "SUV Grand Tour",
        type: "SUV",
        mode: "Manuelle",
        price: "750 MAD / jour",
        image: 1,
        details:
          "Véhicule de démonstration pour les envies d’évasion. Photo d’ambiance non contractuelle.",
        features: ["5 places", "Grand coffre", "Diesel"],
      },
    ],
    events: [],
  },
  {
    slug: "maison-safran",
    name: "Maison Safran",
    sector: "Restaurant",
    handle: "maison.safran.concept",
    initials: "MS",
    theme: "restaurant",
    headline: "Le goût des moments partagés.",
    intro:
      "Une table imaginée autour des saveurs, de la saison et du plaisir de recevoir. Entrez dans un univers de matières naturelles et de cuisine généreuse.",
    bio: "Une cuisine de saison, une table chaleureuse, des instants à savourer. Restaurant fictif imaginé pour cette démonstration.",
    action: "Simuler une réservation de table",
    collection: "À la carte, tout simplement",
    images: photos("restaurant"),
    stories: ["La table", "La carte", "En cuisine", "À partager"],
    captions: [
      "Le plaisir de se retrouver",
      "Une assiette de saison",
      "Des saveurs à partager",
      "La douceur d’une pause",
      "Le geste en cuisine",
      "Votre prochaine table",
    ],
    services: [
      {
        name: "Déjeuner de saison",
        price: "À partir de 120 MAD",
        text: "Une entrée et un plat imaginés autour de produits de saison.",
      },
      {
        name: "Dîner à partager",
        price: "À partir de 220 MAD",
        text: "Un parcours gourmand pour prendre le temps de se retrouver.",
      },
      {
        name: "Pause gourmande",
        price: "À partir de 60 MAD",
        text: "Un dessert et une boisson chaude pour prolonger le moment.",
      },
    ],
    items: [],
    events: [],
  },
  {
    slug: "forma-club",
    name: "Forma Club",
    sector: "Salle de sport",
    handle: "forma.club.concept",
    initials: "FC",
    theme: "sport",
    headline: "Votre énergie. Votre rythme.",
    intro:
      "Un club imaginé pour trouver votre équilibre : entraînement libre, mouvement collectif et accompagnement. Un espace pour avancer à votre rythme.",
    bio: "Musculation, cours collectifs et mobilité. Découvrez l’univers d’un club fictif où chaque séance commence par votre envie de bouger.",
    action: "Simuler une séance découverte",
    collection: "Trouvez votre façon de bouger",
    images: photos("sport"),
    stories: ["Le club", "Musculation", "Cours", "Mobilité"],
    captions: [
      "Le mouvement commence ici",
      "Construire sa routine",
      "L’énergie du collectif",
      "Un temps pour soi",
      "Trouver son équilibre",
      "La prochaine séance vous attend",
    ],
    services: [
      {
        name: "Séance découverte",
        price: "50 MAD / séance",
        text: "Un premier aperçu de l’espace et des équipements, en toute simplicité.",
      },
      {
        name: "Accès liberté",
        price: "À partir de 350 MAD / mois",
        text: "Une formule fictive pour organiser vos entraînements à votre rythme.",
      },
      {
        name: "Cours collectifs",
        price: "À partir de 80 MAD / séance",
        text: "Renforcement, cardio ou mobilité : explorez différents mouvements.",
      },
    ],
    items: [],
    events: [],
  },
  {
    slug: "mistral-habitat",
    name: "Mistral Habitat",
    sector: "Agence immobilière indépendante",
    handle: "mistral.habitat.concept",
    initials: "MH",
    theme: "habitat",
    headline: "L’espace juste, au bon endroit.",
    intro:
      "Une sélection de lieux singuliers présentée avec clarté, de la première visite au nouveau chapitre.",
    bio: "Adresses choisies, conseils utiles et accompagnement attentif pour imaginer votre prochain lieu de vie.",
    action: "Découvrir les adresses",
    collection: "Des lieux à habiter autrement",
    images: [
      "/showroom/immobilier-3.jpg",
      "/showroom/immobilier-5.jpg",
      "/showroom/immobilier-1.jpg",
      "/showroom/immobilier-4.jpg",
      "/showroom/immobilier-6.jpg",
      "/showroom/immobilier-2.jpg",
    ],
    stories: ["Adresses", "Architecture", "À louer", "Le quartier"],
    captions: [
      "Une lumière qui change tout",
      "Une adresse qui respire",
      "Le charme des matières",
      "Un lieu pour ralentir",
      "Lignes simples, vie vivante",
      "Le prochain chapitre commence ici",
    ],
    services: [
      {
        name: "Recherche sur mesure",
        price: "Accompagnement concept",
        text: "Une sélection fictive construite autour de vos critères et de votre quotidien.",
      },
      {
        name: "Visite conseil",
        price: "Parcours illustratif",
        text: "Un aperçu des espaces, de la lumière et des usages possibles de chaque lieu.",
      },
      {
        name: "Carnet de quartier",
        price: "Guide éditorial",
        text: "Des repères de proximité pour se projeter au-delà des murs.",
      },
    ],
    items: [
      {
        title: "Maison Patio",
        type: "Maison",
        mode: "Achat",
        price: "2 600 000 MAD",
        image: 0,
        details:
          "Une maison fictive organisée autour d’un patio arboré et d’une pièce traversante.",
        features: ["180 m²", "3 chambres", "Patio"],
      },
      {
        title: "Appartement des Orangers",
        type: "Appartement",
        mode: "Location",
        price: "9 000 MAD / mois",
        image: 1,
        details: "Un appartement lumineux de démonstration, pensé pour une vie de quartier.",
        features: ["82 m²", "2 chambres", "Balcon"],
      },
      {
        title: "Maison de la Colline",
        type: "Maison",
        mode: "Achat",
        price: "3 200 000 MAD",
        image: 2,
        details: "Une adresse fictive aux lignes sobres, ouverte sur son jardin.",
        features: ["210 m²", "4 chambres", "Jardin"],
      },
      {
        title: "Loft Atelier",
        type: "Appartement",
        mode: "Location",
        price: "11 500 MAD / mois",
        image: 3,
        details: "Un loft conceptuel aux volumes généreux et aux matières naturelles.",
        features: ["105 m²", "2 chambres", "Volumes ouverts"],
      },
    ],
    events: [],
  },
  {
    slug: "rift-district",
    name: "RIFT District",
    sector: "Gaming lounge & arène esport",
    handle: "rift.district.concept",
    initials: "RF",
    theme: "arcade",
    headline: "Formez votre équipe. Prenez la scène.",
    intro:
      "Un terrain de jeu nouvelle génération : postes compétitifs, sessions en équipe et rendez-vous communautaires.",
    bio: "PC haute performance, tournois amicaux et espace créateur. Le gaming se vit ici en équipe.",
    action: "Choisir une session",
    collection: "Votre prochaine session commence ici",
    images: [
      "/showroom/gaming-4.jpg",
      "/showroom/gaming-2.jpg",
      "/showroom/gaming-6.jpg",
      "/showroom/gaming-1.jpg",
      "/showroom/gaming-5.jpg",
      "/showroom/gaming-3.jpg",
    ],
    stories: ["Arène", "Setup", "Équipes", "Live"],
    captions: [
      "La prochaine partie se joue ici",
      "Pensé pour la précision",
      "Une escouade, un objectif",
      "L’arène prend vie",
      "La communauté aux commandes",
      "Jouez votre propre finale",
    ],
    services: [
      {
        name: "Pass Arène",
        price: "45 MAD / heure",
        text: "Accès individuel aux stations gaming et à l’espace compétition.",
      },
      {
        name: "Session Escouade",
        price: "180 MAD / session",
        text: "Une session concept pour quatre joueurs, avec espace d’équipe réservé.",
      },
      {
        name: "Studio Créateur",
        price: "120 MAD / heure",
        text: "Un espace fictif équipé pour capturer et partager une session de jeu.",
      },
    ],
    items: [],
    events: [
      {
        title: "Rift Open",
        text: "Concept de tournoi ouvert : rencontres amicales et finales en équipe.",
      },
      {
        title: "Nuit Coop",
        text: "Une soirée communautaire fictive dédiée aux jeux coopératifs.",
      },
    ],
  },
  {
    slug: "neroli-botanique",
    name: "Néroli Botanique",
    sector: "Boutique de soins naturels",
    handle: "neroli.botanique.concept",
    initials: "NB",
    theme: "boutique",
    headline: "Le soin commence par le vivant.",
    intro:
      "Des rituels capillaires inspirés des plantes, présentés dans une boutique en ligne claire et sensorielle.",
    bio: "Huiles, soins et gestes simples. Une boutique fictive qui célèbre les ingrédients botaniques et le temps pour soi.",
    action: "Explorer les rituels",
    collection: "Le rituel qui vous ressemble",
    images: [
      "/demo/boutique.jpg",
      "/showroom/coiffure-3.jpg",
      "/demo/beaute.jpg",
      "/showroom/coiffure-5.jpg",
      "/showroom/coiffure-1.jpg",
      "/showroom/coiffure-6.jpg",
    ],
    stories: ["Ingrédients", "Rituels", "La boutique", "Conseils"],
    captions: [
      "Une routine en harmonie",
      "Des plantes, du temps, un geste",
      "Le rituel du dimanche",
      "La beauté des matières simples",
      "Le soin sans superflu",
      "Choisir ce qui vous fait du bien",
    ],
    services: [
      {
        name: "Diagnostic rituel",
        price: "Conseil concept",
        text: "Un guide fictif pour composer une routine selon vos envies.",
      },
      {
        name: "Coffret découverte",
        price: "Dès 240 MAD",
        text: "Une sélection illustrative de soins essentiels à offrir ou à découvrir.",
      },
      {
        name: "Journal botanique",
        price: "Conseils gratuits",
        text: "Des contenus éditoriaux autour des plantes, des gestes et des textures.",
      },
    ],
    items: [
      {
        title: "Huile de Néroli",
        type: "Huile",
        mode: "Rituel essentiel",
        price: "180 MAD",
        image: 0,
        details: "Une huile conceptuelle de finition, imaginée pour apporter douceur et éclat.",
        features: ["50 ml", "Finition douce", "Concept botanique"],
      },
      {
        title: "Masque Jardin",
        type: "Soin",
        mode: "Rituel profond",
        price: "220 MAD",
        image: 1,
        details: "Un masque fictif inspiré des textures riches et des soins hebdomadaires.",
        features: ["200 ml", "Soin nourrissant", "Usage hebdomadaire"],
      },
      {
        title: "Brume Fleur d’Oranger",
        type: "Brume",
        mode: "Rituel quotidien",
        price: "145 MAD",
        image: 2,
        details: "Une brume illustrant un geste léger pour rafraîchir la routine.",
        features: ["100 ml", "Geste léger", "Parfum délicat"],
      },
      {
        title: "Coffret Racines",
        type: "Coffret",
        mode: "Rituel complet",
        price: "390 MAD",
        image: 3,
        details: "Un coffret de démonstration réunissant trois gestes complémentaires.",
        features: ["3 essentiels", "Routine complète", "Édition conceptuelle"],
      },
    ],
    events: [],
  },
  {
    slug: "azahar-table",
    name: "Azahar Table",
    sector: "Table méditerranéenne",
    handle: "azahar.table.concept",
    initials: "AZ",
    theme: "azahar",
    headline: "La saison s’invite à votre table.",
    intro:
      "Une cuisine de marché aux accents méditerranéens, racontée par les produits, les gestes et les moments partagés.",
    bio: "Une table fictive inspirée du marché, des agrumes et des longues conversations autour d’un plat à partager.",
    action: "Composer votre moment",
    collection: "Aujourd’hui, le marché nous inspire",
    images: [
      "/showroom/restaurant-5.jpg",
      "/showroom/restaurant-2.jpg",
      "/showroom/restaurant-4.jpg",
      "/showroom/restaurant-1.jpg",
      "/showroom/restaurant-6.jpg",
      "/showroom/restaurant-3.jpg",
    ],
    stories: ["Du marché", "À partager", "En cuisine", "La terrasse"],
    captions: [
      "La couleur des bons produits",
      "Une table pleine de soleil",
      "Le marché dicte la saison",
      "Le plaisir de faire ensemble",
      "Un dernier rayon en terrasse",
      "Rester encore un peu",
    ],
    services: [
      {
        name: "Menu du marché",
        price: "Dès 160 MAD",
        text: "Un menu conceptuel qui évolue au fil des produits de saison.",
      },
      {
        name: "Grande tablée",
        price: "Dès 280 MAD",
        text: "Une expérience illustrative à partager en famille ou entre amis.",
      },
      {
        name: "Pause agrumes",
        price: "Dès 75 MAD",
        text: "Une boisson fraîche et une douceur inspirées du verger.",
      },
    ],
    items: [],
    events: [
      {
        title: "Le déjeuner du jardin",
        text: "Un rendez-vous conceptuel autour des légumes, herbes et produits du moment.",
      },
      {
        title: "Les soirs d’Azahar",
        text: "Une soirée fictive à la lumière douce, pensée pour prolonger la conversation.",
      },
    ],
  },
  {
    slug: "cadence-mouvement",
    name: "Cadence Mouvement",
    sector: "Studio de sport & mouvement",
    handle: "cadence.mouvement.concept",
    initials: "CM",
    theme: "cadence",
    headline: "Le mouvement vous appartient.",
    intro:
      "Un studio où force, mobilité et récupération trouvent leur rythme, avec des parcours pensés pour chacun.",
    bio: "Renforcement, mobilité et coaching en petit groupe. Une identité sportive centrée sur la progression durable.",
    action: "Trouver mon rythme",
    collection: "Trois façons d’entrer en mouvement",
    images: [
      "/showroom/sport-5.jpg",
      "/showroom/sport-2.jpg",
      "/showroom/sport-6.jpg",
      "/showroom/sport-1.jpg",
      "/showroom/sport-4.jpg",
      "/showroom/sport-3.jpg",
    ],
    stories: ["Le studio", "Force", "Mobilité", "Récupération"],
    captions: [
      "Un mouvement après l’autre",
      "La force en confiance",
      "La mobilité au quotidien",
      "L’énergie du petit groupe",
      "Récupérer fait partie du rythme",
      "Votre prochaine étape commence ici",
    ],
    services: [
      {
        name: "Bilan Cadence",
        price: "60 MAD / séance",
        text: "Une première séance de démonstration pour définir vos envies et votre rythme.",
      },
      {
        name: "Force en petit groupe",
        price: "90 MAD / séance",
        text: "Un entraînement conceptuel encadré, avec une attention portée aux mouvements.",
      },
      {
        name: "Mobilité & récupération",
        price: "70 MAD / séance",
        text: "Un temps fictif pour délier le corps et construire une pratique équilibrée.",
      },
    ],
    items: [],
    events: [
      {
        title: "Cadence collective",
        text: "Un format conceptuel de séance en groupe, rythmé par le mouvement et la musique.",
      },
      {
        title: "La pause mobilité",
        text: "Une rencontre fictive dédiée aux gestes simples et à la récupération active.",
      },
    ],
  },
];
// The original database examples keep their own names and destinations.
// They are not added to the editorial catalogue a second time.
const baseDemo = (slug: string) => DEMOS.find((d) => d.slug === slug)!;
export const LEGACY_WEBSITES: Demo[] = [
  {
    ...baseDemo("azahar-table"),
    slug: "demo-cafe-de-quartier",
    name: "Café de quartier",
    sector: "Café & coffee shop",
    initials: "CQ",
    handle: "cafe.concept",
    captions: [
      "Le café",
      "La pause",
      "Les douceurs",
      "Le petit-déjeuner",
      "La salle",
      "À partager",
    ],
    stories: ["Le café", "La carte", "Les douceurs", "La salle"],
    headline: "Votre pause, tout simplement.",
    intro:
      "Un café de quartier, des pâtisseries et le plaisir de prendre son temps. Découvrez la carte et imaginez votre prochaine pause.",
    bio: "Café de démonstration : boissons chaudes, douceurs et moments partagés.",
    collection: "La carte du café",
    action: "Simuler une réservation de table",
    images: [
      "/demo/cafe.jpg",
      "/showroom/restaurant-6.jpg",
      "/showroom/restaurant-5.jpg",
      "/showroom/restaurant-4.jpg",
      "/showroom/restaurant-1.jpg",
      "/showroom/restaurant-3.jpg",
    ],
    services: [
      { name: "Pause café", price: "25 MAD", text: "Un café et le temps de souffler." },
      {
        name: "Petit-déjeuner",
        price: "55 MAD",
        text: "Une boisson chaude et une sélection de douceurs.",
      },
      { name: "Goûter à partager", price: "75 MAD", text: "Une pause gourmande à deux." },
    ],
    menu: [
      { name: "Espresso", description: "Un café court et généreux.", price: "18 MAD", image: 0 },
      {
        name: "Café & douceur",
        description: "Une boisson chaude et une pâtisserie.",
        price: "35 MAD",
        image: 2,
      },
      {
        name: "Petit-déjeuner maison",
        description: "Le plaisir d'une matinée au café.",
        price: "55 MAD",
        image: 3,
      },
    ],
    events: [],
    items: [],
  },
  {
    ...baseDemo("eclat-studio"),
    slug: "demo-institut-beaute",
    name: "Institut de beauté",
    sector: "Salon de beauté",
    initials: "IB",
    handle: "institut.concept",
    captions: ["L'institut", "Les soins", "Les détails", "Le rituel", "La détente", "L'accueil"],
    stories: ["L'institut", "Les soins", "Les rituels", "Rendez-vous"],
    headline: "Un moment rien que pour vous.",
    intro:
      "Des rituels de soin, une atmosphère douce et une attention portée à chaque détail. Découvrez l'univers de l'institut.",
    bio: "Institut de démonstration : soins et rituels de beauté.",
    collection: "Nos rituels de beauté",
    action: "Simuler un rendez-vous beauté",
    images: ["/demo/beaute.jpg", ...baseDemo("eclat-studio").images.slice(1)],
    services: [
      {
        name: "Soin découverte",
        price: "180 MAD",
        text: "Un rituel visage imaginé pour une pause douceur.",
      },
      {
        name: "Beauté des mains",
        price: "120 MAD",
        text: "Un soin des mains et une finition soignée.",
      },
      {
        name: "Rituel détente",
        price: "250 MAD",
        text: "Un moment de bien-être dans une atmosphère apaisante.",
      },
    ],
    events: [],
    items: [],
  },
  {
    ...baseDemo("maison-safran"),
    slug: "demo-restaurant-familial",
    name: "Restaurant familial",
    sector: "Restaurant",
    initials: "RF",
    handle: "restaurant.familial.concept",
    headline: "Le plaisir de se retrouver à table.",
    intro:
      "Une cuisine généreuse, des tables accueillantes et des plats à partager en famille. Découvrez notre carte de démonstration.",
    bio: "Restaurant familial de démonstration : cuisine et convivialité.",
    images: ["/demo/restaurant.jpg", ...baseDemo("maison-safran").images.slice(1)],
    events: [],
  },
  {
    ...baseDemo("neroli-botanique"),
    slug: "demo-boutique-mode",
    name: "Boutique de mode",
    sector: "Commerce de détail",
    initials: "BM",
    handle: "boutique.mode.concept",
    captions: [
      "La boutique",
      "La collection",
      "Les accessoires",
      "Les matières",
      "Les silhouettes",
      "La sélection mode",
    ],
    stories: ["La boutique", "La collection", "Les accessoires", "Les silhouettes"],
    headline: "Votre style, votre signature.",
    intro:
      "Des silhouettes faciles à porter, des matières à découvrir et une sélection pensée pour composer votre style.",
    bio: "Boutique de mode de démonstration : vêtements et accessoires.",
    collection: "La sélection mode",
    action: "Simuler une demande produit",
    images: Array.from({ length: 6 }, () => "/demo/boutique.jpg"),
    services: [
      {
        name: "Conseil silhouette",
        price: "Sur demande",
        text: "Imaginez les associations qui vous ressemblent.",
      },
      {
        name: "Sélection personnelle",
        price: "Sur demande",
        text: "Composez votre sélection depuis le catalogue.",
      },
      {
        name: "Essayage en boutique",
        price: "Sur rendez-vous",
        text: "Simulez une demande de rendez-vous.",
      },
    ],
    items: [
      {
        title: "Chemise essentielle",
        type: "Prêt-à-porter",
        mode: "Collection",
        price: "290 MAD",
        image: 0,
        details: "Une pièce de démonstration pour composer votre silhouette. Photo d'ambiance.",
        features: ["Coupe confortable", "Style quotidien"],
      },
      {
        title: "Veste de saison",
        type: "Prêt-à-porter",
        mode: "Collection",
        price: "590 MAD",
        image: 1,
        details: "Une veste conceptuelle à découvrir en boutique. Photo d'ambiance.",
        features: ["Pièce de saison", "Style polyvalent"],
      },
      {
        title: "Accessoire signature",
        type: "Accessoires",
        mode: "Sélection",
        price: "190 MAD",
        image: 2,
        details: "Un accessoire de démonstration pour compléter une tenue. Photo d'ambiance.",
        features: ["Finition soignée", "Détail signature"],
      },
    ],
    events: [],
  },
];
export function findDemo(slug: string) {
  return DEMOS.find((d) => d.slug === slug) ?? LEGACY_WEBSITES.find((d) => d.slug === slug);
}
export const DEMO_NOTICE = "Démonstration uniquement : aucune demande réelle n’a été envoyée.";
