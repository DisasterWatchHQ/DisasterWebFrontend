"use client";

import { useEffect, useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  LayersIcon,
  Filter,
  AlertTriangle,
  Locate,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Keep libraries constant
const libraries = ['places'];

const SRI_LANKA_BOUNDS = {
  north: 9.83,
  south: 5.92,
  west: 79.52,
  east: 81.88,
};

const SRI_LANKA_CENTER = { lat: 7.8731, lng: 80.7718 };

const disasterTypes = [
  { id: "all", name: "All Types" },
  { id: "earthquake", name: "Earthquake" },
  { id: "flood", name: "Flood" },
  { id: "fire", name: "Fire" },
  { id: "hurricane", name: "Hurricane" },
];

const sampleDisasters = [
  {
    id: 1,
    position: { lat: 6.9271, lng: 79.8612 },
    title: "Flood Warning",
    description: "Severe flooding in Colombo area",
    type: "flood",
    severity: "high",
    timestamp: new Date().toISOString(),
  },
  {
    id: 2,
    position: { lat: 7.2906, lng: 80.6337 },
    title: "Landslide Risk",
    description: "Potential landslide warning",
    type: "flood",
    severity: "medium",
    timestamp: new Date().toISOString(),
  },
];

const containerStyle = {
  width: '100%',
  height: '600px',
  borderRadius: '0.5rem'
};

export default function Map() {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  const [center, setCenter] = useState(SRI_LANKA_CENTER);
  const [zoom, setZoom] = useState(8);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [disasters, setDisasters] = useState(sampleDisasters);
  const [selectedType, setSelectedType] = useState("all");
  const [userLocation, setUserLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  const mapOptions = {
    mapTypeControl: true,
    streetViewControl: true,
    fullscreenControl: true,
    restriction: {
      latLngBounds: SRI_LANKA_BOUNDS,
      strictBounds: false,
    },
    minZoom: 7,
    maxZoom: 18,
  };

  const getUserLocation = () => {
    setIsLoading(true);
    setLocationError("");
  
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      setIsLoading(false);
      return;
    }
  
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        console.log("User location obtained:", location);
        setUserLocation(location);
        setCenter(location);
        setZoom(12);
        setIsLoading(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        let errorMessage;
        switch (error.code) {
          case 1:
            errorMessage = "Permission denied. Please enable location access.";
            break;
          case 2:
            errorMessage = "Position unavailable. Please try again later.";
            break;
          case 3:
            errorMessage = "Request timed out. Retry or ensure location services are active.";
            break;
          default:
            errorMessage = "An unknown error occurred.";
        }
        setLocationError(errorMessage);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true, // Or try false for faster results
        timeout: 15000, // Adjust timeout
        maximumAge: 0,
      }
    );
  };


  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      if (!window.google) return;

      const geocoder = new window.google.maps.Geocoder();
      const response = await new Promise((resolve, reject) => {
        geocoder.geocode(
          { 
            address: `${searchQuery}, Sri Lanka`,
            componentRestrictions: { country: 'LK' }
          }, 
          (results, status) => {
            if (status === "OK") {
              resolve(results);
            } else {
              reject(status);
            }
          }
        );
      });

      if (response[0]) {
        const { location } = response[0].geometry;
        setCenter({ lat: location.lat(), lng: location.lng() });
        setZoom(14);
      }
    } catch (error) {
      console.error("Search error:", error);
      setLocationError("Location not found");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDisasters = disasters.filter(
    (disaster) => selectedType === "all" || disaster.type === selectedType
  );

  if (loadError) {
    return (
      <div className="container py-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-500">
              Error loading Google Maps
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="container py-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Loading map...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Sri Lanka Disaster Map</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={getUserLocation}
                disabled={isLoading}
              >
                <Locate className="h-4 w-4 mr-2" />
                {isLoading ? "Loading..." : "My Location"}
              </Button>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  {disasterTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {locationError && (
            <div className="mt-2 text-red-500 text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              {locationError}
            </div>
          )}
          <div className="flex gap-2 mt-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search location in Sri Lanka..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  disabled={isLoading}
                />
              </div>
            </div>
            <Button
              onClick={handleSearch}
              disabled={isLoading || !searchQuery.trim()}
            >
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={zoom}
            options={mapOptions}
          >
            {userLocation && (
              <Marker
                position={userLocation}
                label={{
                  text: "You",
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: "bold"
                }}
              />
            )}

            {filteredDisasters.map((disaster) => (
              <Marker
                key={disaster.id}
                position={disaster.position}
                label={{
                  text: disaster.title,
                  color: "#ffffff",
                  fontSize: "14px"
                }}
                onClick={() => setSelectedMarker(disaster)}
              />
            ))}

            {selectedMarker && (
              <InfoWindow
                position={selectedMarker.position}
                onCloseClick={() => setSelectedMarker(null)}
              >
                <div>
                  <h3 className="font-bold">{selectedMarker.title}</h3>
                  <p>{selectedMarker.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedMarker.timestamp).toLocaleString()}
                  </p>
                  <div className="mt-2">
                    <Button size="sm">View Details</Button>
                  </div>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </CardContent>
      </Card>
    </div>
  );
}