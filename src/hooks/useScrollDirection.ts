import { useState, useEffect } from 'react';
type ScrollDirection = 'up' | 'down';
export const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>('up');
  const [prevOffset, setPrevOffset] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);
  useEffect(() => {
    const threshold = 10;
    let ticking = false;
    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      setIsAtTop(scrollY < threshold);
      if (Math.abs(scrollY - prevOffset) < threshold) {
        ticking = false;
        return;
      }
      setScrollDirection(scrollY > prevOffset ? 'down' : 'up');
      setPrevOffset(scrollY > 0 ? scrollY : 0);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [prevOffset]);
  return {
    scrollDirection,
    isAtTop
  };
};