import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage, analyzeFoodPhoto } from '../services/aiService';
import ConfirmationModal from './ConfirmationModal';
import {
  Sparkles,
  X,
  Send,
  Camera,
  Bot,
  User,
  Plus,
  Flame,
} from 'lucide-react';

export default function AiChatModal({ isOpen, onClose, onAddAiMealToPlan }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: "Namaste! I'm SmartMeal AI Assistant. Ask me for healthy Indian recipe ideas, macro recommendations, or scan a meal photo!",
      timestamp: 'Just now',
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState(null);

  // Confirmation Modal state
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [selectedMealForConfirm, setSelectedMealForConfirm] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!inputPrompt.trim() || isSending) return;

    const userText = inputPrompt.trim();
    const userMsg = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const previousHistory = [...messages];
    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsSending(true);

    try {
      const aiResponse = await sendChatMessage(userText, previousHistory);
      setMessages((prev) => [...prev, aiResponse]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'ai',
          text: err.message || "I couldn't process that right now. Please try again!",
          timestamp: 'Now',
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handlePhotoUploadSim = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsScanning(true);
    try {
      const result = await analyzeFoodPhoto(file);
      setScannedResult(result);
      const scanMsg = {
        id: `scan_${Date.now()}`,
        sender: 'ai',
        text: `📸 Photo scanned successfully! I identified **${result.name}** with ${Math.round(result.confidence * 100)}% confidence.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedRecipe: {
          name: result.name,
          mealType: result.mealType,
          ingredients: result.ingredients,
          calories: result.calories,
          protein: result.protein,
          carbs: result.carbs,
          fat: result.fat,
          imageUrl: result.imageUrl,
        },
      };
      setMessages((prev) => [...prev, scanMsg]);
    } finally {
      setIsScanning(false);
    }
  };

  const handleOpenConfirm = (recipe) => {
    setSelectedMealForConfirm(recipe);
    setConfirmationOpen(true);
  };

  const handleConfirmAddMeal = async (dateStr, mealData) => {
    await onAddAiMealToPlan(dateStr, mealData);
  };

  const quickPrompts = [
    'Suggest high protein breakfast',
    'Low carb Indian lunch',
    'Healthy snack under 150 kcal',
  ];

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
        <div className="bg-white w-full sm:max-w-md h-[90vh] sm:h-[620px] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-100">
          {/* Header */}
          <div className="px-5 py-3.5 bg-gradient-to-r from-emerald-700 to-teal-600 text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-emerald-200 animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-base leading-tight">SmartMeal AI Chef</h3>
                <p className="text-[11px] text-emerald-100 font-medium">Powered by Google Gemini</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors"
              aria-label="Close AI Chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/60">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start space-x-2.5 ${
                  msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                    msg.sender === 'user'
                      ? 'bg-slate-800 text-white'
                      : 'bg-emerald-600 text-white shadow-xs'
                  }`}
                >
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[82%] rounded-2xl p-3.5 text-sm ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-tr-xs shadow-xs'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs shadow-2xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>

                  {/* Suggested Recipe Card if attached */}
                  {msg.suggestedRecipe && (
                    <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-800">
                      {msg.suggestedRecipe.imageUrl && (
                        <img
                          src={msg.suggestedRecipe.imageUrl}
                          alt={msg.suggestedRecipe.name}
                          className="w-full h-32 object-cover rounded-lg mb-2"
                        />
                      )}
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-slate-900">{msg.suggestedRecipe.name}</h4>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                          {msg.suggestedRecipe.mealType}
                        </span>
                      </div>

                      <div className="mt-1 flex items-center space-x-2 text-xs text-slate-600">
                        {msg.suggestedRecipe.calories && (
                          <span className="inline-flex items-center space-x-0.5 text-amber-700 font-semibold">
                            <Flame className="w-3.5 h-3.5 text-amber-500" />
                            <span>{msg.suggestedRecipe.calories} kcal</span>
                          </span>
                        )}
                        {msg.suggestedRecipe.protein && (
                          <span className="text-slate-500 font-medium">Protein: {msg.suggestedRecipe.protein}</span>
                        )}
                      </div>

                      {msg.suggestedRecipe.ingredients && (
                        <p className="mt-1.5 text-[11px] text-slate-500 line-clamp-2">
                          <span className="font-semibold text-slate-700">Ingredients:</span>{' '}
                          {msg.suggestedRecipe.ingredients.join(', ')}
                        </p>
                      )}

                      {/* Add to Meal Plan Button */}
                      <button
                        onClick={() => handleOpenConfirm(msg.suggestedRecipe)}
                        className="mt-2.5 w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center space-x-1 shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Meal Plan</span>
                      </button>
                    </div>
                  )}

                  <span
                    className={`block text-[10px] mt-1 text-right ${
                      msg.sender === 'user' ? 'text-emerald-100' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isSending && (
              <div className="flex items-center space-x-2 text-slate-400 text-xs italic pl-9">
                <Sparkles className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                <span>SmartMeal AI is thinking...</span>
              </div>
            )}

            {isScanning && (
              <div className="flex items-center space-x-2 text-emerald-700 text-xs font-semibold pl-9 bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                <Camera className="w-4 h-4 animate-bounce" />
                <span>Analyzing food photo & detecting ingredients...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-4 py-2 bg-slate-100/70 border-t border-slate-200/60 flex items-center space-x-1.5 overflow-x-auto">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => {
                  setInputPrompt(prompt);
                }}
                className="px-2.5 py-1 rounded-full bg-white text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 text-[11px] font-medium whitespace-nowrap border border-slate-200 transition-colors shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-slate-200">
            <form onSubmit={handleSend} className="flex items-center space-x-2">
              <label
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 cursor-pointer transition-colors border border-slate-200"
                title="Scan meal photo"
              >
                <Camera className="w-5 h-5" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUploadSim}
                  className="hidden"
                />
              </label>

              <input
                type="text"
                placeholder="Ask recipe advice or suggest meals..."
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />

              <button
                type="submit"
                disabled={!inputPrompt.trim() || isSending}
                className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold transition-colors shadow-md shadow-emerald-600/20"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
        suggestedMeal={selectedMealForConfirm}
        onConfirmAdd={handleConfirmAddMeal}
      />
    </>
  );
}
