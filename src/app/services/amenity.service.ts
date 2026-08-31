import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import {
  AmenitiesResponse,
  CreateAmenityDto,
  SingleAmenityResponse,
  UpdateAmenityDto,
} from '../models/amenity.model';

@Injectable({
  providedIn: 'root',
})
export class AmenityService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/amenities`;

  getAllAmenities(): Observable<AmenitiesResponse> {
    return this.http.get<AmenitiesResponse>(this.apiUrl);
  }

  createAmenity(dto: CreateAmenityDto): Observable<SingleAmenityResponse> {
    return this.http.post<SingleAmenityResponse>(this.apiUrl, dto);
  }

  updateAmenity(
    id: string,
    dto: UpdateAmenityDto,
  ): Observable<SingleAmenityResponse> {
    return this.http.patch<SingleAmenityResponse>(`${this.apiUrl}/${id}`, dto);
  }

  deleteAmenity(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(
      `${this.apiUrl}/${id}`,
    );
  }
}
