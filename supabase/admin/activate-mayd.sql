-- Run once from the project's privileged SQL Editor.
-- Activates only the existing MAYD owner account without sending an email.
begin;
do $$
declare owner_id uuid;
begin
  select id into owner_id from auth.users where lower(email) = 'maynd@contact.com';
  if owner_id is null then
    raise exception 'Compte MAYD introuvable. Créer le compte avec scripts/setup-admin.mjs et une clé serveur.';
  end if;
  update auth.users
  set email_confirmed_at = coalesce(email_confirmed_at, now()),
      confirmation_token = '', updated_at = now()
  where id = owner_id;
  insert into public.user_roles(user_id, role) values (owner_id, 'admin')
    on conflict (user_id, role) do nothing;
end $$;
commit;
