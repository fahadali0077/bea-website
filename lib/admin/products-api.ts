import { asArray, call, num, str, type RawRecord } from "./http";

export type ProductMetadata = {
  options?: {
    size?: string[];
    color?: string[];
  };
};

export type ApiProduct = {
  id: string;
  categoryId: string | null;
  title: string;
  slug: string;
  description: string | null;
  price: number;
  priceInPoints: number | null;
  compareAtPrice: number | null;
  status: string;
  stock: number;
  maxPerUser: number | null;
  imageUrl: string | null;
  isFeatured: boolean;
  metadata: ProductMetadata;
  createdAt?: string;
  updatedAt?: string;
};

export type ApiCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  status: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ProductFilters = {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  status?: string;
};

export type ProductListResult = {
  items: ApiProduct[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

function parseMetadata(rawMeta: unknown): ProductMetadata {
  if (!rawMeta) return {};
  if (typeof rawMeta === "object") return rawMeta as ProductMetadata;
  if (typeof rawMeta === "string") {
    try {
      return JSON.parse(rawMeta) as ProductMetadata;
    } catch {
      return {};
    }
  }
  return {};
}

export function normalizeProduct(raw: RawRecord): ApiProduct {
  return {
    id: str(raw.id),
    categoryId: raw.categoryId ? str(raw.categoryId) : null,
    title: str(raw.title),
    slug: str(raw.slug),
    description: raw.description ? str(raw.description) : null,
    price: num(raw.price),
    priceInPoints: raw.priceInPoints != null ? num(raw.priceInPoints) : null,
    compareAtPrice: raw.compareAtPrice != null ? num(raw.compareAtPrice) : null,
    status: str(raw.status, "ACTIVE"),
    stock: num(raw.stock, 0),
    maxPerUser: raw.maxPerUser != null ? num(raw.maxPerUser) : null,
    imageUrl: raw.imageUrl ? str(raw.imageUrl) : null,
    isFeatured: !!raw.isFeatured,
    metadata: parseMetadata(raw.metadata),
    createdAt: raw.createdAt as string | undefined,
    updatedAt: raw.updatedAt as string | undefined,
  };
}

export function normalizeCategory(raw: RawRecord): ApiCategory {
  return {
    id: str(raw.id),
    name: str(raw.name),
    slug: str(raw.slug),
    description: raw.description ? str(raw.description) : null,
    imageUrl: raw.imageUrl ? str(raw.imageUrl) : null,
    sortOrder: num(raw.sortOrder, 0),
    status: str(raw.status, "ACTIVE"),
    createdAt: raw.createdAt as string | undefined,
    updatedAt: raw.updatedAt as string | undefined,
  };
}

export async function listProducts(filters: ProductFilters = {}): Promise<ProductListResult> {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.search?.trim()) params.set("search", filters.search.trim());
  if (filters.categoryId) params.set("categoryId", filters.categoryId);
  if (filters.status) params.set("status", filters.status);

  const query = params.toString();
  const suffix = query ? `?${query}` : "";
  const payload = await call<RawRecord>(`/api/admin/products${suffix}`);
  const root = (payload.data as RawRecord) ?? payload;

  const items = asArray(root.products) ?? asArray(root.items) ?? asArray(root.data) ?? asArray(root) ?? [];
  const meta = (payload.pagination ?? root.pagination ?? payload.meta ?? root.meta ?? {}) as RawRecord;
  const total = num(meta.total ?? meta.totalItems ?? meta.count, items.length);
  const limit = num(meta.limit ?? meta.perPage, filters.limit ?? 10) || (filters.limit ?? 10);
  const page = num(meta.page ?? meta.currentPage, filters.page ?? 1) || (filters.page ?? 1);
  const totalPages = num(meta.totalPages ?? meta.pageCount, Math.max(1, Math.ceil(total / limit)));

  return {
    items: items.map(normalizeProduct),
    total,
    page,
    limit,
    totalPages,
  };
}

export async function createProduct(formData: FormData): Promise<ApiProduct> {
  const payload = await call<RawRecord>("/api/admin/products", {
    method: "POST",
    body: formData,
  });
  const raw = (payload.product ?? payload.data ?? payload) as RawRecord;
  return normalizeProduct(raw);
}

export async function updateProduct(id: string, formData: FormData): Promise<ApiProduct> {
  const payload = await call<RawRecord>(`/api/admin/products/${id}`, {
    method: "PUT",
    body: formData,
  });
  const raw = (payload.product ?? payload.data ?? payload) as RawRecord;
  return normalizeProduct(raw);
}

export async function deleteProduct(id: string): Promise<void> {
  await call(`/api/admin/products/${id}`, { method: "DELETE" });
}

export async function listCategories(): Promise<ApiCategory[]> {
  const payload = await call<RawRecord>("/api/admin/products/categories");
  const root = (payload.data as RawRecord) ?? payload;
  const items = asArray(root.categories) ?? asArray(root.items) ?? asArray(root.data) ?? asArray(root) ?? [];
  return items.map(normalizeCategory);
}

export async function createCategory(formData: FormData): Promise<ApiCategory> {
  const payload = await call<RawRecord>("/api/admin/products/categories", {
    method: "POST",
    body: formData,
  });
  const raw = (payload.category ?? payload.data ?? payload) as RawRecord;
  return normalizeCategory(raw);
}

export async function updateCategory(id: string, formData: FormData): Promise<ApiCategory> {
  const payload = await call<RawRecord>(`/api/admin/products/categories/${id}`, {
    method: "PUT",
    body: formData,
  });
  const raw = (payload.category ?? payload.data ?? payload) as RawRecord;
  return normalizeCategory(raw);
}

export async function deleteCategory(id: string): Promise<void> {
  await call(`/api/admin/products/categories/${id}`, { method: "DELETE" });
}
