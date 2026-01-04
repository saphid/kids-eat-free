'use client';

import { useState, useMemo, useEffect } from 'react';
import FilterBar from '@/components/FilterBar';
import VenueList from '@/components/VenueList';
import { Venue, VenueFilters, DayOfWeek } from '@/lib/types';
import { filterVenues, sortVenues, sortVenuesByDistance, getAreasForRegion } from '@/lib/utils';
import { geocodeAddress, getLocationSuggestions, AutocompleteSuggestion, setSuburbsCache } from '@/lib/geocoding';
// Data loaded from the data folder (can be replaced by a different data source)
import metadata from '@/data/metadata.json';
import canberraData from '@/data/regions/act-canberra/venues.json';
import canberraSuburbs from '@/data/regions/act-canberra/suburbs.json';
import { Utensils, MapPin, Calendar, Sparkles, Star } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

export default function Home() {
  // Existing state
  const [selectedDay, setSelectedDay] = useState<DayOfWeek | 'all'>('all');
  const [selectedArea, setSelectedArea] = useState<string | 'all'>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('act-canberra');

  // Location state
  const [locationMode, setLocationMode] = useState<'area' | 'nearby'>('area');
  const [radiusKm, setRadiusKm] = useState<number>(10);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [manualLocation, setManualLocation] = useState<string>('');
  const [isGeocoding, setIsGeocoding] = useState<boolean>(false);
  const [geocodingError, setGeocodingError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([]);

  // Initialize suburb cache on mount
  useEffect(() => {
    setSuburbsCache(canberraSuburbs.suburbs, selectedRegion);
  }, [selectedRegion]);

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
          maximumAge: 300000,
        });
      });

      setUserLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      setManualLocation('📍 Current location');
    } catch (error) {
      console.error('Geolocation error:', error);

      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setGeocodingError('Location access denied. Please enable location permissions or enter your suburb.');
            break;
          case error.POSITION_UNAVAILABLE:
            setGeocodingError('Unable to determine your location. Please try entering your suburb.');
            break;
          case error.TIMEOUT:
            setGeocodingError('Location request timed out. Please try again.');
            break;
          default:
            setGeocodingError('An unknown error occurred.');
        }
      } else {
        setGeocodingError('Failed to get your location. Please try entering your suburb.');
      }
    } finally {
      setIsGeocoding(false);
    }
  };

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

  const handleLocationSelect = (latitude: number, longitude: number, location: string) => {
    setUserLocation({ latitude, longitude });
    setManualLocation(location);
    setSuggestions([]);
  };

  const handleSearchChange = (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      return;
    }

    const results = getLocationSuggestions(query, 5);
    setSuggestions(results);
  };

  const handleClearSuggestions = () => {
    setSuggestions([]);
  };

  const regions = Object.values(metadata.regions).sort((a, b) => a.priority - b.priority);

  // Get today's day name
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as DayOfWeek;
  const todayDeals = (canberraData.venues as Venue[]).filter(v => v.days.includes(today)).length;

  return (
    <div className="min-h-screen gradient-subtle pattern-dots aurora-glow">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 gradient-hero" />
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-[10%] w-2 h-2 bg-primary/30 rounded-full animate-pulse" />
          <div className="absolute top-32 left-[25%] w-1 h-1 bg-accent/40 rounded-full animate-pulse delay-300" />
          <div className="absolute top-16 right-[20%] w-1.5 h-1.5 bg-primary-light/40 rounded-full animate-pulse delay-500" />
          <div className="absolute top-40 right-[35%] w-1 h-1 bg-accent-light/30 rounded-full animate-pulse delay-200" />
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          {/* Theme Toggle - Top Right */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
            <ThemeToggle />
          </div>
          
          <div className="text-center">
            {/* Logo/Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-primary/10 backdrop-blur-sm mb-6 animate-scale-in border border-primary/20 shadow-lg dark:bg-primary/20 dark:border-primary/30">
              <Utensils className="w-8 h-8 sm:w-10 sm:h-10 text-primary-dark dark:text-primary-light" strokeWidth={1.5} />
            </div>
            
            {/* Title */}
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-3 animate-slide-up text-balance dark:text-pearl">
              Kids Eat Free
            </h1>
            <p className="text-text-secondary text-base sm:text-lg md:text-xl max-w-xl mx-auto animate-slide-up delay-100 font-body dark:text-silver">
              Discover family-friendly dining deals across Canberra
            </p>
            
            {/* Quick stats */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-8 animate-slide-up delay-200">
              <div className="flex items-center gap-2 bg-bg-primary/90 backdrop-blur-sm rounded-full px-4 py-2 border border-border shadow-md dark:bg-slate-dark/80 dark:border-slate-mid/50">
                <Utensils className="w-4 h-4 text-primary-light" />
                <span className="text-text-primary font-medium text-sm dark:text-silver">
                  {canberraData.venues.length} venues
                </span>
              </div>
              <div className="flex items-center gap-2 bg-bg-primary/90 backdrop-blur-sm rounded-full px-4 py-2 border border-border shadow-md dark:bg-slate-dark/80 dark:border-slate-mid/50">
                <Calendar className="w-4 h-4 text-accent" />
                <span className="text-text-primary font-medium text-sm dark:text-silver">
                  {todayDeals} deals today
                </span>
              </div>
              <div className="flex items-center gap-2 bg-bg-primary/90 backdrop-blur-sm rounded-full px-4 py-2 border border-border shadow-md dark:bg-slate-dark/80 dark:border-slate-mid/50">
                <MapPin className="w-4 h-4 text-sage" />
                <span className="text-text-primary font-medium text-sm dark:text-silver">
                  Canberra & surrounds
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" className="fill-bg-secondary dark:fill-slate-dark"/>
          </svg>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10">
        {/* Filter Section */}
        <div className="animate-slide-up delay-300 relative z-20">
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
        </div>

        {/* Venue List */}
        <div className="mt-6 sm:mt-8 animate-slide-up delay-400 relative z-10">
          <VenueList
            venues={filteredAndSortedVenues}
            filters={filters}
            selectedRegion={selectedRegion}
            userLocation={userLocation}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 sm:mt-20 border-t border-border bg-bg-secondary dark:border-slate-mid/50 dark:bg-midnight/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 dark:bg-primary/20 dark:border-primary/30">
                <Utensils className="w-5 h-5 text-primary-dark dark:text-primary-light" />
              </div>
              <div>
                <p className="font-display font-semibold text-text-primary dark:text-pearl">Kids Eat Free</p>
                <p className="text-sm text-text-tertiary dark:text-slate-light">Canberra & surrounds</p>
              </div>
            </div>
            
            <div className="text-center sm:text-right">
              <p className="text-sm text-text-tertiary dark:text-slate-light">
                Last updated: {canberraData.lastUpdated}
              </p>
              <p className="text-xs text-text-tertiary/70 dark:text-slate-light/70 mt-1">
                Please verify with venues before visiting
              </p>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-border dark:border-slate-mid/50 text-center">
            <p className="text-xs text-text-tertiary/60 dark:text-slate-light/60 flex items-center justify-center gap-1">
              <Star className="w-3 h-3 text-accent" />
              Community-contributed data • Free forever
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
