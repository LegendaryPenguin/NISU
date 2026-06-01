DO $$
DECLARE
  rid uuid;
BEGIN
  -- Dhokla
  IF NOT EXISTS (SELECT 1 FROM recipes WHERE is_builtin = true AND name = 'Dhokla') THEN
  INSERT INTO recipes (name, user_id, is_builtin, category, region, description, image_url, prep_minutes, cook_minutes, difficulty, tags, servings)
  VALUES ('Dhokla', NULL, true, 'snack', 'north', 'Steamed savory gram-flour cake — light, spongy Gujarati snack.', '/recipes/indian/snack.svg', 10, 20, 'medium', ARRAY['vegetarian', 'vegan', 'gluten-free']::text[], 2)
  RETURNING id INTO rid;
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 cup besan (gram flour)', 0);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp semolina', 1);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tbsp sugar', 2);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tbsp lemon juice', 3);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tsp eno fruit salt', 4);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tsp mustard seeds', 5);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '8–10 curry leaves', 6);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 green chillies, slit', 7);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp oil', 8);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Salt to taste', 9);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Fresh coriander for garnish', 10);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Whisk besan, semolina, sugar, salt, and ¾ cup water into a smooth batter. Rest 10 minutes.', 600, 0, '["1 cup besan","2 tbsp semolina","1 tbsp sugar","Salt to taste"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add lemon juice and eno. Mix gently — batter will become frothy.', null, 1, '["1 tbsp lemon juice","1 tsp eno fruit salt"]'::jsonb, NULL, NULL, 'Mix eno in one direction just until combined.');
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Pour into a greased steaming tray. Steam on high 15–18 minutes until a toothpick comes out clean.', 1020, 2, '[]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Cool 5 minutes, then cut into squares.', 300, 3, '[]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Heat oil for tempering. Add mustard seeds, curry leaves, and green chillies. Pour over dhokla.', null, 4, '["2 tbsp oil","1 tsp mustard seeds","8–10 curry leaves","2 green chillies"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Garnish with coriander and serve with green chutney.', null, 5, '["Fresh coriander for garnish"]'::jsonb, NULL, NULL, NULL);
  END IF;

  -- Bhel Puri
  IF NOT EXISTS (SELECT 1 FROM recipes WHERE is_builtin = true AND name = 'Bhel Puri') THEN
  INSERT INTO recipes (name, user_id, is_builtin, category, region, description, image_url, prep_minutes, cook_minutes, difficulty, tags, servings)
  VALUES ('Bhel Puri', NULL, true, 'snack', 'north', 'Mumbai street-style puffed-rice chaat with chutneys and crunch.', '/recipes/indian/snack.svg', 15, 0, 'easy', ARRAY['vegetarian', 'vegan', 'quick']::text[], 2)
  RETURNING id INTO rid;
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 cups puffed rice (murmura)', 0);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '¼ cup sev (thin chickpea noodles)', 1);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 small potato, boiled and diced', 2);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 small onion, finely chopped', 3);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 small tomato, finely chopped', 4);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp roasted peanuts', 5);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp green chutney', 6);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '2 tbsp tamarind chutney', 7);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, '1 tsp chaat masala', 8);
  INSERT INTO recipe_ingredients (recipe_id, text, order_index) VALUES (rid, 'Fresh coriander for garnish', 9);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Boil potato until tender, peel, and dice into small cubes. Set aside to cool.', 900, 0, '["1 small potato"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Finely chop onion and tomato. Roughly crush roasted peanuts if using whole nuts.', null, 1, '["1 small onion","1 small tomato","2 tbsp roasted peanuts"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Combine puffed rice, sev, diced potato, onion, tomato, and peanuts in a large bowl.', null, 2, '["2 cups puffed rice","¼ cup sev","1 small potato","1 small onion","1 small tomato","2 tbsp roasted peanuts"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Add green chutney and tamarind chutney. Toss quickly with your hands or two spoons.', null, 3, '["2 tbsp green chutney","2 tbsp tamarind chutney"]'::jsonb, NULL, NULL, 'Add chutneys just before serving to keep bhel crisp.');
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Sprinkle chaat masala over the mixture and toss once more.', null, 4, '["1 tsp chaat masala"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Taste and adjust chutney or chaat masala to balance sweet, tangy, and spicy notes.', null, 5, '["2 tbsp green chutney","2 tbsp tamarind chutney","1 tsp chaat masala"]'::jsonb, NULL, NULL, NULL);
  INSERT INTO recipe_steps (recipe_id, instruction, timer_seconds, order_index, step_ingredients, image_url, youtube_url, tip) VALUES (rid, 'Garnish with extra sev and fresh coriander. Serve immediately in paper cones or bowls.', null, 6, '["Fresh coriander for garnish","¼ cup sev"]'::jsonb, NULL, NULL, NULL);
  END IF;
END $$;