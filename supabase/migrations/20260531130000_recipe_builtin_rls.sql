-- Allow all authenticated users to read shared NISU Kitchen recipes
drop policy if exists "Users own recipes" on recipes;

create policy "Read own and builtin recipes"
  on recipes for select
  using (is_builtin = true or auth.uid() = user_id);

create policy "Users insert own recipes"
  on recipes for insert
  with check (is_builtin = false and auth.uid() = user_id);

create policy "Users update own recipes"
  on recipes for update
  using (is_builtin = false and auth.uid() = user_id)
  with check (is_builtin = false and auth.uid() = user_id);

create policy "Users delete own recipes"
  on recipes for delete
  using (is_builtin = false and auth.uid() = user_id);

-- Child tables: allow read when parent is visible
drop policy if exists "Allow all recipe_ingredients" on recipe_ingredients;
drop policy if exists "Allow all recipe_steps" on recipe_steps;

create policy "Read ingredients for visible recipes"
  on recipe_ingredients for select
  using (
    exists (
      select 1 from recipes r
      where r.id = recipe_id
        and (r.is_builtin = true or r.user_id = auth.uid())
    )
  );

create policy "Manage own recipe ingredients"
  on recipe_ingredients for all
  using (
    exists (
      select 1 from recipes r
      where r.id = recipe_id and r.user_id = auth.uid() and r.is_builtin = false
    )
  )
  with check (
    exists (
      select 1 from recipes r
      where r.id = recipe_id and r.user_id = auth.uid() and r.is_builtin = false
    )
  );

create policy "Read steps for visible recipes"
  on recipe_steps for select
  using (
    exists (
      select 1 from recipes r
      where r.id = recipe_id
        and (r.is_builtin = true or r.user_id = auth.uid())
    )
  );

create policy "Manage own recipe steps"
  on recipe_steps for all
  using (
    exists (
      select 1 from recipes r
      where r.id = recipe_id and r.user_id = auth.uid() and r.is_builtin = false
    )
  )
  with check (
    exists (
      select 1 from recipes r
      where r.id = recipe_id and r.user_id = auth.uid() and r.is_builtin = false
    )
  );
