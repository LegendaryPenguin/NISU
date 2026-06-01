-- NISU streak tracking: day counts at 3/4 pillars; couple stats when both succeed same day

create table if not exists daily_streak_days (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date_key text not null,
  pillars_completed smallint not null default 0 check (pillars_completed between 0 and 4),
  day_success boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, date_key)
);

create index if not exists idx_daily_streak_days_user_date
  on daily_streak_days (user_id, date_key desc);

create table if not exists user_streak_stats (
  user_id uuid primary key references auth.users(id) on delete cascade,
  current_streak integer not null default 0,
  last_success_date text,
  updated_at timestamptz not null default now()
);

create table if not exists couple_streak_stats (
  id smallint primary key default 1 check (id = 1),
  together_count integer not null default 0,
  together_streak integer not null default 0,
  last_together_date text,
  updated_at timestamptz not null default now()
);

insert into couple_streak_stats (id) values (1) on conflict (id) do nothing;

-- Maps auth users to emails for partner lookup (2-person app)
create table if not exists nisu_couple_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  updated_at timestamptz not null default now()
);

alter table nisu_couple_members enable row level security;

drop policy if exists "Authenticated read couple members" on nisu_couple_members;
create policy "Authenticated read couple members"
  on nisu_couple_members for select to authenticated using (true);

drop policy if exists "Users upsert own couple member row" on nisu_couple_members;
create policy "Users upsert own couple member row"
  on nisu_couple_members for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users update own couple member row" on nisu_couple_members;
create policy "Users update own couple member row"
  on nisu_couple_members for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

alter table daily_streak_days enable row level security;
alter table user_streak_stats enable row level security;
alter table couple_streak_stats enable row level security;

drop policy if exists "Authenticated read streak days" on daily_streak_days;
create policy "Authenticated read streak days"
  on daily_streak_days for select to authenticated using (true);

drop policy if exists "Users upsert own streak days" on daily_streak_days;
create policy "Users upsert own streak days"
  on daily_streak_days for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users update own streak days" on daily_streak_days;
create policy "Users update own streak days"
  on daily_streak_days for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Authenticated read user streak stats" on user_streak_stats;
create policy "Authenticated read user streak stats"
  on user_streak_stats for select to authenticated using (true);

drop policy if exists "Users upsert own streak stats" on user_streak_stats;
create policy "Users upsert own streak stats"
  on user_streak_stats for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users update own streak stats" on user_streak_stats;
create policy "Users update own streak stats"
  on user_streak_stats for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Authenticated read couple streak stats" on couple_streak_stats;
create policy "Authenticated read couple streak stats"
  on couple_streak_stats for select to authenticated using (true);

drop policy if exists "Authenticated update couple streak stats" on couple_streak_stats;
create policy "Authenticated update couple streak stats"
  on couple_streak_stats for update to authenticated using (true);

drop policy if exists "Authenticated insert couple streak stats" on couple_streak_stats;
create policy "Authenticated insert couple streak stats"
  on couple_streak_stats for insert to authenticated with check (true);

-- Recompute couple together stats when both partners succeed on the same day
create or replace function public.check_couple_streak(p_date_key text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  success_count int;
  prev_date text;
  stats record;
begin
  select count(distinct user_id)::int into success_count
  from daily_streak_days
  where date_key = p_date_key and day_success = true;

  if success_count < 2 then
    return;
  end if;

  select * into stats from couple_streak_stats where id = 1 for update;
  if not found then
    insert into couple_streak_stats (id) values (1);
    select * into stats from couple_streak_stats where id = 1 for update;
  end if;

  if stats.last_together_date = p_date_key then
    return;
  end if;

  prev_date := to_char((p_date_key::date - interval '1 day')::date, 'YYYY-MM-DD');

  update couple_streak_stats
  set
    together_count = together_count + 1,
    together_streak = case
      when last_together_date = prev_date then together_streak + 1
      else 1
    end,
    last_together_date = p_date_key,
    updated_at = now()
  where id = 1;
end;
$$;

create or replace function public.sync_user_streak(
  p_user_id uuid,
  p_date_key text,
  p_pillars_completed smallint
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  day_ok boolean := p_pillars_completed >= 3;
  prev_date text;
  stats record;
  was_success boolean := false;
begin
  if auth.uid() is distinct from p_user_id then
    raise exception 'Unauthorized streak sync';
  end if;

  insert into daily_streak_days (user_id, date_key, pillars_completed, day_success, updated_at)
  values (p_user_id, p_date_key, p_pillars_completed, day_ok, now())
  on conflict (user_id, date_key) do update
  set
    pillars_completed = excluded.pillars_completed,
    day_success = excluded.day_success,
    updated_at = now()
  returning day_success into was_success;

  if not day_ok then
    return;
  end if;

  select * into stats from user_streak_stats where user_id = p_user_id for update;
  if not found then
    insert into user_streak_stats (user_id, current_streak, last_success_date)
    values (p_user_id, 1, p_date_key);
    perform public.check_couple_streak(p_date_key);
    return;
  end if;

  if stats.last_success_date = p_date_key then
    perform public.check_couple_streak(p_date_key);
    return;
  end if;

  prev_date := to_char((p_date_key::date - interval '1 day')::date, 'YYYY-MM-DD');

  update user_streak_stats
  set
    current_streak = case
      when last_success_date = prev_date then current_streak + 1
      else 1
    end,
    last_success_date = p_date_key,
    updated_at = now()
  where user_id = p_user_id;

  perform public.check_couple_streak(p_date_key);
end;
$$;

grant execute on function public.sync_user_streak(uuid, text, smallint) to authenticated;
grant execute on function public.check_couple_streak(text) to authenticated;
