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

export interface SchoolRankingEntry {
  rank: number;
  schoolId: string;
  schoolName: string;
  city: string | null;
  state: string | null;
  imageUrl: string | null;
  market: { id: string; name: string } | null;
  participants: number;
  prompts: number;
  invites: number;
  total: number;
}

export interface SchoolRankingMeta {
  scopeLabel: string;
  competition: {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    status: string;
    scoringOpen: boolean;
  } | null;
  totalSchools: number;
  totalParticipants: number;
  topPrize: number;
}

export interface SchoolRankingResponse {
  meta: SchoolRankingMeta;
  items: SchoolRankingEntry[];
  pagination: PaginationMeta;
}

export interface SchoolRankingParams {
  page?: number;
  limit?: number;
  search?: string;
  marketId?: string;
}
