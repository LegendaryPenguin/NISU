DO $$
DECLARE
  rid uuid;
BEGIN
  -- Khichdi
  IF NOT EXISTS (SELECT 1 FROM recipes WHERE is_builtin = true AND name = 'Khichdi') THEN
  INSERT INTO recipes (name, user_id, is_builtin, category, region, description, image_url, prep_minutes, cook_minutes, difficulty, tags, servings)
  VALUES ('Khichdi', NULL, true, 'rice', 'pan-indian', 'Comforting one-pot rice and moong dal porridge with ghee.', '/recipes/indian/rice.svg', 5, 25, 'easy', ARRAY['vegetarian', 'gluten-free', 'quick']::text[], 2)
  RETURNING id INTO rid;
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '½ cup basmati or sona masoori rice', 0);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '½ cup moong dal', 1);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 small tomato, chopped', 2);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '½ tsp turmeric powder', 3);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tsp cumin seeds', 4);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 inch ginger, grated', 5);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp ghee', 6);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '3 cups water', 7);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Salt to taste', 8);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Rinse rice and moong dal together until water runs clear.', null, 0, '["½ cup basmati or sona masoori rice","½ cup moong dal"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Heat ghee in a pressure cooker. Add cumin seeds and ginger.', null, 1, '["2 tbsp ghee","1 tsp cumin seeds","1 inch ginger"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add tomato and turmeric. Cook 2 minutes.', null, 2, '["1 small tomato","½ tsp turmeric powder"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add rice, dal, water, and salt. Stir once.', null, 3, '["½ cup basmati or sona masoori rice","½ cup moong dal","3 cups water","Salt to taste"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Pressure cook on medium for 3 whistles.', 900, 4, '[]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Let pressure release naturally. Open, stir gently, and adjust consistency with hot water if needed.', null, 5, '[]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Serve hot with a dollop of ghee, pickle, and papad.', null, 6, '["2 tbsp ghee"]'::jsonb, NULL, NULL, NULL);
  END IF;

  -- Simple Veg Biryani
  IF NOT EXISTS (SELECT 1 FROM recipes WHERE is_builtin = true AND name = 'Simple Veg Biryani') THEN
  INSERT INTO recipes (name, user_id, is_builtin, category, region, description, image_url, prep_minutes, cook_minutes, difficulty, tags, servings)
  VALUES ('Simple Veg Biryani', NULL, true, 'rice', 'pan-indian', 'Layered aromatic rice with spiced vegetables — a weeknight biryani.', '/recipes/indian/rice.svg', 20, 35, 'medium', ARRAY['vegetarian']::text[], 2)
  RETURNING id INTO rid;
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 cup basmati rice', 0);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 cup mixed vegetables (carrot, beans, potato, peas)', 1);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 medium onion, thinly sliced', 2);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '½ cup yogurt', 3);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tbsp biryani masala', 4);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tsp ginger-garlic paste', 5);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp ghee', 6);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '½ tsp saffron soaked in 2 tbsp warm milk', 7);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp fried onions (birista)', 8);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Salt to taste', 9);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Parboil basmati rice in salted water until 70% cooked, about 5 minutes. Drain.', 300, 0, '["1 cup basmati rice","Salt to taste"]'::jsonb, NULL, NULL, 'Rice should still have a bite — it finishes cooking during dum.');
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Heat ghee in a pot. Fry sliced onion until deep golden. Set half aside.', 480, 1, '["2 tbsp ghee","1 medium onion"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'In the same pot, add ginger-garlic paste and mixed vegetables. Sauté 4 minutes.', 240, 2, '["1 tsp ginger-garlic paste","1 cup mixed vegetables"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add yogurt, biryani masala, and salt. Cook 3 minutes until masala coats vegetables.', 180, 3, '["½ cup yogurt","1 tbsp biryani masala","Salt to taste"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Spread vegetable masala evenly. Layer parboiled rice on top.', null, 4, '["1 cup basmati rice","1 cup mixed vegetables"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Drizzle saffron milk and fried onions over rice. Cover tightly with foil and lid.', null, 5, '["½ tsp saffron soaked in 2 tbsp warm milk","2 tbsp fried onions"]'::jsonb, NULL, 'https://www.youtube.com/watch?v=3Sy3u5xTdH8', 'Seal the pot well so steam cannot escape during dum cooking.');
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Cook on low heat (dum) for 15 minutes. Rest 5 minutes off heat.', 900, 6, '[]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Gently mix layers from the bottom. Serve with raita.', null, 7, '[]'::jsonb, NULL, NULL, NULL);
  END IF;
END $$;