import { Routes } from '@angular/router';
import { authGuard, guestGuard, superAdminGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./auth/login/login').then((m) => m.Login),
        canActivate: [guestGuard],
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard').then((m) => m.Dashboard),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./dashboard/overview/overview').then((m) => m.Overview),
      },
      {
        path: 'tasks',
        loadComponent: () =>
          import('./dashboard/overview/overview').then((m) => m.Overview),
      },
      {
        path: 'admins',
        loadComponent: () =>
          import('./dashboard/admins/admins').then((m) => m.Admins),
        canActivate: [superAdminGuard],
      },
      {
        path: 'guests',
        loadComponent: () =>
          import('./dashboard/guests/guests').then((m) => m.Guests),
      },
      {
        path: 'profile/:userId',
        loadComponent: () =>
          import('./dashboard/profile/profile').then((m) => m.Profile),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./dashboard/settings/settings').then((m) => m.Settings),
      },
      {
        path: 'hosts',
        loadComponent: () =>
          import('./dashboard/hosts/hosts').then((m) => m.Hosts),
      },
      {
        path: 'bookings',
        loadComponent: () =>
          import('./dashboard/bookings/bookings').then((m) => m.Bookings),
      },
      {
        path: 'properties',
        loadComponent: () =>
          import('./dashboard/properties/properties').then((m) => m.Properties),
      },
      {
        path: 'properties/property-info/:propertyId',
        loadComponent: () =>
          import('./dashboard/properties/property-info/property-info').then(
            (m) => m.PropertyInfo,
          ),
      },
      {
        path: 'amenities',
        loadComponent: () =>
          import('./dashboard/amenities/amenities').then((m) => m.Amenities),
      },
      {
        path: 'recent-activity',
        loadComponent: () =>
          import('./dashboard/recent-activity/recent-activity').then(
            (m) => m.RecentActivity,
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
