import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UtensilsCrossed, Sparkles, ShieldCheck, HeartPulse } from 'lucide-react';

export default function LoginPage() {
  const { signIn, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect immediately
  React.useEffect(() => {
    if (user) {
      navigate('/today');
    }
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signIn('Google');
    } catch (err) {
      console.error('Cognito sign-in error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between relative overflow-hidden">
      {/* Background aesthetic decorative gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Brand Header */}
      <header className="px-6 py-6 max-w-5xl mx-auto w-full flex items-center justify-between z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <UtensilsCrossed className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent">
            SmartMeal
          </span>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          AWS Cognito Auth
        </span>
      </header>

      {/* Hero Content Section */}
      <main className="max-w-md mx-auto px-6 py-10 w-full flex-1 flex flex-col justify-center z-10">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-2 bg-emerald-950/80 border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Smart Indian Meal & Diet Planner</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Eat Healthy. <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
              Plan Effortlessly.
            </span>
          </h1>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Organize your daily Indian meals, track ingredients, and discover AI-generated healthy recipes designed for your lifestyle.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-8 grid grid-cols-2 gap-3 text-left">
          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-md">
            <HeartPulse className="w-5 h-5 text-emerald-400 mb-1.5" />
            <h3 className="font-bold text-xs text-slate-200">5 Daily Meal Sections</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Pre-breakfast to dinner tracking</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-md">
            <Sparkles className="w-5 h-5 text-amber-400 mb-1.5" />
            <h3 className="font-bold text-xs text-slate-200">AI Chef & Photo Scan</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Recipe chat & food scanner</p>
          </div>
        </div>

        {/* Mock Login Action Box */}
        <div className="mt-8 p-6 rounded-3xl bg-slate-800/80 border border-slate-700/80 shadow-2xl backdrop-blur-xl space-y-4">
          <div className="text-center">
            <h2 className="font-bold text-base text-slate-100">Welcome to SmartMeal</h2>
            <p className="text-xs text-slate-400 mt-0.5">Sign in via AWS Cognito Managed Login</p>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading || authLoading}
            className="w-full py-3.5 px-4 bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm rounded-2xl transition-all shadow-lg flex items-center justify-center space-x-3 group disabled:opacity-60"
          >
            {/* Google SVG Icon */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span className="group-hover:translate-x-0.5 transition-transform">
              {loading ? 'Redirecting to Cognito...' : 'Continue with Google'}
            </span>
          </button>

          <p className="text-[11px] text-slate-500 text-center flex items-center justify-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>AWS Cognito OAuth 2.0 PKCE Protected</span>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-6 text-center text-xs text-slate-500 z-10">
        SmartMeal © 2026 • Intelligent Frontend Meal Planning App
      </footer>
    </div>
  );
}
