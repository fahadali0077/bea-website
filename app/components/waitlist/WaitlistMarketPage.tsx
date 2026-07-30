import { WaitlistMarketDesktop } from "./WaitlistMarketDesktop";
import { WaitlistStepMobile } from "./WaitlistStepMobile";

export function WaitlistMarketPage() {
  return (
    <>
      <div className="hidden md:block">
        <WaitlistMarketDesktop />
      </div>
      <div className="md:hidden">
        <WaitlistStepMobile artboardId="3" />
      </div>
    </>
  );
}
