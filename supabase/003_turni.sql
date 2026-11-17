-- A'Dispensa: turni di lavoro (Benedetta, Fabio) e piani di famiglia, giorno per giorno.
-- Da incollare in Supabase → SQL Editor → Run, DOPO schema.sql e 002_scontrini.sql. Si può rieseguire.

create table if not exists public.shift_days (
  id           uuid primary key,          -- calcolato dall'app da (casa, giorno): stesso giorno = stessa riga
  household_id uuid not null references public.households on delete cascade,
  day          date not null,
  benni        boolean not null default false,  -- Benedetta lavora
  benni_start  text,                             -- orario di inizio diverso dal solito (es. '13:30')
  fabio        text check (fabio in ('E', 'L', 'N', 'R', 'F')),  -- Early, Late, Night, Riposo, Ferie
  plan         text,                             -- cosa abbiamo in programma
  updated_at   timestamptz not null default now(),
  updated_by   uuid,
  unique (household_id, day)
);
create index if not exists shift_days_household_day_idx on public.shift_days (household_id, day);

alter table public.shift_days enable row level security;
drop policy if exists shift_days_all on public.shift_days;
create policy shift_days_all on public.shift_days for all to authenticated
  using (public.is_member(household_id)) with check (public.is_member(household_id));

do $$
begin
  begin alter publication supabase_realtime add table public.shift_days; exception when duplicate_object then null; end;
end $$;

-- Le foto dei turni stanno nello stesso spazio privato degli scontrini (cartella <casa>/turni/).
-- Serve anche poter sostituire una foto già caricata per lo stesso mese.
drop policy if exists receipts_files_update on storage.objects;
create policy receipts_files_update on storage.objects for update to authenticated
  using (bucket_id = 'receipts' and public.is_member_path(name))
  with check (bucket_id = 'receipts' and public.is_member_path(name));
