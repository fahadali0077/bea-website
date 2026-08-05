import type { WaitlistArtboardId } from "@/lib/waitlist";

import { WaitlistArtboardDesktop } from "./WaitlistArtboardDesktop";
import { WaitlistMobile } from "./WaitlistMobile";

type Props = {
  artboardId: WaitlistArtboardId;
  desktopChildren?: React.ReactNode;
};

export function WaitlistArtboardPage({ artboardId, desktopChildren }: Props) {
  return (
    <>
      <div className="waitlist-page-mobile">
        <WaitlistMobile artboardId={artboardId} />
      </div>
      <div className="waitlist-page-desktop">
        <WaitlistArtboardDesktop artboardId={artboardId}>
          {desktopChildren}
        </WaitlistArtboardDesktop>
      </div>
    </>
  );
}
