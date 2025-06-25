-- Bumba Fresh Database Schema
-- Updated to support email-based authentication

-- Drop existing tables if they exist
DROP TABLE IF EXISTS favorite CASCADE;
DROP TABLE IF EXISTS delivery CASCADE;
DROP TABLE IF EXISTS order_meal CASCADE;
DROP TABLE IF EXISTS "order" CASCADE;
DROP TABLE IF EXISTS plan CASCADE;
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS account CASCADE;

-- Create account table with email-based authentication
CREATE TABLE account (
    user_id SERIAL PRIMARY KEY,
    password TEXT NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'dietitian')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Create inventory table for meals
CREATE TABLE inventory (
    meal_id SERIAL PRIMARY KEY,
    meal VARCHAR(255) NOT NULL,
    description TEXT,
    quantity INTEGER DEFAULT 0,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100),
    dietary_options VARCHAR(255),
    image_url VARCHAR(500)
);

-- Create orders table
CREATE TABLE "order" (
    order_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES account(user_id),
    total_price DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create meal_orders table (junction table)
CREATE TABLE order_meal (
    order_meal_id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES "order"(order_id) ON DELETE CASCADE,
    meal_id INTEGER NOT NULL REFERENCES inventory(meal_id),
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL
);

-- Create plan table for subscriptions
CREATE TABLE plan (
    plan_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES account(user_id),
    subscription_plan VARCHAR(100) NOT NULL,
    time_expired DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create delivery table for order deliveries
CREATE TABLE delivery (
    delivery_id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES "order"(order_id) ON DELETE CASCADE,
    delivery_status VARCHAR(50) DEFAULT 'pending',
    estimated_time TIMESTAMP,
    delivery_address TEXT NOT NULL,
    s_firstname VARCHAR(100) NOT NULL,
    s_lastname VARCHAR(100) NOT NULL,
    s_phone VARCHAR(20) NOT NULL,
    city VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create favorite table for meal favorites functionality
CREATE TABLE favorite (
    favorite_id SERIAL PRIMARY KEY,
    meal_id INTEGER NOT NULL REFERENCES inventory(meal_id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES account(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(meal_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX idx_account_email ON account(email);
CREATE INDEX idx_account_role ON account(role);
CREATE INDEX idx_order_user_id ON "order"(user_id);
CREATE INDEX idx_order_meal_order_id ON order_meal(order_id);
CREATE INDEX idx_order_meal_meal_id ON order_meal(meal_id);
CREATE INDEX idx_plan_user_id ON plan(user_id);
CREATE INDEX idx_favorite_user_id ON favorite(user_id);
CREATE INDEX idx_favorite_meal_id ON favorite(meal_id);
CREATE INDEX idx_favorite_user_meal ON favorite(user_id, meal_id);
CREATE INDEX idx_favorite_created_at ON favorite(created_at DESC);

-- Create triggers for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON "order" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions (adjust as needed)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;

-- Insert test accounts with bcrypt hashed passwords (12 salt rounds)
INSERT INTO account (email, password, first_name, last_name, role) VALUES
--password: admin123
('admin@bumba.com', '$2a$12$PPxUm6G6T5GKlDUQe.4vl.8yguwURlmoMaH1eou9KvGfd0zNwKPH2', 'Admin', 'User', 'admin'),
--password: dietitian123
('dietitian@bumba.com', '$2a$12$9KO5rqtCDFP/7tfY8IP2QOLDPH.KQgTohcJLvShJPN1mJP60.1TN.', 'Dietitian', 'Professional', 'dietitian');

-- Insert meals data
INSERT INTO inventory (meal, description, quantity, price, category, dietary_options, image_url) VALUES
('Herb-Roasted Chicken', 'Tender chicken roasted with fresh herbs and seasonal vegetables', 10, 12.99, 'Main Course', 'High Protein, Gluten Free', 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6'),
('Mediterranean Bowl', 'Quinoa base with roasted vegetables, feta, and tahini dressing', 15, 10.99, 'Bowl', 'Vegetarian, Mediterranean', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd'),
('Teriyaki Salmon', 'Wild-caught salmon with teriyaki glaze and stir-fried vegetables', 8, 14.99, 'Main Course', 'Omega-3, High Protein', 'https://images.unsplash.com/photo-1467003909585-2f8a72700288'),
('Spicy Tofu Stir-fry', 'Crispy tofu cubes with fresh vegetables in a spicy ginger-garlic sauce', 12, 11.99, 'Main Course', 'Vegan, Spicy, High Protein', 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26'),
('Quinoa Power Bowl', 'Fresh quinoa bowl with roasted chickpeas and avocado', 20, 11.99, 'Bowl', 'Vegetarian, High Protein', 'https://images.unsplash.com/photo-1490645935967-10de6ba17061'),
('Grilled Steak Bowl', 'Premium grilled steak with roasted vegetables', 6, 16.99, 'Bowl', 'High Protein', 'https://images.unsplash.com/photo-1544025162-d76694265947'),
('Buddha Bowl', 'Nutritious mix of grains, vegetables, and tahini dressing', 18, 12.99, 'Bowl', 'Vegetarian, Vegan', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'),
('Pesto Pasta', 'Fresh basil pesto with whole grain pasta and cherry tomatoes', 14, 13.99, 'Pasta', 'Vegetarian', 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601'),
('Spicy Sriracha Salmon', 'Wild-caught salmon with a spicy sriracha glaze and Asian slaw', 7, 16.99, 'Main Course', 'High Protein, Spicy', 'https://images.unsplash.com/photo-1467003909585-2f8a72700288'),
('Truffle Mushroom Risotto', 'Creamy Arborio rice with wild mushrooms and truffle oil', 9, 14.99, 'Main Course', 'Vegetarian, Gluten Free', 'https://images.unsplash.com/photo-1476124369491-e7addf5db371'),
('Summer Berry Salad', 'Mixed greens with seasonal berries and honey-lime dressing', 25, 11.99, 'Salad', 'Vegetarian, Low Calorie', 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af');
