"use client";

import { useEffect, useRef, useState } from "react";
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
import Image from "next/image";

const DEFAULT_MARKER_ICON = "/markers/default.png";

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
    position: { lat: 37.7749, lng: -122.4194 },
    title: "Earthquake",
    description: "Magnitude 5.2",
    type: "earthquake",
    severity: "high",
    timestamp: new Date().toISOString(),
  },
  {
    id: 2,
    position: { lat: 34.0522, lng: -118.2437 },
    title: "Flood Warning",
    description: "Severe flooding in the area",
    type: "flood",
    severity: "medium",
    timestamp: new Date().toISOString(),
  },
  // Add more sample disasters here
];

export default function Map() {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const [map, setMap] = useState(null);
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [zoom, setZoom] = useState(2);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [disasters, setDisasters] = useState(sampleDisasters);
  const [selectedType, setSelectedType] = useState("all");
  const [userLocation, setUserLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch real disaster data from your API
    const fetchDisasters = async () => {
      try {
        // Replace with actual API call
        setDisasters(sampleDisasters);
      } catch (error) {
        console.error("Error fetching disaster data:", error);
      }
    };

    fetchDisasters();
  }, []);

  const getUserLocation = () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          setCenter(location);
          setZoom(12);
          setIsLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLoading(false);
        },
      );
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      if (!window.google) return;

      const geocoder = new window.google.maps.Geocoder();
      const response = await new Promise((resolve, reject) => {
        geocoder.geocode({ address: searchQuery }, (results, status) => {
          if (status === "OK") {
            resolve(results);
          } else {
            reject(status);
          }
        });
      });

      if (response[0]) {
        const { location } = response[0].geometry;
        setCenter({ lat: location.lat(), lng: location.lng() });
        setZoom(12);
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDisasters = disasters.filter(
    (disaster) => selectedType === "all" || disaster.type === selectedType,
  );

  const mapOptions = {
    mapTypeControl: true,
    streetViewControl: true,
    fullscreenControl: true,
    styles: [
      // Add custom map styles here if needed
    ],
  };

  if (loadError) {
    return (
      <div className="container py-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-500">
              Error loading Google Maps. Please try again later.
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
            <CardTitle>Disaster Location Map</CardTitle>
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
          <div className="flex gap-2 mt-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search location..."
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
            mapContainerClassName="h-[600px] w-full rounded-md"
            center={center}
            zoom={zoom}
            options={mapOptions}
            onLoad={setMap}
          >
            {userLocation && (
              <Marker
                position={userLocation}
                icon={{
                  url: "/user-location.png",
                  scaledSize: new google.maps.Size(30, 30),
                }}
              />
            )}

            {filteredDisasters.map((disaster) => (
              <Marker
                key={disaster.id}
                position={disaster.position}
                icon={{
                  url: `/markers/${disaster.type}.png`,
                  scaledSize: new google.maps.Size(30, 30),
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

          {/* <div className="absolute bottom-4 right-4 bg-white p-4 rounded-md shadow-md">
            <h4 className="font-semibold mb-2">Legend</h4>
            {disasterTypes.map(type => type.id !== 'all' && (
              <div key={type.id} className="flex items-center gap-2">
                <div className="relative w-4 h-4">
                  <Image
                    src={`/markers/${type.id}.png`}
                    alt={type.name}
                    width={16}
                    height={16}
                    priority
                  />
                </div>
                <span>{type.name}</span>
              </div>
            ))}
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
}
