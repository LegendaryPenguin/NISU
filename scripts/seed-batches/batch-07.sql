DO $$
DECLARE
  rid uuid;
BEGIN
  -- Dal Makhani
  IF NOT EXISTS (SELECT 1 FROM recipes WHERE is_builtin = true AND name = 'Dal Makhani') THEN
  INSERT INTO recipes (name, user_id, is_builtin, category, region, description, image_url, prep_minutes, cook_minutes, difficulty, tags, servings)
  VALUES ('Dal Makhani', NULL, true, 'dal', 'north', 'Rich, slow-simmered black lentils finished with butter and cream.', '/recipes/indian/dal.svg', 10, 45, 'medium', ARRAY['vegetarian']::text[], 2)
  RETURNING id INTO rid;
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '½ cup whole urad dal (black gram)', 0);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp rajma (kidney beans), soaked', 1);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 medium onion, pureed', 2);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 medium tomatoes, pureed', 3);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tbsp ginger-garlic paste', 4);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tsp garam masala', 5);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '½ tsp red chilli powder', 6);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp butter', 7);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp cream', 8);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Salt to taste', 9);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Pressure cook urad dal and rajma with 2 cups water and salt for 6 whistles until completely soft.', 2100, 0, '["½ cup whole urad dal","2 tbsp rajma","Salt to taste"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Mash dal partially with a spoon. Set aside.', null, 1, '["½ cup whole urad dal"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Heat butter in a pan. Add onion puree and cook until golden, about 6 minutes.', 360, 2, '["2 tbsp butter","1 medium onion"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add ginger-garlic paste and cook 1 minute.', null, 3, '["1 tbsp ginger-garlic paste"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add tomato puree, red chilli powder, and garam masala. Cook until oil separates, about 5 minutes.', 300, 4, '["2 medium tomatoes","½ tsp red chilli powder","1 tsp garam masala"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add cooked dal with its liquid. Simmer on low for 20 minutes, stirring occasionally.', 1200, 5, '["½ cup whole urad dal","2 tbsp rajma"]'::jsonb, NULL, NULL, 'Low and slow simmering develops the signature creamy texture.');
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Stir in cream, adjust salt, and simmer 2 more minutes. Serve with naan or jeera rice.', 120, 6, '["2 tbsp cream","Salt to taste"]'::jsonb, NULL, NULL, NULL);
  END IF;

  -- Moong Dal
  IF NOT EXISTS (SELECT 1 FROM recipes WHERE is_builtin = true AND name = 'Moong Dal') THEN
  INSERT INTO recipes (name, user_id, is_builtin, category, region, description, image_url, prep_minutes, cook_minutes, difficulty, tags, servings)
  VALUES ('Moong Dal', NULL, true, 'dal', 'pan-indian', 'Light, digestible yellow moong lentil dal — everyday comfort food.', '/recipes/indian/dal.svg', 5, 20, 'easy', ARRAY['vegetarian', 'vegan', 'gluten-free', 'quick']::text[], 2)
  RETURNING id INTO rid;
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '½ cup moong dal (split yellow lentils)', 0);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 small tomato, chopped', 1);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '½ tsp turmeric powder', 2);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tsp cumin seeds', 3);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 dried red chillies', 4);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 green chilli, slit', 5);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp ghee or oil', 6);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Salt to taste', 7);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Fresh coriander for garnish', 8);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Rinse moong dal. Pressure cook with turmeric, tomato, and 1½ cups water for 2 whistles.', 600, 0, '["½ cup moong dal","½ tsp turmeric powder","1 small tomato"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Whisk dal to a smooth consistency. Add salt and simmer on low.', null, 1, '["Salt to taste"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Heat ghee in a tadka pan. Add cumin seeds and dried red chillies.', null, 2, '["2 tbsp ghee or oil","1 tsp cumin seeds","2 dried red chillies"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add green chilli and fry 20 seconds. Pour tadka over dal.', null, 3, '["1 green chilli"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Simmer 3 minutes until flavors meld.', 180, 4, '[]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Garnish with coriander and serve with rice or roti.', null, 5, '["Fresh coriander for garnish"]'::jsonb, NULL, NULL, NULL);
  END IF;
END $$;