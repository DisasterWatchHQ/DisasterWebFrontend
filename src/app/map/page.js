"use client";
import { useState, useEffect } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
  Circle,
} from "@react-google-maps/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, AlertTriangle, Locate } from "lucide-react";
import { warningApi } from "@/lib/warningApi";
import { Badge } from "@/components/ui/badge";

const libraries = ["places"];

const SRI_LANKA_BOUNDS = {
  north: 9.83,
  south: 5.92,
  west: 79.52,
  east: 81.88,
};

const SRI_LANKA_CENTER = { lat: 7.8731, lng: 80.7718 };

const SEVERITY_COLORS = {
  low: "#3b82f6", // blue
  medium: "#eab308", // yellow
  high: "#f97316", // orange
  critical: "#ef4444", // red
};

const SEVERITY_RADIUS = {
  low: 1000, // 1km
  medium: 2000, // 2km
  high: 5000, // 5km
  critical: 10000, // 10km
};

const containerStyle = {
  width: "100%",
  height: "600px",
  borderRadius: "0.5rem",
};

export default function Map() {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  const [center, setCenter] = useState(SRI_LANKA_CENTER);
  const [zoom, setZoom] = useState(8);
  const [selectedWarning, setSelectedWarning] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeWarnings, setActiveWarnings] = useState([]);
  const [isWarningsLoading, setIsWarningsLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    fetchActiveWarnings();
    const interval = setInterval(fetchActiveWarnings, 300000);
    return () => clearInterval(interval);
  }, []);

  const fetchActiveWarnings = async () => {
    try {
      setIsWarningsLoading(true);
      const response = await warningApi.public.getActiveWarnings();
      const warnings = response.data || [];
      const validWarnings = warnings.filter((warning) => {
        const location = warning.affected_locations?.[0];
        if (!location?.coordinates) {
          console.warn(`Warning ${warning._id} has no valid coordinates`);
          return false;
        }
        const { latitude, longitude } = location.coordinates;
        return !isNaN(latitude) && !isNaN(longitude);
      });

      setActiveWarnings(validWarnings);
    } catch (error) {
      console.error("Error fetching warnings:", error);
      setLocationError("Failed to fetch active warnings");
      setActiveWarnings([]);
    } finally {
      setIsWarningsLoading(false);
    }
  };

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
        setUserLocation(location);
        setCenter(location);
        setZoom(12);
        setIsLoading(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setLocationError("Failed to get your location");
        setIsLoading(false);
      },
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
            componentRestrictions: { country: "LK" },
          },
          (results, status) => {
            if (status === "OK") {
              resolve(results);
            } else {
              reject(status);
            }
          },
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

  const renderWarningInfo = (warning) => (
    <div className="p-2 max-w-sm">
      <h3 className="font-bold text-lg">{warning.title}</h3>
      <div className="flex gap-2 my-2">
        <Badge>{warning.disaster_category}</Badge>
        <Badge
          variant={
            warning.severity === "critical"
              ? "destructive"
              : warning.severity === "high"
                ? "warning"
                : "default"
          }
        >
          {warning.severity}
        </Badge>
      </div>
      <p className="text-sm mb-2">{warning.description}</p>
      <p className="text-xs text-muted-foreground">
        Created:{" "}
        {new Date(warning._id.toString().substring(0, 8)).toLocaleString()}
      </p>
      {warning.updates?.length > 0 && (
        <div className="mt-2 border-t pt-2">
          <p className="text-sm font-medium">Latest Update:</p>
          <p className="text-sm">
            {warning.updates[warning.updates.length - 1].update_text}
          </p>
        </div>
      )}
    </div>
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
            <CardTitle>Active Disaster Warnings</CardTitle>
            <Button
              variant="outline"
              onClick={getUserLocation}
              disabled={isLoading}
            >
              <Locate className="h-4 w-4 mr-2" />
              {isLoading ? "Loading..." : "My Location"}
            </Button>
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
                  fontWeight: "bold",
                }}
              />
            )}

            {!isWarningsLoading &&
              Array.isArray(activeWarnings) &&
              activeWarnings.length > 0 &&
              activeWarnings.map((warning) => {
                if (!warning?.affected_locations?.[0]?.coordinates) return null;

                const position = {
                  lat: parseFloat(
                    warning.affected_locations[0].coordinates.latitude,
                  ),
                  lng: parseFloat(
                    warning.affected_locations[0].coordinates.longitude,
                  ),
                };

                if (isNaN(position.lat) || isNaN(position.lng)) return null;

                return (
                  <div key={warning.id || warning._id}>
                    <Marker
                      position={position}
                      onClick={() => setSelectedWarning(warning)}
                      icon={{
                        path: google.maps.SymbolPath.CIRCLE,
                        fillColor:
                          SEVERITY_COLORS[warning.severity] ||
                          SEVERITY_COLORS.medium,
                        fillOpacity: 1,
                        strokeWeight: 1,
                        strokeColor: "#000000",
                        scale: 7,
                      }}
                    />
                    <Circle
                      center={position}
                      radius={
                        SEVERITY_RADIUS[warning.severity] ||
                        SEVERITY_RADIUS.medium
                      }
                      options={{
                        fillColor: SEVERITY_COLORS[warning.severity],
                        fillOpacity: 0.2,
                        strokeColor: SEVERITY_COLORS[warning.severity],
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                      }}
                    />
                  </div>
                );
              })}

            {selectedWarning &&
              selectedWarning.affected_locations?.[0]?.coordinates && (
                <InfoWindow
                  position={{
                    lat: selectedWarning.affected_locations[0].coordinates
                      .latitude,
                    lng: selectedWarning.affected_locations[0].coordinates
                      .longitude,
                  }}
                  onCloseClick={() => setSelectedWarning(null)}
                >
                  {renderWarningInfo(selectedWarning)}
                </InfoWindow>
              )}
          </GoogleMap>

          {isWarningsLoading && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background/80 p-4 rounded-md">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span>Loading warnings...</span>
              </div>
            </div>
          )}

          {!isWarningsLoading &&
            (!Array.isArray(activeWarnings) || activeWarnings.length === 0) && (
              <div className="text-center py-4 text-muted-foreground">
                No active warnings found
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
