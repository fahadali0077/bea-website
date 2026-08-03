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
  atlanta: "/images/4x/Atlanta.png",
  austin: "/images/4x/austin.png",
  boston: "/images/4x/Boston.png",
  charlotte: "/images/4x/Charlotte.png",
  chicago: "/images/4x/Chicago.png",
  columbus: "/images/4x/Columbus.png",
  dc: "/images/4x/DC.png",
  denver: "/images/4x/DENVER.png",
  "los angeles": "/images/4x/Los%20angeles.png",
  miami: "/images/4x/Miami.png",
  "new york": "/images/4x/new%20york.png",
  phoenix: "/images/4x/Phoenix.png",
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
