DO $$
DECLARE
  rid uuid;
BEGIN
  -- Toor Dal
  IF NOT EXISTS (SELECT 1 FROM recipes WHERE is_builtin = true AND name = 'Toor Dal') THEN
  INSERT INTO recipes (name, user_id, is_builtin, category, region, description, image_url, prep_minutes, cook_minutes, difficulty, tags, servings)
  VALUES ('Toor Dal', NULL, true, 'dal', 'south', 'Simple South Indian pigeon-pea dal with a mustard-curry-leaf tempering.', '/recipes/indian/dal.svg', 5, 22, 'easy', ARRAY['vegetarian', 'vegan', 'gluten-free']::text[], 2)
  RETURNING id INTO rid;
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '½ cup toor dal', 0);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '½ tsp turmeric powder', 1);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 small tomato, chopped', 2);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tsp mustard seeds', 3);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tsp urad dal', 4);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '8–10 curry leaves', 5);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 dried red chillies', 6);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp oil', 7);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Salt to taste', 8);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Pressure cook toor dal with turmeric, tomato, and 1½ cups water for 3 whistles.', 900, 0, '["½ cup toor dal","½ tsp turmeric powder","1 small tomato"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Mash dal lightly, add salt, and keep simmering on low.', null, 1, '["Salt to taste"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Heat oil in a tadka pan. Add mustard seeds and urad dal.', null, 2, '["2 tbsp oil","1 tsp mustard seeds","1 tsp urad dal"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'When urad dal turns golden, add curry leaves and dried red chillies.', 60, 3, '["8–10 curry leaves","2 dried red chillies"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Pour tempering over dal and stir gently.', null, 4, '[]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Simmer 2 minutes and serve with rice and a vegetable side.', 120, 5, '[]'::jsonb, NULL, NULL, NULL);
  END IF;

  -- Jeera Rice
  IF NOT EXISTS (SELECT 1 FROM recipes WHERE is_builtin = true AND name = 'Jeera Rice') THEN
  INSERT INTO recipes (name, user_id, is_builtin, category, region, description, image_url, prep_minutes, cook_minutes, difficulty, tags, servings)
  VALUES ('Jeera Rice', NULL, true, 'rice', 'north', 'Fragrant basmati rice tempered with cumin seeds.', '/recipes/indian/rice.svg', 5, 20, 'easy', ARRAY['vegetarian', 'vegan', 'gluten-free', 'quick']::text[], 2)
  RETURNING id INTO rid;
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 cup basmati rice', 0);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1½ tsp cumin seeds', 1);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp ghee or oil', 2);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 bay leaf', 3);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 green cardamoms', 4);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 small cinnamon stick', 5);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 cups water', 6);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Salt to taste', 7);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Rinse basmati rice until water runs clear. Soak 15 minutes and drain.', 900, 0, '["1 cup basmati rice"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Heat ghee in a pot on medium. Add cumin seeds, bay leaf, cardamom, and cinnamon.', null, 1, '["2 tbsp ghee or oil","1½ tsp cumin seeds","1 bay leaf","2 green cardamoms","1 small cinnamon stick"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'When cumin crackles, add drained rice and sauté 1 minute until grains are coated.', 60, 2, '["1 cup basmati rice"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add water and salt. Bring to a boil.', 180, 3, '["2 cups water","Salt to taste"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Reduce heat to low, cover, and cook 12 minutes until water is absorbed.', 720, 4, '[]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Rest covered 5 minutes off heat. Fluff with a fork and serve.', 300, 5, '[]'::jsonb, NULL, NULL, NULL);
  END IF;
END $$;