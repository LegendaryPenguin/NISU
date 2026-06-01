DO $$
DECLARE
  rid uuid;
BEGIN
  -- Poha
  IF NOT EXISTS (SELECT 1 FROM recipes WHERE is_builtin = true AND name = 'Poha') THEN
  INSERT INTO recipes (name, user_id, is_builtin, category, region, description, image_url, prep_minutes, cook_minutes, difficulty, tags, servings)
  VALUES ('Poha', NULL, true, 'breakfast', 'pan-indian', 'Light flattened-rice breakfast tempered with mustard, curry leaves, and peanuts.', '/recipes/indian/breakfast.svg', 10, 12, 'easy', ARRAY['vegetarian', 'quick', 'vegan']::text[], 2)
  RETURNING id INTO rid;
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 cup thick poha (flattened rice)', 0);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 medium onion, finely chopped', 1);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 small potato, diced small', 2);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp peanuts', 3);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tsp mustard seeds', 4);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '8–10 curry leaves', 5);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 green chilli, slit', 6);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '½ tsp turmeric powder', 7);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tbsp lemon juice', 8);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp oil', 9);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Salt to taste', 10);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Fresh coriander for garnish', 11);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Rinse poha in a colander under running water for 30 seconds. Drain well, sprinkle with salt and turmeric, and set aside for 5 minutes.', null, 0, '["1 cup thick poha","½ tsp turmeric powder","Salt to taste"]'::jsonb, NULL, NULL, 'Thick poha holds shape better; do not soak or it turns mushy.');
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Heat oil in a kadai on medium. Add mustard seeds and let them splutter.', 60, 1, '["2 tbsp oil","1 tsp mustard seeds"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add peanuts and fry until lightly golden, about 2 minutes.', 120, 2, '["2 tbsp peanuts"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add curry leaves and green chilli. Sauté 30 seconds, then add onion and potato.', null, 3, '["8–10 curry leaves","1 green chilli","1 medium onion","1 small potato"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Cook potato and onion until potato is tender, about 6–8 minutes, stirring occasionally.', 480, 4, '["1 small potato","1 medium onion"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add softened poha and fold gently with a spatula. Cook 2 minutes on low heat.', 120, 5, '["1 cup thick poha"]'::jsonb, NULL, NULL, 'Use a folding motion so poha grains stay separate.');
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Turn off heat, squeeze lemon juice over poha, and mix once.', null, 6, '["1 tbsp lemon juice"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Garnish with fresh coriander and serve hot with sev or a wedge of lemon.', null, 7, '["Fresh coriander for garnish"]'::jsonb, NULL, NULL, NULL);
  END IF;

  -- Upma
  IF NOT EXISTS (SELECT 1 FROM recipes WHERE is_builtin = true AND name = 'Upma') THEN
  INSERT INTO recipes (name, user_id, is_builtin, category, region, description, image_url, prep_minutes, cook_minutes, difficulty, tags, servings)
  VALUES ('Upma', NULL, true, 'breakfast', 'south', 'Savory semolina porridge with mustard, urad dal, and vegetables.', '/recipes/indian/breakfast.svg', 8, 15, 'easy', ARRAY['vegetarian', 'quick', 'vegan']::text[], 2)
  RETURNING id INTO rid;
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 cup fine rava (semolina)', 0);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2½ cups water', 1);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 small onion, finely chopped', 2);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 small carrot, finely diced', 3);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp green peas (fresh or frozen)', 4);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tsp mustard seeds', 5);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tsp urad dal', 6);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tsp chana dal', 7);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '8–10 curry leaves', 8);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 green chilli, chopped', 9);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 inch ginger, grated', 10);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp ghee or oil', 11);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Salt to taste', 12);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Dry-roast rava in a pan on medium-low heat until fragrant and lightly golden, about 4 minutes. Transfer to a plate.', 240, 0, '["1 cup fine rava"]'::jsonb, NULL, NULL, 'Roasting prevents lumps and gives nutty flavor.');
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'In the same pan, heat ghee. Add mustard seeds, urad dal, and chana dal. Fry until dals turn golden.', 90, 1, '["2 tbsp ghee or oil","1 tsp mustard seeds","1 tsp urad dal","1 tsp chana dal"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add curry leaves, green chilli, and ginger. Sauté 30 seconds.', null, 2, '["8–10 curry leaves","1 green chilli","1 inch ginger"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add onion and cook until translucent, about 3 minutes.', 180, 3, '["1 small onion"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add carrot and peas. Stir for 1 minute.', null, 4, '["1 small carrot","2 tbsp green peas"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Pour in water, add salt, and bring to a rolling boil.', 180, 5, '["2½ cups water","Salt to taste"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Reduce heat to low. Slowly add roasted rava while stirring continuously to avoid lumps.', null, 6, '["1 cup fine rava"]'::jsonb, NULL, NULL, 'Pour rava in a thin stream with one hand while stirring with the other.');
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Cover and cook on low for 3 minutes until water is absorbed and upma is fluffy.', 180, 7, '["1 cup fine rava"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Fluff with a fork and serve hot with coconut chutney or pickle.', null, 8, '[]'::jsonb, NULL, NULL, NULL);
  END IF;
END $$;