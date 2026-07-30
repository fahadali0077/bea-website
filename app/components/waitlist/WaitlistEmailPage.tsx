import { WaitlistEmailDesktop } from "./WaitlistEmailDesktop";
import { WaitlistStepMobile } from "./WaitlistStepMobile";

export function WaitlistEmailPage() {
  return (
    <>
      <div className="hidden md:block">
        <WaitlistEmailDesktop />
      </div>
      <div className="md:hidden">
        <WaitlistStepMobile artboardId="7" />
      </div>
    </>
  );
}
