import React from 'react';
import { Check, Trash2, Flame, ShoppingCart } from 'lucide-react';

export default function MealCard({ meal, onToggleComplete, onDelete, onOpenShopping }) {
  const isCompleted = meal.completed;

  return (
    <div
      className={`group relative p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 ${
        isCompleted
          ? 'bg-emerald-50/40 border-emerald-200/60 opacity-85'
          : 'bg-white border-slate-200/80 shadow-2xs hover:shadow-md hover:border-slate-300'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Checkbox and Meal details */}
        <div className="flex items-start space-x-3 min-w-0 flex-1">
          <button
            onClick={() => onToggleComplete(meal.id)}
            className={`mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
              isCompleted
                ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs'
                : 'border-slate-300 hover:border-emerald-500 bg-white'
            }`}
            aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2 flex-wrap">
              <h4
                className={`font-semibold text-sm sm:text-base leading-snug transition-colors ${
                  isCompleted ? 'line-through text-slate-500 font-medium' : 'text-slate-900'
                }`}
              >
                {meal.name}
              </h4>
              {meal.calories && (
                <span className="inline-flex items-center space-x-0.5 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60 shrink-0">
                  <Flame className="w-3 h-3 text-amber-500" />
                  <span>{meal.calories} kcal</span>
                </span>
              )}
            </div>

            {/* Ingredients preview */}
            {meal.ingredients && meal.ingredients.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {meal.ingredients.map((ing, idx) => (
                  <span
                    key={idx}
                    className={`inline-block text-[11px] px-2 py-0.5 rounded-md font-medium ${
                      isCompleted
                        ? 'bg-slate-100 text-slate-500'
                        : 'bg-slate-100 text-slate-700 border border-slate-200/60'
                    }`}
                  >
                    {ing}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Card Actions: Shopping & Delete */}
        <div className="flex items-center space-x-1 shrink-0">
          {onOpenShopping && (
            <button
              onClick={() => onOpenShopping(meal)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors opacity-80 group-hover:opacity-100"
              title="Manage ingredient availability & sync to Google"
              aria-label="Open shopping modal"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => onDelete(meal.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors opacity-80 group-hover:opacity-100"
            title="Delete meal from plan"
            aria-label="Delete meal"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
