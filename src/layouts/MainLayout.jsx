import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import AiChatModal from '../components/AiChatModal';
import { addMealToPlan } from '../services/mealPlanService';
import { Sparkles } from 'lucide-react';

export default function MainLayout() {
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddAiMealToPlan = async (dateStr, mealData) => {
    await addMealToPlan(dateStr, mealData);
    showNotification(`Added "${mealData.name}" to ${mealData.mealType} on ${dateStr}`);
    // Trigger custom event so active pages refresh their state
    window.dispatchEvent(new CustomEvent('smartmeal:plan_updated'));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 pb-20 md:pb-8">
      {/* Top Header */}
      <Header onOpenAiChat={() => setAiChatOpen(true)} />

      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed top-16 right-4 z-50 bg-emerald-800 text-white px-4 py-2.5 rounded-2xl shadow-xl border border-emerald-700 text-xs font-bold animate-bounce flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-emerald-300" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6">
        <Outlet context={{ showNotification }} />
      </main>

      {/* Floating AI Assistant Trigger Button */}
      <button
        onClick={() => setAiChatOpen(true)}
        className="fixed bottom-20 md:bottom-8 right-5 z-40 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-lg shadow-emerald-600/30 flex items-center space-x-2 transition-all hover:scale-105 active:scale-95 group"
        aria-label="Open AI Assistant"
      >
        <div className="relative">
          <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
        </div>
        <span className="font-bold text-xs sm:text-sm hidden sm:inline">AI Chef & Scanner</span>
      </button>

      {/* Fixed Mobile Bottom Navigation */}
      <Navigation />

      {/* Global AI Assistant Modal */}
      <AiChatModal
        isOpen={aiChatOpen}
        onClose={() => setAiChatOpen(false)}
        onAddAiMealToPlan={handleAddAiMealToPlan}
      />
    </div>
  );
}
