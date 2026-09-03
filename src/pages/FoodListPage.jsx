import React, { useState, useEffect, useCallback } from 'react';
import { getFoods, addFood, updateFood, deleteFood } from '../services/foodService';
import { MEAL_TYPES } from '../utils/dateUtils';
import FoodFormModal from '../components/FoodFormModal';
import { useOutletContext } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Utensils, Flame } from 'lucide-react';

export default function FoodListPage() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMealTypeFilter, setSelectedMealTypeFilter] = useState('All');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState(null);

  const { showNotification } = useOutletContext() || {};

  const loadFoods = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getFoods();
      setFoods(data);
    } catch (err) {
      console.error('Error loading foods:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFoods();
  }, [loadFoods]);

  const handleOpenAdd = () => {
    setEditingFood(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (food) => {
    setEditingFood(food);
    setModalOpen(true);
  };

  const handleDeleteFood = async (foodId, foodName) => {
    if (window.confirm(`Are you sure you want to delete "${foodName}" from your food list?`)) {
      await deleteFood(foodId);
      await loadFoods();
      if (showNotification) showNotification(`Deleted "${foodName}"`);
    }
  };

  const handleSaveFood = async (foodData) => {
    try {
      if (foodData.id) {
        await updateFood(foodData.id, foodData);
        if (showNotification) showNotification(`Updated "${foodData.name}"`);
      } else {
        await addFood(foodData);
        if (showNotification) showNotification(`Added "${foodData.name}" to food list`);
      }
      await loadFoods();
    } catch (err) {
      console.error('Error saving food to database:', err);
      if (showNotification) showNotification(`Error: ${err.message || 'Failed to save food'}`);
      throw err;
    }
  };

  // Filter foods by search query and category tab
  const filteredFoods = foods.filter((food) => {
    const matchesSearch =
      food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (food.ingredients &&
        food.ingredients.some((ing) => ing.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesType =
      selectedMealTypeFilter === 'All' ||
      (food.mealType && food.mealType.toLowerCase() === selectedMealTypeFilter.toLowerCase());

    return matchesSearch && matchesType;
  });

  // Group foods by meal type for display
  const groupedFoods = MEAL_TYPES.reduce((acc, type) => {
    acc[type] = filteredFoods.filter(
      (f) => f.mealType && f.mealType.toLowerCase() === type.toLowerCase()
    );
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
            Food Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Manage your saved Indian dishes, ingredients, and nutritional information
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New Food</span>
        </button>
      </div>

      {/* Search Bar & Category Filters */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by food name or ingredient..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
          <span className="text-xs font-semibold text-slate-400 shrink-0 mr-1">Filter:</span>
          {['All', ...MEAL_TYPES].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedMealTypeFilter(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedMealTypeFilter === type
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Foods Grouped by Meal Type */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 font-medium">Loading food library...</div>
      ) : filteredFoods.length > 0 ? (
        <div className="space-y-6">
          {MEAL_TYPES.map((type) => {
            const list = groupedFoods[type] || [];
            if (selectedMealTypeFilter !== 'All' && selectedMealTypeFilter !== type) return null;
            if (list.length === 0) return null;

            return (
              <div key={type} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-slate-800 text-lg">{type}</h3>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {list.length} {list.length === 1 ? 'item' : 'items'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {list.map((food) => (
                    <div
                      key={food.id}
                      className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-slate-900 text-base group-hover:text-emerald-700 transition-colors">
                            {food.name}
                          </h4>
                          {food.calories && (
                            <span className="inline-flex items-center space-x-0.5 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 shrink-0">
                              <Flame className="w-3.5 h-3.5 text-amber-500" />
                              <span>{food.calories} kcal</span>
                            </span>
                          )}
                        </div>

                        {/* Ingredients */}
                        {food.ingredients && food.ingredients.length > 0 && (
                          <div className="mt-2.5 flex flex-wrap gap-1">
                            {food.ingredients.map((ing, i) => (
                              <span
                                key={i}
                                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium"
                              >
                                {ing}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Macros Preview */}
                        <div className="mt-3 flex items-center space-x-3 text-xs text-slate-500 pt-2 border-t border-slate-100 font-medium">
                          {food.protein && <span>Protein: <strong className="text-slate-700">{food.protein}</strong></span>}
                          {food.carbs && <span>Carbs: <strong className="text-slate-700">{food.carbs}</strong></span>}
                          {food.fat && <span>Fat: <strong className="text-slate-700">{food.fat}</strong></span>}
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="mt-4 pt-2 flex items-center justify-end space-x-2 border-t border-slate-50">
                        <button
                          onClick={() => handleOpenEdit(food)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center space-x-1 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteFood(food.id, food.name)}
                          className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center space-x-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
          <Utensils className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-700">No Food Items Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search filter or click below to add a new food item to your library.
          </p>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Food Item</span>
          </button>
        </div>
      )}

      {/* Add / Edit Food Modal */}
      <FoodFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialFood={editingFood}
        onSave={handleSaveFood}
      />
    </div>
  );
}
