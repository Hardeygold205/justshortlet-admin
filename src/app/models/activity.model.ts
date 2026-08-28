export interface Activity {
  id: string;
  type: string;
  category: 'ACCOUNT' | 'BOOKING' | 'TRANSACTION' | 'SYSTEM' | 'AUTH';
  description: string;
  actorId: string | null;
  actorEmail: string | null;
  targetId: string | null;
  metadata: Record<string, any> | null;
  createdAt: string;
}

export interface Pagination {
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedActivities {
  activities: Activity[];
  pagination: Pagination;
}

export interface ActivityQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  type?: string;
}
