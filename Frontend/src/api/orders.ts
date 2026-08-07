import { apiFetch } from './api';

export interface OrderItemInput {
  variant_id: number;
  quantity: number;
}

export interface OrderRequest {
  customer_name: string;
  phone: string;
  email?: string;
  notes?: string;
  items: OrderItemInput[];
}

export interface OrderResponse {
  success: boolean;
  message: string;
  data: {
    order_id: number;
  };
}

export async function submitOrder(orderData: OrderRequest): Promise<OrderResponse> {
  // We use our existing custom fetch wrapper to POST the order
  const response = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export interface AdminOrderItem {
  id: number;
  quantity: number;
  price_at_order: number;
  variant_name: string;
  product_name: string;
}

export interface AdminOrder {
  id: number;
  customer_name: string;
  phone: string;
  email: string | null;
  notes: string | null;
  status: OrderStatus;
  created_at: string;
  items_count?: number; // Only returned from list endpoint
  items?: AdminOrderItem[]; // Only returned from detail endpoint
}

async function adminOrderRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
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

export async function fetchAdminOrders(): Promise<AdminOrder[]> {
  const response = await adminOrderRequest<{ success: boolean; count: number; data: AdminOrder[] }>('/orders?admin=true');
  return response.data;
}

export async function fetchAdminOrder(id: number): Promise<AdminOrder> {
  const response = await adminOrderRequest<{ success: boolean; data: AdminOrder }>(`/orders/${id}`);
  return response.data;
}

export async function updateOrderStatus(id: number, status: OrderStatus): Promise<{ message: string }> {
  const response = await adminOrderRequest<{ success: boolean; message: string }>(`/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
  return response;
}
