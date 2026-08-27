import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError, map } from 'rxjs';
import { environment } from '../environments/environment';
import {
  LoginRequest,
  LoginResponse,
  RefreshRequest,
  User,
} from '../models/user.model';

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'current_user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private currentUserSignal = signal<User | null>(this.loadUserFromStorage());
  currentUser = this.currentUserSignal.asReadonly();
  isAuthenticated = computed(
    () => !!this.currentUserSignal() && !!this.getAccessToken(),
  );
  isSuperAdmin = computed(
    () => this.currentUserSignal()?.role === 'SUPER_ADMIN',
  );
  isAdmin = computed(() => {
    const role = this.currentUserSignal()?.role;
    return role === 'ADMIN' || role === 'SUPER_ADMIN';
  });

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<
        ApiEnvelope<LoginResponse>
      >(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(
        map((res) => res.data),
        tap((response) => {
          this.setTokens(response.accessToken, response.refreshToken);
          if (response.user) {
            this.setUser(response.user);
          } else {
            this.fetchCurrentUser().subscribe();
          }
        }),
        catchError((error) => {
          console.error('Login failed', error);
          return throwError(() => error);
        }),
      );
  }

  refreshToken(): Observable<LoginResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token'));
    }
    return this.http
      .post<ApiEnvelope<LoginResponse>>(`${environment.apiUrl}/auth/refresh`, {
        refreshToken,
      } as RefreshRequest)
      .pipe(
        map((res) => res.data),
        tap((response) => {
          this.setTokens(response.accessToken, response.refreshToken);
        }),
        catchError((error) => {
          this.logout();
          return throwError(() => error);
        }),
      );
  }

  fetchCurrentUser(): Observable<User> {
    return this.http
      .get<ApiEnvelope<User>>(`${environment.apiUrl}/users/me`)
      .pipe(
        map((res) => res.data),
        tap((user) => this.setUser(user)),
        catchError((error) => {
          if (error.status === 401) {
            this.logout();
          }
          return throwError(() => error);
        }),
      );
  }

  logout(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUserSignal.set(null);
    this.router.navigate(['/auth/login']);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  private setUser(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.currentUserSignal.set(user);
  }

  private loadUserFromStorage(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }
}
