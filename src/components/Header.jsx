import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { UtensilsCrossed, LogOut, Sparkles, User, Calendar, BookOpen } from 'lucide-react';

export default function Header({ onOpenAiChat }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Today', path: '/today', icon: Calendar },
    { name: 'Plan', path: '/plan', icon: Calendar },
    { name: 'Food List', path: '/food-list', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand logo & title */}
        <div 
          onClick={() => navigate('/today')}
          className="flex items-center space-x-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <UtensilsCrossed className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-xl tracking-tight text-slate-800">SmartMeal</span>
              <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">AI</span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium hidden sm:block">Intelligent Indian Meal Planner</p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                {link.name}
              </button>
            );
          })}
        </nav>

        {/* User profile & actions */}
        {user && (
          <div className="flex items-center space-x-3">
            {/* AI Assistant Quick Trigger */}
            <button
              onClick={onOpenAiChat}
              className="hidden sm:flex items-center space-x-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-xl border border-emerald-200/80 text-xs font-semibold transition-colors shadow-2xs"
              title="Open AI Chef Assistant"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ask AI Chef</span>
            </button>

            {/* Avatar & User Name */}
            <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200/80 rounded-full pl-1.5 pr-3 py-1">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-7 h-7 rounded-full object-cover border border-emerald-400"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-7 h-7 rounded-full bg-emerald-600 hidden items-center justify-center text-white text-xs font-bold">
                {user.name ? user.name.charAt(0) : 'U'}
              </div>
              <span className="text-xs font-semibold text-slate-700 max-w-[90px] truncate hidden sm:inline-block">
                {user.name}
              </span>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors border border-transparent hover:border-rose-100"
              title="Log out"
              aria-label="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
