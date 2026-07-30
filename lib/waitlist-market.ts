import type { Market } from "@/lib/api/markets.types";

export type WaitlistCityOption = {
  id: string;
  name: string;
  plans: string;
  image: string;
  city: string | null;
  state: string | null;
};

const CITY_IMAGE_FALLBACKS: Record<string, string> = {
  "new york": "/waitlist/cities/new-york.png?v=3",
  boston: "/waitlist/cities/boston.png?v=3",
  miami: "/waitlist/cities/miami.png?v=3",
  "los angeles": "/waitlist/cities/los-angeles.png?v=3",
  chicago: "/waitlist/cities/chicago.png?v=3",
  austin: "/waitlist/cities/austin.png?v=3",
};

function slugify(value: string) {
  return value.trim().toLowerCase();
}

export function getMarketImageFallback(name: string, city?: string | null) {
  const cityKey = slugify(city ?? name);
  const nameKey = slugify(name);

  return (
    CITY_IMAGE_FALLBACKS[cityKey] ??
    CITY_IMAGE_FALLBACKS[nameKey] ??
    "/waitlist/cities/new-york.png?v=3"
  );
}

export function marketToCityOption(market: Market): WaitlistCityOption {
  return {
    id: market.id,
    name: market.name,
    plans: market.participantCount.toLocaleString(),
    image: market.imageUrl ?? getMarketImageFallback(market.name, market.city),
    city: market.city,
    state: market.state,
  };
}

export function formatMarketLocation(
  city: string | null,
  state: string | null,
) {
  if (city && state) {
    return `${city}, ${state}`;
  }

  return city ?? state ?? "";
}
