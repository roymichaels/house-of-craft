import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from './ui/input';
import { Button } from './ui/button';

const MapBackground = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [token, setToken] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  const initializeMap = (accessToken: string) => {
    if (!mapContainer.current || map.current) return;

    try {
      mapboxgl.accessToken = accessToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        projection: { name: 'globe' },
        zoom: 1.3,
        center: [20, 20],
        pitch: 0,
        interactive: false,
      });

      // Add atmosphere and fog effects for depth
      map.current.on('style.load', () => {
        map.current?.setFog({
          color: 'rgb(10, 10, 15)',
          'high-color': 'rgb(30, 30, 40)',
          'horizon-blend': 0.1,
          'space-color': 'rgb(5, 5, 10)',
          'star-intensity': 0.3,
        });
      });

      // Slow, celestial rotation
      const secondsPerRevolution = 300;
      
      function spinGlobe() {
        if (!map.current) return;
        
        const distancePerSecond = 360 / secondsPerRevolution;
        const center = map.current.getCenter();
        center.lng -= distancePerSecond;
        map.current.easeTo({ center, duration: 1000, easing: (n) => n });
      }

      map.current.on('moveend', () => {
        spinGlobe();
      });

      spinGlobe();
      setIsInitialized(true);
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };

  useEffect(() => {
    return () => {
      map.current?.remove();
    };
  }, []);

  if (!isInitialized) {
    return (
      <div className="absolute inset-0 bg-background flex items-center justify-center z-0">
        <div className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
          <h3 className="text-lg font-semibold mb-2">Mapbox Token Required</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Enter your Mapbox public token to enable the 3D globe background.
            Get yours at{' '}
            <a 
              href="https://mapbox.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              mapbox.com
            </a>
          </p>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="pk.eyJ1..."
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={() => {
                if (token.startsWith('pk.')) {
                  initializeMap(token);
                }
              }}
              disabled={!token.startsWith('pk.')}
            >
              Initialize
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div ref={mapContainer} className="absolute inset-0 z-0" />
      {/* Dark overlay for better content readability */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none z-[1]" />
    </>
  );
};

export default MapBackground;
