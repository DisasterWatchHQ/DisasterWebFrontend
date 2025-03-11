import { useState, useEffect } from "react";
import { reportApi } from "@/lib/reportApi";
import { warningApi } from "@/lib/warningApi";

export const useLiveUpdates = () => {
  const [updates, setUpdates] = useState([]);
  const [activeWarnings, setActiveWarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUpdates = async () => {
    try {
      setLoading(true);
      const [warningsResponse, updatesResponse] = await Promise.all([
        warningApi.public.getActiveWarnings(),
        reportApi.public.getFeedUpdates(30),
      ]);

      if (updatesResponse.success) {
        setUpdates(updatesResponse.data.updates);
      }

      if (warningsResponse.success) {
        setActiveWarnings(warningsResponse.data.warnings);
      }
    } catch (error) {
      console.error("Error fetching updates:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdates();
    const interval = setInterval(fetchUpdates, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return { updates, activeWarnings, loading, error };
};
