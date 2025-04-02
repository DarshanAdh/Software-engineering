import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LocationMapProps {
  latitude: number;
  longitude: number;
  address?: string;
  height?: string;
  zoom?: number;
  interactive?: boolean;
  onLocationChange?: (lat: number, lng: number) => void;
}

const LocationMap = ({
  latitude,
  longitude,
  address,
  height = '400px',
  zoom = 15,
  interactive = true,
  onLocationChange
}: LocationMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map if it doesn't exist
    if (!leafletMapRef.current) {
      leafletMapRef.current = L.map(mapRef.current).setView([latitude, longitude], zoom);

      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(leafletMapRef.current);

      // Add marker
      markerRef.current = L.marker([latitude, longitude], {
        draggable: interactive && !!onLocationChange
      }).addTo(leafletMapRef.current);

      // Add popup with address if provided
      if (address) {
        markerRef.current.bindPopup(address).openPopup();
      }

      // Handle marker drag events if onLocationChange is provided
      if (interactive && onLocationChange) {
        markerRef.current.on('dragend', function(e) {
          const marker = e.target;
          const position = marker.getLatLng();
          onLocationChange(position.lat, position.lng);
        });
      }
    } else {
      // Update map view if coordinates change
      leafletMapRef.current.setView([latitude, longitude], zoom);
      
      // Update marker position
      if (markerRef.current) {
        markerRef.current.setLatLng([latitude, longitude]);
        
        // Update popup content if address changed
        if (address) {
          markerRef.current.bindPopup(address).openPopup();
        }
      }
    }

    // Cleanup function
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [latitude, longitude, address, zoom, interactive, onLocationChange]);

  return <div ref={mapRef} style={{ height, width: '100%' }} />;
};

export default LocationMap;
