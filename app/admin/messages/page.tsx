"use client";

import { useCallback, useEffect, useState } from "react";
import { Send, Eye, Megaphone, Mail, MessagesSquare, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import {
  listMessages,
  sendMessage,
  type ApiMessage,
  type MessageTargetType,
  type DeliveryChannel,
  type SendMessageInput,
} from "@/lib/admin/messages-api";
import { listMarkets } from "@/lib/admin/markets-api";
import { listSchools } from "@/lib/admin/schools-api";
import { Badge } from "@/app/components/admin/Badge";
import { PageHeading } from "@/app/components/admin/PageHeading";
import { StatCard } from "@/app/components/admin/StatCard";
import { SlideOver } from "@/app/components/admin/SlideOver";
import { DataTable, type Column } from "@/app/components/admin/DataTable";
import { IconButton } from "@/app/components/admin/IconButton";

const GRID_COLS = "grid-cols-[minmax(220px,2fr)_minmax(140px,1fr)_130px_120px_90px]";

const inputClass =
  "w-full font-lato text-[14px] text-neutral-800 bg-white border border-neutral-200/80 rounded-[8px] px-3.5 py-2.5 focus:outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400";
const labelClass = "font-lato text-[13px] font-bold text-neutral-700";

const dateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });
function formatDate(iso?: string | null) {
  return iso ? dateFmt.format(new Date(iso)) : "—";
}

const CHANNEL_TONE: Record<DeliveryChannel, string> = {
  forum: "bg-[#f0eef7] text-[#6a5b8a]",
  email: "bg-[#eef2f7] text-[#5b6b7d]",
  both: "bg-[#e7f0ea] text-[#3d7a6e]",
};
const CHANNEL_LABEL: Record<DeliveryChannel, string> = { forum: "Forum", email: "Email", both: "Forum + Email" };

function ChannelBadge({ channel }: { channel: DeliveryChannel }) {
  return <Badge tone={CHANNEL_TONE[channel]}>{CHANNEL_LABEL[channel]}</Badge>;
}

function audienceLabel(message: ApiMessage): string {
  switch (message.targetType) {
    case "all":
      return "Everyone";
    case "ambassadors":
      return "Ambassadors";
    case "school":
      return message.targetName ?? "A school";
    case "market":
      return message.targetName ?? "A market";
  }
}

type Option = { id: string; name: string };

