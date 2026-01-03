'use client';

import { useState, useRef, useEffect } from 'react';
import { DayOfWeek, Region, Area } from '@/lib/types';
import { dayDisplayNames, dayShortNames, dayColors, dayBgColors, dayTextColors } from '@/lib/constants';
import { X, Search, MapPin, Navigation, Loader2, ChevronDown, Calendar } from 'lucide-react';

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

const days: (DayOfWeek | 'all')[] = ['all', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

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
  const [showDayPicker, setShowDayPicker] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dayPickerRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dayPickerRef.current && !dayPickerRef.current.contains(event.target as Node)) {
        setShowDayPicker(false);
      }
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onManualLocationChange(value);
    onSearchChange(value);
    setShowSuggestions(value.trim().length >= 2);
  };

  const handleSuggestionClick = (suggestion: any) => {
    onManualLocationChange(suggestion.display_name);
    onLocationSelect(suggestion.latitude, suggestion.longitude, suggestion.display_name);
    setShowSuggestions(false);
    onClearSuggestions();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onGeocodeManualLocation();
      setShowSuggestions(false);
    }
  };

  // Get today's day
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as DayOfWeek;

  return (
    <div className="card p-4 sm:p-6 overflow-visible">
      <div className="space-y-4">
        {/* Row 1: Day filter + Location search */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Day Selector */}
          <div className="relative z-30" ref={dayPickerRef}>
            <button
              onClick={() => setShowDayPicker(!showDayPicker)}
              className={`btn w-full sm:w-auto justify-between min-w-[160px] ${
                selectedDay !== 'all' 
                  ? 'bg-primary text-white hover:bg-primary-light' 
                  : 'btn-secondary'
              }`}
            >
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {selectedDay === 'all' ? 'All Days' : dayDisplayNames[selectedDay]}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showDayPicker ? 'rotate-180' : ''}`} />
            </button>

            {showDayPicker && (
              <div className="absolute z-50 w-full sm:w-64 mt-2 bg-bg-primary rounded-xl shadow-xl border border-border overflow-hidden animate-scale-in dark:bg-slate-dark dark:border-slate-mid">
                <div className="p-2">
                  {days.map((day) => {
                    const isToday = day === today;
                    const isSelected = selectedDay === day;
                    
                    return (
                      <button
                        key={day}
                        onClick={() => {
                          onDayChange(day);
                          setShowDayPicker(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors ${
                          isSelected
                            ? 'bg-primary text-white'
                            : 'text-text-primary hover:bg-bg-secondary dark:text-silver dark:hover:bg-slate-mid'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {day !== 'all' && (
                            <span 
                              className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white/50' : ''}`}
                              style={{ backgroundColor: isSelected ? undefined : `var(--day-${day})` }}
                            />
                          )}
                          <span className="font-medium">
                            {day === 'all' ? 'All Days' : dayDisplayNames[day]}
                          </span>
                        </span>
                        {isToday && (
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-sage/20 text-sage'
                          }`}>
                            Today
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Location Search */}
          <div className="flex-1 relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary dark:text-slate-light" />
              <input
                ref={inputRef}
                type="text"
                value={manualLocation}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => manualLocation.trim().length >= 2 && setShowSuggestions(true)}
                placeholder="Search suburb or address..."
                className="input pl-10 pr-24"
              />
              
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {manualLocation && (
                  <button
                    onClick={() => {
                      onManualLocationChange('');
                      onClearSuggestions();
                    }}
                    className="p-1.5 rounded-lg text-text-tertiary hover:bg-bg-secondary transition-colors dark:text-slate-light dark:hover:bg-slate-mid"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={onGeocodeManualLocation}
                  disabled={isGeocoding || !manualLocation.trim()}
                  className="px-3 py-1.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-light disabled:bg-border disabled:text-text-tertiary disabled:cursor-not-allowed transition-colors dark:disabled:bg-slate-mid dark:disabled:text-slate-light"
                >
                  {isGeocoding ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Go'}
                </button>
              </div>
            </div>

            {/* Location Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute z-50 w-full mt-2 bg-bg-primary rounded-xl shadow-xl border border-border overflow-hidden animate-scale-in dark:bg-slate-dark dark:border-slate-mid"
              >
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-3 text-left flex items-start gap-3 hover:bg-bg-secondary transition-colors border-b border-border last:border-0 dark:hover:bg-slate-mid dark:border-slate-mid/50"
                  >
                    <MapPin className="w-4 h-4 text-text-tertiary mt-0.5 flex-shrink-0 dark:text-slate-light" />
                    <span className="text-sm text-text-primary dark:text-silver">{suggestion.display_name}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Geocoding Error */}
            {geocodingError && (
              <p className="mt-2 text-sm text-rose flex items-center gap-1">
                <X className="w-4 h-4" />
                {geocodingError}
              </p>
            )}
          </div>
        </div>

        {/* Row 2: Use my location + Active filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Use My Location Button */}
          <button
            onClick={onUseMyLocation}
            disabled={isGeocoding}
            className={`btn ${
              userLocation && !manualLocation.includes('📍')
                ? 'btn-secondary'
                : userLocation
                ? 'bg-sage/20 text-sage border border-sage/30 hover:bg-sage/30'
                : 'btn-secondary'
            }`}
          >
            {isGeocoding ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Navigation className={`w-4 h-4 ${userLocation ? 'text-sage' : ''}`} />
            )}
            <span className="hidden sm:inline">
              {isGeocoding ? 'Locating...' : userLocation ? 'Location set' : 'Use my location'}
            </span>
            <span className="sm:hidden">
              {isGeocoding ? '...' : 'Locate me'}
            </span>
          </button>

          {/* Active location indicator */}
          {userLocation && (
            <span className="badge badge-distance">
              <Navigation className="w-3 h-3" />
              Within {radiusKm}km
            </span>
          )}

          {/* Radius selector when location is set */}
          {userLocation && (
            <div className="flex items-center gap-1 ml-auto">
              {[5, 10, 15].map((radius) => (
                <button
                  key={radius}
                  onClick={() => onRadiusChange(radius)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    radiusKm === radius
                      ? 'bg-primary text-white'
                      : 'bg-bg-tertiary text-text-tertiary hover:bg-border dark:bg-slate-mid dark:text-slate-light dark:hover:bg-slate-light/20'
                  }`}
                >
                  {radius}km
                </button>
              ))}
            </div>
          )}

          {/* Clear filters */}
          {activeFilterCount > 0 && (
            <button
              onClick={onClearFilters}
              className="btn btn-ghost text-text-tertiary dark:text-slate-light ml-auto"
            >
              <X className="w-4 h-4" />
              Clear filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
