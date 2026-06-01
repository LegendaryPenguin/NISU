DO $$
DECLARE
  rid uuid;
BEGIN
  -- Shrikhand
  IF NOT EXISTS (SELECT 1 FROM recipes WHERE is_builtin = true AND name = 'Shrikhand') THEN
  INSERT INTO recipes (name, user_id, is_builtin, category, region, description, image_url, prep_minutes, cook_minutes, difficulty, tags, servings)
  VALUES ('Shrikhand', NULL, true, 'dessert', 'north', 'Chilled strained-yogurt dessert with saffron and cardamom.', '/recipes/indian/dessert.svg', 15, 0, 'easy', ARRAY['vegetarian', 'gluten-free', 'quick']::text[], 2)
  RETURNING id INTO rid;
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 cups thick yogurt (hung curd or Greek yogurt)', 0);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '3 tbsp powdered sugar', 1);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Pinch of saffron soaked in 1 tbsp warm milk', 2);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '½ tsp cardamom powder', 3);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tbsp chopped pistachios', 4);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'A few strands saffron for garnish', 5);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'If using regular yogurt, hang it in muslin cloth 2 hours until thick (skip if using Greek yogurt).', 7200, 0, '["2 cups thick yogurt"]'::jsonb, NULL, NULL, 'For a quick version, use store-bought Greek yogurt.');
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Place thick yogurt in a bowl. Add powdered sugar and whisk until smooth and creamy.', null, 1, '["2 cups thick yogurt","3 tbsp powdered sugar"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add saffron milk and cardamom powder. Fold gently.', null, 2, '["Pinch of saffron soaked in 1 tbsp warm milk","½ tsp cardamom powder"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Taste and adjust sweetness if needed.', null, 3, '["3 tbsp powdered sugar"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Refrigerate at least 1 hour until well chilled.', 3600, 4, '[]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Serve in bowls topped with pistachios and saffron strands.', null, 5, '["1 tbsp chopped pistachios","A few strands saffron for garnish"]'::jsonb, NULL, NULL, NULL);
  END IF;

  -- Masala Chai
  IF NOT EXISTS (SELECT 1 FROM recipes WHERE is_builtin = true AND name = 'Masala Chai') THEN
  INSERT INTO recipes (name, user_id, is_builtin, category, region, description, image_url, prep_minutes, cook_minutes, difficulty, tags, servings)
  VALUES ('Masala Chai', NULL, true, 'drink', 'pan-indian', 'Spiced Indian milk tea brewed with ginger and cardamom.', '/recipes/indian/drink.svg', 2, 8, 'easy', ARRAY['vegetarian', 'quick']::text[], 2)
  RETURNING id INTO rid;
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 cup water', 0);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 cup milk', 1);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tsp black tea leaves', 2);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 inch ginger, crushed', 3);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 green cardamoms, crushed', 4);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tsp sugar (or to taste)', 5);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Crush ginger and cardamom lightly with a mortar or the back of a spoon.', null, 0, '["1 inch ginger","2 green cardamoms"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Bring water to a boil in a small saucepan with ginger and cardamom.', 180, 1, '["1 cup water","1 inch ginger","2 green cardamoms"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add tea leaves and boil 1 minute until the water turns deep amber.', 60, 2, '["2 tsp black tea leaves"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Pour in milk and sugar. Return to a boil, watching closely to prevent overflow.', 120, 3, '["1 cup milk","2 tsp sugar"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Simmer on low 2 minutes until color deepens and flavors meld.', 120, 4, '[]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Strain into cups through a fine sieve. Serve hot.', null, 5, '[]'::jsonb, NULL, NULL, NULL);
  END IF;
END $$;