import { ContactMessage } from "../types";

const API_URL = "http://localhost:5000/api/v1";

export async function submitContactMessage(data: {
  name: string;
  email: string;
  phone?: string;
  businessType?: string;
  message: string;
}): Promise<ContactMessage> {
  const response = await fetch(`${API_URL}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to submit contact message");
  }

  return response.json();
}

export async function fetchAdminMessages(token: string): Promise<ContactMessage[]> {
  const response = await fetch(`${API_URL}/messages`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch contact messages");
  }

  return response.json();
}

export async function updateAdminMessageStatus(
  id: number,
  status: "Unread" | "Read" | "Archived",
  token: string
): Promise<ContactMessage> {
  const response = await fetch(`${API_URL}/messages/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error("Failed to update message status");
  }

  return response.json();
}
