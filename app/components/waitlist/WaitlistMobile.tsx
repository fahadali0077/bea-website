import type { WaitlistArtboardId } from "@/lib/waitlist";

import { WaitlistConfirmedMobile } from "./WaitlistConfirmedMobile";
import { WaitlistLandingMobile } from "./WaitlistLandingMobile";

type Props = {
  artboardId: WaitlistArtboardId;
};

export function WaitlistMobile({ artboardId }: Props) {
  if (artboardId === "1") {
    return <WaitlistLandingMobile />;
  }

  if (artboardId === "8") {
    return <WaitlistConfirmedMobile />;
  }

  return null;
}
