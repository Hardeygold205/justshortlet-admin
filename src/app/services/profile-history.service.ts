import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'last_viewed_profile_id';

@Injectable({ providedIn: 'root' })
export class ProfileHistoryService {
  lastViewedUserId = signal<string | null>(localStorage.getItem(STORAGE_KEY));

  setLastViewed(userId: string): void {
    localStorage.setItem(STORAGE_KEY, userId);
    this.lastViewedUserId.set(userId);
  }
}
