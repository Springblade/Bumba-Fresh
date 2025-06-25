import { fetchData } from './api';

export interface Meal {
  id: number;
  name: string;
  description: string;
  image_url: string;
  price: number;
  calories?: number;
  prep_time?: string;
  category?: string;
  tags?: string[];
  dietary_restrictions?: string[];
  ingredients?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface ApiMealsResponse {
  success: boolean;
  data: Meal[];
}

export interface ApiMealResponse {
  success: boolean;
  data: Meal;
}

export async function getAllMeals(): Promise<Meal[]> {
  try {
    console.log('🍽️ getAllMeals: Starting API call...');
    const response = await fetchData<ApiMealsResponse>('/meals');
    console.log('🍽️ getAllMeals: API response received:', response);
    return response.data;
  } catch (error) {
    console.error('🍽️ getAllMeals: Error occurred:', error);
    return [];
  }
}

export async function getMealById(id: number): Promise<Meal | null> {
  try {
    const response = await fetchData<ApiMealResponse>(`/meals/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching meal ${id}:`, error);
    return null;
  }
}

export async function getMealsByCategory(category: string): Promise<Meal[]> {
  try {
    const response = await fetchData<ApiMealsResponse>(`/meals/category/${category}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching meals for category ${category}:`, error);
    return [];
  }
}
