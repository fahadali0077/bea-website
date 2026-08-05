import { Suspense } from "react";

import { WaitlistMobile } from "./WaitlistMobile";
import { WaitlistConfirmedDesktop } from "./WaitlistConfirmedDesktop";

export function WaitlistConfirmedPage() {
  return (
    <>
      <div className="waitlist-page-mobile">
        <Suspense fallback={null}>
          <WaitlistMobile artboardId="8" />
        </Suspense>
      </div>
      <div className="waitlist-page-desktop">
        <Suspense fallback={null}>
          <WaitlistConfirmedDesktop />
        </Suspense>
      </div>
    </>
  );
}
