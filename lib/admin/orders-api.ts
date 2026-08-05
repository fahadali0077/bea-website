import { asArray, call, num, str, type RawRecord } from "./http";

export type OrderItemProduct = {
  id: string;
  title: string;
};

export type OrderItem = {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  pointsCost: number;
  totalPrice: number;
  selectedOptions: Record<string, string> | null;
  product: OrderItemProduct | null;
};

export type OrderUser = {
  id: string;
  fullName: string;
  email: string;
};

export type ApiOrder = {
  id: string;
  orderNumber: string;
  userId: string;
  status: string;
  subtotal: number;
  discount: number;
  total: number;
  pointsUsed: number;
  paymentMethod: string;
  shippingName: string;
  shippingLine1: string;
  shippingLine2: string | null;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  shippingPhone: string | null;
  trackingNumber: string | null;
  stripePaymentIntentId: string | null;
  stripeChargeId: string | null;
  paidAt: string | null;
  notes: string | null;
  adminNotes: string | null;
  cancelReason: string | null;
  confirmedAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
  user: OrderUser | null;
  items: OrderItem[];
};

export type OrderFilters = {
  page?: number;
  limit?: number;
  status?: string;
};

export type OrderListResult = {
  items: ApiOrder[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

function parseSelectedOptions(raw: unknown): Record<string, string> | null {
  if (!raw) return null;
  if (typeof raw === "object") return raw as Record<string, string>;
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as Record<string, string>;
    } catch {
      return null;
    }
  }
  return null;
}

export function normalizeOrderItem(raw: RawRecord): OrderItem {
  return {
    id: str(raw.id),
    orderId: str(raw.orderId),
    productId: str(raw.productId),
    quantity: num(raw.quantity, 1),
    unitPrice: num(raw.unitPrice),
    pointsCost: num(raw.pointsCost),
    totalPrice: num(raw.totalPrice),
    selectedOptions: parseSelectedOptions(raw.selectedOptions),
    product: raw.product
      ? {
          id: str((raw.product as RawRecord).id),
          title: str((raw.product as RawRecord).title),
        }
      : null,
  };
}

export function normalizeOrder(raw: RawRecord): ApiOrder {
  const items = asArray(raw.items) ?? [];
  const rawUser = raw.user as RawRecord | null;

  return {
    id: str(raw.id),
    orderNumber: str(raw.orderNumber),
    userId: str(raw.userId),
    status: str(raw.status, "PENDING"),
    subtotal: num(raw.subtotal),
    discount: num(raw.discount),
    total: num(raw.total),
    pointsUsed: num(raw.pointsUsed),
    paymentMethod: str(raw.paymentMethod),
    shippingName: str(raw.shippingName),
    shippingLine1: str(raw.shippingLine1),
    shippingLine2: raw.shippingLine2 ? str(raw.shippingLine2) : null,
    shippingCity: str(raw.shippingCity),
    shippingState: str(raw.shippingState),
    shippingZip: str(raw.shippingZip),
    shippingPhone: raw.shippingPhone ? str(raw.shippingPhone) : null,
    trackingNumber: raw.trackingNumber ? str(raw.trackingNumber) : null,
    stripePaymentIntentId: raw.stripePaymentIntentId ? str(raw.stripePaymentIntentId) : null,
    stripeChargeId: raw.stripeChargeId ? str(raw.stripeChargeId) : null,
    paidAt: raw.paidAt ? str(raw.paidAt) : null,
    notes: raw.notes ? str(raw.notes) : null,
    adminNotes: raw.adminNotes ? str(raw.adminNotes) : null,
    cancelReason: raw.cancelReason ? str(raw.cancelReason) : null,
    confirmedAt: raw.confirmedAt ? str(raw.confirmedAt) : null,
    shippedAt: raw.shippedAt ? str(raw.shippedAt) : null,
    deliveredAt: raw.deliveredAt ? str(raw.deliveredAt) : null,
    cancelledAt: raw.cancelledAt ? str(raw.cancelledAt) : null,
    createdAt: str(raw.createdAt),
    updatedAt: str(raw.updatedAt),
    user: rawUser
      ? {
          id: str(rawUser.id),
          fullName: str(rawUser.fullName),
          email: str(rawUser.email),
        }
      : null,
    items: items.map(normalizeOrderItem),
  };
}

export async function listOrders(filters: OrderFilters = {}): Promise<OrderListResult> {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.status) params.set("status", filters.status);

  const query = params.toString();
  const suffix = query ? `?${query}` : "";
  const payload = await call<RawRecord>(`/api/admin/orders${suffix}`);
  const root = (payload.data as RawRecord) ?? payload;

  const items = asArray(root.items) ?? asArray(root.orders) ?? asArray(root.data) ?? asArray(root) ?? [];
  const meta = (payload.pagination ?? root.pagination ?? payload.meta ?? root.meta ?? {}) as RawRecord;
  const total = num(meta.total ?? meta.totalItems ?? meta.count, items.length);
  const limit = num(meta.limit ?? meta.perPage, filters.limit ?? 20) || (filters.limit ?? 20);
  const page = num(meta.page ?? meta.currentPage, filters.page ?? 1) || (filters.page ?? 1);
  const totalPages = num(meta.totalPages ?? meta.pageCount, Math.max(1, Math.ceil(total / limit)));

  return {
    items: items.map(normalizeOrder),
    total,
    page,
    limit,
    totalPages,
  };
}

export async function updateOrderStatus(
  id: string,
  status: string,
  adminNotes?: string | null,
  trackingNumber?: string | null,
): Promise<ApiOrder> {
  const payload = await call<RawRecord>(`/api/admin/orders/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({
      status,
      adminNotes: adminNotes ?? "",
      trackingNumber: trackingNumber ?? "",
    }),
  });
  const raw = (payload.order ?? payload.data ?? payload) as RawRecord;
  return normalizeOrder(raw);
}
