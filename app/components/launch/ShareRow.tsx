"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Instagram, Link2, MessageCircle, Share2 } from "lucide-react";

import { copyToClipboard } from "@/lib/copy-to-clipboard";
import { SHARE_MESSAGE } from "@/lib/launch";

type ShareRowProps = {
  /** The referral link to share. Buttons stay disabled until this resolves. */
  link: string | null;
};

type ActionId = "instagram" | "messages" | "copy" | "more";

export function ShareRow({ link }: ShareRowProps) {
  const [status, setStatus] = useState<string | null>(null);
  const [done, setDone] = useState<ActionId | null>(null);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // navigator.share is unavailable on most desktop browsers, so this is checked
  // after mount rather than assumed — and never during SSR.
  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const flash = (id: ActionId | null, message: string) => {
    setDone(id);
    setStatus(message);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setDone(null);
      setStatus(null);
    }, 2500);
  };

  const shareText = link ? `${SHARE_MESSAGE} ${link}` : "";

  const handleCopy = async (id: ActionId, successMessage: string) => {
    if (!link) return;
    const ok = await copyToClipboard(link);
    flash(ok ? id : null, ok ? successMessage : "Couldn't copy — select the link above and copy it manually.");
    return ok;
  };

  const handleInstagram = async () => {
    // Instagram has no web intent for sharing an arbitrary URL, so the honest
    // flow is: put the link on the clipboard, then open Instagram to paste it.
    const ok = await handleCopy("instagram", "Link copied — paste it into your story or bio.");
    if (ok) window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
  };

  const handleMessages = () => {
    if (!link) return;
    // sms: opens the native messaging app on mobile; harmless no-op elsewhere.
    window.location.href = `sms:?&body=${encodeURIComponent(shareText)}`;
  };

  const handleMore = async () => {
    if (!link) return;
    if (canNativeShare) {
      try {
        await navigator.share({ title: "Join me on Bubba", text: SHARE_MESSAGE, url: link });
      } catch {
        // The user dismissing the sheet rejects the promise — not an error.
      }
      return;
    }
    await handleCopy("more", "Link copied to your clipboard.");
  };

  const actions: { id: ActionId; label: string; icon: React.ReactNode; onClick: () => void }[] = [
    { id: "instagram", label: "Share on Instagram", icon: <Instagram size={22} strokeWidth={1.7} />, onClick: handleInstagram },
    { id: "messages", label: "Share via Messages", icon: <MessageCircle size={22} strokeWidth={1.7} />, onClick: handleMessages },
    {
      id: "copy",
      label: "Copy link",
      icon: <Link2 size={22} strokeWidth={1.7} />,
      onClick: () => void handleCopy("copy", "Link copied to your clipboard."),
    },
    { id: "more", label: canNativeShare ? "More sharing options" : "Copy link", icon: <Share2 size={22} strokeWidth={1.7} />, onClick: handleMore },
  ];

  return (
    <>
      <div className="launch-share-row">
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            className="launch-share-item"
            onClick={action.onClick}
            disabled={!link}
            aria-label={action.label}
            title={action.label}
          >
            <span className="launch-share-icon">
              {done === action.id ? <Check size={22} strokeWidth={2} /> : action.icon}
            </span>
          </button>
        ))}
      </div>

      <p className="launch-share-status" role="status" aria-live="polite">
        {status}
      </p>
    </>
  );
}