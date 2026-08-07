import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CheckoutModal } from './CheckoutModal';
import { ShoppingBag, X, Trash2, Plus, Minus, ArrowRight, Tag, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartCount,
    cartSubtotal,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    applyPromoCode,
    discountPercentage,
    promoCode,
    setCurrentView
  } = useApp();

  const [inputCode, setInputCode] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const freeShippingThreshold = 100;
  const progressToFreeShipping = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  const discountAmount = cartSubtotal * (discountPercentage / 100);
  const total = cartSubtotal - discountAmount;

  const handleApplyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode) {
      applyPromoCode(inputCode);
      setInputCode('');
    }
  };

  if (!isCartDrawerOpen) return null;

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartDrawerOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-slate-900 text-white rounded-xl">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 leading-none">Your Cart</h2>
                    <span className="text-xs text-slate-500 font-medium">{cartCount} items</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {cart.length > 0 && (
                    <button
                      onClick={clearCart}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg transition-colors"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    onClick={() => setIsCartDrawerOpen(false)}
                    className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Free Shipping Progress Bar */}
              {cart.length > 0 && (
                <div className="bg-indigo-50/60 border-b border-indigo-100/60 p-3.5 px-5 text-xs">
                  <div className="flex justify-between font-semibold text-indigo-900 mb-1.5">
                    {amountNeededForFreeShipping > 0 ? (
                      <span>Add ${amountNeededForFreeShipping.toFixed(2)} more for <strong>FREE Express Shipping</strong></span>
                    ) : (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        🎉 Unlocked FREE Express Shipping!
                      </span>
                    )}
                  </div>
                  <div className="w-full bg-indigo-200/60 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full transition-all duration-500 rounded-full"
                      style={{ width: `${progressToFreeShipping}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Drawer Items Container */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-16 space-y-4">
                    <div className="w-20 h-20 bg-slate-100 text-slate-300 rounded-full flex items-center justify-center mx-auto">
                      <ShoppingBag className="w-10 h-10" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Your cart is empty</h3>
                      <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                        Looks like you haven't added any products to your cart yet.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setIsCartDrawerOpen(false);
                        setCurrentView('catalog');
                      }}
                      className="bg-slate-900 text-white font-semibold px-5 py-2.5 rounded-xl text-xs hover:bg-indigo-600 transition-colors shadow-xs"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  cart.map(item => (
                    <div
                      key={item.product.id}
                      className="flex gap-3 bg-slate-50/80 p-3 rounded-2xl border border-slate-100/80 relative group"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.title}
                        className="w-16 h-16 object-contain bg-white rounded-xl p-1.5 border border-slate-100 shrink-0"
                      />

                      <div className="flex-1 flex flex-col justify-between overflow-hidden">
                        <div className="pr-6">
                          <h4 className="text-xs font-semibold text-slate-800 truncate" title={item.product.title}>
                            {item.product.title}
                          </h4>
                          <span className="text-[10px] text-slate-400 capitalize">{item.product.category}</span>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs font-bold text-slate-900">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </span>

                          <div className="flex items-center border border-slate-200 rounded-lg bg-white">
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                              className="p-1 hover:bg-slate-100 transition-colors text-slate-600"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2.5 text-xs font-bold text-slate-800">{item.quantity}</span>
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                              className="p-1 hover:bg-slate-100 transition-colors text-slate-600"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="absolute top-2.5 right-2.5 text-slate-400 hover:text-rose-600 p-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer / Checkout */}
              {cart.length > 0 && (
                <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-4">
                  {/* Coupon Code Input */}
                  <form onSubmit={handleApplyCode} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={inputCode}
                        onChange={e => setInputCode(e.target.value)}
                        placeholder="Promo Code (e.g. SAVE10)"
                        className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none uppercase"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-slate-900 hover:bg-indigo-600 text-white font-semibold text-xs px-3.5 py-2 rounded-xl transition-colors"
                    >
                      Apply
                    </button>
                  </form>

                  {/* Summary math */}
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-slate-800">${cartSubtotal.toFixed(2)}</span>
                    </div>

                    {discountPercentage > 0 && (
                      <div className="flex justify-between text-emerald-600 font-semibold">
                        <span>Discount ({promoCode})</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="text-emerald-600 font-semibold">
                        {amountNeededForFreeShipping === 0 ? 'FREE' : '$4.99'}
                      </span>
                    </div>

                    <div className="flex justify-between text-base font-extrabold text-slate-900 border-t border-slate-200/80 pt-2">
                      <span>Total</span>
                      <span className="text-indigo-600">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsCheckoutOpen(true)}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 px-4 rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                    <span>256-Bit Encrypted Secure Checkout</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </AnimatePresence>

      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
    </>
  );
};
