import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { AdminVariant, VariantInput, fetchAdminVariants, createVariant, updateVariant, deleteVariant } from '../../api/variants';
import { AdminProduct, fetchAdminProducts } from '../../api/products';

export function AdminVariantsPage() {
  const [variants, setVariants] = useState<AdminVariant[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<AdminVariant | null>(null);

  // Form State
  const [formData, setFormData] = useState<VariantInput>({
    product_id: 0,
    variant_name: '',
    price: 0,
    stock_quantity: 0,
    is_active: true,
  });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [fetchedVariants, fetchedProducts] = await Promise.all([
        fetchAdminVariants(),
        fetchAdminProducts(),
      ]);
      setVariants(fetchedVariants);
      setProducts(fetchedProducts);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (variant?: AdminVariant) => {
    if (variant) {
      setEditingVariant(variant);
      setFormData({
        product_id: variant.product_id,
        variant_name: variant.variant_name,
        price: variant.price,
        stock_quantity: variant.stock_quantity,
        is_active: variant.is_active,
      });
    } else {
      setEditingVariant(null);
      setFormData({
        product_id: products.length > 0 ? products[0].id : 0,
        variant_name: '',
        price: 0,
        stock_quantity: 0,
        is_active: true,
      });
    }
    setFormError('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingVariant(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.product_id) {
      setFormError('Please select a product');
      return;
    }
    if (!formData.variant_name.trim()) {
      setFormError('Variant name is required');
      return;
    }
    if (formData.price < 0) {
      setFormError('Price cannot be negative');
      return;
    }
    if (formData.stock_quantity < 0) {
      setFormError('Stock quantity cannot be negative');
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingVariant) {
        await updateVariant(editingVariant.id, formData);
        setSuccess('Variant updated successfully');
      } else {
        await createVariant(formData);
        setSuccess('Variant created successfully');
      }
      
      handleCloseModal();
      loadData();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save variant');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this variant?')) {
      return;
    }

    try {
      await deleteVariant(id);
      setSuccess('Variant deleted successfully');
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete variant');
    }
  };

  if (loading && variants.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm font-medium text-[#7C6B73]">Loading variants...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#2D1424]">Product Variants</h2>
          <p className="mt-1 text-sm text-[#7C6B73]">Manage your product variants, pricing, and inventory.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 rounded-md bg-[#2D1424] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#3A1A2E]"
        >
          <Plus size={16} />
          Add Variant
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-md bg-green-50 p-4 text-sm text-green-700">
          {success}
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-[#E4DAD2] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#E4DAD2] bg-[#F7F3EE] text-[#5F4E58]">
              <tr>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Variant Name</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4DAD2]">
              {variants.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-[#7C6B73]">
                    No variants found. Click "Add Variant" to create one.
                  </td>
                </tr>
              ) : (
                variants.map((variant) => {
                  const productName = variant.product_name || products.find(p => p.id === variant.product_id)?.name || 'Unknown Product';
                  
                  return (
                    <tr key={variant.id} className="transition hover:bg-[#FDFBF9]">
                      <td className="px-6 py-4 font-medium text-[#2D1424]">{productName}</td>
                      <td className="px-6 py-4">{variant.variant_name}</td>
                      <td className="px-6 py-4">${Number(variant.price).toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${variant.stock_quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {variant.stock_quantity} in stock
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            variant.is_active
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {variant.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenModal(variant)}
                            className="rounded-md p-2 text-[#7C6B73] transition hover:bg-[#F1EAE4] hover:text-[#2D1424]"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(variant.id)}
                            className="rounded-md p-2 text-[#7C6B73] transition hover:bg-red-50 hover:text-red-600"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold">
              {editingVariant ? 'Edit Variant' : 'Add New Variant'}
            </h3>

            {formError && (
              <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
                {formError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-[#5F4E58]">
                  Product
                </label>
                <select
                  value={formData.product_id}
                  onChange={(e) => setFormData({ ...formData, product_id: Number(e.target.value) })}
                  className="w-full rounded-md border border-[#D8CCC4] px-3 py-2 text-sm focus:border-[#2D1424] focus:outline-none focus:ring-1 focus:ring-[#2D1424]"
                  required
                >
                  <option value={0} disabled>Select a product</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-[#5F4E58]">
                  Variant Name
                </label>
                <input
                  type="text"
                  value={formData.variant_name}
                  onChange={(e) => setFormData({ ...formData, variant_name: e.target.value })}
                  className="w-full rounded-md border border-[#D8CCC4] px-3 py-2 text-sm focus:border-[#2D1424] focus:outline-none focus:ring-1 focus:ring-[#2D1424]"
                  placeholder="e.g. 50ml, Red, Large"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-[#5F4E58]">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full rounded-md border border-[#D8CCC4] px-3 py-2 text-sm focus:border-[#2D1424] focus:outline-none focus:ring-1 focus:ring-[#2D1424]"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[#5F4E58]">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({ ...formData, stock_quantity: Number(e.target.value) })}
                    className="w-full rounded-md border border-[#D8CCC4] px-3 py-2 text-sm focus:border-[#2D1424] focus:outline-none focus:ring-1 focus:ring-[#2D1424]"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="h-4 w-4 rounded border-[#D8CCC4] text-[#2D1424] focus:ring-[#2D1424]"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-[#5F4E58]">
                  Active (Visible to customers)
                </label>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="rounded-md px-4 py-2 text-sm font-medium text-[#5F4E58] transition hover:bg-[#F1EAE4]"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-md bg-[#2D1424] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#3A1A2E] disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Variant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
