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
