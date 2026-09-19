import type { Review } from "@/features/businesses";

export interface VerifiedPlacePhoto {
  url: string;
  sourceUrl: string;
  attribution?: string;
}

export interface VerifiedPlace {
  placeId: string;
  name: string;
  category: string;
  formattedAddress: string;
  city: string;
  phone: string;
  website: string;
  mapsUrl: string;
  latitude?: number;
  longitude?: number;
  hours: { day: string; open: string }[];
  rating?: number;
  reviewCount?: number;
  reviews: Review[];
  photos: VerifiedPlacePhoto[];
  verifiedAt: string;
}

export interface PlaceResearchResult {
  place: VerifiedPlace | null;
  notice?: string;
}