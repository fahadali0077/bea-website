import type { WaitlistCityOption } from "@/lib/waitlist-market";

type Props = {
  city: WaitlistCityOption;
  selected?: boolean;
  static?: boolean;
  onSelect?: () => void;
};

export function WaitlistCityCard({ city, selected, static: isStatic, onSelect }: Props) {
  const className =
    "waitlist-city-card" +
    (isStatic ? " waitlist-city-card--static" : "") +
    (selected ? " waitlist-city-card--selected" : "");

  const inner = (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="waitlist-city-card-image"
        src={city.image}
        alt=""
        loading="lazy"
        draggable={false}
      />
      <div className="waitlist-city-card-shade" aria-hidden />
      <div className="waitlist-city-card-label">
        <span className="city-name">{city.name}</span>
        <span className="city-plans">{city.plans}</span>
        <span className="city-tonight">plans tonight</span>
      </div>
    </>
  );

  if (isStatic || !onSelect) {
    return <div className={className}>{inner}</div>;
  }

  return (
    <button type="button" className={className} onClick={onSelect} aria-pressed={selected}>
      {inner}
    </button>
  );
}
