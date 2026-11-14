export interface Product {
  id: string;
  name: string;
  type: string;
  gender: 'female' | 'male' | 'unisex';
  color: string;
  collection: string;
  price: string;
  description: string;
  image: string;
  hoverImage?: string;
  category: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
}

export interface WishlistItem {
  product: Product;
}

export type NavPage = 'home' | 'women' | 'men' | 'collections' | 'about' | 'product';

export type LeadType = 'callback' | 'consultation' | 'feedback';

export interface LeadModalConfig {
  isOpen: boolean;
  type: LeadType;
  productName?: string;
}

export interface OrderFormData {
  customerName: string;
  phone: string;
  city: string;
  address?: string;
  deliveryMethod: string;
  paymentMethod: string;
  comment?: string;
  privacyConsent: boolean;
}
