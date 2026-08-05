"use client";

import React, { useCallback, useState } from "react";
import Image from "next/image";
import { WhatsappShareButton } from "react-share";

const SHARE_CHANNELS = [
  {
    id: "instagram",
    label: "Instagram",
    icon: "/images/assets/insta.png",
  },
  {
    id: "messages",
    label: "Messages",
    icon: "/images/assets/message.png",
  },
  {
    id: "whatsapp",
    label: "Whatsapp",
    icon: "/images/assets/whatsapp.png",
  },
  {
    id: "share",
    label: "Share link",
    icon: "/images/assets/upload.png",
  },
] as const;

type ShareChannelId = (typeof SHARE_CHANNELS)[number]["id"];

interface InviteShareChannelsProps {
  shareUrl: string;
  shareTitle?: string;
  onCopied?: () => void;
}

function ShareChannelVisual({
  label,
  icon,
  copied,
}: {
  label: string;
  icon: string;
  copied?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-2 cursor-pointer group">
      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#fbfbf9] border border-neutral-200/70 flex items-center justify-center shadow-sm group-hover:bg-[#f1eee7]/50 group-hover:border-neutral-300 transition-all duration-200">
        <div className="relative w-4 h-4 md:w-4.5 md:h-4.5 group-hover:scale-105 transition-transform duration-200">
          <Image src={icon} alt="" fill className="object-contain" aria-hidden />
        </div>
      </div>
      <span className="text-[10px] md:text-[12px] font-sans font-medium text-[#4a3429] group-hover:text-neutral-800 transition-colors uppercase tracking-wider text-center">
        {copied ? "Copied!" : label}
      </span>
    </div>
  );
}

function openSmsComposer(body: string) {
  const encoded = encodeURIComponent(body);
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const smsUrl = isIOS ? `sms:&body=${encoded}` : `sms:?body=${encoded}`;
  window.location.href = smsUrl;
}

function openMailComposer(subject: string, body: string) {
  const mailUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailUrl;
}

export default function InviteShareChannels({
  shareUrl,
  shareTitle = "Join me on Bea!",
  onCopied,
}: InviteShareChannelsProps) {
  const [copiedChannel, setCopiedChannel] = useState<ShareChannelId | null>(null);

  const shareBody = `${shareTitle} ${shareUrl}`;

  const markCopied = useCallback(
    (channel: ShareChannelId) => {
      setCopiedChannel(channel);
      onCopied?.();
      window.setTimeout(() => setCopiedChannel(null), 2000);
    },
    [onCopied]
  );

  const copyLink = useCallback(
    async (channel: ShareChannelId) => {
      try {
        await navigator.clipboard.writeText(shareUrl);
        markCopied(channel);
      } catch {
      }
    },
    [shareUrl, markCopied]
  );

  const openNativeShareSheet = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.share) {
      return false;
    }

    try {
      await navigator.share({
        title: shareTitle,
        text: shareBody,
        url: shareUrl,
      });
      return true;
    } catch (err) {
      if ((err as Error).name === "AbortError") {
        return true;
      }
      return false;
    }
  }, [shareTitle, shareBody, shareUrl]);

  const handleMessagesShare = useCallback(async () => {
    const openedNativeSheet = await openNativeShareSheet();
    if (openedNativeSheet) return;

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      openSmsComposer(shareBody);
      return;
    }

    const isMac = /Macintosh|Mac OS X/i.test(navigator.userAgent);
    if (isMac) {
      openSmsComposer(shareBody);
      return;
    }

    openMailComposer(shareTitle, shareBody);
  }, [openNativeShareSheet, shareBody, shareTitle]);

  const handleInstagramShare = useCallback(async () => {
    const openedNativeSheet = await openNativeShareSheet();
    if (openedNativeSheet) return;

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      await copyLink("instagram");
      return;
    }

    await copyLink("instagram");
  }, [openNativeShareSheet, copyLink]);

  const handleNativeShare = useCallback(async () => {
    const openedNativeSheet = await openNativeShareSheet();
    if (openedNativeSheet) return;
    await copyLink("share");
  }, [openNativeShareSheet, copyLink]);

  return (
    <div className="grid grid-cols-4 gap-2 mt-4 max-w-sm w-full">
      {SHARE_CHANNELS.map((channel) => {
        if (channel.id === "whatsapp") {
          return (
            <WhatsappShareButton
              key={channel.id}
              url={shareUrl}
              title={shareTitle}
              separator=" "
              className="flex justify-center !bg-transparent !border-0 !p-0"
            >
              <ShareChannelVisual label={channel.label} icon={channel.icon} />
            </WhatsappShareButton>
          );
        }

        if (channel.id === "messages") {
          return (
            <button
              key={channel.id}
              type="button"
              onClick={handleMessagesShare}
              className="flex justify-center bg-transparent border-0 p-0 cursor-pointer"
              aria-label="Share via Messages"
            >
              <ShareChannelVisual label={channel.label} icon={channel.icon} />
            </button>
          );
        }

        if (channel.id === "instagram") {
          return (
            <button
              key={channel.id}
              type="button"
              onClick={handleInstagramShare}
              className="flex justify-center bg-transparent border-0 p-0 cursor-pointer"
              aria-label={
                copiedChannel === "instagram"
                  ? "Link copied for Instagram"
                  : "Share via Instagram"
              }
            >
              <ShareChannelVisual
                label={channel.label}
                icon={channel.icon}
                copied={copiedChannel === "instagram"}
              />
            </button>
          );
        }

        return (
          <button
            key={channel.id}
            type="button"
            onClick={handleNativeShare}
            className="flex justify-center bg-transparent border-0 p-0 cursor-pointer"
            aria-label={copiedChannel === "share" ? "Link copied" : "Share invite link"}
          >
            <ShareChannelVisual
              label={channel.label}
              icon={channel.icon}
              copied={copiedChannel === "share"}
            />
          </button>
        );
      })}
    </div>
  );
}
