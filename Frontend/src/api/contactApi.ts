import { ContactMessage } from "../types";
import { apiFetch } from "./api";

export async function submitContactMessage(data: {
  name: string;
  email: string;
  phone?: string;
  businessType?: string;
  message: string;
}): Promise<ContactMessage> {
  return apiFetch<ContactMessage>('/messages', {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function fetchAdminMessages(token: string): Promise<ContactMessage[]> {
  return apiFetch<ContactMessage[]>('/messages', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function updateAdminMessageStatus(
  id: number,
  status: "Unread" | "Read" | "Archived",
  token: string
): Promise<ContactMessage> {
  return apiFetch<ContactMessage>(`/messages/${id}/status`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
}
