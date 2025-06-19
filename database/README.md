The schema (`meals.sql`) is a PostgreSQL file with the meal items data from the `OurMeals.tsx` that contains:

1. A `meals` table with all necessary columns:
   - `id` as SERIAL PRIMARY KEY
   - `name` as VARCHAR(255)
   - `description` as TEXT
   - `image_url` as TEXT
   - `price` as DECIMAL(10,2)
   - `prep_time` as VARCHAR(50)
   - `calories` as VARCHAR(50)
   - `tags` as TEXT[] (PostgreSQL array type)
   - `categories` as TEXT[] (PostgreSQL array type)
   - `overlay_badge` as VARCHAR(50)
   - `is_new` as BOOLEAN

2. INSERT statements for all 11 meals from the original TypeScript file

3. Appropriate indexes for better query performance:
   - On the `name` field for text searches
   - GIN indexes on the array fields `categories` and `tags` for efficient array operations.