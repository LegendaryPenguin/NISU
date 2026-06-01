DO $$
DECLARE
  rid uuid;
BEGIN
  -- Chicken Curry
  IF NOT EXISTS (SELECT 1 FROM recipes WHERE is_builtin = true AND name = 'Chicken Curry') THEN
  INSERT INTO recipes (name, user_id, is_builtin, category, region, description, image_url, prep_minutes, cook_minutes, difficulty, tags, servings)
  VALUES ('Chicken Curry', NULL, true, 'curry', 'pan-indian', 'Homestyle onion-tomato chicken curry with warm spices.', '/recipes/indian/curry.svg', 15, 30, 'medium', ARRAY[]::text[], 2)
  RETURNING id INTO rid;
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '300 g chicken, bone-in pieces', 0);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 medium onions, finely chopped', 1);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 medium tomatoes, pureed', 2);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tbsp ginger-garlic paste', 3);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tsp coriander powder', 4);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '½ tsp turmeric powder', 5);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tsp garam masala', 6);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp oil', 7);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Salt to taste', 8);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Fresh coriander for garnish', 9);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Heat oil in a pot. Add onions and cook until deep golden, about 8 minutes.', 480, 0, '["2 tbsp oil","2 medium onions"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add ginger-garlic paste and cook 1 minute.', null, 1, '["1 tbsp ginger-garlic paste"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add tomato puree, turmeric, and coriander powder. Cook until oil separates, about 6 minutes.', 360, 2, '["2 medium tomatoes","½ tsp turmeric powder","1 tsp coriander powder"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add chicken pieces and salt. Sear on high heat 3 minutes, stirring.', 180, 3, '["300 g chicken","Salt to taste"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add 1 cup hot water. Cover and simmer 15 minutes until chicken is cooked through.', 900, 4, '["300 g chicken"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add garam masala and simmer uncovered 3 minutes to thicken gravy.', 180, 5, '["1 tsp garam masala"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Garnish with coriander and serve with rice or roti.', null, 6, '["Fresh coriander for garnish"]'::jsonb, NULL, NULL, NULL);
  END IF;

  -- Egg Curry
  IF NOT EXISTS (SELECT 1 FROM recipes WHERE is_builtin = true AND name = 'Egg Curry') THEN
  INSERT INTO recipes (name, user_id, is_builtin, category, region, description, image_url, prep_minutes, cook_minutes, difficulty, tags, servings)
  VALUES ('Egg Curry', NULL, true, 'curry', 'pan-indian', 'Boiled eggs in a spiced onion-tomato gravy.', '/recipes/indian/curry.svg', 10, 20, 'easy', ARRAY[]::text[], 2)
  RETURNING id INTO rid;
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '4 eggs, hard-boiled and peeled', 0);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 medium onions, finely chopped', 1);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 medium tomatoes, pureed', 2);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tbsp ginger-garlic paste', 3);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tsp coriander powder', 4);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '½ tsp red chilli powder', 5);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '½ tsp garam masala', 6);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp oil', 7);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Salt to taste', 8);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Score boiled eggs lightly with a knife and pan-fry in 1 tbsp oil until lightly golden. Set aside.', 120, 0, '["4 eggs","2 tbsp oil"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'In the same pan, sauté onions until golden, about 5 minutes.', 300, 1, '["2 medium onions"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add ginger-garlic paste and cook 1 minute.', null, 2, '["1 tbsp ginger-garlic paste"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add tomato puree, coriander powder, red chilli powder, and salt. Cook 5 minutes.', 300, 3, '["2 medium tomatoes","1 tsp coriander powder","½ tsp red chilli powder","Salt to taste"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add 1 cup water and simmer 3 minutes.', 180, 4, '[]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add eggs and garam masala. Simmer 5 minutes so eggs absorb flavor.', 300, 5, '["4 eggs","½ tsp garam masala"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Serve with steamed rice or chapati.', null, 6, '[]'::jsonb, NULL, NULL, NULL);
  END IF;
END $$;