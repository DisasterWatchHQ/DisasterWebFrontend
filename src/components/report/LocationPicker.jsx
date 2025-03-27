import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import Script from 'next/script';

const LocationPicker = ({ onChange, defaultLocation }) => {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [error, setError] = useState(null);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  
  const defaultCenter = { lat: 0, lng: 0 };
  
  useEffect(() => {
    if (!isGoogleLoaded || !window.google) return;
    
    const mapElement = document.getElementById('map');
    if (!mapElement || map) return;
    
    try {
      const mapInstance = new window.google.maps.Map(mapElement, {
        center: defaultCenter,
        zoom: 8,
        streetViewControl: false,
        mapTypeControl: false
      });
      
      mapInstance.addListener('click', handleMapClick);
      setMap(mapInstance);
      
      if (defaultLocation?.latitude && defaultLocation?.longitude) {
        const position = { 
          lat: defaultLocation.latitude, 
          lng: defaultLocation.longitude 
        };
        
        const newMarker = new window.google.maps.Marker({
          position,
          map: mapInstance,
          draggable: true
        });
        
        setMarker(newMarker);
        mapInstance.setCenter(position);
        
        newMarker.addListener('dragend', () => {
          const pos = newMarker.getPosition();
          onChange({
            latitude: pos.lat(),
            longitude: pos.lng()
          });
        });
      }
    } catch (err) {
      setError('Failed to initialize map. Please try again.');
    }
  }, [isGoogleLoaded, defaultLocation]);
  
  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    
    if (marker) {
      marker.setMap(null);
    }
    
    const newMarker = new window.google.maps.Marker({
      position: { lat, lng },
      map,
      draggable: true
    });
    
    setMarker(newMarker);
    
    newMarker.addListener('dragend', () => {
      const pos = newMarker.getPosition();
      onChange({
        latitude: pos.lat(),
        longitude: pos.lng()
      });
    });
    
    onChange({ latitude: lat, longitude: lng });
  };

  return (
    <div className="space-y-2">
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PRIVATE_GOOGLE_MAPS_API_KEY}`}
        onLoad={() => setIsGoogleLoaded(true)}
      />
      
      <div className="h-64 w-full rounded-md border relative">
        {error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-2">
              <AlertTriangle className="h-8 w-8 mx-auto text-yellow-500" />
              <p className="text-sm text-gray-500">{error}</p>
            </div>
          </div>
        ) : (
          <div id="map" className="h-full w-full rounded-md" />
        )}
      </div>
      <p className="text-sm text-gray-500">
        Click to place a marker or drag the existing marker to adjust the location
      </p>
    </div>
  );
};

export default LocationPicker;