import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Venue, VenueFilters, DayOfWeek } from './types';
import { daysOfWeek } from './constants';
import { calculateDistance as calculateDistanceUtil } from './geocoding';

// Re-export calculateDistance for components that need it
export { calculateDistanceUtil as calculateDistance };

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function filterVenues(
  venues: Venue[],
  filters: VenueFilters
): Venue[] {
  return venues.filter((venue) => {
    if (!venue.active) return false;

    // Day filter
    if (filters.day && filters.day !== 'all' && !venue.days.includes(filters.day)) {
      return false;
    }

    // Location filter - if userLocation is set, filter by distance
    if (filters.userLocation) {
      if (!venue.latitude || !venue.longitude) {
        // Venue missing coordinates - exclude from location-based results
        return false;
      }

      const distance = calculateDistanceUtil(
        filters.userLocation.latitude,
        filters.userLocation.longitude,
        venue.latitude,
        venue.longitude
      );

      const maxDistance = filters.radiusKm || 10;
      return distance <= maxDistance;
    }

    // Search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const searchableText = [
        venue.name,
        venue.details,
        venue.area,
        venue.suburb || '',
        venue.postcode || '',
        venue.tags?.join(' ') || '',
      ].join(' ').toLowerCase();

      if (!searchableText.includes(query)) {
        return false;
      }
    }

    return true;
  });
}

export function sortVenues(venues: Venue[], sortBy: 'day' | 'name' | 'verified'): Venue[] {
  const sorted = [...venues];

  switch (sortBy) {
    case 'day':
      return sorted.sort((a, b) => {
        const dayOrder = daysOfWeek;
        const aDay = a.days[0] || 'monday';
        const bDay = b.days[0] || 'monday';
        return dayOrder.indexOf(aDay) - dayOrder.indexOf(bDay);
      });

    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));

    case 'verified':
      return sorted.sort((a, b) =>
        new Date(b.verifiedDate).getTime() - new Date(a.verifiedDate).getTime()
      );

    default:
      return sorted;
  }
}

export function sortVenuesByDistance(
  venues: Venue[],
  userLat: number,
  userLon: number
): Venue[] {
  const sorted = [...venues];

  return sorted.sort((a, b) => {
    // Prioritize venues with coordinates
    if (!a.latitude || !a.longitude) return 1;
    if (!b.latitude || !b.longitude) return -1;

    const distanceA = calculateDistanceUtil(userLat, userLon, a.latitude, a.longitude);
    const distanceB = calculateDistanceUtil(userLat, userLon, b.latitude, b.longitude);

    return distanceA - distanceB;
  });
}

export function getAreasForRegion(regionId: string): Record<string, { name: string; displayName: string }> {
  try {
    const metadata = require('./data/regions/metadata.json');
    return metadata.regions[regionId]?.areas || {};
  } catch {
    return {};
  }
}

export function getDayDisplayName(day: DayOfWeek | 'all'): string {
  if (day === 'all') return 'All Days';
  return day.charAt(0).toUpperCase() + day.slice(1);
}

export function getVerificationStatus(verifiedDate: string): { status: 'fresh' | 'stale' | 'expired'; color: string } {
  const now = new Date();
  const verified = new Date(verifiedDate);
  const daysDiff = Math.floor((now.getTime() - verified.getTime()) / (1000 * 60 * 60 * 24));

  if (daysDiff < 30) {
    return { status: 'fresh', color: 'text-green-600' };
  } else if (daysDiff < 90) {
    return { status: 'stale', color: 'text-yellow-600' };
  } else {
    return { status: 'expired', color: 'text-red-600' };
  }
}
