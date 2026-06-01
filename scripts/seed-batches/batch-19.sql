DO $$
DECLARE
  rid uuid;
BEGIN
  -- Bhatura
  IF NOT EXISTS (SELECT 1 FROM recipes WHERE is_builtin = true AND name = 'Bhatura') THEN
  INSERT INTO recipes (name, user_id, is_builtin, category, region, description, image_url, prep_minutes, cook_minutes, difficulty, tags, servings)
  VALUES ('Bhatura', NULL, true, 'bread', 'north', 'Fluffy deep-fried leavened bread — perfect with chole.', '/recipes/indian/bread.svg', 15, 12, 'medium', ARRAY['vegetarian']::text[], 2)
  RETURNING id INTO rid;
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 cup maida (all-purpose flour)', 0);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp yogurt', 1);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '½ tsp baking soda', 2);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '½ tsp sugar', 3);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tbsp oil', 4);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Oil for deep frying', 5);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Salt to taste', 6);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Mix maida, baking soda, sugar, salt, yogurt, and oil. Knead into a soft, sticky dough.', null, 0, '["1 cup maida","2 tbsp yogurt","½ tsp baking soda","½ tsp sugar","1 tbsp oil","Salt to taste"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Cover and rest 2 hours until dough rises slightly.', 7200, 1, '[]'::jsonb, NULL, NULL, 'Minimum 30 minutes rest works for a quick version.');
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Knead briefly and divide into 4 balls. Roll each into a 5-inch oval disc.', null, 2, '["1 cup maida"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Heat oil on medium-high. Slide bhatura in and it should puff within seconds.', null, 3, '["Oil for deep frying"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Press gently with a spoon to help puffing. Fry until golden on both sides, about 1 minute total.', 60, 4, '[]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Drain and serve hot with chole and pickled onion.', null, 5, '[]'::jsonb, NULL, NULL, NULL);
  END IF;

  -- Samosa
  IF NOT EXISTS (SELECT 1 FROM recipes WHERE is_builtin = true AND name = 'Samosa') THEN
  INSERT INTO recipes (name, user_id, is_builtin, category, region, description, image_url, prep_minutes, cook_minutes, difficulty, tags, servings)
  VALUES ('Samosa', NULL, true, 'snack', 'north', 'Crisp pastry triangles filled with spiced potato and peas.', '/recipes/indian/snack.svg', 25, 20, 'medium', ARRAY['vegetarian', 'vegan']::text[], 2)
  RETURNING id INTO rid;
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 cup maida (all-purpose flour)', 0);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 medium potatoes, boiled and mashed', 1);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '¼ cup green peas', 2);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tsp cumin seeds', 3);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tsp garam masala', 4);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 green chilli, minced', 5);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '3 tbsp oil for dough', 6);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Oil for deep frying', 7);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Salt to taste', 8);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Make dough with maida, 3 tbsp oil, salt, and water — stiff but pliable. Rest 20 minutes.', 1200, 0, '["1 cup maida","3 tbsp oil","Salt to taste"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Heat 1 tbsp oil. Add cumin, green chilli, peas, and mashed potato with garam masala and salt. Cook filling 3 minutes.', 180, 1, '["2 medium potatoes","¼ cup green peas","1 tsp cumin seeds","1 green chilli","1 tsp garam masala","Salt to taste"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Divide dough into 4 balls. Roll each into an oval, cut in half to make two semicircles.', null, 2, '["1 cup maida"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Form each semicircle into a cone. Fill with potato mixture and seal edges with water.', null, 3, '["2 medium potatoes"]'::jsonb, NULL, NULL, 'Press seams firmly so samosas do not open while frying.');
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Heat oil on medium (not too hot). Fry samosas low and slow until golden and crisp, about 8–10 minutes.', 540, 4, '["Oil for deep frying"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Drain on paper towels. Serve with tamarind and mint chutney.', null, 5, '[]'::jsonb, NULL, NULL, NULL);
  END IF;
END $$;