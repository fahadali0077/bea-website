"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, Eye, Loader2, Pin, RotateCcw, Search, Trash2 } from "lucide-react";
import { Badge } from "@/app/components/admin/Badge";
import { DataTable, type Column } from "@/app/components/admin/DataTable";
import { IconButton } from "@/app/components/admin/IconButton";
import { PageHeading } from "@/app/components/admin/PageHeading";
import { SlideOver } from "@/app/components/admin/SlideOver";
import {
  getForumPostAdmin,
  listForumPostsAdmin,
  removeForumComment,
  removeForumPost,
  restoreForumComment,
  restoreForumPost,
  setForumPostPinned,
  type AdminForumComment,
  type AdminForumPost,
  type ForumScope,
  type ForumStatus,
} from "@/lib/admin/forum-api";

const GRID_COLS = "grid-cols-[minmax(260px,2fr)_100px_100px_90px_minmax(150px,auto)]";
const inputClass =
  "font-lato text-[13px] text-neutral-800 bg-white border border-neutral-200/80 rounded-[8px] px-3.5 py-2.5 focus:outline-none focus:border-neutral-400 transition-colors";
const dateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

function formatDate(value?: string) {
  return value ? dateFmt.format(new Date(value)) : "-";
}

function StatusBadge({ status }: { status: ForumStatus }) {
  return (
    <Badge tone={status === "ACTIVE" ? "bg-[#e7f0ea] text-[#3d7a6e]" : "bg-[#faf0eb] text-[#b0453a]"}>
      {status === "ACTIVE" ? "Active" : "Removed"}
    </Badge>
  );
}

function ScopeBadge({ scope }: { scope: ForumScope }) {
  const tone =
    scope === "NATIONAL"
      ? "bg-[#eef1f6] text-[#53637a]"
      : scope === "MARKET"
        ? "bg-[#f7efe0] text-[#7c5a22]"
        : "bg-[#e7f0ea] text-[#3d7a6e]";
  return <Badge tone={tone}>{scope.toLowerCase()}</Badge>;
}

