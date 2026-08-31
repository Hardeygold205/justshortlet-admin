export interface Amenity {
  id: string;
  name: string;
  slug: string;
  category: string;
  icon: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAmenityDto {
  name: string;
  slug: string;
  category: string;
  icon: string;
}

export type UpdateAmenityDto = Partial<CreateAmenityDto>;

export interface AmenitiesResponse {
  success: boolean;
  message: string;
  data: Amenity[];
}

export interface SingleAmenityResponse {
  success: boolean;
  message: string;
  data: Amenity;
}
