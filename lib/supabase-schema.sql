-- Supabase preparation for Smart Utility Dashboard V1.
-- Run this in Supabase SQL editor when moving from mock/localStorage mode to live database mode.

create table if not exists public.monthly_utility_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  year integer not null,
  month integer not null check (month between 1 and 12),
  electricity_kwh numeric not null default 0,
  electricity_cost numeric not null default 0,
  water_m3 numeric not null default 0,
  water_cost numeric not null default 0,
  fuel_type text not null default 'Diesel',
  fuel_liters numeric not null default 0,
  fuel_cost numeric not null default 0,
  note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, year, month)
);

alter table public.monthly_utility_records enable row level security;

create policy "Users can read their monthly utility records"
  on public.monthly_utility_records for select
  using (auth.uid() = user_id);

create policy "Users can insert their monthly utility records"
  on public.monthly_utility_records for insert
  with check (auth.uid() = user_id);

create policy "Users can update their monthly utility records"
  on public.monthly_utility_records for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their monthly utility records"
  on public.monthly_utility_records for delete
  using (auth.uid() = user_id);
