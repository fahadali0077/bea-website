import { WaitlistNameDesktop } from "./WaitlistNameDesktop";
import { WaitlistStepMobile } from "./WaitlistStepMobile";

export function WaitlistNamePage() {
  return (
    <>
      <div className="hidden md:block">
        <WaitlistNameDesktop />
      </div>
      <div className="md:hidden">
        <WaitlistStepMobile artboardId="4" />
      </div>
    </>
  );
}
