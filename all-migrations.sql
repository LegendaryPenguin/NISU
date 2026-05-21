-- =============================================
-- NISU — All Database Tables
-- Paste this entire block into Supabase SQL Editor and click Run
-- =============================================

-- === FITNESS TABLES ===

create table if not exists workouts (
  id uuid default gen_random_uuid() primary key,
  user_id text,
  name text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists workout_exercises (
  id uuid default gen_random_uuid() primary key,
  workout_id uuid references workouts(id) on delete cascade not null,
  name text not null,
  type text not null check (type in ('sets_reps', 'timed')),
  sets integer,
  reps integer,
  duration_seconds integer,
  order_index integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists fitness_activity_log (
  id uuid default gen_random_uuid() primary key,
  user_id text,
  date_key text not null,
  type text not null check (type in ('workout', 'steps', 'fun_active')),
  workout_id uuid references workouts(id) on delete set null,
  workout_name text,
  description text,
  steps_confirmed boolean,
  fun_active_description text,
  completed_at timestamptz default now()
);

create index if not exists idx_fitness_log_date on fitness_activity_log(date_key);
create index if not exists idx_fitness_log_type_date on fitness_activity_log(type, date_key);

alter table workouts enable row level security;
create policy "Allow all workouts" on workouts for all using (true) with check (true);

alter table workout_exercises enable row level security;
create policy "Allow all workout_exercises" on workout_exercises for all using (true) with check (true);

alter table fitness_activity_log enable row level security;
create policy "Allow all fitness_activity_log" on fitness_activity_log for all using (true) with check (true);

-- === SKILL TABLES ===

create table if not exists skill_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid null,
  kind text not null check (kind in ('main', 'wheel')),
  name text not null,
  time text not null,
  description text not null,
  repeatable boolean not null default true,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists skill_activity_log (
  id uuid default gen_random_uuid() primary key,
  user_id uuid null,
  date_key text not null,
  type text not null check (type in ('main', 'wheel')),
  skill_item_id uuid null references skill_items(id) on delete set null,
  skill_name text not null,
  skill_time text null,
  skill_description text null,
  completed_at timestamptz not null default now()
);

create table if not exists daily_wheel_selection (
  id uuid default gen_random_uuid() primary key,
  user_id uuid null,
  date_key text not null,
  skill_item_id uuid not null references skill_items(id) on delete cascade,
  skill_name text not null,
  skill_time text null,
  skill_description text null,
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  completed_at timestamptz null
);

create index if not exists idx_skill_items_kind on skill_items(kind, active);
create index if not exists idx_skill_log_date on skill_activity_log(date_key);
create index if not exists idx_wheel_selection_date on daily_wheel_selection(date_key);

create unique index if not exists idx_wheel_selection_unique_date
  on daily_wheel_selection(date_key) where user_id is null;

alter table skill_items enable row level security;
create policy "Allow all skill_items" on skill_items for all using (true) with check (true);

alter table skill_activity_log enable row level security;
create policy "Allow all skill_activity_log" on skill_activity_log for all using (true) with check (true);

alter table daily_wheel_selection enable row level security;
create policy "Allow all daily_wheel_selection" on daily_wheel_selection for all using (true) with check (true);
