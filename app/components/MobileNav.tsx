"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";

import { BeaBrand } from "./BeaBrand";
import { ONBOARDING_STEPS } from "@/lib/onboarding-steps";
import { fontAptos } from "@/lib/design";
import { navigation, onboarding } from "@/lib/config";

type Props = {
  activeIndex?: number;
};

export function MobileNav({ activeIndex }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const resolvedIndex =
    activeIndex ?? ONBOARDING_STEPS.findIndex((step) => step.href === pathname);

  const overlay =
    open && mounted
      ? createPortal(
          <>
            <button
              type="button"
              className="mobile-nav-backdrop fixed inset-0 z-[200] bg-black/30"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            />
            <nav
              id="mobile-nav-panel"
              className="mobile-nav-panel fixed inset-y-0 right-0 z-[210] flex w-[min(88vw,320px)] flex-col border-l bg-[#f8f3ef] shadow-2xl pt-[env(safe-area-inset-top)]"
              style={{ borderColor: "#edeceb", fontFamily: fontAptos }}
              aria-label="Main menu"
            >
              <div
                className="flex h-[56px] items-center justify-between border-b px-5"
                style={{ borderColor: "#edeceb" }}
              >
                <BeaBrand />
                <button
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#1a1a1a]"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-5 w-5" strokeWidth={1.5} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-6">
                <p className="onboarding-menu-eyebrow mb-4">Onboarding</p>
                <ul className="space-y-1">
                  {ONBOARDING_STEPS.map((step, i) => {
                    const isActive = i === resolvedIndex;
                    return (
                      <li key={step.label}>
                        <Link
                          href={step.href}
                          className={
                            "flex w-full items-center gap-3 rounded-[12px] px-3 py-3 text-[14px] transition-colors" +
                            (isActive
                              ? " bg-[#faf7f5] border border-[#e8e4df] text-[#1a1a1a] shadow-[0_2px_6px_rgba(0,0,0,0.02)]"
                              : " text-[#1a1a1a] hover:bg-white/80")
                          }
                          onClick={() => setOpen(false)}
                        >
                          <span
                            className={
                              "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold" +
                              (isActive
                                ? " bg-[#f5ebe4] text-[#c48b58] border border-[#e2d5cb]"
                                : " border border-[#dcd8d3] text-[#9a9490]")
                            }
                          >
                            {i + 1}
                          </span>
                          <span className="min-w-0 font-canela onboarding-heading text-[15px] leading-snug">
                            {step.label}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div
                className="border-t px-5 py-5 pb-[calc(20px+env(safe-area-inset-bottom))]"
                style={{ borderColor: "#edeceb" }}
              >
                <p className="text-[12px] text-[#888480]">
                  {onboarding.header.loginPrompt}{" "}
                  <Link
                    href={navigation.login}
                    className="text-[#1a1a1a] underline underline-offset-[3px]"
                    onClick={() => setOpen(false)}
                  >
                    {onboarding.header.loginLabel}
                  </Link>
                </p>
              </div>
            </nav>
          </>,
          document.body,
        )
      : null;

  return (
    <>
      <header
        className="md:hidden sticky top-0 z-30 border-b bg-[#f8f3ef]/95 backdrop-blur-md pt-[env(safe-area-inset-top)]"
        style={{ borderColor: "#edeceb", fontFamily: fontAptos }}
      >
        <div className="flex h-[56px] items-center justify-between px-5">
          <BeaBrand />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#dcd8d3] bg-white/50 text-[#1a1a1a] transition-colors hover:bg-white active:bg-white"
            aria-expanded={open}
            aria-controls="mobile-nav-panel"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <X className="h-5 w-5" strokeWidth={1.5} />
            ) : (
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            )}
          </button>
        </div>
      </header>
      {overlay}
    </>
  );
}
