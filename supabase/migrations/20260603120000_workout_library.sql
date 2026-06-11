-- NISU Fitness Workout Library: exercise catalog + builtin workouts

-- Global exercise catalog
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
  difficulty text check (difficulty in ('easy', 'medium', 'hard')),
  mechanic text,
  source text default 'exercisedb',
  source_id text,
  is_builtin boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_exercises_slug on exercises(slug);
create index if not exists idx_exercises_builtin on exercises(is_builtin) where is_builtin = true;

-- Extend workouts for builtin library
alter table workouts add column if not exists is_builtin boolean not null default false;
alter table workouts add column if not exists category text;
alter table workouts add column if not exists description text;
alter table workouts add column if not exists cover_image_url text;
alter table workouts add column if not exists difficulty text check (difficulty in ('easy', 'medium', 'hard'));
alter table workouts add column if not exists estimated_minutes integer;
alter table workouts add column if not exists equipment_tags text[] default '{}';
alter table workouts add column if not exists tags text[] default '{}';
alter table workouts add column if not exists calories_estimate integer;

create index if not exists idx_workouts_builtin on workouts(is_builtin) where is_builtin = true;
create index if not exists idx_workouts_category on workouts(category);

-- Extend workout_exercises to reference catalog
alter table workout_exercises add column if not exists exercise_id uuid references exercises(id) on delete set null;
alter table workout_exercises add column if not exists rest_seconds integer default 45;
alter table workout_exercises add column if not exists notes text;
alter table workout_exercises add column if not exists instructions_override text;

create index if not exists idx_workout_exercises_exercise on workout_exercises(exercise_id);

-- Storage bucket for cached exercise GIFs (public read)
insert into storage.buckets (id, name, public)
values ('exercise-media', 'exercise-media', true)
on conflict (id) do nothing;

create policy "Public read exercise media"
  on storage.objects for select
  using (bucket_id = 'exercise-media');

-- RLS: builtins readable by all; user workouts scoped to owner
drop policy if exists "Allow all workouts" on workouts;
create policy "Read builtin or own workouts" on workouts
  for select using (is_builtin = true or auth.uid() = user_id);
create policy "Insert own workouts" on workouts
  for insert with check (is_builtin = false and auth.uid() = user_id);
create policy "Update own workouts" on workouts
  for update using (is_builtin = false and auth.uid() = user_id);
create policy "Delete own workouts" on workouts
  for delete using (is_builtin = false and auth.uid() = user_id);

drop policy if exists "Allow all workout_exercises" on workout_exercises;
create policy "Read workout exercises" on workout_exercises
  for select using (
    exists (
      select 1 from workouts w
      where w.id = workout_exercises.workout_id
      and (w.is_builtin = true or w.user_id = auth.uid())
    )
  );
create policy "Manage own workout exercises" on workout_exercises
  for all using (
    exists (
      select 1 from workouts w
      where w.id = workout_exercises.workout_id
      and w.is_builtin = false
      and w.user_id = auth.uid()
    )
  );

alter table exercises enable row level security;
create policy "Read builtin exercises" on exercises
  for select using (is_builtin = true);

drop policy if exists "Allow all fitness_activity_log" on fitness_activity_log;
create policy "Own fitness logs" on fitness_activity_log
  for all using (user_id = auth.uid())
  with check (user_id = auth.uid());
