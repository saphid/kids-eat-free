import { Venue } from './types';

export interface GeocodeResult {
  latitude: number;
  longitude: number;
  suburb?: string;
  postcode?: string;
}

export interface AutocompleteSuggestion {
  display_name: string;
  latitude: number;
  longitude: number;
}

// Static list of Canberra suburbs with their coordinates
export const CANBERRA_SUBURBS: AutocompleteSuggestion[] = [
  { display_name: "Gungahlin, ACT", latitude: -35.1864, longitude: 149.1308 },
  { display_name: "Belconnen, ACT", latitude: -35.2403, longitude: 149.0647 },
  { display_name: "Canberra City, ACT", latitude: -35.2794, longitude: 149.1301 },
  { display_name: "Phillip, ACT", latitude: -35.3481, longitude: 149.0871 },
  { display_name: "Macquarie, ACT", latitude: -35.2424, longitude: 149.0678 },
  { display_name: "Weston, ACT", latitude: -35.3344, longitude: 149.0895 },
  { display_name: "Ainslie, ACT", latitude: -35.2515, longitude: 149.1462 },
  { display_name: "Dickson, ACT", latitude: -35.2502, longitude: 149.1395 },
  { display_name: "Kingston, ACT", latitude: -35.3126, longitude: 149.1424 },
  { display_name: "Manuka, ACT", latitude: -35.3194, longitude: 149.1335 },
  { display_name: "Civic, ACT", latitude: -35.2794, longitude: 149.1301 },
  { display_name: "Braddon, ACT", latitude: -35.2686, longitude: 149.1336 },
  { display_name: "NewActon, ACT", latitude: -35.2857, longitude: 149.1208 },
  { display_name: "Campbell, ACT", latitude: -35.2763, longitude: 149.1499 },
  { display_name: "Reid, ACT", latitude: -35.2767, longitude: 149.1376 },
  { display_name: "Turner, ACT", latitude: -35.2671, longitude: 149.1261 },
  { display_name: "O'Connor, ACT", latitude: -35.2483, longitude: 149.1251 },
  { display_name: "Lyneham, ACT", latitude: -35.2424, longitude: 149.1368 },
  { display_name: "Hackett, ACT", latitude: -35.2496, longitude: 149.1528 },
  { display_name: "Watson, ACT", latitude: -35.2445, longitude: 149.1593 },
  { display_name: "Downer, ACT", latitude: -35.2538, longitude: 149.1496 },
  { display_name: "Harrison, ACT", latitude: -35.1944, longitude: 149.1492 },
  { display_name: "Franklin, ACT", latitude: -35.1839, longitude: 149.1391 },
  { display_name: "Forde, ACT", latitude: -35.1756, longitude: 149.1389 },
  { display_name: "Bonner, ACT", latitude: -35.1814, longitude: 149.1553 },
  { display_name: "Ngunnawal, ACT", latitude: -35.1783, longitude: 149.1206 },
  { display_name: "Crace, ACT", latitude: -35.1953, longitude: 149.1169 },
  { display_name: "Palmerston, ACT", latitude: -35.2017, longitude: 149.1083 },
  { display_name: "Nicholls, ACT", latitude: -35.2047, longitude: 149.1250 },
  { display_name: "Casey, ACT", latitude: -35.1903, longitude: 149.1439 },
  { display_name: "Amaroo, ACT", latitude: -35.1958, longitude: 149.1333 },
  { display_name: "Yerrabi, ACT", latitude: -35.1750, longitude: 149.1083 },
  { display_name: "Kambah, ACT", latitude: -35.3981, longitude: 149.0647 },
  { display_name: "Woden, ACT", latitude: -35.3481, longitude: 149.0871 },
  { display_name: "Curtin, ACT", latitude: -35.3322, longitude: 149.0758 },
  { display_name: "Chifley, ACT", latitude: -35.3417, longitude: 149.0839 },
  { display_name: "Pearce, ACT", latitude: -35.3564, longitude: 149.0914 },
  { display_name: "Torrens, ACT", latitude: -35.3506, longitude: 149.0989 },
  { display_name: "Mawson, ACT", latitude: -35.3619, longitude: 149.0867 },
  { display_name: "Farrer, ACT", latitude: -35.3706, longitude: 149.0811 },
  { display_name: "Isabella Plains, ACT", latitude: -35.4061, longitude: 149.0694 },
  { display_name: "Gordon, ACT", latitude: -35.4139, longitude: 149.0639 },
  { display_name: "Conder, ACT", latitude: -35.4208, longitude: 149.0636 },
  { display_name: "Bonython, ACT", latitude: -35.4192, longitude: 149.0728 },
  { display_name: "Richardson, ACT", latitude: -35.4081, longitude: 149.0819 },
  { display_name: "Calwell, ACT", latitude: -35.4269, longitude: 149.0714 },
  { display_name: "Tuggeranong, ACT", latitude: -35.4153, longitude: 149.0694 },
  { display_name: "Erindale, ACT", latitude: -35.4058, longitude: 149.0892 },
  { display_name: "Wanniassa, ACT", latitude: -35.3956, longitude: 149.0856 },
  { display_name: "Oxley, ACT", latitude: -35.3872, longitude: 149.1000 },
  { display_name: "Monash, ACT", latitude: -35.4283, longitude: 149.0906 },
  { display_name: "Chapman, ACT", latitude: -35.3469, longitude: 149.1006 },
  { display_name: "Stirling, ACT", latitude: -35.3383, longitude: 149.1058 },
  { display_name: "Duffy, ACT", latitude: -35.3425, longitude: 149.1153 },
  { display_name: "Holder, ACT", latitude: -35.3306, longitude: 149.1006 },
  { display_name: "Fisher, ACT", latitude: -35.3267, longitude: 149.0919 },
  { display_name: "Yarralumla, ACT", latitude: -35.3056, longitude: 149.1167 },
  { display_name: "Deakin, ACT", latitude: -35.3192, longitude: 149.1142 },
  { display_name: "Hughes, ACT", latitude: -35.3133, longitude: 149.1050 },
  { display_name: "Garran, ACT", latitude: -35.3264, longitude: 149.1008 },
  { display_name: "O'Malley, ACT", latitude: -35.3403, longitude: 149.1153 },
  { display_name: "Mawson, ACT", latitude: -35.3619, longitude: 149.0867 },
  { display_name: "Phillip, ACT", latitude: -35.3481, longitude: 149.0871 },
  { display_name: "Deakin, ACT", latitude: -35.3192, longitude: 149.1142 },
  { display_name: "Higgins, ACT", latitude: -35.3300, longitude: 149.0850 },
  { display_name: "Bruce, ACT", latitude: -35.2467, longitude: 149.1006 },
  { display_name: "Weetangera, ACT", latitude: -35.2392, longitude: 149.0986 },
  { display_name: "Hawker, ACT", latitude: -35.2486, longitude: 149.0842 },
  { display_name: "Scullin, ACT", latitude: -35.2336, longitude: 149.0681 },
  { display_name: "Latham, ACT", latitude: -35.2297, longitude: 149.0586 },
  { display_name: "Florey, ACT", latitude: -35.2353, longitude: 149.0506 },
  { display_name: "Belconnen, ACT", latitude: -35.2403, longitude: 149.0647 },
  { display_name: "Charnwood, ACT", latitude: -35.2208, longitude: 149.0506 },
  { display_name: "Dunlop, ACT", latitude: -35.2133, longitude: 149.0450 },
  { display_name: "Macgregor, ACT", latitude: -35.2039, longitude: 149.0417 },
  { display_name: "Flynn, ACT", latitude: -35.2419, longitude: 149.0908 },
  { display_name: "Melba, ACT", latitude: -35.2281, longitude: 149.0664 },
  { display_name: "Spence, ACT", latitude: -35.2203, longitude: 149.0578 },
  { display_name: "Evatt, ACT", latitude: -35.2217, longitude: 149.0667 },
  { display_name: "McKellar, ACT", latitude: -35.2319, longitude: 149.0808 },
  { display_name: "Kaleen, ACT", latitude: -35.2361, longitude: 149.1081 },
  { display_name: "Page, ACT", latitude: -35.2456, longitude: 149.1103 },
  { display_name: "Lawson, ACT", latitude: -35.2378, longitude: 149.1314 },
  { display_name: "Coombs, ACT", latitude: -35.3056, longitude: 149.0917 },
  { display_name: "Wright, ACT", latitude: -35.3139, longitude: 149.0847 },
  { display_name: "Denman Prospect, ACT", latitude: -35.3536, longitude: 149.0569 },
];

