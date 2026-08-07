export type Category = 'all' | 'fragrances' | 'skincare' | 'haircare' | 'cosmetics';

export interface Shade {
  id: string;
  name: string;
  colorHex: string;
}

export interface SizeOption {
  label: string;
  priceModifier: number; // e.g. 0 for base, +35 for 100ml
  variantId?: number;    // PostgreSQL variant ID
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: Category;
  categoryId: number;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  isBestseller?: boolean;
  isNew?: boolean;
  description: string;
  image: string;
  secondaryImage?: string;
  sizes: SizeOption[];
  shades?: Shade[];
  fragranceNotes?: {
    top: string[];
    heart: string[];
    base: string[];
  };
  skincareBenefits?: string[];
  ingredients?: string[];
  howToUse?: string;
}

export interface CartItem {
  id: string; // unique item id including shade/size selection
  product: Product;
  selectedSize: SizeOption;
  selectedShade?: Shade;
  quantity: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  subtitle: string;
  options: {
    label: string;
    description: string;
    categoryMatch: Category;
    noteMatch?: string;
  }[];
}

export interface AtelierBoutique {
  city: string;
  address: string;
  phone: string;
  hours: string;
  image: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'Unread' | 'Read' | 'Archived';
  created_at: string;
}
