export type BookingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'REJECTED'
  | 'COMPLETED';

export interface BookingPropertyImage {
  id: string;
  propertyId: string;
  uploadId: string;
  sortOrder: number;
  isCover: boolean;
  caption?: string | null;
  upload?: {
    url: string;
  };
}

export interface BookingProperty {
  id: string;
  title: string;
  slug: string;
  city: string;
  state: string;
  hostId: string;
  images?: BookingPropertyImage[];
}

export interface BookingUser {
  id: string;
  email: string;
  phone?: string | null;
  profile?: {
    firstName?: string | null;
    lastName?: string | null;
    avatarUrl?: string | null;
  };
}

export interface Booking {
  id: string;
  propertyId: string;
  userId: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  pricePerNight: string;
  cleaningFee: string;
  serviceFeePercent: string;
  subtotal: string;
  serviceFee: string;
  total: string;
  status: BookingStatus;
  guestNote?: string | null;
  hostNote?: string | null;
  cancelledBy?: string | null;
  cancellationReason?: string | null;
  cancelledAt?: string | null;
  confirmedAt?: string | null;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  property?: BookingProperty;
  user?: BookingUser;
}

export interface BookingFilterParams {
  page?: number;
  limit?: number;
  status?: BookingStatus | '';
  propertyId?: string;
}

export interface AdminBookingsResponse {
  success: boolean;
  message: string;
  data: {
    bookings: Booking[];
    pagination: {
      total: number;
      totalPages: number;
      currentPage: number;
      limit: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

export interface SingleBookingResponse {
  success: boolean;
  message: string;
  data: Booking;
}
