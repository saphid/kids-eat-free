export interface Venue {
  id: string;
  name: string;
  area: string;
  address: string;
  latitude?: number;
  longitude?: number;
  suburb?: string;
  postcode?: string;
  days: DayOfWeek[];
  details: string;
  membershipRequired: boolean;
  membershipDetails: string | null;
  website: string;
  phone: string[];
  extraDetails: ExtraDetail[];
  verifiedDate: string;
  active: boolean;
  tags?: string[];
}

export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export interface ExtraDetail {
  type: 'google_reviews' | 'facebook' | 'instagram' | 'tripadvisor' | 'yelp' | 'other';
  label: string;
  url: string;
  icon?: string;
}

export interface VenueFilters {
  day?: DayOfWeek | 'all';
  area?: string | 'all';
  region?: string;
  searchQuery?: string;
  locationMode?: 'area' | 'nearby';
  userLocation?: {
    latitude: number;
    longitude: number;
  } | null;
  radiusKm?: number;
  manualLocation?: string;
}

export interface Area {
  name: string;
  displayName: string;
}

export interface Region {
  name: string;
  country: string;
  priority: number;
  areas: Record<string, Area>;
}

// Extended region metadata (from data repo)
export interface RegionMetadata extends Region {
  id: string;
  timezone?: string;
  defaultCenter?: {
    latitude: number;
    longitude: number;
  };
  files?: {
    venues: string;
    suburbs: string;
  };
}

export interface RegionData {
  region: string;
  lastUpdated: string;
  venues: Venue[];
}

export interface Metadata {
  regions: Record<string, RegionMetadata>;
  version?: string;
  lastUpdated?: string;
}
