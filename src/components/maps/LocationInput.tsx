import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Loader2 } from 'lucide-react';

interface LocationInputProps {
  onLocationSelect: (location: { address: string; coordinates: { lat: number; lng: number } }) => void;
  placeholder?: string;
  initialValue?: string;
  className?: string;
  apiKey?: string;
}

const LocationInput: React.FC<LocationInputProps> = ({
  onLocationSelect,
  placeholder = 'Enter your location',
  initialValue = '',
  className = '',
  apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
}) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPredictions, setShowPredictions] = useState(false);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const predictionsRef = useRef<HTMLDivElement>(null);

  // Initialize Google Maps services
  useEffect(() => {
    // Load the Google Maps JavaScript API
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      autocompleteService.current = new google.maps.places.AutocompleteService();
      
      // Create a dummy div for PlacesService (it requires a DOM element)
      const dummyDiv = document.createElement('div');
      dummyDiv.style.display = 'none';
      document.body.appendChild(dummyDiv);
      placesService.current = new google.maps.places.PlacesService(dummyDiv);
    };
    
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, [apiKey]);

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
  const getPlacePredictions = (input: string) => {
    if (!input || !autocompleteService.current) return;

    setIsLoading(true);
    autocompleteService.current.getPlacePredictions(
      {
        input,
        componentRestrictions: { country: 'us' }, // Limit to US
      },
      (results, status) => {
        setIsLoading(false);
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          setPredictions(results);
          setShowPredictions(true);
        } else {
          setPredictions([]);
          setShowPredictions(false);
        }
      }
    );
  };

  // Debounce input to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue) {
        getPlacePredictions(inputValue);
      } else {
        setPredictions([]);
        setShowPredictions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue]);

  // Handle place selection
  const handlePlaceSelect = (placeId: string, description: string) => {
    if (!placesService.current) return;

    setIsLoading(true);
    placesService.current.getDetails(
      {
        placeId,
        fields: ['geometry', 'formatted_address'],
      },
      (place, status) => {
        setIsLoading(false);
        if (status === google.maps.places.PlacesServiceStatus.OK && place && place.geometry && place.geometry.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          const address = place.formatted_address || description;
          
          setInputValue(address);
          onLocationSelect({
            address,
            coordinates: { lat, lng },
          });
        }
        setShowPredictions(false);
      }
    );
  };

  // Handle using current location
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // Reverse geocode to get address
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode(
            { location: { lat: latitude, lng: longitude } },
            (results, status) => {
              setIsLoading(false);
              if (status === 'OK' && results && results[0]) {
                const address = results[0].formatted_address;
                setInputValue(address);
                onLocationSelect({
                  address,
                  coordinates: { lat: latitude, lng: longitude },
                });
              } else {
                console.error('Geocoder failed due to: ' + status);
              }
            }
          );
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
            onFocus={() => inputValue && setPredictions.length > 0 && setShowPredictions(true)}
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
              onClick={() => handlePlaceSelect(prediction.place_id, prediction.description)}
            >
              {prediction.description}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationInput;
