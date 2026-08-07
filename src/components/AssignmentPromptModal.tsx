import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Copy, Check, Sparkles, Code2, FolderTree, Cpu, Terminal, BookOpen, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AssignmentPromptModal: React.FC = () => {
  const { isAssignmentModalOpen, setIsAssignmentModalOpen, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'prompt' | 'architecture' | 'snippets'>('prompt');
  const [copied, setCopied] = useState(false);
  const [selectedSnippet, setSelectedSnippet] = useState<'riverpod' | 'api' | 'model'>('riverpod');

  if (!isAssignmentModalOpen) return null;

  const MASTER_PROMPT = `Act as a Senior Lead Flutter Mobile Engineer. Build a production-ready, clean-architecture Flutter E-Commerce Application that completely satisfies the following assessment requirements using the Fake Store API (https://fakestoreapi.com).

### 🎯 KEY REQUIREMENTS
1. **Architecture & State Management**: Clean Architecture (Data, Domain, Presentation layers) using Riverpod (StateNotifier / AsyncNotifier) or Flutter BLoC.
2. **User Authentication**:
   - Live POST request to \`https://fakestoreapi.com/auth/login\`
   - Store JWT auth token and user profile locally using \`shared_preferences\` or \`flutter_secure_storage\`.
   - Provide 1-click demo login buttons (\`mor_2314\` / \`83r5^_\` or \`johnd\` / \`m38rmF$\`).
3. **Product Catalog & Category Filtering**:
   - Fetch products from \`GET /products\` and categories from \`GET /products/categories\`.
   - Filter catalog by category (\`GET /products/category/:category\`).
4. **Search & Debouncing**: Real-time product search with debouncing by title and description.
5. **Product Detail Screen**: Full specs, star ratings, stock indicator, price, quantity selector, and "Add to Cart".
6. **Cart & Local Persistence**:
   - Add/Remove/Quantity management.
   - Persist cart items locally using \`shared_preferences\` or \`hive\` so state survives app restart.
   - Price calculation (Subtotal, Tax, Promo Code discount, Total).
7. **User Profile**: Fetch profile via \`GET /users/1\`. Display name, email, avatar, phone, and address details.
8. **Loading, Empty & Error States**:
   - Shimmer loading skeletons.
   - Error banners with retry buttons.
   - Empty cart & empty search screens with call-to-actions.

---

### 📂 PROJECT DIRECTORY STRUCTURE
\`\`\`text
lib/
├── main.dart
├── core/
│   ├── network/
│   │   ├── api_client.dart (Dio instance with interceptors)
│   │   └── api_endpoints.dart
│   ├── theme/
│   │   └── app_theme.dart
│   └── utils/
│       └── local_storage.dart (SharedPreferences helper)
└── features/
    ├── auth/
    │   ├── data/ (AuthRepository, AuthRemoteDataSource)
    │   ├── domain/ (UserModel, AuthToken)
    │   └── presentation/ (LoginScreen, AuthController)
    ├── products/
    │   ├── data/ (ProductRepository)
    │   ├── domain/ (ProductModel)
    │   └── presentation/ (ProductListScreen, ProductDetailScreen)
    ├── cart/
    │   ├── data/ (CartLocalDataSource)
    │   ├── domain/ (CartItem)
    │   └── presentation/ (CartScreen, CartNotifier)
    └── profile/
        └── presentation/ (ProfileScreen)
\`\`\`

Provide the complete Flutter code implementations with null safety, error handling, and clean UI components.`;

  const CODE_SNIPPETS = {
    riverpod: `// lib/features/cart/presentation/cart_notifier.dart
import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../domain/cart_item.dart';

class CartState {
  final List<CartItem> items;
  final String? promoCode;
  final double discountPercent;

  CartState({required this.items, this.promoCode, this.discountPercent = 0.0});

  double get subtotal => items.fold(0, (sum, i) => sum + (i.product.price * i.quantity));
  double get total => subtotal * (1 - (discountPercent / 100));
}

class CartNotifier extends StateNotifier<CartState> {
  static const _key = 'cart_items_storage';

  CartNotifier() : super(CartState(items: [])) {
    _loadFromLocal();
  }

  Future<void> _loadFromLocal() async {
    final prefs = await SharedPreferences.getInstance();
    final jsonStr = prefs.getString(_key);
    if (jsonStr != null) {
      final List decoded = jsonDecode(jsonStr);
      state = CartState(items: decoded.map((e) => CartItem.fromJson(e)).toList());
    }
  }

  Future<void> _saveToLocal() async {
    final prefs = await SharedPreferences.getInstance();
    final encoded = jsonEncode(state.items.map((e) => e.toJson()).toList());
    await prefs.setString(_key, encoded);
  }

  void addToCart(Product product, [int qty = 1]) {
    final existingIndex = state.items.indexWhere((i) => i.product.id == product.id);
    List<CartItem> updated = List.from(state.items);
    if (existingIndex >= 0) {
      final old = updated[existingIndex];
      updated[existingIndex] = CartItem(product: product, quantity: old.quantity + qty);
    } else {
      updated.add(CartItem(product: product, quantity: qty));
    }
    state = CartState(items: updated, promoCode: state.promoCode, discountPercent: state.discountPercent);
    _saveToLocal();
  }
}

final cartProvider = StateNotifierProvider<CartNotifier, CartState>((ref) => CartNotifier());`,

    api: `// lib/core/network/api_client.dart
import 'package:dio/dio.dart';

class ApiClient {
  final Dio dio = Dio(
    BaseOptions(
      baseUrl: 'https://fakestoreapi.com',
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
      headers: {'Content-Type': 'application/json'},
    ),
  );

  ApiClient() {
    dio.interceptors.add(LogInterceptor(responseBody: true, requestBody: true));
  }

  Future<Response> getProducts() => dio.get('/products');
  Future<Response> getCategories() => dio.get('/products/categories');
  Future<Response> getCategoryProducts(String category) => dio.get('/products/category/\$category');
  Future<Response> login(String username, String password) => dio.post('/auth/login', data: {
    'username': username,
    'password': password,
  });
}`,

    model: `// lib/features/products/domain/product_model.dart
class ProductModel {
  final int id;
  final String title;
  final double price;
  final String description;
  final String category;
  final String image;
  final double ratingRate;
  final int ratingCount;

  ProductModel({
    required this.id,
    required this.title,
    required this.price,
    required this.description,
    required this.category,
    required this.image,
    required this.ratingRate,
    required this.ratingCount,
  });

  factory ProductModel.fromJson(Map<String, dynamic> json) {
    return ProductModel(
      id: json['id'] as int,
      title: json['title'] as String,
      price: (json['price'] as num).toDouble(),
      description: json['description'] as String,
      category: json['category'] as String,
      image: json['image'] as String,
      ratingRate: (json['rating']['rate'] as num).toDouble(),
      ratingCount: json['rating']['count'] as int,
    );
  }
}`
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(MASTER_PROMPT);
    setCopied(true);
    showToast('Master Flutter AI Prompt copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsAssignmentModalOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-slate-950 text-slate-100 rounded-3xl shadow-2xl border border-slate-800 max-w-3xl w-full p-6 sm:p-8 z-10 my-auto overflow-hidden flex flex-col max-h-[90vh]"
        >
          <button
            onClick={() => setIsAssignmentModalOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>Assignment Prompt & Flutter Blueprint</span>
                <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-indigo-500/30">
                  AI Ready
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Master prompt & clean code architecture to solve the Flutter E-Commerce challenge.
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-800 mb-6 text-xs font-semibold gap-4">
            <button
              onClick={() => setActiveTab('prompt')}
              className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
                activeTab === 'prompt'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>Master AI Prompt</span>
            </button>

            <button
              onClick={() => setActiveTab('architecture')}
              className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
                activeTab === 'architecture'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FolderTree className="w-4 h-4" />
              <span>Clean Architecture</span>
            </button>

            <button
              onClick={() => setActiveTab('snippets')}
              className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
                activeTab === 'snippets'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>Flutter Code Generator</span>
            </button>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {activeTab === 'prompt' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-mono">
                    Copy and paste this prompt into Claude, ChatGPT, or Cursor to generate the Flutter app.
                  </span>
                  <button
                    onClick={handleCopyPrompt}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-md active:scale-95"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied Prompt!' : 'Copy Master Prompt'}</span>
                  </button>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-wrap selection:bg-indigo-500 selection:text-white">
                  {MASTER_PROMPT}
                </div>
              </div>
            )}

            {activeTab === 'architecture' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                      <Layers className="w-4 h-4" />
                      <span>1. Presentation Layer</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Flutter Widgets, Controllers, Shimmer Skeletons, Riverpod Notifiers, UI state.
                    </p>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
                      <Cpu className="w-4 h-4" />
                      <span>2. Domain Layer</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Entities (Product, CartItem, User), Repository Interfaces, UseCases.
                    </p>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                      <BookOpen className="w-4 h-4" />
                      <span>3. Data Layer</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Dio HTTP Client, SharedPreferences Local Data Source, Data Models.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                  <h4 className="text-xs font-bold text-slate-300 mb-2">Fake Store REST Endpoints Mapping:</h4>
                  <ul className="text-xs font-mono space-y-1 text-slate-400">
                    <li><strong className="text-emerald-400">POST</strong> /auth/login → User Auth Token</li>
                    <li><strong className="text-sky-400">GET</strong> /products → Full Catalog</li>
                    <li><strong className="text-sky-400">GET</strong> /products/categories → Category list</li>
                    <li><strong className="text-sky-400">GET</strong> /products/category/:cat → Category filter</li>
                    <li><strong className="text-sky-400">GET</strong> /users/1 → Profile & Address data</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'snippets' && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedSnippet('riverpod')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                      selectedSnippet === 'riverpod'
                        ? 'border-indigo-500 bg-indigo-950 text-indigo-300'
                        : 'border-slate-800 bg-slate-900 text-slate-400'
                    }`}
                  >
                    cart_notifier.dart (Riverpod)
                  </button>
                  <button
                    onClick={() => setSelectedSnippet('api')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                      selectedSnippet === 'api'
                        ? 'border-indigo-500 bg-indigo-950 text-indigo-300'
                        : 'border-slate-800 bg-slate-900 text-slate-400'
                    }`}
                  >
                    api_client.dart (Dio)
                  </button>
                  <button
                    onClick={() => setSelectedSnippet('model')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                      selectedSnippet === 'model'
                        ? 'border-indigo-500 bg-indigo-950 text-indigo-300'
                        : 'border-slate-800 bg-slate-900 text-slate-400'
                    }`}
                  >
                    product_model.dart
                  </button>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-slate-300 overflow-x-auto">
                  <pre>{CODE_SNIPPETS[selectedSnippet]}</pre>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
