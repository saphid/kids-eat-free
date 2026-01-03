'use client';

import { useState, useMemo } from 'react';
import FilterBar from '@/components/FilterBar';
import VenueList from '@/components/VenueList';
import { Venue, VenueFilters, Region, DayOfWeek, Area } from '@/lib/types';
import { filterVenues, sortVenues, sortVenuesByDistance, getAreasForRegion } from '@/lib/utils';
import { geocodeAddress, getLocationSuggestions, AutocompleteSuggestion, CANBERRA_SUBURBS } from '@/lib/geocoding';
import metadata from '@/lib/data/regions/metadata.json';
import canberraData from '@/lib/data/regions/act-canberra.json';

export default function Home() {
  // Existing state
  const [selectedDay, setSelectedDay] = useState<DayOfWeek | 'all'>('all');
  const [selectedArea, setSelectedArea] = useState<string | 'all'>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('act-canberra');

  // New location state
  const [locationMode, setLocationMode] = useState<'area' | 'nearby'>('area');
  const [radiusKm, setRadiusKm] = useState<number>(10);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [manualLocation, setManualLocation] = useState<string>('');
  const [isGeocoding, setIsGeocoding] = useState<boolean>(false);
  const [geocodingError, setGeocodingError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([]);

  const areas = getAreasForRegion(selectedRegion);

  const filters: VenueFilters = {
    day: selectedDay,
    area: selectedArea,
    region: selectedRegion,
    locationMode,
    userLocation,
    radiusKm,
    manualLocation,
  };

  const filteredAndSortedVenues = useMemo(() => {
    const allVenues: Venue[] = canberraData.venues as Venue[];
    const filtered = filterVenues(allVenues, filters);

    // Sort by distance when location is set
    if (userLocation) {
      return sortVenuesByDistance(filtered, userLocation.latitude, userLocation.longitude);
    }

    return sortVenues(filtered, 'day');
  }, [filters, userLocation]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedDay !== 'all') count++;
    if (userLocation) count++;
    return count;
  }, [selectedDay, userLocation]);

  const handleClearFilters = () => {
    setSelectedDay('all');
    setSelectedArea('all');
    setLocationMode('area');
    setUserLocation(null);
    setManualLocation('');
    setGeocodingError(null);
  };

  const handleRegionChange = (newRegion: string) => {
    setSelectedRegion(newRegion);
    setSelectedArea('all');
  };

  // Handle "Use My Location"
  const handleUseMyLocation = async () => {
    setIsGeocoding(true);
    setGeocodingError(null);

    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by your browser');
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes cache
        });
      });

      setUserLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    } catch (error) {
      console.error('Geolocation error:', error);

      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setGeocodingError('Location access denied. Please enable location permissions or enter your suburb manually.');
            break;
          case error.POSITION_UNAVAILABLE:
            setGeocodingError('Unable to determine your location. Please try entering your suburb manually.');
            break;
          case error.TIMEOUT:
            setGeocodingError('Location request timed out. Please try again or enter your suburb manually.');
            break;
          default:
            setGeocodingError('An unknown error occurred. Please try entering your suburb manually.');
        }
      } else {
        setGeocodingError('Failed to get your location. Please try entering your suburb manually.');
      }
    } finally {
      setIsGeocoding(false);
    }
  };

  // Handle manual location geocoding
  const handleGeocodeManualLocation = async () => {
    if (!manualLocation.trim()) return;

    setIsGeocoding(true);
    setGeocodingError(null);

    try {
      const result = await geocodeAddress(manualLocation);

      if (!result) {
        setGeocodingError('Location not found. Please try a different suburb or address.');
        return;
      }

      setUserLocation({
        latitude: result.latitude,
        longitude: result.longitude,
      });
    } catch (error) {
      console.error('Geocoding error:', error);
      setGeocodingError('Failed to find location. Please try again.');
    } finally {
      setIsGeocoding(false);
    }
  };

  // Handle location selection from autocomplete
  const handleLocationSelect = (latitude: number, longitude: number, location: string) => {
    setUserLocation({ latitude, longitude });
    setSuggestions([]);
  };

  // Handle search input change
  const handleSearchChange = (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      return;
    }

    const results = getLocationSuggestions(query, 5);
    setSuggestions(results);
  };

  // Clear suggestions
  const handleClearSuggestions = () => {
    setSuggestions([]);
  };

  const regions = Object.values(metadata.regions).sort((a, b) => a.priority - b.priority);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <h1 className="text-3xl font-bold text-gray-900">Kids Eat Free</h1>
          <p className="text-sm text-gray-600">
            Discover family dining deals in Canberra - filter by day and location
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
          locationMode={locationMode}
          radiusKm={radiusKm}
          userLocation={userLocation}
          manualLocation={manualLocation}
          onLocationModeChange={setLocationMode}
          onRadiusChange={setRadiusKm}
          onUseMyLocation={handleUseMyLocation}
          onManualLocationChange={setManualLocation}
          onGeocodeManualLocation={handleGeocodeManualLocation}
          onLocationSelect={handleLocationSelect}
          isGeocoding={isGeocoding}
          geocodingError={geocodingError}
          suggestions={suggestions}
          onSearchChange={handleSearchChange}
          onClearSuggestions={handleClearSuggestions}
        />

        <VenueList
          venues={filteredAndSortedVenues}
          filters={filters}
          selectedRegion={selectedRegion}
          userLocation={userLocation}
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
