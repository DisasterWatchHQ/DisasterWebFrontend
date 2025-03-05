import React, { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import Script from "next/script";

export const MapPicker = ({ onLocationSelect }) => {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [geocoder, setGeocoder] = useState(null);

  useEffect(() => {
      if (!window.google) return;

      const mapInstance = new window.google.maps.Map(document.getElementById('picker-map'), {
        center: { lat: 0, lng: 0 }, 
        zoom: 8,
        streetViewControl: false,
        mapTypeControl: false
      });
      
      setMap(mapInstance);
      setGeocoder(new window.google.maps.Geocoder());

      mapInstance.addListener('click', async (e) => {
        const latitude = e.latLng.lat();
        const longitude = e.latLng.lng();
        if (marker) marker.setMap(null);

        const newMarker = new window.google.maps.Marker({
          position: { lat: latitude, lng: longitude },
          map: mapInstance,
          draggable: true
        });
        
        setMarker(newMarker);

        try {
          const result = await getAddressDetails({ lat: latitude, lng: longitude });
          onLocationSelect({
            latitude,
            longitude,
            address: result
          });
        } catch (error) {
          console.error('Geocoding failed:', error);
        }

        newMarker.addListener('dragend', async () => {
          const position = newMarker.getPosition();
          const lat = position.lat();
          const lng = position.lng();
          
          try {
            const result = await getAddressDetails({ lat, lng });
            onLocationSelect({
              latitude: lat,
              longitude: lng,
              address: result
            });
          } catch (error) {
            console.error('Geocoding failed:', error);
          }
        });
      });
    }, []);
  
    const getAddressDetails = async (latLng) => {
      if (!geocoder) return null;
  
      const response = await geocoder.geocode({ location: latLng });
      
      if (response.results[0]) {
        const result = response.results[0];
        const addressComponents = result.address_components;

        const address = {
          city: '',
          district: '',
          province: '',
          details: result.formatted_address
        };

        addressComponents.forEach(component => {
          const types = component.types;
          
          if (types.includes('locality') || types.includes('administrative_area_level_2')) {
            address.city = component.long_name;
          }
          if (types.includes('sublocality') || types.includes('administrative_area_level_3')) {
            address.district = component.long_name;
          }
          if (types.includes('administrative_area_level_1')) {
            address.province = component.long_name;
          }
        });
  
        return address;
      }
      
      throw new Error('No results found');
    };
  
    return (
      <div className="space-y-2">
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
        />
        <div id="picker-map" className="h-64 w-full rounded-md border" />
        <p className="text-sm text-gray-500">
          Click on the map to select location or drag the marker to adjust
        </p>
      </div>
    );
  };

export const LocationsDisplay = ({ locations }) => {
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (!window.google || !locations?.length) return;

    const mapInstance = new window.google.maps.Map(
      document.getElementById("display-map"),
      {
        center: {
          lat: locations[0].latitude,
          lng: locations[0].longitude,
        },
        zoom: 8,
      },
    );

    setMap(mapInstance);

    const bounds = new window.google.maps.LatLngBounds();

    locations.forEach((location) => {
      const marker = new window.google.maps.Marker({
        position: {
          lat: location.latitude,
          lng: location.longitude,
        },
        map: mapInstance,
        title: location.address?.details || "Warning Location",
      });

      bounds.extend(marker.getPosition());
    });

    mapInstance.fitBounds(bounds);
  }, [locations]);

  return (
    <div className="space-y-2">
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
      />
      <div id="display-map" className="h-64 w-full rounded-md border" />
    </div>
  );
};
