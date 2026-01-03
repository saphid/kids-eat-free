'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Loader2 } from 'lucide-react';
import { AutocompleteSuggestion } from '@/lib/geocoding';

interface LocationFilterProps {
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
  suggestions: AutocompleteSuggestion[];
  onSearchChange: (query: string) => void;
  onClearSuggestions: () => void;
}

export default function LocationFilter({
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
}: LocationFilterProps) {
  const [manualInputVisible, setManualInputVisible] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
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
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onManualLocationChange(value);
    onSearchChange(value);

    if (value.trim().length >= 2) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: AutocompleteSuggestion) => {
    onManualLocationChange(suggestion.display_name);
    onLocationSelect(suggestion.latitude, suggestion.longitude, suggestion.display_name);
    setShowSuggestions(false);
    onClearSuggestions();
  };

  return (
    <div className="space-y-4">
      {/* Location Mode Toggle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Location Mode
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => onLocationModeChange('area')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              locationMode === 'area'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <MapPin className="w-4 h-4 inline mr-2" />
            By Area
          </button>
          <button
            onClick={() => onLocationModeChange('nearby')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              locationMode === 'nearby'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Navigation className="w-4 h-4 inline mr-2" />
            Near Me
          </button>
        </div>
      </div>

      {/* Nearby Mode Controls */}
      {locationMode === 'nearby' && (
        <div className="space-y-3 p-4 bg-gray-50 rounded-md">
          {/* Use My Location Button */}
          <button
            onClick={onUseMyLocation}
            disabled={isGeocoding}
            className="w-full px-4 py-3 text-sm font-medium rounded-md bg-white border border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
          >
            {isGeocoding ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Getting your location...
              </>
            ) : (
              <>
                <Navigation className="w-4 h-4" />
                Use my current location
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">or</span>
            </div>
          </div>

          {/* Manual Location Input */}
          <div>
            {!manualInputVisible ? (
              <button
                onClick={() => setManualInputVisible(true)}
                className="w-full px-4 py-2 text-sm font-medium rounded-md bg-white border border-gray-300 hover:bg-gray-50 transition-colors text-gray-700"
              >
                Enter suburb or address
              </button>
            ) : (
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={manualLocation}
                  onChange={handleInputChange}
                  placeholder="e.g., Gungahlin, ACT"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 text-sm"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      onGeocodeManualLocation();
                      setShowSuggestions(false);
                    }
                  }}
                />

                {/* Autocomplete Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div
                    ref={suggestionsRef}
                    className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
                  >
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
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

                <button
                  onClick={onGeocodeManualLocation}
                  disabled={isGeocoding || !manualLocation.trim()}
                  className="w-full mt-2 px-4 py-2 text-sm font-medium rounded-md bg-primary-600 text-white hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isGeocoding ? (
                    <>
                      <Loader2 className="w-4 h-4 inline animate-spin mr-2" />
                      Searching...
                    </>
                  ) : (
                    'Search location'
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Error Message */}
          {geocodingError && (
            <div className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-md">
              {geocodingError}
            </div>
          )}

          {/* Current Location Display */}
          {userLocation && (
            <div className="text-xs text-gray-600 bg-white px-3 py-2 rounded-md border border-gray-200">
              <MapPin className="w-3 h-3 inline mr-1" />
              Location set
            </div>
          )}

          {/* Radius Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search radius: {radiusKm}km
            </label>
            <div className="flex gap-2">
              {[5, 10, 15].map((radius) => (
                <button
                  key={radius}
                  onClick={() => onRadiusChange(radius)}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    radiusKm === radius
                      ? 'bg-primary-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {radius}km
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
