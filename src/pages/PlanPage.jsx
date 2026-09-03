import React, { useState, useEffect, useCallback } from 'react';
import CalendarView from '../components/CalendarView';
import DailyPlanView from '../components/DailyPlanView';
import AddMealModal from '../components/AddMealModal';
import ShoppingModal from '../components/ShoppingModal';
import { getMonthlySummary, getPlanByDate, toggleMealCompletion, deleteMealFromPlan, addMealToPlan } from '../services/mealPlanService';
import { getTodayDateString } from '../utils/dateUtils';
import { useOutletContext } from 'react-router-dom';

export default function PlanPage() {
  const todayStr = getTodayDateString();
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' | 'daily'
  
  // Calendar month state
  const currentDateObj = new Date();
  const [year, setYear] = useState(currentDateObj.getFullYear());
  const [month, setMonth] = useState(currentDateObj.getMonth());
  const [monthlySummary, setMonthlySummary] = useState({});

  // Selected date state
  const [selectedDateStr, setSelectedDateStr] = useState(todayStr);
  const [selectedDateMeals, setSelectedDateMeals] = useState([]);

  // Add meal modal
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [targetMealType, setTargetMealType] = useState('Lunch');

  // Shopping modal state
  const [shoppingModalOpen, setShoppingModalOpen] = useState(false);
  const [selectedShoppingMeal, setSelectedShoppingMeal] = useState(null);

  const { showNotification } = useOutletContext() || {};

  const loadMonthlySummary = useCallback(async () => {
    const summary = await getMonthlySummary(year, month);
    setMonthlySummary(summary);
  }, [year, month]);

  const loadDateMeals = useCallback(async (dateStr) => {
    const data = await getPlanByDate(dateStr);
    setSelectedDateMeals(data);
  }, []);

  useEffect(() => {
    loadMonthlySummary();
  }, [loadMonthlySummary]);

  useEffect(() => {
    if (viewMode === 'daily') {
      loadDateMeals(selectedDateStr);
    }
  }, [viewMode, selectedDateStr, loadDateMeals]);

  const handleSelectDateFromCalendar = (dateStr) => {
    setSelectedDateStr(dateStr);
    setViewMode('daily');
  };

  const handleDateChangeDaily = (newDateStr) => {
    setSelectedDateStr(newDateStr);
  };

  const handleToggleComplete = async (planItemId) => {
    await toggleMealCompletion(selectedDateStr, planItemId);
    await loadDateMeals(selectedDateStr);
    await loadMonthlySummary();
  };

  const handleDeleteMeal = async (planItemId) => {
    await deleteMealFromPlan(selectedDateStr, planItemId);
    await loadDateMeals(selectedDateStr);
    await loadMonthlySummary();
    if (showNotification) showNotification('Meal deleted from plan');
  };

  const handleOpenAddModal = (mealType) => {
    setTargetMealType(mealType);
    setAddModalOpen(true);
  };

  const handleAddMealSubmit = async (mealData) => {
    await addMealToPlan(selectedDateStr, mealData);
    await loadDateMeals(selectedDateStr);
    await loadMonthlySummary();
    if (showNotification) {
      showNotification(`Added "${mealData.name}" to ${mealData.mealType} on ${selectedDateStr}`);
    }
  };

  const handleOpenShopping = (meal) => {
    setSelectedShoppingMeal(meal);
    setShoppingModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Title Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
            Meal Planner
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            {viewMode === 'calendar'
              ? 'Select a date on the calendar to manage daily meal plans'
              : `Managing plan for ${selectedDateStr}`}
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center bg-slate-200/70 p-1 rounded-2xl">
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'calendar'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Calendar
          </button>
          <button
            onClick={() => {
              setViewMode('daily');
              loadDateMeals(selectedDateStr);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'daily'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Daily View
          </button>
        </div>
      </div>

      {/* Main View Display */}
      {viewMode === 'calendar' ? (
        <CalendarView
          year={year}
          month={month}
          selectedDate={selectedDateStr}
          monthlySummary={monthlySummary}
          onMonthChange={(y, m) => {
            setYear(y);
            setMonth(m);
          }}
          onSelectDate={handleSelectDateFromCalendar}
        />
      ) : (
        <DailyPlanView
          dateStr={selectedDateStr}
          meals={selectedDateMeals}
          onDateChange={handleDateChangeDaily}
          onBackToCalendar={() => {
            setViewMode('calendar');
            loadMonthlySummary();
          }}
          onToggleComplete={handleToggleComplete}
          onDeleteMeal={handleDeleteMeal}
          onOpenAddModal={handleOpenAddModal}
          onOpenShopping={handleOpenShopping}
        />
      )}

      {/* Add Meal Modal */}
      <AddMealModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        targetMealType={targetMealType}
        targetDateStr={selectedDateStr}
        onAddMeal={handleAddMealSubmit}
      />

      {/* Shopping Modal */}
      <ShoppingModal
        isOpen={shoppingModalOpen}
        onClose={() => setShoppingModalOpen(false)}
        meal={selectedShoppingMeal}
        dateStr={selectedDateStr}
        onShoppingSaved={() => loadDateMeals(selectedDateStr)}
      />
    </div>
  );
}
