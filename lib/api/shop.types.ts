export interface ShopCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShopProduct {
  id: string;
  categoryId: string | null;
  title: string;
  slug: string;
  description: string | null;
  price: string; // The backend returns decimal price as a string
  priceInPoints: number | null;
  compareAtPrice: string | null;
  status: string;
  stock: number;
  maxPerUser: number | null;
  imageUrl: string | null;
  isFeatured: boolean;
  metadata: {
    options?: {
      size?: string[];
      color?: string[];
    };
  } | null;
  createdAt: string;
  updatedAt: string;
  category?: ShopCategory | null;
}

export interface ListProductsParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  featured?: boolean;
  search?: string;
}

export interface ProductsListResponse {
  items: ShopProduct[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
