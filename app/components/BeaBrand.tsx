import Link from "next/link";

type Props = {
  className?: string;
  inverted?: boolean;
  markSize?: number;
};

function BeaLogoMark({
  size = 26,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`bea-brand-mark shrink-0 ${className}`}
      aria-hidden="true"
    >
      <circle cx="13" cy="13" r="12" fill="#1a2e33" />
      <circle cx="13" cy="13" r="5.25" fill="#3db4cc" />
    </svg>
  );
}

export function BeaBrand({ className = "", inverted = false, markSize = 26 }: Props) {
  return (
    <Link
      href="/onboarding"
      className={`bea-brand inline-flex items-center gap-[8px] ${className}`}
      aria-label="bea home"
    >
      <BeaLogoMark size={markSize} />
      <img
        src="/images/assets/Bea_png.png"
        alt="bea"
        className="h-[22px] md:h-[24px] w-auto object-contain"
        style={inverted ? { filter: "brightness(0) invert(1)" } : undefined}
      />
    </Link>
  );
}

export { BeaLogoMark };
