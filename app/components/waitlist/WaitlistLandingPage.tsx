import { WaitlistLandingDesktop } from "./WaitlistLandingDesktop";
import { WaitlistLandingMobile } from "./WaitlistLandingMobile";

export function WaitlistLandingPage() {
  return (
    <>
      <div className="hidden md:block">
        <WaitlistLandingDesktop />
      </div>
      <div className="md:hidden">
        <WaitlistLandingMobile />
      </div>
    </>
  );
}

