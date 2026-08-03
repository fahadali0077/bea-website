import type { WaitlistStepImage as WaitlistStepImageProps } from "@/lib/waitlist-page-content";

export function WaitlistStepImage({ image }: { image: WaitlistStepImageProps }) {
  return (
    <div className={`waitlist-step-image waitlist-step-image--${image.side}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.src}
        alt={image.alt ?? ""}
        width={600}
        height={450}
      />
    </div>
  );
}
