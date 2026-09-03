import React, { useState, useEffect } from 'react';
import { getFoods } from '../services/foodService';
import { MEAL_TYPES } from '../utils/dateUtils';
import { X, Search, Plus } from 'lucide-react';

export default function AddMealModal({
  isOpen,
  onClose,
  targetMealType,
  onAddMeal,
}) {
  const [activeTab, setActiveTab] = useState('library'); // 'library' | 'custom'
  const [foodsList, setFoodsList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMealType, setSelectedMealType] = useState(targetMealType || 'Lunch');
  
  // Custom meal state
  const [customName, setCustomName] = useState('');
  const [customIngredients, setCustomIngredients] = useState('');
  const [customCalories, setCustomCalories] = useState('');
  
  // Loading & feedback
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (targetMealType) {
        setSelectedMealType(targetMealType);
      }
      loadFoodLibrary();
      setSearchQuery('');
      setCustomName('');
      setCustomIngredients('');
      setCustomCalories('');
    }
  }, [isOpen, targetMealType]);

  const loadFoodLibrary = async () => {
    setLoading(true);
    const data = await getFoods();
    setFoodsList(data);
    setLoading(false);
  };

  if (!isOpen) return null;

  const filteredFoods = foodsList.filter((food) => {
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.ingredients.some((ing) => ing.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Optionally prioritize or show all foods
    return matchesSearch;
  });

  const handleSelectFromLibrary = async (food) => {
    await onAddMeal({
      foodId: food.id,
      name: food.name,
      mealType: selectedMealType,
      ingredients: food.ingredients,
      calories: food.calories,
    });
    onClose();
  };

  const handleCreateCustom = async (e) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const ingArray = customIngredients
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    await onAddMeal({
      name: customName.trim(),
      mealType: selectedMealType,
      ingredients: ingArray,
      calories: customCalories ? Number(customCalories) : 0,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Add Meal to Plan</h3>
            <p className="text-xs text-slate-500 font-medium">
              Adding to <span className="font-semibold text-emerald-700">{selectedMealType}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Meal Type Selector Bar */}
        <div className="px-6 py-3 bg-slate-50/80 border-b border-slate-100 flex items-center space-x-2 overflow-x-auto">
          <span className="text-xs font-semibold text-slate-500 shrink-0">Section:</span>
          {MEAL_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedMealType(type)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedMealType === type
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Tab Toggle: Library vs Custom */}
        <div className="px-6 pt-3 flex border-b border-slate-100">
          <button
            onClick={() => setActiveTab('library')}
            className={`flex-1 pb-3 text-sm font-semibold border-b-2 text-center transition-colors ${
              activeTab === 'library'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Select from Food List
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`flex-1 pb-3 text-sm font-semibold border-b-2 text-center transition-colors ${
              activeTab === 'custom'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            + Quick Custom Meal
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'library' ? (
            <div className="space-y-4">
              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search food by name or ingredient..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              {/* Foods list */}
              {loading ? (
                <div className="py-8 text-center text-slate-400 text-sm">Loading food library...</div>
              ) : filteredFoods.length > 0 ? (
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {filteredFoods.map((food) => (
                    <div
                      key={food.id}
                      onClick={() => handleSelectFromLibrary(food)}
                      className="p-3 rounded-2xl border border-slate-200/80 hover:border-emerald-500 hover:bg-emerald-50/30 cursor-pointer transition-all flex items-center justify-between group"
                    >
                      <div>
                        <h4 className="font-semibold text-sm text-slate-800 group-hover:text-emerald-800">
                          {food.name}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                          {food.ingredients ? food.ingredients.join(', ') : 'No ingredients listed'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 shrink-0">
                        {food.calories && (
                          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                            {food.calories} kcal
                          </span>
                        )}
                        <span className="w-7 h-7 rounded-xl bg-slate-100 group-hover:bg-emerald-600 group-hover:text-white text-slate-600 flex items-center justify-center transition-colors">
                          <Plus className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-slate-500 text-sm">
                  No foods match your search. Switch to <button onClick={() => setActiveTab('custom')} className="text-emerald-600 font-semibold underline">Quick Custom Meal</button> to add it!
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleCreateCustom} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Meal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Paneer Butter Masala with Brown Rice"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ingredients (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Cottage Cheese, Tomatoes, Butter, Garam Masala"
                  value={customIngredients}
                  onChange={(e) => setCustomIngredients(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Estimated Calories (kcal)</label>
                <input
                  type="number"
                  placeholder="e.g., 350"
                  value={customCalories}
                  onChange={(e) => setCustomCalories(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-colors shadow-md shadow-emerald-600/20"
                >
                  Add Meal to Plan
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
