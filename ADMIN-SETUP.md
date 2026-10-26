# Administration MAYD

## Mode local actif sur ce PC

Le site utilise maintenant un compte local indépendant de Supabase quand il est lancé avec `npm run dev`. Ouvrir `http://localhost:8080/auth`, ou utiliser l'adresse du PC sur le même Wi-Fi. Identifiant : **maynd**, avec le mot de passe communiqué. Aucun email, activation ou accès externe n'est nécessaire.

Les projets, réglages, messages, statistiques et fichiers ajoutés sont enregistrés dans `.mayd-local/` sur le PC qui exécute le serveur. Ce dossier contient aussi le mot de passe haché et les sessions serveur ; il est exclu de Git et de l'accès aux fichiers de Vite. Conserver ce dossier pour conserver les données, y compris lors d'un changement de PC. Les données de l'ancien backend ne sont pas importées automatiquement.

L'option `VITE_LOCAL_ADMIN=true` dans `.env.local` active ce mode uniquement pendant le développement. Une compilation de production utilise le backend Supabase existant. Les instructions suivantes concernent ce backend distant.

Validation du backend local : `npm run test:local`.

## Backend distant

Cliquer sur **Login** dans l'en-tête du site, sur ordinateur ou mobile. La connexion se trouve à `/auth`, et le tableau de bord à `/admin`.

Identifiant : **maynd**. Utiliser le mot de passe communiqué, qui n'est pas enregistré dans le code. Le formulaire ne demande aucun email et ne propose aucune inscription publique. L'adresse `maynd@contact.com` reste l'identifiant technique du compte Supabase.

## Activer les statistiques

Dans le SQL Editor du projet Supabase utilisé par le site, exécuter `supabase/migrations/202610260001_analytics.sql` une seule fois. Cette migration complète les tables existantes : elle doit être appliquée après les migrations initiales dans `drizzle/migrations`.

Les statistiques démarrent à l'installation : aucune visite passée ne peut être récupérée. Les visiteurs sont estimés avec un identifiant aléatoire conservé dans le navigateur ; changer de navigateur ou effacer son stockage crée un nouvel identifiant. Aucun contenu de formulaire, paramètre d'URL, mot de passe ou adresse IP n'est collecté par ce code. Les clics sur liens sont regroupés par destination et les autres boutons par libellé. Les compteurs excluent l'administration et sont actualisés toutes les minutes. Les comptages côté navigateur peuvent manquer les visites bloquées par le navigateur ou le réseau, et ne constituent pas une mesure anti-fraude.

## Compte propriétaire

Pour activer le compte existant **sans email de confirmation**, exécuter une seule fois `supabase/admin/activate-mayd.sql` dans le SQL Editor du projet. Ce script confirme uniquement le compte MAYD et lui attribue le rôle admin. Il ne modifie pas le mot de passe et échoue explicitement si le compte n'existe pas. L'activation distante n'a pas encore été exécutée depuis cet espace de travail, qui ne dispose pas de clé serveur.

Le projet attribue automatiquement le rôle administrateur au premier compte créé. Si un autre compte administrateur existe déjà, il faut attribuer le rôle au compte MAYD depuis un accès serveur autorisé.

Le script `scripts/setup-admin.mjs` permet de vérifier le compte. Avec une clé serveur, il permet aussi de créer un compte déjà confirmé ou d'activer le compte existant, sans envoyer d'email. Il attend `MAYD_ADMIN_PASSWORD` dans l'environnement et utilise `.env` :

```powershell
node --env-file=.env scripts/setup-admin.mjs
```

Si le rôle doit être attribué explicitement, fournir aussi `SUPABASE_SERVICE_ROLE_KEY` dans l'environnement du processus. Ne jamais utiliser de préfixe `VITE_` pour cette clé ni la publier dans le dépôt. Le script ne modifie pas le mot de passe d'un compte existant.

## Gérer le site

- `/admin` : statistiques, création et publication des réalisations.
- Ouvrir une réalisation : changer sa couverture, ajouter des photos ou vidéos de montage, ajouter un lien vidéo, organiser les médias.
- `/admin/reglages` : coordonnées, portrait et visuels du site.
- `/admin/messages` : messages reçus depuis le formulaire.
