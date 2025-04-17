
import { useEffect, useState } from 'react';
import LeafletMap from '@/components/maps/LeafletMap';

interface MapProps {
  latitude?: number;
  longitude?: number;
  address?: string;
  height?: string;
  interactive?: boolean;
}

const Map = ({
  latitude = 40.7128, // Default to New York City
  longitude = -74.0060,
  address = '',
  height = '100%',
  interactive = true
}: MapProps) => {
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    // Try to get user's location if no specific coordinates are provided
    if (latitude === 40.7128 && longitude === -74.0060) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
            setLoading(false);
          },
          (error) => {
            console.error('Error getting location:', error);
            setLoading(false);
          }
        );
      } else {
        console.log('Geolocation is not supported by this browser.');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [latitude, longitude]);

  if (loading) {
    return (
      <div className="relative w-full h-full rounded-lg overflow-hidden border border-border shadow-sm">
        <div className="absolute inset-0 bg-secondary/50 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
            <p className="text-muted-foreground">Loading map...</p>
          </div>
        </div>
      </div>
    );
  }

  const lat = userLocation ? userLocation.lat : latitude;
  const lng = userLocation ? userLocation.lng : longitude;

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden border border-border shadow-sm">
      <LeafletMap
        center={[lat, lng]}
        zoom={14}
        height={height}
        markers={[{
          id: 'location-marker',
          position: [lat, lng],
          title: address || 'Selected Location',
          content: address
        }]}
      />
    </div>
  );
};

export default Map;
