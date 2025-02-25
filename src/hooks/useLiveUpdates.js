import { useState, useEffect } from 'react';
import axios from 'axios';

export const useLiveUpdates = () => {
  const [updates, setUpdates] = useState([]);
  const [activeWarnings, setActiveWarnings] = useState([]);

  const fetchUpdates = async () => {
    try {
      // Fetch reports updates
      const updatesResponse = await axios.get('http://localhost:5000/api/userReport/updates', {
        params: {
          verified_only: true,
          limit: 5
        }
      });
      
      setUpdates(updatesResponse.data.data.updates.map(update => ({
        message: `${update.title} - ${update.location}`,
        timestamp: update.date
      })));
      
      // Fetch active warnings with all needed fields
      const warningsResponse = await axios.get('http://localhost:5000/api/warning/active');
      if (warningsResponse.data.success) {
        setActiveWarnings(warningsResponse.data.data.map(warning => ({
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
          response_actions: warning.response_actions
        })));
      }
    } catch (error) {
      console.error('Error fetching updates and warnings:', error);
    }
  };

  useEffect(() => {
    fetchUpdates();
    const interval = setInterval(fetchUpdates, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return { updates, activeWarnings };
};