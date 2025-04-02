import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LocationMap from './LocationMap';
import { MapPin, Search } from 'lucide-react';

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
  const [latitude, setLatitude] = useState(initialLocation.latitude);
  const [longitude, setLongitude] = useState(initialLocation.longitude);
  const [address, setAddress] = useState(initialLocation.address || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Update coordinates when initialLocation changes
  useEffect(() => {
    if (initialLocation) {
      setLatitude(initialLocation.latitude);
      setLongitude(initialLocation.longitude);
      setAddress(initialLocation.address || '');
    }
  }, [initialLocation]);

  const handleLocationChange = (lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
    
    // Reverse geocode to get address
    fetchAddressFromCoordinates(lat, lng);
  };

  const fetchAddressFromCoordinates = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en-US,en;q=0.9',
            'User-Agent': 'RoadsideRelief/1.0'
          }
        }
      );
      
      const data = await response.json();
      if (data && data.display_name) {
        setAddress(data.display_name);
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`,
        {
          headers: {
            'Accept-Language': 'en-US,en;q=0.9',
            'User-Agent': 'RoadsideRelief/1.0'
          }
        }
      );
      
      const data = await response.json();
      if (data && data.length > 0) {
        const result = data[0];
        setLatitude(parseFloat(result.lat));
        setLongitude(parseFloat(result.lon));
        setAddress(result.display_name);
      }
    } catch (error) {
      console.error('Error searching location:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleConfirm = () => {
    onLocationSelect({
      latitude,
      longitude,
      address
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <Label htmlFor="search-location">Search Location</Label>
        <div className="flex space-x-2">
          <Input
            id="search-location"
            placeholder="Enter address or landmark"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button 
            type="button" 
            onClick={handleSearch}
            disabled={isSearching}
            variant="outline"
          >
            {isSearching ? (
              <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="border rounded-md overflow-hidden">
        <LocationMap
          latitude={latitude}
          longitude={longitude}
          address={address}
          onLocationChange={handleLocationChange}
          height="300px"
          zoom={14}
        />
      </div>

      <div className="flex flex-col space-y-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="truncate">{address || 'No address selected'}</span>
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
