import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
export const ScrollToTop = () => {
  const {
    pathname
  } = useLocation();
  useEffect(() => {
    const scrollOptions: ScrollToOptions = {
      top: 0,
      left: 0,
      behavior: 'smooth'
    };
    window.scrollTo(scrollOptions);
    // Cleanup function to handle any pending smooth scroll
    return () => {
      window.scrollTo({
        ...scrollOptions,
        behavior: 'auto'
      });
    };
  }, [pathname]);
  return null;
};