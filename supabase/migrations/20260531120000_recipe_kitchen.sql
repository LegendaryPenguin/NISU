-- NISU Kitchen: extended recipe catalog

alter table recipes add column if not exists is_builtin boolean not null default false;
alter table recipes add column if not exists category text;
alter table recipes add column if not exists region text default 'pan-indian';
alter table recipes add column if not exists description text;
alter table recipes add column if not exists image_url text;
alter table recipes add column if not exists prep_minutes integer default 10;
alter table recipes add column if not exists cook_minutes integer default 20;
alter table recipes add column if not exists difficulty text default 'easy';
alter table recipes add column if not exists tags text[] default '{}';
alter table recipes add column if not exists servings integer default 2;

alter table recipe_steps add column if not exists step_ingredients jsonb default '[]';
alter table recipe_steps add column if not exists image_url text;
alter table recipe_steps add column if not exists youtube_url text;
alter table recipe_steps add column if not exists tip text;

create index if not exists idx_recipes_builtin on recipes(is_builtin) where is_builtin = true;
create index if not exists idx_recipes_category on recipes(category);
