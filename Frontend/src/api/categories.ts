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

async function categoryRequest<T>(endpoint: string, options: RequestInit): Promise<T> {
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

export async function createCategory(category: CategoryInput): Promise<ApiCategory> {
  return categoryRequest<ApiCategory>('/categories', {
    method: 'POST',
    body: JSON.stringify(category),
  });
}

export async function updateCategory(id: number, category: CategoryInput): Promise<ApiCategory> {
  return categoryRequest<ApiCategory>(`/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(category),
  });
}

export async function deleteCategory(id: number): Promise<{ message: string }> {
  return categoryRequest<{ message: string }>(`/categories/${id}`, {
    method: 'DELETE',
  });
}
