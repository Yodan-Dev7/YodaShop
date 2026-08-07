import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Star, ShoppingBag, Heart, X, ShieldCheck, Truck, RefreshCw, Minus, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ProductDetailModal: React.FC = () => {
  const { selectedProduct, setSelectedProduct, addToCart, favorites, toggleFavorite, products, setIsCartDrawerOpen } = useApp();
  const [quantity, setQuantity] = useState(1);

  if (!selectedProduct) return null;

  const isFav = favorites.includes(selectedProduct.id);
  const relatedProducts = products
    .filter(p => p.category === selectedProduct.category && p.id !== selectedProduct.id)
    .slice(0, 3);

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity);
  };

  const handleBuyNow = () => {
    addToCart(selectedProduct, quantity);
    setSelectedProduct(null);
    setIsCartDrawerOpen(true);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedProduct(null)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-3xl shadow-2xl border border-slate-200/80 max-w-4xl w-full overflow-hidden z-10 my-auto max-h-[90vh] flex flex-col"
        >
          {/* Close Button */}
          <button
            onClick={() => setSelectedProduct(null)}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-100/80 hover:bg-slate-200 text-slate-500 hover:text-slate-900 z-20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Product Image Stage */}
              <div className="bg-slate-50 rounded-2xl p-8 flex items-center justify-center border border-slate-100 min-h-[300px] relative group">
                <span className="absolute top-4 left-4 bg-slate-900 text-white text-[11px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider capitalize">
                  {selectedProduct.category}
                </span>

                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.title}
                  className="max-h-72 object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Product Details & Actions */}
              <div className="flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <div className="flex items-center gap-1.5 text-amber-500 text-sm font-semibold">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>{selectedProduct.rating?.rate ?? 4.5}</span>
                      <span className="text-slate-400 font-normal">
                        ({selectedProduct.rating?.count ?? 120} verified reviews)
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      In Stock
                    </span>
                  </div>

                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                    {selectedProduct.title}
                  </h1>

                  <div className="mt-3 flex items-baseline gap-3">
                    <span className="text-3xl font-extrabold text-slate-900">
                      ${selectedProduct.price.toFixed(2)}
                    </span>
                    <span className="text-sm text-slate-400 line-through">
                      ${(selectedProduct.price * 1.2).toFixed(2)}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      SAVE 20%
                    </span>
                  </div>

                  <p className="mt-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                    {selectedProduct.description}
                  </p>
                </div>

                {/* Quantity & Cart Actions */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Quantity
                    </span>
                    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 hover:bg-slate-200 transition-colors text-slate-700"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 text-sm font-bold text-slate-800">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-2 hover:bg-slate-200 transition-colors text-slate-700"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-slate-900 hover:bg-indigo-600 text-white font-semibold py-3.5 px-4 rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>

                    <button
                      onClick={handleBuyNow}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 px-5 rounded-xl shadow-md transition-all active:scale-[0.98] text-sm"
                    >
                      Buy Now
                    </button>

                    <button
                      onClick={() => toggleFavorite(selectedProduct.id)}
                      className={`p-3.5 rounded-xl border transition-colors ${
                        isFav
                          ? 'bg-rose-50 border-rose-200 text-rose-600'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                  </div>

                  {/* E-Commerce Guarantee Badges */}
                  <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-slate-500 font-medium">
                    <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <Truck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>Free Express Delivery</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Authentic Guarantee</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <RefreshCw className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>30-Day Easy Returns</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
              <div className="border-t border-slate-100 pt-6">
                <h3 className="text-base font-bold text-slate-800 mb-4">
                  You Might Also Like
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {relatedProducts.map(rel => (
                    <div
                      key={rel.id}
                      onClick={() => {
                        setSelectedProduct(rel);
                        setQuantity(1);
                      }}
                      className="bg-slate-50 hover:bg-slate-100/80 p-3 rounded-2xl border border-slate-100 cursor-pointer transition-all flex items-center gap-3 group"
                    >
                      <img src={rel.image} alt={rel.title} className="w-12 h-12 object-contain shrink-0" />
                      <div className="overflow-hidden">
                        <p className="text-xs font-semibold text-slate-800 truncate group-hover:text-indigo-600">
                          {rel.title}
                        </p>
                        <p className="text-xs font-bold text-slate-900 mt-0.5">
                          ${rel.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
