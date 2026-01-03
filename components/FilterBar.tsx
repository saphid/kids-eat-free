'use client';

import { DayOfWeek, VenueFilters, Region, Area } from '@/lib/types';
import { dayDisplayNames } from '@/lib/constants';
import { X, Filter, MapPin, Navigation } from 'lucide-react';

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
  locationMode: 'area' | 'nearby';
  radiusKm: number;
  userLocation: { latitude: number; longitude: number } | null;
  manualLocation: string;
  onLocationModeChange: (mode: 'area' | 'nearby') => void;
  onRadiusChange: (radius: number) => void;
  onUseMyLocation: () => Promise<void>;
  onManualLocationChange: (location: string) => void;
  onGeocodeManualLocation: () => Promise<void>;
  onLocationSelect: (latitude: number, longitude: number, location: string) => void;
  isGeocoding: boolean;
  geocodingError: string | null;
  suggestions: any[];
  onSearchChange: (query: string) => void;
  onClearSuggestions: () => void;
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
  locationMode,
  radiusKm,
  userLocation,
  manualLocation,
  onLocationModeChange,
  onRadiusChange,
  onUseMyLocation,
  onManualLocationChange,
  onGeocodeManualLocation,
  onLocationSelect,
  isGeocoding,
  geocodingError,
  suggestions,
  onSearchChange,
  onClearSuggestions,
}: FilterBarProps) {
  const days: (DayOfWeek | 'all')[] = ['all', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  const selectedRegionData = availableRegions.find(r => r.name === selectedRegion) || availableRegions[0];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-3 mb-6">
      <div className="flex flex-wrap items-center gap-3">
        {/* Region */}
        <div>
          <select
            id="region-select"
            value={selectedRegion}
            onChange={(e) => onRegionChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 text-sm"
          >
            {availableRegions.map((region) => (
              <option key={region.name} value={region.name}>
                {region.name}
              </option>
            ))}
          </select>
        </div>

        {/* Day */}
        <div>
          <select
            id="day-select"
            value={selectedDay}
            onChange={(e) => onDayChange(e.target.value as DayOfWeek | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 text-sm"
          >
            {days.map((day) => (
              <option key={day} value={day}>
                {day === 'all' ? 'All Days' : dayDisplayNames[day]}
              </option>
            ))}
          </select>
        </div>

        {/* Suburb Input */}
        <div className="flex-1 min-w-[250px] max-w-lg">
          <div className="relative">
            <input
              type="text"
              value={manualLocation}
              onChange={(e) => {
                onManualLocationChange(e.target.value);
                onSearchChange(e.target.value);
              }}
              placeholder="Search suburb..."
              className="w-full px-3 py-2 pr-16 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 text-sm text-gray-900 placeholder-gray-500"
            />
            {suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      onManualLocationChange(suggestion.display_name);
                      onLocationSelect(suggestion.latitude, suggestion.longitude, suggestion.display_name);
                      onClearSuggestions();
                    }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-gray-400" />
                      <span className="text-gray-700">{suggestion.display_name}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
            <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button
                onClick={onGeocodeManualLocation}
                disabled={isGeocoding || !manualLocation.trim()}
                className="px-2 py-1 text-xs font-medium rounded bg-primary-600 text-white hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isGeocoding ? '...' : 'Go'}
              </button>
            </div>
          </div>
          {geocodingError && (
            <p className="mt-1 text-xs text-red-600">{geocodingError}</p>
          )}
        </div>

        {/* Use My Location */}
        {!manualLocation && (
          <button
            onClick={onUseMyLocation}
            disabled={isGeocoding}
            className="px-3 py-2 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-700 flex items-center gap-1"
          >
            <Navigation className="w-4 h-4" />
            {isGeocoding ? 'Locating...' : 'Use my location'}
          </button>
        )}

        {/* Clear Filters */}
        {activeFilterCount > 0 && (
          <button
            onClick={onClearFilters}
            className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors inline-flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
