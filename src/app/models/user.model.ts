export type UserRole = 'GUEST' | 'HOST' | 'ADMIN' | 'SUPER_ADMIN';
export type UserStatus = 'ACTIVE' | 'DISABLED' | 'SUSPENDED';

export interface UserProfile {
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  dob: string | null;
  bio: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  idVerified: boolean;
  addressVerified: boolean;
  avatarUrl: string | null;
  thumbnailUrl: string | null;
  bannerUrl: string | null;
  bannerThumbnailUrl: string | null;
}

export interface User {
  id: string;
  email: string | null;
  phone: string | null;
  emailVerified: boolean;
  phoneVerified: boolean;
  provider: string;
  role: UserRole;
  status: UserStatus;
  isActive: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
  profile?: UserProfile;
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
