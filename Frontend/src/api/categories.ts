import { apiFetch } from './api';

export interface ApiCategory {
  id: number;
  name: string;
  description: string;
  status?: string;
  is_active?: boolean;
}

export interface CategoryInput {
  name: string;
  description: string;
}

export async function fetchCategories(): Promise<ApiCategory[]> {
  const response = await apiFetch<ApiCategory[]>('/categories');
  return response;
}

export async function createCategory(category: CategoryInput): Promise<ApiCategory> {
  return apiFetch<ApiCategory>('/categories', {
    method: 'POST',
    body: JSON.stringify(category),
  });
}

export async function updateCategory(id: number, category: CategoryInput): Promise<ApiCategory> {
  return apiFetch<ApiCategory>(`/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(category),
  });
}

export async function deleteCategory(id: number): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/categories/${id}`, {
    method: 'DELETE',
  });
}
