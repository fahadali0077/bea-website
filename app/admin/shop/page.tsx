"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Plus,
  Search,
  Eye,
  SquarePen,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShoppingBag,
  Boxes,
  FileImage,
  Sparkles,
} from "lucide-react";
import {
  listProducts,
  listCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  createCategory,
  updateCategory,
  deleteCategory,
  type ApiProduct,
  type ApiCategory,
} from "@/lib/admin/products-api";
import { EntityStatusBadge } from "@/app/components/admin/Badge";
import { PageHeading } from "@/app/components/admin/PageHeading";
import { SlideOver } from "@/app/components/admin/SlideOver";
import { DetailRow, DetailSection } from "@/app/components/admin/DetailList";
import { DataTable, type Column } from "@/app/components/admin/DataTable";
import { IconButton } from "@/app/components/admin/IconButton";
import { ConfirmDialog } from "@/app/components/admin/ConfirmDialog";

const inputClass =
  "w-full font-lato text-[14px] text-neutral-800 bg-white border border-neutral-200/70 rounded-[8px] px-3.5 py-2 focus:outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400";
const selectClass =
  "font-lato text-[13px] font-bold text-neutral-700 bg-white border border-neutral-200/70 rounded-[8px] px-3.5 py-2.5 cursor-pointer focus:outline-none focus:border-neutral-400 transition-colors uppercase tracking-wide";
const labelClass = "font-lato text-[11px] font-bold text-neutral-400 uppercase tracking-wider";

const SIZE_PRESETS = ["XS", "S", "M", "L", "XL", "XXL"];

const COLOR_PRESETS = [
  { name: "Black", colorClass: "bg-[#1A1A1A] border-transparent" },
  { name: "White", colorClass: "bg-[#FFFFFF] border-neutral-300" },
  { name: "Navy", colorClass: "bg-[#1D2A44] border-transparent" },
  { name: "Tan", colorClass: "bg-[#C8A27B] border-transparent" },
  { name: "Coral", colorClass: "bg-[#E07A5F] border-transparent" },
  { name: "Teal", colorClass: "bg-[#3D7A6E] border-transparent" },
  { name: "Blue Stripe", colorClass: "bg-gradient-to-r from-sky-400 via-neutral-100 to-sky-400 border-transparent" },
  { name: "Gray", colorClass: "bg-[#8E8E93] border-transparent" },
];

const getColorCircleClass = (name: string): string => {
  const preset = COLOR_PRESETS.find((c) => c.name === name);
  return preset ? preset.colorClass : "bg-neutral-200 border-transparent";
};

