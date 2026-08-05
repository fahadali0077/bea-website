"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

export function SlideOver({
  header,
  children,
  onClose,
}: {
  header: React.ReactNode;
  children: React.ReactNode;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-neutral-950/40 backdrop-blur-[1px]" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 w-full max-w-md bg-[#fcfbf8] shadow-2xl flex flex-col animate-slide-right">
        <div className="flex items-start justify-between gap-3 p-5 sm:p-6 border-b border-neutral-200/50">
          <div className="min-w-0 flex-1">{header}</div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-neutral-500 hover:text-neutral-800 cursor-pointer shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar p-5 sm:p-6 flex flex-col gap-6">
          {children}
        </div>
      </div>
    </div>
  );
}
