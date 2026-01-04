import { Venue } from './types';
import { Suburb } from './data-loader';

export interface GeocodeResult {
  latitude: number;
  longitude: number;
  suburb?: string;
  postcode?: string;
}

export interface AutocompleteSuggestion {
  display_name: string;
  latitude: number;
  longitude: number;
}

// Cache for loaded suburbs
let cachedSuburbs: AutocompleteSuggestion[] | null = null;
let currentRegion: string | null = null;

/**
 * Set suburbs directly (for use in client components that already have the data)
 */
export function setSuburbsCache(suburbs: Suburb[], regionId: string): void {
  cachedSuburbs = suburbs.map((s: Suburb) => ({
    display_name: s.displayName,
    latitude: s.latitude,
    longitude: s.longitude,
  }));
  currentRegion = regionId;
}

/**
 * Get the currently cached suburbs
 */
export function getCachedSuburbs(): AutocompleteSuggestion[] {
  return cachedSuburbs || [];
}

/**
 * Get location suggestions for autocomplete from loaded suburb data
 * @param query - The search query
 * @param limit - Maximum number of suggestions to return (default: 5)
 * @returns Array of AutocompleteSuggestion objects
 */
export function getLocationSuggestions(
  query: string,
  limit: number = 5
): AutocompleteSuggestion[] {
  if (!query.trim() || query.length < 2) {
    return [];
  }

  const suburbs = getCachedSuburbs();
  if (suburbs.length === 0) {
    console.warn('No suburbs loaded for location suggestions');
    return [];
  }

  const normalizedQuery = query.toLowerCase();

  return suburbs
    .filter(suburb =>
      suburb.display_name.toLowerCase().includes(normalizedQuery)
    )
    .slice(0, limit);
}

/**
 * Geocode an address using OpenStreetMap Nominatim API
 * @param address - The address to geocode
 * @returns GeocodeResult with coordinates and address parts, or null if failed
 */
export async function geocodeAddress(address: string): Promise<GeocodeResult | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&countrycodes=au&limit=1`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'KidsEatFree/1.0 (canberra-kids-eat-free@example.com)',
      },
    });

    if (!response.ok) {
      console.error('Geocoding request failed:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();

    if (data.length === 0) {
      console.error('No results found for address:', address);
      return null;
    }

    const result = data[0];
    const addressParts = extractAddressParts(result.display_name);

    return {
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      suburb: addressParts.suburb,
      postcode: addressParts.postcode,
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

/**
 * Extract suburb and postcode from Australian address format
 * @param address - Full address string
 * @returns Object with suburb and postcode if found
 */
export function extractAddressParts(address: string): { suburb?: string; postcode?: string } {
  const parts: { suburb?: string; postcode?: string } = {};

  // Australian postcode pattern: 4 digits
  const postcodeMatch = address.match(/\b(\d{4})\b/);
  if (postcodeMatch) {
    parts.postcode = postcodeMatch[1];
  }

  // Try to extract suburb (usually appears before state/postcode)
  // Pattern: "Suburb, STATE postcode" or "Suburb STATE postcode"
  const suburbMatch = address.match(/([^,]+)\s+(?:ACT|NSW|VIC|QLD|SA|WA|TAS|NT)\s+\d{4}/);
  if (suburbMatch) {
    parts.suburb = suburbMatch[1].trim();
  }

  return parts;
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 - Latitude of first point
 * @param lon1 - Longitude of first point
 * @param lat2 - Latitude of second point
 * @param lon2 - Longitude of second point
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Check if a venue is within a given radius from a location
 * @param venue - The venue to check
 * @param userLat - User's latitude
 * @param userLon - User's longitude
 * @param radiusKm - Search radius in kilometers
 * @returns True if venue is within radius
 */
export function isWithinRadius(
  venue: Venue,
  userLat: number,
  userLon: number,
  radiusKm: number
): boolean {
  if (!venue.latitude || !venue.longitude) {
    return false;
  }

  const distance = calculateDistance(userLat, userLon, venue.latitude, venue.longitude);
  return distance <= radiusKm;
}
