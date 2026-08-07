import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { ImageIcon, Pencil, Plus, Trash2, Upload, X } from 'lucide-react';
import { ApiCategory, fetchCategories } from '../../api/categories';
import {
  AdminProduct,
  ProductInput,
  createProduct,
  deleteProduct,
  fetchAdminProducts,
  resolveImageUrl,
  updateProduct,
  uploadProductImage,
} from '../../api/products';

// Allowed image types and max size (5 MB) — validated client-side before upload
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

type ProductFormState = {
  name: string;
  description: string;
  category_id: string;
  image_url: string;
  is_active: boolean;
};

const emptyForm: ProductFormState = {
  name: '',
  description: '',
  category_id: '',
  image_url: '',
  is_active: true,
};

export function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formError, setFormError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [form, setForm] = useState<ProductFormState>(emptyForm);

  // Image upload state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compute the preview URL: local blob for a new file, or resolved URL for existing
  const imagePreviewUrl = imageFile
    ? URL.createObjectURL(imageFile)
    : form.image_url
      ? resolveImageUrl(form.image_url)
      : '';

  const loadProducts = async () => {
    setLoading(true);
    setError('');

    try {
      const [productData, categoryData] = await Promise.all([
        fetchAdminProducts(),
        fetchCategories(),
      ]);
      setProducts(productData);
      setCategories(categoryData);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setImageFile(null);
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (product: AdminProduct) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description || '',
      category_id: String(product.category.id),
      image_url: product.image_url || '',
      is_active: product.is_active,
    });
    setImageFile(null);
    setFormError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (saving) {
      return;
    }

    setIsModalOpen(false);
    setEditingProduct(null);
    setForm(emptyForm);
    setImageFile(null);
    setFormError('');
  };

  // Validate and set the selected image file
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setFormError('Only JPG, PNG and WEBP images are allowed.');
      event.target.value = '';
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setFormError('Image must be smaller than 5 MB.');
      event.target.value = '';
      return;
    }

    setFormError('');
    setImageFile(file);
  };

  const buildPayload = (): ProductInput | null => {
    if (!form.name.trim()) {
      setFormError('Product name is required.');
      return null;
    }

    if (!form.category_id) {
      setFormError('Category is required.');
      return null;
    }

    return {
      name: form.name.trim(),
      description: form.description.trim(),
      category_id: Number(form.category_id),
      image_url: form.image_url.trim(),
      is_active: form.is_active,
    };
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');
    setSuccess('');
    setError('');

    const payload = buildPayload();

    if (!payload) {
      return;
    }

    setSaving(true);

    try {
      // If a new image file was selected, upload it first
      if (imageFile) {
        const uploadedUrl = await uploadProductImage(imageFile);
        payload.image_url = uploadedUrl;
      }

      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
        setSuccess('Product updated successfully.');
      } else {
        await createProduct(payload);
        setSuccess('Product created successfully.');
      }

      closeModal();
      await loadProducts();
    } catch (saveError) {
      setFormError(saveError instanceof Error ? saveError.message : 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product: AdminProduct) => {
    const confirmed = window.confirm(`Delete "${product.name}"? This action cannot be undone.`);

    if (!confirmed) {
      return;
    }

    setDeletingId(product.id);
    setSuccess('');
    setError('');

    try {
      await deleteProduct(product.id);
      setSuccess('Product deleted successfully.');
      await loadProducts();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete product');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="rounded-lg border border-[#E4DAD2] bg-white">
      <div className="flex flex-col gap-3 border-b border-[#E4DAD2] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold">Products</h2>
          <p className="mt-1 text-sm text-[#6E5E67]">Manage product details. Variants will be handled separately.</p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-[#2D1424] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#3A1A2E]"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      <div className="space-y-3 p-5">
        {success && (
          <p className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
            {success}
          </p>
        )}
        {error && (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="overflow-x-auto rounded-lg border border-[#E4DAD2]">
          <table className="min-w-full divide-y divide-[#E4DAD2] text-sm">
            <thead className="bg-[#F7F3EE] text-left text-xs font-semibold uppercase text-[#6E5E67]">
              <tr>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Product Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4DAD2]">
              {loading ? (
                <tr>
                  <td className="px-4 py-6 text-center text-[#6E5E67]" colSpan={6}>
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-center text-[#6E5E67]" colSpan={6}>
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-4 py-3">
                      {product.image_url ? (
                        <img
                          src={resolveImageUrl(product.image_url)}
                          alt={product.name}
                          className="h-12 w-12 rounded-md object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[#F1EAE4] text-[#6E5E67]">
                          <ImageIcon size={18} />
                        </div>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-medium">{product.name}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-[#6E5E67]">{product.category.name}</td>
                    <td className="min-w-72 px-4 py-3 text-[#6E5E67]">{product.description || 'N/A'}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="rounded-md bg-[#F1EAE4] px-2 py-1 text-xs font-medium text-[#5F4E58]">
                        {product.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(product)}
                          className="inline-flex items-center gap-1 rounded-md border border-[#D8CCC4] px-3 py-1.5 text-xs font-medium transition hover:bg-[#F1EAE4]"
                        >
                          <Pencil size={14} />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(product)}
                          disabled={deletingId === product.id}
                          className="inline-flex items-center gap-1 rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <Trash2 size={14} />
                          {deletingId === product.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <form onSubmit={handleSubmit} className="w-full max-w-xl rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-[#E4DAD2] p-5">
              <h3 className="text-base font-semibold">
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-md p-2 text-[#6E5E67] transition hover:bg-[#F1EAE4]"
                aria-label="Close product form"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium">Product Name</span>
                <input
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  className="w-full rounded-md border border-[#D8CCC4] px-3 py-2 text-sm outline-none focus:border-[#C9A227]"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium">Description</span>
                <textarea
                  value={form.description}
                  onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                  className="min-h-24 w-full rounded-md border border-[#D8CCC4] px-3 py-2 text-sm outline-none focus:border-[#C9A227]"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium">Category</span>
                <select
                  value={form.category_id}
                  onChange={(event) => setForm((current) => ({ ...current, category_id: event.target.value }))}
                  className="w-full rounded-md border border-[#D8CCC4] px-3 py-2 text-sm outline-none focus:border-[#C9A227]"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="block">
                <span className="mb-2 block text-sm font-medium">Product Image</span>

                {/* Image preview */}
                {imagePreviewUrl ? (
                  <div className="relative mb-2 inline-block">
                    <img
                      src={imagePreviewUrl}
                      alt="Preview"
                      className="h-32 w-32 rounded-lg border border-[#D8CCC4] object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setForm((current) => ({ ...current, image_url: '' }));
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow hover:bg-red-600"
                      aria-label="Remove image"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : null}

                {/* File picker */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-[#D8CCC4] px-4 py-5 text-center transition hover:border-[#C9A227] hover:bg-[#FDFBF9]"
                >
                  <Upload size={24} className="text-[#6E5E67]" />
                  <p className="text-sm text-[#6E5E67]">
                    <span className="font-medium text-[#2D1424]">Click to upload</span> an image
                  </p>
                  <p className="text-xs text-[#A39E93]">JPG, PNG or WEBP (max 5 MB)</p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(event) => setForm((current) => ({ ...current, is_active: event.target.checked }))}
                  className="h-4 w-4 rounded border-[#D8CCC4]"
                />
                Active
              </label>

              {formError && (
                <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {formError}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 border-t border-[#E4DAD2] p-5">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-md border border-[#D8CCC4] px-4 py-2 text-sm font-medium transition hover:bg-[#F1EAE4]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-md bg-[#2D1424] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#3A1A2E] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
