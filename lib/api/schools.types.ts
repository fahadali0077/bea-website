export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}

export interface School {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
  marketId: string;
  imageUrl: string | null;
  participantCount: number;
  status: string;
  createdAt: string;
  market?: {
    id: string;
    name: string;
    city: string | null;
    state: string | null;
  };
}

export interface SchoolsListResponse {
  items: School[];
  pagination: PaginationMeta;
}

export interface ListSchoolsParams {
  page?: number;
  limit?: number;
  search?: string;
  marketId?: string;
  state?: string;
}