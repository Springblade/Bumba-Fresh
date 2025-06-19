import { useCallback, useState, memo } from 'react';
import { Heart as HeartIcon, Check as CheckIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { CartItemAnimation } from '../../../components/animations/CartItemAnimation';
import { BaseMeal } from '../../../types/shared';

interface MealCardProps {
  meal: BaseMeal & {
    prepTime: string;
    calories: string;
  };
  onAddToCart: (meal: any) => void;
  onLike: (id: number) => void;
  isLiked: boolean;
  recentlyAdded: boolean;
}

const MealCard = memo(({
  meal,
  onAddToCart,
  onLike,
  isLiked,
  recentlyAdded
}: MealCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationConfig, setAnimationConfig] = useState<{
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  } | null>(null);
  
  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    const button = e.currentTarget;
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
      const buttonRect = button.getBoundingClientRect();
      const cartRect = cartIcon.getBoundingClientRect();
      setAnimationConfig({
        startX: buttonRect.left,
        startY: buttonRect.top,
        endX: cartRect.left + cartRect.width / 2,
        endY: cartRect.top + cartRect.height / 2
      });
      setShowAnimation(true);
      onAddToCart(meal);
    }
  }, [meal, onAddToCart]);

  const handleLike = useCallback(() => {
    onLike(meal.id);
  }, [meal.id, onLike]);

  const getBadgeStyle = useCallback((badge: string) => {
    switch (badge) {
      case 'Popular':
        return 'bg-secondary-500';
      case 'New':
        return 'bg-blue-500';
      case 'Bestseller':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  }, []);

  return <>
    <div className="group flex flex-col h-full bg-white rounded-xl border border-gray-200 transition-shadow duration-300 hover:shadow-md" style={{
      contain: 'content'
    }}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl">
        {!imageLoaded && <div className="absolute inset-0 bg-gray-100 animate-pulse" />}
        <img 
          srcSet={`${meal.image}?w=400&q=75 1x, ${meal.image}?w=800&q=75 2x`} 
          src={`${meal.image}?w=400&q=75`} 
          alt={meal.name} 
          loading="lazy" 
          width={400} 
          height={300} 
          onLoad={() => setImageLoaded(true)} 
          className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`} 
          style={{ contain: 'layout paint' }} 
        />

        {meal.overlayBadge && <div className={`absolute top-3 left-3 ${getBadgeStyle(meal.overlayBadge)} text-white text-xs font-semibold px-2 py-1 rounded-md uppercase z-10`}>
            {meal.overlayBadge}
          </div>}
        <button 
          onClick={handleLike} 
          className="absolute top-3 right-3 p-1.5 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow" 
          aria-label={isLiked ? 'Remove from favorites' : 'Add to favorites'}
        >
          <HeartIcon className={`w-5 h-5 ${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
        </button>
      </div>
      <div className="flex flex-col flex-grow p-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-900">
          {meal.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {meal.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {meal.tags.map((tag: string) => (
            <span key={tag} className="px-2 py-1 bg-gray-50 text-gray-700 rounded-full text-xs font-medium">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">
            {meal.price}
          </span>
          <motion.button 
            onClick={handleAddToCart} 
            whileTap={{ scale: 0.95 }} 
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${recentlyAdded ? 'bg-green-500 text-white' : 'bg-primary-600 text-white hover:bg-primary-700'}`}
          >
            {recentlyAdded ? (
              <>
                <CheckIcon className="w-4 h-4 mr-2" />
                Added
              </>
            ) : 'Add to Cart'}
          </motion.button>
        </div>
      </div>
    </div>
    {showAnimation && animationConfig && (
      <CartItemAnimation 
        imageUrl={meal.image} 
        {...animationConfig} 
        onComplete={() => setShowAnimation(false)} 
      />
    )}
  </>;
});

MealCard.displayName = 'MealCard';

export default MealCard;
