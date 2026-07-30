export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}

export interface Market {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
  country: string;
  imageUrl: string | null;
  unlockTarget: number | null;
  participantCount: number;
  status: string;
  createdAt: string;
}

export interface MarketsListResponse {
  markets: Market[];
  pagination: PaginationMeta;
}

export interface ListMarketsParams {
  page?: number;
  limit?: number;
  search?: string;
  state?: string;
  country?: string;
}
