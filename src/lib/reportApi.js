import { publicClient, protectedClient } from "./api";

export const reportApi = {
  // Public Routes
  public: {
    // Get public feed reports with filters
    getFeedReports: async (params) => {
      const response = await publicClient.get("/reports/reports", { params });
      return response.data;
    },

    // Get public feed stats
    getFeedStats: async () => {
      const response = await publicClient.get("/reports/feedstats");
      return response.data;
    },

    // Get feed updates
    getFeedUpdates: async (minutes = 30) => {
      const response = await publicClient.get("/reports/updates", {
        params: { minutes },
      });
      return response.data;
    },

    // Submit public report
    submitReport: async (reportData) => {
      const data = {
        ...reportData,
        date_time: new Date().toISOString(),
        reporter_type: "anonymous",
      };
      const response = await publicClient.post("/reports", data);
      return response.data;
    },
  },

  // Protected Routes (require authentication)
  protected: {
    // Get user's own reports
    getMyReports: async (params) => {
      const response = await protectedClient.get("/reports/my-reports", {
        params,
      });
      return response.data;
    },

    // Get verification stats
    getVerificationStats: async () => {
      const response = await protectedClient.get("/reports/stats/verification");
      return response.data;
    },

    // Get report analytics
    getReportAnalytics: async () => {
      const response = await protectedClient.get("/reports/stats/analytics");
      return response.data;
    },

    // Get general report stats
    getReportStats: async () => {
      const response = await protectedClient.get("/reports/stats");
      return response.data;
    },

    // Get verified reports
    getVerifiedReports: async (params) => {
      const response = await protectedClient.get("/reports/verified", {
        params,
      });
      return response.data;
    },

    // Verify a report (admin/authorized users only)
    verifyReport: async (reportId, verificationData) => {
      const response = await protectedClient.post(
        `/reports/${reportId}/verify`,
        verificationData,
      );
      return response.data;
    },

    // Dismiss a report (admin/authorized users only)
    dismissReport: async (reportId, dismissData) => {
      const response = await protectedClient.post(
        `/reports/${reportId}/dismiss`,
        dismissData,
      );
      return response.data;
    },
  },
};
