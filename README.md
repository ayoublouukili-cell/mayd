# MAYD Digital

Site vitrine et portfolio : réalisations, démonstrations, téléphone 3D animé au scroll, formulaire de contact WhatsApp et espace administrateur.

Application React / TypeScript avec TanStack Start et Vite. Le mode local enregistre les projets, fichiers, messages et statistiques sur le PC qui exécute le serveur. Le backend Supabase existant reste disponible pour une configuration distante.

## Build with Lovable

Projet initial : [éditeur Lovable](https://lovable.dev/projects/a6069f65-f82d-41e2-b91f-fe3b59830098). Un nouveau dépôt GitHub n'est pas automatiquement relié à cet éditeur.

## Development

Node.js 22 et npm sont requis. Dans le dossier du projet :

```sh
npm ci
```

Sur une nouvelle installation, copier `.env.example` vers `.env.local` pour activer le mode local. Sur le PC actuel, conserver les fichiers de configuration existants.

Pour créer le compte local sur un nouveau PC (PowerShell), choisir son propre mot de passe :

```powershell
$env:MAYD_LOCAL_PASSWORD = Read-Host "Choisissez le mot de passe administrateur"
node --input-type=module -e "import {initializeLocal} from './local/backend.mjs'; await initializeLocal('.mayd-local', process.env.MAYD_LOCAL_PASSWORD)"
Remove-Item Env:\MAYD_LOCAL_PASSWORD
```

Cette initialisation ne doit être exécutée qu'une fois ; elle refuse d'écraser un compte existant. L'identifiant de connexion est `maynd`.

```sh
npm run dev
```

Ouvrir `http://localhost:8080`. L'espace administrateur se trouve à `/admin`. Les autres appareils du même Wi-Fi peuvent utiliser l'adresse réseau affichée par Vite.

## Données et configuration

Le dossier `.mayd-local/` contient les données locales, les médias ajoutés et les informations de connexion du propriétaire. Il reste sur le PC et n'est pas publié dans GitHub. Le sauvegarder séparément pour transférer ces données sur un autre PC.

Les fichiers `.env`, `.env.local`, les dépendances et les sorties de compilation sont également exclus du dépôt. Seul `.env.example` fournit un modèle sans identifiants. Les coordonnées de contact et le numéro WhatsApp se règlent dans le dashboard.

## Vérification et production

```sh
npm test
npm run test:local
npm run build
```

Le backend local fonctionne avec `npm run dev`. Une compilation de production utilise le backend Supabase et requiert sa configuration ; les données du PC ne sont pas transférées automatiquement vers un hébergeur. Voir [ADMIN-SETUP.md](./ADMIN-SETUP.md) pour les deux configurations.
