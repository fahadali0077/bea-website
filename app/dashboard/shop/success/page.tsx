"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useCart } from "@/app/components/shop/CartProvider";

type OrderSummary = {
  amountTotal: number | null;
  currency: string | null;
  email: string | null;
  paymentStatus: string | null;
};

function SuccessInner() {
  const params = useSearchParams();
  const successId = params.get("payment_intent") ?? params.get("session_id");
  const { clear } = useCart();
  const cleared = useRef(false);

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<OrderSummary | null>(null);

  useEffect(() => {
    if (!cleared.current) {
      clear();
      cleared.current = true;
    }
  }, [clear]);

  useEffect(() => {
    if (!successId) {
      setLoading(false);
      return;
    }

    const queryParam = successId.startsWith("pi_") ? "payment_intent" : "session_id";
    const queryValue = encodeURIComponent(successId);

    let active = true;
    fetch(`/api/shop/checkout?${queryParam}=${queryValue}`)
      .then((res) => res.json())
      .then((data) => {
        if (active && data.ok) {
          setOrder({
            amountTotal: data.amountTotal ?? null,
            currency: data.currency ?? null,
            email: data.email ?? null,
            paymentStatus: data.paymentStatus ?? null,
          });
        }
      })
      .catch(() => { })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [successId]);

  const total =
    order?.amountTotal != null
      ? `${(order.amountTotal / 100).toLocaleString(undefined, { style: "currency", currency: (order.currency ?? "usd").toUpperCase() })}`
      : null;

  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-4 py-24 text-center">
      <div className="w-16 h-16 rounded-full bg-[#e7f0ea] flex items-center justify-center text-[#3d7a6e]">
        <CheckCircle2 className="w-8 h-8" strokeWidth={2} />
      </div>
      <div>
        <h1 className="text-[24px] md:text-[32px] font-canela font-medium tracking-tight text-neutral-900">
          Thank you for your order!
        </h1>
        <p className="font-lato text-[14px] md:text-[16px] font-medium text-neutral-500 mt-1.5">
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Confirming your payment…
            </span>
          ) : total ? (
            <>
              We charged <span className="font-bold text-neutral-700">{total}</span>
              {order?.email ? (
                <> and sent a receipt to <span className="font-bold text-neutral-700">{order.email}</span>.</>
              ) : (
                "."
              )}
            </>
          ) : (
            "Your payment is being processed — we'll email you the details."
          )}
        </p>
      </div>
      <Link
        href="/dashboard/shop"
        className="mt-2 inline-flex items-center gap-2 font-lato text-[14px] font-bold px-6 py-3 rounded-[8px] bg-neutral-900 text-white hover:bg-neutral-800 transition-colors"
      >
        Continue shopping
      </Link>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center py-24 text-neutral-400">Loading…</div>}>
      <SuccessInner />
    </Suspense>
  );
}
