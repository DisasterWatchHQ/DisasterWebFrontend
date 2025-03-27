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

  const filterOldReports = (reports) => {
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

    return reports.filter((report) => {
      const reportDate = new Date(report.date_time);
      return reportDate >= fiveDaysAgo;
    });
  };

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (requireAuth) {
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

        const filteredReports = filterOldReports(reportsResponse.data.reports);
        setReports(filteredReports);
        setStats({
          ...statsResponse,
          verification: verificationStatsResponse,
        });
        setAnalytics(analyticsResponse);
      } else {
        const [reportsResponse, feedStatsResponse] = await Promise.all([
          reportApi.public.getFeedReports({
            ...filters,
            verification_status: filters.verified_only
              ? "verified"
              : filters.verification_status,
          }),
          reportApi.public.getFeedStats(),
        ]);

        const filteredReports = filterOldReports(reportsResponse.data.reports);
        setReports(filteredReports);
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
