DO $$
DECLARE
  rid uuid;
BEGIN
  -- Lemon Rice
  IF NOT EXISTS (SELECT 1 FROM recipes WHERE is_builtin = true AND name = 'Lemon Rice') THEN
  INSERT INTO recipes (name, user_id, is_builtin, category, region, description, image_url, prep_minutes, cook_minutes, difficulty, tags, servings)
  VALUES ('Lemon Rice', NULL, true, 'rice', 'south', 'Tangy South Indian rice with peanuts, curry leaves, and fresh lemon.', '/recipes/indian/rice.svg', 10, 12, 'easy', ARRAY['vegetarian', 'vegan', 'gluten-free', 'quick']::text[], 2)
  RETURNING id INTO rid;
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 cups cooked rice (day-old works best)', 0);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp peanuts', 1);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tsp mustard seeds', 2);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tsp urad dal', 3);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '8–10 curry leaves', 4);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 dried red chillies', 5);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '½ tsp turmeric powder', 6);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp lemon juice', 7);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp oil', 8);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Salt to taste', 9);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Spread cooked rice on a plate to separate grains. Sprinkle turmeric and salt.', null, 0, '["2 cups cooked rice","½ tsp turmeric powder","Salt to taste"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Heat oil in a pan. Add mustard seeds, urad dal, and peanuts.', null, 1, '["2 tbsp oil","1 tsp mustard seeds","1 tsp urad dal","2 tbsp peanuts"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Fry until urad dal and peanuts are golden, about 2 minutes.', 120, 2, '[]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add curry leaves and dried red chillies. Sauté 30 seconds.', null, 3, '["8–10 curry leaves","2 dried red chillies"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add rice and fold gently on low heat for 2 minutes.', 120, 4, '["2 cups cooked rice"]'::jsonb, NULL, NULL, 'Use a folding motion to keep grains intact.');
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Turn off heat, add lemon juice, and mix once. Serve warm or at room temperature.', null, 5, '["2 tbsp lemon juice"]'::jsonb, NULL, NULL, NULL);
  END IF;

  -- Veg Pulao
  IF NOT EXISTS (SELECT 1 FROM recipes WHERE is_builtin = true AND name = 'Veg Pulao') THEN
  INSERT INTO recipes (name, user_id, is_builtin, category, region, description, image_url, prep_minutes, cook_minutes, difficulty, tags, servings)
  VALUES ('Veg Pulao', NULL, true, 'rice', 'pan-indian', 'One-pot spiced rice with mixed vegetables and whole spices.', '/recipes/indian/rice.svg', 15, 25, 'easy', ARRAY['vegetarian', 'vegan', 'gluten-free']::text[], 2)
  RETURNING id INTO rid;
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 cup basmati rice', 0);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '¼ cup green peas', 1);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '¼ cup carrot, diced', 2);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '¼ cup beans, chopped', 3);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 small onion, sliced', 4);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tsp ginger-garlic paste', 5);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 bay leaf', 6);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 green cardamoms', 7);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 small cinnamon stick', 8);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 cups water', 9);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp ghee or oil', 10);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Salt to taste', 11);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Rinse and soak basmati rice 15 minutes. Drain.', 900, 0, '["1 cup basmati rice"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Heat ghee in a pot. Add bay leaf, cardamom, and cinnamon.', null, 1, '["2 tbsp ghee or oil","1 bay leaf","2 green cardamoms","1 small cinnamon stick"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add onion and sauté until golden, about 4 minutes.', 240, 2, '["1 small onion"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add ginger-garlic paste and cook 1 minute.', null, 3, '["1 tsp ginger-garlic paste"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add carrot, beans, and peas. Sauté 2 minutes.', null, 4, '["¼ cup carrot","¼ cup beans","¼ cup green peas"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add drained rice, water, and salt. Bring to a boil.', null, 5, '["1 cup basmati rice","2 cups water","Salt to taste"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Cover and cook on low 12 minutes until rice is fluffy and water absorbed.', 720, 6, '[]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Rest 5 minutes, fluff with a fork, and serve with raita.', 300, 7, '[]'::jsonb, NULL, NULL, NULL);
  END IF;
END $$;