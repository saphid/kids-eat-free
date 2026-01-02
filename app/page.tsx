'use client';

import { useState, useMemo } from 'react';
import FilterBar from '@/components/FilterBar';
import VenueList from '@/components/VenueList';
import { Venue, VenueFilters, Region, DayOfWeek, Area } from '@/lib/types';
import { filterVenues, sortVenues, getAreasForRegion } from '@/lib/utils';
import metadata from '@/lib/data/regions/metadata.json';
import canberraData from '@/lib/data/regions/act-canberra.json';

export default function Home() {
  const [selectedDay, setSelectedDay] = useState<DayOfWeek | 'all'>('all');
  const [selectedArea, setSelectedArea] = useState<string | 'all'>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('act-canberra');

  const areas = getAreasForRegion(selectedRegion);

  const filters: VenueFilters = {
    day: selectedDay,
    area: selectedArea,
    region: selectedRegion,
  };

  const filteredAndSortedVenues = useMemo(() => {
    const allVenues: Venue[] = canberraData.venues as Venue[];
    const filtered = filterVenues(allVenues, filters);
    return sortVenues(filtered, 'day');
  }, [filters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedDay !== 'all') count++;
    if (selectedArea !== 'all') count++;
    return count;
  }, [selectedDay, selectedArea]);

  const handleClearFilters = () => {
    setSelectedDay('all');
    setSelectedArea('all');
  };

  const handleRegionChange = (newRegion: string) => {
    setSelectedRegion(newRegion);
    setSelectedArea('all');
  };

  const regions = Object.values(metadata.regions).sort((a, b) => a.priority - b.priority);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Kids Eat Free</h1>
          <p className="mt-2 text-sm text-gray-600">
            Discover family dining deals in Canberra - filter by day and location
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FilterBar
          availableRegions={regions}
          selectedDay={selectedDay}
          selectedArea={selectedArea}
          selectedRegion={selectedRegion}
          areas={areas}
          onDayChange={setSelectedDay}
          onAreaChange={setSelectedArea}
          onRegionChange={handleRegionChange}
          onClearFilters={handleClearFilters}
          activeFilterCount={activeFilterCount}
        />

        <VenueList
          venues={filteredAndSortedVenues}
          filters={filters}
          selectedRegion={selectedRegion}
        />
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-sm text-gray-500 text-center">
            Data contributed by the community. Last updated: {canberraData.lastUpdated}
          </p>
          <p className="text-xs text-gray-400 text-center mt-2">
            Information may not be current. Please verify with venues before visiting.
          </p>
        </div>
      </footer>
    </div>
  );
}
