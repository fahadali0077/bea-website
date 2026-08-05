"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { useGetMeQuery } from "@/features/api/apiSlice";
import type { AmbassadorRankMovementDirection } from "@/lib/api/ambassador.types";

export function AmbassadorGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data, isLoading, isFetching } = useGetMeQuery();
  const role = data?.user.role;

  useEffect(() => {
    if (!isLoading && !isFetching && role && role !== "AMBASSADOR") {
      router.replace("/dashboard");
    }
  }, [isFetching, isLoading, role, router]);

  if (isLoading || isFetching || !role) {
    return <DashboardNotice>Loading ambassador dashboard...</DashboardNotice>;
  }

  if (role !== "AMBASSADOR") {
    return null;
  }

  return <>{children}</>;
}

export function DashboardNotice({ children }: { children: ReactNode }) {
  return (
    <div className="flex-1">
      <div className="rounded-[10px] border border-neutral-200 bg-[#fbfbf9] px-5 py-4 font-lato text-[14px] font-semibold text-neutral-600">
        {children}
      </div>
    </div>
  );
}

export function AmbassadorPageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="space-y-1">
      {/*<p className="font-sfpro text-[11px] md:text-[13px] font-bold uppercase tracking-[0.16em] text-[#584939]">
        Ambassador
      </p>*/}
      <h1 className="text-[24px] md:text-[48pt] font-canela font-regular tracking-[0.02em] text-[#000000] leading-tight">
        {title}
      </h1>
      <p className="text-[13px] md:text-[18pt] font-lato font-medium text-[#7c7c7c]">
        {subtitle}
      </p>
    </div>
  );
}

export function MetricCard({ label, value, note }: { label: string; value: ReactNode; note?: string }) {
  return (
    <div className="rounded-[10px] border border-neutral-200/70 bg-[#fbfbf9] p-4">
      <p className="font-lato text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-500">{label}</p>
      <p className="mt-2 font-lato text-[24px] font-black text-neutral-900">{value}</p>
      {note ? <p className="mt-1 font-lato text-[12px] font-semibold text-neutral-400">{note}</p> : null}
    </div>
  );
}

export function Panel({ title, children, action }: { title: string; children: ReactNode; action?: { href: string; label: string } }) {
  return (
    <section className="rounded-[12px] border border-neutral-200/60 bg-[#fbfbf9] p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-sfpro text-[13px] md:text-[16px] font-bold uppercase tracking-[0.14em] text-[#402b23]">
          {title}
        </h2>
        {action ? (
          <Link href={action.href} className="font-lato text-[12px] font-bold text-[#584939] underline underline-offset-4">
            {action.label}
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export function MovementBadge({ direction, value }: { direction?: AmbassadorRankMovementDirection; value?: number }) {
  if (!direction || direction === "NEW") {
    return <span className="font-lato text-[12px] font-bold text-[#5576ee]">New</span>;
  }
  if (direction === "UP") {
    const val = value ?? 0;
    const formatted = val > 0 ? `+${val}` : `+${Math.abs(val)}`;
    return <span className="font-lato text-[12px] font-bold text-emerald-700">{formatted}</span>;
  }
  if (direction === "DOWN") {
    const val = value ?? 0;
    const formatted = val < 0 ? `${val}` : `-${Math.abs(val)}`;
    return <span className="font-lato text-[12px] font-bold text-red-700">{formatted}</span>;
  }
  return <span className="font-lato text-[12px] font-bold text-neutral-400">0</span>;
}

export function StatusPill({ status }: { status: string }) {
  const pending = status === "PENDING";
  return (
    <span className={`rounded-full px-2.5 py-1 font-lato text-[11px] font-bold uppercase tracking-[0.08em] ${pending ? "bg-[#f7efe0] text-[#9a6b20]" : "bg-[#e7f0ea] text-[#3d7a6e]"}`}>
      {pending ? "Pending" : "Completed"}
    </span>
  );
}
