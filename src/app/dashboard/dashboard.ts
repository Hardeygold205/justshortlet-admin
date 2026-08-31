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

  private titleMap: Record<string, string> = {
    '/dashboard': 'Overview',
    '/dashboard/admins': 'Admin Management',
    '/dashboard/guests': 'Guests Management',
    '/dashboard/hosts': 'Hosts Management',
    '/dashboard/profile': 'Profile',
    '/dashboard/settings': 'Settings',
    '/dashboard/bookings': 'Bookings',
    '/dashboard/properties': 'Properties',
    '/dashboard/properties/property-info': 'Property Details',
  };

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.pageTitle.set(this.titleMap[e.urlAfterRedirects] || 'Dashboard');
      });
  }

  toggleSidebar(): void {
    this.sidebarCollapsed.update((v) => !v);
  }
}