function ProductThumb({ url, alt, size = 36 }: { url: string | null; alt: string; size?: number }) {
  if (!url) {
    return (
      <div
        className="rounded-[6px] bg-[#efebe5] flex items-center justify-center shrink-0 border border-neutral-200/40"
        style={{ width: size, height: size }}
      >
        <ShoppingBag className="w-4 h-4 text-neutral-500" />
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={alt}
      width={size}
      height={size}
      className="rounded-[6px] object-cover shrink-0 border border-neutral-200/40"
      style={{ width: size, height: size }}
    />
  );
}

function ProductForm({
  product,
  categories,
  saving,
  onClose,
  onSubmit,
}: {
  product: ApiProduct | null;
  categories: ApiCategory[];
  saving: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
}) {
  const [title, setTitle] = useState(product?.title ?? "");
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product?.price != null ? String(product.price) : "");
  const [priceInPoints, setPriceInPoints] = useState(product?.priceInPoints != null ? String(product.priceInPoints) : "");
  const [compareAtPrice, setCompareAtPrice] = useState(product?.compareAtPrice != null ? String(product.compareAtPrice) : "");
  const [status, setStatus] = useState(product?.status ?? "ACTIVE");
  const [stock, setStock] = useState(product?.stock != null ? String(product.stock) : "50");
  const [maxPerUser, setMaxPerUser] = useState(product?.maxPerUser != null ? String(product.maxPerUser) : "");
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured ?? false);
  const [imageUrl, setImageUrl] = useState(product?.imageUrl ?? "");

  const [sizes, setSizes] = useState<string[]>(product?.metadata?.options?.size ?? []);
  const [colors, setColors] = useState<string[]>(product?.metadata?.options?.color ?? []);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleToggleSize = (size: string) => {
    if (sizes.includes(size)) {
      setSizes(sizes.filter((s) => s !== size));
    } else {
      setSizes([...sizes, size]);
    }
  };

  const handleToggleColor = (colorName: string) => {
    if (colors.includes(colorName)) {
      setColors(colors.filter((c) => c !== colorName));
    } else {
      setColors([...colors, colorName]);
    }
  };

  const submit = async () => {
    if (!title.trim()) return setError("Product title is required");
    if (!price.trim() || isNaN(Number(price))) return setError("A valid price is required");

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      if (categoryId) formData.append("categoryId", categoryId);
      if (slug.trim()) formData.append("slug", slug.trim());
      formData.append("description", description.trim());
      formData.append("price", String(Number(price)));
      if (priceInPoints.trim()) formData.append("priceInPoints", String(Math.round(Number(priceInPoints)) || 0));
      if (compareAtPrice.trim()) formData.append("compareAtPrice", String(Number(compareAtPrice)));
      formData.append("status", status);
      formData.append("stock", String(Math.round(Number(stock)) || 0));
      if (maxPerUser.trim()) formData.append("maxPerUser", String(Math.round(Number(maxPerUser)) || 0));
      formData.append("isFeatured", String(isFeatured));

      if (imageFile) {
        formData.append("image", imageFile);
      } else if (imageUrl.trim()) {
        formData.append("imageUrl", imageUrl.trim());
      }

      const optionsObj: Record<string, string[]> = {};
      if (sizes.length > 0) optionsObj.size = sizes;
      if (colors.length > 0) optionsObj.color = colors;

      if (Object.keys(optionsObj).length > 0) {
        formData.append("metadata", JSON.stringify({ options: optionsObj }));
      } else {
        formData.append("metadata", JSON.stringify({}));
      }

      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <SlideOver
      onClose={onClose}
      header={
        <div>
          <p className="font-canela text-[20px] font-medium text-neutral-900 leading-tight">
            {product ? "Edit Product" : "Add Product"}
          </p>
          <p className="font-lato text-[13px] font-medium text-neutral-500 mt-0.5">
            Set pricing, inventory, categories, and variations.
          </p>
        </div>
      }
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="p-title" className={labelClass}>Product title *</label>
        <input id="p-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Bea Tee" className={inputClass} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <label htmlFor="p-category" className={labelClass}>Category</label>
          <select id="p-category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={`${inputClass} cursor-pointer`}>
            <option value="">Uncategorized</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="p-slug" className={labelClass}>Slug (Optional)</label>
          <input id="p-slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="bea-tee" className={inputClass} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="p-desc" className={labelClass}>Description</label>
        <textarea id="p-desc" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Detailed product description..." className={`${inputClass} resize-none`} />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col gap-2">
          <label htmlFor="p-price" className={labelClass}>Price ($ USD) *</label>
          <input id="p-price" type="text" inputMode="decimal" value={price} onChange={(e) => { const val = e.target.value; if (val === "" || /^\d*\.?\d{0,2}$/.test(val)) setPrice(val); }} placeholder="28.00" className={inputClass} />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="p-points" className={labelClass}>Price (Points)</label>
          <input id="p-points" type="number" min={0} value={priceInPoints} onChange={(e) => setPriceInPoints(e.target.value)} placeholder="e.g. 2800" className={inputClass} />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="p-compare" className={labelClass}>Compare Price</label>
          <input id="p-compare" type="number" step="0.01" min={0} value={compareAtPrice} onChange={(e) => setCompareAtPrice(e.target.value)} placeholder="Original price" className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col gap-2">
          <label htmlFor="p-stock" className={labelClass}>Stock *</label>
          <input id="p-stock" type="number" min={0} value={stock} onChange={(e) => setStock(e.target.value)} placeholder="50" className={inputClass} />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="p-max" className={labelClass}>Max Per User</label>
          <input id="p-max" type="number" min={0} value={maxPerUser} onChange={(e) => setMaxPerUser(e.target.value)} placeholder="No limit" className={inputClass} />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="p-status" className={labelClass}>Status</label>
          <select id="p-status" value={status} onChange={(e) => setStatus(e.target.value)} className={`${inputClass} cursor-pointer`}>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      {/* Image upload & fallback */}
      <div className="border border-neutral-200/60 rounded-[8px] p-4 bg-neutral-50/30 flex flex-col gap-3">
        <span className={labelClass}>Product Image</span>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 cursor-pointer border border-dashed border-neutral-300 hover:border-neutral-400 bg-white rounded-[8px] p-3 text-[13px] font-medium text-neutral-600 transition-colors">
            <FileImage className="w-4 h-4 text-neutral-400" />
            <span>{imageFile ? imageFile.name : "Choose local image file..."}</span>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} className="hidden" />
          </label>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-bold text-neutral-400 uppercase">
          <span className="h-[1px] bg-neutral-200 flex-1"></span>
          <span>Or</span>
          <span className="h-[1px] bg-neutral-200 flex-1"></span>
        </div>
        <div className="flex flex-col gap-2">
          <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Direct image URL (fallback)" className={inputClass} />
        </div>
      </div>

      {/* Featured checkbox */}
      <label className="flex items-center gap-3 cursor-pointer select-none py-1">
        <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 h-4.5 w-4.5" />
        <span className="font-lato text-[13px] font-bold text-neutral-700">Show as featured product on dashboard</span>
      </label>

      {/* Variations Section */}
      <div className="border border-neutral-200/60 rounded-[8px] p-4 bg-neutral-50/30 flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-neutral-200/50 pb-2.5">
          <Boxes className="w-4 h-4 text-neutral-500" />
          <span className="font-lato text-[14px] font-bold text-neutral-800">Variations & Options (Optional)</span>
        </div>

        {/* Sizes option */}
        <div className="flex flex-col gap-2">
          <span className={labelClass}>Available Sizes</span>
          <div className="flex flex-wrap gap-2">
            {SIZE_PRESETS.map((s) => {
              const active = sizes.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleToggleSize(s)}
                  className={`px-3.5 py-1.5 rounded-[8px] font-lato text-[12px] font-bold border transition-colors cursor-pointer ${
                    active
                      ? "bg-neutral-900 border-neutral-900 text-white"
                      : "bg-white border-neutral-200/80 text-neutral-600 hover:border-neutral-300"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* Colors option */}
        <div className="flex flex-col gap-2 mt-2">
          <span className={labelClass}>Available Colors</span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {COLOR_PRESETS.map((c) => {
              const active = colors.includes(c.name);
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => handleToggleColor(c.name)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-[8px] border transition-colors text-left cursor-pointer ${
                    active
                      ? "bg-[#efebe5] border-neutral-300"
                      : "bg-white border-neutral-200/80 hover:border-neutral-300"
                  }`}
                >
                  <span className={`w-4.5 h-4.5 rounded-full border ${c.colorClass} shrink-0`} />
                  <span className="font-lato text-[12px] font-bold text-neutral-700">{c.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {error && <p className="font-lato text-[12px] font-semibold text-[#b0453a]">{error}</p>}

      <button
        type="button"
        onClick={submit}
        disabled={saving}
        className="inline-flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-lato text-[14px] font-semibold px-5 py-2.5 rounded-full transition-colors disabled:opacity-60 cursor-pointer"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" strokeWidth={2} />}
        {product ? "Save changes" : "Add product"}
      </button>
    </SlideOver>
  );
}

function CategoryForm({
  category,
  saving,
  onClose,
  onSubmit,
}: {
  category: ApiCategory | null;
  saving: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
}) {
  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [description, setDescription] = useState(category?.description ?? "");
  const [sortOrder, setSortOrder] = useState(category?.sortOrder != null ? String(category.sortOrder) : "0");
  const [status, setStatus] = useState(category?.status ?? "ACTIVE");
  const [imageUrl, setImageUrl] = useState(category?.imageUrl ?? "");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!name.trim()) return setError("Category name is required");

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      if (slug.trim()) formData.append("slug", slug.trim());
      formData.append("description", description.trim());
      formData.append("sortOrder", String(Math.max(0, Number(sortOrder)) || 0));
      formData.append("status", status);

      if (imageFile) {
        formData.append("image", imageFile);
      } else if (imageUrl.trim()) {
        formData.append("imageUrl", imageUrl.trim());
      }

      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <SlideOver
      onClose={onClose}
      header={
        <div>
          <p className="font-canela text-[20px] font-medium text-neutral-900 leading-tight">
            {category ? "Edit Category" : "Add Category"}
          </p>
          <p className="font-lato text-[13px] font-medium text-neutral-500 mt-0.5">
            Organize products into apparel, accessories, or lifestyle.
          </p>
        </div>
      }
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="cat-name" className={labelClass}>Category name *</label>
        <input id="cat-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Apparel" className={inputClass} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <label htmlFor="cat-slug" className={labelClass}>Slug (Optional)</label>
          <input id="cat-slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="apparel" className={inputClass} />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="cat-sort" className={labelClass}>Sort Order</label>
          <input id="cat-sort" type="number" min={0} value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} placeholder="0" className={inputClass} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="cat-desc" className={labelClass}>Description</label>
        <textarea id="cat-desc" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional category description..." className={`${inputClass} resize-none`} />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="cat-status" className={labelClass}>Status</label>
        <select id="cat-status" value={status} onChange={(e) => setStatus(e.target.value)} className={`${inputClass} cursor-pointer`}>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      {/* Image upload & fallback */}
      <div className="border border-neutral-200/60 rounded-[8px] p-4 bg-neutral-50/30 flex flex-col gap-3">
        <span className={labelClass}>Category Image</span>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 cursor-pointer border border-dashed border-neutral-300 hover:border-neutral-400 bg-white rounded-[8px] p-3 text-[13px] font-medium text-neutral-600 transition-colors">
            <FileImage className="w-4 h-4 text-neutral-400" />
            <span>{imageFile ? imageFile.name : "Choose local image file..."}</span>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} className="hidden" />
          </label>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-bold text-neutral-400 uppercase">
          <span className="h-[1px] bg-neutral-200 flex-1"></span>
          <span>Or</span>
          <span className="h-[1px] bg-neutral-200 flex-1"></span>
        </div>
        <div className="flex flex-col gap-2">
          <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Direct image URL (fallback)" className={inputClass} />
        </div>
      </div>

      {error && <p className="font-lato text-[12px] font-semibold text-[#b0453a]">{error}</p>}

      <button
        type="button"
        onClick={submit}
        disabled={saving}
        className="inline-flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-lato text-[14px] font-semibold px-5 py-2.5 rounded-full transition-colors disabled:opacity-60 cursor-pointer"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" strokeWidth={2} />}
        {category ? "Save changes" : "Add category"}
      </button>
    </SlideOver>
  );
}

