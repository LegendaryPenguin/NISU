DO $$
DECLARE
  rid uuid;
BEGIN
  -- Baingan Bharta
  IF NOT EXISTS (SELECT 1 FROM recipes WHERE is_builtin = true AND name = 'Baingan Bharta') THEN
  INSERT INTO recipes (name, user_id, is_builtin, category, region, description, image_url, prep_minutes, cook_minutes, difficulty, tags, servings)
  VALUES ('Baingan Bharta', NULL, true, 'curry', 'north', 'Smoky fire-roasted eggplant mash cooked with onion and tomato.', '/recipes/indian/curry.svg', 10, 25, 'medium', ARRAY['vegetarian', 'vegan', 'gluten-free']::text[], 2)
  RETURNING id INTO rid;
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 large eggplant (baingan)', 0);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 medium onion, finely chopped', 1);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 medium tomatoes, finely chopped', 2);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tbsp ginger-garlic paste', 3);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 green chilli, chopped', 4);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '½ tsp cumin seeds', 5);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '½ tsp coriander powder', 6);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp oil', 7);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Salt to taste', 8);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Fresh coriander for garnish', 9);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Roast whole eggplant directly on a gas flame or under broiler, turning often, until skin is charred and flesh is soft, about 12 minutes.', 720, 0, '["1 large eggplant"]'::jsonb, NULL, NULL, 'Charred skin gives the signature smoky flavor.');
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Cool, peel off charred skin, and mash flesh coarsely. Set aside.', null, 1, '["1 large eggplant"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Heat oil in a pan. Add cumin seeds, then onion and green chilli. Cook until golden.', 300, 2, '["2 tbsp oil","½ tsp cumin seeds","1 medium onion","1 green chilli"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add ginger-garlic paste and cook 1 minute.', null, 3, '["1 tbsp ginger-garlic paste"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add tomatoes and coriander powder. Cook until tomatoes break down, about 5 minutes.', 300, 4, '["2 medium tomatoes","½ tsp coriander powder","Salt to taste"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add mashed eggplant and salt. Cook 5 minutes on medium, stirring well.', 300, 5, '["1 large eggplant"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Garnish with coriander and serve with tandoori roti.', null, 6, '["Fresh coriander for garnish"]'::jsonb, NULL, NULL, NULL);
  END IF;

  -- Aloo Gobi
  IF NOT EXISTS (SELECT 1 FROM recipes WHERE is_builtin = true AND name = 'Aloo Gobi') THEN
  INSERT INTO recipes (name, user_id, is_builtin, category, region, description, image_url, prep_minutes, cook_minutes, difficulty, tags, servings)
  VALUES ('Aloo Gobi', NULL, true, 'curry', 'north', 'Dry-style potato and cauliflower stir-fry with cumin and turmeric.', '/recipes/indian/curry.svg', 10, 20, 'easy', ARRAY['vegetarian', 'vegan', 'gluten-free', 'quick']::text[], 2)
  RETURNING id INTO rid;
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 medium potatoes, cubed', 0);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 cups cauliflower florets', 1);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 medium onion, sliced', 2);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tsp ginger-garlic paste', 3);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '½ tsp turmeric powder', 4);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tsp coriander powder', 5);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tsp cumin seeds', 6);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp oil', 7);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Salt to taste', 8);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Fresh coriander for garnish', 9);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Heat oil in a kadai. Add cumin seeds and let them crackle.', null, 0, '["2 tbsp oil","1 tsp cumin seeds"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add onion and sauté until soft, about 3 minutes.', 180, 1, '["1 medium onion"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add ginger-garlic paste, turmeric, and coriander powder. Cook 1 minute.', null, 2, '["1 tsp ginger-garlic paste","½ tsp turmeric powder","1 tsp coriander powder"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add potato cubes and salt. Cover and cook on low 8 minutes.', 480, 3, '["2 medium potatoes","Salt to taste"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add cauliflower florets and 2 tbsp water. Cover and cook 8 minutes until tender.', 480, 4, '["2 cups cauliflower florets"]'::jsonb, NULL, NULL, 'Do not overcook cauliflower — it should hold shape.');
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Uncover and cook 2 minutes on high to evaporate moisture.', 120, 5, '[]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Garnish with coriander and serve with dal and roti.', null, 6, '["Fresh coriander for garnish"]'::jsonb, NULL, NULL, NULL);
  END IF;
END $$;