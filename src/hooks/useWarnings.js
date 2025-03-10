import { useState, useEffect } from "react";
import apiClient from '@/lib/api';

export function useWarnings() {
  const [warnings, setWarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    const fetchWarnings = async () => {
      try {
        setLoading(true);
        setError(null);
        setLocationError(null);

        if ("geolocation" in navigator) {
          try {
            const position = await new Promise((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, {
                timeout: 10000,
                maximumAge: 5000,
                enableHighAccuracy: true
              });
            });

            const { latitude, longitude } = position.coords;
            const response = await apiClient.get('/warnings/location', {
              params: {
                latitude,
                longitude,
                status: 'active'
              }
            });

            if (response.data.success) {
              setWarnings(response.data.warnings);
            } else {
              throw new Error(response.data.message || "Failed to fetch warnings");
            }
          } catch (geoError) {
            setLocationError(
              geoError.code === 1
                ? "Location access denied. Please enable location services to see local warnings."
                : "Could not determine your location. Showing all active warnings instead."
            );
            
            // Fallback to active warnings if geolocation fails
            const response = await apiClient.get('/warnings/active');
            if (response.data.success) {
              setWarnings(response.data.warnings);
            } else {
              throw new Error(response.data.message || "Failed to fetch warnings");
            }
          }
        } else {
          setLocationError("Your browser doesn't support geolocation. Showing all active warnings.");
          const response = await apiClient.get('/warnings/active');
          if (response.data.success) {
            setWarnings(response.data.warnings);
          } else {
            throw new Error(response.data.message || "Failed to fetch warnings");
          }
        }
      } catch (err) {
        setError(err.message);
        setWarnings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWarnings();

    // Set up polling for warnings every 30 seconds
    const pollInterval = setInterval(fetchWarnings, 30000);

    return () => clearInterval(pollInterval);
  }, []);

  return { 
    warnings, 
    loading, 
    error,
    locationError
  };
}
