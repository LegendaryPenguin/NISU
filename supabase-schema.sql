-- =============================================
-- NISU Fitness System — Database Schema
-- Run this SQL in your Supabase SQL Editor
-- =============================================

-- Global exercise catalog (see migration 20260603120000_workout_library.sql)
create table if not exists exercises (
  id uuid default gen_random_uuid() primary key,
  slug text not null unique,
  name text not null,
  description text,
  instructions text[] default '{}',
  image_url text,
  gif_url text,
  muscle_group text,
  equipment text,
  difficulty text,
  mechanic text,
  source text default 'exercisedb',
  source_id text,
  is_builtin boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Workout templates
create table if not exists workouts (
  id uuid default gen_random_uuid() primary key,
  user_id text,
  name text not null,
  is_builtin boolean not null default false,
  category text,
  description text,
  cover_image_url text,
  difficulty text,
  estimated_minutes integer,
  equipment_tags text[] default '{}',
  tags text[] default '{}',
  calories_estimate integer,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Exercises belonging to a workout
create table if not exists workout_exercises (
  id uuid default gen_random_uuid() primary key,
  workout_id uuid references workouts(id) on delete cascade not null,
  exercise_id uuid references exercises(id) on delete set null,
  name text not null,
  type text not null check (type in ('sets_reps', 'timed')),
  sets integer,
  reps integer,
  duration_seconds integer,
  rest_seconds integer default 45,
  notes text,
  instructions_override text,
  order_index integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Log of completed fitness activities (workout, steps, fun_active)
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

-- Index for fast daily lookups
create index if not exists idx_fitness_log_date on fitness_activity_log(date_key);
create index if not exists idx_fitness_log_type_date on fitness_activity_log(type, date_key);

-- RLS policies (open access for now — no auth)
alter table workouts enable row level security;
create policy "Allow all workouts" on workouts for all using (true) with check (true);

alter table workout_exercises enable row level security;
create policy "Allow all workout_exercises" on workout_exercises for all using (true) with check (true);

alter table fitness_activity_log enable row level security;
create policy "Allow all fitness_activity_log" on fitness_activity_log for all using (true) with check (true);
