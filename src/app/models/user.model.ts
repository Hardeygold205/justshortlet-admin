export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'USER' | 'HOST';
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'DISABLED';

export interface User {
  id: string;
  email: string;
  phone: string;
  role: UserRole;
  status?: UserStatus;
  firstName?: string;
  lastName?: string;
  createdAt?: string;
  updatedAt?: string;
  profile?: {
    avatarUrl: string;
    firstName?: string;
    lastName?: string;
    username?: string
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user?: User;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface AdminCreateRequest {
  email: string;
  password: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
  firstName?: string;
  lastName?: string;
}

export interface AdminUpdateRequest {
  role?: 'ADMIN' | 'SUPER_ADMIN';
  status?: UserStatus;
  firstName?: string;
  lastName?: string;
}
