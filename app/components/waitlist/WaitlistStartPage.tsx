import { WaitlistStartDesktop } from "./WaitlistStartDesktop";
import { WaitlistStartMobile } from "./WaitlistStartMobile";

export function WaitlistStartPage() {
  return (
    <>
      <div className="hidden md:block">
        <WaitlistStartDesktop />
      </div>
      <div className="md:hidden">
        <WaitlistStartMobile />
      </div>
    </>
  );
}
