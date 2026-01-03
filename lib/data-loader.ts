/**
 * Data Loader Module
 * 
 * This module provides types and helper functions for working with venue and suburb data.
 * 
 * For static export builds, data is imported directly in components from the data folder.
 * This module provides common types and utility functions used across the application.
 */

import { Venue, Region, RegionMetadata, Metadata } from './types';

// Types for data loading
export interface RegionVenueData {
  region: string;
  lastUpdated: string;
  notes?: string;
  venues: Venue[];
}

export interface Suburb {
  name: string;
  displayName: string;
  latitude: number;
  longitude: number;
}

export interface RegionSuburbData {
  region: string;
  suburbs: Suburb[];
}

export interface DataConfig {
  name: string;
  description: string;
  version: string;
  defaultRegion: string;
}

/**
 * Get areas for a region from metadata
 */
export function getAreasFromMetadata(
  metadata: Metadata,
  regionId: string
): Record<string, { name: string; displayName: string }> {
  const region = metadata.regions[regionId];
  if (!region) {
    return {};
  }
  return region.areas || {};
}

/**
 * Get all regions from metadata, sorted by priority
 */
export function getRegionsFromMetadata(
  metadata: Metadata
): RegionMetadata[] {
  return Object.values(metadata.regions).sort((a, b) => a.priority - b.priority);
}

/**
 * Get venues from venue data, optionally filtered by active status
 */
export function getVenuesFromData(
  venueData: RegionVenueData,
  activeOnly: boolean = true
): Venue[] {
  if (activeOnly) {
    return venueData.venues.filter(v => v.active);
  }
  return venueData.venues;
}

/**
 * Convert suburb data to autocomplete suggestions
 */
export function suburbsToSuggestions(
  suburbData: RegionSuburbData
): { display_name: string; latitude: number; longitude: number }[] {
  return suburbData.suburbs.map(s => ({
    display_name: s.displayName,
    latitude: s.latitude,
    longitude: s.longitude,
  }));
}
