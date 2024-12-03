// components/Map.js
import { useEffect, useRef } from "react";

// Replace with your mapping library (e.g., leaflet or mapbox)
export default function Map() {
  const mapRef = useRef(null);

  useEffect(() => {
    // Initialize map here
    const map = new window.L.Map(mapRef.current);
    map.setView([51.505, -0.09], 13); // Set default location
    // Add a tile layer (you can change this to your preferred provider)
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
  }, []);

  return <div ref={mapRef} style={{ height: "500px", width: "100%" }} />;
}
