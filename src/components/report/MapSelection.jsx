import React, { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import Script from "next/script";

// Sri Lanka bounds and center coordinates
const SRI_LANKA_BOUNDS = {
  north: 9.835556,
  south: 5.916667,
  west: 79.516667,
  east: 81.879167,
};

const SRI_LANKA_CENTER = {
  lat: 7.873054,
  lng: 80.771797,
};

const DEFAULT_ZOOM = 8;

export const MapPicker = ({ onLocationSelect }) => {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [geocoder, setGeocoder] = useState(null);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleScriptLoad = () => {
    setIsLoaded(true);
  };

  useEffect(() => {
    if (!isLoaded || !window.google) return;

    // Initialize map
    const initMap = () => {
      const mapInstance = new window.google.maps.Map(
        document.getElementById("picker-map"),
        {
          center: SRI_LANKA_CENTER,
          zoom: DEFAULT_ZOOM,
          streetViewControl: false,
          mapTypeControl: true,
          mapTypeId: "terrain",
          mapTypeControlOptions: {
            style: window.google.maps.MapTypeControlStyle.DROPDOWN_MENU,
            position: window.google.maps.ControlPosition.TOP_RIGHT,
          },
          restriction: {
            latLngBounds: SRI_LANKA_BOUNDS,
            strictBounds: true,
          },
        },
      );

      setMap(mapInstance);
      setGeocoder(new window.google.maps.Geocoder());

      // Add click listener
      mapInstance.addListener("click", async (e) => {
        const latitude = e.latLng.lat();
        const longitude = e.latLng.lng();

        if (!isWithinSriLanka(latitude, longitude)) {
          setError("Please select a location within Sri Lanka");
          return;
        }

        if (marker) marker.setMap(null);

        const newMarker = new window.google.maps.Marker({
          position: { lat: latitude, lng: longitude },
          map: mapInstance,
          draggable: true,
          animation: window.google.maps.Animation.DROP,
        });

        setMarker(newMarker);

        try {
          const addressResult = await getAddressDetails({
            lat: latitude,
            lng: longitude,
          });

          onLocationSelect({
            latitude,
            longitude,
            address: addressResult || {
              city: "Unknown",
              district: "Unknown",
              province: "Unknown",
              details: `${latitude}, ${longitude}`,
            },
          });
        } catch (error) {
          console.error("Geocoding failed:", error);
          setError("Failed to get location details. Please try again.");
        }
      });

      // Add search box
      const input = document.createElement("input");
      input.className = "map-search-box";
      input.placeholder = "Search for a location in Sri Lanka";
      mapInstance.controls[window.google.maps.ControlPosition.TOP_LEFT].push(
        input,
      );

      // Initialize SearchBox
      if (window.google.maps.places) {
        const searchBox = new window.google.maps.places.SearchBox(input);
        handleSearchBox(searchBox, mapInstance);
      }
    };

    initMap();
  }, [isLoaded]);

  const handleMapClick = async (e) => {
    const latitude = e.latLng.lat();
    const longitude = e.latLng.lng();

    if (!isWithinSriLanka(latitude, longitude)) {
      setError("Please select a location within Sri Lanka");
      return;
    }

    setError(null);
    updateMarker(latitude, longitude);
  };

  const handleSearchBox = (searchBox, mapInstance) => {
    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();
      if (places.length === 0) return;

      const place = places[0];
      if (!place.geometry || !place.geometry.location) return;

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      if (!isWithinSriLanka(lat, lng)) {
        setError("Please select a location within Sri Lanka");
        return;
      }

      mapInstance.setCenter(place.geometry.location);
      mapInstance.setZoom(15);
      updateMarker(lat, lng);
    });
  };

  const isWithinSriLanka = (lat, lng) => {
    return (
      lat >= SRI_LANKA_BOUNDS.south &&
      lat <= SRI_LANKA_BOUNDS.north &&
      lng >= SRI_LANKA_BOUNDS.west &&
      lng <= SRI_LANKA_BOUNDS.east
    );
  };

  const updateMarker = async (latitude, longitude) => {
    if (marker) marker.setMap(null);

    const newMarker = new window.google.maps.Marker({
      position: { lat: latitude, lng: longitude },
      map: map,
      draggable: true,
      animation: window.google.maps.Animation.DROP,
    });

    setMarker(newMarker);

    try {
      const result = await getAddressDetails({ lat: latitude, lng: longitude });
      onLocationSelect({
        latitude,
        longitude,
        address: result,
      });
    } catch (error) {
      console.error("Geocoding failed:", error);
      setError("Failed to get location details. Please try again.");
    }

    newMarker.addListener("dragend", async () => {
      const position = newMarker.getPosition();
      const lat = position.lat();
      const lng = position.lng();

      if (!isWithinSriLanka(lat, lng)) {
        setError("Please keep the marker within Sri Lanka");
        newMarker.setPosition({ lat: latitude, lng: longitude });
        return;
      }

      setError(null);

      try {
        const result = await getAddressDetails({ lat, lng });
        onLocationSelect({
          latitude: lat,
          longitude: lng,
          address: result,
        });
      } catch (error) {
        console.error("Geocoding failed:", error);
        setError("Failed to get location details. Please try again.");
      }
    });
  };

  const getAddressDetails = async (latLng) => {
    if (!geocoder) return null;

    try {
      const response = await geocoder.geocode({ location: latLng });

      if (response.results[0]) {
        const result = response.results[0];
        const addressComponents = result.address_components;

        // Initialize with default values
        const address = {
          city: "",
          district: "",
          province: "",
          details: result.formatted_address,
        };

        // Map address components for Sri Lanka
        addressComponents.forEach((component) => {
          const types = component.types;

          // City: Usually 'locality' or 'administrative_area_level_2'
          if (types.includes("locality")) {
            address.city = component.long_name;
          }
          // District: Usually 'administrative_area_level_2'
          else if (types.includes("administrative_area_level_2")) {
            address.district = component.long_name;
          }
          // Province: Usually 'administrative_area_level_1'
          else if (types.includes("administrative_area_level_1")) {
            address.province = component.long_name;
          }
          // Fallback for city if locality not found
          else if (!address.city && types.includes("sublocality_level_1")) {
            address.city = component.long_name;
          }
        });

        // Fallbacks if components weren't found
        if (!address.city) address.city = address.district;
        if (!address.district) address.district = address.province;

        return address;
      }
      return null;
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  };

  return (
    <div className="space-y-2">
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        onLoad={handleScriptLoad}
      />
      <div id="picker-map" className="h-64 w-full rounded-md border" />
      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4" />
          {error}
        </div>
      )}
      <p className="text-sm text-muted-foreground">
        Click on the map to select location or use the search box to find a
        specific place
      </p>
      <style jsx>{`
        .map-search-box {
          margin: 10px;
          padding: 8px;
          border-radius: 4px;
          border: 1px solid #ccc;
          width: 300px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};
