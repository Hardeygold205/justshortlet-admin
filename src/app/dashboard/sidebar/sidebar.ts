import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProfileHistoryService } from '../../services/profile-history.service';
import {
  LucideAngularModule,
  LayoutDashboard,
  Building2,
  CalendarCheck,
  User as UserIcon,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  LucideIconData,
  ActivityIcon,
  ShieldUser,
  UserRound,
  Menu,
  X,
} from 'lucide-angular';

interface NavItem {
  label: string;
  path: string;
  icon?: LucideIconData;
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
  profileHistory = inject(ProfileHistoryService);

  collapsed = input<boolean>(false);
  toggle = output<void>();
  mobileOpen = signal(false);

  readonly PanelLeftClose = PanelLeftClose;
  readonly PanelLeftOpen = PanelLeftOpen;
  readonly Menu = Menu;
  readonly X = X;
  readonly UserIcon = UserIcon;

  navItems: NavItem[] = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    {
      label: 'Admins',
      path: '/dashboard/admins',
      icon: ShieldUser,
      superAdminOnly: true,
    },
    { label: 'Guests', path: '/dashboard/guests', icon: UserRound },
    { label: 'Hosts', path: '/dashboard/hosts' },
    {
      label: 'Activities',
      path: '/dashboard/recent-activity',
      icon: ActivityIcon,
    },
    { label: 'Properties', path: '/dashboard/properties', icon: Building2 },
    { label: 'Bookings', path: '/dashboard/bookings', icon: CalendarCheck },
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

  toggleMobile(): void {
    this.mobileOpen.update((v) => !v);
  }

  closeMobile(): void {
    this.mobileOpen.set(false);
  }
}
