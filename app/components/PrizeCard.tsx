import Image from "next/image";
import { fontAptos } from "@/lib/design";

export type PrizeCardData = {
  illustration: string;
  title: string;
  subtitle: string;
  badgeText: string;
  badge: {
    backgroundColor: string;
    borderColor: string;
    color: string;
  };
  width: number;
  titleNoWrap?: boolean;
};

export function PrizeCard({ card }: { card: PrizeCardData }) {
  return (
    <article
      className="prize-card relative flex w-full shrink-0 flex-col rounded-[14px]"
      style={{ border: "1px solid rgba(0,0,0,0.10)" }}
    >
      <div className="absolute inset-x-3 top-[14px] z-10 flex justify-end">
        <span
          className="inline-flex max-w-full items-center justify-center whitespace-nowrap px-3"
          style={{
            height: "28px",
            borderRadius: "14px",
            backgroundColor: card.badge.backgroundColor,
            border: `1px solid ${card.badge.borderColor}`,
          }}
        >
          <span
            className="text-[10px] uppercase tracking-[0.02em] leading-none"
            style={{
              fontFamily: fontAptos,
              fontWeight: 600,
              color: card.badge.color,
            }}
          >
            {card.badgeText}
          </span>
        </span>
      </div>

      <div className="prize-card-illus-wrap">
        <Image
          src={card.illustration}
          alt={card.title}
          fill
          sizes="(max-width: 900px) 90vw, 360px"
          style={{ objectFit: "contain", objectPosition: "center center" }}
        />
      </div>

      <div className="px-4 pb-[22px] pt-1 text-center w-full">
        <h3
          className="font-canela onboarding-heading text-[18px] leading-[20px] text-[#000000]"
          style={{ whiteSpace: card.titleNoWrap ? "nowrap" : undefined }}
        >
          {card.title}
        </h3>
        <p
          className="mt-[6px] text-[13px] leading-[18px] text-[#8a8480]"
          style={{ fontFamily: fontAptos, fontWeight: 400 }}
        >
          {card.subtitle}
        </p>
      </div>
    </article>
  );
}
