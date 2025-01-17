import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const useReports = () => {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    disaster_category: '',
    verified_only: false
  });

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      
      // Convert filters to query parameters
      const queryParams = new URLSearchParams({
        page: filters.page.toString(),
        limit: filters.limit.toString(),
        verified_only: filters.verified_only.toString()
      });

      // Only add disaster_category if it's not empty
      if (filters.disaster_category) {
        queryParams.append('disaster_category', filters.disaster_category);
      }

      const [reportsResponse, statsResponse] = await Promise.all([
        axios.get(`http://localhost:5000/api/userReport/reports?${queryParams}`),
        axios.get('http://localhost:5000/api/userReport/feedstats')
      ]);

      // Properly map the response data
      const mappedReports = reportsResponse.data.data.reports.map(report => ({
        id: report.id || report._id,
        title: report.title,
        description: report.description,
        disaster_category: report.disaster_category,
        location: report.location,
        timestamp: report.date_time,
        images: report.images || [],
        verified: report.verification_status === "verified",
        verification_status: report.verification_status,
        severity: report.verification?.severity || 'low'
      }));

      setReports(mappedReports);
      setStats(statsResponse.data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return {
    reports,
    stats,
    loading,
    error,
    filters,
    updateFilters,
    refreshReports: fetchReports
  };
};