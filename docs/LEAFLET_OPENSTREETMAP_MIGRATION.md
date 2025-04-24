# Leaflet with OpenStreetMap Migration

This project has been updated to use Leaflet with OpenStreetMap instead of Google Maps API. This change provides several benefits:

1. **Open Source**: Leaflet and OpenStreetMap are both open-source solutions
2. **No API Key Required**: OpenStreetMap doesn't require an API key for basic usage
3. **No Usage Limits**: No strict usage limits or billing concerns
4. **Privacy**: Better privacy controls and data ownership

## Components Updated

The following components have been updated to use Leaflet and OpenStreetMap:

1. **LocationInput**: Now uses OpenStreetMap's Nominatim service for geocoding instead of Google Places API
2. **LeafletMap**: A reusable map component that uses Leaflet with OpenStreetMap tiles
3. **LocationSearchInput**: A component for searching locations with OpenStreetMap's Nominatim service

## Usage Examples

### LeafletMap Component

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

### LocationSearchInput Component

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

### LocationInput Component

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

## MongoDB Atlas Configuration

The application is configured to use MongoDB Atlas for cloud database hosting. The connection string is stored in the `.env` file:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

## Important Notes

1. **Rate Limiting**: While OpenStreetMap's Nominatim service is free, it has usage policies. Please respect their [usage policy](https://operations.osmfoundation.org/policies/nominatim/).
2. **User-Agent**: All requests to Nominatim include a custom User-Agent header as required by their policy.
3. **Backup**: A backup of the original codebase has been created in the `Software-engineering-backup` directory.
