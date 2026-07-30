"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    node.classList.remove("page-transition-enter");
    void node.offsetWidth;
    node.classList.add("page-transition-enter");
  }, [pathname]);

  return (
    <div key={pathname} className="page-transition-root page-transition-enter">
      {children}
    </div>
  );
}
