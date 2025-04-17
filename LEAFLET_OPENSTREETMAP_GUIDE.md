# Leaflet with OpenStreetMap Integration Guide

This guide explains how to use Leaflet with OpenStreetMap in the Roadside Assistance application.

## Overview

The application uses Leaflet with OpenStreetMap for mapping functionality. This is a completely free and open-source solution that doesn't require any API keys or billing setup.

## Benefits of Leaflet + OpenStreetMap

1. **Completely Free**: No API keys or billing required
2. **Open Source**: Both Leaflet and OpenStreetMap are open-source projects
3. **No Usage Limits**: No quotas or rate limits to worry about
4. **Privacy-Focused**: Less tracking compared to commercial alternatives
5. **Customizable**: Extensive customization options

## Components

The application includes several components for working with maps:

### LeafletMap

A reusable map component that can display markers and handle interactions.

```jsx
import LeafletMap from '@/components/maps/LeafletMap';

<LeafletMap
  center={[40.7128, -74.0060]} // [latitude, longitude]
  zoom={13}
  markers={[
    {
      id: 'marker-1',
      position: [40.7128, -74.0060],
      title: 'New York City',
      content: 'The Big Apple'
    }
  ]}
  onClick={(e) => console.log(e.latlng.lat, e.latlng.lng)}
/>
```

### LocationSearchInput

A component for searching locations with OpenStreetMap's Nominatim service.

```jsx
import LocationSearchInput from '@/components/maps/LocationSearchInput';

<LocationSearchInput
  onLocationSelect={(location) => {
    console.log(location.address);
    console.log(location.coordinates[0], location.coordinates[1]); // lat, lng
  }}
  placeholder="Enter a location"
/>
```

### LocationPicker

A component that combines the map and location input for selecting a location.

```jsx
import LocationPicker from '@/components/maps/LocationPicker';

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

## Geocoding Services

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
const distance = calculateDistance(
  { lat: 37.4224764, lng: -122.0842499 },
  { lat: 37.7749, lng: -122.4194 }
);
console.log(`Distance: ${distance} km`);
```

## Usage Guidelines for OpenStreetMap

When using OpenStreetMap's Nominatim service for geocoding, please follow these guidelines:

1. **Add a User-Agent Header**: Always include a meaningful User-Agent header with your application name
2. **Limit Request Rate**: Maximum 1 request per second
3. **Cache Results**: Cache geocoding results when possible
4. **Bulk Geocoding**: For bulk geocoding, download the data and use a local installation

## Troubleshooting

1. **Map not displaying**
   - Make sure you've imported the Leaflet CSS: `import 'leaflet/dist/leaflet.css';`
   - Check that the container has a defined height

2. **Markers not appearing**
   - This is often due to missing marker icons
   - The LeafletMap component includes a fix for this issue

3. **Geocoding errors**
   - Check your network connection
   - Ensure you're not exceeding the rate limit (1 request per second)
   - Verify the address format

## Additional Resources

- [Leaflet Documentation](https://leafletjs.com/reference.html)
- [React Leaflet Documentation](https://react-leaflet.js.org/)
- [OpenStreetMap Wiki](https://wiki.openstreetmap.org/wiki/Main_Page)
- [Nominatim Usage Policy](https://operations.osmfoundation.org/policies/nominatim/)
