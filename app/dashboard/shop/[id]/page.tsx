/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, Package, Minus, Plus, Check, Loader2 } from "lucide-react";
import { getProduct, CATEGORY_LABELS, formatPrice, mapApiProductToShopProduct } from "@/lib/shop";
import { ColorSwatches } from "@/app/components/shop/ColorSwatches";
import { ShopBagButton } from "@/app/components/shop/ShopBagButton";
import { useCart } from "@/app/components/shop/CartProvider";
import { useListShopProductsQuery } from "@/features/api/apiSlice";

const BADGE_TONE: Record<string, string> = {
  New: "bg-[#e7f0ea] text-[#3d7a6e]",
  Popular: "bg-[#efebe5] text-[#584939]",
  Limited: "bg-[#faf0eb] text-[#b0453a]",
  "Grand prize": "bg-[#fbf3df] text-[#9a7320]",
};

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const { addItem } = useCart();

  const { data: productsData, isLoading } = useListShopProductsQuery({ limit: 100 });

  const product = useMemo(() => {
    if (!productsData?.items) {
      return getProduct(params.id);
    }
    const matched = productsData.items.find((p) => p.id === params.id);
    return matched ? mapApiProductToShopProduct(matched) : undefined;
  }, [productsData, params.id]);

  const [color, setColor] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (product && !color && product.colors.length > 0) {
      setColor(product.colors[0]);
    }
  }, [product, color]);

  if (isLoading && !product) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center py-20 text-center">
        <Loader2 className="w-8 h-8 text-neutral-300 animate-spin" />
        <p className="font-lato text-[13px] font-medium text-neutral-400 mt-2">Loading product details…</p>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center gap-3 py-20 text-center">
        <p className="font-lato text-[16px] font-bold text-neutral-700">Product not found</p>
        <Link href="/dashboard/shop" className="font-lato text-[14px] font-semibold text-[#584939] underline underline-offset-2">
          Back to shop
        </Link>
      </main>
    );
  }

  const handleAdd = () => {
    if (product.sizes.length > 0 && !size) {
      setError("Please select a size");
      return;
    }
    addItem({ productId: product.id, color, size, qty });
    setError(null);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  const displayCategory = product.categoryName ?? CATEGORY_LABELS[product.category] ?? "Apparel";

  return (
    <main className="flex-1 flex flex-col gap-5 min-w-0">
      <title>{`${product.name} - Bea Shop`}</title>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/dashboard/shop"
            className="flex items-center justify-center w-9 h-9 rounded-[8px] border border-neutral-200 bg-[#faf9f6] text-neutral-600 hover:text-neutral-900 hover:border-neutral-300 transition-all shrink-0"
            aria-label="Back to shop"
          >
            <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
          </Link>
          <p className="font-lato text-[12px] md:text-[13px] font-medium text-neutral-400 truncate">
            <Link href="/dashboard/shop" className="hover:text-neutral-700">Shop</Link>
            <span className="mx-1.5">/</span>
            <span>{displayCategory}</span>
            <span className="mx-1.5">/</span>
            <span className="text-neutral-700 font-semibold">{product.name}</span>
          </p>
        </div>
        <ShopBagButton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
        <div className="relative aspect-square bg-[#f6f3ef] rounded-[12px] border border-neutral-200/50 flex items-center justify-center p-8">
          {product.badge && (
            <span
              className={`absolute top-4 left-4 px-2.5 py-1 rounded-[4px] font-lato text-[10px] font-bold uppercase tracking-wide ${BADGE_TONE[product.badge] ?? "bg-neutral-100 text-neutral-600"}`}
            >
              {product.badge}
            </span>
          )}
          {product.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-neutral-300">
              <Package className="w-14 h-14" strokeWidth={1.5} />
              <span className="font-lato text-[12px] font-medium">{product.name}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <p className="font-sfpro text-[11px] font-bold uppercase tracking-widest text-neutral-400">
              {displayCategory}
            </p>
            <h1 className="text-[26px] md:text-[34px] font-canela font-medium tracking-tight text-neutral-900 leading-tight mt-1">
              {product.name}
            </h1>
            <div className="flex items-baseline gap-3 mt-2">
              <span className="font-lato text-[22px] md:text-[24px] font-bold text-neutral-900">{formatPrice(product.price)}</span>
              <span className="font-lato text-[13px] font-medium text-neutral-400">or {product.points.toLocaleString()} pts</span>
            </div>
          </div>

          <p className="font-lato text-[14px] md:text-[15px] font-medium text-neutral-600 leading-relaxed">
            {product.description}
          </p>

          {product.colors.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="font-sfpro text-[11px] font-bold uppercase tracking-widest text-neutral-500">
                Color{color ? `: ${color}` : ""}
              </p>
              <ColorSwatches colors={product.colors} selected={color} onSelect={setColor} swatchClass="w-7 h-7" />
            </div>
          )}

          {product.sizes.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="font-sfpro text-[11px] font-bold uppercase tracking-widest text-neutral-500">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((value) => {
                  const active = size === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        setSize(value);
                        setError(null);
                      }}
                      className={`min-w-11 px-3 py-2 rounded-[8px] font-lato text-[13px] font-bold border transition-colors cursor-pointer ${
                        active
                          ? "bg-[#584939] text-white border-[#584939]"
                          : "bg-white text-neutral-700 border-neutral-200/80 hover:border-neutral-300"
                      }`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <p className="font-sfpro text-[11px] font-bold uppercase tracking-widest text-neutral-500">Quantity</p>
            <div className="inline-flex items-center border border-neutral-200/80 rounded-[8px] bg-white w-fit">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center text-neutral-600 hover:text-neutral-900 disabled:text-neutral-300 cursor-pointer"
                disabled={qty <= 1}
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" strokeWidth={2.2} />
              </button>
              <span className="w-10 text-center font-lato text-[15px] font-bold text-neutral-900">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                className="w-10 h-10 flex items-center justify-center text-neutral-600 hover:text-neutral-900 cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" strokeWidth={2.2} />
              </button>
            </div>
          </div>

          {error && <p className="font-lato text-[13px] font-semibold text-[#b0453a]">{error}</p>}

          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={handleAdd}
              className={`inline-flex items-center justify-center gap-2 font-lato text-[14px] font-bold px-6 py-3 rounded-[8px] shadow-sm transition-all active:scale-[0.98] cursor-pointer border-0 outline-none ${
                added ? "bg-[#e7f0ea] text-[#3d7a6e]" : "bg-neutral-900 text-white hover:bg-neutral-800"
              }`}
            >
              {added ? <Check className="w-4 h-4" strokeWidth={2.4} /> : null}
              {added ? "Added to bag" : "Add to bag"}
            </button>
            <Link
              href="/dashboard/shop/cart"
              className="font-lato text-[14px] font-semibold text-[#584939] hover:text-neutral-900 underline underline-offset-2"
            >
              View bag
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
