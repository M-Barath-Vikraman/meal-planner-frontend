import React, { useState, useEffect } from 'react';
import { ShoppingCart, X, Check, AlertCircle, Calendar as CalendarIcon, CheckSquare, ExternalLink, RefreshCw } from 'lucide-react';
import { formatDateReadable } from '../utils/dateUtils';
import { getGoogleStatus, getGoogleAuthUrl, syncShoppingList } from '../services/googleService';

export default function ShoppingModal({
  isOpen,
  onClose,
  meal,
  dateStr,
  onShoppingSaved,
}) {
  const [items, setItems] = useState([]);
  const [googleConnected, setGoogleConnected] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success'|'error'|'info', message: string }

  // Initialize ingredient availability items when meal or isOpen changes
  useEffect(() => {
    if (!isOpen || !meal) return;

    setFeedback(null);
    setLoadingStatus(true);

    // 1. Initialize ingredient statuses
    const existingShoppingItems = meal.shopping?.items || [];
    const rawIngredients = Array.isArray(meal.ingredients) ? meal.ingredients : [];
    const formattedItems = rawIngredients.map((ingName) => {
      const existing = existingShoppingItems.find(
        (item) => item.name.toLowerCase() === ingName.toLowerCase()
      );
      return {
        name: ingName,
        status: existing ? existing.status : 'available',
      };
    });

    setItems(formattedItems);

    // 2. Check Google auth status
    getGoogleStatus()
      .then((connected) => setGoogleConnected(connected))
      .catch(() => setGoogleConnected(false))
      .finally(() => setLoadingStatus(false));
  }, [isOpen, meal]);

  if (!isOpen || !meal) return null;

  const notAvailableCount = items.filter((i) => i.status === 'not_available').length;

  const handleToggleStatus = (index, newStatus) => {
    const updated = [...items];
    updated[index].status = newStatus;
    setItems(updated);
  };

  const handleConnectGoogle = async () => {
    try {
      setSyncing(true);
      setFeedback(null);
      const authUrl = await getGoogleAuthUrl();
      const popup = window.open(
        authUrl,
        'Google OAuth',
        'width=600,height=700,top=100,left=200'
      );

      const handleMessage = async (event) => {
        if (event.data?.type === 'GOOGLE_AUTH_SUCCESS') {
          window.removeEventListener('message', handleMessage);
          if (popup) popup.close();
          setGoogleConnected(true);
          setFeedback({ type: 'success', message: 'Google Calendar & Tasks connected successfully! Now click "Add to Google Calendar & Tasks" to sync.' });
        }
      };

      window.addEventListener('message', handleMessage);
    } catch (err) {
      console.error('Error connecting Google:', err);
      setFeedback({ type: 'error', message: 'Failed to launch Google authorization window.' });
    } finally {
      setSyncing(false);
    }
  };

  const handleSaveAndSync = async () => {
    setSyncing(true);
    setFeedback(null);

    // Prompt user to connect Google if not connected yet
    if (!googleConnected) {
      setFeedback({
        type: 'info',
        message: 'Google Calendar & Tasks is not connected yet. Please click "Connect Google" above to authorize sync.',
      });
    }

    try {
      const result = await syncShoppingList(meal.id || meal.planId, dateStr, items);

      if (onShoppingSaved) {
        onShoppingSaved(result.data);
      }

      if (result.googleError) {
        setFeedback({
          type: 'error',
          message: `Saved to DynamoDB, but Google Sync: ${result.googleError}`,
        });
      } else if (result.syncResult?.message) {
        setFeedback({
          type: 'success',
          message: result.syncResult.message,
        });
      } else {
        setFeedback({
          type: 'success',
          message: `Saved shopping availability for "${meal.name}".`,
        });
      }
    } catch (err) {
      console.error('Error syncing shopping:', err);
      setFeedback({
        type: 'error',
        message: err.message || 'Failed to save shopping list.',
      });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between bg-slate-50/60">
          <div>
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 leading-snug">
                  Shopping for {meal.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {formatDateReadable(dateStr)} • <span className="font-semibold">{meal.mealType}</span>
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Feedback Banner */}
          {feedback && (
            <div
              className={`p-3.5 rounded-2xl text-xs font-semibold flex items-start space-x-2 border ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : feedback.type === 'error'
                  ? 'bg-rose-50 text-rose-800 border-rose-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
            >
              {feedback.type === 'success' ? (
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : feedback.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          {/* Google Account Status Banner */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3">
            <div className="flex items-center space-x-2.5">
              <CalendarIcon className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-slate-800">Google Calendar & Tasks</span>
                <p className="text-slate-500 font-medium">
                  {loadingStatus
                    ? 'Checking connection...'
                    : googleConnected
                    ? 'Connected & Ready for Sync'
                    : 'Not connected'}
                </p>
              </div>
            </div>

            {!googleConnected && !loadingStatus && (
              <button
                onClick={handleConnectGoogle}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center space-x-1 shrink-0"
              >
                <span>Connect Google</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}

            {googleConnected && (
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200 shrink-0">
                Connected ✓
              </span>
            )}
          </div>

          {/* Ingredients Availability Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Ingredient Availability
              </h4>
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                {notAvailableCount} {notAvailableCount === 1 ? 'item' : 'items'} to buy
              </span>
            </div>

            {items.length === 0 ? (
              <div className="py-6 text-center text-slate-400 text-xs italic bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                No ingredients specified for this meal.
              </div>
            ) : (
              <div className="space-y-2">
                {items.map((item, idx) => {
                  const isNotAvailable = item.status === 'not_available';

                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        isNotAvailable
                          ? 'bg-amber-50/50 border-amber-200'
                          : 'bg-white border-slate-200/80'
                      }`}
                    >
                      <span className={`text-sm font-semibold ${isNotAvailable ? 'text-amber-900 font-bold' : 'text-slate-800'}`}>
                        {item.name}
                      </span>

                      {/* Availability Toggle Buttons */}
                      <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl shrink-0">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(idx, 'available')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            !isNotAvailable
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          Available
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(idx, 'not_available')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            isNotAvailable
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          Not Available
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sync Rule Notice */}
          <p className="text-[11px] text-slate-400 italic">
            * Note: Only ingredients marked <strong>Not Available</strong> will be added to your Google Calendar and Google Tasks shopping list.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveAndSync}
            disabled={syncing}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center space-x-1.5 disabled:opacity-50"
          >
            {syncing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Syncing...</span>
              </>
            ) : (
              <>
                <CheckSquare className="w-4 h-4" />
                <span>Add to Google Calendar & Tasks</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
