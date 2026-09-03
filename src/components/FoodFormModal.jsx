import React, { useState, useEffect } from 'react';
import { MEAL_TYPES } from '../utils/dateUtils';
import { X, Utensils, AlertCircle, Loader2 } from 'lucide-react';

export default function FoodFormModal({
  isOpen,
  onClose,
  initialFood = null,
  onSave,
}) {
  const [name, setName] = useState('');
  const [mealType, setMealType] = useState('Lunch');
  const [ingredients, setIngredients] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');

  // Loading & error feedback states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      setIsSubmitting(false);

      if (initialFood) {
        setName(initialFood.name || '');
        setMealType(initialFood.mealType || 'Lunch');
        setIngredients(
          Array.isArray(initialFood.ingredients)
            ? initialFood.ingredients.join(', ')
            : initialFood.ingredients || ''
        );
        setCalories(initialFood.calories !== undefined ? String(initialFood.calories) : '');
        setProtein(initialFood.protein || '');
        setCarbs(initialFood.carbs || '');
        setFat(initialFood.fat || '');
      } else {
        setName('');
        setMealType('Lunch');
        setIngredients('');
        setCalories('');
        setProtein('');
        setCarbs('');
        setFat('');
      }
    }
  }, [isOpen, initialFood]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const ingArray = ingredients
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    setIsSubmitting(true);
    setErrorMessage(null);

    const formattedProtein = protein.trim() ? (protein.endsWith('g') ? protein.trim() : `${protein.trim()}g`) : '0g';
    const formattedCarbs = carbs.trim() ? (carbs.endsWith('g') ? carbs.trim() : `${carbs.trim()}g`) : '0g';
    const formattedFat = fat.trim() ? (fat.endsWith('g') ? fat.trim() : `${fat.trim()}g`) : '0g';

    try {
      await onSave({
        id: initialFood ? (initialFood.id || initialFood.foodId) : undefined,
        name: name.trim(),
        mealType,
        ingredients: ingArray,
        calories: calories ? Number(calories) : 0,
        protein: formattedProtein,
        carbs: formattedCarbs,
        fat: formattedFat,
      });
      onClose();
    } catch (err) {
      console.error('Error saving food in modal:', err);
      setErrorMessage(err.message || 'Failed to save food item');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                {initialFood ? 'Edit Food Item' : 'Add New Food Item'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Add to master food library for meal planning
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors disabled:opacity-50"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Message Banner */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-start space-x-2 text-rose-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Food Name *</label>
            <input
              type="text"
              required
              placeholder="Enter food name (e.g., Chicken Biryani)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 disabled:opacity-60"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Default Meal Type *</label>
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 disabled:opacity-60"
            >
              {MEAL_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Ingredients (comma separated)
            </label>
            <textarea
              rows={3}
              placeholder="Enter ingredients (e.g., Rice, Chicken, Onion, Spices)"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 disabled:opacity-60"
            />
            <p className="text-[11px] text-slate-400 mt-1">Separate multiple ingredients with commas.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Calories (kcal)</label>
              <input
                type="number"
                placeholder="550"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 disabled:opacity-60"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Protein</label>
              <input
                type="text"
                placeholder="30g"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 disabled:opacity-60"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Carbs</label>
              <input
                type="text"
                placeholder="70g"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 disabled:opacity-60"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Fat</label>
              <input
                type="text"
                placeholder="18g"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 disabled:opacity-60"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-colors shadow-md shadow-emerald-600/20 disabled:opacity-60 flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving to Cloud...</span>
                </>
              ) : (
                <span>{initialFood ? 'Update Food' : 'Save Food Item'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
