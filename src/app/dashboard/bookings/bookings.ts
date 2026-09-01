import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import {
  Booking,
  BookingFilterParams,
  BookingStatus,
} from '../../models/booking.model';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, CurrencyPipe, DatePipe],
  templateUrl: './bookings.html',
  styleUrl: './bookings.css',
})
export class Bookings implements OnInit {
  private bookingService = inject(BookingService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isLoading = signal<boolean>(true);
  bookings = signal<Booking[]>([]);

  filters = signal<BookingFilterParams>({
    page: 1,
    limit: 20,
    status: '',
    propertyId: '',
  });

  pagination = signal({
    total: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 20,
    hasNextPage: false,
    hasPrevPage: false,
  });

  statuses: BookingStatus[] = [
    'PENDING',
    'CONFIRMED',
    'CANCELLED',
    'REJECTED',
    'COMPLETED',
  ];

  ngOnInit(): void {
    // Single source of truth: react ONLY to URL query parameter changes
    this.route.queryParams.subscribe((params) => {
      const activeFilters: BookingFilterParams = {
        page: params['page'] ? Number(params['page']) : 1,
        limit: 20,
        status: params['status'] || '',
        propertyId: params['propertyId'] || '',
      };

      // Synchronize internal signal state with current URL
      this.filters.set(activeFilters);

      // Trigger API fetch with clean parameters extracted directly from URL
      this.fetchBookings(activeFilters);
    });
  }

  fetchBookings(currentFilters: BookingFilterParams): void {
    this.isLoading.set(true);

    this.bookingService.getAdminBookings(currentFilters).subscribe({
      next: (res) => {
        this.bookings.set(res.data.bookings);
        this.pagination.set(res.data.pagination);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load bookings', err);
        this.isLoading.set(false);
      },
    });
  }

  updateStatusFilter(status: any): void {
    this.filters.update((f) => ({ ...f, status }));
  }

  updatePropertyIdFilter(propertyId: string): void {
    this.filters.update((f) => ({ ...f, propertyId }));
  }

  applyFilters(): void {
    this.filters.update((f) => ({ ...f, page: 1 }));
    this.updateUrlParams();
  }

  resetFilters(): void {
    this.filters.set({
      page: 1,
      limit: 20,
      status: '',
      propertyId: '',
    });
    this.updateUrlParams();
  }

  changePage(page: number): void {
    if (page < 1 || page > this.pagination().totalPages) return;
    this.filters.update((f) => ({ ...f, page }));
    this.updateUrlParams();
  }

  private updateUrlParams(): void {
    const f = this.filters();

    const queryParams: Record<string, any> = {
      status: f.status?.trim() || undefined,
      propertyId: f.propertyId?.trim() || undefined,
      page: f.page && f.page > 1 ? f.page : undefined,
    };

    // Navigate to update URL. This will automatically trigger route.queryParams subscription above
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
    });
  }

  getStatusClass(status: BookingStatus): string {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'PENDING':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'CANCELLED':
      case 'REJECTED':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'COMPLETED':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default:
        return 'bg-neutral-800 text-neutral-400 border-neutral-700';
    }
  }
}
