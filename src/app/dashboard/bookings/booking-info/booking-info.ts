import { Component, inject, OnInit, signal } from '@angular/core';
import {
  CommonModule,
  CurrencyPipe,
  DatePipe,
  Location,
} from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BookingService } from '../../../services/booking.service';
import { Booking, BookingStatus } from '../../../models/booking.model';

@Component({
  selector: 'app-booking-info',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe, DatePipe],
  templateUrl: './booking-info.html',
  styleUrl: './booking-info.css',
})
export class BookingInfo implements OnInit {
  private route = inject(ActivatedRoute);
  private bookingService = inject(BookingService);
  private location = inject(Location);

  isLoading = signal<boolean>(true);
  booking = signal<Booking | null>(null);

  ngOnInit(): void {
    const bookingId = this.route.snapshot.paramMap.get('bookingId');
    if (bookingId) {
      this.fetchBooking(bookingId);
    }
  }

  goBack(): void {
    this.location.back();
  }

  fetchBooking(id: string): void {
    this.isLoading.set(true);
    this.bookingService.getBookingById(id).subscribe({
      next: (res) => {
        this.booking.set(res.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load booking details', err);
        this.isLoading.set(false);
      },
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
