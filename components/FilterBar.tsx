'use client';

import { DayOfWeek, VenueFilters, Region, Area } from '@/lib/types';
import { dayDisplayNames } from '@/lib/constants';
import { X, Filter } from 'lucide-react';

interface FilterBarProps {
  availableRegions: Region[];
  selectedDay: DayOfWeek | 'all';
  selectedArea: string | 'all';
  selectedRegion: string;
  areas: Record<string, Area>;
  onDayChange: (day: DayOfWeek | 'all') => void;
  onAreaChange: (area: string | 'all') => void;
  onRegionChange: (region: string) => void;
  onClearFilters: () => void;
  activeFilterCount: number;
}

export default function FilterBar({
  availableRegions,
  selectedDay,
  selectedArea,
  selectedRegion,
  areas,
  onDayChange,
  onAreaChange,
  onRegionChange,
  onClearFilters,
  activeFilterCount,
}: FilterBarProps) {
  const days: (DayOfWeek | 'all')[] = ['all', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  const selectedRegionData = availableRegions.find(r => r.name === selectedRegion) || availableRegions[0];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
              {activeFilterCount} active
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={onClearFilters}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="w-4 h-4 mr-1" />
            Clear filters
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="region-select" className="block text-sm font-medium text-gray-700 mb-1.5">
            Region
          </label>
          <select
            id="region-select"
            value={selectedRegion}
            onChange={(e) => onRegionChange(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 text-sm"
          >
            {availableRegions.map((region) => (
              <option key={region.name} value={region.name}>
                {region.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="area-select" className="block text-sm font-medium text-gray-700 mb-1.5">
            Area
          </label>
          <select
            id="area-select"
            value={selectedArea}
            onChange={(e) => onAreaChange(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 text-sm"
          >
            <option value="all">All Areas</option>
            {Object.values(areas).map((area) => (
              <option key={area.name} value={area.name}>
                {area.displayName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Day</label>
          <div className="flex flex-wrap gap-2">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => onDayChange(day)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  selectedDay === day
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {day === 'all' ? 'All Days' : dayDisplayNames[day]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
