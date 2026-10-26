-- Roles
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "Users can read their own roles"
on public.user_roles for select to authenticated
using (user_id = auth.uid());

-- Is there already an admin? (used to show first-time setup)
create or replace function public.admin_exists()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.user_roles where role = 'admin')
$$;
grant execute on function public.admin_exists() to anon, authenticated;

-- First account ever created becomes the admin
create or replace function public.assign_first_admin()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  end if;
  return new;
end;
$$;

create trigger on_auth_user_created_assign_admin
after insert on auth.users
for each row execute function public.assign_first_admin();

-- updated_at helper
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Site settings (single row)
create table public.site_settings (
  id boolean primary key default true check (id),
  brand_name text not null default 'MEHDI',
  brand_suffix text not null default 'Digital Studio',
  brand_description text not null default 'Sites web, réseaux sociaux et identité digitale pour les entreprises locales et les entrepreneurs.',
  owner_name text not null default 'Mehdi',
  email text,
  whatsapp text,
  phone text,
  instagram_url text,
  facebook_url text,
  tiktok_url text,
  portrait_url text,
  hero_laptop_url text,
  hero_phone_1_url text,
  hero_phone_2_url text,
  updated_at timestamptz not null default now()
);
grant select on public.site_settings to anon, authenticated;
grant update on public.site_settings to authenticated;
grant all on public.site_settings to service_role;
alter table public.site_settings enable row level security;

create policy "Anyone can read site settings"
on public.site_settings for select to anon, authenticated using (true);
create policy "Admins can update site settings"
on public.site_settings for update to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

create trigger site_settings_touch before update on public.site_settings
for each row execute function public.touch_updated_at();

insert into public.site_settings (id) values (true);

-- Projects
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 1 and 160),
  client_category text not null default '',
  categories text[] not null default '{}',
  services text[] not null default '{}',
  short_description text not null default '',
  business_description text not null default '',
  client_needs text not null default '',
  work_done text not null default '',
  cover_url text,
  before_image_url text,
  after_image_url text,
  external_url text,
  external_label text,
  is_demo boolean not null default false,
  is_featured boolean not null default false,
  is_published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index projects_sort_idx on public.projects (sort_order, created_at);
grant select on public.projects to anon;
grant select, insert, update, delete on public.projects to authenticated;
grant all on public.projects to service_role;
alter table public.projects enable row level security;

create policy "Published projects are public"
on public.projects for select to anon, authenticated using (is_published = true);
create policy "Admins can read all projects"
on public.projects for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins can insert projects"
on public.projects for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins can update projects"
on public.projects for update to authenticated
using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins can delete projects"
on public.projects for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

create trigger projects_touch before update on public.projects
for each row execute function public.touch_updated_at();

-- Project media (images, uploaded videos, embedded videos)
create type public.media_kind as enum ('image', 'video', 'embed');
create type public.media_frame as enum ('none', 'laptop', 'phone');

create table public.project_media (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  kind public.media_kind not null default 'image',
  url text not null,
  caption text not null default '',
  frame public.media_frame not null default 'none',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
create index project_media_project_idx on public.project_media (project_id, sort_order);
grant select on public.project_media to anon;
grant select, insert, update, delete on public.project_media to authenticated;
grant all on public.project_media to service_role;
alter table public.project_media enable row level security;

create policy "Media of published projects is public"
on public.project_media for select to anon, authenticated
using (exists (select 1 from public.projects p where p.id = project_id and p.is_published = true));
create policy "Admins can read all media"
on public.project_media for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins can insert media"
on public.project_media for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins can update media"
on public.project_media for update to authenticated
using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins can delete media"
on public.project_media for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

-- Contact messages
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 100),
  company text not null default '' check (char_length(company) <= 120),
  contact text not null check (char_length(contact) between 3 and 160),
  service text not null default '' check (char_length(service) <= 80),
  message text not null check (char_length(message) between 1 and 2000),
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);
grant insert on public.contact_messages to anon;
grant select, insert, update, delete on public.contact_messages to authenticated;
grant all on public.contact_messages to service_role;
alter table public.contact_messages enable row level security;

create policy "Anyone can send a contact message"
on public.contact_messages for insert to anon, authenticated with check (is_read = false);
create policy "Admins can read messages"
on public.contact_messages for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins can update messages"
on public.contact_messages for update to authenticated
using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins can delete messages"
on public.contact_messages for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

-- Demonstration projects (clearly flagged, can be deleted from the dashboard)
insert into public.projects (slug, title, client_category, categories, services, short_description, business_description, client_needs, work_done, cover_url, is_demo, is_featured, is_published, sort_order) values
('demo-cafe-de-quartier', 'Café de quartier', 'Café & coffee shop', array['sites-web','instagram'], array['Site web vitrine','Profil Instagram'],
 'Un concept de site vitrine et de profil Instagram chaleureux pour un café de quartier.',
 'Projet de démonstration imaginé pour illustrer la présence digitale d''un café indépendant : carte, ambiance, horaires et prise de contact.',
 'Être trouvé facilement en ligne, présenter la carte et l''ambiance du lieu, et donner envie de passer la porte.',
 'Conception d''un site une page avec carte et plan d''accès, et d''une grille Instagram cohérente avec l''identité du lieu.',
 '/demo/cafe.jpg', true, true, true, 1),
('demo-institut-beaute', 'Institut de beauté', 'Salon de beauté', array['instagram','identite-visuelle'], array['Profil Instagram','Identité visuelle'],
 'Un concept de profil Instagram élégant et d''identité visuelle douce pour un institut de beauté.',
 'Projet de démonstration montrant comment un salon de beauté peut présenter ses prestations avec une image soignée et cohérente.',
 'Valoriser les prestations, inspirer confiance et faciliter la prise de rendez-vous depuis les réseaux sociaux.',
 'Création d''une palette, de modèles de publications et de highlights, et optimisation de la biographie du profil.',
 '/demo/beaute.jpg', true, true, true, 2),
('demo-restaurant-familial', 'Restaurant familial', 'Restaurant', array['facebook','sites-web'], array['Page Facebook','Site web'],
 'Un concept de page Facebook complète et de site web pour un restaurant familial.',
 'Projet de démonstration illustrant la présence digitale d''un restaurant : menu, événements, avis et réservation.',
 'Informer la clientèle locale des menus et événements, et simplifier les réservations.',
 'Mise en place d''une page Facebook structurée (couverture, informations, boutons d''action) et d''un site avec menu.',
 '/demo/restaurant.jpg', true, true, true, 3),
('demo-boutique-mode', 'Boutique de mode', 'Commerce de détail', array['tiktok','instagram'], array['Compte TikTok','Profil Instagram'],
 'Un concept de compte TikTok et de profil Instagram dynamiques pour une boutique de prêt-à-porter.',
 'Projet de démonstration montrant comment une boutique peut présenter ses nouveautés en vidéo courte.',
 'Montrer les nouveautés de façon vivante et toucher une clientèle plus jeune.',
 'Création du compte, de la biographie, de couvertures de vidéos et d''un format récurrent de présentation des nouveautés.',
 '/demo/boutique.jpg', true, false, true, 4);

insert into public.project_media (project_id, kind, url, caption, frame, sort_order)
select id, 'image', cover_url, 'Visuel de présentation du concept', 'none', 0 from public.projects where is_demo = true;