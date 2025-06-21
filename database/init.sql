-- Bumba Fresh Database Schema
-- Updated to support email-based authentication

-- Drop existing tables if they exist
DROP TABLE IF EXISTS meal_orders CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
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
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES account(user_id),
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create meal_orders table (junction table)
CREATE TABLE meal_orders (
    meal_order_id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    meal_id INTEGER NOT NULL REFERENCES inventory(meal_id),
    quantity INTEGER NOT NULL DEFAULT 1,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create plan table for subscriptions
CREATE TABLE plan (
    plan_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES account(user_id),
    subscription_plan VARCHAR(100) NOT NULL,
    time_expired DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some sample data

-- Sample admin account (password: 'password123')
INSERT INTO account (email, password, first_name, last_name, role) VALUES 
('admin@gmail.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeeSLyEQZFjbBCHs2', 'Admin', 'User', 'admin');

-- Sample meals
INSERT INTO inventory (meal, description, quantity, price, category, dietary_options) VALUES 
('Grilled Chicken Salad', 'Fresh grilled chicken with mixed greens and vinaigrette', 50, 12.99, 'Salads', 'Gluten-Free,High-Protein'),
('Vegetarian Pasta', 'Creamy pasta with seasonal vegetables', 30, 10.99, 'Pasta', 'Vegetarian'),
('Salmon Teriyaki', 'Grilled salmon with teriyaki glaze and steamed vegetables', 25, 15.99, 'Seafood', 'Gluten-Free,High-Protein'),
('Quinoa Buddha Bowl', 'Nutritious quinoa bowl with roasted vegetables', 40, 11.99, 'Bowls', 'Vegan,Gluten-Free');

-- Create indexes for better performance
CREATE INDEX idx_account_email ON account(email);
CREATE INDEX idx_account_role ON account(role);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_meal_orders_order_id ON meal_orders(order_id);
CREATE INDEX idx_meal_orders_meal_id ON meal_orders(meal_id);
CREATE INDEX idx_plan_user_id ON plan(user_id);

-- Create triggers for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions (adjust as needed)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
