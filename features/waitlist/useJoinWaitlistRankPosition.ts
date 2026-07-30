"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

import { selectWaitlistJoinResult } from "@/features/waitlist/waitlist.selectors";
import { readStoredJoinResult } from "@/lib/waitlist-join-storage";
import { useAppSelector } from "@/store/hooks";

export function useJoinWaitlistRankPosition() {
  const joinResult = useAppSelector(selectWaitlistJoinResult);
  const searchParams = useSearchParams();

  return useMemo(() => {
    const fromQuery = searchParams.get("position");
    const queryPosition =
      fromQuery != null && fromQuery !== "" ? Number(fromQuery) : null;

    if (joinResult?.waitlistPosition != null) {
      return joinResult.waitlistPosition;
    }

    if (queryPosition != null && Number.isFinite(queryPosition)) {
      return queryPosition;
    }

    return readStoredJoinResult()?.waitlistPosition ?? null;
  }, [joinResult, searchParams]);
}
