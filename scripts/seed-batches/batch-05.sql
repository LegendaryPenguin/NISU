DO $$
DECLARE
  rid uuid;
BEGIN
  -- Dal Tadka
  IF NOT EXISTS (SELECT 1 FROM recipes WHERE is_builtin = true AND name = 'Dal Tadka') THEN
  INSERT INTO recipes (name, user_id, is_builtin, category, region, description, image_url, prep_minutes, cook_minutes, difficulty, tags, servings)
  VALUES ('Dal Tadka', NULL, true, 'dal', 'north', 'Yellow lentils finished with a sizzling garlic-cumin tempering.', '/recipes/indian/dal.svg', 5, 25, 'easy', ARRAY['vegetarian', 'vegan', 'gluten-free']::text[], 2)
  RETURNING id INTO rid;
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '½ cup toor dal (split pigeon peas)', 0);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 small tomato, chopped', 1);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '½ tsp turmeric powder', 2);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tsp ginger-garlic paste', 3);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp ghee or oil', 4);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tsp cumin seeds', 5);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '4 cloves garlic, sliced', 6);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 dried red chillies', 7);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '½ tsp red chilli powder', 8);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Salt to taste', 9);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Fresh coriander for garnish', 10);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Pressure cook toor dal with turmeric, tomato, and 1½ cups water for 3 whistles until soft.', 900, 0, '["½ cup toor dal","½ tsp turmeric powder","1 small tomato","Salt to taste"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Mash dal lightly with a whisk. Add salt and simmer on low.', null, 1, '["Salt to taste"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Heat ghee in a small tadka pan on medium-high.', null, 2, '["2 tbsp ghee or oil"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add cumin seeds and let them crackle, about 30 seconds.', 30, 3, '["1 tsp cumin seeds"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add garlic slices and dried red chillies. Fry until garlic is golden.', 60, 4, '["4 cloves garlic","2 dried red chillies"]'::jsonb, NULL, NULL, 'Golden garlic adds sweetness; do not burn.');
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add red chilli powder, swirl once, and immediately pour tadka over simmering dal.', null, 5, '["½ tsp red chilli powder"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Stir gently, garnish with coriander, and serve with rice or roti.', null, 6, '["Fresh coriander for garnish"]'::jsonb, NULL, NULL, NULL);
  END IF;

  -- Sambar
  IF NOT EXISTS (SELECT 1 FROM recipes WHERE is_builtin = true AND name = 'Sambar') THEN
  INSERT INTO recipes (name, user_id, is_builtin, category, region, description, image_url, prep_minutes, cook_minutes, difficulty, tags, servings)
  VALUES ('Sambar', NULL, true, 'dal', 'south', 'Tangy South Indian lentil stew with tamarind and mixed vegetables.', '/recipes/indian/dal.svg', 15, 30, 'medium', ARRAY['vegetarian', 'vegan', 'gluten-free']::text[], 2)
  RETURNING id INTO rid;
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '½ cup toor dal', 0);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 small drumstick, cut into 2-inch pieces', 1);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '¼ cup pumpkin or bottle gourd, cubed', 2);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 small onion, quartered', 3);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 small tomato, chopped', 4);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tbsp tamarind paste', 5);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tsp sambar powder', 6);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '½ tsp turmeric powder', 7);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tsp mustard seeds', 8);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '8–10 curry leaves', 9);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp oil', 10);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Salt to taste', 11);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Pressure cook toor dal with turmeric and 1½ cups water for 3 whistles until mushy.', 900, 0, '["½ cup toor dal","½ tsp turmeric powder"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'In a pot, combine drumstick, pumpkin, onion, tomato, and 2 cups water. Boil until vegetables are tender, about 12 minutes.', 720, 1, '["1 small drumstick","¼ cup pumpkin or bottle gourd","1 small onion","1 small tomato"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add cooked dal, tamarind paste, sambar powder, and salt. Simmer 8 minutes.', 480, 2, '["½ cup toor dal","1 tbsp tamarind paste","2 tsp sambar powder","Salt to taste"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Heat oil in a tadka pan. Add mustard seeds and let them pop.', null, 3, '["2 tbsp oil","1 tsp mustard seeds"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add curry leaves and fry 15 seconds. Pour tempering into sambar.', null, 4, '["8–10 curry leaves"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Simmer 2 more minutes until sambar is well combined and fragrant.', 120, 5, '[]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Serve hot with idli, dosa, or steamed rice.', null, 6, '[]'::jsonb, NULL, NULL, NULL);
  END IF;
END $$;