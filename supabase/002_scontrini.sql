-- A'Dispensa: scontrini (foto) condivisi in famiglia.
-- Da incollare in Supabase → SQL Editor → Run, DOPO schema.sql. Si può rieseguire senza problemi.

-- Scheda di ogni scontrino (la foto vera sta nello Storage, cartella = id della casa)
create table if not exists public.receipts (
  id           uuid primary key,
  household_id uuid not null references public.households on delete cascade,
  path         text not null,            -- foto intera
  thumb_path   text,                      -- anteprima piccola
  taken_on     date not null default current_date,
  store_id     uuid references public.stores on delete set null,
  total        numeric,                   -- per il futuro menu Spese
  notes        text,
  created_at   timestamptz not null default now(),
  by_user      uuid
);
create index if not exists receipts_household_idx on public.receipts (household_id, taken_on);

alter table public.receipts enable row level security;
drop policy if exists receipts_all on public.receipts;
create policy receipts_all on public.receipts for all to authenticated
  using (public.is_member(household_id)) with check (public.is_member(household_id));

do $$
begin
  begin alter publication supabase_realtime add table public.receipts; exception when duplicate_object then null; end;
end $$;

-- Spazio privato per le foto (max 5 MB l'una, solo immagini)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('receipts', 'receipts', false, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

-- La prima cartella del percorso è l'id della casa: si accede solo se se ne è membri
create or replace function public.is_member_path(p text)
returns boolean
language plpgsql security definer stable
set search_path = public
as $$
begin
  return public.is_member(split_part(p, '/', 1)::uuid);
exception when others then
  return false;
end;
$$;

drop policy if exists receipts_files_read   on storage.objects;
drop policy if exists receipts_files_add    on storage.objects;
drop policy if exists receipts_files_delete on storage.objects;
create policy receipts_files_read   on storage.objects for select to authenticated
  using (bucket_id = 'receipts' and public.is_member_path(name));
create policy receipts_files_add    on storage.objects for insert to authenticated
  with check (bucket_id = 'receipts' and public.is_member_path(name));
create policy receipts_files_delete on storage.objects for delete to authenticated
  using (bucket_id = 'receipts' and public.is_member_path(name));
