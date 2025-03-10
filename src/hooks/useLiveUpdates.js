import { useState, useEffect } from "react";
import { reportApi } from '@/lib/reportApi';

export const useLiveUpdates = () => {
  const [updates, setUpdates] = useState([]);
  const [activeWarnings, setActiveWarnings] = useState([]);

  const fetchUpdates = async () => {
    try {
      const [updatesResponse, feedStatsResponse] = await Promise.all([
        reportApi.getFeedUpdates(30), // Get last 30 minutes of updates
        reportApi.getFeedStats()
      ]);

      if (updatesResponse.success) {
        setUpdates(updatesResponse.data.updates);
      }

      if (feedStatsResponse.success) {
        // Handle active warnings from feed stats
        const activeWarnings = feedStatsResponse.data.warningStats
          .filter(w => w.status === 'active')
          .map(warning => ({
            id: warning._id,
            title: warning.title,
            disaster_category: warning.disaster_category,
            severity: warning.severity,
            affected_locations: warning.affected_locations,
            status: warning.status,
            created_at: warning.created_at
          }));

        setActiveWarnings(activeWarnings);
      }
    } catch (error) {
      console.error("Error fetching updates:", error);
    }
  };

  useEffect(() => {
    fetchUpdates();
    const interval = setInterval(fetchUpdates, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return { updates, activeWarnings };
};