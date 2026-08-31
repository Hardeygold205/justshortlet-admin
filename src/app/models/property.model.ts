export type PropertyType =
  | 'APARTMENT'
  | 'HOUSE'
  | 'DUPLEX'
  | 'STUDIO'
  | 'PENTHOUSE'
  | 'VILLA'
  | 'OTHER';

export type PropertyStatus =
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'PUBLISHED'
  | 'REJECTED'
  | 'SUSPENDED'
  | 'ARCHIVED';

export type CancellationPolicy = 'FLEXIBLE' | 'MODERATE' | 'STRICT';

export interface PropertyImage {
  id: string;
  propertyId: string;
  uploadId: string;
  sortOrder: number;
  isCover: boolean;
  caption?: string | null;
  upload?: { url: string; thumbnailUrl?: string | null };
}

export interface PropertyAmenity {
  propertyId: string;
  amenityId: string;
  amenity: {
    id: string;
    name: string;
    slug: string;
    category: string;
    icon: string;
  };
}

export interface PropertyHost {
  id: string;
  email: string;
  phone?: string | null;
  profile?: {
    firstName?: string | null;
    lastName?: string | null;
    avatarUrl?: string | null;
  };
}

export interface Property {
  id: string;
  hostId: string;
  title: string;
  description: string;
  slug: string;
  type: PropertyType;
  status: PropertyStatus;
  address: string;
  city: string;
  state: string;
  country: string;
  latitude: string;
  longitude: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  beds: number;
  pricePerNight: string;
  cleaningFee: string;
  serviceFeePercent: string;
  weeklyDiscountPercent: string;
  monthlyDiscountPercent: string;
  minNights: number;
  maxNights: number;
  checkInTime: string;
  checkOutTime: string;
  instantBooking: boolean;
  houseRules: string[];
  cancellationPolicy: CancellationPolicy;
  rejectionReason?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  averageRating?: number | null;
  reviewCount: number;
  images: PropertyImage[];
  amenities: PropertyAmenity[];
  host?: PropertyHost;
}

export interface PropertyFilterParams {
  page?: number;
  limit?: number;
  city?: string;
  type?: PropertyType | string;
  minPrice?: number;
  maxPrice?: number;
  guests?: number;
  bedrooms?: number;
  amenities?: string;
  checkIn?: string;
  checkOut?: string;
  status?: PropertyStatus;
  hostId?: string;
}

export interface PropertyPagination {
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface AdminPropertiesResponse {
  success: boolean;
  message: string;
  data: {
    properties: Property[];
    pagination: PropertyPagination;
  };
}

export interface UpdatePropertyStatusDto {
  status: 'PUBLISHED' | 'REJECTED' | 'SUSPENDED' | 'ARCHIVED';
  rejectionReason?: string;
}
