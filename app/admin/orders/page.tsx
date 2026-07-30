"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Search,
  Eye,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Truck,
} from "lucide-react";
import {
  listOrders,
  updateOrderStatus,
  type ApiOrder,
} from "@/lib/admin/orders-api";
import { PageHeading } from "@/app/components/admin/PageHeading";
import { SlideOver } from "@/app/components/admin/SlideOver";
import { DetailRow, DetailSection } from "@/app/components/admin/DetailList";
import { DataTable, type Column } from "@/app/components/admin/DataTable";
import { IconButton } from "@/app/components/admin/IconButton";

const inputClass =
  "w-full font-lato text-[14px] text-neutral-800 bg-white border border-neutral-200/70 rounded-[8px] px-3.5 py-2 focus:outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400";
const selectClass =
  "font-lato text-[13px] font-bold text-neutral-700 bg-white border border-neutral-200/70 rounded-[8px] px-3.5 py-2.5 cursor-pointer focus:outline-none focus:border-neutral-400 transition-colors uppercase tracking-wide";
const labelClass = "font-lato text-[11px] font-bold text-neutral-400 uppercase tracking-wider";

const ORDER_STATUS_PRESETS = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
];

const getStatusBadgeStyle = (status: string): string => {
  switch (status.toUpperCase()) {
    case "PENDING":
      return "bg-amber-50 text-amber-800 border-amber-200";
    case "CONFIRMED":
      return "bg-blue-50 text-blue-800 border-blue-200";
    case "PROCESSING":
      return "bg-purple-50 text-purple-800 border-purple-200";
    case "SHIPPED":
      return "bg-teal-50 text-teal-800 border-teal-200";
    case "DELIVERED":
      return "bg-emerald-50 text-emerald-800 border-emerald-200";
    case "CANCELLED":
      return "bg-neutral-50 text-neutral-500 border-neutral-200";
    case "REFUNDED":
      return "bg-rose-50 text-rose-800 border-rose-200";
    default:
      return "bg-neutral-50 text-neutral-800 border-neutral-200";
  }
};

function OrderStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadgeStyle(
        status
      )}`}
    >
      {status}
    </span>
  );
}

function formatDate(isoString: string | null): string {
  if (!isoString) return "—";
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoString;
  }
}

function OrderDetail({
  order,
  saving,
  onClose,
  onUpdateStatus,
}: {
  order: ApiOrder;
  saving: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, status: string, adminNotes: string, trackingNumber: string) => Promise<void>;
}) {
  const [status, setStatus] = useState(order.status);
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber ?? "");
  const [adminNotes, setAdminNotes] = useState(order.adminNotes ?? "");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    try {
      await onUpdateStatus(order.id, status, adminNotes, trackingNumber);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update order status");
    }
  };

  return (
    <SlideOver
      onClose={onClose}
      header={
        <div>
          <div className="flex items-center gap-2.5">
            <p className="font-canela text-[20px] font-medium text-neutral-900 leading-tight">
              Order Details
            </p>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="font-lato text-[13px] font-medium text-neutral-500 mt-0.5">
            {order.orderNumber}
          </p>
        </div>
      }
    >
      {/* Customer Info */}
      <DetailSection title="Customer Details">
        <DetailRow label="Name" value={order.user?.fullName ?? order.shippingName} />
        <DetailRow label="Email" value={order.user?.email ?? "—"} />
        <DetailRow label="Notes" value={order.notes ?? "—"} />
      </DetailSection>

      {/* Shipping Address */}
      <DetailSection title="Shipping Address">
        <DetailRow label="Ship To" value={order.shippingName} />
        <DetailRow label="Line 1" value={order.shippingLine1} />
        {order.shippingLine2 && <DetailRow label="Line 2" value={order.shippingLine2} />}
        <DetailRow
          label="City / State"
          value={`${order.shippingCity}, ${order.shippingState} ${order.shippingZip}`}
        />
        <DetailRow label="Phone" value={order.shippingPhone ?? "—"} />
      </DetailSection>

      {/* Payment & Order Summary */}
      <DetailSection title="Payment Info">
        <DetailRow label="Payment Method" value={order.paymentMethod.toUpperCase()} />
        <DetailRow label="Subtotal" value={`$${order.subtotal.toFixed(2)}`} />
        {order.discount > 0 && <DetailRow label="Discount" value={`-$${order.discount.toFixed(2)}`} />}
        <DetailRow label="Total Paid" value={`$${order.total.toFixed(2)}`} />
        {order.pointsUsed > 0 && <DetailRow label="Points Redeemed" value={`${order.pointsUsed.toLocaleString()} pts`} />}
        <DetailRow label="Paid At" value={formatDate(order.paidAt)} />
        <DetailRow label="Stripe Intent ID" value={order.stripePaymentIntentId ?? "—"} />
      </DetailSection>

      {/* Order Timeline */}
      <DetailSection title="Timeline">
        <DetailRow label="Created" value={formatDate(order.createdAt)} />
        <DetailRow label="Confirmed" value={formatDate(order.confirmedAt)} />
        <DetailRow label="Shipped" value={formatDate(order.shippedAt)} />
        <DetailRow label="Delivered" value={formatDate(order.deliveredAt)} />
        {order.cancelledAt && <DetailRow label="Cancelled" value={formatDate(order.cancelledAt)} />}
      </DetailSection>

      {/* Ordered Items */}
      <div className="border border-neutral-200/50 rounded-[12px] p-4 bg-neutral-50/20 flex flex-col gap-3">
        <span className="font-lato text-[12px] font-bold text-neutral-800 uppercase tracking-wider border-b border-neutral-200/50 pb-2">
          Ordered Items
        </span>
        <div className="flex flex-col gap-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-start justify-between gap-4 text-[13px]">
              <div>
                <p className="font-bold text-neutral-800">{item.product?.title ?? "Unknown Product"}</p>
                {item.selectedOptions && (
                  <p className="text-[11px] font-bold text-neutral-400 mt-0.5">
                    {Object.entries(item.selectedOptions)
                      .map(([k, v]) => `${k.toUpperCase()}: ${v}`)
                      .join(" · ")}
                  </p>
                )}
              </div>
              <div className="text-right font-bold text-neutral-700 shrink-0">
                <p>Qty: {item.quantity}</p>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  {item.pointsCost > 0 ? `${item.pointsCost.toLocaleString()} pts` : `$${item.unitPrice.toFixed(2)}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Update Order Status Form */}
      <form onSubmit={handleSubmit} className="border border-neutral-200/60 rounded-[12px] p-4 bg-neutral-50/50 flex flex-col gap-4">
        <span className="font-lato text-[12px] font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-2">
          <Truck className="w-4 h-4 text-neutral-500" />
          Fulfillment & Action
        </span>

        <div className="flex flex-col gap-2">
          <label htmlFor="o-status" className={labelClass}>Order Status</label>
          <select id="o-status" value={status} onChange={(e) => setStatus(e.target.value)} className={inputClass}>
            {ORDER_STATUS_PRESETS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="o-tracking" className={labelClass}>Tracking Number</label>
          <input
            id="o-tracking"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="e.g. USPS 94001000..."
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="o-notes" className={labelClass}>Admin Notes</label>
          <textarea
            id="o-notes"
            rows={3}
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Internal fulfillment logs..."
            className={`${inputClass} resize-none`}
          />
        </div>

        {error && <p className="font-lato text-[12px] font-semibold text-[#b0453a]">{error}</p>}
        {success && <p className="font-lato text-[12px] font-semibold text-emerald-700">Order status updated successfully!</p>}

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-lato text-[13px] font-bold uppercase py-2.5 rounded-full transition-colors cursor-pointer disabled:opacity-60"
        >
          {saving ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : <CheckCircle2 className="w-4.5 h-4.5" />}
          Update status
        </button>
      </form>
    </SlideOver>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [viewOrder, setViewOrder] = useState<ApiOrder | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listOrders({
        page,
        limit,
        status: filterStatus || undefined,
      });
      setOrders(res.items);
      setTotal(res.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [page, limit, filterStatus]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  const handleUpdateStatus = async (id: string, status: string, adminNotes: string, trackingNumber: string) => {
    setSaving(true);
    setActionError(null);
    try {
      const updated = await updateOrderStatus(id, status, adminNotes, trackingNumber);
      setActionError(null);
      setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
      if (viewOrder && viewOrder.id === id) {
        setViewOrder(updated);
      }
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to update status");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return (
      o.orderNumber.toLowerCase().includes(term) ||
      o.shippingName.toLowerCase().includes(term) ||
      (o.user?.fullName && o.user.fullName.toLowerCase().includes(term)) ||
      (o.user?.email && o.user.email.toLowerCase().includes(term))
    );
  });

  const columns: Column<ApiOrder>[] = [
    {
      key: "order",
      header: "Order Details",
      cellClassName: "flex flex-col gap-0.5 min-w-0",
      cell: (o) => (
        <>
          <p className="font-lato text-[14px] font-bold text-neutral-900 truncate leading-tight">
            {o.orderNumber}
          </p>
          <p className="font-lato text-[11px] font-medium text-neutral-500 truncate leading-tight mt-0.5">
            {o.user?.fullName ?? o.shippingName} · {o.user?.email ?? "no email"}
          </p>
        </>
      ),
    },
    {
      key: "items",
      header: "Items Purchased",
      cellClassName: "font-lato text-[13px] font-medium text-neutral-600 truncate max-w-[200px]",
      cell: (o) => {
        if (o.items.length === 0) return "—";
        const firstItem = o.items[0];
        const title = firstItem.product?.title ?? "Product";
        const qty = firstItem.quantity;
        const extra = o.items.length - 1;
        return extra > 0 ? `${title} (x${qty}) +${extra} more` : `${title} (x${qty})`;
      },
    },
    {
      key: "total",
      header: "Total",
      cellClassName: "font-lato text-[13px] font-bold text-neutral-800",
      cell: (o) => (
        <div>
          <span>${o.total.toFixed(2)}</span>
          {o.pointsUsed > 0 && (
            <span className="block text-[11px] font-medium text-neutral-400 mt-0.5">
              {o.pointsUsed.toLocaleString()} pts
            </span>
          )}
        </div>
      ),
    },
    {
      key: "payment",
      header: "Payment Method",
      cellClassName: "font-lato text-[11px] font-bold uppercase text-neutral-400 tracking-wider",
      cell: (o) => o.paymentMethod,
    },
    {
      key: "date",
      header: "Date Placed",
      cellClassName: "font-lato text-[13px] font-medium text-neutral-600",
      cell: (o) => formatDate(o.createdAt),
    },
    {
      key: "status",
      header: "Status",
      cell: (o) => <OrderStatusBadge status={o.status} />,
    },
    {
      key: "actions",
      header: "",
      cellClassName: "flex items-center justify-end",
      cell: (o) => (
        <IconButton label="View Details" onClick={() => setViewOrder(o)}>
          <Eye className="w-4.5 h-4.5" />
        </IconButton>
      ),
    },
  ];

  return (
    <main className="flex-1 flex flex-col gap-6 md:gap-8 min-w-0">
      <title>Orders Settings - Bea Admin</title>

      <PageHeading title="Orders Management" subtitle="Track customer purchase orders, manage tracking numbers, and update fulfillment status." />

      {error && (
        <div className="bg-[#b0453a]/10 border border-[#b0453a]/20 rounded-[12px] p-4 text-[#b0453a] text-[13px] font-bold flex items-center gap-2.5">
          <AlertCircle className="w-4.5 h-4.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {actionError && (
        <div className="bg-[#b0453a]/10 border border-[#b0453a]/20 rounded-[12px] p-4 text-[#b0453a] text-[13px] font-bold flex items-center gap-2.5">
          <AlertCircle className="w-4.5 h-4.5 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Filter Section */}
      <section className="bg-[#fbfbf9] border border-neutral-200/50 rounded-[12px] p-4 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search order number or client..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full font-lato text-[14px] text-neutral-800 bg-white border border-neutral-200/70 rounded-[8px] pl-10 pr-3 py-2.5 focus:outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400"
          />
        </div>
        <div className="flex gap-3">
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setPage(1);
            }}
            className={selectClass}
            aria-label="Filter by status"
          >
            <option value="">All statuses</option>
            {ORDER_STATUS_PRESETS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </section>

      <DataTable
        rows={filteredOrders}
        columns={columns}
        gridCols="grid-cols-[1.5fr_1.5fr_1fr_1fr_1.5fr_1fr_0.5fr]"
        minWidth="1000px"
        getRowKey={(o) => o.id}
        loading={loading}
        pagination={{
          page,
          pageSize: limit,
          total: total,
          onPageChange: setPage,
          onPageSizeChange: (size) => {
            setLimit(size);
            setPage(1);
          },
        }}
        renderCard={(o) => (
          <div className="bg-white border border-neutral-200/60 rounded-[10px] p-4 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-lato text-[15px] font-bold text-neutral-900 truncate leading-tight">
                  {o.orderNumber}
                </p>
                <p className="font-lato text-[12px] font-medium text-neutral-500 truncate mt-0.5">
                  {o.user?.fullName ?? o.shippingName}
                </p>
              </div>
              <OrderStatusBadge status={o.status} />
            </div>
            <div className="flex items-center justify-between gap-4 font-lato text-[12px] font-medium text-neutral-500 border-t border-neutral-100 pt-2.5 mt-1">
              <span>Total: ${o.total.toFixed(2)}</span>
              <span>{formatDate(o.createdAt)}</span>
            </div>
            <div className="flex items-center justify-end gap-2 mt-2">
              <IconButton label="View Details" onClick={() => setViewOrder(o)}>
                <Eye className="w-4.5 h-4.5" />
              </IconButton>
            </div>
          </div>
        )}
        countLabel={(n) => `${n} ${n === 1 ? "order" : "orders"}`}
        emptyTitle="No orders found"
        emptyText="There are no purchase logs found."
      />

      {viewOrder && (
        <OrderDetail
          order={viewOrder}
          saving={saving}
          onClose={() => setViewOrder(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </main>
  );
}
