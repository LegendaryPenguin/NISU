DO $$
DECLARE
  rid uuid;
BEGIN
  -- Medu Vada
  IF NOT EXISTS (SELECT 1 FROM recipes WHERE is_builtin = true AND name = 'Medu Vada') THEN
  INSERT INTO recipes (name, user_id, is_builtin, category, region, description, image_url, prep_minutes, cook_minutes, difficulty, tags, servings)
  VALUES ('Medu Vada', NULL, true, 'snack', 'south', 'Crisp, fluffy South Indian urad dal fritters with a soft center.', '/recipes/indian/snack.svg', 20, 15, 'medium', ARRAY['vegetarian', 'vegan', 'gluten-free']::text[], 2)
  RETURNING id INTO rid;
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 cup urad dal, soaked 4 hours', 0);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 small onion, finely chopped', 1);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 green chillies, minced', 2);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '8–10 curry leaves, chopped', 3);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 inch ginger, grated', 4);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tsp black pepper, crushed', 5);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Oil for deep frying', 6);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Salt to taste', 7);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Drain soaked urad dal completely. Grind with minimal water to a thick, fluffy paste.', null, 0, '["1 cup urad dal"]'::jsonb, NULL, NULL, 'Batter should be thick enough to hold shape — add water one tablespoon at a time.');
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Transfer batter to a bowl. Beat vigorously with your hand or a whisk for 2 minutes to incorporate air.', 120, 1, '["1 cup urad dal"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Fold in onion, green chillies, curry leaves, ginger, pepper, and salt.', null, 2, '["1 small onion","2 green chillies","8–10 curry leaves","1 inch ginger","1 tsp black pepper","Salt to taste"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Heat oil in a kadai on medium. Wet hands, shape batter into a donut with a hole in the center.', null, 3, '["Oil for deep frying"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Slide vadas gently into hot oil. Fry without crowding the pan.', null, 4, '["Oil for deep frying"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Fry on medium heat until golden and crisp outside, about 4–5 minutes, flipping once.', 270, 5, '[]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Drain on paper towels. Serve hot with coconut chutney and sambar.', null, 6, '[]'::jsonb, NULL, NULL, NULL);
  END IF;

  -- Kheer
  IF NOT EXISTS (SELECT 1 FROM recipes WHERE is_builtin = true AND name = 'Kheer') THEN
  INSERT INTO recipes (name, user_id, is_builtin, category, region, description, image_url, prep_minutes, cook_minutes, difficulty, tags, servings)
  VALUES ('Kheer', NULL, true, 'dessert', 'pan-indian', 'Creamy rice pudding slow-cooked with milk, cardamom, and nuts.', '/recipes/indian/dessert.svg', 5, 35, 'easy', ARRAY['vegetarian', 'gluten-free']::text[], 2)
  RETURNING id INTO rid;
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '3 cups full-fat milk', 0);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '¼ cup basmati rice, washed', 1);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '3 tbsp sugar', 2);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 green cardamoms, crushed', 3);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tbsp chopped almonds and pistachios', 4);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tbsp raisins', 5);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tsp ghee', 6);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Heat ghee in a heavy pan. Add washed rice and sauté 1 minute until fragrant.', 60, 0, '["1 tsp ghee","¼ cup basmati rice"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Pour in milk and crushed cardamom. Bring to a gentle boil.', 300, 1, '["3 cups full-fat milk","2 green cardamoms"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Reduce heat to low and simmer, stirring every few minutes, for 25 minutes until rice is soft and milk thickens.', 1500, 2, '["¼ cup basmati rice","3 cups full-fat milk"]'::jsonb, NULL, NULL, 'Use a heavy-bottomed pan to prevent scorching.');
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add sugar and stir until dissolved. Cook 3 more minutes.', 180, 3, '["3 tbsp sugar"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add raisins and half the nuts. Mix well.', null, 4, '["1 tbsp raisins","1 tbsp chopped almonds and pistachios"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Serve warm or chilled, garnished with remaining nuts.', null, 5, '["1 tbsp chopped almonds and pistachios"]'::jsonb, NULL, NULL, NULL);
  END IF;
END $$;