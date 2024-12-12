"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Import Leaflet CSS
import "leaflet/dist/leaflet.css";

export default function Map() {
  const mapRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    // Dynamically import Leaflet only on client side
    const L = require("leaflet");

    if (mapRef.current && !mapInstanceRef.current) {
      // Initialize the map
      const map = L.map(mapRef.current).setView([0, 0], 2);
      mapInstanceRef.current = map;

      // Add the tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Sample disaster markers
      const disasters = [
        {
          position: [37.7749, -122.4194],
          title: "Earthquake",
          description: "Magnitude 5.2",
          type: "earthquake",
        },
        {
          position: [35.6762, 139.6503],
          title: "Flood",
          description: "Severe flooding",
          type: "flood",
        },
      ];

      // Add default markers (since we might not have custom icons yet)
      disasters.forEach((disaster) => {
        L.marker(disaster.position)
          .bindPopup(`<b>${disaster.title}</b><br>${disaster.description}`)
          .addTo(map);
      });

      // Fix map container size issue
      setTimeout(() => {
        map.invalidateSize();
      }, 100);

      setLoading(false);
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="container py-6">
      <Card>
        <CardHeader>
          <CardTitle>Disaster Location Map</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="flex items-center justify-center h-[500px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
          <div
            ref={mapRef}
            className="h-[500px] w-full rounded-md"
            style={{ display: loading ? "none" : "block" }}
          />
        </CardContent>
      </Card>
    </div>
  );
}