import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AdminService } from '../../services/admin.service';
import { ActivityService } from '../../services/activity.service';
import { UserService } from '../../services/users.service';
import { PropertyService } from '../../services/property.service';
import { BookingService } from '../../services/booking.service';
import { User } from '../../models/user.model';
import { Activity } from '../../models/activity.model';
import { Booking } from '../../models/booking.model';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './overview.html',
  styleUrl: './overview.css',
})
export class Overview implements OnInit {
  authService = inject(AuthService);
  private adminService = inject(AdminService);
  private userService = inject(UserService);
  private activityService = inject(ActivityService);
  private propertyService = inject(PropertyService);
  private bookingService = inject(BookingService);

  isLoading = signal<boolean>(true);
  recentActivities = signal<Activity[]>([]);
  recentAdmins = signal<User[]>([]);
  users = signal<User[]>([]);
  bookings = signal<Booking[]>([]);

  stats = signal({
    totalGuests: 0,
    totalHosts: 0,
    allAccounts: 0,
    totalAdmins: 0,
    totalBookings: 0,
    activeAccounts: 0,
    suspended: 0,
    totalProperties: 0,
    pendingReviewProperties: 0,
    publishedProperties: 0,
  });

  roleDistribution = computed(() => {
    const all = this.users();
    const guests = all.filter((u) => u.role === 'GUEST').length;
    const hosts = all.filter((u) => u.role === 'HOST').length;
    const total = guests + hosts || 1;

    return [
      {
        label: 'Guests',
        value: guests,
        percent: Math.round((guests / total) * 100),
        color: '#fafafa',
      },
      {
        label: 'Hosts',
        value: hosts,
        percent: Math.round((hosts / total) * 100),
        color: '#525252',
      },
    ];
  });

  pieGradient = computed(() => {
    let cumulative = 0;
    const parts = this.roleDistribution().map((s) => {
      const start = cumulative;
      cumulative += s.percent;
      return `${s.color} ${start}% ${cumulative}%`;
    });
    return `conic-gradient(${parts.join(', ')})`;
  });

  signupTrend = computed(() => {
    const all = this.users();
    const days: { label: string; count: number }[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dayKey = d.toISOString().split('T')[0];
      const count = all.filter((u) => u.createdAt?.startsWith(dayKey)).length;
      days.push({
        label: d.toLocaleDateString('en-US', { weekday: 'short' }),
        count,
      });
    }
    return days;
  });

  maxSignupCount = computed(() =>
    Math.max(...this.signupTrend().map((d) => d.count), 1),
  );

  ngOnInit(): void {
    this.loadOverviewData();
    this.fetchBookingsCount();
  }

  fetchBookingsCount(): void {
    this.bookingService.getAdminBookings({ limit: 50, page: 1 }).subscribe({
      next: (res) => {
        const totalCount = res.data.pagination.total;

        this.stats.update((s) => ({
          ...s,
          totalBookings: totalCount,
        }));

        this.bookings.set(res.data.bookings);
      },
      error: (err) => {
        console.error('Failed to load total bookings', err);
        this.bookings.set([]);
        this.stats.update((s) => ({ ...s, totalBookings: 0 }));
      },
    });
  }

  loadOverviewData(): void {
    this.isLoading.set(true);

    this.userService.getAllUsers({ limit: 100 }).subscribe({
      next: (res) => {
        const all = res.users;
        this.users.set(all);

        const guestsCount = all.filter((u) => u.role === 'GUEST').length;
        const hostsCount = all.filter((u) => u.role === 'HOST').length;
        const allCount = all.filter(
          (u) => u.role !== 'ADMIN' && u.role !== 'SUPER_ADMIN',
        ).length;
        const activeCount = all.filter(
          (u) =>
            u.status === 'ACTIVE' &&
            u.role !== 'ADMIN' &&
            u.role !== 'SUPER_ADMIN',
        ).length;
        const suspendedCount = all.filter(
          (u) =>
            u.status === 'SUSPENDED' &&
            u.role !== 'ADMIN' &&
            u.role !== 'SUPER_ADMIN',
        ).length;

        this.stats.update((s) => ({
          ...s,
          totalGuests: guestsCount,
          totalHosts: hostsCount,
          activeAccounts: activeCount,
          allAccounts: allCount,
          suspended: suspendedCount,
        }));
      },
    });

    this.activityService.getAllActivities({ limit: 10, page: 1 }).subscribe({
      next: ({ activities }) => this.recentActivities.set(activities),
      error: () => this.recentActivities.set([]),
    });

    this.propertyService.getAdminProperties({ limit: 50 }).subscribe({
      next: (res) => {
        const properties = res.data.properties;
        const totalProps = res.data.pagination.total;
        const pendingCount = properties.filter(
          (p) => p.status === 'PENDING_REVIEW',
        ).length;
        const publishedCount = properties.filter(
          (p) => p.status === 'PUBLISHED',
        ).length;

        this.stats.update((s) => ({
          ...s,
          totalProperties: totalProps,
          pendingReviewProperties: pendingCount,
          publishedProperties: publishedCount,
        }));
      },
      error: (err) => console.error('Failed to load property stats', err),
    });

    if (this.authService.isSuperAdmin()) {
      this.adminService.getAllAdmins().subscribe({
        next: (admins) => {
          this.recentAdmins.set(admins.slice(0, 5));
          this.stats.update((s) => ({ ...s, totalAdmins: admins.length }));
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false),
      });
    } else {
      this.isLoading.set(false);
    }
  }
}
