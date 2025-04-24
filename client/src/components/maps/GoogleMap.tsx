import React, { useState, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, DirectionsRenderer } from '@react-google-maps/api';

// Default map container style
const containerStyle = {
  width: '100%',
  height: '400px'
};

// Default center (can be overridden by props)
const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060 // New York City
};

// Map options
const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: true,
  fullscreenControl: true,
};

interface MapMarker {
  id: string;
  position: google.maps.LatLngLiteral;
  title?: string;
  icon?: string;
  info?: string;
}

interface GoogleMapComponentProps {
  apiKey?: string;
  center?: google.maps.LatLngLiteral;
  zoom?: number;
  markers?: MapMarker[];
  showDirections?: boolean;
  origin?: google.maps.LatLngLiteral;
  destination?: google.maps.LatLngLiteral;
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onMarkerClick?: (marker: MapMarker) => void;
  height?: string;
  width?: string;
  className?: string;
}

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({
  apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
  center = defaultCenter,
  zoom = 12,
  markers = [],
  showDirections = false,
  origin,
  destination,
  onClick,
  onMarkerClick,
  height,
  width,
  className,
}) => {
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  // Load the Google Maps JavaScript API
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries: ['places', 'geometry', 'drawing'],
  });

  // Store a reference to the map instance
  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  // Clear the reference when the map unmounts
  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  // Get directions when origin and destination are provided
  React.useEffect(() => {
    if (isLoaded && showDirections && origin && destination) {
      const directionsService = new google.maps.DirectionsService();
      
      directionsService.route(
        {
          origin: origin,
          destination: destination,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error(`Directions request failed: ${status}`);
          }
        }
      );
    }
  }, [isLoaded, showDirections, origin, destination]);

  // Custom container style based on props
  const customContainerStyle = {
    width: width || containerStyle.width,
    height: height || containerStyle.height,
  };

  // Handle loading error
  if (loadError) {
    return <div className="text-red-500">Error loading Google Maps: {loadError.message}</div>;
  }

  // Show loading state
  if (!isLoaded) {
    return <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      <p className="ml-2">Loading Google Maps...</p>
    </div>;
  }

  return (
    <div className={className}>
      <GoogleMap
        mapContainerStyle={customContainerStyle}
        center={center}
        zoom={zoom}
        options={mapOptions}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={onClick}
      >
        {/* Render markers */}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            title={marker.title}
            icon={marker.icon}
            onClick={() => {
              setSelectedMarker(marker);
              if (onMarkerClick) onMarkerClick(marker);
            }}
          />
        ))}

        {/* Show info window for selected marker */}
        {selectedMarker && selectedMarker.info && (
          <InfoWindow
            position={selectedMarker.position}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div>
              {selectedMarker.title && <h3 className="font-medium">{selectedMarker.title}</h3>}
              <p>{selectedMarker.info}</p>
            </div>
          </InfoWindow>
        )}

        {/* Show directions if available */}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </div>
  );
};

export default GoogleMapComponent;
