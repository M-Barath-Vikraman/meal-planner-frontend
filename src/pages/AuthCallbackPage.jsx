import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UtensilsCrossed, Loader2, AlertCircle } from 'lucide-react';

export default function AuthCallbackPage() {
  const { user, checkUserSession } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function processCallback() {
      try {
        await checkUserSession();
      } catch (err) {
        if (isMounted) {
          console.error('Authentication callback error:', err);
          setError('Failed to complete Cognito sign-in. Please try logging in again.');
        }
      }
    }

    processCallback();

    return () => {
      isMounted = false;
    };
  }, [checkUserSession]);

  useEffect(() => {
    if (user) {
      navigate('/today', { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Aesthetic background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-sm w-full bg-slate-800/80 border border-slate-700/80 rounded-3xl p-8 backdrop-blur-xl shadow-2xl text-center space-y-6 z-10">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/30">
          <UtensilsCrossed className="w-8 h-8 text-white" />
        </div>

        {error ? (
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-2 text-rose-400 bg-rose-500/10 border border-rose-500/30 px-3 py-1.5 rounded-full text-xs font-semibold">
              <AlertCircle className="w-4 h-4" />
              <span>Authentication Error</span>
            </div>
            <p className="text-slate-300 text-sm">{error}</p>
            <button
              onClick={() => navigate('/login', { replace: true })}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 font-bold text-sm text-slate-950 rounded-xl transition-all shadow-lg"
            >
              Return to Login
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
            <h2 className="text-lg font-bold text-slate-100">Completing Sign In</h2>
            <p className="text-xs text-slate-400">
              Verifying your Cognito session and redirecting to SmartMeal...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