function ComposeMessage({
  saving,
  onClose,
  onSend,
}: {
  saving: boolean;
  onClose: () => void;
  onSend: (values: SendMessageInput) => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [targetType, setTargetType] = useState<MessageTargetType>("all");
  const [targetId, setTargetId] = useState("");
  const [channel, setChannel] = useState<DeliveryChannel>("both");
  const [schools, setSchools] = useState<Option[]>([]);
  const [markets, setMarkets] = useState<Option[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (targetType === "market" && markets.length === 0) {
      listMarkets({ page: 1, limit: 100 })
        .then((r) => setMarkets(r.items.map((m) => ({ id: m.id, name: m.name }))))
        .catch(() => {});
    }
    if (targetType === "school" && schools.length === 0) {
      listSchools({ page: 1, limit: 100 })
        .then((r) => setSchools(r.items.map((s) => ({ id: s.id, name: s.name }))))
        .catch(() => {});
    }
  }, [targetType, markets.length, schools.length]);

  const options = targetType === "school" ? schools : targetType === "market" ? markets : [];

  const submit = async () => {
    if (!title.trim()) return setError("Subject is required");
    if (!body.trim()) return setError("Message body is required");
    if ((targetType === "school" || targetType === "market") && !targetId) return setError("Select a target");
    try {
      await onSend({
        title: title.trim(),
        body: body.trim(),
        targetType,
        targetId: targetType === "school" || targetType === "market" ? targetId : undefined,
        deliveryChannel: channel,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    }
  };

  return (
    <SlideOver
      onClose={onClose}
      header={
        <div>
          <p className="font-canela text-[20px] font-medium text-neutral-900 leading-tight">New message</p>
          <p className="font-lato text-[13px] font-medium text-neutral-500 mt-0.5">Send a system message or email to a selected audience.</p>
        </div>
      }
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="msg-title" className={labelClass}>Subject</label>
        <input id="msg-title" value={title} onChange={(e) => { setTitle(e.target.value); setError(null); }} placeholder="Message subject" className={inputClass} />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="msg-body" className={labelClass}>Message</label>
        <textarea id="msg-body" rows={5} value={body} onChange={(e) => { setBody(e.target.value); setError(null); }} placeholder="Write your message…" className={`${inputClass} resize-none`} />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="msg-target" className={labelClass}>Audience</label>
        <select
          id="msg-target"
          value={targetType}
          onChange={(e) => { setTargetType(e.target.value as MessageTargetType); setTargetId(""); setError(null); }}
          className={`${inputClass} cursor-pointer`}
        >
          <option value="all">Everyone</option>
          <option value="ambassadors">Ambassadors only</option>
          <option value="school">Specific school</option>
          <option value="market">Specific market</option>
        </select>
      </div>

      {(targetType === "school" || targetType === "market") && (
        <div className="flex flex-col gap-2">
          <label htmlFor="msg-target-id" className={labelClass}>{targetType === "school" ? "School" : "Market"}</label>
          <select id="msg-target-id" value={targetId} onChange={(e) => { setTargetId(e.target.value); setError(null); }} className={`${inputClass} cursor-pointer`}>
            <option value="">{options.length === 0 ? "Loading…" : `Select a ${targetType}`}</option>
            {options.map((o) => (
              <option key={o.id} value={o.id}>{o.name}</option>
            ))}
          </select>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="msg-channel" className={labelClass}>Delivery channel</label>
        <select id="msg-channel" value={channel} onChange={(e) => setChannel(e.target.value as DeliveryChannel)} className={`${inputClass} cursor-pointer`}>
          <option value="forum">Forum / system message</option>
          <option value="email">Email</option>
          <option value="both">Forum + Email</option>
        </select>
      </div>

      {error && <p className="font-lato text-[12px] font-semibold text-[#b0453a]">{error}</p>}

      <button
        type="button"
        onClick={submit}
        disabled={saving}
        className="inline-flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-lato text-[14px] font-semibold px-5 py-2.5 rounded-full transition-colors disabled:opacity-60"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" strokeWidth={2} />}
        Send message
      </button>
    </SlideOver>
  );
}

function MessageDetail({ message, onClose }: { message: ApiMessage; onClose: () => void }) {
  return (
    <SlideOver
      onClose={onClose}
      header={
        <div>
          <p className="font-canela text-[19px] font-medium text-neutral-900 leading-snug">{message.title}</p>
          <div className="flex items-center gap-2 mt-2">
            <ChannelBadge channel={message.deliveryChannel} />
            <span className="font-lato text-[12px] font-medium text-neutral-500">{formatDate(message.sentAt ?? message.createdAt)}</span>
          </div>
        </div>
      }
    >
      <div>
        <p className="font-lato text-[12px] font-medium text-neutral-400 leading-none">Audience</p>
        <p className="font-lato text-[14px] font-semibold text-neutral-800 mt-1">{audienceLabel(message)}</p>
      </div>
      <div className="bg-white border border-neutral-200/60 rounded-[10px] p-4">
        <p className="font-lato text-[14px] text-neutral-700 leading-relaxed whitespace-pre-line">{message.body}</p>
      </div>
    </SlideOver>
  );
}

export default function AdminMessagesPage() {
  const [items, setItems] = useState<ApiMessage[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [composing, setComposing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [viewing, setViewing] = useState<ApiMessage | null>(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await listMessages(page, limit);
      setItems(result.items);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load messages");
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleSend = async (values: SendMessageInput) => {
    setSaving(true);
    try {
      await sendMessage(values);
      setPage(1);
      fetchMessages();
    } finally {
      setSaving(false);
    }
  };

  const emailCount = items.filter((m) => m.deliveryChannel !== "forum").length;
  const forumCount = items.filter((m) => m.deliveryChannel !== "email").length;

  const columns: Column<ApiMessage>[] = [
    {
      key: "message",
      header: "Message",
      cellClassName: "min-w-0",
      cell: (m) => (
        <div className="min-w-0">
          <p className="font-lato text-[14px] font-bold text-neutral-900 truncate leading-tight">{m.title}</p>
          <p className="font-lato text-[12px] font-medium text-neutral-500 truncate leading-tight mt-0.5">{m.body}</p>
        </div>
      ),
    },
    { key: "audience", header: "Audience", cell: (m) => audienceLabel(m), cellClassName: "font-lato text-[13px] font-medium text-neutral-700 truncate" },
    { key: "channel", header: "Channel", cell: (m) => <ChannelBadge channel={m.deliveryChannel} /> },
    { key: "sent", header: "Sent", cell: (m) => formatDate(m.sentAt ?? m.createdAt), cellClassName: "font-lato text-[13px] font-medium text-neutral-600" },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "justify-self-end",
      cellClassName: "justify-self-end",
      cell: (m) => (
        <div className="md:justify-self-end">
          <IconButton label="View" onClick={() => setViewing(m)}>
            <Eye className="w-4 h-4" strokeWidth={2} />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <main className="flex-1 flex flex-col gap-6 md:gap-8 min-w-0">
      <title>Messaging - Bea Admin</title>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <PageHeading title="Messaging" subtitle="Send system messages and emails to targeted audiences." />
        <button
          type="button"
          onClick={() => setComposing(true)}
          className="inline-flex items-center justify-center gap-2 self-start bg-neutral-900 hover:bg-neutral-800 text-white font-lato text-[14px] font-semibold px-5 py-2.5 rounded-full transition-colors shrink-0"
        >
          <Send className="w-4 h-4" strokeWidth={2} />
          New message
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Messages sent" value={total.toLocaleString()} icon={<Megaphone className="w-5 h-5" strokeWidth={2.2} />} />
        <StatCard label="Via email" value={emailCount.toLocaleString()} icon={<Mail className="w-5 h-5" strokeWidth={2.2} />} />
        <StatCard label="Via forum" value={forumCount.toLocaleString()} icon={<MessagesSquare className="w-5 h-5" strokeWidth={2.2} />} />
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-[#faf0eb] border border-[#e8c9c1] rounded-[10px] px-4 py-3">
          <AlertCircle className="w-4 h-4 text-[#b0453a] shrink-0" strokeWidth={2} />
          <p className="font-lato text-[13px] font-semibold text-[#b0453a]">{error}</p>
        </div>
      )}

      <DataTable
        rows={items}
        columns={columns}
        gridCols={GRID_COLS}
        minWidth="760px"
        getRowKey={(m) => m.id}
        loading={loading}
        pagination={{
          page,
          pageSize: limit,
          total,
          onPageChange: setPage,
          onPageSizeChange: (size) => {
            setLimit(size);
            setPage(1);
          },
        }}
        renderCard={(m) => (
          <button
            type="button"
            onClick={() => setViewing(m)}
            className="w-full text-left bg-white border border-neutral-200/60 rounded-[10px] p-4 flex flex-col gap-3 hover:border-neutral-300 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-lato text-[15px] font-bold text-neutral-900 leading-snug">{m.title}</p>
                <p className="font-lato text-[12px] font-medium text-neutral-500 mt-1 line-clamp-2">{m.body}</p>
              </div>
              <ChannelBadge channel={m.deliveryChannel} />
            </div>
            <div className="flex items-center justify-between gap-3 font-lato text-[12px] font-medium text-neutral-500">
              <span>{audienceLabel(m)}</span>
              <span>{formatDate(m.sentAt ?? m.createdAt)}</span>
            </div>
          </button>
        )}
        countLabel={(n) => `${n} ${n === 1 ? "message" : "messages"}`}
        emptyTitle="No messages sent"
        emptyText="Compose a new message to reach your audience."
      />

      {composing && <ComposeMessage saving={saving} onClose={() => setComposing(false)} onSend={handleSend} />}
      {viewing && <MessageDetail message={viewing} onClose={() => setViewing(null)} />}
    </main>
  );
}
