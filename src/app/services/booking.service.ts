import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import {
  AdminBookingsResponse,
  BookingFilterParams,
  SingleBookingResponse,
} from '../models/booking.model';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private http = inject(HttpClient);
  private adminApiUrl = `${environment.apiUrl}/admin/bookings`;
  private publicApiUrl = `${environment.apiUrl}/bookings`;

  getAdminBookings(
    filters: BookingFilterParams = {},
  ): Observable<AdminBookingsResponse> {
    let httpParams = new HttpParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        httpParams = httpParams.set(key, String(value).trim());
      }
    });

    return this.http.get<AdminBookingsResponse>(this.adminApiUrl, {
      params: httpParams,
    });
  }

  getBookingById(id: string): Observable<SingleBookingResponse> {
    return this.http.get<SingleBookingResponse>(`${this.publicApiUrl}/${id}`);
  }
}
