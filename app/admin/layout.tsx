"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ADMIN_EMAIL_COOKIE, ADMIN_LOGIN_PATH } from "@/lib/admin/auth-constants";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  GraduationCap,
  MapPin,
  MessageSquareText,
  Coins,
  Gift,
  Send,
  BarChart3,
  ChevronDown,
  Menu,
  X,
  ShoppingBag,
  ClipboardList,
  ShieldAlert,
  History,
} from "lucide-react";

const ADMIN_AVATAR = "/images/ron-avatar.png";

function readCookie(name: string): string {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : "";
}

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  ready?: boolean;
};

const ICON = "w-4.5 h-4.5";

const NAV_ITEMS: NavItem[] = [
  { label: "Overview", href: "/admin", icon: <LayoutDashboard className={ICON} />, ready: true },
  { label: "Users", href: "/admin/users", icon: <Users className={ICON} />, ready: true },
  { label: "Ambassadors", href: "/admin/ambassadors", icon: <UserPlus className={ICON} />, ready: true },
  { label: "Schools", href: "/admin/schools", icon: <GraduationCap className={ICON} />, ready: true },
  { label: "Markets", href: "/admin/markets", icon: <MapPin className={ICON} />, ready: true },
  { label: "Prompts", href: "/admin/prompts", icon: <MessageSquareText className={ICON} />, ready: true },
  { label: "Forum", href: "/admin/forum", icon: <ShieldAlert className={ICON} />, ready: true },
  { label: "Points", href: "/admin/points", icon: <Coins className={ICON} />, ready: true },
  { label: "Rewards", href: "/admin/rewards", icon: <Gift className={ICON} />, ready: true },
  { label: "Shop", href: "/admin/shop", icon: <ShoppingBag className={ICON} />, ready: true },
  { label: "Orders", href: "/admin/orders", icon: <ClipboardList className={ICON} />, ready: true },
  { label: "Messaging", href: "/admin/messages", icon: <Send className={ICON} />, ready: true },
  { label: "Audit", href: "/admin/audit", icon: <History className={ICON} />, ready: true },
  { label: "Analytics", href: "/admin/analytics", icon: <BarChart3 className={ICON} />, ready: true },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const active = isActive(item.href);
        const base =
          "w-full text-left py-2.5 px-3.5 rounded-[8px] flex items-center gap-3 font-lato text-[13px] font-bold tracking-wide uppercase transition-all duration-200 subpixel-antialiased";

        if (!item.ready) {
          return (
            <div
              key={item.label}
              aria-disabled
              className={`${base} text-[#b6b1a9] cursor-not-allowed select-none`}
            >
              <span className="w-4.5 h-4.5 flex items-center justify-center shrink-0">
                {item.icon}
              </span>
              <span className="flex-1">{item.label}</span>
              <span className="text-[8px] font-bold tracking-wider text-[#c9a06a] bg-[#f3ece2] px-1.5 py-0.5 rounded-full normal-case">
                Soon
              </span>
            </div>
          );
        }

        return (
          <Link
            key={item.label}
            href={item.href}
            onClick={onNavigate}
            className={`${base} cursor-pointer ${active
                ? "bg-[#f1eee7] text-black shadow-sm"
                : "text-[#444444] hover:text-neutral-950 hover:bg-[#f1eee7]/50"
              }`}
          >
            <span className="w-4.5 h-4.5 flex items-center justify-center shrink-0">
              {item.icon}
            </span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [signingOut, setSigningOut] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setEmail(readCookie(ADMIN_EMAIL_COOKIE));
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  const name = email ? email.split("@")[0] : "Admin";

  const handleSignOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await fetch("/api/auth/admin/logout", { method: "POST" });
    } finally {
      router.replace(ADMIN_LOGIN_PATH);
      router.refresh();
    }
  };

  useEffect(() => {
    if (!isProfileOpen) return;

    const handlePointerDown = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsProfileOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isProfileOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfbf8] font-sans text-black antialiased">
      <header className="w-full bg-[#fcfbf8] z-40 border-b border-neutral-200/40">
        <div className="w-full px-4 sm:px-6 md:px-12 py-4 sm:py-5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-1 text-neutral-600 hover:text-neutral-900 focus:outline-none cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="w-6.5 h-6.5" strokeWidth={2} />
            </button>
            <Link href="/admin" className="select-none hover:opacity-80 transition-opacity shrink-0 flex items-center gap-2.5">
              <img
                src="/images/assets/Bea_png.png"
                alt="Bea Logo"
                className="h-[20px] sm:h-[30px] md:h-[34px] w-auto object-contain"
              />
              <span className="hidden sm:inline-block text-[10px] font-bold tracking-widest uppercase text-[#584939] bg-[#efebe5] px-2 py-1 rounded-full">
                Admin
              </span>
            </Link>
          </div>

          <div ref={profileRef} className="relative shrink-0">
            <button
              type="button"
              onClick={() => setIsProfileOpen((open) => !open)}
              aria-expanded={isProfileOpen}
              aria-haspopup="menu"
              className="flex items-center gap-1.5 sm:gap-3 hover:opacity-90 transition-opacity cursor-pointer focus:outline-none rounded-full pr-0.5"
            >
              <div className="text-right hidden sm:block">
                <p className="text-[15px] font-lato font-black text-neutral-800 leading-tight capitalize">{name}</p>
                <p className="text-[12px] font-lato font-medium text-[#7c7b7d] mt-0.5">Administrator</p>
              </div>
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border border-neutral-200 shadow-sm bg-neutral-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ADMIN_AVATAR} alt={`${name} avatar`} className="w-full h-full object-cover" />
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-neutral-500 transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`}
                strokeWidth={3}
              />
            </button>

            {isProfileOpen && (
              <div
                role="menu"
                className="absolute right-0 top-[calc(100%+8px)] z-50 w-[min(100vw-2rem,260px)] bg-[#fcfbf8] border border-neutral-200/60 rounded-[10px] shadow-[0_12px_32px_rgba(0,0,0,0.1)] overflow-hidden"
              >
                <div className="px-4 py-4 border-b border-neutral-200/50 bg-[#fbf7f4]">
                  <p className="text-[15px] font-lato font-black text-neutral-800 leading-tight truncate capitalize">{name}</p>
                  <p className="text-[12px] font-lato font-medium text-[#7c7b7d] mt-0.5 truncate">{email || "Administrator"}</p>
                </div>
                <div className="py-1.5">
                  <Link
                    href="/dashboard"
                    role="menuitem"
                    onClick={() => setIsProfileOpen(false)}
                    className="block px-4 py-2.5 text-[13px] font-lato font-semibold text-[#444444] hover:bg-[#faf9f6] hover:text-neutral-950 transition-colors"
                  >
                    View user dashboard
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    disabled={signingOut}
                    onClick={() => {
                      setIsProfileOpen(false);
                      handleSignOut();
                    }}
                    className="block w-full text-left px-4 py-2.5 text-[13px] font-lato font-semibold text-[#b0453a] hover:bg-[#faf0eb] transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {signingOut ? "Signing out…" : "Sign out"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex-grow w-full px-4 sm:px-6 md:px-12 flex flex-col md:flex-row gap-6 md:gap-8 py-6 md:py-8">
        <aside className="hidden md:flex flex-col w-52 shrink-0 border-r border-neutral-300/40 pr-6">
          <p className="px-3.5 pb-3 text-[10px] font-bold tracking-widest uppercase text-[#a39d94]">
            Management
          </p>
          <NavLinks />
        </aside>

        {children}
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-neutral-950/40 backdrop-blur-[1px]"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 max-w-[80vw] bg-[#fcfbf8] shadow-2xl flex flex-col p-5 animate-slide-left">
            <div className="flex items-center justify-between pb-5 border-b border-neutral-200/50">
              <div className="flex items-center gap-2">
                <img src="/images/assets/Bea_png.png" alt="Bea Logo" className="h-[24px] w-auto object-contain" />
                <span className="text-[9px] font-bold tracking-widest uppercase text-[#584939] bg-[#efebe5] px-1.5 py-0.5 rounded-full">
                  Admin
                </span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 text-neutral-500 hover:text-neutral-800 cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" strokeWidth={2} />
              </button>
            </div>
            <div className="flex-grow overflow-y-auto no-scrollbar py-5">
              <NavLinks onNavigate={() => setIsMobileMenuOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
