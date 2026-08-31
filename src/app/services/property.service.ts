import { Injectable, inject, } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../environments/environment';
import {
  AdminPropertiesResponse,
  Property,
  PropertyFilterParams,
  UpdatePropertyStatusDto,
} from '../models/property.model';

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class PropertyService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/admin/properties`;
  private publicApiUrl = `${environment.apiUrl}/properties`;

  getAdminProperties(
    filters: PropertyFilterParams = {},
  ): Observable<AdminPropertiesResponse> {
    let params = new HttpParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<AdminPropertiesResponse>(this.apiUrl, { params });
  }

  getPropertyById(id: string): Observable<Property> {
    return this.http
      .get<ApiEnvelope<Property>>(`${this.publicApiUrl}/${id}`)
      .pipe(map((res) => res.data));
  }

  updatePropertyStatus(
    id: string,
    dto: UpdatePropertyStatusDto,
  ): Observable<{ success: boolean; message: string; data: Property }> {
    return this.http.patch<{
      success: boolean;
      message: string;
      data: Property;
    }>(`${this.apiUrl}/${id}/status`, dto);
  }
}
