import type { WaitlistCityOption } from "@/lib/waitlist-market";

import { WaitlistCityCard } from "./WaitlistCityCard";

type Props = {
  className?: string;
  cities: WaitlistCityOption[];
  selectedId?: string | null;
  onSelect?: (city: WaitlistCityOption) => void;
};

export function WaitlistCityCarousel({ className, cities, selectedId, onSelect }: Props) {
  return (
    <div className={"waitlist-city-carousel" + (className ? ` ${className}` : "")}>
      {cities.map((city) => (
        <WaitlistCityCard
          key={city.id}
          city={city}
          selected={selectedId === city.id}
          static={!onSelect}
          onSelect={onSelect ? () => onSelect(city) : undefined}
        />
      ))}
    </div>
  );
}
