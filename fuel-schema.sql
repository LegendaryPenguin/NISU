-- Fuel / Recipe tables for NISU app

create table if not exists recipes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid null,
  name text not null
);

create table if not exists recipe_ingredients (
  id uuid default gen_random_uuid() primary key,
  recipe_id uuid not null references recipes(id) on delete cascade,
  text text not null,
  order_index integer not null
);

create table if not exists recipe_steps (
  id uuid default gen_random_uuid() primary key,
  recipe_id uuid not null references recipes(id) on delete cascade,
  instruction text not null,
  timer_seconds integer null,
  order_index integer not null
);

create index if not exists idx_recipe_ingredients_recipe on recipe_ingredients(recipe_id, order_index);
create index if not exists idx_recipe_steps_recipe on recipe_steps(recipe_id, order_index);

alter table recipes enable row level security;
create policy "Allow all recipes" on recipes for all using (true) with check (true);

alter table recipe_ingredients enable row level security;
create policy "Allow all recipe_ingredients" on recipe_ingredients for all using (true) with check (true);

alter table recipe_steps enable row level security;
create policy "Allow all recipe_steps" on recipe_steps for all using (true) with check (true);
