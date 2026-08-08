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
  return apiFetch<OrderResponse>('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
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

export async function fetchAdminOrders(): Promise<AdminOrder[]> {
  const response = await apiFetch<{ success: boolean; count: number; data: AdminOrder[] }>('/orders?admin=true');
  return response.data;
}

export async function fetchAdminOrder(id: number): Promise<AdminOrder> {
  const response = await apiFetch<{ success: boolean; data: AdminOrder }>(`/orders/${id}`);
  return response.data;
}

export async function updateOrderStatus(id: number, status: OrderStatus): Promise<{ message: string }> {
  const response = await apiFetch<{ success: boolean; message: string }>(`/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
  return response;
}
