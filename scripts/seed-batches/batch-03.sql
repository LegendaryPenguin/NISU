DO $$
DECLARE
  rid uuid;
BEGIN
  -- Aloo Paratha
  IF NOT EXISTS (SELECT 1 FROM recipes WHERE is_builtin = true AND name = 'Aloo Paratha') THEN
  INSERT INTO recipes (name, user_id, is_builtin, category, region, description, image_url, prep_minutes, cook_minutes, difficulty, tags, servings)
  VALUES ('Aloo Paratha', NULL, true, 'breakfast', 'north', 'Whole-wheat flatbread stuffed with spiced mashed potato.', '/recipes/indian/breakfast.svg', 20, 15, 'medium', ARRAY['vegetarian']::text[], 2)
  RETURNING id INTO rid;
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 cup whole wheat flour (atta)', 0);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 medium potatoes, boiled and mashed', 1);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 small onion, finely chopped (optional)', 2);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 green chilli, minced', 3);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '½ tsp cumin powder', 4);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '½ tsp amchur (dry mango powder)', 5);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '½ tsp garam masala', 6);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp ghee or oil for cooking', 7);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Salt to taste', 8);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Water for dough', 9);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Knead atta with salt and enough water into a soft, pliable dough. Rest covered for 15 minutes.', 900, 0, '["1 cup whole wheat flour","Salt to taste","Water for dough"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Mix mashed potato with onion, green chilli, cumin, amchur, garam masala, and salt for the filling.', null, 1, '["2 medium potatoes","1 green chilli","½ tsp cumin powder","½ tsp amchur","½ tsp garam masala","Salt to taste"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Divide dough and filling into 4 equal portions each.', null, 2, '["1 cup whole wheat flour","2 medium potatoes"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Roll one dough ball into a small disc. Place filling in center, gather edges, seal, and flatten gently.', null, 3, '["1 cup whole wheat flour","2 medium potatoes"]'::jsonb, NULL, NULL, 'Keep edges thin when sealing to prevent thick spots.');
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Dust with flour and roll into a 7-inch paratha, applying even pressure.', null, 4, '["1 cup whole wheat flour"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Heat a tawa on medium. Cook paratha 1 minute, flip, apply ghee, cook 1 minute, flip again and ghee the second side.', 120, 5, '["2 tbsp ghee or oil"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Press gently with a spatula until golden brown spots appear on both sides.', 90, 6, '[]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Repeat for remaining parathas. Serve hot with yogurt, pickle, or butter.', null, 7, '["2 tbsp ghee or oil"]'::jsonb, NULL, NULL, NULL);
  END IF;

  -- Chole Bhature
  IF NOT EXISTS (SELECT 1 FROM recipes WHERE is_builtin = true AND name = 'Chole Bhature') THEN
  INSERT INTO recipes (name, user_id, is_builtin, category, region, description, image_url, prep_minutes, cook_minutes, difficulty, tags, servings)
  VALUES ('Chole Bhature', NULL, true, 'breakfast', 'north', 'Punjabi spiced chickpea curry served with puffed fried bread.', '/recipes/indian/breakfast.svg', 15, 35, 'medium', ARRAY['vegetarian']::text[], 2)
  RETURNING id INTO rid;
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 cup canned or cooked chickpeas (chole)', 0);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 medium onion, finely chopped', 1);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 medium tomatoes, pureed', 2);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tbsp ginger-garlic paste', 3);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tsp chole masala powder', 4);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '½ tsp cumin seeds', 5);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 bay leaf', 6);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 cup maida (all-purpose flour)', 7);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp yogurt', 8);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '½ tsp baking soda', 9);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Oil for deep frying', 10);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Salt to taste', 11);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Mix maida, yogurt, baking soda, a pinch of salt, and water into a soft dough. Rest covered 30 minutes (or use store-bought bhatura dough).', 1800, 0, '["1 cup maida","2 tbsp yogurt","½ tsp baking soda","Salt to taste"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Heat 2 tbsp oil in a pressure cooker or pot. Add cumin seeds and bay leaf.', null, 1, '["½ tsp cumin seeds","1 bay leaf"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add onion and cook until golden, about 5 minutes.', 300, 2, '["1 medium onion"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add ginger-garlic paste and cook 1 minute until raw smell disappears.', null, 3, '["1 tbsp ginger-garlic paste"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add tomato puree and chole masala. Cook until oil separates, about 6 minutes.', 360, 4, '["2 medium tomatoes","1 tsp chole masala powder"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add chickpeas with ½ cup water and salt. Simmer 15 minutes, mashing a few chickpeas for thickness.', 900, 5, '["1 cup canned or cooked chickpeas","Salt to taste"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Divide dough into 4 balls. Roll each into a 5-inch disc.', null, 6, '["1 cup maida"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Deep fry bhature in hot oil on medium-high until puffed and golden on both sides, about 1 minute per side.', 120, 7, '["Oil for deep frying"]'::jsonb, NULL, NULL, 'Oil should be hot enough that dough puffs immediately on contact.');
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Serve hot chole with bhature, onion rings, and a wedge of lemon.', null, 8, '["1 cup canned or cooked chickpeas"]'::jsonb, NULL, NULL, NULL);
  END IF;
END $$;