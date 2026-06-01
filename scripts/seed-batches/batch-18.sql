DO $$
DECLARE
  rid uuid;
BEGIN
  -- Paratha
  IF NOT EXISTS (SELECT 1 FROM recipes WHERE is_builtin = true AND name = 'Paratha') THEN
  INSERT INTO recipes (name, user_id, is_builtin, category, region, description, image_url, prep_minutes, cook_minutes, difficulty, tags, servings)
  VALUES ('Paratha', NULL, true, 'bread', 'north', 'Flaky layered whole-wheat flatbread pan-fried with ghee.', '/recipes/indian/bread.svg', 15, 15, 'medium', ARRAY['vegetarian']::text[], 2)
  RETURNING id INTO rid;
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 cup whole wheat flour', 0);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp ghee for layering', 1);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp ghee for cooking', 2);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Salt to taste', 3);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Water for dough', 4);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Dry flour for rolling', 5);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Knead atta with salt and water into a soft dough. Rest 15 minutes.', 900, 0, '["1 cup whole wheat flour","Salt to taste","Water for dough"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Roll one dough ball into a 5-inch disc. Spread ghee, fold into a square or triangle, and roll again to 6 inches.', null, 1, '["2 tbsp ghee for layering","Dry flour for rolling"]'::jsonb, NULL, NULL, 'Folding creates flaky layers.');
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Heat tawa on medium. Place paratha and cook 1 minute.', 60, 2, '[]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Flip, spread ghee on top, and cook 1 minute. Flip again and ghee the second side.', null, 3, '["2 tbsp ghee for cooking"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Press gently with a spatula until golden brown spots appear on both sides.', 120, 4, '[]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Repeat for remaining dough. Serve hot with yogurt and pickle.', null, 5, '[]'::jsonb, NULL, NULL, NULL);
  END IF;

  -- Puri
  IF NOT EXISTS (SELECT 1 FROM recipes WHERE is_builtin = true AND name = 'Puri') THEN
  INSERT INTO recipes (name, user_id, is_builtin, category, region, description, image_url, prep_minutes, cook_minutes, difficulty, tags, servings)
  VALUES ('Puri', NULL, true, 'bread', 'north', 'Small deep-fried puffed whole-wheat breads.', '/recipes/indian/bread.svg', 10, 12, 'easy', ARRAY['vegetarian', 'vegan', 'quick']::text[], 2)
  RETURNING id INTO rid;
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 cup whole wheat flour', 0);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tbsp semolina (optional, for crispness)', 1);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tsp oil', 2);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Oil for deep frying', 3);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Salt to taste', 4);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Water for dough', 5);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Mix atta, semolina, salt, and oil. Knead into a firm, tight dough with water.', null, 0, '["1 cup whole wheat flour","1 tbsp semolina","1 tsp oil","Salt to taste","Water for dough"]'::jsonb, NULL, NULL, 'Firm dough prevents puri from absorbing excess oil.');
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Rest dough 10 minutes covered.', 600, 1, '[]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Divide into 8 small balls. Roll each into a 3-inch disc — roll evenly, not too thin.', null, 2, '["1 cup whole wheat flour"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Heat oil in a kadai on medium-high. Test with a tiny dough piece — it should rise immediately.', null, 3, '["Oil for deep frying"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Slide puri into hot oil. Press gently with a slotted spoon until it puffs.', 45, 4, '["Oil for deep frying"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Flip and fry until golden, about 30 seconds. Drain on paper towels.', 30, 5, '[]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Serve immediately with aloo sabzi or chole.', null, 6, '[]'::jsonb, NULL, NULL, NULL);
  END IF;
END $$;