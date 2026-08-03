"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

import { copyToClipboard } from "@/lib/copy-to-clipboard";

export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  async function handleCopy() {
    const ok = await copyToClipboard(value);

    setCopied(ok);
    setFailed(!ok);

    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setCopied(false);
      setFailed(false);
    }, 1500);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={"launch-done-copy" + (copied ? " is-copied" : "") + (failed ? " is-failed" : "")}
      aria-label={copied ? "Link copied" : "Copy link"}
      title={failed ? "Couldn't copy — select the link and copy it manually" : "Copy link"}
    >
      {copied ? <Check size={20} strokeWidth={2} /> : <Copy size={20} strokeWidth={2} />}
    </button>
  );
}
