import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { Sidebar } from './sidebar/sidebar';
import { Navbar } from './navbar/navbar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Sidebar, Navbar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  sidebarCollapsed = signal(false);
  pageTitle = signal('Overview');

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.pageTitle.set(this.resolveTitle(e.urlAfterRedirects));
      });
  }

  private resolveTitle(url: string): string {
    const path = url.split('?')[0];

    if (/^\/dashboard\/profile\/[^/]+$/.test(path)) {
      return 'Profile';
    }
    if (/^\/dashboard\/bookings\/booking-info\/[^/]+$/.test(path)) {
      return 'Booking Details';
    }
    if (/^\/dashboard\/properties\/property-info\/[^/]+$/.test(path)) {
      return 'Property Details';
    }

    const staticTitles: Record<string, string> = {
      '/dashboard': 'Overview',
      '/dashboard/admins': 'Admin',
      '/dashboard/guests': 'Guests',
      '/dashboard/hosts': 'Hosts',
      '/dashboard/settings': 'Settings',
      '/dashboard/recent-activity': 'Activities',
      '/dashboard/bookings': 'Bookings',
      '/dashboard/properties': 'Properties',
      '/dashboard/amenities': 'Amenities',
    };

    return staticTitles[path] || 'Dashboard';
  }

  toggleSidebar(): void {
    this.sidebarCollapsed.update((v) => !v);
  }
}
