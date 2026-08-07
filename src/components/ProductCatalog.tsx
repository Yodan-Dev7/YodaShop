import React from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';
import { SlidersHorizontal, RefreshCw, SearchX, ArrowUpDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ProductCatalog: React.FC = () => {
  const {
    products,
    isLoadingProducts,
    productError,
    filters,
    setFilters,
    resetFilters,
    refreshProducts
  } = useApp();

  // Filter & Sort Logic
  const filteredProducts = products.filter(product => {
    // Category match
    if (filters.category !== 'all' && product.category.toLowerCase() !== filters.category.toLowerCase()) {
      return false;
    }

    // Search query match in title or description
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const matchTitle = product.title.toLowerCase().includes(q);
      const matchDesc = product.description.toLowerCase().includes(q);
      const matchCat = product.category.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchCat) return false;
    }

    return true;
  }).sort((a, b) => {
    if (filters.sortBy === 'price_asc') return a.price - b.price;
    if (filters.sortBy === 'price_desc') return b.price - a.price;
    if (filters.sortBy === 'rating') return (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0);
    return a.id - b.id; // default featured
  });

  return (
    <div className="space-y-6">
      {/* Controls & Sort Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 capitalize flex items-center gap-2">
            <span>{filters.category === 'all' ? 'All Products' : filters.category}</span>
            <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
              {filteredProducts.length} items
            </span>
          </h2>
          {filters.searchQuery && (
            <p className="text-xs text-slate-500 mt-0.5">
              Results for "<strong className="text-slate-800">{filters.searchQuery}</strong>"
            </p>
          )}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1.5 text-slate-500">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Sort by:</span>
          </div>
          <select
            value={filters.sortBy}
            onChange={e => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="featured">Featured / Default</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Loading Skeleton Grid State */}
      {isLoadingProducts ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 border border-slate-200 space-y-4 animate-pulse">
              <div className="w-full h-44 bg-slate-100 rounded-xl" />
              <div className="h-4 bg-slate-100 rounded-md w-3/4" />
              <div className="h-3 bg-slate-100 rounded-md w-1/2" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-6 bg-slate-100 rounded-md w-16" />
                <div className="h-8 bg-slate-100 rounded-xl w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : productError ? (
        /* Error State */
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center space-y-4 max-w-md mx-auto my-8">
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-rose-900">Failed to load products</h3>
            <p className="text-xs text-rose-700 mt-1">{productError}</p>
          </div>
          <button
            onClick={refreshProducts}
            className="bg-rose-600 text-white font-semibold text-xs px-4 py-2 rounded-xl hover:bg-rose-700 transition-colors shadow-xs"
          >
            Retry Fetching API
          </button>
        </div>
      ) : filteredProducts.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 my-6">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <SearchX className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">No matching products found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              We couldn't find any products matching your search criteria or category filter.
            </p>
          </div>
          <button
            onClick={resetFilters}
            className="bg-slate-900 text-white font-semibold text-xs px-5 py-2.5 rounded-xl hover:bg-indigo-600 transition-colors shadow-xs"
          >
            Clear Filters & View All
          </button>
        </div>
      ) : (
        /* Products Grid */
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};
