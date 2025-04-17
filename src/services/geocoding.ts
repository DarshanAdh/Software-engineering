/**
 * Geocoding service for converting between addresses and coordinates
 */

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

/**
 * Convert an address to coordinates (latitude and longitude)
 * @param address The address to geocode
 * @returns Promise with the coordinates or error
 */
export const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number }> => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${GOOGLE_MAPS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 'OK') {
      throw new Error(`Geocoding failed: ${data.status}`);
    }

    const { lat, lng } = data.results[0].geometry.location;
    return { lat, lng };
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
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Reverse geocoding API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 'OK') {
      throw new Error(`Reverse geocoding failed: ${data.status}`);
    }

    return data.results[0].formatted_address;
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    throw error;
  }
};

/**
 * Calculate the distance between two points in kilometers
 * @param origin Origin coordinates
 * @param destination Destination coordinates
 * @returns Promise with the distance in kilometers or error
 */
export const calculateDistance = async (
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number }
): Promise<number> => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.lat},${
        origin.lng
      }&destinations=${destination.lat},${
        destination.lng
      }&mode=driving&key=${GOOGLE_MAPS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Distance Matrix API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 'OK') {
      throw new Error(`Distance calculation failed: ${data.status}`);
    }

    // Return distance in kilometers
    return data.rows[0].elements[0].distance.value / 1000;
  } catch (error) {
    console.error('Error calculating distance:', error);
    throw error;
  }
};

/**
 * Get place predictions based on input text
 * @param input The input text to get predictions for
 * @returns Promise with the predictions or error
 */
export const getPlacePredictions = async (input: string): Promise<any[]> => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        input
      )}&key=${GOOGLE_MAPS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Places API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      throw new Error(`Place predictions failed: ${data.status}`);
    }

    return data.predictions || [];
  } catch (error) {
    console.error('Error getting place predictions:', error);
    throw error;
  }
};
