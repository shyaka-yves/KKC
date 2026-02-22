"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Plus, Trash2, Pencil, ImageUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Reveal } from "@/components/motion/Reveal";
import { listenCategories, type Category, upsertCategory, deleteCategory } from "@/lib/firestore/categories";
import { deleteProduct, listenAllProducts, upsertProduct } from "@/lib/firestore/products";
import { uploadProductImage } from "@/lib/storage/upload";
import type { Product } from "@/lib/products/types";
import { cn } from "@/lib/utils";
import { useAdminSession } from "@/hooks/useAdminSession";

function AdminLoginForm({
  t,
  onLoginSuccess
}: {
  t: ReturnType<typeof useTranslations>;
  onLoginSuccess: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-16 flex items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md rounded-3xl border-2 border-brand-blue-200 bg-brand-blue-50/80 p-8 shadow-lg">
        <div className="text-center mb-6">
          <p className="text-xs font-semibold tracking-[0.14em] text-brand-blue-700 uppercase">
            {t("admin.title")}
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            Admin access
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Sign in with your admin email and password only. Google sign-in is not used for admin access.
          </p>
        </div>
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setSubmitting(true);
            setError(null);
            try {
              const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.trim(), password })
              });
              const data = await res.json();
              if (data.ok) {
                onLoginSuccess();
              } else {
                setError(data.error || "Invalid email or password.");
              }
            } catch {
              setError("Invalid email or password.");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <div>
            <label className="block text-sm font-semibold text-slate-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full rounded-xl border-2 border-brand-blue-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue-400 focus:border-brand-blue-400"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full rounded-xl border-2 border-brand-blue-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue-400 focus:border-brand-blue-400"
              placeholder="••••••••"
            />
          </div>
          {error ? (
            <p className="text-sm text-brand-orange-600">{error}</p>
          ) : null}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-gradient-to-b from-brand-orange-500 to-brand-orange-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-orange-500/25 transition hover:from-brand-orange-400 hover:to-brand-orange-600 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {submitting ? "Signing in…" : t("auth.loginAdmin")}
          </button>
        </form>
      </div>
    </div>
  );
}

const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(5),
  category: z.string().min(2),
  imageUrl: z.string().url(),
  price: z.coerce.number().optional().nullable(),
  currency: z.enum(["RWF", "USD"]).optional().nullable(),
  showPrice: z.boolean(),
  visible: z.boolean(),
  featured: z.boolean()
});

type ProductForm = z.infer<typeof productSchema>;

