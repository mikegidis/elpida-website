import { apiFetch } from './api';

export interface Settings {
    id?: number;
    site_name: string;
    site_description: string;
    contact_email: string;
    phone: string;
    whatsapp: string;
    address: string;
    currency: string;
    orders_enabled: boolean;
    facebook_url: string;
    instagram_url: string;
    whatsapp_url: string;
    logo_url: string;
    favicon_url: string;
    updated_at?: string;
}

export const getSettings = (): Promise<Settings> => {
    return apiFetch<Settings>('/settings');
};

export const updateSettings = (data: Partial<Settings>): Promise<{ message: string; settings: Settings }> => {
    return apiFetch<{ message: string; settings: Settings }>('/settings', {
        method: 'PUT',
        body: JSON.stringify(data),
    });
};
