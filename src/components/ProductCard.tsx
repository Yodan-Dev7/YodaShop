import React from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { Star, ShoppingBag, Heart, Eye } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, favorites, toggleFavorite, setSelectedProduct } = useApp();
  const isFav = favorites.includes(product.id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden relative"
    >
      {/* Category Badge & Favorite Button */}
      <div className="relative p-4 bg-gradient-to-b from-slate-50/50 to-white aspect-square flex items-center justify-center overflow-hidden">
        <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider z-10 capitalize">
          {product.category}
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full z-10 backdrop-blur-md transition-transform active:scale-90 ${
            isFav
              ? 'bg-rose-50 text-rose-600 border border-rose-200/60 shadow-xs'
              : 'bg-white/80 text-slate-400 hover:text-slate-700 hover:bg-white border border-slate-200/50'
          }`}
          title={isFav ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Product Image */}
        <img
          src={product.image}
          alt={product.title}
          className="max-h-40 max-w-[80%] object-contain group-hover:scale-105 transition-transform duration-300 ease-out py-2"
          loading="lazy"
        />

        {/* Quick View Hover Overlay */}
        <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 pointer-events-none group-hover:pointer-events-auto">
          <button
            onClick={() => setSelectedProduct(product)}
            className="bg-white text-slate-900 font-medium text-xs px-3.5 py-2 rounded-xl shadow-md flex items-center gap-1.5 hover:bg-slate-900 hover:text-white transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            Quick View
          </button>
        </div>
      </div>

      {/* Product Content Info */}
      <div className="p-4 flex flex-col flex-grow justify-between gap-3 border-t border-slate-100">
        <div>
          <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold mb-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{product.rating?.rate ?? 4.5}</span>
            <span className="text-slate-400 font-normal">({product.rating?.count ?? 100})</span>
          </div>

          <h3
            onClick={() => setSelectedProduct(product)}
            className="font-medium text-slate-800 text-sm line-clamp-2 hover:text-indigo-600 transition-colors cursor-pointer leading-snug"
            title={product.title}
          >
            {product.title}
          </h3>
        </div>

        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100/60 mt-auto">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Price</span>
            <span className="text-lg font-bold text-slate-900">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            className="bg-slate-900 hover:bg-indigo-600 text-white p-2.5 rounded-xl shadow-xs hover:shadow-md transition-all duration-200 active:scale-95 flex items-center gap-1.5 text-xs font-semibold px-3"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
