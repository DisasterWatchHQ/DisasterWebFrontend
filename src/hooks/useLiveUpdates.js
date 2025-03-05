import { useState, useEffect } from "react";
import axios from "axios";
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

export const useLiveUpdates = () => {
  const [updates, setUpdates] = useState([]);
  const [activeWarnings, setActiveWarnings] = useState([]);

  const fetchUpdates = async () => {
    try {
      const updatesResponse = await axios.get(
        `${API_BASE_URL}/userReport/updates`,
        {
          params: {
            verified_only: true,
            limit: 5,
          },
        },
      );

      setUpdates(
        updatesResponse.data.data.updates.map((update) => ({
          message: `${update.title} - ${update.location}`,
          timestamp: update.date,
        })),
      );

      const warningsResponse = await axios.get(
        `${API_BASE_URL}/warning/active`,
      );
      if (warningsResponse.data.success) {
        setActiveWarnings(
          warningsResponse.data.data.map((warning) => ({
            id: warning._id,
            title: warning.title,
            description: warning.description,
            disaster_category: warning.disaster_category,
            severity: warning.severity,
            affected_locations: warning.affected_locations,
            status: warning.status,
            created_at: warning.created_at,
            expected_duration: warning.expected_duration,
            updates: warning.updates,
            created_by: warning.created_by,
            response_actions: warning.response_actions,
          })),
        );
      }
    } catch (error) {
      console.error("Error fetching updates and warnings:", error);
    }
  };

  useEffect(() => {
    fetchUpdates();
    const interval = setInterval(fetchUpdates, 30000);
    return () => clearInterval(interval);
  }, []);

  return { updates, activeWarnings };
};
