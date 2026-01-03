'use client';

import { Venue, VenueFilters } from '@/lib/types';
import VenueCard from './VenueCard';
import { getAreasForRegion } from '@/lib/utils';

interface VenueListProps {
  venues: Venue[];
  filters: VenueFilters;
  selectedRegion: string;
}

export default function VenueList({ venues, filters, selectedRegion }: VenueListProps) {
  const areas = getAreasForRegion(selectedRegion);

  if (venues.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No venues found</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          {filters.day !== 'all' || filters.area !== 'all'
            ? `No venues match your current filters. Try adjusting your day or area selection.`
            : 'No venues are currently available in this region.'}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-900">{venues.length}</span>
          {venues.length === 1 ? ' venue' : ' venues'}
          {(filters.day !== 'all' || filters.area !== 'all') && (
            <span> with active filters</span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {venues.map((venue) => (
          <VenueCard
            key={venue.id}
            venue={venue}
            areaDisplayName={areas[venue.area]?.displayName || venue.area}
          />
        ))}
      </div>
    </div>
  );
}
