import { useState, useEffect } from 'react';
import axios from 'axios';

export const useLiveUpdates = () => {
  const [updates, setUpdates] = useState([]);
  const [activeWarnings, setActiveWarnings] = useState([]);

  const fetchUpdates = async () => {
    try {
      // Using the new /updates endpoint
      const response = await axios.get('http://localhost:5000/api/userReport/updates', {
        params: {
          verified_only: true,
          limit: 5
        }
      });

      setActiveWarnings(response.data.data.activeWarnings || []);
      setUpdates(response.data.data.updates.map(update => ({
        message: `${update.title} - ${update.location}`,
        timestamp: update.date
      })));
    } catch (error) {
      console.error('Error fetching updates:', error);
    }
  };

  useEffect(() => {
    fetchUpdates();
    const interval = setInterval(fetchUpdates, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return { updates, activeWarnings };
};