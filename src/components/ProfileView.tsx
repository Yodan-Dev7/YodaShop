import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Mail, Phone, MapPin, Package, LogOut, Edit2, Check, Shield, ExternalLink, User as UserIcon } from 'lucide-react';
import { motion } from 'motion/react';

export const ProfileView: React.FC = () => {
  const { user, isAuthenticated, setIsLoginModalOpen, logout, updateProfile, orders } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [firstname, setFirstname] = useState(user?.name?.firstname || '');
  const [lastname, setLastname] = useState(user?.name?.lastname || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-4">
        <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-xs border border-indigo-100">
          <UserIcon className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Sign in to view your profile</h2>
          <p className="text-xs text-slate-500 mt-1">
            Access your orders, saved addresses, and profile information.
          </p>
        </div>
        <button
          onClick={() => setIsLoginModalOpen(true)}
          className="bg-slate-900 hover:bg-indigo-600 text-white font-semibold px-6 py-3 rounded-xl text-xs transition-colors shadow-md"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      email,
      phone,
      name: {
        firstname,
        lastname
      }
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4 sm:p-6">
      {/* Profile Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          <img
            src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250"}
            alt={user.username}
            className="w-24 h-24 rounded-full object-cover border-4 border-white/20 shadow-lg"
          />

          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-bold capitalize">
                {user.name?.firstname} {user.name?.lastname}
              </h1>
              <span className="bg-indigo-500/30 text-indigo-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-indigo-400/30 uppercase tracking-wider">
                API Verified User
              </span>
            </div>

            <p className="text-xs text-indigo-200/80 font-mono">@{user.username}</p>

            <div className="pt-3 flex flex-wrap justify-center sm:justify-start gap-4 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                {user.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-indigo-400" />
                {user.phone}
              </span>
            </div>
          </div>

          <button
            onClick={logout}
            className="bg-white/10 hover:bg-rose-600/80 text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-white/20 transition-all flex items-center gap-1.5 shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Personal Details Card */}
        <div className="md:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-600" />
              <span>Personal Information</span>
            </h3>

            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(false)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
            )}
          </div>

          {!isEditing ? (
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 font-medium block uppercase tracking-wider text-[10px]">First Name</span>
                <span className="font-semibold text-slate-800 text-sm mt-0.5 block">{user.name?.firstname}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block uppercase tracking-wider text-[10px]">Last Name</span>
                <span className="font-semibold text-slate-800 text-sm mt-0.5 block">{user.name?.lastname}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block uppercase tracking-wider text-[10px]">Email</span>
                <span className="font-semibold text-slate-800 text-sm mt-0.5 block">{user.email}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block uppercase tracking-wider text-[10px]">Phone Number</span>
                <span className="font-semibold text-slate-800 text-sm mt-0.5 block">{user.phone}</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={firstname}
                  onChange={e => setFirstname(e.target.value)}
                  placeholder="First name"
                  className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
                <input
                  type="text"
                  value={lastname}
                  onChange={e => setLastname(e.target.value)}
                  placeholder="Last name"
                  className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="Phone"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white font-semibold text-xs px-4 py-2 rounded-xl flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </form>
          )}
        </div>

        {/* Saved Address Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <MapPin className="w-4 h-4 text-indigo-600" />
            <span>Default Address</span>
          </h3>

          <div className="text-xs text-slate-600 space-y-1">
            <p className="font-bold text-slate-900">{user.name?.firstname} {user.name?.lastname}</p>
            <p>{user.address?.number} {user.address?.street}</p>
            <p>{user.address?.city}, {user.address?.zipcode}</p>
            {user.address?.geolocation && (
              <p className="text-[10px] text-slate-400 font-mono pt-1">
                Geo: Lat {user.address.geolocation.lat}, Long {user.address.geolocation.long}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Order History */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-4 h-4 text-indigo-600" />
            <span>Order History ({orders.length})</span>
          </h3>
        </div>

        {orders.length === 0 ? (
          <p className="text-xs text-slate-400 py-4">No order history found yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div
                key={order.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs border-b border-slate-200/60 pb-2">
                  <div>
                    <span className="font-bold text-slate-900">{order.id}</span>
                    <span className="text-slate-400 ml-2">{order.date}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {order.status}
                  </span>
                </div>

                <div className="space-y-1">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <span className="truncate max-w-[280px] text-slate-700">
                        {item.product.title}
                      </span>
                      <span className="font-semibold text-slate-900">
                        x{item.quantity} - ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-200/60 text-xs">
                  <span className="text-slate-500">Shipping to: {order.shippingAddress}</span>
                  <span className="font-extrabold text-indigo-600 text-sm">
                    Total: ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
