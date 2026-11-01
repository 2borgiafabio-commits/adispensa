-- A'Dispensa: schema del database (Supabase).
-- Da incollare una volta sola in Supabase → SQL Editor → Run.
-- Ogni telefono entra con un login anonimo e diventa "membro" di una casa
-- inserendo il codice famiglia. Le regole RLS fanno vedere a ciascuno solo i dati della propria casa.

-- Case (famiglie)
create table if not exists public.households (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  code       text not null unique,
  created_at timestamptz not null default now()
);

-- Chi fa parte di quale casa (un utente anonimo per telefono)
create table if not exists public.members (
  household_id uuid not null references public.households on delete cascade,
  user_id      uuid not null default auth.uid() references auth.users on delete cascade,
  nickname     text,
  joined_at    timestamptz not null default now(),
  primary key (household_id, user_id)
);

-- Categorie (fanno anche da "reparto" nella lista)
create table if not exists public.categories (
  id           uuid primary key,
  household_id uuid not null references public.households on delete cascade,
  name         text not null,
  color        text not null default 'gray',
  sort         int  not null default 0,
  updated_at   timestamptz not null default now()
);

-- Negozi (supermercato, farmacia, ...)
create table if not exists public.stores (
  id           uuid primary key,
  household_id uuid not null references public.households on delete cascade,
  name         text not null,
  sort         int  not null default 0,
  updated_at   timestamptz not null default now()
);

-- Prodotti di casa
create table if not exists public.items (
  id           uuid primary key,
  household_id uuid not null references public.households on delete cascade,
  name         text not null,
  category_id  uuid references public.categories on delete set null,
  store_id     uuid references public.stores on delete set null,
  unit         text,
  qty          numeric,            -- null = non conto le quantità, segno io lo stato
  min_qty      numeric,            -- soglia minima
  buy_qty      numeric not null default 1,  -- quanti ne compro di solito
  status       text not null default 'ok' check (status in ('ok','low','out')),
  on_list      boolean not null default false,
  expiry       date,
  notes        text,
  updated_at   timestamptz not null default now(),
  updated_by   uuid
);

-- Registro di tutto ciò che succede (serve per imparare i consumi)
create table if not exists public.events (
  id           uuid primary key,
  household_id uuid not null references public.households on delete cascade,
  item_id      uuid references public.items on delete cascade,
  type         text not null,      -- low, out, bought, used, added, listed, unlisted, wasted, consumed
  qty          numeric,
  at           timestamptz not null default now(),
  by_user      uuid
);

create index if not exists items_household_idx      on public.items (household_id);
create index if not exists events_household_at_idx  on public.events (household_id, at);
create index if not exists events_item_idx          on public.events (item_id);
create index if not exists categories_household_idx on public.categories (household_id);
create index if not exists stores_household_idx     on public.stores (household_id);

-- È membro di questa casa?
create or replace function public.is_member(h uuid)
returns boolean
language sql security definer stable
set search_path = public
as $$
  select exists (select 1 from public.members where household_id = h and user_id = auth.uid());
$$;

-- Crea una casa nuova e ci entra come primo membro
create or replace function public.create_household(p_id uuid, p_name text, p_code text, p_nickname text)
returns uuid
language plpgsql security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Accesso non effettuato';
  end if;
  insert into public.households (id, name, code) values (p_id, p_name, upper(trim(p_code)));
  insert into public.members (household_id, user_id, nickname) values (p_id, auth.uid(), p_nickname);
  return p_id;
end;
$$;

-- Entra in una casa esistente con il codice famiglia
create or replace function public.join_household(p_code text, p_nickname text)
returns table (id uuid, name text, code text)
language plpgsql security definer
set search_path = public
as $$
declare
  h public.households;
begin
  if auth.uid() is null then
    raise exception 'Accesso non effettuato';
  end if;
  select * into h from public.households where households.code = upper(trim(p_code));
  if h.id is null then
    raise exception 'Codice non valido';
  end if;
  insert into public.members (household_id, user_id, nickname)
  values (h.id, auth.uid(), p_nickname)
  on conflict (household_id, user_id) do update set nickname = excluded.nickname;
  return query select h.id, h.name, h.code;
end;
$$;

revoke all on function public.create_household(uuid, text, text, text) from public, anon;
revoke all on function public.join_household(text, text) from public, anon;
grant execute on function public.create_household(uuid, text, text, text) to authenticated;
grant execute on function public.join_household(text, text) to authenticated;

-- Regole di accesso (RLS)
alter table public.households enable row level security;
alter table public.members    enable row level security;
alter table public.categories enable row level security;
alter table public.stores     enable row level security;
alter table public.items      enable row level security;
alter table public.events     enable row level security;

drop policy if exists households_read   on public.households;
drop policy if exists households_update on public.households;
create policy households_read   on public.households for select to authenticated using (public.is_member(id));
create policy households_update on public.households for update to authenticated using (public.is_member(id)) with check (public.is_member(id));

drop policy if exists members_read        on public.members;
drop policy if exists members_update_self on public.members;
drop policy if exists members_leave       on public.members;
create policy members_read        on public.members for select to authenticated using (public.is_member(household_id));
create policy members_update_self on public.members for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy members_leave       on public.members for delete to authenticated using (user_id = auth.uid());

drop policy if exists categories_all on public.categories;
drop policy if exists stores_all     on public.stores;
drop policy if exists items_all      on public.items;
drop policy if exists events_all     on public.events;
create policy categories_all on public.categories for all to authenticated using (public.is_member(household_id)) with check (public.is_member(household_id));
create policy stores_all     on public.stores     for all to authenticated using (public.is_member(household_id)) with check (public.is_member(household_id));
create policy items_all      on public.items      for all to authenticated using (public.is_member(household_id)) with check (public.is_member(household_id));
create policy events_all     on public.events     for all to authenticated using (public.is_member(household_id)) with check (public.is_member(household_id));

-- Aggiornamenti in tempo reale tra i telefoni
do $$
begin
  begin alter publication supabase_realtime add table public.items;      exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.categories; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.stores;     exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.members;    exception when duplicate_object then null; end;
end $$;
