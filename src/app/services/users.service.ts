import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../environments/environment';
import { User } from '../models/user.model';

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

interface PaginatedUsers {
  users: User[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  role?: string;
  status?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/users`;

  getAllUsers(query?: UserQueryParams): Observable<PaginatedUsers> {
    let params = new HttpParams();
    if (query?.page) params = params.set('page', query.page);
    if (query?.limit) params = params.set('limit', query.limit);
    if (query?.role) params = params.set('role', query.role);
    if (query?.status) params = params.set('status', query.status);

    return this.http
      .get<ApiEnvelope<PaginatedUsers>>(this.baseUrl, { params })
      .pipe(map((res) => res.data));
  }

  getUserById(userId: string): Observable<User> {
    return this.http
      .get<ApiEnvelope<User>>(`${this.baseUrl}/${userId}`)
      .pipe(map((res) => res.data));
  }

  deleteUser(userId: string): Observable<void> {
    return this.http
      .delete<ApiEnvelope<void>>(`${this.baseUrl}/${userId}`)
      .pipe(map((res) => res.data));
  }

  updateUserRoleOrStatus(
    userId: string,
    data: Partial<User>,
  ): Observable<User> {
    return this.http
      .patch<ApiEnvelope<User>>(`${this.baseUrl}/${userId}`, data)
      .pipe(map((res) => res.data));
  }
}
