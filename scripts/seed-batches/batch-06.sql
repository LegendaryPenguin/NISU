DO $$
DECLARE
  rid uuid;
BEGIN
  -- Chana Masala
  IF NOT EXISTS (SELECT 1 FROM recipes WHERE is_builtin = true AND name = 'Chana Masala') THEN
  INSERT INTO recipes (name, user_id, is_builtin, category, region, description, image_url, prep_minutes, cook_minutes, difficulty, tags, servings)
  VALUES ('Chana Masala', NULL, true, 'dal', 'north', 'Punjabi-style chickpea curry in a tomato-onion masala.', '/recipes/indian/dal.svg', 10, 25, 'easy', ARRAY['vegetarian', 'vegan', 'gluten-free']::text[], 2)
  RETURNING id INTO rid;
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 cup canned or cooked chickpeas', 0);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 medium onion, finely chopped', 1);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 medium tomatoes, pureed', 2);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tbsp ginger-garlic paste', 3);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tsp chana masala powder', 4);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '½ tsp cumin seeds', 5);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '½ tsp coriander powder', 6);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp oil', 7);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Salt to taste', 8);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Fresh coriander for garnish', 9);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Heat oil in a pan. Add cumin seeds and let them sizzle.', null, 0, '["2 tbsp oil","½ tsp cumin seeds"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add onion and cook until deep golden, about 6 minutes.', 360, 1, '["1 medium onion"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add ginger-garlic paste and cook 1 minute.', null, 2, '["1 tbsp ginger-garlic paste"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add tomato puree, coriander powder, and chana masala. Cook until oil separates, about 5 minutes.', 300, 3, '["2 medium tomatoes","½ tsp coriander powder","1 tsp chana masala powder"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add chickpeas with ½ cup water and salt. Simmer 10 minutes.', 600, 4, '["1 cup canned or cooked chickpeas","Salt to taste"]'::jsonb, NULL, NULL, 'Mash a few chickpeas against the pan for a thicker gravy.');
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Garnish with coriander and serve with rice, roti, or bhature.', null, 5, '["Fresh coriander for garnish"]'::jsonb, NULL, NULL, NULL);
  END IF;

  -- Rajma
  IF NOT EXISTS (SELECT 1 FROM recipes WHERE is_builtin = true AND name = 'Rajma') THEN
  INSERT INTO recipes (name, user_id, is_builtin, category, region, description, image_url, prep_minutes, cook_minutes, difficulty, tags, servings)
  VALUES ('Rajma', NULL, true, 'dal', 'north', 'Creamy Kashmiri red kidney bean curry — a North Indian staple.', '/recipes/indian/dal.svg', 10, 35, 'medium', ARRAY['vegetarian', 'vegan', 'gluten-free']::text[], 2)
  RETURNING id INTO rid;
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 cup rajma (kidney beans), soaked overnight or canned', 0);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 medium onion, finely chopped', 1);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 medium tomatoes, pureed', 2);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tbsp ginger-garlic paste', 3);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tsp rajma masala or garam masala', 4);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '½ tsp cumin seeds', 5);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 bay leaf', 6);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp oil', 7);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Salt to taste', 8);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Fresh coriander for garnish', 9);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'If using dried rajma, pressure cook soaked beans with salt for 5–6 whistles until very soft. Skip if using canned.', 1800, 0, '["1 cup rajma","Salt to taste"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Heat oil in a pot. Add cumin seeds and bay leaf.', null, 1, '["2 tbsp oil","½ tsp cumin seeds","1 bay leaf"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add onion and cook until golden brown, about 7 minutes.', 420, 2, '["1 medium onion"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add ginger-garlic paste and cook 1 minute.', null, 3, '["1 tbsp ginger-garlic paste"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add tomato puree and rajma masala. Cook until oil separates, about 6 minutes.', 360, 4, '["2 medium tomatoes","1 tsp rajma masala or garam masala"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add cooked rajma with 1 cup cooking liquid or water. Simmer 15 minutes until gravy thickens.', 900, 5, '["1 cup rajma","Salt to taste"]'::jsonb, NULL, NULL, 'Mash a few beans for a naturally creamy texture.');
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Garnish with coriander and serve with steamed basmati rice.', null, 6, '["Fresh coriander for garnish"]'::jsonb, NULL, NULL, NULL);
  END IF;
END $$;