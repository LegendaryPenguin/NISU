DO $$
DECLARE
  rid uuid;
BEGIN
  -- Paneer Butter Masala
  IF NOT EXISTS (SELECT 1 FROM recipes WHERE is_builtin = true AND name = 'Paneer Butter Masala') THEN
  INSERT INTO recipes (name, user_id, is_builtin, category, region, description, image_url, prep_minutes, cook_minutes, difficulty, tags, servings)
  VALUES ('Paneer Butter Masala', NULL, true, 'curry', 'north', 'Creamy tomato gravy with soft paneer cubes — restaurant-style at home.', '/recipes/indian/curry.svg', 15, 25, 'medium', ARRAY['vegetarian']::text[], 2)
  RETURNING id INTO rid;
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '200 g paneer, cubed', 0);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 medium tomatoes, pureed', 1);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 medium onion, pureed', 2);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tbsp ginger-garlic paste', 3);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tsp kasuri methi', 4);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tsp garam masala', 5);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp butter', 6);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp cream', 7);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tsp sugar', 8);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Salt to taste', 9);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Heat 1 tbsp butter in a pan. Lightly fry paneer cubes until golden. Set aside.', 180, 0, '["200 g paneer","2 tbsp butter"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'In the same pan, add remaining butter and onion puree. Cook until golden, about 6 minutes.', 360, 1, '["1 medium onion","2 tbsp butter"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add ginger-garlic paste and cook 1 minute.', null, 2, '["1 tbsp ginger-garlic paste"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add tomato puree, sugar, and salt. Cook until oil separates, about 7 minutes.', 420, 3, '["2 medium tomatoes","1 tsp sugar","Salt to taste"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add garam masala and kasuri methi crushed between palms. Stir 1 minute.', null, 4, '["1 tsp garam masala","1 tsp kasuri methi"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add ½ cup water, simmer 3 minutes, then add paneer cubes.', 180, 5, '["200 g paneer"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Stir in cream and simmer 2 minutes on low. Serve with naan or jeera rice.', 120, 6, '["2 tbsp cream"]'::jsonb, NULL, NULL, NULL);
  END IF;

  -- Palak Paneer
  IF NOT EXISTS (SELECT 1 FROM recipes WHERE is_builtin = true AND name = 'Palak Paneer') THEN
  INSERT INTO recipes (name, user_id, is_builtin, category, region, description, image_url, prep_minutes, cook_minutes, difficulty, tags, servings)
  VALUES ('Palak Paneer', NULL, true, 'curry', 'north', 'Paneer cubes in a vibrant spinach gravy with mild spices.', '/recipes/indian/curry.svg', 15, 20, 'medium', ARRAY['vegetarian']::text[], 2)
  RETURNING id INTO rid;
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '200 g paneer, cubed', 0);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '300 g spinach (palak), washed', 1);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 medium onion, chopped', 2);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 cloves garlic', 3);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 inch ginger', 4);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 green chilli', 5);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '½ tsp cumin seeds', 6);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '½ tsp garam masala', 7);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp cream', 8);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp oil', 9);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Salt to taste', 10);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Blanch spinach in boiling water 2 minutes. Transfer to ice water, then blend with green chilli, ginger, and garlic to a smooth purée.', 120, 0, '["300 g spinach","1 green chilli","1 inch ginger","2 cloves garlic"]'::jsonb, NULL, NULL, 'Ice bath locks in the bright green color.');
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Heat oil in a pan. Add cumin seeds and chopped onion. Sauté until golden, about 5 minutes.', 300, 1, '["2 tbsp oil","½ tsp cumin seeds","1 medium onion"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add spinach purée and cook 4 minutes on medium heat.', 240, 2, '["300 g spinach"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add garam masala and salt. Mix well.', null, 3, '["½ tsp garam masala","Salt to taste"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add paneer cubes and ¼ cup water. Simmer gently 5 minutes.', 300, 4, '["200 g paneer"]'::jsonb, NULL, NULL, 'Simmer gently so paneer stays soft.');
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Stir in cream and cook 1 minute. Serve hot with roti or rice.', null, 5, '["2 tbsp cream"]'::jsonb, NULL, NULL, NULL);
  END IF;
END $$;