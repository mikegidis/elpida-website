import React, { useEffect, useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, Archive, ArchiveRestore, Search, AlertCircle, ShoppingBag, CheckCircle2 } from 'lucide-react';
import {
  AdminVariant,
  VariantInput,
  fetchAdminVariants,
  createVariant,
  updateVariant,
  updateVariantStatus,
  deleteVariant,
} from '../../api/variants';
import { AdminProduct, fetchAdminProducts } from '../../api/products';

export function AdminVariantsPage() {
  const [variants, setVariants] = useState<AdminVariant[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Filter & Search State
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<number | 'all'>('all');

  // Archive Recommendation Modal State
  const [archiveModalVariant, setArchiveModalVariant] = useState<AdminVariant | null>(null);
  const [isArchiving, setIsArchiving] = useState(false);

  // Edit / Create Modal State
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
      await loadData();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save variant');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (variant: AdminVariant) => {
    const nextStatus = !variant.is_active;
    setStatusUpdatingId(variant.id);
    setError('');
    setSuccess('');

    try {
      await updateVariantStatus(variant.id, nextStatus);
      setSuccess(`Variant "${variant.variant_name}" ${nextStatus ? 'activated' : 'archived'} successfully.`);
      await loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update variant status');
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const handleDeleteClick = (variant: AdminVariant) => {
    // If the variant has orders, direct the admin to smart archival immediately
    if (variant.order_count && variant.order_count > 0) {
      setArchiveModalVariant(variant);
      return;
    }

    const confirmed = window.confirm(`Delete "${variant.variant_name}"? This action cannot be undone.`);
    if (!confirmed) {
      return;
    }

    executeDelete(variant);
  };

  const executeDelete = async (variant: AdminVariant) => {
    setDeletingId(variant.id);
    setSuccess('');
    setError('');

    try {
      await deleteVariant(variant.id);
      setSuccess('Variant deleted successfully');
      await loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      // If error indicates referenced orders, offer archival modal
      if (err.message && err.message.toLowerCase().includes('referenced by existing order')) {
        setArchiveModalVariant(variant);
      } else {
        setError(err instanceof Error ? err.message : 'Failed to delete variant');
      }
    } finally {
      setDeletingId(null);
    }
  };

  const handleConfirmArchive = async () => {
    if (!archiveModalVariant) return;

    setIsArchiving(true);
    try {
      await updateVariantStatus(archiveModalVariant.id, false);
      setSuccess(`Variant "${archiveModalVariant.variant_name}" was archived. It is now hidden from the store.`);
      setArchiveModalVariant(null);
      await loadData();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to archive variant');
    } finally {
      setIsArchiving(false);
    }
  };

  // Counts for tabs
  const activeCount = useMemo(() => variants.filter((v) => v.is_active).length, [variants]);
  const archivedCount = useMemo(() => variants.filter((v) => !v.is_active).length, [variants]);

  // Filtered variants
  const filteredVariants = useMemo(() => {
    return variants.filter((v) => {
      // Status filter
      if (statusFilter === 'active' && !v.is_active) return false;
      if (statusFilter === 'archived' && v.is_active) return false;

      // Product filter
      if (selectedProductId !== 'all' && v.product_id !== selectedProductId) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const vName = v.variant_name.toLowerCase();
        const pName = (v.product_name || '').toLowerCase();
        return vName.includes(query) || pName.includes(query);
      }

      return true;
    });
  }, [variants, statusFilter, selectedProductId, searchQuery]);

  if (loading && variants.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm font-medium text-[#7C6B73]">Loading variants...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#2D1424]">Product Variants</h2>
          <p className="mt-1 text-sm text-[#7C6B73]">
            Manage sizes, colors, pricing, and availability.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 rounded-md bg-[#2D1424] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#3A1A2E]"
        >
          <Plus size={16} />
          Add Variant
        </button>
      </div>

      {/* Notifications */}
      {error && (
        <div className="flex items-center gap-2 rounded-md bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-md bg-green-50 p-4 text-sm text-green-700">
          <CheckCircle2 size={18} className="shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-4 rounded-lg border border-[#E4DAD2] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Status Tabs */}
        <div className="flex rounded-md bg-[#F7F3EE] p-1 text-xs font-medium text-[#5F4E58]">
          <button
            onClick={() => setStatusFilter('all')}
            className={`rounded px-3 py-1.5 transition ${
              statusFilter === 'all'
                ? 'bg-white text-[#2D1424] shadow-sm font-semibold'
                : 'hover:text-[#2D1424]'
            }`}
          >
            All ({variants.length})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`rounded px-3 py-1.5 transition ${
              statusFilter === 'active'
                ? 'bg-white text-[#2D1424] shadow-sm font-semibold'
                : 'hover:text-[#2D1424]'
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            onClick={() => setStatusFilter('archived')}
            className={`rounded px-3 py-1.5 transition ${
              statusFilter === 'archived'
                ? 'bg-white text-[#2D1424] shadow-sm font-semibold'
                : 'hover:text-[#2D1424]'
            }`}
          >
            Archived ({archivedCount})
          </button>
        </div>

        {/* Search & Product Dropdown */}
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          <div className="relative min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7C6B73]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search product or variant..."
              className="w-full rounded-md border border-[#D8CCC4] py-1.5 pl-9 pr-3 text-sm focus:border-[#2D1424] focus:outline-none focus:ring-1 focus:ring-[#2D1424]"
            />
          </div>

          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="rounded-md border border-[#D8CCC4] px-3 py-1.5 text-sm text-[#5F4E58] focus:border-[#2D1424] focus:outline-none focus:ring-1 focus:ring-[#2D1424]"
          >
            <option value="all">All Products</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Variants Table */}
      <div className="overflow-hidden rounded-lg border border-[#E4DAD2] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#E4DAD2] bg-[#F7F3EE] text-[#5F4E58]">
              <tr>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Variant Name</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium">Orders</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4DAD2]">
              {filteredVariants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-[#7C6B73]">
                    {variants.length === 0
                      ? 'No variants found. Click "Add Variant" to create one.'
                      : 'No variants match your current filters.'}
                  </td>
                </tr>
              ) : (
                filteredVariants.map((variant) => {
                  const productName =
                    variant.product_name ||
                    products.find((p) => p.id === variant.product_id)?.name ||
                    'Unknown Product';
                  const hasOrders = Boolean(variant.order_count && variant.order_count > 0);

                  return (
                    <tr
                      key={variant.id}
                      className={`transition ${
                        !variant.is_active ? 'bg-gray-50/70 text-[#7C6B73]' : 'hover:bg-[#FDFBF9]'
                      }`}
                    >
                      <td className="px-6 py-4 font-medium text-[#2D1424]">
                        {productName}
                      </td>
                      <td className="px-6 py-4">
                        <span className={!variant.is_active ? 'line-through text-gray-500' : ''}>
                          {variant.variant_name}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium">
                        ${Number(variant.price).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            variant.stock_quantity > 0
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {variant.stock_quantity} in stock
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {hasOrders ? (
                          <span
                            className="inline-flex items-center gap-1 rounded-md bg-[#F1EAE4] px-2 py-0.5 text-xs font-medium text-[#5F4E58]"
                            title={`Referenced by ${variant.order_count} order(s)`}
                          >
                            <ShoppingBag size={12} />
                            {variant.order_count} {variant.order_count === 1 ? 'order' : 'orders'}
                          </span>
                        ) : (
                          <span className="text-xs text-[#7C6B73]">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(variant)}
                          disabled={statusUpdatingId === variant.id}
                          title={variant.is_active ? 'Click to archive (hide from store)' : 'Click to activate'}
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition cursor-pointer disabled:opacity-50 ${
                            variant.is_active
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              variant.is_active ? 'bg-green-600' : 'bg-gray-500'
                            }`}
                          />
                          {variant.is_active ? 'Active' : 'Archived'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          {/* Quick Archive / Reactivate Button */}
                          <button
                            onClick={() => handleToggleStatus(variant)}
                            disabled={statusUpdatingId === variant.id}
                            className={`rounded-md p-1.5 transition ${
                              variant.is_active
                                ? 'text-[#7C6B73] hover:bg-[#F1EAE4] hover:text-[#2D1424]'
                                : 'text-green-700 hover:bg-green-50'
                            }`}
                            title={variant.is_active ? 'Archive variant (hide from store)' : 'Reactivate variant'}
                          >
                            {variant.is_active ? <Archive size={16} /> : <ArchiveRestore size={16} />}
                          </button>

                          {/* Edit Button */}
                          <button
                            onClick={() => handleOpenModal(variant)}
                            className="rounded-md p-1.5 text-[#7C6B73] transition hover:bg-[#F1EAE4] hover:text-[#2D1424]"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteClick(variant)}
                            disabled={deletingId === variant.id}
                            className={`rounded-md p-1.5 transition ${
                              hasOrders
                                ? 'text-amber-600 hover:bg-amber-50 hover:text-amber-700'
                                : 'text-[#7C6B73] hover:bg-red-50 hover:text-red-600'
                            } disabled:cursor-not-allowed disabled:opacity-60`}
                            title={hasOrders ? 'Variant has orders (click to archive)' : 'Delete variant permanently'}
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

      {/* Smart Archival Modal for Variants with Orders */}
      {archiveModalVariant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-150">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-amber-100 p-2.5 text-amber-700">
                <AlertCircle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#2D1424]">
                  Cannot Permanently Delete Variant
                </h3>
                <p className="mt-1 text-sm text-[#7C6B73]">
                  Variant <strong className="text-[#2D1424]">"{archiveModalVariant.variant_name}"</strong> is linked to{' '}
                  <span className="font-semibold text-[#2D1424]">
                    {archiveModalVariant.order_count || 'existing'} customer order(s)
                  </span>.
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50/50 p-4 text-xs text-[#5F4E58] space-y-2">
              <p className="font-medium text-amber-900">
                Why can't this be deleted?
              </p>
              <p>
                To maintain accurate financial records, tax invoices, and customer receipt history, variants that have been purchased cannot be erased from the database.
              </p>
              <p className="font-medium text-amber-900 pt-1">
                Recommended Action: Archive (Deactivate)
              </p>
              <ul className="list-disc list-inside space-y-1 text-amber-950">
                <li>Variant will be <strong>immediately hidden</strong> from your storefront</li>
                <li>Customers will <strong>not</strong> be able to purchase or add it to cart</li>
                <li>Existing order history & customer receipts stay completely intact</li>
              </ul>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setArchiveModalVariant(null)}
                className="rounded-md border border-[#D8CCC4] px-4 py-2 text-sm font-medium text-[#5F4E58] transition hover:bg-[#F1EAE4]"
                disabled={isArchiving}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmArchive}
                disabled={isArchiving}
                className="flex items-center gap-2 rounded-md bg-[#2D1424] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#3A1A2E] disabled:opacity-50"
              >
                <Archive size={16} />
                {isArchiving ? 'Archiving...' : 'Archive Variant'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit / Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold text-[#2D1424]">
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
                  <option value={0} disabled>
                    Select a product
                  </option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
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
                  Active (Visible to customers on storefront)
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

