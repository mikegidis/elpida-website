import { apiFetch } from './api';

export type AdminUser = {
  username: string;
  role: 'admin';
};

export type AdminLoginResponse = {
  token: string;
  admin: AdminUser;
};

export async function loginAdmin(username: string, password: string): Promise<AdminLoginResponse> {
  return apiFetch<AdminLoginResponse>('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export async function getCurrentAdmin(token: string): Promise<{ admin: AdminUser }> {
  return apiFetch<{ admin: AdminUser }>('/admin/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
