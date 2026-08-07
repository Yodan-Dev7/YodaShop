import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';
import { X, CheckCircle, Truck, CreditCard, MapPin, Building, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { user, cart, cartSubtotal, discountPercentage, createOrder, setIsCartDrawerOpen } = useApp();

  const [step, setStep] = useState<'details' | 'success'>('details');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Address fields
  const [street, setStreet] = useState(user?.address?.street || '7835 New Road');
  const [city, setCity] = useState(user?.address?.city || 'Kilkenny');
  const [zipcode, setZipcode] = useState(user?.address?.zipcode || '12926');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'gpay' | 'cod'>('card');

  if (!isOpen) return null;

  const discountAmount = cartSubtotal * (discountPercentage / 100);
  const totalAfterDiscount = cartSubtotal - discountAmount;
  const tax = totalAfterDiscount * 0.08;
  const finalTotal = totalAfterDiscount + tax;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const fullAddress = `${street}, ${city}, ${zipcode}`;
    const order = createOrder(fullAddress);
    setCreatedOrder(order);
    setStep('success');
    setIsCartDrawerOpen(false);
  };

  const handleFinish = () => {
    setStep('details');
    setCreatedOrder(null);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
        />

        {/* Modal Body */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 sm:p-8 z-10 my-auto overflow-hidden"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {step === 'details' ? (
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-indigo-600" />
                  <span>Checkout & Shipping</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Complete your shipping info to confirm the order.
                </p>
              </div>

              {/* Order Items Preview */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 max-h-36 overflow-y-auto space-y-2">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Order Items ({cart.length})
                </div>
                {cart.map(item => (
                  <div key={item.product.id} className="flex justify-between items-center text-xs">
                    <span className="truncate max-w-[240px] font-medium text-slate-700">
                      {item.product.title}
                    </span>
                    <span className="font-bold text-slate-900 shrink-0">
                      x{item.quantity} - ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Address Form */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                  Shipping Address
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={e => setStreet(e.target.value)}
                    placeholder="Street Address"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      placeholder="City"
                      className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <input
                    type="text"
                    required
                    value={zipcode}
                    onChange={e => setZipcode(e.target.value)}
                    placeholder="Zip code"
                    className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === 'card'
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-xs'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Credit Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('gpay')}
                    className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === 'gpay'
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-xs'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Truck className="w-4 h-4" />
                    <span>Google Pay</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-xs'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Cash on Delivery</span>
                  </button>
                </div>
              </div>

              {/* Cost Summary */}
              <div className="border-t border-slate-100 pt-4 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${cartSubtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount ({discountPercentage}%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-slate-900 border-t border-slate-100 pt-2">
                  <span>Total Amount</span>
                  <span className="text-indigo-600">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-semibold py-3.5 px-4 rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
              >
                <span>Confirm & Place Order</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="text-center py-4 space-y-5">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900">Order Confirmed!</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Order ID: <span className="font-mono font-bold text-slate-800">{createdOrder?.id}</span>
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left text-xs space-y-2">
                <p className="text-slate-600">
                  <strong className="text-slate-800">Delivering to:</strong> {createdOrder?.shippingAddress}
                </p>
                <p className="text-slate-600">
                  <strong className="text-slate-800">Total Paid:</strong> ${createdOrder?.total.toFixed(2)}
                </p>
                <p className="text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                  <Truck className="w-3.5 h-3.5" />
                  Estimated Delivery: 2-3 Business Days
                </p>
              </div>

              <button
                onClick={handleFinish}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-4 rounded-xl transition-all text-sm"
              >
                Back to Shopping
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
