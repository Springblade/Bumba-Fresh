import { fetchData } from './api';

export interface FavoriteItem {
  favorite_id: number;
  meal_id: number;
  meal_name: string;
  description: string;
  price: number;
  category: string;
  dietary_options?: string;
  image_url: string;
  favorited_at: string;
}

export interface FavoritesResponse {
  success: boolean;
  data: FavoriteItem[];
  total_count: number;
}

export interface AddFavoriteResponse {
  success: boolean;
  message: string;
  data: {
    favorite_id: number;
    meal_id: number;
    user_id: number;
    created_at: string;
  };
}

export interface RemoveFavoriteResponse {
  success: boolean;
  message: string;
}

export interface CheckFavoriteResponse {
  success: boolean;
  is_favorite: boolean;
  data?: {
    favorite_id: number;
    created_at: string;
  } | null;
}

/**
 * Add a meal to user's favorites
 */
export async function addFavorite(mealId: number): Promise<AddFavoriteResponse> {
  return fetchData<AddFavoriteResponse>('/favorites', {
    method: 'POST',
    body: JSON.stringify({ meal_id: mealId })
  });
}

/**
 * Remove a meal from user's favorites
 */
export async function removeFavorite(mealId: number): Promise<RemoveFavoriteResponse> {
  return fetchData<RemoveFavoriteResponse>(`/favorites/${mealId}`, {
    method: 'DELETE'
  });
}

/**
 * Get all user's favorites with optional search and filters
 */
export async function getUserFavorites(options?: {
  search?: string;
  category?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}): Promise<FavoritesResponse> {
  const params = new URLSearchParams();
  
  if (options?.search) params.append('search', options.search);
  if (options?.category) params.append('category', options.category);
  if (options?.sort) params.append('sort', options.sort);
  if (options?.order) params.append('order', options.order);
  if (options?.limit) params.append('limit', options.limit.toString());
  if (options?.offset) params.append('offset', options.offset.toString());
  
  const queryString = params.toString();
  const endpoint = queryString ? `/favorites?${queryString}` : '/favorites';
  
  return fetchData<FavoritesResponse>(endpoint);
}

/**
 * Check if a specific meal is in user's favorites
 */
export async function checkFavorite(mealId: number): Promise<CheckFavoriteResponse> {
  return fetchData<CheckFavoriteResponse>(`/favorites/check/${mealId}`);
}

/**
 * Get user's favorite statistics
 */
export async function getFavoriteStats(): Promise<{
  success: boolean;
  data: {
    total_favorites: number;
    unique_categories: number;
    average_price: number;
    most_recent_favorite: string | null;
    first_favorite: string | null;
    categories: Record<string, number>;
  };
}> {
  return fetchData('/favorites/stats');
}

/**
 * Toggle favorite status (add if not favorited, remove if favorited)
 */
export async function toggleFavorite(mealId: number): Promise<{ 
  success: boolean; 
  action: 'added' | 'removed'; 
  message: string;
}> {
  try {
    // First check if it's already favorited
    const checkResult = await checkFavorite(mealId);
    
    if (checkResult.is_favorite) {
      // Remove from favorites
      const result = await removeFavorite(mealId);
      return {
        success: result.success,
        action: 'removed',
        message: result.message
      };
    } else {
      // Add to favorites
      const result = await addFavorite(mealId);
      return {
        success: result.success,
        action: 'added',
        message: result.message
      };
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw error;
  }
}
