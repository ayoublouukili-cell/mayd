# Galerie et démonstrations

L’accueil et `/realisations` utilisent `PortfolioGallery`, avec les mêmes projets publics de `projectsQuery` et les six concepts locaux de `src/lib/demonstrations.ts`. Aucun concept n’est écrit en base. Le filtre « Tous les projets » affiche chaque entrée une seule fois ; les catégories désignent les différentes facettes d’une même marque.

Chaque concept propose cinq vues sur sa page existante : `?platform=site`, `instagram`, `facebook`, `tiktok` et `identite`. Le paramètre conserve l’onglet lors d’une actualisation. Le changement de langue conserve la page, l’onglet et les filtres de la galerie.

Les sites ont des structures distinctes dans `SiteDirections.tsx` et des ordres de sections propres dans `DemoWebsite.tsx`. Le catalogue immobilier propose achat/location ; le catalogue automobile propose des filtres et une comparaison de deux véhicules. Les formulaires restent des simulations locales, sans requête d’envoi.

Les six univers d’identité visuelle sont décrits dans `showroom-catalog.ts`. Signatures typographiques, symboles conceptuels, palettes, motifs et applications sont rendus en HTML/CSS. Ils sont indépendants du logo officiel MAYD DIGITAL, conservé sans modification. Les couvertures et publications utilisent des textes HTML traduisibles, sans fabriquer de texte dans les photos.

Les photos existantes de `public/showroom` sont conservées. Leur liste de sources Unsplash figure dans `scripts/download-showroom.mjs`. Les médias historiques des projets restent inchangés et sont servis par les fonctions publiques existantes.

Les traductions exactes sont centralisées dans `src/lib/i18n/catalog.ts` et complétées par les clés structurées de `showroom-messages.ts`. Elles comprennent aussi les quatre anciens exemples stockés en base, identifiés comme démonstrations. Aucune information client ni résultat n’a été ajouté. Si un propriétaire change un texte en base, sa nouvelle version s’affiche dans la langue originale jusqu’à l’ajout d’une traduction. Les textes déjà intégrés aux médias historiques ne sont pas traduits.

## Vérification locale

Sous PowerShell : `npx.cmd tsc --noEmit`, `npm.cmd test`, `npm.cmd run build`.

`node scripts/verify-portfolio.mjs` utilise une instance Edge de test avec le débogage local sur le port 9333 et le serveur sur le port 8082 (modifiable avec `SHOWROOM_URL`). Il vérifie les deux galeries, les six combinaisons langue/thème, les trente vues détaillées sur ordinateur et mobile, les images, la comparaison, les filtres et une soumission simulée. Les captures sont écrites dans le dossier temporaire Windows. Il contrôle l’absence de requêtes POST.
