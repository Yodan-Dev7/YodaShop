export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface UserAddress {
  geolocation: {
    lat: string;
    long: string;
  };
  city: string;
  street: string;
  number: number;
  zipcode: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  password?: string;
  name: {
    firstname: string;
    lastname: string;
  };
  address: UserAddress;
  phone: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'Delivered' | 'In Transit' | 'Processing';
  shippingAddress: string;
}

export type ViewMode = 'home' | 'catalog' | 'product_detail' | 'cart' | 'profile' | 'orders';

export interface FilterState {
  category: string;
  searchQuery: string;
  sortBy: 'featured' | 'price_asc' | 'price_desc' | 'rating';
  minPrice: number;
  maxPrice: number;
}
