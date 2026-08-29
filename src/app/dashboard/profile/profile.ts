import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { ActivityService } from '../../services/activity.service';
import { User } from '../../models/user.model';
import { Activity, Pagination } from '../../models/activity.model';
import { ProfileHistoryService } from '../../services/profile-history.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private profileHistory = inject(ProfileHistoryService);
  private adminService = inject(AdminService);
  private activityService = inject(ActivityService);

  user = signal<User | null>(null);
  activities = signal<Activity[]>([]);
  pagination = signal<Pagination | null>(null);
  isLoading = signal(true);
  isActivityLoading = signal(true);
  error = signal<string | null>(null);
  currentPage = signal(1);
  readonly pageSize = 10;

  goBack(): void {
    this.location.back();
  }

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('userId');
    if (!userId) {
      this.error.set('No user specified');
      this.isLoading.set(false);
      return;
    }
    this.loadUser(userId);
    this.loadActivities(userId);
  }

  private loadUser(userId: string): void {
    this.isLoading.set(true);
    this.adminService.getUserById(userId).subscribe({
      next: (user) => {
        this.user.set(user);
        this.isLoading.set(false);
        this.profileHistory.setLastViewed(userId);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.error.set(err?.error?.message || 'Failed to load user');
      },
    });
  }

  loadActivities(userId?: string): void {
    const id = userId || this.user()?.id;
    if (!id) return;

    this.isActivityLoading.set(true);
    this.activityService
      .getUserActivities(id, { page: this.currentPage(), limit: this.pageSize })
      .subscribe({
        next: ({ activities, pagination }) => {
          this.activities.set(activities);
          this.pagination.set(pagination);
          this.isActivityLoading.set(false);
        },
        error: () => {
          this.isActivityLoading.set(false);
        },
      });
  }

  nextPage(): void {
    if (this.pagination()?.hasNextPage) {
      this.currentPage.update((p) => p + 1);
      this.loadActivities();
    }
  }

  prevPage(): void {
    if (this.pagination()?.hasPrevPage) {
      this.currentPage.update((p) => p - 1);
      this.loadActivities();
    }
  }

  getAvatarUrl(user: User): string {
    if (user.profile?.avatarUrl) {
      return user.profile.avatarUrl;
    }

    const firstName = user.profile?.firstName || '';
    const lastName = user.profile?.lastName || '';
    const fullName = `${firstName} ${lastName}`.trim() || user.email || 'Host';

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=171717&color=fafafa`;
  }
}
