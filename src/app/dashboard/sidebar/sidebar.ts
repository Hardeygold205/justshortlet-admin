import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {
  LucideAngularModule,
  LayoutDashboard,
  UserCheck,
  Building2,
  CalendarCheck,
  User,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  LucideIconData,
  ActivityIcon,
  ShieldUser,
  UserRound,
} from 'lucide-angular';

interface NavItem {
  label: string;
  path: string;
  icon: LucideIconData;
  superAdminOnly?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  authService = inject(AuthService);

  // Angular Signal I/O setup
  collapsed = input<boolean>(false);
  toggle = output<void>();

  // Icon References
  readonly PanelLeftClose = PanelLeftClose;
  readonly PanelLeftOpen = PanelLeftOpen;

  // Complete Dashboard Nav Items
  navItems: NavItem[] = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    {
      label: 'Admins',
      path: '/dashboard/admins',
      icon: ShieldUser,
      superAdminOnly: true,
    },
    { label: 'Guests', path: '/dashboard/guests', icon: UserRound },
    { label: 'Hosts', path: '/dashboard/hosts', icon: UserCheck },
    {
      label: 'Activities',
      path: '/dashboard/recent-activity',
      icon: ActivityIcon,
    },
    { label: 'Properties', path: '/dashboard/properties', icon: Building2 },
    { label: 'Bookings', path: '/dashboard/bookings', icon: CalendarCheck },
    { label: 'Profile', path: '/dashboard/profile', icon: User },
    { label: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  get visibleItems(): NavItem[] {
    return this.navItems.filter(
      (item) => !item.superAdminOnly || this.authService.isSuperAdmin(),
    );
  }

  onToggle(): void {
    this.toggle.emit();
  }
}
