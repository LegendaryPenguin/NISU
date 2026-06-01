DO $$
DECLARE
  rid uuid;
BEGIN
  -- Gulab Jamun Shortcut
  IF NOT EXISTS (SELECT 1 FROM recipes WHERE is_builtin = true AND name = 'Gulab Jamun Shortcut') THEN
  INSERT INTO recipes (name, user_id, is_builtin, category, region, description, image_url, prep_minutes, cook_minutes, difficulty, tags, servings)
  VALUES ('Gulab Jamun Shortcut', NULL, true, 'dessert', 'north', 'Quick milk-powder gulab jamun soaked in rose-cardamom syrup.', '/recipes/indian/dessert.svg', 15, 20, 'easy', ARRAY['vegetarian']::text[], 2)
  RETURNING id INTO rid;
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 cup milk powder', 0);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '3 tbsp maida', 1);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '½ tsp baking soda', 2);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp ghee', 3);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp yogurt', 4);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 cup sugar', 5);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 cup water', 6);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '4 green cardamoms', 7);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tsp rose water', 8);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Oil for deep frying', 9);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Make sugar syrup: boil sugar and water with cardamom 5 minutes until slightly sticky. Add rose water. Keep warm.', 300, 0, '["1 cup sugar","1 cup water","4 green cardamoms","1 tsp rose water"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Mix milk powder, maida, and baking soda. Add ghee and yogurt. Knead into a soft, smooth dough.', null, 1, '["1 cup milk powder","3 tbsp maida","½ tsp baking soda","2 tbsp ghee","2 tbsp yogurt"]'::jsonb, NULL, NULL, 'Do not over-knead or jamuns become hard.');
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Rest dough 5 minutes. Roll into 10 smooth, crack-free balls.', 300, 2, '[]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Heat oil on low-medium — oil should not be smoking hot.', null, 3, '["Oil for deep frying"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Fry jamuns slowly, rolling constantly, until evenly deep brown, about 6–8 minutes.', 420, 4, '["Oil for deep frying"]'::jsonb, NULL, NULL, 'Low heat ensures jamuns cook through without burning outside.');
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Drain and drop hot jamuns directly into warm syrup. Soak at least 30 minutes.', 1800, 5, '["1 cup sugar","1 cup water"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Serve warm or at room temperature with a spoon of syrup.', null, 6, '[]'::jsonb, NULL, NULL, NULL);
  END IF;

  -- Rava Kesari
  IF NOT EXISTS (SELECT 1 FROM recipes WHERE is_builtin = true AND name = 'Rava Kesari') THEN
  INSERT INTO recipes (name, user_id, is_builtin, category, region, description, image_url, prep_minutes, cook_minutes, difficulty, tags, servings)
  VALUES ('Rava Kesari', NULL, true, 'dessert', 'south', 'Golden semolina halwa with ghee, saffron, and cashews.', '/recipes/indian/dessert.svg', 5, 15, 'easy', ARRAY['vegetarian', 'gluten-free', 'quick']::text[], 2)
  RETURNING id INTO rid;
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '½ cup fine rava (semolina)', 0);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '½ cup sugar', 1);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1½ cups water', 2);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '3 tbsp ghee', 3);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '10 cashews, broken', 4);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tbsp raisins', 5);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Pinch of saffron', 6);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 green cardamoms, crushed', 7);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Heat 2 tbsp ghee in a pan. Fry cashews and raisins until golden. Set aside.', 120, 0, '["3 tbsp ghee","10 cashews","1 tbsp raisins"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'In the same pan, roast rava on low-medium heat until fragrant and lightly golden, about 4 minutes.', 240, 1, '["½ cup fine rava"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Meanwhile, boil water with sugar, saffron, and cardamom until sugar dissolves.', 180, 2, '["1½ cups water","½ cup sugar","Pinch of saffron","2 green cardamoms"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Carefully pour hot sugar water into roasted rava while stirring continuously to prevent lumps.', null, 3, '["½ cup fine rava","1½ cups water"]'::jsonb, NULL, NULL, 'Keep flame on low when combining to avoid splattering.');
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Cook on low, stirring, until rava absorbs liquid and kesari leaves the pan, about 3 minutes.', 180, 4, '[]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add remaining ghee and fried nuts. Mix and serve warm.', null, 5, '["3 tbsp ghee","10 cashews","1 tbsp raisins"]'::jsonb, NULL, NULL, NULL);
  END IF;
END $$;