import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with React
// This is needed because the default markers use relative URLs that don't work with React
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

// Component to update map view when center prop changes
const ChangeView = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

interface MarkerData {
  id: string;
  position: [number, number];
  title?: string;
  content?: string;
}

interface LeafletMapProps {
  center: [number, number];
  zoom?: number;
  markers?: MarkerData[];
  height?: string;
  width?: string;
  className?: string;
  onClick?: (e: L.LeafletMouseEvent) => void;
}

const LeafletMap: React.FC<LeafletMapProps> = ({
  center,
  zoom = 13,
  markers = [],
  height = '400px',
  width = '100%',
  className = '',
  onClick
}) => {
  const mapStyle = {
    height,
    width
  };

  // Handle map click events
  const handleMapClick = (e: L.LeafletMouseEvent) => {
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <div className={className}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={mapStyle}
        scrollWheelZoom={true}
        // Use eventHandlers instead of whenReady for TypeScript compatibility
        eventHandlers={{
          load: (e) => {
            // Add click event listener to the map
            if (onClick) {
              e.target.on('click', handleMapClick);
            }
          }
        }}
      >
        <ChangeView center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker) => (
          <Marker key={marker.id} position={marker.position}>
            {(marker.title || marker.content) && (
              <Popup>
                {marker.title && <h3 className="font-medium">{marker.title}</h3>}
                {marker.content && <p>{marker.content}</p>}
              </Popup>
            )}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default LeafletMap;
