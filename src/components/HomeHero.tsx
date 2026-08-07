import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, Tag, ShieldCheck, Zap, Sparkles, TrendingUp } from 'lucide-react';

export const HomeHero: React.FC = () => {
  const { setCurrentView, setFilters, setIsAssignmentModalOpen } = useApp();

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-10 shadow-xl overflow-hidden border border-slate-800">
        <div className="relative z-10 max-w-xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>YodaShop E-Commerce Solution ✌️</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Welcome to YodaShop • Peace, Deals & Quality Products
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            A complete e-commerce experience featuring user authentication, category filters, real-time debounced search, shopping cart persistence, and mobile app preview.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => {
                setFilters(prev => ({ ...prev, category: 'all' }));
                setCurrentView('catalog');
              }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-5 py-3 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2"
            >
              <span>Explore All Products</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsAssignmentModalOpen(true)}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs px-5 py-3 rounded-xl border border-white/20 transition-all flex items-center gap-2 backdrop-blur-md"
            >
              <Tag className="w-3.5 h-3.5 text-indigo-400" />
              <span>View Assignment Prompt</span>
            </button>
          </div>
        </div>

        {/* Decorative Badge Overlay */}
        <div className="absolute right-6 bottom-6 hidden lg:block text-right">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-xs space-y-1">
            <span className="text-[10px] uppercase font-bold text-indigo-300 tracking-wider block">Special Promo Code</span>
            <span className="text-lg font-extrabold text-white font-mono block">SAVE10</span>
            <span className="text-[10px] text-slate-300 block">Use code at checkout for 10% OFF</span>
          </div>
        </div>
      </div>

      {/* Quick Category Feature Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          onClick={() => {
            setFilters(prev => ({ ...prev, category: "electronics" }));
            setCurrentView('catalog');
          }}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-indigo-500 hover:shadow-md cursor-pointer transition-all group flex items-center gap-3"
        >
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 capitalize">Electronics</h4>
            <span className="text-[10px] text-slate-400">Gadgets & Tech</span>
          </div>
        </div>

        <div
          onClick={() => {
            setFilters(prev => ({ ...prev, category: "jewelery" }));
            setCurrentView('catalog');
          }}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-amber-500 hover:shadow-md cursor-pointer transition-all group flex items-center gap-3"
        >
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 capitalize">Jewelery</h4>
            <span className="text-[10px] text-slate-400">Gold & Silver</span>
          </div>
        </div>

        <div
          onClick={() => {
            setFilters(prev => ({ ...prev, category: "men's clothing" }));
            setCurrentView('catalog');
          }}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-emerald-500 hover:shadow-md cursor-pointer transition-all group flex items-center gap-3"
        >
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 capitalize">Men's Apparel</h4>
            <span className="text-[10px] text-slate-400">Jackets & Tees</span>
          </div>
        </div>

        <div
          onClick={() => {
            setFilters(prev => ({ ...prev, category: "women's clothing" }));
            setCurrentView('catalog');
          }}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-rose-500 hover:shadow-md cursor-pointer transition-all group flex items-center gap-3"
        >
          <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl group-hover:bg-rose-600 group-hover:text-white transition-colors">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 capitalize">Women's Fashion</h4>
            <span className="text-[10px] text-slate-400">Coats & Tops</span>
          </div>
        </div>
      </div>
    </div>
  );
};
