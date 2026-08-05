import type { WaitlistArtboardId } from "@/lib/waitlist";

import { WaitlistConfirmedMobile } from "./WaitlistConfirmedMobile";

type Props = {
  artboardId: WaitlistArtboardId;
};

/**
 * Mobile renderer for the waitlist step artboards.
 *
 * Artboard "1" (the old landing screen) used to be handled here. The landing
 * page now lives at the site root and is fully responsive, so that branch is
 * gone — the step screens themselves are unchanged.
 */
export function WaitlistMobile({ artboardId }: Props) {
  if (artboardId === "8") {
    return <WaitlistConfirmedMobile />;
  }

  return null;
}
