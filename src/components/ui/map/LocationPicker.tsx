import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';
import GoogleMapComponent from '@/components/maps/GoogleMap';
import LocationInput from '@/components/maps/LocationInput';

interface LocationPickerProps {
  onLocationSelect: (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
  initialLocation?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}

const LocationPicker = ({
  onLocationSelect,
  initialLocation = {
    latitude: 40.7128,
    longitude: -74.006, // Default to New York City
    address: ''
  }
}: LocationPickerProps) => {
  const [location, setLocation] = useState({
    latitude: initialLocation.latitude,
    longitude: initialLocation.longitude,
    address: initialLocation.address || ''
  });

  // Update location when initialLocation changes
  useEffect(() => {
    if (initialLocation) {
      setLocation({
        latitude: initialLocation.latitude,
        longitude: initialLocation.longitude,
        address: initialLocation.address || ''
      });
    }
  }, [initialLocation]);

  // Handle location selection from the map
  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();

      // Update location state
      setLocation(prev => ({
        ...prev,
        latitude: lat,
        longitude: lng
      }));

      // Use Google Maps Geocoding API to get the address
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const newAddress = results[0].formatted_address;

          // Update location with the new address
          setLocation(prev => ({
            ...prev,
            address: newAddress
          }));

          // Notify parent component
          onLocationSelect({
            latitude: lat,
            longitude: lng,
            address: newAddress
          });
        }
      });
    }
  };

  // Handle location selection from the input
  const handleLocationInputSelect = (selectedLocation: { address: string; coordinates: { lat: number; lng: number } }) => {
    const { address, coordinates } = selectedLocation;

    // Update location state
    setLocation({
      latitude: coordinates.lat,
      longitude: coordinates.lng,
      address
    });

    // Notify parent component
    onLocationSelect({
      latitude: coordinates.lat,
      longitude: coordinates.lng,
      address
    });
  };

  const handleConfirm = () => {
    onLocationSelect(location);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <Label htmlFor="search-location">Search Location</Label>
        <LocationInput
          onLocationSelect={handleLocationInputSelect}
          placeholder="Enter address or landmark"
          initialValue={location.address}
          className="w-full"
        />
      </div>

      <div className="border rounded-md overflow-hidden">
        <GoogleMapComponent
          center={{ lat: location.latitude, lng: location.longitude }}
          zoom={14}
          height="300px"
          markers={[{
            id: 'selected-location',
            position: { lat: location.latitude, lng: location.longitude },
            title: 'Selected Location',
            info: location.address
          }]}
          onClick={handleMapClick}
        />
      </div>

      <div className="flex flex-col space-y-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="truncate">{location.address || 'No address selected'}</span>
        </div>
      </div>

      <Button
        type="button"
        onClick={handleConfirm}
        className="w-full bg-accent hover:bg-accent/90"
      >
        Confirm Location
      </Button>
    </div>
  );
};

export default LocationPicker;
