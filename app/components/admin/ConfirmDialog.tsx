"use client";

import { useEffect } from "react";

export function ConfirmDialog({
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger,
  onConfirm,
  onClose,
}: {
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-neutral-950/40 backdrop-blur-[1px]" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-[#fcfbf8] rounded-[14px] shadow-2xl p-6 flex flex-col gap-5 animate-pop">
        <div>
          <p className="font-canela text-[20px] font-medium text-neutral-900 leading-tight">{title}</p>
          <p className="font-lato text-[13px] font-medium text-neutral-500 mt-1.5 leading-relaxed">{message}</p>
        </div>
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="font-lato text-[13px] font-semibold text-neutral-600 hover:text-neutral-900 px-4 py-2 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`font-lato text-[13px] font-semibold text-white px-5 py-2 rounded-full transition-colors cursor-pointer ${
              danger ? "bg-[#b0453a] hover:bg-[#9a3c32]" : "bg-neutral-900 hover:bg-neutral-800"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
