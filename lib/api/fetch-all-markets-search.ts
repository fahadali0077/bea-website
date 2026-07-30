import { apiSlice } from "@/features/api/apiSlice";
import { getBrowserStore } from "@/store";
import type { Market } from "@/lib/api/markets.types";

export async function fetchAllActiveMarkets(): Promise<Market[]> {
  const store = getBrowserStore();
  return store.dispatch(apiSlice.endpoints.listAllMarkets.initiate()).unwrap();
}

export async function fetchAllMarketsBySearch(search: string): Promise<Market[]> {
  const term = search.trim();
  if (!term) {
    return [];
  }

  const all = await fetchAllActiveMarkets();
  return all.filter((m) => m.name.toLowerCase().includes(term.toLowerCase()));
}
