import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';
import LeafletMap from './LeafletMap';
import LocationSearchInput from './LocationSearchInput';

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

const LocationPicker: React.FC<LocationPickerProps> = ({
  onLocationSelect,
  initialLocation = {
    latitude: 40.7128,
    longitude: -74.006, // Default to New York City
    address: ''
  }
}) => {
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

  // Handle map click
  const handleMapClick = (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;
    
    // Update location state
    setLocation(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }));
    
    // Get address from coordinates using Nominatim
    fetchAddressFromCoordinates(lat, lng);
  };

  // Fetch address from coordinates using Nominatim
  const fetchAddressFromCoordinates = async (lat: number, lng: number) => {
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
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      if (data && data.display_name) {
        const newAddress = data.display_name;
        
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
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  // Handle location selection from search input
  const handleLocationInputSelect = (selectedLocation: { address: string; coordinates: [number, number] }) => {
    const { address, coordinates } = selectedLocation;
    const [lat, lng] = coordinates;
    
    // Update location state
    setLocation({
      latitude: lat,
      longitude: lng,
      address
    });
    
    // Notify parent component
    onLocationSelect({
      latitude: lat,
      longitude: lng,
      address
    });
  };

  // Handle confirm button click
  const handleConfirm = () => {
    onLocationSelect(location);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <Label htmlFor="search-location">Search Location</Label>
        <LocationSearchInput
          onLocationSelect={handleLocationInputSelect}
          placeholder="Enter address or landmark"
          initialValue={location.address}
          className="w-full"
        />
      </div>

      <div className="border rounded-md overflow-hidden">
        <LeafletMap
          center={[location.latitude, location.longitude]}
          zoom={14}
          height="300px"
          markers={[{
            id: 'selected-location',
            position: [location.latitude, location.longitude],
            title: 'Selected Location',
            content: location.address
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
