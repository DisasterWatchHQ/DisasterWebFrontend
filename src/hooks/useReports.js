import { useState, useEffect, useCallback } from "react";
import { reportApi } from "@/lib/reportApi";

export const useReports = (requireAuth = false) => {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    disaster_category: "",
    status: "active",
    district: "",
    verification_status: "",
    verified_only: false,
  });

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (requireAuth) {
        // Fetch data for authenticated users
        const [
          reportsResponse,
          statsResponse,
          verificationStatsResponse,
          analyticsResponse,
        ] = await Promise.all([
          reportApi.protected.getVerifiedReports(filters),
          reportApi.protected.getReportStats(),
          reportApi.protected.getVerificationStats(),
          reportApi.protected.getReportAnalytics(),
        ]);

        setReports(reportsResponse.data.reports);
        setStats({
          ...statsResponse,
          verification: verificationStatsResponse,
        });
        setAnalytics(analyticsResponse);
      } else {
        // Modify the public API call to include verified_only
        const [reportsResponse, feedStatsResponse] = await Promise.all([
          reportApi.public.getFeedReports({
            ...filters,
            verification_status: filters.verified_only
              ? "verified"
              : filters.verification_status,
          }),
          reportApi.public.getFeedStats(),
        ]);

        setReports(reportsResponse.data.reports);
        setStats({ feed: feedStatsResponse });
      }
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters, requireAuth]);

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return {
    reports,
    stats,
    analytics,
    loading,
    error,
    filters,
    updateFilters,
    refreshReports: fetchReports,
    pagination: {
      currentPage: filters.page,
      totalPages: Math.ceil((reports?.length || 0) / filters.limit),
      totalItems: reports?.length || 0,
    },
  };
};