function ProductDetail({
  product,
  categories,
  onClose,
  onEdit,
  onDelete,
}: {
  product: ApiProduct;
  categories: ApiCategory[];
  onClose: () => void;
  onEdit: (p: ApiProduct) => void;
  onDelete: (id: string) => void;
}) {
  const catName = categories.find((c) => c.id === product.categoryId)?.name ?? "Uncategorized";

  return (
    <SlideOver
      onClose={onClose}
      header={
        <div>
          <p className="font-lato text-[11px] font-bold text-neutral-400 uppercase tracking-wider">{catName}</p>
          <p className="font-canela text-[22px] font-medium text-neutral-900 leading-tight mt-0.5">{product.title}</p>
        </div>
      }
    >
      {product.imageUrl && (
        <div className="w-full h-44 sm:h-52 rounded-[10px] overflow-hidden border border-neutral-200/50 mb-4 bg-[#f9f8f6] flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.imageUrl} alt={product.title} className="max-h-full max-w-full object-contain" />
        </div>
      )}

      <DetailSection title="Pricing & Inventory">
        <DetailRow label="Price (USD)" value={`$${product.price.toFixed(2)}`} />
        <DetailRow label="Price (Points)" value={product.priceInPoints != null ? `${product.priceInPoints.toLocaleString()} pts` : "—"} />
        <DetailRow label="Compare At Price" value={product.compareAtPrice != null ? `$${product.compareAtPrice.toFixed(2)}` : "—"} />
        <DetailRow label="In Stock" value={`${product.stock} units`} />
        <DetailRow label="Limit Per User" value={product.maxPerUser != null ? `${product.maxPerUser} units` : "No limit"} />
      </DetailSection>

      <DetailSection title="Details & Status">
        <DetailRow label="Slug" value={product.slug} />
        <DetailRow label="Featured Product" value={product.isFeatured ? "Yes" : "No"} />
        <DetailRow label="Status" value={<EntityStatusBadge status={product.status.toLowerCase() === "active" ? "active" : "inactive"} />} />
        <DetailRow label="Description" value={product.description ?? "—"} />
      </DetailSection>

      {(product.metadata?.options?.size || product.metadata?.options?.color) && (
        <DetailSection title="Variations & Options">
          {product.metadata.options.size && (
            <DetailRow
              label="Sizes"
              value={
                <div className="flex flex-wrap gap-1">
                  {product.metadata.options.size.map((s) => (
                    <span key={s} className="bg-[#efebe5] text-neutral-700 font-lato text-[11px] font-bold px-2 py-0.5 rounded-full border border-neutral-200/40">{s}</span>
                  ))}
                </div>
              }
            />
          )}
          {product.metadata.options.color && (
            <DetailRow
              label="Colors"
              value={
                <div className="flex flex-wrap gap-1.5">
                  {product.metadata.options.color.map((c) => (
                    <span key={c} className="inline-flex items-center gap-1.5 bg-[#efebe5] text-neutral-700 font-lato text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-neutral-200/40">
                      <span className={`w-3 h-3 rounded-full border ${getColorCircleClass(c)}`} />
                      {c}
                    </span>
                  ))}
                </div>
              }
            />
          )}
        </DetailSection>
      )}

      <div className="flex gap-3 border-t border-neutral-100 pt-4 mt-6">
        <button
          type="button"
          onClick={() => {
            onClose();
            onEdit(product);
          }}
          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-lato text-[13px] font-bold py-2 rounded-full transition-colors cursor-pointer"
        >
          <SquarePen className="w-4 h-4" />
          Edit
        </button>
        <button
          type="button"
          onClick={() => {
            onClose();
            onDelete(product.id);
          }}
          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#b0453a]/10 hover:bg-[#b0453a]/25 text-[#b0453a] font-lato text-[13px] font-bold py-2 rounded-full transition-colors cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    </SlideOver>
  );
}

