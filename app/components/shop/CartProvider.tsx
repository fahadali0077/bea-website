/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getProduct, mapApiProductToShopProduct } from "@/lib/shop";
import { useListShopProductsQuery } from "@/features/api/apiSlice";

const STORAGE_KEY = "bea_shop_cart";

export type CartLine = {
  productId: string;
  color: string | null;
  size: string | null;
  qty: number;
};

export function lineKey(line: Pick<CartLine, "productId" | "color" | "size">): string {
  return `${line.productId}|${line.color ?? ""}|${line.size ?? ""}`;
}

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  pointsTotal: number;
  addItem: (line: CartLine) => void;
  updateQty: (key: string, qty: number) => void;
  removeItem: (key: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const { data: productsData } = useListShopProductsQuery({ limit: 100 });
  const allProducts = useMemo(() => {
    if (!productsData?.items) return [];
    return productsData.items.map(mapApiProductToShopProduct);
  }, [productsData]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
    } catch {
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  const value = useMemo<CartContextValue>(() => {
    const addItem = (line: CartLine) => {
      setLines((prev) => {
        const key = lineKey(line);
        const index = prev.findIndex((l) => lineKey(l) === key);
        if (index >= 0) {
          const next = [...prev];
          next[index] = { ...next[index], qty: next[index].qty + line.qty };
          return next;
        }
        return [...prev, line];
      });
    };

    const updateQty = (key: string, qty: number) => {
      setLines((prev) =>
        qty <= 0
          ? prev.filter((l) => lineKey(l) !== key)
          : prev.map((l) => (lineKey(l) === key ? { ...l, qty } : l)),
      );
    };

    const removeItem = (key: string) => setLines((prev) => prev.filter((l) => lineKey(l) !== key));
    const clear = () => setLines([]);

    const count = lines.reduce((sum, l) => sum + l.qty, 0);
    
    const subtotal = lines.reduce((sum, l) => {
      const p = allProducts.find((item) => item.id === l.productId) || getProduct(l.productId);
      return sum + (p?.price ?? 0) * l.qty;
    }, 0);

    const pointsTotal = lines.reduce((sum, l) => {
      const p = allProducts.find((item) => item.id === l.productId) || getProduct(l.productId);
      return sum + (p?.points ?? 0) * l.qty;
    }, 0);

    return { lines, count, subtotal, pointsTotal, addItem, updateQty, removeItem, clear };
  }, [lines, allProducts]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
