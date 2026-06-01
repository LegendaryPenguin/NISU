DO $$
DECLARE
  rid uuid;
BEGIN
  -- Fish Curry
  IF NOT EXISTS (SELECT 1 FROM recipes WHERE is_builtin = true AND name = 'Fish Curry') THEN
  INSERT INTO recipes (name, user_id, is_builtin, category, region, description, image_url, prep_minutes, cook_minutes, difficulty, tags, servings)
  VALUES ('Fish Curry', NULL, true, 'curry', 'south', 'Coastal-style fish in a tangy tamarind-coconut gravy.', '/recipes/indian/curry.svg', 15, 20, 'medium', ARRAY['gluten-free']::text[], 2)
  RETURNING id INTO rid;
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '300 g firm fish fillets (kingfish or pomfret), cubed', 0);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 medium onion, sliced', 1);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 medium tomatoes, chopped', 2);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp tamarind paste', 3);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '½ cup coconut milk', 4);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tsp sambar powder or fish curry masala', 5);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '8–10 curry leaves', 6);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp coconut oil', 7);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Salt to taste', 8);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Marinate fish with ½ tsp turmeric and salt for 10 minutes.', 600, 0, '["300 g firm fish fillets","Salt to taste"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Heat coconut oil in a clay pot or pan. Add curry leaves and onion. Sauté until soft.', 240, 1, '["2 tbsp coconut oil","8–10 curry leaves","1 medium onion"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add tomatoes and sambar powder. Cook until tomatoes break down, about 4 minutes.', 240, 2, '["2 medium tomatoes","1 tsp sambar powder or fish curry masala"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add tamarind paste and 1 cup water. Bring to a boil.', 180, 3, '["2 tbsp tamarind paste"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Gently add fish pieces. Simmer covered on low 8 minutes without stirring.', 480, 4, '["300 g firm fish fillets"]'::jsonb, NULL, NULL, 'Swirl the pot instead of stirring to keep fish intact.');
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add coconut milk and simmer 2 minutes. Adjust salt.', 120, 5, '["½ cup coconut milk"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Serve hot with steamed rice.', null, 6, '[]'::jsonb, NULL, NULL, NULL);
  END IF;

  -- Kadhi Pakora
  IF NOT EXISTS (SELECT 1 FROM recipes WHERE is_builtin = true AND name = 'Kadhi Pakora') THEN
  INSERT INTO recipes (name, user_id, is_builtin, category, region, description, image_url, prep_minutes, cook_minutes, difficulty, tags, servings)
  VALUES ('Kadhi Pakora', NULL, true, 'curry', 'north', 'Tangy yogurt gram-flour curry with fried onion fritters.', '/recipes/indian/curry.svg', 15, 30, 'medium', ARRAY['vegetarian']::text[], 2)
  RETURNING id INTO rid;
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 cup yogurt', 0);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '3 tbsp besan (gram flour)', 1);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 small onion, sliced', 2);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '½ tsp turmeric powder', 3);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tsp red chilli powder', 4);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tsp cumin seeds', 5);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 dried red chillies', 6);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp oil', 7);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Oil for deep frying pakoras', 8);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Salt to taste', 9);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Mix 2 tbsp besan with sliced onion, salt, and a pinch of chilli powder. Add water to make a thick batter.', null, 0, '["1 small onion","3 tbsp besan","Salt to taste"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Deep fry spoonfuls of batter until golden pakoras form. Drain and set aside.', 360, 1, '["Oil for deep frying pakoras"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Whisk yogurt, remaining besan, turmeric, and 2 cups water until smooth.', null, 2, '["1 cup yogurt","3 tbsp besan","½ tsp turmeric powder"]'::jsonb, NULL, NULL, 'Whisk thoroughly to prevent lumps in the kadhi.');
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Cook kadhi mixture on medium, stirring constantly, until it boils and thickens, about 8 minutes.', 480, 3, '["1 cup yogurt"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Reduce heat and simmer 10 minutes, stirring occasionally.', 600, 4, '[]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Heat oil in a tadka pan. Add cumin seeds and dried red chillies. Pour over kadhi.', null, 5, '["2 tbsp oil","1 tsp cumin seeds","2 dried red chillies"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add pakoras to kadhi 5 minutes before serving so they soften slightly.', 300, 6, '["1 small onion"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Serve hot with steamed rice.', null, 7, '[]'::jsonb, NULL, NULL, NULL);
  END IF;
END $$;