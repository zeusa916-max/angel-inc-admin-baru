'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/toast';

export interface StorefrontProduct {
  id: string;
  name: string;
  category: string; // 'fragrance' | 'beauty' | 'fashion' | 'footwear'
  categoryName: string; // 'PARFUME', 'BODY MIST', 'BODY WASH', etc.
  price: number;
  discountPrice?: number | null;
  description: string;
  badge?: string;
  stock?: number;
  imageUrl?: string;
}

export interface CartItem {
  product: StorefrontProduct;
  quantity: number;
}

interface StorefrontContextType {
  cart: CartItem[];
  addToCart: (product: StorefrontProduct, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  wishlist: string[];
  toggleWishlist: (productId: string) => void;

  quickViewProduct: StorefrontProduct | null;
  openQuickView: (product: StorefrontProduct) => void;
  closeQuickView: () => void;

  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const StorefrontContext = createContext<StorefrontContextType | undefined>(undefined);

export const DEFAULT_STORE_PRODUCTS: StorefrontProduct[] = [
  {
    id: 'prod-sig-01',
    name: 'Angel Inc. Signature',
    category: 'fragrance',
    categoryName: 'EAU DE PARFUM',
    price: 299000,
    discountPrice: null,
    description: 'A profound olfactory encounter composed of celestial Madagascar vanilla, warm golden amber, and night-blooming white florals. Formulated to become your indelible personal signature.',
    badge: 'Couture Icon',
    stock: 24,
    imageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'prod-bm-01',
    name: 'Dear You Body Mist',
    category: 'fragrance',
    categoryName: 'BODY MIST',
    price: 129000,
    discountPrice: null,
    description: 'An exhilarating morning mist blending crisp Anjou pear with dewy rose petals. Effortless, airy, and designed for spontaneous reapplications throughout the day.',
    badge: 'Trending',
    stock: 45,
    imageUrl: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'prod-bw-01',
    name: 'Fragrance Body Wash',
    category: 'beauty',
    categoryName: 'BODY CARE',
    price: 99000,
    discountPrice: null,
    description: 'A silky foaming wash infused with concentrated botanical extracts and enduring signature fragrance. Cleanses deeply while preserving skin natural moisture barrier.',
    stock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1608248597359-0a2569ac9674?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'prod-bs-01',
    name: 'Angel Inc. Body Scrub',
    category: 'beauty',
    categoryName: 'BODY CARE',
    price: 109000,
    discountPrice: null,
    description: 'An exfoliating polish enriched with micro-refined pumice and cold-pressed jojoba oil to reveal radiant, velvet-smooth skin.',
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'prod-tee-01',
    name: 'Angel Essential Tee',
    category: 'fashion',
    categoryName: 'HAUTE TEE',
    price: 179000,
    discountPrice: null,
    description: 'Crafted from 100% long-staple combed cotton with an architectural, relaxed drape. Exceptionally soft, heavyweight, and breathable.',
    badge: 'Essential',
    stock: 50,
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'prod-jkt-01',
    name: 'Angel Inc. Jacket',
    category: 'fashion',
    categoryName: 'OUTERWEAR',
    price: 399000,
    discountPrice: 349000,
    description: 'A contemporary wind-resistant outerwear piece featuring matte tactile fabrication, custom engraved hardware, and signature monogram detailing.',
    badge: 'Runway Edit',
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'prod-snk-01',
    name: 'Angel Daily Sneakers',
    category: 'footwear',
    categoryName: 'FOOTWEAR',
    price: 499000,
    discountPrice: null,
    description: 'Minimalist monochrome sneakers sculpted with premium calfskin and ultra-cushioned shock-absorbing insoles for effortless all-day poise.',
    badge: 'New Arrival',
    stock: 12,
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'prod-bm-02',
    name: 'Velvet Bloom',
    category: 'fragrance',
    categoryName: 'BODY MIST',
    price: 129000,
    discountPrice: null,
    description: 'An intoxicating floral gourmand bouquet of wild berries, blush peony petals, and warm cashmere woods.',
    stock: 35,
    imageUrl: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=800&auto=format&fit=crop',
  },
];

export function StorefrontProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<StorefrontProduct | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { success } = useToast();

  // Load saved cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('angel_store_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
      const savedWishlist = localStorage.getItem('angel_store_wishlist');
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
    } catch {
      // Ignore
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('angel_store_cart', JSON.stringify(cart));
    } catch {
      // Ignore
    }
  }, [cart]);

  // Save wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('angel_store_wishlist', JSON.stringify(wishlist));
    } catch {
      // Ignore
    }
  }, [wishlist]);

  const addToCart = (product: StorefrontProduct, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });

    success(`"${product.name}" ditambahkan ke keranjang.`, 'Keranjang Belanja');
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      return [...prev, productId];
    });
  };

  const openQuickView = (product: StorefrontProduct) => {
    setQuickViewProduct(product);
  };

  const closeQuickView = () => {
    setQuickViewProduct(null);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce(
    (total, item) =>
      total + (item.product.discountPrice ?? item.product.price) * item.quantity,
    0
  );

  return (
    <StorefrontContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        toggleWishlist,
        quickViewProduct,
        openQuickView,
        closeQuickView,
        isSearchOpen,
        setIsSearchOpen,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </StorefrontContext.Provider>
  );
}

export function useStorefront() {
  const context = useContext(StorefrontContext);
  if (!context) {
    throw new Error('useStorefront must be used within a StorefrontProvider');
  }
  return context;
}
