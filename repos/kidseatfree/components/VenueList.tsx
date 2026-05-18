'use client';

import { useMemo } from 'react';
import { Venue, VenueFilters } from '@/lib/types';
import VenueCard from './VenueCard';
import { getAreasForRegion, calculateDistance } from '@/lib/utils';
import { Search, MapPin, Filter, Utensils } from 'lucide-react';

interface VenueWithDistance extends Venue {
  distanceKm?: number;
}

interface VenueListProps {
  venues: Venue[];
  filters: VenueFilters;
  selectedRegion: string;
  userLocation?: { latitude: number; longitude: number } | null;
}

export default function VenueList({ venues, filters, selectedRegion, userLocation }: VenueListProps) {
  const areas = getAreasForRegion(selectedRegion);

  // Calculate distances for all venues when user location is set
  const venuesWithDistance = useMemo(() => {
    if (!userLocation) return venues;

    return venues.map(venue => ({
      ...venue,
      distanceKm: venue.latitude && venue.longitude
        ? calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            venue.latitude,
            venue.longitude
          )
        : undefined
    })) as VenueWithDistance[];
  }, [venues, userLocation]);

  // Empty state
  if (venuesWithDistance.length === 0) {
    return (
      <div className="card p-8 sm:p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-5 border border-primary/20 dark:bg-primary/20 dark:border-primary/30">
          {filters.locationMode === 'nearby' && !filters.userLocation ? (
            <MapPin className="w-8 h-8 text-primary-dark dark:text-primary-light" />
          ) : (
            <Search className="w-8 h-8 text-primary-dark dark:text-primary-light" />
          )}
        </div>
        
        <h3 className="font-display text-xl font-bold text-text-primary mb-2 dark:text-pearl">
          No venues found
        </h3>
        
        <p className="text-text-secondary max-w-sm mx-auto dark:text-silver">
          {filters.locationMode === 'nearby' && !filters.userLocation
            ? 'Set your location to discover nearby venues with kids eat free deals.'
            : filters.day !== 'all' || (filters.locationMode === 'area' && filters.area !== 'all')
            ? "No venues match your current filters. Try adjusting your search criteria."
            : 'No venues are currently available in this region.'}
        </p>
        
        {(filters.day !== 'all' || filters.userLocation) && (
          <p className="mt-4 text-sm text-primary-light">
            <Filter className="w-4 h-4 inline mr-1" />
            Try clearing some filters to see more results
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* Results header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 dark:bg-primary/20 dark:border-primary/30">
            <Utensils className="w-4 h-4 text-primary-dark dark:text-primary-light" />
          </div>
          <div>
            <h2 className="font-display font-bold text-text-primary dark:text-pearl">
              {venuesWithDistance.length} {venuesWithDistance.length === 1 ? 'venue' : 'venues'}
            </h2>
            {(filters.day !== 'all' ||
              (filters.locationMode === 'area' && filters.area !== 'all') ||
              (filters.locationMode === 'nearby' && filters.userLocation)) && (
              <p className="text-xs text-text-tertiary dark:text-slate-light">
                Filtered results
              </p>
            )}
          </div>
        </div>
        
        {userLocation && (
          <div className="flex items-center gap-1.5 text-sm text-sage">
            <MapPin className="w-4 h-4" />
            <span>Sorted by distance</span>
          </div>
        )}
      </div>

      {/* Venue grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {venuesWithDistance.map((venue, index) => {
          const distanceKm = 'distanceKm' in venue ? (venue as VenueWithDistance).distanceKm : undefined;
          return (
            <VenueCard
              key={venue.id}
              venue={venue}
              areaDisplayName={areas[venue.area]?.displayName || venue.area}
              distanceKm={distanceKm}
              index={index}
            />
          );
        })}
      </div>
    </div>
  );
}
