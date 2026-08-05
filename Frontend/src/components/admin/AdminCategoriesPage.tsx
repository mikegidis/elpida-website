import React, { FormEvent, useEffect, useState } from 'react';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import {
  ApiCategory,
  CategoryInput,
  createCategory,
  deleteCategory,
  fetchCategories,
  updateCategory,
} from '../../api/categories';

type CategoryFormState = CategoryInput;

const emptyForm: CategoryFormState = {
  name: '',
  description: '',
};

function getCategoryStatus(category: ApiCategory) {
  if (category.status) {
    return category.status;
  }

  if (typeof category.is_active === 'boolean') {
    return category.is_active ? 'Active' : 'Inactive';
  }

  return 'N/A';
}

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formError, setFormError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ApiCategory | null>(null);
  const [form, setForm] = useState<CategoryFormState>(emptyForm);

  const loadCategories = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setForm(emptyForm);
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (category: ApiCategory) => {
    setEditingCategory(category);
    setForm({
      name: category.name,
      description: category.description,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (saving) {
      return;
    }

    setIsModalOpen(false);
    setEditingCategory(null);
    setForm(emptyForm);
    setFormError('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');
    setSuccess('');
    setError('');

    if (!form.name.trim() || !form.description.trim()) {
      setFormError('Category name and description are required.');
      return;
    }

    setSaving(true);

    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
      };

      if (editingCategory) {
        await updateCategory(editingCategory.id, payload);
        setSuccess('Category updated successfully.');
      } else {
        await createCategory(payload);
        setSuccess('Category created successfully.');
      }

      closeModal();
      await loadCategories();
    } catch (saveError) {
      setFormError(saveError instanceof Error ? saveError.message : 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (category: ApiCategory) => {
    const confirmed = window.confirm(`Delete "${category.name}"? This action cannot be undone.`);

    if (!confirmed) {
      return;
    }

    setDeletingId(category.id);
    setSuccess('');
    setError('');

    try {
      await deleteCategory(category.id);
      setSuccess('Category deleted successfully.');
      await loadCategories();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete category');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="rounded-lg border border-[#E4DAD2] bg-white">
      <div className="flex flex-col gap-3 border-b border-[#E4DAD2] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold">Categories</h2>
          <p className="mt-1 text-sm text-[#6E5E67]">Manage the categories shown in the shop.</p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-[#2D1424] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#3A1A2E]"
        >
          <Plus size={16} />
          Add Category
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
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4DAD2]">
              {loading ? (
                <tr>
                  <td className="px-4 py-6 text-center text-[#6E5E67]" colSpan={4}>
                    Loading categories...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-center text-[#6E5E67]" colSpan={4}>
                    No categories found.
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id}>
                    <td className="whitespace-nowrap px-4 py-3 font-medium">{category.name}</td>
                    <td className="min-w-64 px-4 py-3 text-[#6E5E67]">{category.description}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="rounded-md bg-[#F1EAE4] px-2 py-1 text-xs font-medium text-[#5F4E58]">
                        {getCategoryStatus(category)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(category)}
                          className="inline-flex items-center gap-1 rounded-md border border-[#D8CCC4] px-3 py-1.5 text-xs font-medium transition hover:bg-[#F1EAE4]"
                        >
                          <Pencil size={14} />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(category)}
                          disabled={deletingId === category.id}
                          className="inline-flex items-center gap-1 rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <Trash2 size={14} />
                          {deletingId === category.id ? 'Deleting...' : 'Delete'}
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
          <form onSubmit={handleSubmit} className="w-full max-w-lg rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-[#E4DAD2] p-5">
              <h3 className="text-base font-semibold">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-md p-2 text-[#6E5E67] transition hover:bg-[#F1EAE4]"
                aria-label="Close category form"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium">Category Name</span>
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
                  className="min-h-28 w-full rounded-md border border-[#D8CCC4] px-3 py-2 text-sm outline-none focus:border-[#C9A227]"
                  required
                />
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
                {saving ? 'Saving...' : 'Save Category'}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
