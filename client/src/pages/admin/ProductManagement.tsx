import React, { useState } from "react";
import { useProducts } from "../../hooks/useProducts";
import type { Product } from "../../types";
import toast from "react-hot-toast";
import ImageUpload from "../../components/admin/ImageUpload";

type FormState = {
  title: string;
  description: string;
  price: string;
  type: Product["type"];
  imageUrl: string;
  isAvailable: boolean;
};
const emptyForm: FormState = {
  title: "",
  description: "",
  price: "",
  type: "coffee",
  imageUrl: "",
  isAvailable: true,
};

const ProductManagement: React.FC = () => {
  const {
    products,
    loading,
    createProduct,
    updateProduct,
    deleteProduct,
    page,
    setPage,
    totalPages,
    total,
    search,
    setSearch,
  } = useProducts();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const formRef = React.useRef<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const uploadRef = React.useRef(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const drinkIcon: Record<string, string> = {
    tea: "🍵",
    coffee: "☕",
    juice: "🥤",
  };

  const updateForm = (updater: (f: FormState) => FormState) => {
    setForm((f) => {
      const next = updater(f);
      formRef.current = next;
      return next;
    });
  };

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    formRef.current = emptyForm;
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    const newState: FormState = {
      title: p.title,
      description: p.description,
      price: String(p.price),
      type: p.type,
      imageUrl: p.imageUrl,
      isAvailable: p.isAvailable,
    };
    setEditing(p);
    setForm(newState);
    formRef.current = newState;
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploading || uploadRef.current) {
      toast.error("Still uploading image. Please wait...");
      return;
    }
    setSaving(true);

    const currentForm = formRef.current;

    try {
      const payload = {
        ...currentForm,
        price: Number(currentForm.price),
        type: currentForm.type as Product["type"],
      };
      if (editing) {
        await updateProduct(editing._id, payload);
        toast.success("Product updated!");
      } else {
        await createProduct(payload);
        toast.success("Product added!");
      }
      setShowForm(false);
    } catch (err) {
      console.error("❌ Save Error:", err);
      toast.error("Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    setDeleting(id);
    try {
      await deleteProduct(id);
      toast.success("Deleted");
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="p-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-stone-100">
            Product Management
          </h1>
          <p className="text-stone-400 mt-1">Total {total} products found</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-stone-900 border border-stone-800 rounded-xl pl-10 pr-4 py-2.5 text-stone-200 focus:border-brand-600 outline-none transition-all w-full md:w-64"
            />
          </div>
          <button
            id="add-product-btn"
            onClick={openNew}
            className="btn-primary whitespace-nowrap"
          >
            + Add Product
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="h-40 bg-stone-800 rounded-2xl animate-pulse-soft"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-stone-500">
          <div className="text-5xl mb-3">🧃</div>
          <p>No products found matching "{search}"</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <div
                key={p._id}
                className="card p-5 flex flex-col gap-3 hover:border-stone-700 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt={p.title}
                        className="w-12 h-12 rounded-xl object-cover border border-stone-800"
                      />
                    ) : (
                      <span className="text-3xl">
                        {drinkIcon[p.type] ?? "🥤"}
                      </span>
                    )}
                    <div>
                      <h3 className="font-semibold text-stone-100">
                        {p.title}
                      </h3>
                      <span className="text-xs text-stone-500 capitalize">
                        {p.type}
                      </span>
                    </div>
                  </div>
                  <span
                    className={
                      p.isAvailable ? "badge-accepted" : "badge-cancelled"
                    }
                  >
                    {p.isAvailable ? "Available" : "Hidden"}
                  </span>
                </div>
                <p className="text-stone-400 text-sm line-clamp-2">
                  {p.description}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-brand-400 font-bold text-lg">
                    ₹{p.price}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(p)}
                      className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-sm transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => void handleDelete(p._id)}
                      disabled={deleting === p._id}
                      className="px-3 py-1.5 rounded-lg bg-red-600/10 hover:bg-red-600/20 text-red-400 text-sm transition-all"
                    >
                      {deleting === p._id ? "…" : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-12">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-400 disabled:opacity-30 hover:bg-stone-800 transition-all"
              >
                ← Previous
              </button>
              <span className="text-stone-400 font-medium">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-400 disabled:opacity-30 hover:bg-stone-800 transition-all"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          {isUploading && (
            <div className="absolute inset-0 z-[60] bg-black/20 backdrop-blur-[2px] flex items-center justify-center cursor-wait">
              <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-up">
                <div className="w-5 h-5 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-stone-200 font-medium">
                  Processing Image...
                </span>
              </div>
            </div>
          )}

          <div className="card w-full max-w-lg p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl text-stone-100">
                {editing ? "Edit Product" : "Add Product"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-stone-400 hover:text-stone-100 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-stone-400 text-sm mb-1">
                  Title
                </label>
                <input
                  value={form.title}
                  onChange={(e) =>
                    updateForm((f) => ({ ...f, title: e.target.value }))
                  }
                  className="input-field"
                  placeholder="e.g. Masala Chai"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-400 text-sm mb-1">
                  Description
                </label>
                <input
                  value={form.description}
                  onChange={(e) =>
                    updateForm((f) => ({ ...f, description: e.target.value }))
                  }
                  className="input-field"
                  placeholder="Brief description"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-400 text-sm mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={form.price}
                    onChange={(e) =>
                      updateForm((f) => ({ ...f, price: e.target.value }))
                    }
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-stone-400 text-sm mb-1">
                    Type
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) =>
                      updateForm((f) => ({
                        ...f,
                        type: e.target.value as Product["type"],
                      }))
                    }
                    className="input-field"
                  >
                    <option value="tea">🍵 Tea</option>
                    <option value="coffee">☕ Coffee</option>
                    <option value="juice">🥤 Juice</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-400 text-sm mb-3 text-center">
                  Product Image
                </label>
                <ImageUpload
                  value={form.imageUrl}
                  onChange={async (url) => {
                    updateForm((f) => ({ ...f, imageUrl: url }));
                    if (editing) {
                      const payload = {
                        ...formRef.current,
                        imageUrl: url,
                        price: Number(formRef.current.price),
                        type: formRef.current.type as Product["type"],
                      };
                      try {
                        await updateProduct(editing._id, payload);
                        toast.success("Image saved!");
                      } catch {
                        toast.error("Failed to save image");
                      }
                    }
                  }}
                  onUploadChange={(val) => {
                    setIsUploading(val);
                    uploadRef.current = val;
                  }}
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="p-avail"
                  type="checkbox"
                  checked={form.isAvailable}
                  onChange={(e) =>
                    updateForm((f) => ({ ...f, isAvailable: e.target.checked }))
                  }
                  className="w-4 h-4 accent-brand-600"
                />
                <label htmlFor="p-avail" className="text-stone-300 text-sm">
                  Available on menu
                </label>
              </div>

              <button
                type="submit"
                disabled={saving || isUploading}
                className="btn-primary w-full"
              >
                {saving
                  ? "Saving…"
                  : isUploading
                    ? "Uploading…"
                    : editing
                      ? "Update Product"
                      : "Add Product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
