import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Loader2 } from 'lucide-react';

interface LocationInputProps {
  onLocationSelect: (location: { address: string; coordinates: { lat: number; lng: number } }) => void;
  placeholder?: string;
  initialValue?: string;
  className?: string;
}

const LocationInput: React.FC<LocationInputProps> = ({
  onLocationSelect,
  placeholder = 'Enter your location',
  initialValue = '',
  className = '',
}) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPredictions, setShowPredictions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const predictionsRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside the component to close predictions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        predictionsRef.current &&
        !predictionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowPredictions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get place predictions when input changes
  const getPlacePredictions = async (input: string) => {
    if (!input) return;

    setIsLoading(true);
    try {
      // Use Nominatim API for geocoding (OpenStreetMap)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(input)}&limit=5&countrycodes=us`,
        {
          headers: {
            'Accept-Language': 'en-US,en;q=0.9',
            'User-Agent': 'RoadsideAssistance/1.0'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setPredictions(data);
      setShowPredictions(data.length > 0);
    } catch (error) {
      console.error('Error fetching location predictions:', error);
      setPredictions([]);
      setShowPredictions(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce input to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue && inputValue.trim().length > 2) {
        getPlacePredictions(inputValue);
      } else {
        setPredictions([]);
        setShowPredictions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue]);

  // Handle place selection
  const handlePlaceSelect = (place: any) => {
    const lat = parseFloat(place.lat);
    const lng = parseFloat(place.lon);
    const address = place.display_name;

    setInputValue(address);
    onLocationSelect({
      address,
      coordinates: { lat, lng },
    });
    setShowPredictions(false);
  };

  // Handle using current location
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // Reverse geocode to get address using Nominatim
          try {
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
              throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const address = data.display_name;

            setInputValue(address);
            onLocationSelect({
              address,
              coordinates: { lat: latitude, lng: longitude },
            });
          } catch (error) {
            console.error('Error reverse geocoding:', error);
            // Fallback to coordinates if geocoding fails
            onLocationSelect({
              address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
              coordinates: { lat: latitude, lng: longitude },
            });
          } finally {
            setIsLoading(false);
          }
        },
        (error) => {
          setIsLoading(false);
          console.error('Error getting current location:', error);
          alert('Unable to get your current location. Please check your browser settings.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => inputValue && inputValue.trim().length > 2 && predictions.length > 0 && setShowPredictions(true)}
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
        <div
          ref={predictionsRef}
          className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto border border-gray-200"
        >
          {predictions.map((prediction) => (
            <div
              key={prediction.place_id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() => handlePlaceSelect(prediction)}
            >
              {prediction.display_name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationInput;
