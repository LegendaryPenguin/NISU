DO $$
DECLARE
  rid uuid;
BEGIN
  -- Pakora
  IF NOT EXISTS (SELECT 1 FROM recipes WHERE is_builtin = true AND name = 'Pakora') THEN
  INSERT INTO recipes (name, user_id, is_builtin, category, region, description, image_url, prep_minutes, cook_minutes, difficulty, tags, servings)
  VALUES ('Pakora', NULL, true, 'snack', 'north', 'Crispy gram-flour fritters with onion and spinach.', '/recipes/indian/snack.svg', 10, 12, 'easy', ARRAY['vegetarian', 'vegan', 'gluten-free', 'quick']::text[], 2)
  RETURNING id INTO rid;
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 cup besan (gram flour)', 0);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 medium onion, thinly sliced', 1);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 cup spinach, chopped', 2);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 green chilli, chopped', 3);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '½ tsp ajwain', 4);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '½ tsp red chilli powder', 5);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Oil for deep frying', 6);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Salt to taste', 7);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Mix besan with onion, spinach, green chilli, ajwain, red chilli powder, and salt.', null, 0, '["1 cup besan","1 medium onion","1 cup spinach","1 green chilli","½ tsp ajwain","½ tsp red chilli powder","Salt to taste"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add water gradually to form a thick coating batter — not runny.', null, 1, '["1 cup besan"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Heat oil in a kadai on medium-high.', null, 2, '["Oil for deep frying"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Drop spoonfuls of batter into hot oil. Fry without crowding the pan.', null, 3, '["Oil for deep frying"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Fry until golden and crisp on all sides, about 3–4 minutes per batch.', 240, 4, '[]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Drain on paper towels. Serve hot with green chutney and masala chai.', null, 5, '[]'::jsonb, NULL, NULL, NULL);
  END IF;

  -- Vada Pav
  IF NOT EXISTS (SELECT 1 FROM recipes WHERE is_builtin = true AND name = 'Vada Pav') THEN
  INSERT INTO recipes (name, user_id, is_builtin, category, region, description, image_url, prep_minutes, cook_minutes, difficulty, tags, servings)
  VALUES ('Vada Pav', NULL, true, 'snack', 'north', 'Mumbai''s iconic spiced potato fritter in a soft bun with chutneys.', '/recipes/indian/snack.svg', 15, 15, 'medium', ARRAY['vegetarian', 'vegan']::text[], 2)
  RETURNING id INTO rid;
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '4 pav (soft dinner rolls)', 0);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '3 medium potatoes, boiled and mashed', 1);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '½ cup besan', 2);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tsp mustard seeds', 3);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '8–10 curry leaves', 4);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 green chillies, minced', 5);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '½ tsp turmeric powder', 6);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Green chutney and tamarind chutney', 7);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Oil for deep frying', 8);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Salt to taste', 9);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Heat 1 tbsp oil. Add mustard seeds, curry leaves, and green chillies. Add mashed potato, turmeric, and salt. Cool mixture.', null, 0, '["3 medium potatoes","1 tsp mustard seeds","8–10 curry leaves","2 green chillies","½ tsp turmeric powder","Salt to taste"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Shape potato mixture into 4 round patties.', null, 1, '["3 medium potatoes"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Make thick besan batter with salt and a pinch of turmeric.', null, 2, '["½ cup besan","Salt to taste"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Dip patties in batter and deep fry until golden and crisp, about 4 minutes.', 240, 3, '["Oil for deep frying"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Slit pav horizontally without cutting through. Toast lightly on a tawa with butter or oil.', 60, 4, '["4 pav"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Spread green and tamarind chutney inside pav. Place hot vada and serve immediately.', null, 5, '["Green chutney and tamarind chutney","4 pav"]'::jsonb, NULL, NULL, NULL);
  END IF;
END $$;