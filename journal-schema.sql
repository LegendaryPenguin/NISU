-- Journal / Brain Dump table for NISU app

create table if not exists journal_entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid null,
  date_key text not null,
  mind text not null,
  next_action text not null,
  avoiding text not null,
  good_thing text not null,
  extra_dump text null,
  created_at timestamptz not null default now()
);

create index if not exists idx_journal_entries_date on journal_entries(date_key);
create index if not exists idx_journal_entries_created on journal_entries(created_at desc);

alter table journal_entries enable row level security;
create policy "Allow all journal_entries" on journal_entries for all using (true) with check (true);
