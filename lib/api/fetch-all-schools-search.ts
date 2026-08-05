import { apiSlice } from "@/features/api/apiSlice";
import { getBrowserStore } from "@/store";
import type { School } from "@/lib/api/schools.types";

const PAGE_LIMIT = 100;

export async function fetchAllSchoolsBySearch(
  search: string,
  marketId?: string,
): Promise<School[]> {
  const term = search.trim();

  if (!term) {
    return [];
  }

  const store = getBrowserStore();
  const allSchools: School[] = [];
  let page = 1;

  while (true) {
    const data = await store
      .dispatch(apiSlice.endpoints.listSchools.initiate({ search: term, marketId, page, limit: PAGE_LIMIT }))
      .unwrap();

    allSchools.push(...data.items);

    if (page >= data.pagination.totalPages) {
      break;
    }

    page += 1;
  }

  return allSchools;
}

export async function fetchAllSchools(marketId?: string): Promise<School[]> {
  const store = getBrowserStore();
  return store
    .dispatch(apiSlice.endpoints.listAllSchools.initiate(marketId ? { marketId } : undefined))
    .unwrap();
}