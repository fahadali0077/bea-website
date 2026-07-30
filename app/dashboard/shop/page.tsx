"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, Loader2, Package, Plus, SlidersHorizontal } from "lucide-react";
import {
  formatPrice,
  mapApiProductToShopProduct,
  setDynamicProducts,
  type ShopProduct,
} from "@/lib/shop";
import { ColorSwatches } from "@/app/components/shop/ColorSwatches";
import { ShopBagButton } from "@/app/components/shop/ShopBagButton";
import { useCart } from "@/app/components/shop/CartProvider";
import { useListShopCategoriesQuery, useListShopProductsQuery } from "@/features/api/apiSlice";

const BADGE_TONE: Record<string, string> = {
  New: "bg-[#e7f0ea] text-[#3d7a6e]",
  Popular: "bg-[#efebe5] text-[#584939]",
  Limited: "bg-[#faf0eb] text-[#b0453a]",
  "Grand prize": "bg-[#fbf3df] text-[#9a7320]",
};

function ProductCard({ product }: { product: ShopProduct }) {
  const { addItem } = useCart();
  const [selectedColor, setSelectedColor] = useState<string | null>(product.colors[0] ?? null);
  const [added, setAdded] = useState(false);
  const href = `/dashboard/shop/${product.id}`;
  const needsSize = product.sizes.length > 0;

  const handleAdd = () => {
    addItem({ productId: product.id, color: selectedColor, size: null, qty: 1 });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div className="bg-white border border-neutral-200/50 rounded-[10px] overflow-hidden flex flex-col shadow-[0_2px_12px_rgba(0,0,0,0.015)]">
      <Link href={href} className="relative aspect-square bg-[#f6f3ef] flex items-center justify-center p-5 group">
        {product.badge && (
          <span
            className={`absolute top-3 left-3 px-2.5 py-1 rounded-[4px] font-lato text-[10px] font-bold uppercase tracking-wide ${BADGE_TONE[product.badge] ?? "bg-neutral-100 text-neutral-600"}`}
          >
            {product.badge}
          </span>
        )}
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain mix-blend-multiply transition-transform duration-200 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-neutral-300">
            <Package className="w-10 h-10" strokeWidth={1.5} />
            <span className="font-lato text-[11px] font-medium text-center px-2 truncate w-full">{product.name}</span>
          </div>
        )}
      </Link>

      <div className="p-4 md:p-5 flex flex-col gap-3 flex-1">
        <div className="min-w-0">
          <Link href={href} className="font-lato text-[14px] md:text-[16px] font-bold text-neutral-900 truncate leading-tight block hover:text-black">
            {product.name}
          </Link>
          <p className="font-lato text-[11px] md:text-[13px] font-medium text-neutral-500 mt-0.5 line-clamp-2">
            {product.description}
          </p>
        </div>

        {product.colors.length > 0 ? (
          <ColorSwatches colors={product.colors} selected={selectedColor} onSelect={setSelectedColor} />
        ) : (
          <div className="h-5" aria-hidden />
        )}

        <div className="mt-auto flex items-end justify-between gap-2 pt-1">
          <div>
            <p className="font-lato text-[16px] md:text-[18px] font-bold text-neutral-900 leading-none">
              {formatPrice(product.price)}
            </p>
            <p className="font-lato text-[11px] font-medium text-neutral-400 mt-1">
              or {product.points.toLocaleString()} pts
            </p>
          </div>

          {needsSize ? (
            <Link
              href={href}
              className="inline-flex items-center gap-1.5 font-lato text-[12px] md:text-[14px] font-bold px-4 py-2 rounded-[8px] shadow-sm bg-neutral-900 text-white hover:bg-neutral-800 transition-all active:scale-[0.98]"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" strokeWidth={2.2} />
              Options
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleAdd}
              className={`inline-flex items-center gap-1.5 font-lato text-[12px] md:text-[14px] font-bold px-4 py-2 rounded-[8px] shadow-sm transition-all active:scale-[0.98] cursor-pointer border-0 outline-none ${
                added ? "bg-[#e7f0ea] text-[#3d7a6e]" : "bg-neutral-900 text-white hover:bg-neutral-800"
              }`}
            >
              {added ? <Check className="w-4 h-4" strokeWidth={2.4} /> : <Plus className="w-4 h-4" strokeWidth={2.2} />}
              {added ? "Added" : "Add"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  const [filter, setFilter] = useState<string>("all");

  const { data: categoriesData } = useListShopCategoriesQuery();
  const { data: productsData, isLoading } = useListShopProductsQuery({ limit: 100 });

  const categories = useMemo(() => categoriesData ?? [], [categoriesData]);

  const products = useMemo(() => {
    if (!productsData?.items) return [];
    const mapped = productsData.items.map(mapApiProductToShopProduct);
    setDynamicProducts(mapped); // Cache them globally for details page lookup
    return mapped;
  }, [productsData]);

  const filters = useMemo(() => {
    return [
      { value: "all", label: "All" },
      ...categories.map((c) => ({ value: c.id, label: c.name })),
    ];
  }, [categories]);

  const filteredProducts = useMemo(() => {
    if (filter === "all") return products;
    return products.filter((p) => {
      const rawProd = productsData?.items?.find((item) => item.id === p.id);
      return rawProd?.categoryId === filter;
    });
  }, [products, filter, productsData]);

  return (
    <main className="flex-1 flex flex-col gap-5 min-w-0">
      <title>Shop - Bea</title>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] md:text-[36px] font-canela font-medium tracking-tight text-neutral-900 leading-tight">
            Shop
          </h1>
          <p className="text-[12px] md:text-[18px] font-lato font-medium text-neutral-500 mt-0.5">
            Bea merch and rewards for the community
          </p>
        </div>
        <ShopBagButton />
      </div>

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {filters.map((item) => {
          const active = filter === item.value;
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={`shrink-0 font-lato font-black text-[9px] md:text-[12px] uppercase tracking-wider px-4 py-2.5 rounded-[4px] shadow-sm transition-all duration-200 cursor-pointer ${
                active
                  ? "bg-[#584939] text-white border border-[#584939]"
                  : "bg-white text-neutral-500 border border-neutral-200/80 hover:bg-neutral-50 hover:text-neutral-800"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-neutral-300 animate-spin" />
          <p className="font-lato text-[13px] font-medium text-neutral-400 mt-2">Loading products…</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-neutral-400">
          <Package className="w-12 h-12" strokeWidth={1.5} />
          <p className="font-lato text-[14px] font-bold mt-2">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
