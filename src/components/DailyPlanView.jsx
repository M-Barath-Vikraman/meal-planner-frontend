import React from 'react';
import { formatDateReadable, getPreviousDate, getNextDate, MEAL_TYPES, isTodayDate } from '../utils/dateUtils';
import MealSection from './MealSection';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';

export default function DailyPlanView({
  dateStr,
  meals = [],
  onDateChange,
  onBackToCalendar,
  onToggleComplete,
  onDeleteMeal,
  onOpenAddModal,
  onOpenShopping,
}) {
  const isToday = isTodayDate(dateStr);

  const handlePrevDay = () => {
    onDateChange(getPreviousDate(dateStr));
  };

  const handleNextDay = () => {
    onDateChange(getNextDate(dateStr));
  };

  // Group meals by mealType
  const mealsByType = MEAL_TYPES.reduce((acc, type) => {
    acc[type] = meals.filter(
      (m) => m.mealType && m.mealType.toLowerCase() === type.toLowerCase()
    );
    return acc;
  }, {});

  const totalDailyCalories = meals.reduce((sum, item) => sum + (item.calories || 0), 0);
  const totalCompleted = meals.filter((item) => item.completed).length;

  return (
    <div className="space-y-6">
      {/* Top Bar Navigation */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Back button */}
          <button
            onClick={onBackToCalendar}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Month View</span>
          </button>

          {/* Date Selector Navigation */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevDay}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors"
              aria-label="Previous day"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="text-center px-2">
              <div className="flex items-center justify-center space-x-2">
                <h2 className="text-base sm:text-xl font-extrabold text-slate-800">
                  {formatDateReadable(dateStr)}
                </h2>
                {isToday && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase tracking-wider border border-emerald-200">
                    Today
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Total Planned: {meals.length} meals • {totalCompleted} completed • {totalDailyCalories} kcal
              </p>
            </div>

            <button
              onClick={handleNextDay}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors"
              aria-label="Next day"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="w-24 hidden sm:block"></div>
        </div>
      </div>

      {/* Meal Sections List */}
      <div className="space-y-4">
        {MEAL_TYPES.map((mealType) => (
          <MealSection
            key={mealType}
            mealType={mealType}
            meals={mealsByType[mealType] || []}
            onToggleComplete={onToggleComplete}
            onDeleteMeal={onDeleteMeal}
            onOpenAddModal={onOpenAddModal}
            onOpenShopping={onOpenShopping}
          />
        ))}
      </div>
    </div>
  );
}
