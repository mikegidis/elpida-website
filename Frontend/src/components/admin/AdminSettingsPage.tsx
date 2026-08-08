import React, { useEffect, useState } from 'react';
import { getSettings, updateSettings, Settings } from '../../api/settings';
import { Save, AlertTriangle, CheckCircle2 } from 'lucide-react';

export function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSettings();
      setSettings(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setSettings((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await updateSettings(settings);
      setSuccess(result.message);
      setSettings(result.settings);
    } catch (err: any) {
      setError(err.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-[#7C6B73]">Loading settings...</div>;
  }

  if (!settings) {
    return <div className="p-8 text-center text-red-600">Failed to load settings.</div>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#2D1424]">Store Settings</h2>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-2 rounded-md bg-[#2D1424] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#3A1A2E] disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-md bg-red-50 p-4 text-red-700">
          <AlertTriangle size={18} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="flex items-center gap-2 rounded-md bg-emerald-50 p-4 text-emerald-700">
          <CheckCircle2 size={18} />
          <p className="text-sm font-medium">{success}</p>
        </div>
      )}

      <form className="space-y-8" onSubmit={handleSubmit}>
        {/* General Settings */}
        <section className="rounded-lg border border-[#E4DAD2] bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-[#2D1424]">General</h3>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-[#2D1424]">Site Name</label>
              <input
                type="text"
                name="site_name"
                value={settings.site_name || ''}
                onChange={handleChange}
                maxLength={255}
                className="w-full rounded-md border border-[#D8CCC4] p-2 text-sm outline-none focus:border-[#2D1424]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-[#2D1424]">Site Description</label>
              <textarea
                name="site_description"
                value={settings.site_description || ''}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-md border border-[#D8CCC4] p-2 text-sm outline-none focus:border-[#2D1424]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[#2D1424]">Contact Email</label>
              <input
                type="email"
                name="contact_email"
                value={settings.contact_email || ''}
                onChange={handleChange}
                className="w-full rounded-md border border-[#D8CCC4] p-2 text-sm outline-none focus:border-[#2D1424]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[#2D1424]">Phone</label>
              <input
                type="text"
                name="phone"
                value={settings.phone || ''}
                onChange={handleChange}
                className="w-full rounded-md border border-[#D8CCC4] p-2 text-sm outline-none focus:border-[#2D1424]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[#2D1424]">WhatsApp Number</label>
              <input
                type="text"
                name="whatsapp"
                value={settings.whatsapp || ''}
                onChange={handleChange}
                className="w-full rounded-md border border-[#D8CCC4] p-2 text-sm outline-none focus:border-[#2D1424]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-[#2D1424]">Address</label>
              <textarea
                name="address"
                value={settings.address || ''}
                onChange={handleChange}
                rows={2}
                className="w-full rounded-md border border-[#D8CCC4] p-2 text-sm outline-none focus:border-[#2D1424]"
              />
            </div>
          </div>
        </section>

        {/* Shop Settings */}
        <section className="rounded-lg border border-[#E4DAD2] bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-[#2D1424]">Shop</h3>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-[#2D1424]">Currency</label>
              <input
                type="text"
                name="currency"
                value={settings.currency || ''}
                onChange={handleChange}
                maxLength={10}
                className="w-full rounded-md border border-[#D8CCC4] p-2 text-sm outline-none focus:border-[#2D1424]"
              />
            </div>
            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="orders_enabled"
                name="orders_enabled"
                checked={settings.orders_enabled}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-[#2D1424] focus:ring-[#2D1424]"
              />
              <label htmlFor="orders_enabled" className="text-sm font-medium text-[#2D1424]">
                Enable Ordering (Customers can place orders)
              </label>
            </div>
          </div>
        </section>

        {/* Contact / Social */}
        <section className="rounded-lg border border-[#E4DAD2] bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-[#2D1424]">Contact & Social Links</h3>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-[#2D1424]">Facebook URL</label>
              <input
                type="url"
                name="facebook_url"
                value={settings.facebook_url || ''}
                onChange={handleChange}
                className="w-full rounded-md border border-[#D8CCC4] p-2 text-sm outline-none focus:border-[#2D1424]"
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[#2D1424]">Instagram URL</label>
              <input
                type="url"
                name="instagram_url"
                value={settings.instagram_url || ''}
                onChange={handleChange}
                className="w-full rounded-md border border-[#D8CCC4] p-2 text-sm outline-none focus:border-[#2D1424]"
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[#2D1424]">WhatsApp URL</label>
              <input
                type="url"
                name="whatsapp_url"
                value={settings.whatsapp_url || ''}
                onChange={handleChange}
                className="w-full rounded-md border border-[#D8CCC4] p-2 text-sm outline-none focus:border-[#2D1424]"
                placeholder="https://wa.me/..."
              />
            </div>
          </div>
        </section>

        {/* Branding */}
        <section className="rounded-lg border border-[#E4DAD2] bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-[#2D1424]">Branding</h3>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-[#2D1424]">Logo URL</label>
              <input
                type="url"
                name="logo_url"
                value={settings.logo_url || ''}
                onChange={handleChange}
                className="w-full rounded-md border border-[#D8CCC4] p-2 text-sm outline-none focus:border-[#2D1424]"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[#2D1424]">Favicon URL</label>
              <input
                type="url"
                name="favicon_url"
                value={settings.favicon_url || ''}
                onChange={handleChange}
                className="w-full rounded-md border border-[#D8CCC4] p-2 text-sm outline-none focus:border-[#2D1424]"
                placeholder="https://..."
              />
            </div>
          </div>
        </section>

        <div className="flex justify-end border-t border-[#E4DAD2] pt-6">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-md bg-[#2D1424] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3A1A2E] disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
