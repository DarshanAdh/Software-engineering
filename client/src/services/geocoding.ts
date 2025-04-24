/**
 * Geocoding service using OpenStreetMap Nominatim
 * This is a free alternative to Google Maps Geocoding API
 */

/**
 * Convert an address to coordinates (latitude and longitude)
 * @param address The address to geocode
 * @returns Promise with the coordinates or error
 */
export const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number }> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
      {
        headers: {
          'Accept-Language': 'en-US,en;q=0.9',
          'User-Agent': 'RoadsideAssistance/1.0'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      throw new Error('No results found for this address');
    }

    const result = data[0];
    return {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon)
    };
  } catch (error) {
    console.error('Error geocoding address:', error);
    throw error;
  }
};

/**
 * Convert coordinates to an address (reverse geocoding)
 * @param lat Latitude
 * @param lng Longitude
 * @returns Promise with the formatted address or error
 */
export const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en-US,en;q=0.9',
          'User-Agent': 'RoadsideAssistance/1.0'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Reverse geocoding API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data || !data.display_name) {
      throw new Error('No address found for these coordinates');
    }

    return data.display_name;
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    throw error;
  }
};

/**
 * Calculate the distance between two points in kilometers
 * Uses the Haversine formula
 * @param origin Origin coordinates
 * @param destination Destination coordinates
 * @returns Distance in kilometers
 */
export const calculateDistance = (
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number }
): number => {
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(destination.lat - origin.lat);
  const dLng = deg2rad(destination.lng - origin.lng);

  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(origin.lat)) * Math.cos(deg2rad(destination.lat)) *
    Math.sin(dLng/2) * Math.sin(dLng/2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in km

  return distance;
};

/**
 * Convert degrees to radians
 * @param deg Degrees
 * @returns Radians
 */
const deg2rad = (deg: number): number => {
  return deg * (Math.PI/180);
};

/**
 * Get place predictions based on input text
 * @param input The input text to get predictions for
 * @returns Promise with the predictions or error
 */
export const getPlacePredictions = async (input: string): Promise<any[]> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(input)}&limit=5`,
      {
        headers: {
          'Accept-Language': 'en-US,en;q=0.9',
          'User-Agent': 'RoadsideAssistance/1.0'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Places API error: ${response.status}`);
    }

    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('Error getting place predictions:', error);
    throw error;
  }
};
