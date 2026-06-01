DO $$
DECLARE
  rid uuid;
BEGIN
  -- Roti
  IF NOT EXISTS (SELECT 1 FROM recipes WHERE is_builtin = true AND name = 'Roti') THEN
  INSERT INTO recipes (name, user_id, is_builtin, category, region, description, image_url, prep_minutes, cook_minutes, difficulty, tags, servings)
  VALUES ('Roti', NULL, true, 'bread', 'north', 'Everyday whole-wheat flatbread — soft phulka cooked on a tawa.', '/recipes/indian/bread.svg', 10, 15, 'easy', ARRAY['vegetarian', 'vegan', 'quick']::text[], 2)
  RETURNING id INTO rid;
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 cup whole wheat flour (atta)', 0);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '½ tsp salt', 1);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tsp oil', 2);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Water for kneading', 3);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Dry flour for rolling', 4);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Ghee for serving (optional)', 5);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Mix atta, salt, and oil. Add water gradually and knead into a soft, smooth dough for 4–5 minutes.', null, 0, '["1 cup whole wheat flour","½ tsp salt","1 tsp oil","Water for kneading"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Cover dough and rest 15 minutes.', 900, 1, '[]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Divide into 6 equal balls. Roll each into a thin 6-inch circle on a floured surface.', null, 2, '["1 cup whole wheat flour","Dry flour for rolling"]'::jsonb, NULL, 'https://www.youtube.com/watch?v=YF5jBqkHq9c', 'Even thickness helps roti puff up uniformly.');
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Heat tawa on high. Place roti and cook 30 seconds until bubbles appear.', 30, 3, '[]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Flip and cook 30 seconds. Transfer directly to an open gas flame.', 30, 4, '[]'::jsonb, NULL, 'https://www.youtube.com/watch?v=YF5jBqkHq9c', 'Use tongs and rotate quickly so it puffs without burning.');
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'When roti puffs, remove and brush with ghee if desired.', null, 5, '["Ghee for serving"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Repeat for remaining dough balls. Serve hot with any curry or dal.', null, 6, '[]'::jsonb, NULL, NULL, NULL);
  END IF;

  -- Naan
  IF NOT EXISTS (SELECT 1 FROM recipes WHERE is_builtin = true AND name = 'Naan') THEN
  INSERT INTO recipes (name, user_id, is_builtin, category, region, description, image_url, prep_minutes, cook_minutes, difficulty, tags, servings)
  VALUES ('Naan', NULL, true, 'bread', 'north', 'Soft leavened flatbread with yogurt — stovetop tawa version.', '/recipes/indian/bread.svg', 15, 12, 'medium', ARRAY['vegetarian']::text[], 2)
  RETURNING id INTO rid;
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 cup maida (all-purpose flour)', 0);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp yogurt', 1);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '½ tsp baking powder', 2);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '½ tsp sugar', 3);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp milk', 4);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tbsp oil', 5);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp butter', 6);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Salt to taste', 7);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Nigella seeds for topping', 8);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Mix maida, baking powder, sugar, salt, yogurt, milk, and oil into a soft dough. Knead 5 minutes.', null, 0, '["1 cup maida","2 tbsp yogurt","½ tsp baking powder","½ tsp sugar","2 tbsp milk","1 tbsp oil","Salt to taste"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Cover and rest dough 1 hour in a warm place.', 3600, 1, '[]'::jsonb, NULL, NULL, 'For a quicker version, rest at least 30 minutes.');
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Divide into 4 balls. Roll each into a teardrop shape about ¼ inch thick.', null, 2, '["1 cup maida"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Sprinkle nigella seeds on top and press lightly with rolling pin.', null, 3, '["Nigella seeds for topping"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Heat tawa on high. Place naan wet-side down (optional water brush) and cook until bubbles form, about 2 minutes.', 120, 4, '[]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Flip and cook 1–2 minutes until golden spots appear.', 120, 5, '[]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Brush with butter and serve hot with paneer curry or dal makhani.', null, 6, '["2 tbsp butter"]'::jsonb, NULL, NULL, NULL);
  END IF;
END $$;