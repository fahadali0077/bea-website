import { WelcomeDesktop } from "./WelcomeDesktop";
import { WelcomeMobile } from "./WelcomeMobile";

export function WelcomePage() {
  return (
    <>
      <div className="onboarding-page-mobile">
        <WelcomeMobile />
      </div>
      <div className="onboarding-page-desktop">
        <WelcomeDesktop />
      </div>
    </>
  );
}
