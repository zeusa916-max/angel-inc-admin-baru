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
    categoryName: 'PARFUME',
    price: 299000,
    discountPrice: null,
    description: 'Parfum mewah berkarakter lembut dengan sentuhan vanila surgawi, amber hangat, dan white floral. Dirancang untuk menemani momen paling berharga Anda sepanjang hari.',
    badge: 'Best Seller',
    stock: 24,
  },
  {
    id: 'prod-bm-01',
    name: 'Dear You Body Mist',
    category: 'fragrance',
    categoryName: 'BODY MIST',
    price: 129000,
    discountPrice: null,
    description: 'Body mist menyegarkan dengan paduan aroma buah pir segar dan kelopak mawar pagi hari. Ringan, lembut, dan cocok untuk disemprotkan setiap saat.',
    badge: 'Popular',
    stock: 45,
  },
  {
    id: 'prod-bw-01',
    name: 'Fragrance Body Wash',
    category: 'beauty',
    categoryName: 'BODY WASH',
    price: 99000,
    discountPrice: null,
    description: 'Sabun mandi dengan formula busa melimpah dan aroma wewangian mewah tahan lama. Membersihkan kulit secara menyeluruh tanpa membuatnya kering.',
    stock: 30,
  },
  {
    id: 'prod-bs-01',
    name: 'Angel Inc. Body Scrub',
    category: 'beauty',
    categoryName: 'BODY SCRUB',
    price: 109000,
    discountPrice: null,
    description: 'Scrub tubuh dengan butiran mikro halus yang mengangkat sel kulit mati dengan lembut, diperkaya ekstrak minyak jojoba untuk kulit cerah dan sehalus sutra.',
    stock: 20,
  },
  {
    id: 'prod-tee-01',
    name: 'Angel Essential Tee',
    category: 'fashion',
    categoryName: 'BAJU',
    price: 179000,
    discountPrice: null,
    description: 'Kaos berbahan 100% combed cotton premium dengan potongan santai khas Angel Inc. Halus, adem, dan menyerap keringat dengan sempurna.',
    badge: 'Essential',
    stock: 50,
  },
  {
    id: 'prod-jkt-01',
    name: 'Angel Inc. Jacket',
    category: 'fashion',
    categoryName: 'JAKET',
    price: 399000,
    discountPrice: 349000,
    description: 'Jaket kasual kontemporer dengan material tahan angin bertekstur matte dan detail monogram eksklusif. Pilihan tepat untuk gaya streetwear elegan.',
    badge: 'Trending',
    stock: 15,
  },
  {
    id: 'prod-snk-01',
    name: 'Angel Daily Sneakers',
    category: 'footwear',
    categoryName: 'SEPATU',
    price: 499000,
    discountPrice: null,
    description: 'Sneakers putih minimalis dengan insole ultra-cushioned yang sangat nyaman untuk pemakaian seharian. Paduan sempurna antara estetika dan kenyamanan.',
    badge: 'New',
    stock: 12,
  },
  {
    id: 'prod-bm-02',
    name: 'Velvet Bloom',
    category: 'fragrance',
    categoryName: 'BODY MIST',
    price: 129000,
    discountPrice: null,
    description: 'Aroma manis nan menggoda dari berry liar, kelopak peony merah muda, dan sentuhan kayu cashmere yang memikat.',
    stock: 35,
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
