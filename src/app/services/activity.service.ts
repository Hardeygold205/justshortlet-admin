import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../environments/environment';
import {
  PaginatedActivities,
  ActivityQueryParams,
} from '../models/activity.model';

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/activities`;

  private buildParams(query?: ActivityQueryParams): HttpParams {
    let params = new HttpParams();
    if (!query) return params;
    if (query.page) params = params.set('page', query.page);
    if (query.limit) params = params.set('limit', query.limit);
    if (query.category) params = params.set('category', query.category);
    if (query.type) params = params.set('type', query.type);
    return params;
  }

  getAllActivities(
    query?: ActivityQueryParams,
  ): Observable<PaginatedActivities> {
    return this.http
      .get<
        ApiEnvelope<PaginatedActivities>
      >(this.baseUrl, { params: this.buildParams(query) })
      .pipe(map((res) => res.data));
  }

  getUserActivities(
    userId: string,
    query?: ActivityQueryParams,
  ): Observable<PaginatedActivities> {
    return this.http
      .get<ApiEnvelope<PaginatedActivities>>(`${this.baseUrl}/user/${userId}`, {
        params: this.buildParams(query),
      })
      .pipe(map((res) => res.data));
  }
}
