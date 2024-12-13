"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Map() {
  const mapRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    let map;

    const initializeMap = async () => {
      try {
        const L = (await import("leaflet")).default;

        // Only create a new map if one doesn't exist
        if (mapRef.current && !mapInstanceRef.current) {
          // Initialize the map
          map = L.map(mapRef.current).setView([0, 0], 2);
          mapInstanceRef.current = map;

          // Add the tile layer
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
          }).addTo(map);

          // Sample disaster markers (you can replace these with real data)
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
            // Add more disaster locations as needed
          ];

          // Custom icons for different disaster types
          const icons = {
            earthquake: L.icon({
              iconUrl: "/earthquake-icon.png", // Add your icon files
              iconSize: [25, 25],
            }),
            flood: L.icon({
              iconUrl: "/flood-icon.png",
              iconSize: [25, 25],
            }),
            // Add more disaster type icons
          };

          // Add markers for each disaster
          disasters.forEach((disaster) => {
            L.marker(disaster.position, {
              icon: icons[disaster.type] || L.Icon.Default(),
            })
              .bindPopup(
                `<b>${disaster.title}</b><br>${disaster.description}`
              )
              .addTo(map);
          });

          // Add legend
          const legend = L.control({ position: "bottomright" });
          legend.onAdd = function () {
            const div = L.DomUtil.create("div", "legend");
            div.innerHTML = `
              <div style="background: white; padding: 10px; border-radius: 5px; border: 1px solid #ccc;">
                <h4>Disaster Types</h4>
                <div>🔴 Earthquake</div>
                <div>🔵 Flood</div>
              </div>
            `;
            return div;
          };
          legend.addTo(map);

          // Fix the map container size issue
          setTimeout(() => {
            map.invalidateSize();
          }, 100);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error loading map:", error);
        setLoading(false);
      }
    };

    initializeMap();

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