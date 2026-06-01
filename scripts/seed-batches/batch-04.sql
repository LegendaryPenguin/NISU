DO $$
DECLARE
  rid uuid;
BEGIN
  -- Besan Chilla
  IF NOT EXISTS (SELECT 1 FROM recipes WHERE is_builtin = true AND name = 'Besan Chilla') THEN
  INSERT INTO recipes (name, user_id, is_builtin, category, region, description, image_url, prep_minutes, cook_minutes, difficulty, tags, servings)
  VALUES ('Besan Chilla', NULL, true, 'breakfast', 'north', 'Savory gram-flour pancakes with onion, tomato, and spices.', '/recipes/indian/breakfast.svg', 10, 12, 'easy', ARRAY['vegetarian', 'quick', 'gluten-free']::text[], 2)
  RETURNING id INTO rid;
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 cup besan (gram flour)', 0);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 small onion, finely chopped', 1);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 small tomato, finely chopped', 2);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 green chilli, minced', 3);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '½ tsp ajwain (carom seeds)', 4);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '½ tsp turmeric powder', 5);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '½ tsp red chilli powder', 6);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp fresh coriander, chopped', 7);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '¾ cup water', 8);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp oil', 9);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Salt to taste', 10);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Whisk besan with water into a smooth, pourable batter with no lumps.', null, 0, '["1 cup besan","¾ cup water"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add onion, tomato, green chilli, ajwain, turmeric, red chilli powder, coriander, and salt. Mix well.', null, 1, '["1 small onion","1 small tomato","1 green chilli","½ tsp ajwain","½ tsp turmeric powder","½ tsp red chilli powder","2 tbsp fresh coriander","Salt to taste"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Rest batter 5 minutes while you heat a non-stick tawa on medium.', 300, 2, '[]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Grease tawa lightly with oil. Pour one ladle of batter and spread gently to a 6-inch circle.', null, 3, '["2 tbsp oil","1 cup besan"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Drizzle a few drops of oil around edges. Cook until bottom is golden, about 2–3 minutes.', 150, 4, '["2 tbsp oil"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Flip carefully and cook the second side until golden spots appear, about 2 minutes.', 120, 5, '[]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Repeat for remaining batter. Serve hot with green chutney or ketchup.', null, 6, '[]'::jsonb, NULL, NULL, NULL);
  END IF;

  -- Vegetable Uttapam
  IF NOT EXISTS (SELECT 1 FROM recipes WHERE is_builtin = true AND name = 'Vegetable Uttapam') THEN
  INSERT INTO recipes (name, user_id, is_builtin, category, region, description, image_url, prep_minutes, cook_minutes, difficulty, tags, servings)
  VALUES ('Vegetable Uttapam', NULL, true, 'breakfast', 'south', 'Thick rice-lentil pancake topped with mixed vegetables.', '/recipes/indian/breakfast.svg', 10, 15, 'easy', ARRAY['vegetarian', 'vegan']::text[], 2)
  RETURNING id INTO rid;
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1½ cups dosa batter (slightly thick)', 0);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '¼ cup onion, finely chopped', 1);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '¼ cup tomato, finely chopped', 2);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '¼ cup capsicum, finely chopped', 3);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp carrot, grated', 4);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 green chilli, minced', 5);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '8–10 curry leaves, torn', 6);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp coriander, chopped', 7);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp oil', 8);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Salt to taste', 9);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Mix chopped onion, tomato, capsicum, carrot, green chilli, curry leaves, coriander, and a pinch of salt in a bowl.', null, 0, '["¼ cup onion","¼ cup tomato","¼ cup capsicum","2 tbsp carrot","1 green chilli","8–10 curry leaves","2 tbsp coriander","Salt to taste"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Heat a tawa on medium. Grease lightly with oil.', null, 1, '["2 tbsp oil"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Pour a ladle of batter and spread to a thick 6-inch round — do not spread too thin.', null, 2, '["1½ cups dosa batter"]'::jsonb, NULL, NULL, 'Uttapam should be thicker than dosa, about ¼ inch.');
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Sprinkle vegetable mixture evenly over the wet batter surface. Press gently with the back of a spoon.', null, 3, '["¼ cup onion","¼ cup tomato","¼ cup capsicum"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Drizzle oil around edges and on top. Cover and cook on medium-low for 3–4 minutes.', 240, 4, '["2 tbsp oil"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Flip uttapam carefully and cook uncovered 2–3 minutes until vegetables are slightly charred.', 150, 5, '[]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Repeat for second uttapam. Serve hot with coconut chutney and sambar.', null, 6, '[]'::jsonb, NULL, NULL, NULL);
  END IF;
END $$;