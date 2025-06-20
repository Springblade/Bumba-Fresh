import React, { Suspense, lazy } from 'react';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
const OurMeals = lazy(() => import('../components/OurMeals'));
const MenuPage = () => {
  return <div className="bg-transparent">
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
            <LoadingSpinner size="lg" />
          </div>}>
        <OurMeals />
      </Suspense>
    </div>;
};
export default MenuPage;