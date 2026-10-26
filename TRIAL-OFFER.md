# Offre découverte : 10 jours gratuits

L'offre s'affiche en haut de l'accueil. Le visiteur indique son nom, son activité, son email et le service souhaité, puis accepte d'être contacté. Le lien Supabase confirme son adresse. Le serveur vérifie la session auprès de Supabase Auth avant d'insérer la demande dans `contact_messages`. Un identifiant stable empêche les doublons lors des nouvelles tentatives. Les demandes sont visibles dans `/admin/messages` avec la mention « 10 jours gratuits · Email confirmé ».

Le début et le périmètre sont convenus avec le client. L'envoi de l'email ne démarre aucun compte à rebours, abonnement ou paiement. L'adresse est une demande de contact, pas une inscription à une newsletter.

## Configuration requise avant de diffuser la promotion

- Dans le backend Supabase / Lovable Cloud, activer les inscriptions par email et les liens de connexion par email. Le modèle doit contenir `{{ .ConfirmationURL }}` (pas seulement un code OTP).
- Ajouter `https://mayd-jade.vercel.app/?trial=confirm` dans les URL de redirection autorisées (Auth → URL Configuration). Définir l'URL du site sur `https://mayd-jade.vercel.app`. Mettre à jour ces URL si le domaine change.
- Vérifier l'envoi des emails par le backend Lovable Cloud. Avec un projet Supabase standard, configurer un fournisseur SMTP si le fournisseur intégré limite les destinataires ou le débit. Aucun email n'est envoyé pendant les tests automatisés.
- Un administrateur doit déjà exister. Le formulaire refuse les inscriptions promotionnelles si `admin_exists()` n'est pas vrai afin de conserver la règle du propriétaire unique. Les comptes clients ne reçoivent aucun rôle admin.
- Les quatre variables Supabase de Vercel sont celles décrites dans `.env.example`. Aucune clé service-role n'est utilisée.

La session de confirmation client a sa propre clé de stockage `mayd-trial-auth`, séparée de la connexion administrateur. La confirmation peut ouvrir le site sur un autre appareil pour un nouveau compte grâce aux métadonnées de la demande. Pour un compte existant sans métadonnées, le formulaire demande de compléter les informations après confirmation.

Le backend local ne simule pas l'envoi de liens par email : ce parcours nécessite le backend distant. Les messages ordinaires et l'administration locale restent disponibles.

## Vérification réelle après configuration

Demander un essai avec une adresse que vous contrôlez, ouvrir le lien reçu et vérifier le message de succès, puis vérifier le prospect dans `/admin/messages`. Rouvrir le lien/la page ne doit pas créer une deuxième demande. Vérifier aussi le refus d'un lien expiré. Une demande par compte est acceptée ; une nouvelle tentative ne modifie pas une demande existante.
