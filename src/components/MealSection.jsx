import React from 'react';
import MealCard from './MealCard';
import { Plus, Sun, Coffee, Cookie, Utensils, Moon } from 'lucide-react';

const MEAL_ICONS = {
  'Pre-Breakfast': Coffee,
  'Breakfast': Sun,
  'Mid-morning Snacks': Cookie,
  'Lunch': Utensils,
  'Dinner': Moon,
};

const MEAL_COLORS = {
  'Pre-Breakfast': 'text-amber-600 bg-amber-50 border-amber-200',
  'Breakfast': 'text-orange-600 bg-orange-50 border-orange-200',
  'Mid-morning Snacks': 'text-teal-600 bg-teal-50 border-teal-200',
  'Lunch': 'text-emerald-600 bg-emerald-50 border-emerald-200',
  'Dinner': 'text-indigo-600 bg-indigo-50 border-indigo-200',
};

export default function MealSection({
  mealType,
  meals = [],
  onToggleComplete,
  onDeleteMeal,
  onOpenAddModal,
  onOpenShopping,
}) {
  const IconComponent = MEAL_ICONS[mealType] || Utensils;
  const colorStyle = MEAL_COLORS[mealType] || 'text-slate-600 bg-slate-50 border-slate-200';

  const totalCalories = meals.reduce((sum, item) => sum + (item.calories || 0), 0);
  const completedCount = meals.filter((item) => item.completed).length;

  return (
    <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-5 transition-shadow hover:shadow-sm">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3.5">
        <div className="flex items-center space-x-2.5">
          <div className={`p-2 rounded-xl border ${colorStyle}`}>
            <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base sm:text-lg">{mealType}</h3>
            <p className="text-xs text-slate-500 font-medium">
              {meals.length > 0
                ? `${completedCount}/${meals.length} completed • ${totalCalories} kcal`
                : 'No meals added'}
            </p>
          </div>
        </div>

        {/* Add Meal button */}
        <button
          onClick={() => onOpenAddModal(mealType)}
          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-xs transition-colors border border-emerald-200/80"
          aria-label={`Add meal to ${mealType}`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Meal</span>
        </button>
      </div>

      {/* Meals List or Empty State */}
      {meals.length > 0 ? (
        <div className="space-y-2.5">
          {meals.map((meal) => (
            <MealCard
              key={meal.id}
              meal={meal}
              onToggleComplete={onToggleComplete}
              onDelete={onDeleteMeal}
              onOpenShopping={onOpenShopping}
            />
          ))}
        </div>
      ) : (
        <div 
          onClick={() => onOpenAddModal(mealType)}
          className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center cursor-pointer hover:border-emerald-300 hover:bg-emerald-50/20 transition-all group"
        >
          <p className="text-xs text-slate-400 font-medium group-hover:text-emerald-700">
            + Click to add a meal to <span className="font-semibold">{mealType}</span>
          </p>
        </div>
      )}
    </section>
  );
}
