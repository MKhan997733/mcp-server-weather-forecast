interface Coordinates {
  latitude: number;
  longitude: number;
}

interface GeocodeResult {
  name: string;
  coordinates: Coordinates;
  displayName: string;
  country: string;
  county?: string;
  state?: string;
}

interface GeocodeError {
  error: string;
  details?: string;
}

type GeocodeResponse = GeocodeResult[] | GeocodeError;

/**
 * Geocode a UK city using Nominatim (OpenStreetMap) - Free with no API key
 * @param cityName - Name of the city to geocode
 * @param countryCode - Country code (default: 'gb' for UK)
 * @returns Promise with coordinates and location details
 */
export async function geocodeUKCity(
  cityName: string, 
  countryCode: string = 'gb'
): Promise<GeocodeResponse> {
  try {
    const encodedCity = encodeURIComponent(cityName.trim());
    const url = `https://nominatim.openstreetmap.org/search?` +
      `q=${encodedCity}&` +
      `countrycodes=${countryCode}&` +
      `format=json&` +
      `addressdetails=1&` +
      `limit=5`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'UK-City-Geocoder/1.0' // Required by Nominatim
      }
    });

    if (!response.ok) {
      return {
        error: 'Geocoding service unavailable',
        details: `HTTP ${response.status}: ${response.statusText}`
      };
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      return {
        error: `No results found for "${cityName}" in the UK`,
        details: 'Try checking the spelling or using a more specific location name'
      };
    }

    // Transform the results
    const results: GeocodeResult[] = data.map((item: any) => ({
      name: item.name || item.display_name.split(',')[0],
      coordinates: {
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon)
      },
      displayName: item.display_name,
      country: item.address?.country || 'United Kingdom',
      county: item.address?.county,
      state: item.address?.state
    }));

    return results;

  } catch (error) {
    return {
      error: 'Failed to geocode location',
      details: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}


/**
 * Rate-limited wrapper for Nominatim (respects 1 request/second limit)
 */
class NominatimGeocoder {
  private lastRequestTime = 0;
  private readonly minInterval = 1000; // 1 second between requests

  async geocode(cityName: string, countryCode: string = 'gb'): Promise<GeocodeResponse> {
    // Ensure we don't exceed rate limit
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.minInterval) {
      const waitTime = this.minInterval - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    this.lastRequestTime = Date.now();
    return geocodeUKCity(cityName, countryCode);
  }
}

// Create singleton instance
export const nominatimGeocoder = new NominatimGeocoder();

/**
 * Batch geocode multiple cities (with rate limiting for Nominatim)
 */
export async function batchGeocodeUKCities(
  cityNames: string[],
  useRateLimiting: boolean = true
): Promise<Record<string, GeocodeResponse>> {
  const results: Record<string, GeocodeResponse> = {};
  
  for (const cityName of cityNames) {
    try {
      if (useRateLimiting) {
        results[cityName] = await nominatimGeocoder.geocode(cityName);
      } else {
        results[cityName] = await geocodeUKCity(cityName);
      }
    } catch (error) {
      results[cityName] = {
        error: `Failed to geocode ${cityName}`,
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  return results;
}

// Example usage:
/*
// Using Nominatim (completely free)
const result = await geocodeUKCity('Manchester');
if ('error' in result) {
  console.log('Error:', result.error);
} else {
  console.log('Found', result.length, 'results');
  console.log('Top result:', result[0].coordinates);
}

// Batch geocoding with rate limiting
const cities = ['London', 'Manchester', 'Birmingham'];
const batchResults = await batchGeocodeUKCities(cities);

// Using the rate-limited singleton
const ratedResult = await nominatimGeocoder.geocode('Edinburgh');
*/