function ReasonDialog({
  title,
  actionLabel,
  onCancel,
  onSubmit,
}: {
  title: string;
  actionLabel: string;
  onCancel: () => void;
  onSubmit: (reason: string) => Promise<void>;
}) {
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!reason.trim()) return setError("Reason is required");
    setSaving(true);
    setError(null);
    try {
      await onSubmit(reason.trim());
      onCancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Moderation action failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-[12px] shadow-xl border border-neutral-200 p-5 flex flex-col gap-4">
        <div>
          <p className="font-canela text-[22px] text-neutral-900">{title}</p>
          <p className="font-lato text-[13px] font-medium text-neutral-500 mt-1">
            This reason will be stored in moderation history.
          </p>
        </div>
        <textarea
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          rows={4}
          className={`${inputClass} resize-none`}
          placeholder="Explain why this action is needed..."
        />
        {error && <p className="font-lato text-[12px] font-semibold text-[#b0453a]">{error}</p>}
        <div className="flex items-center justify-end gap-2">
          <button type="button" onClick={onCancel} className="font-lato text-[13px] font-bold text-neutral-500 px-4 py-2">
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-neutral-900 text-white font-lato text-[13px] font-bold px-4 py-2 rounded-full disabled:opacity-60"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function PostReview({
  post,
  loading,
  onClose,
  onCommentAction,
}: {
  post: AdminForumPost | null;
  loading: boolean;
  onClose: () => void;
  onCommentAction: (comment: AdminForumComment, restore: boolean) => void;
}) {
  return (
    <SlideOver
      onClose={onClose}
      header={
        <div>
          <p className="font-canela text-[20px] font-medium text-neutral-900 leading-tight">Forum post review</p>
          <p className="font-lato text-[13px] font-medium text-neutral-500 mt-0.5">Original content and moderation history</p>
        </div>
      }
    >
      {loading || !post ? (
        <div className="flex items-center gap-2 text-neutral-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="font-lato text-[13px] font-semibold">Loading post...</span>
        </div>
      ) : (
        <>
          <div className="rounded-[10px] border border-neutral-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-3">
              <ScopeBadge scope={post.scope} />
              <StatusBadge status={post.status} />
              {post.isPinned && <Badge tone="bg-[#f7efe0] text-[#7c5a22]">Pinned</Badge>}
            </div>
            <p className="font-lato text-[15px] font-bold text-neutral-900">{post.title || "Untitled post"}</p>
            <p className="font-lato text-[13px] font-medium text-neutral-600 mt-2 whitespace-pre-wrap">{post.body}</p>
            <p className="font-lato text-[11px] font-semibold text-neutral-400 mt-3">
              By {post.user?.fullName || post.user?.email || "Unknown"} / {formatDate(post.createdAt)}
            </p>
          </div>

          <div>
            <p className="font-sfpro text-[12px] font-bold uppercase tracking-widest text-neutral-500 mb-3">Comments</p>
            <div className="flex flex-col gap-2">
              {post.comments?.length ? (
                post.comments.map((comment) => (
                  <div key={comment.id} className="rounded-[10px] border border-neutral-200 bg-white p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-lato text-[12px] font-bold text-neutral-800">
                          {comment.user?.fullName || comment.user?.email || "Unknown"}
                        </p>
                        <p className="font-lato text-[12px] font-medium text-neutral-600 mt-1">{comment.commentText}</p>
                      </div>
                      <IconButton
                        label={comment.status === "ACTIVE" ? "Remove comment" : "Restore comment"}
                        danger={comment.status === "ACTIVE"}
                        onClick={() => onCommentAction(comment, comment.status !== "ACTIVE")}
                      >
                        {comment.status === "ACTIVE" ? <Trash2 className="w-4 h-4" /> : <RotateCcw className="w-4 h-4" />}
                      </IconButton>
                    </div>
                    <p className="font-lato text-[11px] font-semibold text-neutral-400 mt-2">
                      {comment.status.toLowerCase()} / {formatDate(comment.createdAt)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="font-lato text-[13px] font-semibold text-neutral-500">No comments.</p>
              )}
            </div>
          </div>

          <div>
            <p className="font-sfpro text-[12px] font-bold uppercase tracking-widest text-neutral-500 mb-3">Moderation history</p>
            <div className="flex flex-col gap-2">
              {post.moderationActions?.length ? (
                post.moderationActions.map((action) => (
                  <div key={action.id} className="rounded-[10px] border border-neutral-200 bg-[#fbfbf9] p-3">
                    <p className="font-lato text-[12px] font-bold text-neutral-800">{action.actionType}</p>
                    <p className="font-lato text-[12px] font-medium text-neutral-600 mt-1">{action.reason}</p>
                    <p className="font-lato text-[11px] font-semibold text-neutral-400 mt-2">
                      {action.moderator?.email || action.moderatorAdminId} / {formatDate(action.createdAt)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="font-lato text-[13px] font-semibold text-neutral-500">No moderation actions yet.</p>
              )}
            </div>
          </div>
        </>
      )}
    </SlideOver>
  );
}

export default function AdminForumPage() {
  const [items, setItems] = useState<AdminForumPost[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [scope, setScope] = useState<ForumScope | "">("");
  const [status, setStatus] = useState<ForumStatus | "">("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [action, setAction] = useState<null | { title: string; label: string; run: (reason: string) => Promise<void> }>(null);
  const [reviewPost, setReviewPost] = useState<AdminForumPost | null>(null);
  const [reviewLoading, setReviewLoading] = useState(false);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await listForumPostsAdmin({ page, limit, scope, status, search });
      setItems(result.items);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load forum posts");
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, limit, scope, status, search]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void fetchPosts();
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [fetchPosts]);

  const refreshReview = async (id: string) => {
    setReviewLoading(true);
    try {
      setReviewPost(await getForumPostAdmin(id));
    } finally {
      setReviewLoading(false);
    }
  };

  const openReview = async (post: AdminForumPost) => {
    setReviewPost(post);
    await refreshReview(post.id);
  };

  const runAndRefresh = async (runner: (reason: string) => Promise<void>, reason: string) => {
    await runner(reason);
    await fetchPosts();
    if (reviewPost) await refreshReview(reviewPost.id);
  };

  const columns: Column<AdminForumPost>[] = [
    {
      key: "post",
      header: "Post",
      cell: (post) => (
        <div className="min-w-0">
          <p className="font-lato text-[14px] font-bold text-neutral-900 truncate">{post.title || "Untitled post"}</p>
          <p className="font-lato text-[12px] font-medium text-neutral-500 truncate mt-0.5">{post.body}</p>
          <p className="font-lato text-[11px] font-semibold text-neutral-400 mt-1">
            {post.user?.fullName || post.user?.email || "Unknown"} / {formatDate(post.createdAt)}
          </p>
        </div>
      ),
    },
    { key: "scope", header: "Scope", cell: (post) => <ScopeBadge scope={post.scope} /> },
    { key: "status", header: "Status", cell: (post) => <StatusBadge status={post.status} /> },
    { key: "stats", header: "Stats", cell: (post) => `${post.likesCount}/${post.commentsCount}`, cellClassName: "font-lato text-[13px] font-bold text-neutral-700" },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "justify-self-end",
      cellClassName: "justify-self-end",
      cell: (post) => (
        <div className="flex items-center justify-end gap-1">
          <IconButton label="Review" onClick={() => void openReview(post)}>
            <Eye className="w-4 h-4" />
          </IconButton>
          <IconButton
            label={post.isPinned ? "Unpin" : "Pin"}
            active={post.isPinned}
            onClick={() =>
              setAction({
                title: post.isPinned ? "Unpin post" : "Pin post",
                label: post.isPinned ? "Unpin" : "Pin",
                run: (reason) => runAndRefresh((value) => setForumPostPinned(post.id, !post.isPinned, value), reason),
              })
            }
          >
            <Pin className="w-4 h-4" />
          </IconButton>
          <IconButton
            label={post.status === "ACTIVE" ? "Remove" : "Restore"}
            danger={post.status === "ACTIVE"}
            onClick={() =>
              setAction({
                title: post.status === "ACTIVE" ? "Remove post" : "Restore post",
                label: post.status === "ACTIVE" ? "Remove" : "Restore",
                run: (reason) => runAndRefresh((value) => post.status === "ACTIVE" ? removeForumPost(post.id, value) : restoreForumPost(post.id, value), reason),
              })
            }
          >
            {post.status === "ACTIVE" ? <Trash2 className="w-4 h-4" /> : <RotateCcw className="w-4 h-4" />}
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <main className="flex-1 flex flex-col gap-6 md:gap-8 min-w-0">
      <title>Forum Moderation - Bea Admin</title>

      <PageHeading title="Forum Moderation" subtitle="Review forum posts, moderate comments, pin scope-specific announcements, and audit every action." />

      <div className="bg-[#fbfbf9] border border-neutral-200/50 rounded-[12px] p-4 flex flex-col lg:flex-row gap-3 lg:items-center">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            className={`${inputClass} w-full pl-9`}
            placeholder="Search posts, authors, or body text"
          />
        </div>
        <select value={scope} onChange={(event) => { setScope(event.target.value as ForumScope | ""); setPage(1); }} className={`${inputClass} cursor-pointer`}>
          <option value="">All scopes</option>
          <option value="CAMPUS">Campus</option>
          <option value="MARKET">Market</option>
          <option value="NATIONAL">National</option>
        </select>
        <select value={status} onChange={(event) => { setStatus(event.target.value as ForumStatus | ""); setPage(1); }} className={`${inputClass} cursor-pointer`}>
          <option value="">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Removed</option>
        </select>
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
        minWidth="820px"
        getRowKey={(post) => post.id}
        loading={loading}
        pagination={{ page, pageSize: limit, total, onPageChange: setPage, onPageSizeChange: (size) => { setLimit(size); setPage(1); } }}
        renderCard={(post) => (
          <div className="bg-white border border-neutral-200/60 rounded-[10px] p-4 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-lato text-[15px] font-bold text-neutral-900">{post.title || "Untitled post"}</p>
                <p className="font-lato text-[12px] font-medium text-neutral-500 line-clamp-2 mt-1">{post.body}</p>
              </div>
              <StatusBadge status={post.status} />
            </div>
            <div className="flex items-center gap-2">
              <ScopeBadge scope={post.scope} />
              {post.isPinned && <Badge tone="bg-[#f7efe0] text-[#7c5a22]">Pinned</Badge>}
            </div>
            <div className="flex items-center gap-1">
              {columns[4]?.cell(post)}
            </div>
          </div>
        )}
        countLabel={(count) => `${count} ${count === 1 ? "post" : "posts"}`}
        emptyTitle="No forum posts found"
        emptyText="Try a different scope, status, or search term."
      />

      {reviewPost && (
        <PostReview
          post={reviewPost}
          loading={reviewLoading}
          onClose={() => setReviewPost(null)}
          onCommentAction={(comment, restore) =>
            setAction({
              title: restore ? "Restore comment" : "Remove comment",
              label: restore ? "Restore" : "Remove",
              run: (reason) => runAndRefresh((value) => restore ? restoreForumComment(comment.id, value) : removeForumComment(comment.id, value), reason),
            })
          }
        />
      )}

      {action && (
        <ReasonDialog
          title={action.title}
          actionLabel={action.label}
          onCancel={() => setAction(null)}
          onSubmit={action.run}
        />
      )}
    </main>
  );
}
