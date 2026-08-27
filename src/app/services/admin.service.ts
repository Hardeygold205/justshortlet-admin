import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../environments/environment';
import {
  User,
  AdminCreateRequest,
  AdminUpdateRequest,
} from '../models/user.model';

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
export class AdminService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/admins`;

  getAllAdmins(): Observable<User[]> {
    return this.http
      .get<ApiEnvelope<User[]>>(this.baseUrl)
      .pipe(map((res) => res.data));
  }

  getAdminById(id: string): Observable<User> {
    return this.http
      .get<ApiEnvelope<User>>(`${this.baseUrl}/${id}`)
      .pipe(map((res) => res.data));
  }

  createAdmin(data: AdminCreateRequest): Observable<User> {
    return this.http
      .post<ApiEnvelope<User>>(this.baseUrl, data)
      .pipe(map((res) => res.data));
  }

  updateAdmin(id: string, data: AdminUpdateRequest): Observable<User> {
    return this.http
      .patch<ApiEnvelope<User>>(`${this.baseUrl}/${id}`, data)
      .pipe(map((res) => res.data));
  }

  deleteAdmin(id: string): Observable<void> {
    return this.http
      .delete<ApiEnvelope<void>>(`${this.baseUrl}/${id}`)
      .pipe(map((res) => res.data));
  }

  getAllUsers(): Observable<PaginatedUsers> {
    return this.http
      .get<ApiEnvelope<PaginatedUsers>>(`${environment.apiUrl}/users`)
      .pipe(map((res) => res.data));
  }

  getUserById(userId: string): Observable<User> {
    return this.http
      .get<ApiEnvelope<User>>(`${environment.apiUrl}/users/${userId}`)
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
    return this.http.delete<void>(`${this.baseUrl}/users/${userId}`);
  }

  updateUserRoleOrStatus(
    userId: string,
    data: Partial<User>,
  ): Observable<User> {
    return this.http.patch<User>(`${this.baseUrl}/users/${userId}`, data);
  }
}
