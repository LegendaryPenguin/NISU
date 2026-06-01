DO $$
DECLARE
  rid uuid;
BEGIN
  -- Idli
  IF NOT EXISTS (SELECT 1 FROM recipes WHERE is_builtin = true AND name = 'Idli') THEN
  INSERT INTO recipes (name, user_id, is_builtin, category, region, description, image_url, prep_minutes, cook_minutes, difficulty, tags, servings)
  VALUES ('Idli', NULL, true, 'breakfast', 'south', 'Soft steamed rice-lentil cakes — classic South Indian breakfast.', '/recipes/indian/breakfast.svg', 20, 12, 'medium', ARRAY['vegetarian', 'vegan', 'gluten-free']::text[], 2)
  RETURNING id INTO rid;
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 cups idli batter (store-bought or homemade, fermented)', 0);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '½ tsp eno fruit salt (if batter is not airy)', 1);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '½ tsp salt (if batter is unsalted)', 2);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tsp oil for greasing idli moulds', 3);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Water for steaming', 4);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Fresh coriander for garnish (optional)', 5);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Ghee for serving (optional)', 6);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Bring water to a boil in an idli steamer or large pot with a steamer rack.', 300, 0, '["Water for steaming"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Gently stir idli batter. If batter seems dense, fold in eno fruit salt and mix once — do not overmix.', null, 1, '["2 cups idli batter","½ tsp eno fruit salt"]'::jsonb, NULL, NULL, 'Batter should be thick but pourable; add a splash of water if too thick.');
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Lightly grease idli moulds with oil using a brush or cloth.', null, 2, '["Oil for greasing idli moulds"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Fill each mould three-quarters full with batter.', null, 3, '["2 cups idli batter"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Place moulds in steamer, cover with lid, and steam on medium-high for 10–12 minutes.', 660, 4, '["Water for steaming"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Turn off heat and rest covered for 2 minutes before opening.', 120, 5, '[]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Insert a toothpick into an idli — it should come out clean.', null, 6, '[]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Cool moulds 1 minute, then demould idlis with a wet spoon. Serve hot with sambar and coconut chutney.', null, 7, '[]'::jsonb, NULL, NULL, NULL);
  END IF;

  -- Masala Dosa
  IF NOT EXISTS (SELECT 1 FROM recipes WHERE is_builtin = true AND name = 'Masala Dosa') THEN
  INSERT INTO recipes (name, user_id, is_builtin, category, region, description, image_url, prep_minutes, cook_minutes, difficulty, tags, servings)
  VALUES ('Masala Dosa', NULL, true, 'breakfast', 'south', 'Crisp fermented crepe filled with spiced potato masala.', '/recipes/indian/breakfast.svg', 15, 20, 'medium', ARRAY['vegetarian', 'vegan']::text[], 2)
  RETURNING id INTO rid;
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1½ cups dosa batter (fermented)', 0);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 medium potatoes, boiled and mashed coarsely', 1);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 medium onion, sliced', 2);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tsp mustard seeds', 3);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '8–10 curry leaves', 4);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 green chillies, chopped', 5);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '½ tsp turmeric powder', 6);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tsp sambar powder or red chilli powder', 7);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp oil', 8);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Salt to taste', 9);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Heat 1 tbsp oil in a pan. Add mustard seeds, curry leaves, and green chillies. Let mustard splutter.', null, 0, '["1 tbsp oil","1 tsp mustard seeds","8–10 curry leaves","2 green chillies"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add sliced onion and sauté until soft and lightly golden, about 4 minutes.', 240, 1, '["1 medium onion"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add turmeric, sambar powder, and salt. Mix, then fold in mashed potato. Cook 2 minutes and set filling aside.', 120, 2, '["2 medium potatoes","½ tsp turmeric powder","1 tsp sambar powder","Salt to taste"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Heat a flat tawa or non-stick pan on medium-high until a sprinkle of water sizzles instantly.', 180, 3, '["1 tbsp oil"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Pour a ladle of batter in the center and spread quickly in outward circles to a thin round.', null, 4, '["1½ cups dosa batter"]'::jsonb, NULL, 'https://www.youtube.com/watch?v=jD6K6032SJM', 'Use the back of the ladle in concentric circles for an even thin dosa.');
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Drizzle a few drops of oil around the edges. Cook until the surface looks dry and edges lift, about 2 minutes.', 120, 5, '["1 tbsp oil"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Place a spoonful of potato masala along the center. Fold dosa in half or roll tightly.', null, 6, '["2 medium potatoes"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Repeat for remaining dosas. Serve immediately with coconut chutney and sambar.', null, 7, '[]'::jsonb, NULL, NULL, NULL);
  END IF;
END $$;