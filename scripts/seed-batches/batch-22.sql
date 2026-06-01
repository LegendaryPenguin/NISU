DO $$
DECLARE
  rid uuid;
BEGIN
  -- Pani Puri Shells Prep
  IF NOT EXISTS (SELECT 1 FROM recipes WHERE is_builtin = true AND name = 'Pani Puri Shells Prep') THEN
  INSERT INTO recipes (name, user_id, is_builtin, category, region, description, image_url, prep_minutes, cook_minutes, difficulty, tags, servings)
  VALUES ('Pani Puri Shells Prep', NULL, true, 'snack', 'north', 'Crisp hollow puri shells ready to fill with spiced water and potato.', '/recipes/indian/snack.svg', 10, 15, 'easy', ARRAY['vegetarian', 'vegan', 'quick']::text[], 2)
  RETURNING id INTO rid;
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 cup semolina (fine rava)', 0);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp maida', 1);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp hot oil', 2);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Oil for deep frying', 3);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Salt to taste', 4);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Water for dough', 5);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Mix semolina, maida, salt, and hot oil. Rub together until crumbly.', null, 0, '["1 cup semolina","2 tbsp maida","2 tbsp hot oil","Salt to taste"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add water gradually and knead into a stiff, smooth dough. Rest 15 minutes.', 900, 1, '["Water for dough"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Roll dough very thin (1mm). Cut small 2-inch circles with a cutter or lid.', null, 2, '["1 cup semolina"]'::jsonb, NULL, NULL, 'Thin rolling is key for crisp, puffed shells.');
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Heat oil on medium-low — cooler than regular frying temperature.', null, 3, '["Oil for deep frying"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Fry circles, pressing gently, until they puff into hollow balls and turn golden, about 2 minutes each.', 120, 4, '["Oil for deep frying"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Drain and cool completely. Store in an airtight container up to 1 week.', null, 5, '[]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'To serve: crack top, fill with potato-chana mixture and spiced pani water.', null, 6, '[]'::jsonb, NULL, NULL, NULL);
  END IF;

  -- Aloo Tikki
  IF NOT EXISTS (SELECT 1 FROM recipes WHERE is_builtin = true AND name = 'Aloo Tikki') THEN
  INSERT INTO recipes (name, user_id, is_builtin, category, region, description, image_url, prep_minutes, cook_minutes, difficulty, tags, servings)
  VALUES ('Aloo Tikki', NULL, true, 'snack', 'north', 'Crisp pan-fried potato patties spiced with ginger and chaat masala.', '/recipes/indian/snack.svg', 15, 12, 'easy', ARRAY['vegetarian', 'vegan', 'gluten-free', 'quick']::text[], 2)
  RETURNING id INTO rid;
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '3 medium potatoes, boiled and mashed', 0);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tbsp cornflour or rice flour', 1);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 inch ginger, grated', 2);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 green chilli, minced', 3);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tsp chaat masala', 4);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp coriander, chopped', 5);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp oil for pan frying', 6);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Salt to taste', 7);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Mix mashed potato with cornflour, ginger, green chilli, chaat masala, coriander, and salt until well combined.', null, 0, '["3 medium potatoes","1 tbsp cornflour or rice flour","1 inch ginger","1 green chilli","1 tsp chaat masala","2 tbsp coriander","Salt to taste"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Divide into 6 equal portions and shape into flat round patties about ½ inch thick.', null, 1, '["3 medium potatoes"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Heat oil in a non-stick pan on medium until shimmering.', null, 2, '["2 tbsp oil for pan frying"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Place tikkis in the pan without overcrowding. Cook undisturbed 3 minutes until bottom is golden.', 180, 3, '["2 tbsp oil for pan frying"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Flip and cook 3–4 minutes on the second side until deeply golden and crisp.', 210, 4, '[]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Drain on paper towels. Serve with tamarind chutney, yogurt, and sev.', null, 5, '[]'::jsonb, NULL, NULL, NULL);
  END IF;
END $$;