function ModalShell({
  open,
  title,
  children,
  onClose
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
        >
          <button className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="glass relative w-full max-w-2xl rounded-2xl p-6 md:p-8"
            initial={{ y: 16, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 16, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="mb-4 text-lg font-semibold tracking-tight text-slate-950">
              {title}
            </div>
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function AdminDashboardClient() {
  const t = useTranslations();
  const { isAdmin, isLoading, logout, refetch } = useAdminSession();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tab, setTab] = useState<"products" | "categories">("products");

  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  const [categoryName, setCategoryName] = useState("");

  const form = useForm<ProductForm>({
    resolver: zodResolver(productSchema) as never,
    defaultValues: {
      name: "",
      description: "",
      category: "",
      imageUrl: "https://images.unsplash.com/photo-1581092919535-7146a2f0b2f4?auto=format&fit=crop&w=1400&q=80",
      price: null,
      currency: "RWF",
      showPrice: false,
      visible: true,
      featured: false
    }
  });

  useEffect(() => {
    const unsubProducts = listenAllProducts(setProducts);
    const unsubCategories = listenCategories(setCategories);
    return () => {
      unsubProducts?.();
      unsubCategories?.();
    };
  }, []);

  const analytics = useMemo(
    () => ({
      productCount: products.length,
      categoryCount: categories.length
    }),
    [products.length, categories.length]
  );

  if (isLoading) {
    return <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">Loading…</div>;
  }

  if (!isAdmin) {
    return (
      <AdminLoginForm t={t} onLoginSuccess={refetch} />
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <Reveal>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-brand-blue-700 uppercase">
              {t("admin.title")}
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
              {t("admin.title")}
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Manage products, categories and visibility without checkout.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void logout()}
              className="inline-flex items-center gap-2 rounded-full border-2 border-brand-blue-200 bg-brand-blue-50 px-3 py-2 text-sm font-medium text-brand-blue-700 transition hover:bg-brand-blue-100"
            >
              <LogOut className="h-4 w-4" />
              {t("auth.signOut")}
            </button>
            <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setTab("products")}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition",
                tab === "products"
                  ? "bg-brand-blue-700 text-white shadow-lg shadow-brand-blue-600/25"
                  : "glass text-slate-800 hover:bg-white/70"
              )}
            >
              {t("admin.manageProducts")}
            </button>
            <button
              type="button"
              onClick={() => setTab("categories")}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition",
                tab === "categories"
                  ? "bg-brand-blue-700 text-white shadow-lg shadow-brand-blue-600/25"
                  : "glass text-slate-800 hover:bg-white/70"
              )}
            >
              {t("admin.manageCategories")}
            </button>
            </div>
          </div>
        </div>
      </Reveal>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="glass rounded-2xl p-5">
          <div className="text-xs font-semibold tracking-[0.14em] text-slate-600 uppercase">
            {t("admin.totalProducts")}
          </div>
          <div className="mt-2 text-3xl font-semibold text-slate-950">
            {analytics.productCount}
          </div>
        </div>
        <div className="glass rounded-2xl p-5">
          <div className="text-xs font-semibold tracking-[0.14em] text-slate-600 uppercase">
            {t("admin.totalCategories")}
          </div>
          <div className="mt-2 text-3xl font-semibold text-slate-950">
            {analytics.categoryCount}
          </div>
        </div>
        <div className="glass flex items-center justify-between rounded-2xl p-5">
          <div>
            <div className="text-xs font-semibold tracking-[0.14em] text-slate-600 uppercase">
              Quick actions
            </div>
            <div className="mt-1 text-sm font-semibold text-slate-950">Add new product</div>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setUploadFile(null);
              form.reset();
              setProductModalOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-brand-orange-500 to-brand-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-orange-500/25 transition hover:from-brand-orange-400 hover:to-brand-orange-600"
          >
            <Plus className="h-4 w-4" />
            {t("admin.addProduct")}
          </button>
        </div>
      </div>

      {tab === "products" ? (
        <div className="mt-8 glass rounded-3xl p-5 md:p-6">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead>
                <tr className="text-xs font-semibold tracking-[0.14em] text-slate-600 uppercase">
                  <th className="py-3">Name</th>
                  <th className="py-3">Category</th>
                  <th className="py-3">{t("admin.visible")}</th>
                  <th className="py-3">{t("admin.priceVisible")}</th>
                  <th className="py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60">
                {products.map((p) => (
                  <tr key={p.id} className="text-slate-800">
                    <td className="py-3">
                      <div className="font-semibold text-slate-950">{p.name}</div>
                      <div className="text-xs text-slate-600 line-clamp-1">{p.description}</div>
                    </td>
                    <td className="py-3">{p.category}</td>
                    <td className="py-3">{p.visible ? "Yes" : "No"}</td>
                    <td className="py-3">{p.showPrice ? "Yes" : "No"}</td>
                    <td className="py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditing(p);
                            setUploadFile(null);
                            form.reset({
                              name: p.name,
                              description: p.description,
                              category: p.category,
                              imageUrl: p.imageUrl,
                              price: p.price ?? null,
                              currency: p.currency ?? "RWF",
                              showPrice: p.showPrice,
                              visible: p.visible,
                              featured: p.featured ?? false
                            });
                            setProductModalOpen(true);
                          }}
                          className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/55 px-3 py-2 text-xs font-semibold text-slate-900 transition hover:bg-white"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          {t("admin.edit")}
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            if (!confirm(`Delete "${p.name}"?`)) return;
                            await deleteProduct(p.id);
                          }}
                          className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/55 px-3 py-2 text-xs font-semibold text-slate-900 transition hover:bg-white"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-brand-orange-600" />
                          {t("admin.delete")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-12">
          <div className="glass rounded-3xl p-5 md:col-span-5 md:p-6">
            <div className="text-sm font-semibold text-slate-950">Add category</div>
            <div className="mt-3 flex gap-2">
              <input
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="e.g. Cement & Concrete"
                className="w-full rounded-xl border border-white/40 bg-white/55 px-3 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-blue-500/40"
              />
              <button
                type="button"
                onClick={async () => {
                  const name = categoryName.trim();
                  if (!name) return;
                  try {
                    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                    await upsertCategory({
                      name,
                      slug,
                      visible: true,
                      order: categories.length + 1
                    });
                    setCategoryName("");
                  } catch (e) {
                    console.error("Failed to add category:", e);
                    alert("Failed to add category. Check the console.");
                  }
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-b from-brand-blue-600 to-brand-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-blue-600/25 transition hover:from-brand-blue-500 hover:to-brand-blue-700"
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
            </div>
          </div>

          <div className="glass rounded-3xl p-5 md:col-span-7 md:p-6">
            <div className="text-sm font-semibold text-slate-950">Categories</div>
            <div className="mt-4 grid gap-2">
              {categories.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between rounded-2xl bg-white/55 px-4 py-3"
                >
                  <div>
                    <div className="text-sm font-semibold text-slate-950">{c.name}</div>
                    <div className="text-xs text-slate-600">/{c.slug}</div>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      if (!confirm(`Delete category "${c.name}"?`)) return;
                      await deleteCategory(c.id);
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/60 px-3 py-2 text-xs font-semibold text-slate-900 transition hover:bg-white"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-brand-orange-600" />
                    {t("admin.delete")}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <ModalShell
        open={productModalOpen}
        title={editing ? "Edit product" : "Add product"}
        onClose={() => setProductModalOpen(false)}
      >
        <form
          className="grid gap-4"
          onSubmit={form.handleSubmit(async (values) => {
            setBusy(true);
            try {
              const id = editing?.id ?? crypto.randomUUID();
              let imageUrl = values.imageUrl;

              if (uploadFile) {
                imageUrl = await uploadProductImage(uploadFile, id);
              }

              await upsertProduct({
                id,
                ...values,
                imageUrl,
                price: values.showPrice ? values.price ?? null : null,
                currency: values.currency ?? "RWF"
              });

              setProductModalOpen(false);
              setEditing(null);
              setUploadFile(null);
              form.reset();
            } catch (e) {
              console.error("Failed to save product:", e);
              alert("Failed to save product. Check the console.");
            } finally {
              setBusy(false);
            }
          })}
        >
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-slate-700">Name</label>
              <input
                {...form.register("name")}
                className="mt-1 w-full rounded-xl border border-white/40 bg-white/55 px-3 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue-500/40"
              />
              <p className="mt-1 text-xs text-brand-orange-700">{form.formState.errors.name?.message}</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700">Category</label>
              <select
                {...form.register("category")}
                className="mt-1 w-full rounded-xl border border-white/40 bg-white/55 px-3 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue-500/40"
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-brand-orange-700">{form.formState.errors.category?.message}</p>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700">Description</label>
            <textarea
              {...form.register("description")}
              rows={3}
              className="mt-1 w-full rounded-xl border border-white/40 bg-white/55 px-3 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue-500/40"
            />
            <p className="mt-1 text-xs text-brand-orange-700">{form.formState.errors.description?.message}</p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-slate-700">Image URL</label>
              <input
                {...form.register("imageUrl")}
                className="mt-1 w-full rounded-xl border border-white/40 bg-white/55 px-3 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue-500/40"
              />
              <p className="mt-1 text-xs text-brand-orange-700">
                {form.formState.errors.imageUrl?.message}
              </p>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700">Or upload image</label>
              <label className="mt-1 flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-white/40 bg-white/55 px-3 py-3 text-sm text-slate-700 transition hover:bg-white">
                <span className="line-clamp-1">
                  {uploadFile ? uploadFile.name : "Choose a file…"}
                </span>
                <ImageUp className="h-4 w-4 text-slate-700" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
                />
              </label>
              <p className="mt-1 text-xs text-slate-500">
                Uploads to Firebase Storage (if configured).
              </p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <label className="flex items-center gap-2 rounded-2xl bg-white/55 px-4 py-3 text-sm font-medium text-slate-800">
              <input type="checkbox" className="h-4 w-4" {...form.register("visible")} />
              {t("admin.visible")}
            </label>
            <label className="flex items-center gap-2 rounded-2xl bg-white/55 px-4 py-3 text-sm font-medium text-slate-800">
              <input type="checkbox" className="h-4 w-4" {...form.register("featured")} />
              {t("admin.featured")}
            </label>
            <label className="flex items-center gap-2 rounded-2xl bg-white/55 px-4 py-3 text-sm font-medium text-slate-800">
              <input type="checkbox" className="h-4 w-4" {...form.register("showPrice")} />
              {t("admin.priceVisible")}
            </label>
          </div>

          <div className="rounded-2xl bg-white/55 px-4 py-3">
            <label className="text-xs font-semibold text-slate-700">Price (optional)</label>
            <input
              {...form.register("price")}
              inputMode="numeric"
              className="mt-1 w-full bg-transparent text-sm text-slate-900 focus:outline-none"
            />
          </div>

          <div className="mt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setProductModalOpen(false)}
              className="rounded-xl border border-white/40 bg-white/55 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-white"
            >
              Cancel
            </button>
            <button
              disabled={busy}
              type="submit"
              className="rounded-xl bg-gradient-to-b from-brand-blue-600 to-brand-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-blue-600/25 transition hover:from-brand-blue-500 hover:to-brand-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {busy ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </ModalShell>
    </div>
  );
}

