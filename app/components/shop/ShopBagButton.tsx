"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/app/components/shop/CartProvider";

export function ShopBagButton() {
  const { count } = useCart();

  return (
    <Link
      href="/dashboard/shop/cart"
      className="relative shrink-0 inline-flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-[8px] border border-neutral-200 bg-[#faf9f6] text-neutral-600 hover:text-neutral-900 hover:border-neutral-300 transition-all cursor-pointer"
      aria-label={`Bag with ${count} items`}
    >
      <ShoppingBag className="w-4.5 h-4.5" strokeWidth={2} />
      {count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-[#584939] text-white font-lato text-[11px] font-bold flex items-center justify-center">
          {count}
        </span>
      )}
    </Link>
  );
}
