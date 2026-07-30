import { getStripe } from "@/lib/stripe";
import { getProduct, mapApiProductToShopProduct } from "@/lib/shop";
import { getAdminToken } from "@/lib/admin/backend";

type IncomingLine = {
  productId: string;
  color: string | null;
  size: string | null;
  qty: number;
};

function resolveOrigin(request: Request): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? request.headers.get("origin") ?? new URL(request.url).origin;
}

function variantLabel(color: string | null, size: string | null): string {
  const parts = [color, size].filter(Boolean);
  return parts.length ? ` (${parts.join(", ")})` : "";
}

export async function POST(request: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return Response.json(
      { ok: false, message: "Payments are not configured yet. Add STRIPE_SECRET_KEY to enable checkout." },
      { status: 501 },
    );
  }

  const body = (await request.json().catch(() => null)) as { lines?: IncomingLine[] } | null;
  const lines = body?.lines ?? [];
  if (lines.length === 0) {
    return Response.json({ ok: false, message: "Your bag is empty." }, { status: 400 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let apiProducts: any[] = [];
  try {
    const adminToken = await getAdminToken().catch(() => null);
    const apiRoot = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000').replace(/\/$/, '');
    const res = await fetch(`${apiRoot}/api/products?limit=100`, {
      headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {},
      next: { revalidate: 0 }
    });
    if (res.ok) {
      const payload = await res.json();
      apiProducts = payload?.data?.items || payload || [];
    }
  } catch (err) {
    console.error("Failed to fetch products for checkout validation:", err);
  }

  const productsList = apiProducts.map(mapApiProductToShopProduct);

  const lineItems: Array<{
    quantity: number;
    price_data: {
      currency: string;
      unit_amount: number;
      product_data: { name: string; images?: string[]; metadata: Record<string, string> };
    };
  }> = [];

  for (const line of lines) {
    const product = productsList.find((p) => p.id === line.productId) || getProduct(line.productId);
    const qty = Math.max(1, Math.min(99, Math.floor(line.qty)));
    if (!product || !Number.isFinite(qty)) {
      return Response.json({ ok: false, message: "One or more items are no longer available." }, { status: 400 });
    }
    lineItems.push({
      quantity: qty,
      price_data: {
        currency: "usd",
        unit_amount: Math.round(product.price * 100),
        product_data: {
          name: `${product.name}${variantLabel(line.color, line.size)}`,
          images: product.image ? [product.image] : undefined,
          metadata: {
            productId: product.id,
            color: line.color ?? "",
            size: line.size ?? "",
          },
        },
      },
    });
  }

  const origin = resolveOrigin(request);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${origin}/dashboard/shop/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/dashboard/shop/cart`,
      billing_address_collection: "auto",
      shipping_address_collection: { allowed_countries: ["US"] },
      metadata: { source: "bea_shop" },
    });

    return Response.json({ ok: true, url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to start checkout.";
    return Response.json({ ok: false, message }, { status: 502 });
  }
}

export async function GET(request: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return Response.json({ ok: false, message: "Payments are not configured." }, { status: 501 });
  }

  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id");
  const paymentIntentId = url.searchParams.get("payment_intent");

  if (!sessionId && !paymentIntentId) {
    return Response.json({ ok: false, message: "Missing session or payment intent id." }, { status: 400 });
  }

  try {
    if (paymentIntentId) {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      return Response.json({
        ok: true,
        status: paymentIntent.status,
        paymentStatus: paymentIntent.status,
        amountTotal: paymentIntent.amount,
        currency: paymentIntent.currency,
        email: paymentIntent.receipt_email ?? null,
      });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId as string);
    return Response.json({
      ok: true,
      status: session.status,
      paymentStatus: session.payment_status,
      amountTotal: session.amount_total,
      currency: session.currency,
      email: session.customer_details?.email ?? null,
    });
  } catch {
    return Response.json({ ok: false, message: "Could not load your order." }, { status: 404 });
  }
}
