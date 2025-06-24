import React, { useState, useEffect } from 'react';
import { PlusIcon, Search, Filter, UploadCloud } from 'lucide-react';
import { AdminMeal } from '../../types/shared';
import AdminPageHeader from '../../components/admin/ui/AdminPageHeader';
import AdminCard from '../../components/admin/ui/AdminCard';
import AdminConfirmModal from '../../components/admin/ui/AdminConfirmModal';
import { getAllMeals } from '../../services/meals';

/* 
 * CHANGE: Enhanced admin meals page with real API data
 * DATE: 21-06-2025
 */
const AdminMeals: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [mealToDelete, setMealToDelete] = useState<string | null>(null);
  const [meals, setMeals] = useState<AdminMeal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch meals from API
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const apiMeals = await getAllMeals();
        
        // Transform API data to AdminMeal format
        const transformedMeals: AdminMeal[] = apiMeals.map(meal => ({
          id: meal.id.toString(),
          name: meal.name,
          category: meal.category || 'Other',
          price: `$${(typeof meal.price === 'number' ? meal.price : parseFloat(meal.price) || 0).toFixed(2)}`,
          calories: meal.calories || 0,
          status: 'active' as const,
          imageUrl: meal.image_url || '/images/meals/default.jpg'
        }));
        
        setMeals(transformedMeals);
      } catch (err) {
        console.error('Failed to fetch meals:', err);
        setError('Failed to load meals');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeals();
  }, []);

  const filteredMeals = meals.filter(meal => 
    selectedCategory === 'all' || 
    meal.category.toLowerCase() === selectedCategory.toLowerCase()
  );

  const handleDeleteMeal = (mealId: string) => {
    setMealToDelete(mealId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (mealToDelete) {
      setMeals(meals.filter(meal => meal.id !== mealToDelete));
      setDeleteModalOpen(false);
      setMealToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <AdminPageHeader 
          title="Meals Management" 
          description="Manage your meal inventory"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-gray-200 animate-pulse rounded-lg h-64"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <AdminPageHeader 
          title="Meals Management" 
          description="Manage your meal inventory"
        />
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader 
        title="Meals Management" 
        description="Manage your meal inventory"
        action={
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700"
          >
            <PlusIcon className="w-5 h-5" />
            Add New Meal
          </button>
        }
      />
      
      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text"
            placeholder="Search meals..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          />
        </div>
        
        <select 
          className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snack">Snack</option>
        </select>
        
        <button className="px-3 py-2 border border-gray-300 rounded-md flex items-center gap-2 hover:bg-gray-50">
          <Filter className="w-5 h-5" />
          <span className="hidden sm:inline">More Filters</span>
        </button>
      </div>
      
      {/* Meals grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMeals.map(meal => (
          <AdminCard key={meal.id} className="p-0">
            <div className="h-48 bg-gray-200 relative">
              {meal.imageUrl ? (
                <img
                  src={meal.imageUrl}
                  alt={meal.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement?.appendChild(
                      Object.assign(document.createElement('div'), {
                        className: 'flex items-center justify-center h-full bg-gray-100',
                        innerHTML: '<div class="text-gray-400"><svg class="w-12 h-12" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" /></svg></div>'
                      })
                    );
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-100">
                  <UploadCloud className="text-gray-400 w-12 h-12" />
                </div>
              )}
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 text-xs rounded-full font-medium
                  ${meal.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                  }`}>
                  {meal.status}
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{meal.name}</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Category: {meal.category}</p>
                <p>Price: {meal.price}</p>
                <p>Calories: {meal.calories}</p>
              </div>
              
              <div className="mt-4 flex gap-2">
                <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteMeal(meal.id)}
                  className="flex-1 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </AdminCard>
        ))}
      </div>
      
      {filteredMeals.length === 0 && (
        <div className="text-center py-12">
          <UploadCloud className="mx-auto w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No meals found</h3>
          <p className="text-gray-500">
            {selectedCategory === 'all' 
              ? 'Get started by adding your first meal'
              : `No meals found in the ${selectedCategory} category`
            }
          </p>
        </div>
      )}

      {/* Delete confirmation modal */}
      <AdminConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Meal"
        description="Are you sure you want to delete this meal? This action cannot be undone."
        confirmButtonText="Delete"
        confirmButtonVariant="danger"
      />
    </div>
  );
};

export default AdminMeals;
