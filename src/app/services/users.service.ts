import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/users`;

  getAllUsers(): Observable<PaginatedUsers> {
    return this.http
      .get<ApiEnvelope<PaginatedUsers>>(this.baseUrl)
      .pipe(map((res) => res.data));
  }

  getUserById(userId: string): Observable<User> {
    return this.http
      .get<ApiEnvelope<User>>(`${environment.apiUrl}/${userId}`)
      .pipe(map((res) => res.data));
  }

  // getActivities(
  //   timeframe: '24h' | '7d' | '30d' = '7d',
  //   limit = 10,
  //   page = 1,
  // ): Observable<ActivityResponse> {
  //   const params = new HttpParams()
  //     .set('timeframe', timeframe)
  //     .set('limit', limit)
  //     .set('page', page);
  //   return this.http.get<ActivityResponse>(`${this.baseUrl}/activities`, {
  //     params,
  //   });
  // }

  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${userId}`);
  }

  updateUserRoleOrStatus(
    userId: string,
    data: Partial<User>,
  ): Observable<User> {
    return this.http.patch<User>(`${this.baseUrl}/${userId}`, data);
  }
}
