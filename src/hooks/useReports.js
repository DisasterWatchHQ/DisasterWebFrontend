import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export const useReports = () => {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    disaster_category: "",
    verified_only: false,
    district: "",
  });
  
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);

      const queryParams = new URLSearchParams({
        page: filters.page.toString(),
        limit: filters.limit.toString(),
        verified_only: filters.verified_only.toString(),
      });

      if (filters.disaster_category) {
        queryParams.append("disaster_category", filters.disaster_category);
      }

      if (filters.district && filters.district !== "all") {
        queryParams.append("district", filters.district);
      }

      const [reportsResponse, statsResponse] = await Promise.all([
        axios.get(
          `${API_BASE_URL}/userReport/reports?${queryParams}`,
        ),
        axios.get(`${API_BASE_URL}/userReport/feedstats`),
      ]);

      const mappedReports = reportsResponse.data.data.reports.map((report) => ({
        id: report.id || report._id,
        title: report.title,
        description: report.description,
        disaster_category: report.disaster_category,
        location: report.location,
        district: report.location?.address?.district,
        timestamp: report.date_time,
        images: report.images || [],
        verified: report.verification_status === "verified",
        verification_status: report.verification_status,
        severity: report.verification?.severity || "low",
      }));

      setReports(mappedReports);
      setStats(statsResponse.data.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters, API_BASE_URL]);

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
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
    refreshReports: fetchReports,
  };
};