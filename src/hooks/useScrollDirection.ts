import { useState, useEffect, useCallback } from 'react';
type ScrollDirection = 'up' | 'down';
export const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>('up');
  const [prevOffset, setPrevOffset] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);
  const updateScrollDirection = useCallback(() => {
    const threshold = 10;
    const scrollY = window.scrollY;
    setIsAtTop(scrollY < threshold);
    if (Math.abs(scrollY - prevOffset) < threshold) {
      return;
    }
    setScrollDirection(scrollY > prevOffset ? 'down' : 'up');
    setPrevOffset(scrollY > 0 ? scrollY : 0);
  }, [prevOffset]);
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateScrollDirection();
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, {
      passive: true
    });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [updateScrollDirection]);
  return {
    scrollDirection,
    isAtTop
  };
};