/**
 * Get location suggestions for autocomplete from static suburb list
 * @param query - The search query
 * @param limit - Maximum number of suggestions to return (default: 5)
 * @returns Array of AutocompleteSuggestion objects
 */
export function getLocationSuggestions(
  query: string,
  limit: number = 5
): AutocompleteSuggestion[] {
  if (!query.trim() || query.length < 2) {
    return [];
  }

  const normalizedQuery = query.toLowerCase();

  return CANBERRA_SUBURBS
    .filter(suburb =>
      suburb.display_name.toLowerCase().includes(normalizedQuery)
    )
    .slice(0, limit);
}

/**
 * Geocode an address using OpenStreetMap Nominatim API
 * @param address - The address to geocode
 * @returns GeocodeResult with coordinates and address parts, or null if failed
 */
export async function geocodeAddress(address: string): Promise<GeocodeResult | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&countrycodes=au&limit=1`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'KidsEatFree/1.0 (canberra-kids-eat-free@example.com)',
      },
    });

    if (!response.ok) {
      console.error('Geocoding request failed:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();

    if (data.length === 0) {
      console.error('No results found for address:', address);
      return null;
    }

    const result = data[0];
    const addressParts = extractAddressParts(result.display_name);

    return {
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      suburb: addressParts.suburb,
      postcode: addressParts.postcode,
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

/**
 * Extract suburb and postcode from Australian address format
 * @param address - Full address string
 * @returns Object with suburb and postcode if found
 */
export function extractAddressParts(address: string): { suburb?: string; postcode?: string } {
  const parts: { suburb?: string; postcode?: string } = {};

  // Australian postcode pattern: 4 digits
  const postcodeMatch = address.match(/\b(\d{4})\b/);
  if (postcodeMatch) {
    parts.postcode = postcodeMatch[1];
  }

  // Try to extract suburb (usually appears before state/postcode)
  // Pattern: "Suburb, STATE postcode" or "Suburb STATE postcode"
  const suburbMatch = address.match(/([^,]+)\s+(?:ACT|NSW|VIC|QLD|SA|WA|TAS|NT)\s+\d{4}/);
  if (suburbMatch) {
    parts.suburb = suburbMatch[1].trim();
  }

  return parts;
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 - Latitude of first point
 * @param lon1 - Longitude of first point
 * @param lat2 - Latitude of second point
 * @param lon2 - Longitude of second point
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Check if a venue is within a given radius from a location
 * @param venue - The venue to check
 * @param userLat - User's latitude
 * @param userLon - User's longitude
 * @param radiusKm - Search radius in kilometers
 * @returns True if venue is within radius
 */
export function isWithinRadius(
  venue: Venue,
  userLat: number,
  userLon: number,
  radiusKm: number
): boolean {
  if (!venue.latitude || !venue.longitude) {
    return false;
  }

  const distance = calculateDistance(userLat, userLon, venue.latitude, venue.longitude);
  return distance <= radiusKm;
}
