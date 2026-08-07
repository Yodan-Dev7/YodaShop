import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Grid, ShoppingBag, Heart, User } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { currentView, setCurrentView, cartCount, setIsCartDrawerOpen, favorites } = useApp();

  return (
    <nav className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-4 py-2 flex items-center justify-around shadow-lg">
      <button
        onClick={() => setCurrentView('home')}
        className={`flex flex-col items-center gap-1 p-1 transition-colors ${
          currentView === 'home' ? 'text-indigo-600 font-bold' : 'text-slate-400 hover:text-slate-700'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px]">Shop</span>
      </button>

      <button
        onClick={() => setCurrentView('catalog')}
        className={`flex flex-col items-center gap-1 p-1 transition-colors ${
          currentView === 'catalog' ? 'text-indigo-600 font-bold' : 'text-slate-400 hover:text-slate-700'
        }`}
      >
        <Grid className="w-5 h-5" />
        <span className="text-[10px]">Catalog</span>
      </button>

      <button
        onClick={() => setIsCartDrawerOpen(true)}
        className="flex flex-col items-center gap-1 p-1 text-slate-400 hover:text-slate-700 relative"
      >
        <ShoppingBag className="w-5 h-5" />
        <span className="text-[10px]">Cart</span>
        {cartCount > 0 && (
          <span className="absolute top-0 right-1 bg-indigo-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </button>

      <button
        onClick={() => setCurrentView('catalog')}
        className={`flex flex-col items-center gap-1 p-1 transition-colors ${
          favorites.length > 0 ? 'text-rose-500 font-bold' : 'text-slate-400 hover:text-slate-700'
        }`}
      >
        <Heart className="w-5 h-5" />
        <span className="text-[10px]">Saved</span>
      </button>

      <button
        onClick={() => setCurrentView('profile')}
        className={`flex flex-col items-center gap-1 p-1 transition-colors ${
          currentView === 'profile' ? 'text-indigo-600 font-bold' : 'text-slate-400 hover:text-slate-700'
        }`}
      >
        <User className="w-5 h-5" />
        <span className="text-[10px]">Account</span>
      </button>
    </nav>
  );
};
