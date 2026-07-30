import Link from "next/link";

import { fontAptos } from "@/lib/design";
import { navigation, onboarding } from "@/lib/config";

export function OnboardingHeader() {
  return (
    <div className="px-[76px] pr-[82px] pt-[34px] pb-0">
      <div className="flex justify-end">
        <p
          className="text-[12px] text-[#888480] text-right leading-snug"
          style={{ fontFamily: fontAptos, fontWeight: 400 }}
        >
          {onboarding.header.loginPrompt}{" "}
          <Link href={navigation.login} className="text-[#1a1a1a] underline underline-offset-[3px]">
            {onboarding.header.loginLabel}
          </Link>
        </p>
      </div>
    </div>
  );
}
