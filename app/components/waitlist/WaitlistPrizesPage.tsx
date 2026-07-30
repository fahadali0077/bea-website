import { WaitlistArtboardPage } from "./WaitlistArtboardPage";
import { WaitlistPrizesDesktopRewards } from "./WaitlistPrizesDesktopRewards";

export function WaitlistPrizesPage() {
  return (
    <WaitlistArtboardPage
      artboardId="9"
      desktopChildren={<WaitlistPrizesDesktopRewards />}
    />
  );
}
