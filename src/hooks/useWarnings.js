import { useState, useEffect } from 'react';

export function useWarnings() {
  const [warnings, setWarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWarnings = async () => {
      try {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/warning/nearby?latitude=${latitude}&longitude=${longitude}`
            );
            
            if (!response.ok) throw new Error('Failed to fetch warnings');
            
            const data = await response.json();
            setWarnings(data.data);
          }, async (error) => {
            // Fallback to fetching all active warnings if location is not available
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/warning/active`
            );
            
            if (!response.ok) throw new Error('Failed to fetch warnings');
            
            const data = await response.json();
            setWarnings(data.data);
          });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWarnings();
  }, []);

  return { warnings, loading, error };
}