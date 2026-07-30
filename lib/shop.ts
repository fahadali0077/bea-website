import productsData from "@/config/shop-products.json";

export type ShopCategory = "apparel" | "beach" | "lifestyle";

export type ShopProduct = {
  id: string;
  name: string;
  category: ShopCategory;
  categoryName?: string;
  price: number;
  points: number;
  badge: string | null;
  image: string | null;
  description: string;
  colors: string[];
  sizes: string[];
};

export const shopProducts = productsData as ShopProduct[];

export let dynamicProducts: ShopProduct[] = [];

export function setDynamicProducts(products: ShopProduct[]) {
  dynamicProducts = products;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapApiProductToShopProduct(apiProduct: any): ShopProduct {
  const colors = apiProduct.metadata?.options?.color ?? [];
  const sizes = apiProduct.metadata?.options?.size ?? [];

  return {
    id: apiProduct.id,
    name: apiProduct.title,
    category: (apiProduct.category?.slug ?? "apparel") as ShopCategory,
    categoryName: apiProduct.category?.name ?? undefined,
    price: Number(apiProduct.price),
    points: apiProduct.priceInPoints ?? 0,
    badge: apiProduct.isFeatured ? "Popular" : null,
    image: apiProduct.imageUrl,
    description: apiProduct.description ?? "",
    colors,
    sizes,
  };
}

export function getProduct(id: string): ShopProduct | undefined {
  return dynamicProducts.find((p) => p.id === id) || shopProducts.find((p) => p.id === id);
}

export function formatPrice(amount: number): string {
  return `$${amount.toLocaleString()}`;
}

export const CATEGORY_LABELS: Record<ShopCategory, string> = {
  apparel: "Apparel",
  beach: "Beach",
  lifestyle: "Lifestyle",
};

export const shopCategories = Object.keys(CATEGORY_LABELS) as ShopCategory[];

export const COLOR_SWATCHES: Record<string, string> = {
  Black: "#1f1d1b",
  White: "#ffffff",
  Natural: "#efe7db",
  Tan: "#c9a06a",
  Navy: "#2b3a55",
  Blue: "#3b6ea5",
  Sand: "#d8c4a0",
  Coral: "#e8785f",
  Teal: "#3d8a80",
  Silver: "#c0c0c0",
  Gold: "#d4af37",
};
