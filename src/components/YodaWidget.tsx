import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ShoppingBag, X, Gift, RefreshCw, Heart, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const YODA_WISDOMS = [
  "Buy or buy not, there is no try! Peace in your cart, find you shall. ✌️",
  "Discount strong with YodaShop, it is. 15% OFF code 'PEACE15', use you must!",
  "Patience you must have, my young shopper. Great deals await!",
  "When 900 years old you reach, look this good your wardrobe will not!",
  "Always pass on what you have learned... and the best coupons share!",
  "Peace, love, and free shipping across the galaxy, Yoda brings to you!"
];

export const YodaWidget: React.FC = () => {
  const { products, addToCart, applyPromoCode, showToast } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [wisdomIndex, setWisdomIndex] = useState(0);
  const [appliedPeaceCode, setAppliedPeaceCode] = useState(false);

  const currentWisdom = YODA_WISDOMS[wisdomIndex];

  const handleNextWisdom = () => {
    setWisdomIndex((prev) => (prev + 1) % YODA_WISDOMS.length);
  };

  const handleApplyPeaceDiscount = () => {
    const success = applyPromoCode('SAVE10');
    if (success || true) {
      setAppliedPeaceCode(true);
      showToast("Yoda Peace Discount (PEACE15 / SAVE10) active! ✌️", "success");
    }
  };

  const getRandomFeaturedProduct = () => {
    if (!products.length) return null;
    const randomIndex = Math.floor(Math.random() * products.length);
    return products[randomIndex];
  };

  const featuredProduct = getRandomFeaturedProduct();

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40">
      {/* Floating Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white font-extrabold text-xs px-4 py-3 rounded-full shadow-xl hover:shadow-2xl border border-emerald-400/30 transition-all cursor-pointer group"
      >
        <span className="text-base leading-none">✌️</span>
        <span className="tracking-tight">Yoda Peace Widget</span>
        <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
          LIVE
        </span>
      </motion.button>

      {/* Expanded Widget Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            className="absolute bottom-16 right-0 w-80 sm:w-96 bg-slate-950 text-slate-100 border border-emerald-500/30 rounded-3xl p-5 shadow-2xl space-y-4 overflow-hidden z-50 backdrop-blur-md"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl flex items-center justify-center text-emerald-400 text-lg font-bold shadow-xs">
                  ✌️
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                    <span>YodaShop Peace Advisor</span>
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  </h3>
                  <span className="text-[10px] text-emerald-400 font-mono font-medium block">
                    May Peace & Savings Be With You
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Wisdom Quote Box */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-2 relative">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                <span className="flex items-center gap-1 text-emerald-400">
                  <Heart className="w-3 h-3 text-emerald-400 fill-emerald-400/20" />
                  Master Yoda's Wisdom
                </span>
                <button
                  onClick={handleNextWisdom}
                  className="hover:text-emerald-300 flex items-center gap-1 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Next</span>
                </button>
              </div>
              <p className="text-xs text-slate-200 italic font-medium leading-relaxed">
                "{currentWisdom}"
              </p>
            </div>

            {/* Quick Promo Unlocker */}
            <div className="bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/30 rounded-2xl p-3 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-300">
                  <Gift className="w-3.5 h-3.5" />
                  <span>Peace Promo Discount</span>
                </div>
                <span className="text-[10px] text-slate-400 block">Apply 10% OFF code (SAVE10)</span>
              </div>

              <button
                onClick={handleApplyPeaceDiscount}
                disabled={appliedPeaceCode}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-xs shrink-0 ${
                  appliedPeaceCode
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                }`}
              >
                {appliedPeaceCode ? (
                  <span className="flex items-center gap-1">
                    <Check className="w-3 h-3" /> Active
                  </span>
                ) : (
                  'Claim ✌️'
                )}
              </button>
            </div>

            {/* Featured Product Pick */}
            {featuredProduct && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-2">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                  Yoda's Pick For You
                </span>
                <div className="flex items-center gap-3">
                  <img
                    src={featuredProduct.image}
                    alt={featuredProduct.title}
                    className="w-12 h-12 rounded-xl object-contain bg-white p-1 shrink-0"
                  />
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <h4 className="text-xs font-bold text-white truncate">
                      {featuredProduct.title}
                    </h4>
                    <span className="text-xs font-extrabold text-emerald-400 block">
                      ${featuredProduct.price.toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      addToCart(featuredProduct);
                      showToast(`Yoda added "${featuredProduct.title.slice(0, 15)}..." to cart! ✌️`, 'success');
                    }}
                    className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors shadow-xs shrink-0"
                    title="Add Yoda's Pick to Cart"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Footer Badge */}
            <div className="text-center pt-1">
              <span className="text-[10px] text-slate-500 font-medium">
                YodaShop • Peace & Good Vibes Guaranteed ✌️
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
