import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToastContext } from '../context/ToastContext';
import { 
  addFavorite, 
  removeFavorite, 
  getUserFavorites, 
  FavoriteItem 
} from '../services/favoritesApi';

export interface UseFavoritesReturn {
  favorites: FavoriteItem[];
  likedMeals: number[];
  isLoading: boolean;
  error: string | null;
  toggleFavorite: (mealId: number) => Promise<void>;
  isFavorited: (mealId: number) => boolean;
  refreshFavorites: () => Promise<void>;
  clearError: () => void;
}

export const useFavorites = (): UseFavoritesReturn => {
  const { user } = useAuth();
  const { addToast } = useToastContext();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [likedMeals, setLikedMeals] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load favorites from localStorage on mount (fallback)
  useEffect(() => {
    const savedLikedMeals = localStorage.getItem('likedMeals');
    if (savedLikedMeals) {
      try {
        const parsed = JSON.parse(savedLikedMeals);
        setLikedMeals(parsed);
      } catch (err) {
        console.error('Error parsing liked meals from localStorage:', err);
      }
    }
  }, []);
  // Load favorites from backend when user is authenticated
  const loadFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      setLikedMeals([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await getUserFavorites();
      if (response.success) {
        setFavorites(response.data);
        const mealIds = response.data.map(fav => fav.meal_id);
        setLikedMeals(mealIds);
        
        // Update localStorage as backup
        localStorage.setItem('likedMeals', JSON.stringify(mealIds));
      } else {
        throw new Error('Failed to load favorites');
      }
    } catch (err) {
      console.error('Error loading favorites:', err);
      setError('Failed to load favorites. Using cached data.');
      
      // Only show toast for loading errors if it's not a network issue
      if (err instanceof Error && !err.message.includes('Network')) {
        addToast({
          title: 'Connection Issue',
          description: 'Using cached favorites. Please check your connection.',
          type: 'warning'
        });
      }
      
      // Fallback to localStorage
      const savedLikedMeals = localStorage.getItem('likedMeals');
      if (savedLikedMeals) {
        try {
          const parsed = JSON.parse(savedLikedMeals);
          setLikedMeals(parsed);
        } catch (parseErr) {
          console.error('Error parsing cached favorites:', parseErr);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [user, addToast]);

  // Load favorites when user changes
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  // Clear favorites when user logs out
  useEffect(() => {
    if (!user) {
      setFavorites([]);
      setLikedMeals([]);
      localStorage.removeItem('likedMeals');
    }
  }, [user]);
  const toggleFavorite = useCallback(async (mealId: number) => {
    if (!user) {
      addToast({
        title: 'Login Required',
        description: 'Please log in to manage your favorites',
        type: 'warning'
      });
      return;
    }

    const isCurrentlyFavorited = likedMeals.includes(mealId);
    
    // Optimistic update
    setLikedMeals(prev => 
      isCurrentlyFavorited 
        ? prev.filter(id => id !== mealId)
        : [...prev, mealId]
    );

    try {
      let response;
      if (isCurrentlyFavorited) {
        response = await removeFavorite(mealId);
      } else {
        response = await addFavorite(mealId);
      }

      if (response.success) {
        // Update localStorage
        const newLikedMeals = isCurrentlyFavorited
          ? likedMeals.filter(id => id !== mealId)
          : [...likedMeals, mealId];
        localStorage.setItem('likedMeals', JSON.stringify(newLikedMeals));
        
        // Show success toast
        addToast({
          title: isCurrentlyFavorited ? 'Removed from Favorites' : 'Added to Favorites',
          description: isCurrentlyFavorited 
            ? 'Meal removed from your favorites' 
            : 'Meal added to your favorites',
          type: 'success'
        });
        
        // Refresh favorites list to get updated data
        await loadFavorites();
      } else {
        throw new Error(response.message || 'Failed to update favorite');
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update favorite';
      
      addToast({
        title: 'Error',
        description: errorMessage,
        type: 'error'
      });
      
      // Revert optimistic update
      setLikedMeals(prev => 
        isCurrentlyFavorited 
          ? [...prev, mealId]
          : prev.filter(id => id !== mealId)
      );
    }
  }, [user, likedMeals, loadFavorites, addToast]);

  const isFavorited = useCallback((mealId: number): boolean => {
    return likedMeals.includes(mealId);
  }, [likedMeals]);

  const refreshFavorites = useCallback(async () => {
    await loadFavorites();
  }, [loadFavorites]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    favorites,
    likedMeals,
    isLoading,
    error,
    toggleFavorite,
    isFavorited,
    refreshFavorites,
    clearError
  };
};
