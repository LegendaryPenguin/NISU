-- One-time backfill: mark every day from app start through yesterday as a
-- successful streak day (3/4 pillars) for both registered couple members,
-- then recompute user and couple streak aggregates.

do $$
declare
  member record;
  d date;
  start_d date := '2026-05-31';
  end_d date := (timezone('utc', now())::date - 1);
  last_success text;
  day_count int;
  together_date text;
  together_total int := 0;
  together_run int := 0;
  together_last text := null;
  prev_together text;
  both_ok boolean;
begin
  if end_d < start_d then
    raise notice 'Backfill skipped: end date % is before start %', end_d, start_d;
    return;
  end if;

  for member in select user_id from nisu_couple_members loop
    for d in
      select generate_series(start_d, end_d, interval '1 day')::date
    loop
      insert into daily_streak_days (
        user_id,
        date_key,
        pillars_completed,
        day_success,
        updated_at
      )
      values (
        member.user_id,
        to_char(d, 'YYYY-MM-DD'),
        4,
        true,
        now()
      )
      on conflict (user_id, date_key) do update
      set
        pillars_completed = 4,
        day_success = true,
        updated_at = now();
    end loop;

    day_count := (end_d - start_d) + 1;
    last_success := to_char(end_d, 'YYYY-MM-DD');

    insert into user_streak_stats (
      user_id,
      current_streak,
      last_success_date,
      updated_at
    )
    values (member.user_id, day_count, last_success, now())
    on conflict (user_id) do update
    set
      current_streak = excluded.current_streak,
      last_success_date = excluded.last_success_date,
      updated_at = now();
  end loop;

  for d in
    select generate_series(start_d, end_d, interval '1 day')::date
  loop
    together_date := to_char(d, 'YYYY-MM-DD');
    select count(distinct user_id) = 2
    into both_ok
    from daily_streak_days
    where date_key = together_date and day_success = true;

    if both_ok then
      together_total := together_total + 1;
      prev_together := to_char((d - 1)::date, 'YYYY-MM-DD');
      if together_last = prev_together then
        together_run := together_run + 1;
      else
        together_run := 1;
      end if;
      together_last := together_date;
    end if;
  end loop;

  insert into couple_streak_stats (id, together_count, together_streak, last_together_date, updated_at)
  values (1, together_total, together_run, together_last, now())
  on conflict (id) do update
  set
    together_count = excluded.together_count,
    together_streak = excluded.together_streak,
    last_together_date = excluded.last_together_date,
    updated_at = now();
end;
$$;
