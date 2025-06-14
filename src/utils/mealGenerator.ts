type Meal = {
  id: number;
  name: string;
  description: string;
  image: string;
  price: string;
  prepTime: string;
  calories: string;
  tags: string[];
  category: string[];
  overlayBadge?: 'Popular' | 'New' | 'Bestseller' | 'Limited Time';
  isNew?: boolean;
};
type PriceTier = 'basic' | 'premium' | 'signature';
const mealNames = ['Grilled Salmon Bowl', 'Quinoa Buddha Bowl', 'Chicken Fajita Bowl', 'Mediterranean Plate', 'Vegetable Curry', 'Steak and Sweet Potato', 'Tofu Stir-Fry', 'Pesto Pasta Primavera', 'Asian Sesame Bowl', 'Southwest Chipotle Bowl'];
const descriptions = ['Fresh and flavorful combination with seasonal vegetables', 'Nutrient-rich blend of whole grains and proteins', 'Spicy and satisfying mix of proteins and vegetables', 'Classic Mediterranean flavors with a modern twist', 'Bold and aromatic combination of spices and vegetables'];
const tags = ['High Protein', 'Vegetarian', 'Vegan', 'Gluten Free', 'Low Carb', 'Keto', 'Dairy Free', 'Mediterranean', 'Spicy', 'Low Calorie'];
const categories = ['popular', 'new', 'bestseller', 'vegetarian', 'high-protein'];
const badges = ['Popular', 'New', 'Bestseller', 'Limited Time'] as const;
const imageUrls = ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd', 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601', 'https://images.unsplash.com/photo-1467003909585-2f8a72700288', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836'];
const priceTiers: Record<PriceTier, {
  price: number;
  label: string;
}> = {
  basic: {
    price: 11.99,
    label: 'Basic'
  },
  premium: {
    price: 14.99,
    label: 'Premium'
  },
  signature: {
    price: 17.99,
    label: 'Signature'
  }
};
// Helper function to determine price tier based on ingredients and complexity
function determinePriceTier(name: string): PriceTier {
  if (name.toLowerCase().includes('steak') || name.toLowerCase().includes('salmon')) {
    return 'signature';
  }
  if (name.toLowerCase().includes('chicken') || name.toLowerCase().includes('bowl')) {
    return 'premium';
  }
  return 'basic';
}
export function generateDummyMeals(count: number): Meal[] {
  const meals: Meal[] = [];
  const usedIds = new Set<number>();
  for (let i = 0; i < count; i++) {
    // Generate unique ID
    let id: number;
    do {
      id = Math.floor(Math.random() * 10000) + 1;
    } while (usedIds.has(id));
    usedIds.add(id);
    // Random selections
    const name = mealNames[Math.floor(Math.random() * mealNames.length)];
    const description = descriptions[Math.floor(Math.random() * descriptions.length)];
    const image = imageUrls[Math.floor(Math.random() * imageUrls.length)];
    // Determine price tier and set price
    const tier = determinePriceTier(name);
    const price = `$${priceTiers[tier].price}`;
    const prepTime = `${Math.floor(Math.random() * 20 + 15)} min`;
    const calories = `${Math.floor(Math.random() * 300 + 300)} cal`;
    // Generate 2-3 random tags
    const numTags = Math.floor(Math.random() * 2) + 2;
    const mealTags = [...tags].sort(() => Math.random() - 0.5).slice(0, numTags).concat([priceTiers[tier].label]); // Add tier as a tag
    // Generate 1-2 random categories
    const numCategories = Math.floor(Math.random() * 2) + 1;
    const mealCategories = [...categories].sort(() => Math.random() - 0.5).slice(0, numCategories);
    // 30% chance of having a badge
    const hasBadge = Math.random() < 0.3;
    const badge = hasBadge ? badges[Math.floor(Math.random() * badges.length)] : undefined;
    // 20% chance of being new
    const isNew = Math.random() < 0.2;
    meals.push({
      id,
      name,
      description,
      image,
      price,
      prepTime,
      calories,
      tags: mealTags,
      category: mealCategories,
      overlayBadge: badge,
      isNew
    });
  }
  return meals;
}