import React, { useState } from 'react';
import { MEAL_TYPES, getTodayDateString } from '../utils/dateUtils';
import { X, Sparkles, Check, Flame } from 'lucide-react';

export default function ConfirmationModal({
  isOpen,
  onClose,
  suggestedMeal,
  onConfirmAdd,
}) {
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  const [selectedMealType, setSelectedMealType] = useState(
    suggestedMeal?.mealType || 'Lunch'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !suggestedMeal) return null;

  const handleConfirm = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onConfirmAdd(selectedDate, {
        name: suggestedMeal.name,
        mealType: selectedMealType,
        ingredients: suggestedMeal.ingredients || [],
        calories: suggestedMeal.calories || 300,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-emerald-50/60">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Add AI Suggested Meal</h3>
              <p className="text-xs text-emerald-800 font-medium">Confirm plan placement</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleConfirm} className="p-6 space-y-4">
          {/* Recipe Card Preview */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <h4 className="font-bold text-slate-900 text-base">{suggestedMeal.name}</h4>
            
            <div className="mt-1 flex items-center space-x-2 text-xs text-slate-600">
              {suggestedMeal.calories && (
                <span className="inline-flex items-center space-x-1 font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  <Flame className="w-3 h-3 text-amber-500" />
                  <span>{suggestedMeal.calories} kcal</span>
                </span>
              )}
              {suggestedMeal.protein && (
                <span className="font-semibold text-slate-600 bg-slate-200/70 px-2 py-0.5 rounded-full">
                  Protein: {suggestedMeal.protein}
                </span>
              )}
            </div>

            {suggestedMeal.ingredients && suggestedMeal.ingredients.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1">
                {suggestedMeal.ingredients.map((ing, i) => (
                  <span
                    key={i}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Target Date *</label>
            <input
              type="date"
              required
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
            />
          </div>

          {/* Meal Section Dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Meal Section *</label>
            <select
              value={selectedMealType}
              onChange={(e) => setSelectedMealType(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
            >
              {MEAL_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Action buttons */}
          <div className="pt-3 flex items-center justify-end space-x-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-colors shadow-md shadow-emerald-600/20 flex items-center space-x-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? 'Adding...' : 'Confirm & Add to Plan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
