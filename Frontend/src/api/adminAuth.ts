const API_BASE_URL = import.meta.env.VITE_API_URL;

export type AdminUser = {
  username: string;
  role: 'admin';
};

export type AdminLoginResponse = {
  token: string;
  admin: AdminUser;
};

export async function loginAdmin(username: string, password: string): Promise<AdminLoginResponse> {
  const response = await fetch(`${API_BASE_URL}/admin/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error('Invalid username or password');
  }

  return response.json();
}

export async function getCurrentAdmin(token: string): Promise<{ admin: AdminUser }> {
  const response = await fetch(`${API_BASE_URL}/admin/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Admin session is no longer valid');
  }

  return response.json();
}
