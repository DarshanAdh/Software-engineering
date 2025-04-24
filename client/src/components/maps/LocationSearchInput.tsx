import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Search, Loader2 } from 'lucide-react';

interface LocationSearchInputProps {
  onLocationSelect: (location: { address: string; coordinates: [number, number] }) => void;
  placeholder?: string;
  initialValue?: string;
  className?: string;
}

const LocationSearchInput: React.FC<LocationSearchInputProps> = ({
  onLocationSelect,
  placeholder = 'Enter your location',
  initialValue = '',
  className = '',
}) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPredictions, setShowPredictions] = useState(false);

  // Search for locations using OpenStreetMap Nominatim
  const searchLocations = async (query: string) => {
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`,
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
      setPredictions(data);
      setShowPredictions(data.length > 0);
    } catch (error) {
      console.error('Error searching locations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle location selection
  const handleLocationSelect = (location: any) => {
    setInputValue(location.display_name);
    setShowPredictions(false);
    
    onLocationSelect({
      address: location.display_name,
      coordinates: [parseFloat(location.lat), parseFloat(location.lon)]
    });
  };

  // Handle using current location
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Reverse geocode to get address
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
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
            const address = data.display_name;
            
            setInputValue(address);
            onLocationSelect({
              address,
              coordinates: [latitude, longitude]
            });
          } catch (error) {
            console.error('Error getting address from coordinates:', error);
          } finally {
            setIsLoading(false);
          }
        },
        (error) => {
          console.error('Error getting current location:', error);
          setIsLoading(false);
          alert('Unable to get your current location. Please check your browser settings.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  // Debounce search to avoid too many requests
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Clear existing timeout
    const timeoutId = setTimeout(() => {
      if (value.trim().length > 2) {
        searchLocations(value);
      } else {
        setPredictions([]);
        setShowPredictions(false);
      }
    }, 500);
    
    return () => clearTimeout(timeoutId);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder={placeholder}
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => inputValue.trim().length > 2 && setPredictions.length > 0 && setShowPredictions(true)}
            className="pr-10"
            disabled={isLoading}
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={handleUseCurrentLocation}
          disabled={isLoading}
        >
          <MapPin className="h-4 w-4 mr-2" />
          Current
        </Button>
      </div>

      {/* Predictions dropdown */}
      {showPredictions && predictions.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto border border-gray-200">
          {predictions.map((prediction) => (
            <div
              key={prediction.place_id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() => handleLocationSelect(prediction)}
            >
              {prediction.display_name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationSearchInput;
