import "@/styles/waitlist-fonts.css";
import "@/styles/launch.css";
import "@/styles/onboarding-transitions.css";

import { LaunchShell } from "@/app/components/launch/LaunchShell";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return <LaunchShell>{children}</LaunchShell>;
}
