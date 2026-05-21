-- =============================================
-- NISU Skill System — Database Schema
-- Run this SQL in your Supabase SQL Editor
-- =============================================

-- Skill items (both Main Skills and Wheel Skills)
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

-- Log of completed skill blocks
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

-- Daily wheel selection (one per day)
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

-- Indexes
create index if not exists idx_skill_items_kind on skill_items(kind, active);
create index if not exists idx_skill_log_date on skill_activity_log(date_key);
create index if not exists idx_wheel_selection_date on daily_wheel_selection(date_key);

-- Unique constraint: one wheel selection per date (single-user mode)
create unique index if not exists idx_wheel_selection_unique_date
  on daily_wheel_selection(date_key) where user_id is null;

-- RLS policies (open access — no auth yet)
alter table skill_items enable row level security;
create policy "Allow all skill_items" on skill_items for all using (true) with check (true);

alter table skill_activity_log enable row level security;
create policy "Allow all skill_activity_log" on skill_activity_log for all using (true) with check (true);

alter table daily_wheel_selection enable row level security;
create policy "Allow all daily_wheel_selection" on daily_wheel_selection for all using (true) with check (true);
