import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handleGoogleCallback } from '../services/googleService';
import { Calendar, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function GoogleAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing'); // 'processing' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const code = searchParams.get('code');

    if (!code) {
      setStatus('error');
      setErrorMsg('No authorization code provided in callback URL.');
      return;
    }

    async function exchangeToken() {
      try {
        await handleGoogleCallback(code);
        setStatus('success');

        // Notify parent window if opened in a popup
        if (window.opener) {
          window.opener.postMessage({ type: 'GOOGLE_AUTH_SUCCESS' }, '*');
          setTimeout(() => {
            window.close();
          }, 1500);
        } else {
          setTimeout(() => {
            navigate('/today', { replace: true });
          }, 2000);
        }
      } catch (err) {
        console.error('Google Callback Error:', err);
        setStatus('error');
        setErrorMsg(err.message || 'Failed to exchange authorization code.');
      }
    }

    exchangeToken();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="max-w-sm w-full bg-slate-800/90 border border-slate-700/80 rounded-3xl p-8 backdrop-blur-xl shadow-2xl text-center space-y-6 z-10">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/30">
          <Calendar className="w-8 h-8 text-white" />
        </div>

        {status === 'processing' && (
          <div className="space-y-4">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
            <h2 className="text-lg font-bold text-slate-100">Connecting Google Services</h2>
            <p className="text-xs text-slate-400">
              Saving Calendar & Tasks credentials securely...
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h2 className="text-lg font-bold text-slate-100">Google Connected!</h2>
            <p className="text-xs text-slate-400">
              Your Google Calendar & Tasks are now synced. Returning to SmartMeal...
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-2 text-rose-400 bg-rose-500/10 border border-rose-500/30 px-3 py-1.5 rounded-full text-xs font-semibold">
              <AlertCircle className="w-4 h-4" />
              <span>Authorization Failed</span>
            </div>
            <p className="text-slate-300 text-sm">{errorMsg}</p>
            <button
              onClick={() => navigate('/today', { replace: true })}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 font-bold text-sm text-slate-950 rounded-xl transition-all shadow-lg"
            >
              Return to SmartMeal
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
