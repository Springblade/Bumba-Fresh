import React, { useState } from 'react';
import { PlusIcon, Search, Filter, UploadCloud } from 'lucide-react';
import { AdminMeal } from '../../types/shared';
import AdminPageHeader from '../../components/admin/ui/AdminPageHeader';
import AdminCard from '../../components/admin/ui/AdminCard';
import AdminConfirmModal from '../../components/admin/ui/AdminConfirmModal';

/* 
 * CHANGE: Enhanced admin meals page with reusable components
 * DATE: 21-06-2025
 */
const AdminMeals: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [mealToDelete, setMealToDelete] = useState<string | null>(null);
  
  // Mock data - would come from API
  const meals: AdminMeal[] = [
    { 
      id: '1', 
      name: 'Grilled Chicken Bowl', 
      category: 'Lunch', 
      price: '$12.99',
      calories: 450,
      status: 'active',
      imageUrl: '/images/meals/chicken-bowl.jpg'
    },
    { 
      id: '2', 
      name: 'Avocado & Egg Breakfast', 
      category: 'Breakfast', 
      price: '$9.99',
      calories: 380,
      status: 'active',
      imageUrl: '/images/meals/avocado-egg.jpg'
    },
    { 
      id: '3', 
      name: 'Salmon & Quinoa', 
      category: 'Dinner', 
      price: '$14.99',
      calories: 520,
      status: 'active',
      imageUrl: '/images/meals/salmon-quinoa.jpg'
    },
    { 
      id: '4', 
      name: 'Greek Yogurt Parfait', 
      category: 'Breakfast', 
      price: '$7.99',
      calories: 320,
      status: 'active',
      imageUrl: '/images/meals/yogurt-parfait.jpg'
    },
    { 
      id: '5', 
      name: 'Steak & Vegetables', 
      category: 'Dinner', 
      price: '$16.99',
      calories: 580,
      status: 'inactive',
      imageUrl: '/images/meals/steak-vegetables.jpg'
    },
    { 
      id: '6', 
      name: 'Veggie Buddha Bowl', 
      category: 'Lunch', 
      price: '$11.99',
      calories: 420,
      status: 'active',
      imageUrl: '/images/meals/veggie-bowl.jpg'
    },
  ];

  const filteredMeals = selectedCategory === 'all' 
    ? meals 
    : meals.filter(meal => meal.category.toLowerCase() === selectedCategory);

  const handleDeleteClick = (mealId: string) => {
    setMealToDelete(mealId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    console.log(`Deleting meal: ${mealToDelete}`);
    // Actual deletion logic would go here
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader 
        title="Meal Management"
        action={
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <PlusIcon size={16} />
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
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-100">
                  <UploadCloud className="text-gray-400 w-12 h-12" />
                </div>
              )}
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 text-xs rounded-full font-medium
                  ${meal.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {meal.status}
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-lg">{meal.name}</h3>
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-500 text-sm">{meal.category}</span>
                <span className="font-medium">{meal.price}</span>
              </div>
              <div className="mt-1 text-sm text-gray-500">{meal.calories} calories</div>
              
              <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                <button className="text-primary-600 hover:text-primary-700">Edit</button>
                <div>
                  <button className="text-gray-600 hover:text-gray-700 mr-2">Duplicate</button>
                  <button 
                    onClick={() => handleDeleteClick(meal.id)} 
                    className="text-gray-600 hover:text-gray-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </AdminCard>
        ))}
      </div>
      
      {/* Delete confirmation modal */}
      <AdminConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Meal"
        message="Are you sure you want to delete this meal? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />
      
      {/* Add Meal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-4">Add New Meal</h2>
            {/* Form contents */}
            <div className="flex justify-end gap-2 pt-4">
              <button 
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
                Add Meal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMeals;