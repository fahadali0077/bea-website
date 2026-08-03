import Link from "next/link";

import overlays from "@/lib/waitlist-overlays.json";
import { fontSans } from "@/lib/design";
import {
  WAITLIST_ARTBOARDS,
  WAITLIST_PROGRESS_STEP_HREFS,
  type WaitlistArtboardId,
} from "@/lib/waitlist";
import { progressSegmentRects } from "@/lib/waitlist-progress";
import { waitlistScaledHitStyle } from "@/lib/waitlist-scaled-hit";
import type { WaitlistOverlayPageKey } from "@/lib/waitlist-types";

import { WaitlistScaledProgress } from "./WaitlistScaledProgress";

type Props = {
  artboardId: WaitlistOverlayPageKey;
  children?: React.ReactNode;
};

type ScaledRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

function scaled(rect: ScaledRect, designWidth: number) {
  return waitlistScaledHitStyle(rect, designWidth);
}

type OverlayPage = (typeof overlays.pages)[keyof typeof overlays.pages];

export function WaitlistArtboardDesktop({ artboardId, children }: Props) {
  // waitlist-overlays.json has no entry for artboard "6", but WaitlistArtboardId
  // includes it — so this lookup can legitimately miss. The throw below handles it.
  const page = (overlays.pages as Record<string, OverlayPage | undefined>)[artboardId];

  if (!page) {
    throw new Error(
      `Missing waitlist overlay for artboard "${artboardId}". Check waitlist-overlays.json.`,
    );
  }

  const { width, height } = page;
  const progress =
    "progress" in page && page.progress
      ? (page.progress as {
          left: number;
          top: number;
          width: number;
          height: number;
          steps: number;
          activeIndex: number;
        })
      : null;

  const filledCount =
    WAITLIST_ARTBOARDS[artboardId as WaitlistArtboardId].progressIndex ?? 0;

  return (
    <div
      className="waitlist-artboard-viewport"
      style={{ height: `calc(${height}px * min(1, 100cqw / ${width}px))` }}
    >
      <div
        className="waitlist-artboard-canvas artboard-stage"
        style={{ width, height }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={page.src}
          alt=""
          width={width}
          height={height}
          draggable={false}
          className="waitlist-artboard-image"
          style={{ width, height, display: "block", userSelect: "none" }}
        />
        {children}
      </div>

      <div className="waitlist-scaled-layer">
        {progress && filledCount > 0 && (
          <WaitlistScaledProgress filledCount={filledCount} designWidth={width} />
        )}

        {"navLinks" in page &&
          page.navLinks?.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              aria-label={link.label}
              className="waitlist-scaled-hit"
              style={scaled(link, width)}
            />
          ))}

        {"heroCta" in page && page.heroCta && (
          <a
            href={page.heroCta.href}
            aria-label={page.heroCta.label}
            className="waitlist-scaled-hit waitlist-scaled-hit--hero-cta"
            style={scaled(page.heroCta, width)}
          />
        )}

        {"heroEmail" in page && page.heroEmail && (
          <input
            id={page.heroEmail.id}
            type={page.heroEmail.type}
            aria-label={page.heroEmail.placeholder}
            className="waitlist-scaled-input waitlist-artboard-pill-input"
            style={{ ...scaled(page.heroEmail, width), fontFamily: fontSans }}
          />
        )}

        {"heroSubmit" in page && page.heroSubmit && (
          <Link
            href={page.heroSubmit.href}
            aria-label={page.heroSubmit.label}
            className="waitlist-scaled-hit"
            style={scaled(page.heroSubmit, width)}
          />
        )}

        {"footerEmail" in page && page.footerEmail && (
          <input
            id={page.footerEmail.id}
            type={page.footerEmail.type}
            aria-label={page.footerEmail.placeholder}
            className="waitlist-scaled-input waitlist-artboard-footer-input"
            style={{ ...scaled(page.footerEmail, width), fontFamily: fontSans }}
          />
        )}

        {"cityPills" in page &&
          page.cityPills?.map((pill) => (
            <button
              key={pill.label}
              type="button"
              aria-label={pill.label}
              className="waitlist-scaled-hit"
              style={scaled(pill, width)}
            />
          ))}

        {"cityCards" in page &&
          page.cityCards?.map((card, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Select city ${i + 1}`}
              className="waitlist-scaled-hit"
              style={scaled(card, width)}
            />
          ))}

        {"inputs" in page &&
          page.inputs?.map((field) => (
            <input
              key={field.id}
              id={field.id}
              name={field.id}
              type={field.type as "text" | "email" | "search" | "number"}
              aria-label={field.placeholder || field.id}
              className={
                "variant" in field && field.variant === "underline"
                  ? "waitlist-scaled-input waitlist-artboard-underline"
                  : "waitlist-scaled-input artboard-input waitlist-artboard-box-input"
              }
              style={{ ...scaled(field, width), fontFamily: fontSans }}
            />
          ))}

        {"schoolCard" in page && page.schoolCard && (
          <button
            type="button"
            aria-label="New York University"
            className="waitlist-scaled-hit"
            style={scaled(page.schoolCard, width)}
          />
        )}

        {"notInSchool" in page && page.notInSchool && (
          <button
            type="button"
            aria-label="I'm not currently in school"
            className="waitlist-scaled-hit"
            style={scaled(page.notInSchool, width)}
          />
        )}

        {"cta" in page && page.cta && (
          <Link
            href={page.cta.href}
            aria-label={page.cta.label}
            className="waitlist-scaled-hit"
            style={scaled(page.cta, width)}
          />
        )}

        {"secondaryLink" in page && page.secondaryLink && (
          <Link
            href={page.secondaryLink.href}
            aria-label={page.secondaryLink.label}
            className="waitlist-scaled-hit"
            style={scaled(page.secondaryLink, width)}
          />
        )}

        {"copyLink" in page && page.copyLink && (
          <button
            type="button"
            aria-label={page.copyLink.label}
            className="waitlist-scaled-hit"
            style={scaled(page.copyLink, width)}
          />
        )}

        {"back" in page && page.back && (
          <a
            href={page.back.href}
            aria-label="Go back"
            className="waitlist-scaled-hit waitlist-scaled-hit--back"
            style={scaled(page.back, width)}
          />
        )}

        {progress &&
          progressSegmentRects(progress).map((rect, i) => {
            if (i >= filledCount - 1) return null;
            const href = WAITLIST_PROGRESS_STEP_HREFS[i];
            if (!href) return null;
            return (
              <a
                key={`progress-${i}`}
                href={href}
                aria-label={`Go to step ${i + 1}`}
                className="waitlist-scaled-hit waitlist-scaled-hit--progress"
                style={scaled(rect, width)}
              />
            );
          })}

        {"waitingRoom" in page && page.waitingRoom && (
          <a
            href={page.waitingRoom.href}
            aria-label={page.waitingRoom.label}
            className="waitlist-scaled-hit waitlist-scaled-hit--waiting-room"
            style={scaled(page.waitingRoom, width)}
          />
        )}
      </div>
    </div>
  );
}