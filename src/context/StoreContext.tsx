import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Product, CartItem, WishlistItem, NavPage, LeadType, LeadModalConfig } from '../types';

interface StoreContextType {
  cart: CartItem[];
  wishlist: WishlistItem[];
  currentPage: NavPage;
  selectedProduct: Product | null;
  isCartOpen: boolean;
  isMobileMenuOpen: boolean;
  leadModalConfig: LeadModalConfig;
  isPrivacyModalOpen: boolean;
  addToCart: (product: Product, size?: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  setCurrentPage: (page: NavPage) => void;
  setSelectedProduct: (product: Product | null) => void;
  setIsCartOpen: (open: boolean) => void;
  setIsMobileMenuOpen: (open: boolean) => void;
  openLeadModal: (type: LeadType, productName?: string) => void;
  closeLeadModal: () => void;
  setIsPrivacyModalOpen: (open: boolean) => void;
  cartCount: number;
}

const StoreContext = createContext<StoreContextType | null>(null);

const CART_STORAGE_KEY = 'kuzel_cart_items';
const WISHLIST_STORAGE_KEY = 'kuzel_wishlist_items';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial cart safely from localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Load initial wishlist safely from localStorage
  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentPage, setCurrentPage] = useState<NavPage>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [leadModalConfig, setLeadModalConfig] = useState<LeadModalConfig>({
    isOpen: false,
    type: 'callback',
  });

  // Persist cart changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn('Could not save cart to localStorage', e);
    }
  }, [cart]);

  // Persist wishlist changes
  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch (e) {
      console.warn('Could not save wishlist to localStorage', e);
    }
  }, [wishlist]);

  const addToCart = useCallback((product: Product, size?: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id && item.size === size);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1, size: size || 'По меркам' }];
    });
    setIsCartOpen(true);
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(item => item.product.id !== productId));
    } else {
      setCart(prev =>
        prev.map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const toggleWishlist = useCallback((product: Product) => {
    setWishlist(prev => {
      const isIn = prev.some(item => item.product.id === product.id);
      if (isIn) {
        return prev.filter(item => item.product.id !== product.id);
      }
      return [...prev, { product }];
    });
  }, []);

  const isInWishlist = useCallback((productId: string) => {
    return wishlist.some(item => item.product.id === productId);
  }, [wishlist]);

  const openLeadModal = useCallback((type: LeadType, productName?: string) => {
    setLeadModalConfig({
      isOpen: true,
      type,
      productName,
    });
  }, []);

  const closeLeadModal = useCallback(() => {
    setLeadModalConfig(prev => ({ ...prev, isOpen: false }));
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <StoreContext.Provider value={{
      cart,
      wishlist,
      currentPage,
      selectedProduct,
      isCartOpen,
      isMobileMenuOpen,
      leadModalConfig,
      isPrivacyModalOpen,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      toggleWishlist,
      isInWishlist,
      setCurrentPage,
      setSelectedProduct,
      setIsCartOpen,
      setIsMobileMenuOpen,
      openLeadModal,
      closeLeadModal,
      setIsPrivacyModalOpen,
      cartCount,
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
};
