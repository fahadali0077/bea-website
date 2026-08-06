import { BUBBA_ANNOUNCEMENT } from "@/lib/bubba-content";

/**
 * Pale blue strip that sits above the nav on every page. Static copy for now —
 * when the dates firm up this is the one string to change.
 */
export function BubbaAnnouncement() {
  return (
    <div className="bb-announce" role="status">
      <p>{BUBBA_ANNOUNCEMENT}</p>
    </div>
  );
}
