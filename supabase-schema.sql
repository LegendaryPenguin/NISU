-- =============================================
-- NISU Fitness System — Database Schema
-- Run this SQL in your Supabase SQL Editor
-- =============================================

-- Workout templates
create table if not exists workouts (
  id uuid default gen_random_uuid() primary key,
  user_id text,
  name text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Exercises belonging to a workout
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
