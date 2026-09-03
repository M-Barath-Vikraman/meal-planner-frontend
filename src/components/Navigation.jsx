import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CalendarCheck, CalendarDays, Utensils } from 'lucide-react';

export default function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    {
      id: 'today',
      label: 'Today',
      path: '/today',
      icon: CalendarCheck,
    },
    {
      id: 'plan',
      label: 'Plan',
      path: '/plan',
      icon: CalendarDays,
    },
    {
      id: 'food-list',
      label: 'Food List',
      path: '/food-list',
      icon: Utensils,
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-3 py-2">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center w-full py-1 rounded-xl transition-all ${
                isActive
                  ? 'text-emerald-600 font-bold scale-105'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <div
                className={`p-1.5 rounded-full transition-colors ${
                  isActive ? 'bg-emerald-100/80 text-emerald-700' : 'bg-transparent'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
