create table public.site_events (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  visitor_id uuid not null,
  kind text not null check (kind in ('pageview', 'click')),
  path text not null check (length(path) <= 300),
  target text not null default '' check (length(target) <= 300)
);
create index site_events_created_idx on public.site_events (created_at);
create index site_events_visitor_created_idx on public.site_events (visitor_id, created_at);
alter table public.site_events enable row level security;
revoke all on public.site_events from anon, authenticated;

create or replace function public.track_site_event(p_visitor uuid, p_kind text, p_path text, p_target text default '')
returns void language plpgsql security definer set search_path = public as $$
begin
  if p_kind not in ('pageview', 'click') or p_path not like '/%' or length(p_path) > 300
    or length(p_target) > 300 or p_path ~ '^/(admin|auth)(/|$)' then
    return;
  end if;
  -- Bound repeated submissions from a single browser identifier.
  if (select count(*) from public.site_events where visitor_id = p_visitor and created_at > now() - interval '1 minute') >= 60 then
    return;
  end if;
  insert into public.site_events(visitor_id, kind, path, target) values (p_visitor, p_kind, p_path, p_target);
end;
$$;
revoke all on function public.track_site_event(uuid, text, text, text) from public;
grant execute on function public.track_site_event(uuid, text, text, text) to anon, authenticated;

create or replace function public.admin_analytics(p_days integer default 30)
returns jsonb language plpgsql security definer set search_path = public as $$
declare result jsonb;
begin
  if not public.has_role(auth.uid(), 'admin') then
    raise exception 'Accès non autorisé' using errcode = '42501';
  end if;
  if p_days not in (7, 30, 90) then raise exception 'Période invalide'; end if;
  with events as (
    select * from public.site_events where created_at >= (date_trunc('day', now() at time zone 'Africa/Casablanca') at time zone 'Africa/Casablanca') - (p_days - 1) * interval '1 day'
  )
  select jsonb_build_object(
    'visitors', (select count(distinct visitor_id) from events where kind = 'pageview'),
    'views', (select count(*) from events where kind = 'pageview'),
    'clicks', (select count(*) from events where kind = 'click'),
    'daily', (select coalesce(jsonb_agg(row_to_json(d) order by d.day), '[]'::jsonb) from (
      select (created_at at time zone 'Africa/Casablanca')::date as day,
        count(*) filter (where kind = 'pageview') as views,
        count(*) filter (where kind = 'click') as clicks
      from events group by 1
    ) d),
    'pages', (select coalesce(jsonb_agg(row_to_json(p)), '[]'::jsonb) from (
      select path, count(*) as count from events where kind = 'pageview' group by path order by count(*) desc limit 10
    ) p),
    'targets', (select coalesce(jsonb_agg(row_to_json(t)), '[]'::jsonb) from (
      select target, count(*) as count from events where kind = 'click' group by target order by count(*) desc limit 10
    ) t)
  ) into result;
  return result;
end;
$$;
revoke all on function public.admin_analytics(integer) from public;
grant execute on function public.admin_analytics(integer) to authenticated;
