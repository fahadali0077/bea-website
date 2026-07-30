import { WaitlistSchoolDesktop } from "./WaitlistSchoolDesktop";
import { WaitlistStepMobile } from "./WaitlistStepMobile";

export function WaitlistSchoolPage() {
  return (
    <>
      <div className="hidden md:block">
        <WaitlistSchoolDesktop />
      </div>
      <div className="md:hidden">
        <WaitlistStepMobile artboardId="5" />
      </div>
    </>
  );
}
