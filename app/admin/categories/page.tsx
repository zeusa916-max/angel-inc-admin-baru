'use client';

import { useEffect, useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Category } from '@/types/database';
import { slugify } from '@/lib/utils';
import { useToast } from '@/components/ui/toast';
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from '@/server/actions/category.actions';
import {
  Tags,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Loader2,
  Search,
  AlertTriangle,
} from 'lucide-react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State for Add
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  // Edit State
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editName, setEditName] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editIsActive, setEditIsActive] = useState(true);
  const [editSaving, setEditSaving] = useState(false);

  // Delete State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);

  const { success, error } = useToast();

  const loadCategories = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const { data, error: err } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false });

      if (err) {
        console.error('Error loading categories:', err);
      }
      setCategories((data as Category[]) || []);
    } catch (err: any) {
      console.error('Catch loadCategories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(slugify(val));
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setSubmitting(true);
      const finalSlug = slug.trim() || slugify(name);

      const res = await createCategoryAction({
        name: name.trim(),
        slug: finalSlug,
        description: description.trim() || null,
        is_active: isActive,
      });

      if (!res.success) {
        throw new Error(res.error || 'Gagal menambahkan kategori.');
      }

      success(`Kategori "${name}" berhasil ditambahkan.`);
      setName('');
      setSlug('');
      setDescription('');
      setIsActive(true);
      loadCategories();
    } catch (err: any) {
      error(err?.message || 'Gagal menambahkan kategori.');
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (cat: Category) => {
    setEditingCategory(cat);
    setEditName(cat.name);
    setEditSlug(cat.slug);
    setEditDescription(cat.description || '');
    setEditIsActive(cat.is_active);
  };

  const handleSaveEdit = async () => {
    if (!editingCategory || !editName.trim()) return;

    try {
      setEditSaving(true);
      const finalSlug = editSlug.trim() || slugify(editName);

      const res = await updateCategoryAction(editingCategory.id, {
        name: editName.trim(),
        slug: finalSlug,
        description: editDescription.trim() || null,
        is_active: editIsActive,
      });

      if (!res.success) {
        throw new Error(res.error || 'Gagal memperbarui kategori.');
      }

      success(`Kategori "${editName}" berhasil diperbarui.`);
      setEditingCategory(null);
      loadCategories();
    } catch (err: any) {
      error(err?.message || 'Gagal memperbarui kategori.');
    } finally {
      setEditSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setIsDeleting(true);
      const res = await deleteCategoryAction(deleteId);

      if (!res.success) {
        throw new Error(res.error || 'Gagal menghapus kategori.');
      }

      success(`Kategori "${deleteName}" berhasil dihapus.`);
      setDeleteId(null);
      loadCategories();
    } catch (err: any) {
      error(err?.message || 'Gagal menghapus kategori.');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredCategories = useMemo(() => {
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-[0.2em] text-neutral-400 dark:text-neutral-500 uppercase">
          Katalog Produk
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Manajemen Kategori
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Kelola kategori produk untuk pengelompokan etalase toko
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Add Form */}
        <div className="lg:col-span-1">
          <form
            onSubmit={handleAddCategory}
            className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#141518] p-6 shadow-subtle space-y-4 sticky top-6"
          >
            <div className="flex items-center gap-2.5 border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <Plus className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Tambah Kategori Baru
              </h2>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Nama Kategori <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Contoh: Outerwear"
                className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3.5 py-2.5 text-xs text-neutral-900 dark:text-white outline-none transition focus:border-neutral-950 dark:focus:border-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Slug URL
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="outerwear"
                className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3.5 py-2.5 text-xs font-mono text-neutral-900 dark:text-white outline-none transition focus:border-neutral-950 dark:focus:border-white"
              />
              <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1">
                Otomatis dihasilkan dari nama kategori.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Deskripsi Singkat
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Deskripsi koleksi kategori…"
                className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3.5 py-2.5 text-xs text-neutral-900 dark:text-white outline-none transition focus:border-neutral-950 dark:focus:border-white"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="is-active"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 rounded border-neutral-300 dark:border-neutral-700 text-neutral-900 focus:ring-neutral-950"
              />
              <label
                htmlFor="is-active"
                className="text-xs font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer"
              >
                Kategori Aktif & Tampil
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 dark:bg-white py-2.5 text-xs font-medium text-white dark:text-neutral-950 shadow-sm hover:bg-neutral-800 dark:hover:bg-neutral-200 transition disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Menyimpan…</span>
                </>
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5" />
                  <span>Simpan Kategori</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Table List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari kategori…"
              className="w-full rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#141518] py-2.5 pl-10 pr-4 text-xs text-neutral-900 dark:text-white shadow-subtle outline-none transition focus:border-neutral-950 dark:focus:border-white"
            />
          </div>

          <div className="overflow-hidden rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#141518] shadow-subtle">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/60 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Nama & Slug</th>
                    <th className="py-3.5 px-4">Deskripsi</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="py-10 text-center text-neutral-400">
                        <Loader2 className="mx-auto h-5 w-5 animate-spin mb-2" />
                        Memuat data kategori…
                      </td>
                    </tr>
                  ) : filteredCategories.length > 0 ? (
                    filteredCategories.map((cat) => (
                      <tr
                        key={cat.id}
                        className="transition hover:bg-neutral-50/70 dark:hover:bg-neutral-900/50"
                      >
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-neutral-900 dark:text-white">
                            {cat.name}
                          </div>
                          <div className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500">
                            /{cat.slug}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-400 max-w-xs truncate">
                          {cat.description || '—'}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${
                              cat.is_active
                                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-900/60'
                                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700'
                            }`}
                          >
                            {cat.is_active ? 'Aktif' : 'Nonaktif'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => startEdit(cat)}
                              className="rounded-lg border border-neutral-200 dark:border-neutral-700 p-1.5 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                              title="Edit Kategori"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                setDeleteId(cat.id);
                                setDeleteName(cat.name);
                              }}
                              className="rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/40 p-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition"
                              title="Hapus Kategori"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-10 text-center">
                        <Tags className="mx-auto h-6 w-6 text-neutral-300 dark:text-neutral-600 mb-2" />
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          Belum ada kategori yang cocok.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !editSaving && setEditingCategory(null)}
          />
          <div className="relative w-full max-w-md rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141518] p-6 shadow-2xl animate-fade-in z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                Edit Kategori
              </h3>
              <button
                onClick={() => setEditingCategory(null)}
                className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Nama Kategori
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => {
                  setEditName(e.target.value);
                  setEditSlug(slugify(e.target.value));
                }}
                className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3.5 py-2 text-xs text-neutral-900 dark:text-white outline-none focus:border-neutral-950 dark:focus:border-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Slug URL
              </label>
              <input
                type="text"
                value={editSlug}
                onChange={(e) => setEditSlug(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3.5 py-2 text-xs font-mono text-neutral-900 dark:text-white outline-none focus:border-neutral-950 dark:focus:border-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Deskripsi
              </label>
              <textarea
                rows={3}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3.5 py-2 text-xs text-neutral-900 dark:text-white outline-none focus:border-neutral-950 dark:focus:border-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="edit-is-active"
                checked={editIsActive}
                onChange={(e) => setEditIsActive(e.target.checked)}
                className="h-4 w-4 rounded border-neutral-300 dark:border-neutral-700 text-neutral-900"
              />
              <label
                htmlFor="edit-is-active"
                className="text-xs font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer"
              >
                Status Aktif
              </label>
            </div>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                disabled={editSaving}
                className="rounded-xl border border-neutral-200 dark:border-neutral-700 px-4 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={editSaving}
                className="flex items-center gap-1.5 rounded-xl bg-neutral-950 dark:bg-white px-4 py-2 text-xs font-medium text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-200"
              >
                {editSaving ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Check className="h-3.5 w-3.5" />
                )}
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !isDeleting && setDeleteId(null)}
          />
          <div className="relative w-full max-w-md rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141518] p-6 shadow-2xl animate-fade-in z-10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                  Hapus Kategori?
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Pastikan tidak ada produk yang memakai kategori ini.
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-300">
              Apakah Anda yakin ingin menghapus kategori{' '}
              <strong className="text-neutral-900 dark:text-white">"{deleteName}"</strong>?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                disabled={isDeleting}
                className="rounded-xl border border-neutral-200 dark:border-neutral-700 px-4 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-medium text-white hover:bg-rose-700 disabled:opacity-50 shadow-sm"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Menghapus…</span>
                  </>
                ) : (
                  <span>Ya, Hapus</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
