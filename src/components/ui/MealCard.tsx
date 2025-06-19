import React, { useCallback, useMemo, useState, lazy, memo } from 'react';
import { Heart as HeartIcon, Check as CheckIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
interface MealCardProps {
  meal: {
    id: number;
    name: string;
    description: string;
    image: string;
    price: string;
    tags: string[];
    overlayBadge?: string;
  };
  onAddToCart: (meal: any) => void;
  onLike: (id: number) => void;
  isLiked: boolean;
  recentlyAdded: boolean;
}
export const MealCard = memo(({
  meal,
  onAddToCart,
  onLike,
  isLiked,
  recentlyAdded
}: MealCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  // Memoize handlers
  const handleAddToCart = useCallback(() => {
    onAddToCart(meal);
  }, [meal, onAddToCart]);
  const handleLike = useCallback(() => {
    onLike(meal.id);
  }, [meal.id, onLike]);
  // Memoize image URL with size parameters
  const imageUrl = useMemo(() => {
    const url = new URL(meal.image);
    url.searchParams.set('w', '400');
    url.searchParams.set('q', '75');
    return url.toString();
  }, [meal.image]);
  return <div className="group flex flex-col h-full bg-white rounded-xl border border-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" style={{
    contain: 'content'
  }}>
        {/* Image container with fixed aspect ratio */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl">
          {!imageLoaded && <div className="absolute inset-0 bg-gray-100 animate-pulse" />}
          <img src={imageUrl} alt={meal.name} loading="lazy" onLoad={() => setImageLoaded(true)} className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`} style={{
        contain: 'paint'
      }} />
          {meal.overlayBadge && <div className="absolute top-3 left-3 px-2 py-1 bg-primary-600 text-white text-xs font-semibold rounded-md uppercase">
              {meal.overlayBadge}
            </div>}
          <button onClick={handleLike} className="absolute top-3 right-3 p-1.5 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow" aria-label={isLiked ? 'Remove from favorites' : 'Add to favorites'}>
            <HeartIcon className={`w-5 h-5 transition-colors ${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
          </button>
        </div>
        {/* Content */}
        <div className="flex flex-col flex-grow p-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 line-clamp-1">
            {meal.name}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {meal.description}
          </p>
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {meal.tags.map(tag => <span key={tag} className="px-2 py-1 bg-gray-50 text-gray-700 rounded-full text-xs font-medium">
                {tag}
              </span>)}
          </div>
          {/* Price and Add to Cart */}
          <div className="mt-auto flex items-center justify-between">
            <span className="text-xl font-bold text-gray-900">
              {meal.price}
            </span>
            <motion.button onClick={handleAddToCart} whileTap={{
          scale: 0.95
        }} className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${recentlyAdded ? 'bg-green-500 text-white' : 'bg-primary-600 text-white hover:bg-primary-700'}
              `}>
              <AnimatePresence mode="wait">
                {recentlyAdded ? <motion.span key="added" initial={{
              opacity: 0,
              y: 10
            }} animate={{
              opacity: 1,
              y: 0
            }} exit={{
              opacity: 0,
              y: -10
            }} className="flex items-center">
                    <CheckIcon className="w-4 h-4 mr-2" />
                    Added
                  </motion.span> : <motion.span key="add" initial={{
              opacity: 0,
              y: 10
            }} animate={{
              opacity: 1,
              y: 0
            }} exit={{
              opacity: 0,
              y: -10
            }}>
                    Add to Cart
                  </motion.span>}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>;
});
MealCard.displayName = 'MealCard';