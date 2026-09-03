import React, { useState, useEffect, useCallback } from 'react';
import { getPlanByDate, toggleMealCompletion, deleteMealFromPlan, addMealToPlan } from '../services/mealPlanService';
import { getTodayDateString, formatDateReadable } from '../utils/dateUtils';
import MealSection from '../components/MealSection';
import AddMealModal from '../components/AddMealModal';
import ShoppingModal from '../components/ShoppingModal';
import { useOutletContext } from 'react-router-dom';
import { Flame, CheckCircle, RefreshCw } from 'lucide-react';

const MEAL_SECTIONS = [
  'Pre-Breakfast',
  'Breakfast',
  'Mid-morning Snacks',
  'Lunch',
  'Dinner',
];

export default function TodayPage() {
  const todayStr = getTodayDateString();
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Meal modal state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [targetMealType, setTargetMealType] = useState('Lunch');

  // Shopping modal state
  const [shoppingModalOpen, setShoppingModalOpen] = useState(false);
  const [selectedShoppingMeal, setSelectedShoppingMeal] = useState(null);

  const { showNotification } = useOutletContext() || {};

  const loadTodayMeals = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPlanByDate(todayStr);
      setMeals(data);
    } catch (err) {
      console.error('Error loading today meals:', err);
    } finally {
      setLoading(false);
    }
  }, [todayStr]);

  useEffect(() => {
    loadTodayMeals();

    // Listen for custom plan updates (e.g. from AI assistant modal)
    const handlePlanUpdated = () => {
      loadTodayMeals();
    };
    window.addEventListener('smartmeal:plan_updated', handlePlanUpdated);
    return () => {
      window.removeEventListener('smartmeal:plan_updated', handlePlanUpdated);
    };
  }, [loadTodayMeals]);

  const handleToggleComplete = async (planItemId) => {
    try {
      await toggleMealCompletion(todayStr, planItemId);
      await loadTodayMeals();
    } catch (err) {
      console.error('Error toggling completion:', err);
    }
  };

  const handleDeleteMeal = async (planItemId) => {
    try {
      await deleteMealFromPlan(todayStr, planItemId);
      await loadTodayMeals();
      if (showNotification) showNotification('Meal removed from today');
    } catch (err) {
      console.error('Error deleting meal:', err);
    }
  };

  const handleOpenAddModal = (mealType) => {
    setTargetMealType(mealType);
    setAddModalOpen(true);
  };

  const handleAddMealSubmit = async (mealData) => {
    await addMealToPlan(todayStr, mealData);
    await loadTodayMeals();
    if (showNotification) {
      showNotification(`Added "${mealData.name}" to ${mealData.mealType}`);
    }
  };

  const handleOpenShopping = (meal) => {
    setSelectedShoppingMeal(meal);
    setShoppingModalOpen(true);
  };

  // Group meals by section
  const mealsBySection = MEAL_SECTIONS.reduce((acc, section) => {
    acc[section] = meals.filter(
      (m) => m.mealType && m.mealType.toLowerCase() === section.toLowerCase()
    );
    return acc;
  }, {});

  // Calculate totals
  const totalCalories = meals.reduce((sum, item) => sum + (item.calories || 0), 0);
  const completedCount = meals.filter((item) => item.completed).length;
  const progressPercent = meals.length > 0 ? Math.round((completedCount / meals.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Today Dashboard Summary Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30 uppercase tracking-wider">
                Today's Schedule
              </span>
              <span className="text-slate-400 text-xs font-semibold">{todayStr}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black mt-2 text-white tracking-tight">
              {formatDateReadable(todayStr)}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              Track your daily nutrition, check off completed meals, and stay healthy!
            </p>
          </div>

          {/* Daily Progress Stats Card */}
          <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 shrink-0">
            <div className="text-center pr-3 border-r border-white/15">
              <div className="flex items-center space-x-1 text-amber-400">
                <Flame className="w-4 h-4" />
                <span className="text-lg font-black">{totalCalories}</span>
              </div>
              <span className="text-[10px] text-slate-300 font-semibold uppercase tracking-wider">Calories</span>
            </div>

            <div className="text-center pl-1">
              <div className="flex items-center space-x-1 text-emerald-400">
                <CheckCircle className="w-4 h-4" />
                <span className="text-lg font-black">{completedCount} / {meals.length}</span>
              </div>
              <span className="text-[10px] text-slate-300 font-semibold uppercase tracking-wider">Meals Done ({progressPercent}%)</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-5 w-full bg-slate-700/50 rounded-full h-2 overflow-hidden border border-white/5">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Loading or Meal Sections List */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 flex flex-col items-center space-y-2">
          <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
          <span className="text-sm font-medium">Loading today's meal plan...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {MEAL_SECTIONS.map((section) => (
            <MealSection
              key={section}
              mealType={section}
              meals={mealsBySection[section] || []}
              onToggleComplete={handleToggleComplete}
              onDeleteMeal={handleDeleteMeal}
              onOpenAddModal={handleOpenAddModal}
              onOpenShopping={handleOpenShopping}
            />
          ))}
        </div>
      )}

      {/* Add Meal Modal */}
      <AddMealModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        targetMealType={targetMealType}
        targetDateStr={todayStr}
        onAddMeal={handleAddMealSubmit}
      />

      {/* Shopping Modal */}
      <ShoppingModal
        isOpen={shoppingModalOpen}
        onClose={() => setShoppingModalOpen(false)}
        meal={selectedShoppingMeal}
        dateStr={todayStr}
        onShoppingSaved={loadTodayMeals}
      />
    </div>
  );
}