function CategoryDetail({
  category,
  onClose,
  onEdit,
  onDelete,
}: {
  category: ApiCategory;
  onClose: () => void;
  onEdit: (c: ApiCategory) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <SlideOver
      onClose={onClose}
      header={
        <div>
          <p className="font-canela text-[22px] font-medium text-neutral-900 leading-tight">{category.name}</p>
        </div>
      }
    >
      {category.imageUrl && (
        <div className="w-full h-44 sm:h-52 rounded-[10px] overflow-hidden border border-neutral-200/50 mb-4 bg-[#f9f8f6] flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={category.imageUrl} alt={category.name} className="max-h-full max-w-full object-contain" />
        </div>
      )}

      <DetailSection title="Category Info">
        <DetailRow label="Slug" value={category.slug} />
        <DetailRow label="Sort Order" value={String(category.sortOrder)} />
        <DetailRow label="Status" value={<EntityStatusBadge status={category.status.toLowerCase() === "active" ? "active" : "inactive"} />} />
        <DetailRow label="Description" value={category.description ?? "—"} />
      </DetailSection>

      <div className="flex gap-3 border-t border-neutral-100 pt-4 mt-6">
        <button
          type="button"
          onClick={() => {
            onClose();
            onEdit(category);
          }}
          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-lato text-[13px] font-bold py-2 rounded-full transition-colors cursor-pointer"
        >
          <SquarePen className="w-4 h-4" />
          Edit
        </button>
        <button
          type="button"
          onClick={() => {
            onClose();
            onDelete(category.id);
          }}
          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#b0453a]/10 hover:bg-[#b0453a]/25 text-[#b0453a] font-lato text-[13px] font-bold py-2 rounded-full transition-colors cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    </SlideOver>
  );
}

