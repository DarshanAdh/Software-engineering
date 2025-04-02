
import React, { useEffect, useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';

// This is a placeholder map component
// In a real implementation, we would integrate with MapBox or Google Maps API
const Map = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden border border-border shadow-sm">
      {loading ? (
        // Loading state
        <div className="absolute inset-0 bg-secondary/50 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
            <p className="text-muted-foreground">Loading map...</p>
          </div>
        </div>
      ) : (
        // Placeholder map with styling
        <div className="absolute inset-0 bg-[#f4f7f9]">
          {/* Grid lines for map */}
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'linear-gradient(to right, #e0e7ec 1px, transparent 1px), linear-gradient(to bottom, #e0e7ec 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}></div>
          
          {/* Roads */}
          <div className="absolute top-1/4 left-0 right-0 h-2 bg-[#d2dce5]"></div>
          <div className="absolute top-2/3 left-0 right-0 h-3 bg-[#d2dce5]"></div>
          <div className="absolute top-0 bottom-0 left-1/3 w-2 bg-[#d2dce5]"></div>
          <div className="absolute top-0 bottom-0 right-1/4 w-3 bg-[#d2dce5]"></div>
          
          {/* User location */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="absolute -inset-8 bg-primary/10 rounded-full animate-pulse"></div>
              <div className="relative z-10 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center shadow-lg">
                <MapPin size={16} />
              </div>
            </div>
          </div>
          
          {/* Helper location */}
          <div className="absolute top-2/3 right-1/3">
            <div className="w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center shadow-lg">
              <Navigation size={16} />
            </div>
          </div>
          
          {/* Distance line between user and helper */}
          <div className="absolute top-[55%] left-[47%] w-[15%] h-[18%] border-r-2 border-b-2 border-dashed border-accent/70"></div>
        </div>
      )}
    </div>
  );
};

export default Map;
