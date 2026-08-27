import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityService } from '../../services/activity.service';
import { Activity, Pagination } from '../../models/activity.model';

@Component({
  selector: 'app-recent-activity',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recent-activity.html',
  styleUrl: './recent-activity.css',
})
export class RecentActivity implements OnInit {
  private activityService = inject(ActivityService);

  activities = signal<Activity[]>([]);
  pagination = signal<Pagination | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);
  currentPage = signal(1);
  readonly pageSize = 10;

  ngOnInit(): void {
    this.loadActivities();
  }

  loadActivities(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.activityService
      .getAllActivities({ page: this.currentPage(), limit: this.pageSize })
      .subscribe({
        next: ({ activities, pagination }) => {
          this.activities.set(activities);
          this.pagination.set(pagination);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.error.set(err?.error?.message || 'Failed to load activities');
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
}
