// Global type declarations

// Declare modules without type definitions
declare module '@radix-ui/react-accordion';
declare module '@radix-ui/react-alert-dialog';
declare module '@radix-ui/react-aspect-ratio';
declare module '@radix-ui/react-avatar';
declare module 'react-day-picker';
declare module 'embla-carousel-react';
declare module 'recharts';
declare module '@radix-ui/react-collapsible';
declare module '@radix-ui/react-context-menu';
declare module 'vaul';
declare module '@radix-ui/react-dropdown-menu';
declare module '@radix-ui/react-hover-card';
declare module 'input-otp';
declare module '@radix-ui/react-menubar';
declare module '@radix-ui/react-navigation-menu';
declare module '@radix-ui/react-progress';
declare module 'react-resizable-panels';
declare module '@radix-ui/react-scroll-area';
declare module '@radix-ui/react-select';
declare module '@radix-ui/react-separator';
declare module '@radix-ui/react-slider';
declare module '@radix-ui/react-toggle-group';
declare module '@radix-ui/react-toggle';

// Add any missing interfaces
interface Window {
  google: any;
}

// Add missing namespace
declare namespace google {
  namespace maps {
    type LatLngLiteral = {
      lat: number;
      lng: number;
    };
    
    type MapMouseEvent = any;
    type Map = any;
    type DirectionsResult = any;
    type DirectionsService = any;
    type DirectionsStatus = {
      OK: any;
    };
    type TravelMode = {
      DRIVING: any;
    };
  }
}
