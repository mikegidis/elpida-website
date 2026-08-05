import { apiFetch } from './api';
import { Product, SizeOption } from '../types';

// Types matching the backend JSON exactly
interface ApiVariant {
  id: number;
  variant_name: string;
  price: number;
  stock_quantity: number;
}

interface ApiCategory {
  id: number;
  name: string;
}

interface ApiProduct {
  id: number;
  name: string;
  description: string;
  image_url: string;
  category: ApiCategory;
  variants: ApiVariant[];
}

interface ApiProductsResponse {
  success: boolean;
  count: number;
  data: ApiProduct[];
}

function mapCategoryName(name: string): Product['category'] {
  const normalized = name.toLowerCase().replace(/\s+/g, '');
  if (normalized.includes('fragrance')) return 'fragrances';
  if (normalized.includes('skin')) return 'skincare';
  if (normalized.includes('hair')) return 'haircare';
  if (normalized.includes('cosmetic')) return 'cosmetics';
  return 'skincare';
}

function mapApiProductToProduct(apiProduct: ApiProduct): Product {
  const basePrice = apiProduct.variants.length > 0
    ? apiProduct.variants[0].price
    : 0;

  const sizes: SizeOption[] = apiProduct.variants.map((variant) => ({
    label: variant.variant_name,
    priceModifier: variant.price - basePrice,
    variantId: variant.id,
  }));

  return {
    id: String(apiProduct.id),
    name: apiProduct.name,
    subtitle: apiProduct.category.name,
    category: mapCategoryName(apiProduct.category.name),
    price: basePrice,
    rating: 0,
    reviewsCount: 0,
    description: apiProduct.description,
    image: apiProduct.image_url,
    sizes: sizes.length > 0 ? sizes : [{ label: 'Standard', priceModifier: 0 }],
  };
}

export async function fetchProducts(): Promise<Product[]> {
  const response = await apiFetch<ApiProductsResponse>('/products');
  return response.data.map(mapApiProductToProduct);
}
