import { apiFetch } from './api';

export interface ApiCategory {
  id: number;
  name: string;
  description: string;
}

export async function fetchCategories(): Promise<ApiCategory[]> {
  const response = await apiFetch<ApiCategory[]>('/categories');
  return response;
}
