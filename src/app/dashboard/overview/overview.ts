import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AdminService } from '../../services/admin.service';
import { ActivityService } from '../../services/activity.service';
import { UserService } from '../../services/users.service';
import { User } from '../../models/user.model';
import { Activity } from '../../models/activity.model';

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

  isLoading = signal<boolean>(true);
  recentActivities = signal<Activity[]>([]);
  recentAdmins = signal<User[]>([]);

  stats = signal({
    totalUsers: 0,
    totalHosts: 0,
    allAccounts: 0,
    totalAdmins: 0,
    activeAccounts: 0,
    suspended: 0,
  });

  ngOnInit(): void {
    this.loadOverviewData();
  }

  loadOverviewData(): void {
    this.isLoading.set(true);
    this.userService.getAllUsers().subscribe({
      next: (res) => {
        const all = res.users;
        const usersCount = all.filter((u) => u.role === 'USER').length;
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
          totalUsers: usersCount,
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
