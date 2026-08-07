import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, User, Order, FilterState, ViewMode } from '../types';
import { fetchProducts, fetchCategories, fetchProductsByCategory, loginUser, fetchUserProfile } from '../services/api';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  // Products & Categories
  products: Product[];
  categories: string[];
  isLoadingProducts: boolean;
  productError: string | null;
  refreshProducts: () => Promise<void>;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;

  // Filters & Views
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateCartQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  promoCode: string;
  setPromoCode: (code: string) => void;
  discountPercentage: number;
  applyPromoCode: (code: string) => boolean;

  // Favorites
  favorites: number[];
  toggleFavorite: (productId: number) => void;

  // User & Auth
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (u: string, p: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updated: Partial<User>) => void;

  // Orders
  orders: Order[];
  createOrder: (shippingAddress: string) => Order;

  // UI States
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  isAssignmentModalOpen: boolean;
  setIsAssignmentModalOpen: (open: boolean) => void;
  isMobileFrameMode: boolean;
  setIsMobileFrameMode: (mobile: boolean) => void;
  
  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const defaultFilters: FilterState = {
  category: 'all',
  searchQuery: '',
  sortBy: 'featured',
  minPrice: 0,
  maxPrice: 1000
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State initialization with localStorage persistence
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);
  const [productError, setProductError] = useState<string | null>(null);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [currentView, setCurrentView] = useState<ViewMode>('home');

  // Cart State with LocalStorage persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem('fakestore_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  const [promoCode, setPromoCode] = useState<string>('');
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);

  // Favorites state
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const savedFavs = localStorage.getItem('fakestore_favs');
      return savedFavs ? JSON.parse(savedFavs) : [];
    } catch {
      return [];
    }
  });

  // Auth State with LocalStorage persistence
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('fakestore_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('fakestore_token');
  });

  // Orders State
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const savedOrders = localStorage.getItem('fakestore_orders');
      return savedOrders ? JSON.parse(savedOrders) : [
        {
          id: 'ORD-98231',
          date: '2026-08-01',
          items: [
            {
              product: {
                id: 1,
                title: "Fjallraven - Foldsack No. 1 Backpack",
                price: 109.95,
                description: "Your everyday carry backpack",
                category: "men's clothing",
                image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
                rating: { rate: 3.9, count: 120 }
              },
              quantity: 1
            }
          ],
          total: 109.95,
          status: 'Delivered',
          shippingAddress: '7835 New Road, Kilkenny'
        }
      ];
    } catch {
      return [];
    }
  });

  // UI Modals & Settings
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [isMobileFrameMode, setIsMobileFrameMode] = useState(false);

  // Toast System
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('fakestore_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('fakestore_favs', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('fakestore_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('fakestore_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('fakestore_token', token);
    } else {
      localStorage.removeItem('fakestore_token');
    }
  }, [token]);

  useEffect(() => {
    localStorage.setItem('fakestore_orders', JSON.stringify(orders));
  }, [orders]);

  // Initial Fetch Products & Categories
  const loadInitialData = async () => {
    setIsLoadingProducts(true);
    setProductError(null);
    try {
      const [prodsData, catsData] = await Promise.all([
        fetchProducts(),
        fetchCategories()
      ]);
      setProducts(prodsData);
      setCategories(catsData);
    } catch (err: any) {
      setProductError(err.message || 'Failed to load products');
      showToast('Error connecting to FakeStore API', 'error');
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const refreshProducts = async () => {
    await loadInitialData();
    showToast('Products refreshed from API', 'success');
  };

  // Category Filtering
  useEffect(() => {
    if (filters.category === 'all') {
      loadInitialData();
    } else {
      setIsLoadingProducts(true);
      fetchProductsByCategory(filters.category)
        .then(data => setProducts(data))
        .catch(err => setProductError(err.message))
        .finally(() => setIsLoadingProducts(false));
    }
  }, [filters.category]);

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  // Cart operations
  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prevCart, { product, quantity }];
    });
    showToast(`Added "${product.title.slice(0, 20)}..." to cart`, 'success');
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const updateCartQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const applyPromoCode = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === 'SAVE10') {
      setDiscountPercentage(10);
      setPromoCode('SAVE10');
      showToast('Promo code SAVE10 applied (10% OFF)', 'success');
      return true;
    } else if (clean === 'FAKESTORE20' || clean === 'DEMO20') {
      setDiscountPercentage(20);
      setPromoCode(clean);
      showToast(`Promo code ${clean} applied (20% OFF)`, 'success');
      return true;
    } else {
      showToast('Invalid promo code. Try SAVE10 or DEMO20', 'error');
      return false;
    }
  };

  // Favorites
  const toggleFavorite = (productId: number) => {
    setFavorites(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from favorites', 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Added to favorites', 'success');
        return [...prev, productId];
      }
    });
  };

  // Auth
  const login = async (u: string, p: string) => {
    try {
      const res = await loginUser(u, p);
      setToken(res.token);
      setUser(res.user);
      setIsLoginModalOpen(false);
      showToast(`Welcome back, ${res.user.name.firstname}!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Login failed', 'error');
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    showToast('Logged out successfully', 'info');
  };

  const updateProfile = (updated: Partial<User>) => {
    if (!user) return;
    const newUser = { ...user, ...updated };
    setUser(newUser);
    showToast('Profile updated', 'success');
  };

  // Orders
  const createOrder = (shippingAddress: string): Order => {
    const totalAfterDiscount = cartSubtotal * (1 - discountPercentage / 100);
    const tax = totalAfterDiscount * 0.08;
    const finalTotal = totalAfterDiscount + tax;

    const newOrder: Order = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString().split('T')[0],
      items: [...cart],
      total: Number(finalTotal.toFixed(2)),
      status: 'Processing',
      shippingAddress: shippingAddress || '7835 New Road, Kilkenny'
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setPromoCode('');
    setDiscountPercentage(0);
    showToast('Order placed successfully!', 'success');
    return newOrder;
  };

  return (
    <AppContext.Provider
      value={{
        products,
        categories,
        isLoadingProducts,
        productError,
        refreshProducts,
        selectedProduct,
        setSelectedProduct,
        filters,
        setFilters,
        resetFilters,
        currentView,
        setCurrentView,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        promoCode,
        setPromoCode,
        discountPercentage,
        applyPromoCode,
        favorites,
        toggleFavorite,
        user,
        token,
        isAuthenticated: !!user && !!token,
        login,
        logout,
        updateProfile,
        orders,
        createOrder,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isLoginModalOpen,
        setIsLoginModalOpen,
        isAssignmentModalOpen,
        setIsAssignmentModalOpen,
        isMobileFrameMode,
        setIsMobileFrameMode,
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
