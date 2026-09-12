import { apiFetch } from './api';

export interface AdminVariant {
  id: number;
  product_id: number;
  product_name?: string;
  variant_name: string;
  price: number;
  stock_quantity: number;
  is_active: boolean;
  order_count?: number;
}

export interface VariantInput {
  product_id: number;
  variant_name: string;
  price: number;
  stock_quantity: number;
  is_active: boolean;
}

export async function fetchAdminVariants(): Promise<AdminVariant[]> {
  const response = await apiFetch<{ success: boolean; data: AdminVariant[] }>('/variants?admin=true');
  return response.data;
}

export async function createVariant(variant: VariantInput): Promise<AdminVariant> {
  const response = await apiFetch<{ success: boolean; data: AdminVariant }>('/variants', {
    method: 'POST',
    body: JSON.stringify(variant),
  });

  return response.data;
}

export async function updateVariant(id: number, variant: VariantInput): Promise<AdminVariant> {
  const response = await apiFetch<{ success: boolean; data: AdminVariant }>(`/variants/${id}`, {
    method: 'PUT',
    body: JSON.stringify(variant),
  });

  return response.data;
}

export async function updateVariantStatus(id: number, is_active: boolean): Promise<AdminVariant> {
  const response = await apiFetch<{ success: boolean; data: AdminVariant }>(`/variants/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ is_active }),
  });

  return response.data;
}

export async function deleteVariant(id: number): Promise<{ message: string }> {
  return apiFetch<{ success: boolean; message: string }>(`/variants/${id}`, {
    method: 'DELETE',
  });
}