export default function AdminShopPage() {
  const [tab, setTab] = useState<"products" | "categories">("products");

  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalProducts, setTotalProducts] = useState(0);

  const [addProdOpen, setAddProdOpen] = useState(false);
  const [editProd, setEditProd] = useState<ApiProduct | null>(null);
  const [viewProd, setViewProd] = useState<ApiProduct | null>(null);
  const [deleteProdId, setDeleteProdId] = useState<string | null>(null);

  const [addCatOpen, setAddCatOpen] = useState(false);
  const [editCat, setEditCat] = useState<ApiCategory | null>(null);
  const [viewCat, setViewCat] = useState<ApiCategory | null>(null);
  const [deleteCatId, setDeleteCatId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [catsRes, prodsRes] = await Promise.all([
        listCategories(),
        listProducts({
          page,
          limit,
          search: search || undefined,
          categoryId: filterCategory || undefined,
          status: filterStatus || undefined,
        }),
      ]);
      setCategories(catsRes);
      setProducts(prodsRes.items);
      setTotalProducts(prodsRes.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load shop data");
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, filterCategory, filterStatus]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  const handleCreateProduct = async (formData: FormData) => {
    setSaving(true);
    try {
      await createProduct(formData);
      setActionError(null);
      loadData();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to create product");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateProduct = async (formData: FormData) => {
    if (!editProd) return;
    setSaving(true);
    try {
      await updateProduct(editProd.id, formData);
      setActionError(null);
      loadData();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!deleteProdId) return;
    try {
      await deleteProduct(deleteProdId);
      setActionError(null);
      setDeleteProdId(null);
      loadData();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to delete product");
    }
  };

  const handleCreateCategory = async (formData: FormData) => {
    setSaving(true);
    try {
      await createCategory(formData);
      setActionError(null);
      loadData();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to create category");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateCategory = async (formData: FormData) => {
    if (!editCat) return;
    setSaving(true);
    try {
      await updateCategory(editCat.id, formData);
      setActionError(null);
      loadData();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to update category");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteCatId) return;
    try {
      await deleteCategory(deleteCatId);
      setActionError(null);
      setDeleteCatId(null);
      loadData();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to delete category");
    }
  };

  const prodColumns: Column<ApiProduct>[] = [
    {
      key: "product",
      header: "Product",
      cellClassName: "flex items-center gap-3 min-w-0",
      cell: (p) => (
        <>
          <ProductThumb url={p.imageUrl} alt={p.title} />
          <div className="min-w-0">
            <p className="font-lato text-[14px] font-bold text-neutral-900 truncate leading-tight">{p.title}</p>
            <p className="font-lato text-[11px] font-medium text-neutral-500 truncate leading-tight mt-0.5">
              {categories.find((c) => c.id === p.categoryId)?.name ?? "Uncategorized"}
            </p>
          </div>
        </>
      ),
    },
    {
      key: "price",
      header: "Price",
      cellClassName: "font-lato text-[13px] font-bold text-neutral-800",
      cell: (p) => (
        <div>
          <span>${p.price.toFixed(2)}</span>
          {p.priceInPoints != null && (
            <span className="block text-[11px] font-medium text-neutral-400 mt-0.5">
              or {p.priceInPoints.toLocaleString()} pts
            </span>
          )}
        </div>
      ),
    },
    {
      key: "stock",
      header: "Stock",
      cellClassName: "font-lato text-[13px] font-bold text-neutral-600",
      cell: (p) => `${p.stock} units`,
    },
    {
      key: "featured",
      header: "Featured",
      cellClassName: "font-lato text-[13px] font-bold",
      cell: (p) =>
        p.isFeatured ? (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200/50 text-[10px] uppercase font-bold tracking-wider">
            <Sparkles className="w-3 h-3" /> Featured
          </span>
        ) : (
          <span className="text-neutral-400 font-medium">—</span>
        ),
    },
    {
      key: "status",
      header: "Status",
      cell: (p) => <EntityStatusBadge status={p.status.toLowerCase() === "active" ? "active" : "inactive"} />,
    },
    {
      key: "actions",
      header: "",
      cellClassName: "flex items-center justify-end gap-1.5",
      cell: (p) => (
        <>
          <IconButton label="View Details" onClick={() => setViewProd(p)}>
            <Eye className="w-4.5 h-4.5" />
          </IconButton>
          <IconButton label="Edit" onClick={() => setEditProd(p)}>
            <SquarePen className="w-4.5 h-4.5" />
          </IconButton>
          <IconButton label="Delete" onClick={() => setDeleteProdId(p.id)} danger>
            <Trash2 className="w-4.5 h-4.5" />
          </IconButton>
        </>
      ),
    },
  ];

  const catColumns: Column<ApiCategory>[] = [
    {
      key: "category",
      header: "Category Name",
      cellClassName: "flex items-center gap-3 min-w-0",
      cell: (c) => (
        <>
          <ProductThumb url={c.imageUrl} alt={c.name} />
          <div className="min-w-0">
            <p className="font-lato text-[14px] font-bold text-neutral-900 truncate">{c.name}</p>
          </div>
        </>
      ),
    },
    {
      key: "slug",
      header: "Slug",
      cellClassName: "font-lato text-[13px] font-medium text-neutral-500",
      cell: (c) => c.slug,
    },
    {
      key: "sortOrder",
      header: "Sort Order",
      cellClassName: "font-lato text-[13px] font-bold text-neutral-700",
      cell: (c) => String(c.sortOrder),
    },
    {
      key: "status",
      header: "Status",
      cell: (c) => <EntityStatusBadge status={c.status.toLowerCase() === "active" ? "active" : "inactive"} />,
    },
    {
      key: "actions",
      header: "",
      cellClassName: "flex items-center justify-end gap-1.5",
      cell: (c) => (
        <div className="flex items-center justify-end gap-1.5">
          <IconButton label="View Details" onClick={() => setViewCat(c)}>
            <Eye className="w-4.5 h-4.5" />
          </IconButton>
          <IconButton label="Edit" onClick={() => setEditCat(c)}>
            <SquarePen className="w-4.5 h-4.5" />
          </IconButton>
          <IconButton label="Delete" onClick={() => setDeleteCatId(c.id)} danger>
            <Trash2 className="w-4.5 h-4.5" />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <main className="flex-1 flex flex-col gap-6 md:gap-8 min-w-0">
      <title>Shop Settings - Bea Admin</title>

      <PageHeading title="Shop Management" subtitle="Create products, manage inventories, categories, and custom variations." />

      {/* Tabs selector */}
      <div className="flex items-center justify-between border-b border-neutral-200/60 pb-3">
        <div className="flex gap-4">
          <button
            onClick={() => setTab("products")}
            className={`font-lato text-[14px] font-bold tracking-wide uppercase pb-2 border-b-2 transition-all ${
              tab === "products" ? "border-neutral-900 text-neutral-900" : "border-transparent text-neutral-400 hover:text-neutral-600"
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setTab("categories")}
            className={`font-lato text-[14px] font-bold tracking-wide uppercase pb-2 border-b-2 transition-all ${
              tab === "categories" ? "border-neutral-900 text-neutral-900" : "border-transparent text-neutral-400 hover:text-neutral-600"
            }`}
          >
            Categories
          </button>
        </div>

        <button
          onClick={() => (tab === "products" ? setAddProdOpen(true) : setAddCatOpen(true))}
          className="inline-flex items-center gap-2 bg-neutral-950 hover:bg-neutral-850 text-white font-lato text-[13px] font-bold tracking-wide uppercase px-4 py-2 rounded-full transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          {tab === "products" ? "Add Product" : "Add Category"}
        </button>
      </div>

      {error && (
        <div className="bg-[#b0453a]/10 border border-[#b0453a]/20 rounded-[12px] p-4 text-[#b0453a] text-[13px] font-bold flex items-center gap-2.5">
          <AlertCircle className="w-4.5 h-4.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {actionError && (
        <div className="bg-[#b0453a]/10 border border-[#b0453a]/20 rounded-[12px] p-4 text-[#b0453a] text-[13px] font-bold flex items-center gap-2.5">
          <AlertCircle className="w-4.5 h-4.5 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {tab === "products" ? (
        <>
          {/* Products Filter Section */}
          <section className="bg-[#fbfbf9] border border-neutral-200/50 rounded-[12px] p-4 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full font-lato text-[16px] md:text-[14px] text-neutral-800 bg-white border border-neutral-200/70 rounded-[8px] pl-10 pr-3 py-2.5 focus:outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select
                value={filterCategory}
                onChange={(e) => {
                  setFilterCategory(e.target.value);
                  setPage(1);
                }}
                className={selectClass}
                aria-label="Filter by category"
              >
                <option value="">All categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setPage(1);
                }}
                className={selectClass}
                aria-label="Filter by status"
              >
                <option value="">All statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </section>

          <DataTable
            rows={products}
            columns={prodColumns}
            gridCols="grid-cols-[1.8fr_1fr_1fr_1fr_1fr_0.8fr]"
            minWidth="1000px"
            getRowKey={(p) => p.id}
            loading={loading}
            pagination={{
              page,
              pageSize: limit,
              total: totalProducts,
              onPageChange: setPage,
              onPageSizeChange: (size) => {
                setLimit(size);
                setPage(1);
              },
            }}
            renderCard={(p) => (
              <div className="bg-white border border-neutral-200/60 rounded-[10px] p-4 flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <ProductThumb url={p.imageUrl} alt={p.title} size={40} />
                  <div className="min-w-0 flex-1">
                    <p className="font-lato text-[15px] font-bold text-neutral-900 truncate leading-tight">{p.title}</p>
                    <p className="font-lato text-[12px] font-medium text-neutral-500 truncate mt-0.5">
                      {categories.find((c) => c.id === p.categoryId)?.name ?? "Uncategorized"}
                    </p>
                  </div>
                  <EntityStatusBadge status={p.status.toLowerCase() === "active" ? "active" : "inactive"} />
                </div>
                <div className="flex items-center justify-between gap-4 font-lato text-[12px] font-medium text-neutral-500 border-t border-neutral-100 pt-2.5 mt-1">
                  <span>${p.price.toFixed(2)}</span>
                  <span>{p.stock} in stock</span>
                </div>
                <div className="flex items-center justify-end gap-2 mt-2">
                  <IconButton label="View Details" onClick={() => setViewProd(p)}>
                    <Eye className="w-4.5 h-4.5" />
                  </IconButton>
                  <IconButton label="Edit" onClick={() => setEditProd(p)}>
                    <SquarePen className="w-4.5 h-4.5" />
                  </IconButton>
                  <IconButton label="Delete" onClick={() => setDeleteProdId(p.id)} danger>
                    <Trash2 className="w-4.5 h-4.5" />
                  </IconButton>
                </div>
              </div>
            )}
            countLabel={(n) => `${n} ${n === 1 ? "product" : "products"}`}
            emptyTitle="No products found"
            emptyText="Add a product to start configuring shop items."
          />
        </>
      ) : (
        <DataTable
          rows={categories}
          columns={catColumns}
          gridCols="grid-cols-[2fr_1.5fr_1fr_1fr_1fr]"
          minWidth="800px"
          getRowKey={(c) => c.id}
          loading={loading}
          renderCard={(c) => (
            <div className="bg-white border border-neutral-200/60 rounded-[10px] p-4 flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <ProductThumb url={c.imageUrl} alt={c.name} size={40} />
                <div className="min-w-0 flex-1">
                  <p className="font-lato text-[15px] font-bold text-neutral-900 truncate leading-tight">{c.name}</p>
                  <p className="font-lato text-[12px] font-medium text-neutral-500 truncate mt-0.5">{c.slug}</p>
                </div>
                <EntityStatusBadge status={c.status.toLowerCase() === "active" ? "active" : "inactive"} />
              </div>
              <div className="flex items-center justify-between gap-4 font-lato text-[12px] font-medium text-neutral-500 border-t border-neutral-100 pt-2.5 mt-1">
                <span>Sort order: {c.sortOrder}</span>
                <div className="flex items-center gap-1.5">
                  <IconButton label="View Details" onClick={() => setViewCat(c)}>
                    <Eye className="w-4.5 h-4.5" />
                  </IconButton>
                  <IconButton label="Edit" onClick={() => setEditCat(c)}>
                    <SquarePen className="w-4.5 h-4.5" />
                  </IconButton>
                  <IconButton label="Delete" onClick={() => setDeleteCatId(c.id)} danger>
                    <Trash2 className="w-4.5 h-4.5" />
                  </IconButton>
                </div>
              </div>
            </div>
          )}
          countLabel={(n) => `${n} ${n === 1 ? "category" : "categories"}`}
          emptyTitle="No categories found"
          emptyText="Add a category to start organizing products."
        />
      )}

      {/* Forms & SlideOvers */}
      {addProdOpen && (
        <ProductForm
          product={null}
          categories={categories}
          saving={saving}
          onClose={() => setAddProdOpen(false)}
          onSubmit={handleCreateProduct}
        />
      )}

      {editProd && (
        <ProductForm
          product={editProd}
          categories={categories}
          saving={saving}
          onClose={() => setEditProd(null)}
          onSubmit={handleUpdateProduct}
        />
      )}

      {viewProd && (
        <ProductDetail
          product={viewProd}
          categories={categories}
          onClose={() => setViewProd(null)}
          onEdit={setEditProd}
          onDelete={setDeleteProdId}
        />
      )}

      {addCatOpen && (
        <CategoryForm category={null} saving={saving} onClose={() => setAddCatOpen(false)} onSubmit={handleCreateCategory} />
      )}

      {editCat && (
        <CategoryForm category={editCat} saving={saving} onClose={() => setEditCat(null)} onSubmit={handleUpdateCategory} />
      )}

      {viewCat && (
        <CategoryDetail
          category={viewCat}
          onClose={() => setViewCat(null)}
          onEdit={setEditCat}
          onDelete={setDeleteCatId}
        />
      )}

      {deleteProdId && (
        <ConfirmDialog
          title="Archive product?"
          message="This product will be archived (soft-deleted). Users will no longer be able to purchase it. This cannot be undone."
          confirmLabel="Archive"
          danger
          onConfirm={handleDeleteProduct}
          onClose={() => setDeleteProdId(null)}
        />
      )}

      {deleteCatId && (
        <ConfirmDialog
          title="Delete category?"
          message="This category will be permanently removed. Any products currently assigned to it will become uncategorized. This cannot be undone."
          confirmLabel="Delete"
          danger
          onConfirm={handleDeleteCategory}
          onClose={() => setDeleteCatId(null)}
        />
      )}
    </main>
  );
}
