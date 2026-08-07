import React from 'react';
import { useApp } from '../context/AppContext';
import { Search, ShoppingBag, User as UserIcon, Smartphone, Monitor, Sparkles, X, RefreshCw, Layers } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    filters,
    setFilters,
    categories,
    cartCount,
    setIsCartDrawerOpen,
    user,
    isAuthenticated,
    setIsLoginModalOpen,
    setCurrentView,
    currentView,
    setIsAssignmentModalOpen,
    isMobileFrameMode,
    setIsMobileFrameMode,
    refreshProducts,
    isLoadingProducts
  } = useApp();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, searchQuery: e.target.value }));
    if (currentView !== 'catalog' && currentView !== 'home') {
      setCurrentView('catalog');
    }
  };

  const handleCategorySelect = (cat: string) => {
    setFilters(prev => ({ ...prev, category: cat }));
    if (currentView !== 'catalog' && currentView !== 'home') {
      setCurrentView('catalog');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Header Row */}
        <div className="h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="p-2 bg-gradient-to-br from-slate-900 to-indigo-900 group-hover:from-indigo-600 group-hover:to-teal-600 text-white rounded-xl transition-all shadow-xs">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold text-slate-900 tracking-tight block leading-none">
                  YodaShop
                </span>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-md">
                  ✌️ Peace
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium block">
                API E-Commerce Store
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={filters.searchQuery}
                onChange={handleSearchChange}
                placeholder="Search products by title or keywords..."
                className="w-full pl-10 pr-9 py-2 text-xs bg-slate-100/80 border border-slate-200/80 rounded-xl focus:bg-white focus:border-indigo-500 focus:outline-none transition-all placeholder:text-slate-400"
              />
              {filters.searchQuery && (
                <button
                  onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Actions & Utilities */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* API Refresh Button */}
            <button
              onClick={refreshProducts}
              disabled={isLoadingProducts}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              title="Refresh products from API"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingProducts ? 'animate-spin text-indigo-600' : ''}`} />
            </button>

            {/* Assignment Prompt Modal Trigger */}
            <button
              onClick={() => setIsAssignmentModalOpen(true)}
              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs px-3 py-2 rounded-xl border border-indigo-200/80 transition-all flex items-center gap-1.5 shrink-0"
              title="Open Assignment Prompt & Architecture Blueprint"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden lg:inline">Assignment Prompt</span>
            </button>

            {/* Mobile Device Frame Toggle */}
            <button
              onClick={() => setIsMobileFrameMode(!isMobileFrameMode)}
              className={`p-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                isMobileFrameMode
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
              title="Toggle Phone Simulator View"
            >
              {isMobileFrameMode ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
              <span className="hidden sm:inline">
                {isMobileFrameMode ? 'Full View' : 'Phone Frame'}
              </span>
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative p-2.5 text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs animate-scale">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Profile / Login */}
            {isAuthenticated && user ? (
              <button
                onClick={() => setCurrentView('profile')}
                className={`flex items-center gap-2 p-1 pl-2.5 rounded-xl border transition-all ${
                  currentView === 'profile'
                    ? 'border-indigo-600 bg-indigo-50/50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className="text-xs font-bold text-slate-800 hidden sm:inline capitalize">
                  {user.name?.firstname || user.username}
                </span>
                <img
                  src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250"}
                  alt={user.username}
                  className="w-7 h-7 rounded-lg object-cover"
                />
              </button>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-3.5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search Input (Visible on small screens) */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={handleSearchChange}
              placeholder="Search products by title..."
              className="w-full pl-10 pr-9 py-2 text-xs bg-slate-100/80 border border-slate-200/80 rounded-xl focus:bg-white focus:border-indigo-500 focus:outline-none"
            />
            {filters.searchQuery && (
              <button
                onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Categories Bar */}
        <div className="py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar border-t border-slate-100 text-xs">
          <button
            onClick={() => handleCategorySelect('all')}
            className={`px-3 py-1.5 rounded-full font-semibold transition-all whitespace-nowrap capitalize ${
              filters.category === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            All Products
          </button>

          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`px-3 py-1.5 rounded-full font-semibold transition-all whitespace-nowrap capitalize ${
                filters.category === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
