/**
 * Type definitions for Kids Eat Free data repository
 * These are provided for reference and documentation purposes.
 */

// Day of week type
export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

// Extra detail types (social links, reviews, etc.)
export interface ExtraDetail {
  type: 'google_reviews' | 'facebook' | 'instagram' | 'tripadvisor' | 'yelp' | 'other';
  label: string;
  url: string;
  icon?: string;
}

// Venue definition
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

// Region venue data file structure
export interface RegionVenueData {
  region: string;
  lastUpdated: string;
  notes?: string;
  venues: Venue[];
}

// Suburb/location for autocomplete
export interface Suburb {
  name: string;
  displayName: string;
  latitude: number;
  longitude: number;
}

// Region suburb data file structure
export interface RegionSuburbData {
  region: string;
  suburbs: Suburb[];
}

// Area definition (for filtering)
export interface Area {
  name: string;
  displayName: string;
}

// Geographic coordinates
export interface Coordinates {
  latitude: number;
  longitude: number;
}

// Region definition in metadata
export interface RegionMetadata {
  id: string;
  name: string;
  country: string;
  timezone: string;
  priority: number;
  defaultCenter: Coordinates;
  areas: Record<string, Area>;
  files: {
    venues: string;
    suburbs: string;
  };
}

// Global metadata file structure
export interface Metadata {
  $schema?: string;
  version: string;
  lastUpdated: string;
  regions: Record<string, RegionMetadata>;
}

// Data repository config
export interface DataConfig {
  $schema?: string;
  name: string;
  description: string;
  version: string;
  defaultRegion: string;
  dataFormat: string;
  license: string;
  repository: string;
  maintainer: string;
}
