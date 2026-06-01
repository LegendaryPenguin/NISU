DO $$
DECLARE
  rid uuid;
BEGIN
  -- Mango Lassi
  IF NOT EXISTS (SELECT 1 FROM recipes WHERE is_builtin = true AND name = 'Mango Lassi') THEN
  INSERT INTO recipes (name, user_id, is_builtin, category, region, description, image_url, prep_minutes, cook_minutes, difficulty, tags, servings)
  VALUES ('Mango Lassi', NULL, true, 'drink', 'north', 'Thick, creamy yogurt drink blended with ripe mango.', '/recipes/indian/drink.svg', 5, 0, 'easy', ARRAY['vegetarian', 'gluten-free', 'quick']::text[], 2)
  RETURNING id INTO rid;
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 cup ripe mango pulp (fresh or canned)', 0);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 cup chilled yogurt', 1);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp sugar or honey', 2);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '½ cup cold milk or water', 3);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Pinch of cardamom powder', 4);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Ice cubes (optional)', 5);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Peel and chop ripe mango if using fresh fruit. Measure one cup of pulp.', null, 0, '["1 cup ripe mango pulp"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add mango pulp, yogurt, sugar, and cardamom to a blender.', null, 1, '["1 cup ripe mango pulp","1 cup chilled yogurt","2 tbsp sugar or honey","Pinch of cardamom powder"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Blend on high until completely smooth, about 30 seconds.', 30, 2, '[]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add cold milk or water to reach desired thickness. Blend briefly again.', null, 3, '["½ cup cold milk or water"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Taste and adjust sweetness or cardamom if needed.', null, 4, '["2 tbsp sugar or honey","Pinch of cardamom powder"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Pour into glasses over ice if desired. Serve immediately.', null, 5, '["Ice cubes (optional)"]'::jsonb, NULL, NULL, NULL);
  END IF;

  -- Nimbu Pani
  IF NOT EXISTS (SELECT 1 FROM recipes WHERE is_builtin = true AND name = 'Nimbu Pani') THEN
  INSERT INTO recipes (name, user_id, is_builtin, category, region, description, image_url, prep_minutes, cook_minutes, difficulty, tags, servings)
  VALUES ('Nimbu Pani', NULL, true, 'drink', 'pan-indian', 'Refreshing Indian lemonade with cumin, salt, and mint.', '/recipes/indian/drink.svg', 5, 0, 'easy', ARRAY['vegetarian', 'vegan', 'gluten-free', 'quick']::text[], 2)
  RETURNING id INTO rid;
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp fresh lemon juice', 0);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 cups cold water', 1);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tsp sugar or honey', 2);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '¼ tsp roasted cumin powder', 3);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Pinch of black salt (kala namak)', 4);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '4–5 mint leaves', 5);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Ice cubes', 6);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Roll lemons on the counter and squeeze fresh juice into a pitcher, removing seeds.', null, 0, '["2 tbsp fresh lemon juice"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add cold water, sugar, cumin powder, and black salt to the pitcher.', null, 1, '["2 cups cold water","2 tsp sugar or honey","¼ tsp roasted cumin powder","Pinch of black salt"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Stir vigorously until sugar dissolves completely.', null, 2, '["2 tsp sugar or honey"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Lightly muddle mint leaves between your palms to release aroma and add to the pitcher.', null, 3, '["4–5 mint leaves"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Taste and adjust salt, sugar, or lemon to balance sweet and tangy.', null, 4, '["2 tbsp fresh lemon juice","Pinch of black salt"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add ice cubes and stir. Serve immediately.', null, 5, '["Ice cubes"]'::jsonb, NULL, NULL, NULL);
  END IF;
END $$;