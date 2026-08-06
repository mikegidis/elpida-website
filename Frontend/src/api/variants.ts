export interface AdminVariant {
  id: number;
  product_id: number;
  product_name?: string;
  variant_name: string;
  price: number;
  stock_quantity: number;
  is_active: boolean;
}

export interface VariantInput {
  product_id: number;
  variant_name: string;
  price: number;
  stock_quantity: number;
  is_active: boolean;
}

async function variantRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('elpida_admin_token');

  const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function fetchAdminVariants(): Promise<AdminVariant[]> {
  const response = await variantRequest<{ success: boolean; data: AdminVariant[] }>('/variants?admin=true');
  return response.data;
}

export async function createVariant(variant: VariantInput): Promise<AdminVariant> {
  const response = await variantRequest<{ success: boolean; data: AdminVariant }>('/variants', {
    method: 'POST',
    body: JSON.stringify(variant),
  });

  return response.data;
}

export async function updateVariant(id: number, variant: VariantInput): Promise<AdminVariant> {
  const response = await variantRequest<{ success: boolean; data: AdminVariant }>(`/variants/${id}`, {
    method: 'PUT',
    body: JSON.stringify(variant),
  });

  return response.data;
}

export async function deleteVariant(id: number): Promise<{ message: string }> {
  return variantRequest<{ success: boolean; message: string }>(`/variants/${id}`, {
    method: 'DELETE',
  });
}
