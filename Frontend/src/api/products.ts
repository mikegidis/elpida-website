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
  is_active?: boolean;
  category: ApiCategory;
  variants: ApiVariant[];
}

interface ApiProductsResponse {
  success: boolean;
  count: number;
  data: ApiProduct[];
}

export interface AdminProduct {
  id: number;
  name: string;
  description: string;
  image_url: string | null;
  is_active: boolean;
  category: ApiCategory;
}

export interface ProductInput {
  name: string;
  description: string;
  category_id: number;
  image_url: string;
  is_active: boolean;
}

// The base URL of the backend server (without /api/v1)
// Used to resolve relative image paths like /uploads/products/...
const BACKEND_BASE_URL = import.meta.env.VITE_API_URL.replace(/\/api\/v1\/?$/, '');

// Converts a relative upload path to a full URL, or returns external URLs as-is
function resolveImageUrl(imageUrl: string | null): string {
  if (!imageUrl) return '';
  if (imageUrl.startsWith('/uploads/')) {
    return `${BACKEND_BASE_URL}${imageUrl}`;
  }
  return imageUrl;
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
    categoryId: apiProduct.category.id,
    price: basePrice,
    rating: 0,
    reviewsCount: 0,
    description: apiProduct.description,
    image: resolveImageUrl(apiProduct.image_url),
    sizes: sizes.length > 0 ? sizes : [{ label: 'Standard', priceModifier: 0 }],
  };
}

export async function fetchProducts(): Promise<Product[]> {
  const response = await apiFetch<ApiProductsResponse>('/products');
  return response.data.map(mapApiProductToProduct);
}

export async function fetchAdminProducts(): Promise<AdminProduct[]> {
  const response = await apiFetch<{ success: boolean; count: number; data: AdminProduct[] }>('/products?admin=true');
  return response.data;
}

export async function createProduct(product: ProductInput): Promise<AdminProduct> {
  const response = await apiFetch<{ success: boolean; data: AdminProduct }>('/products', {
    method: 'POST',
    body: JSON.stringify(product),
  });

  return response.data;
}

export async function updateProduct(id: number, product: ProductInput): Promise<AdminProduct> {
  const response = await apiFetch<{ success: boolean; data: AdminProduct }>(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(product),
  });

  return response.data;
}

export async function deleteProduct(id: number): Promise<{ message: string }> {
  return apiFetch<{ success: boolean; message: string }>(`/products/${id}`, {
    method: 'DELETE',
  });
}

// Upload a product image file and return the saved path (e.g. /uploads/products/abc.jpg)
export async function uploadProductImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);

  const result = await apiFetch<{ success: boolean; data: { url: string } }>('/uploads', {
    method: 'POST',
    body: formData,
  });
  
  return result.data.url;
}

export { resolveImageUrl };
