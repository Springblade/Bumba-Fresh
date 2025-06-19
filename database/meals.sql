-- Create meals table
CREATE TABLE meals (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    prep_time VARCHAR(50) NOT NULL,
    calories VARCHAR(50) NOT NULL,
    tags TEXT[] NOT NULL,
    categories TEXT[] NOT NULL,
    overlay_badge VARCHAR(50),
    is_new BOOLEAN DEFAULT FALSE
);

-- Insert meal data
INSERT INTO meals (id, name, description, image_url, price, prep_time, calories, tags, categories, overlay_badge, is_new) VALUES
(1, 'Herb-Roasted Chicken', 'Tender chicken roasted with fresh herbs and seasonal vegetables', 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6', 12.99, '25 min', '480 cal', ARRAY['High Protein', 'Gluten Free'], ARRAY['popular', 'high-protein'], 'Popular', FALSE),
(2, 'Mediterranean Bowl', 'Quinoa base with roasted vegetables, feta, and tahini dressing', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd', 10.99, '15 min', '380 cal', ARRAY['Vegetarian', 'Mediterranean'], ARRAY['vegetarian'], 'New', TRUE),
(3, 'Teriyaki Salmon', 'Wild-caught salmon with teriyaki glaze and stir-fried vegetables', 'https://images.unsplash.com/photo-1467003909585-2f8a72700288', 14.99, '20 min', '450 cal', ARRAY['Omega-3', 'High Protein'], ARRAY['popular', 'high-protein'], 'Bestseller', FALSE),
(4, 'Spicy Tofu Stir-fry', 'Crispy tofu cubes with fresh vegetables in a spicy ginger-garlic sauce', 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26', 11.99, '20 min', '320 cal', ARRAY['Vegan', 'Spicy', 'High Protein'], ARRAY['vegetarian', 'high-protein'], NULL, FALSE),
(5, 'Quinoa Power Bowl', 'Fresh quinoa bowl with roasted chickpeas and avocado', 'https://images.unsplash.com/photo-1490645935967-10de6ba17061', 11.99, '15 min', '420 cal', ARRAY['Vegetarian', 'High Protein'], ARRAY['vegetarian', 'new'], 'New', TRUE),
(6, 'Grilled Steak Bowl', 'Premium grilled steak with roasted vegetables', 'https://images.unsplash.com/photo-1544025162-d76694265947', 16.99, '25 min', '520 cal', ARRAY['High Protein'], ARRAY['bestseller'], 'Bestseller', FALSE),
(7, 'Buddha Bowl', 'Nutritious mix of grains, vegetables, and tahini dressing', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c', 12.99, '20 min', '380 cal', ARRAY['Vegetarian', 'Vegan'], ARRAY['vegetarian', 'new'], 'New', TRUE),
(8, 'Pesto Pasta', 'Fresh basil pesto with whole grain pasta and cherry tomatoes', 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601', 13.99, '20 min', '450 cal', ARRAY['Vegetarian'], ARRAY['popular'], 'Popular', FALSE),
(9, 'Spicy Sriracha Salmon', 'Wild-caught salmon with a spicy sriracha glaze and Asian slaw', 'https://images.unsplash.com/photo-1467003909585-2f8a72700288', 16.99, '20 min', '450 cal', ARRAY['High Protein', 'Spicy'], ARRAY['new'], 'New', TRUE),
(10, 'Truffle Mushroom Risotto', 'Creamy Arborio rice with wild mushrooms and truffle oil', 'https://images.unsplash.com/photo-1476124369491-e7addf5db371', 14.99, '30 min', '520 cal', ARRAY['Vegetarian', 'Gluten Free'], ARRAY['bestseller'], 'Bestseller', FALSE),
(11, 'Summer Berry Salad', 'Mixed greens with seasonal berries and honey-lime dressing', 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af', 11.99, '10 min', '280 cal', ARRAY['Vegetarian', 'Low Calorie'], ARRAY['new'], NULL, TRUE);

-- Create index on commonly searched fields
CREATE INDEX idx_meals_name ON meals(name);
CREATE INDEX idx_meals_categories ON meals USING GIN(categories);
CREATE INDEX idx_meals_tags ON meals USING GIN(tags);
