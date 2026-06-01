DO $$
DECLARE
  rid uuid;
BEGIN
  -- Bhindi Masala
  IF NOT EXISTS (SELECT 1 FROM recipes WHERE is_builtin = true AND name = 'Bhindi Masala') THEN
  INSERT INTO recipes (name, user_id, is_builtin, category, region, description, image_url, prep_minutes, cook_minutes, difficulty, tags, servings)
  VALUES ('Bhindi Masala', NULL, true, 'curry', 'north', 'Okra sautéed with onion, tomato, and aromatic spices.', '/recipes/indian/curry.svg', 12, 18, 'easy', ARRAY['vegetarian', 'vegan', 'gluten-free', 'quick']::text[], 2)
  RETURNING id INTO rid;
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '250 g bhindi (okra), washed and dried', 0);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 medium onion, finely chopped', 1);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 medium tomato, chopped', 2);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tsp ginger-garlic paste', 3);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '½ tsp amchur', 4);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tsp coriander powder', 5);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '½ tsp turmeric powder', 6);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp oil', 7);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Salt to taste', 8);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Trim okra ends and slice into ½-inch rounds. Pat completely dry with a towel.', null, 0, '["250 g bhindi"]'::jsonb, NULL, NULL, 'Dry okra prevents sliminess during cooking.');
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Heat oil in a pan on medium-high. Sauté okra 6–8 minutes until edges brown and stickiness disappears.', 420, 1, '["250 g bhindi","2 tbsp oil"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Remove okra. In same pan, sauté onion until golden, about 4 minutes.', 240, 2, '["1 medium onion"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add ginger-garlic paste, turmeric, and coriander powder. Cook 1 minute.', null, 3, '["1 tsp ginger-garlic paste","½ tsp turmeric powder","1 tsp coriander powder"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add tomato and salt. Cook until soft, about 3 minutes.', 180, 4, '["1 medium tomato","Salt to taste"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Return okra to pan, add amchur, and toss gently 3 minutes.', 180, 5, '["250 g bhindi","½ tsp amchur"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Serve with dal and phulka roti.', null, 6, '[]'::jsonb, NULL, NULL, NULL);
  END IF;

  -- Malai Kofta
  IF NOT EXISTS (SELECT 1 FROM recipes WHERE is_builtin = true AND name = 'Malai Kofta') THEN
  INSERT INTO recipes (name, user_id, is_builtin, category, region, description, image_url, prep_minutes, cook_minutes, difficulty, tags, servings)
  VALUES ('Malai Kofta', NULL, true, 'curry', 'north', 'Fried paneer-potato dumplings in a rich cashew-tomato gravy.', '/recipes/indian/curry.svg', 25, 25, 'medium', ARRAY['vegetarian']::text[], 2)
  RETURNING id INTO rid;
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '100 g paneer, grated', 0);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 medium potato, boiled and mashed', 1);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp cornflour', 2);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 medium tomatoes, pureed', 3);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '10 cashews, soaked', 4);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 medium onion, pureed', 5);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tsp garam masala', 6);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp cream', 7);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Oil for shallow frying', 8);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Salt to taste', 9);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Mix grated paneer, mashed potato, 1 tbsp cornflour, and salt. Shape into 8 small balls.', null, 0, '["100 g paneer","1 medium potato","2 tbsp cornflour","Salt to taste"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Shallow fry kofta balls until golden on all sides. Drain on paper towels.', 360, 1, '["Oil for shallow frying"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Blend soaked cashews with 2 tbsp water into a smooth paste.', null, 2, '["10 cashews"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Heat 1 tbsp oil in a pan. Cook onion puree until golden, about 5 minutes.', 300, 3, '["1 medium onion"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add tomato puree and cashew paste. Cook 5 minutes until oil separates.', 300, 4, '["2 medium tomatoes","10 cashews"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add garam masala, cream, and ½ cup water. Simmer 3 minutes.', 180, 5, '["1 tsp garam masala","2 tbsp cream"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add koftas just before serving so they stay soft. Do not boil after adding.', null, 6, '["100 g paneer","1 medium potato"]'::jsonb, NULL, NULL, 'Add koftas at the last moment to prevent them from breaking.');
  END IF;
END $$;