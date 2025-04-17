# Google Maps API Integration Guide

This guide explains how to set up and use Google Maps API in the Roadside Assistance application.

## Prerequisites

1. A Google Cloud Platform account
2. A project in Google Cloud Console
3. Billing enabled for your project (required for Google Maps API)

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top of the page
3. Click "New Project"
4. Enter a name for your project and click "Create"

## Step 2: Enable Required APIs

1. In your project, go to "APIs & Services" > "Library"
2. Search for and enable the following APIs:
   - Maps JavaScript API
   - Geocoding API
   - Places API
   - Directions API
   - Distance Matrix API

## Step 3: Create API Key

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Your new API key will be displayed
4. Click "Restrict Key" to set up restrictions (recommended for security)
   - Under "Application restrictions", select "HTTP referrers"
   - Add your domain(s) where the app will be hosted
   - Under "API restrictions", select the APIs you enabled in Step 2

## Step 4: Configure Environment Variables

1. Create or update the `.env` file in the root directory:
   ```
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```

2. Update the `server/.env` file:
   ```
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```

## Step 5: Using Google Maps Components

The application includes several components for working with Google Maps:

### GoogleMapComponent

A reusable map component that can display markers, directions, and handle interactions.

```jsx
import GoogleMapComponent from '@/components/maps/GoogleMap';

<GoogleMapComponent
  center={{ lat: 40.7128, lng: -74.0060 }}
  zoom={12}
  markers={[
    {
      id: 'marker-1',
      position: { lat: 40.7128, lng: -74.0060 },
      title: 'New York City',
      info: 'The Big Apple'
    }
  ]}
  onClick={(e) => console.log(e.latLng.lat(), e.latLng.lng())}
/>
```

### LocationInput

A component for searching locations with Google Places autocomplete.

```jsx
import LocationInput from '@/components/maps/LocationInput';

<LocationInput
  onLocationSelect={(location) => {
    console.log(location.address);
    console.log(location.coordinates.lat, location.coordinates.lng);
  }}
  placeholder="Enter a location"
/>
```

### LocationPicker

A component that combines the map and location input for selecting a location.

```jsx
import LocationPicker from '@/components/ui/map/LocationPicker';

<LocationPicker
  onLocationSelect={(location) => {
    console.log(location.address);
    console.log(location.latitude, location.longitude);
  }}
  initialLocation={{
    latitude: 40.7128,
    longitude: -74.0060,
    address: 'New York City'
  }}
/>
```

## Step 6: Geocoding Services

The application includes a geocoding service for converting between addresses and coordinates:

```javascript
import { geocodeAddress, reverseGeocode, calculateDistance } from '@/services/geocoding';

// Convert address to coordinates
const coordinates = await geocodeAddress('1600 Amphitheatre Parkway, Mountain View, CA');
console.log(coordinates.lat, coordinates.lng);

// Convert coordinates to address
const address = await reverseGeocode(37.4224764, -122.0842499);
console.log(address);

// Calculate distance between two points
const distance = await calculateDistance(
  { lat: 37.4224764, lng: -122.0842499 },
  { lat: 37.7749, lng: -122.4194 }
);
console.log(`Distance: ${distance} km`);
```

## Troubleshooting

1. **"Google Maps JavaScript API error: InvalidKeyMapError"**
   - Verify your API key is correct
   - Check that the Maps JavaScript API is enabled
   - Ensure your domain is allowed in the API key restrictions

2. **"Google Maps JavaScript API error: RefererNotAllowedMapError"**
   - Your domain is not allowed in the API key restrictions
   - Add your domain to the allowed referrers

3. **"Google Maps JavaScript API error: MissingKeyMapError"**
   - The API key is missing in the request
   - Check that the environment variable is correctly set

4. **"Geocoding API error"**
   - Verify the Geocoding API is enabled
   - Check your API key has access to the Geocoding API
   - Ensure you're not exceeding usage limits

## Additional Resources

- [Google Maps JavaScript API Documentation](https://developers.google.com/maps/documentation/javascript/overview)
- [Geocoding API Documentation](https://developers.google.com/maps/documentation/geocoding/overview)
- [Places API Documentation](https://developers.google.com/maps/documentation/places/web-service/overview)
- [Directions API Documentation](https://developers.google.com/maps/documentation/directions/overview)
- [Distance Matrix API Documentation](https://developers.google.com/maps/documentation/distance-matrix/overview)
