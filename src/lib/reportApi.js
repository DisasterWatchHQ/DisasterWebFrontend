import { publicClient, protectedClient } from "./api";

export const reportApi = {
  public: {
    getFeedReports: async (params) => {
      const response = await publicClient.get("/reports/reports", { params });
      return response.data;
    },

    getFeedStats: async () => {
      const response = await publicClient.get("/reports/feedstats");
      return response.data;
    },

    getFeedUpdates: async (minutes = 30) => {
      const response = await publicClient.get("/reports/updates", {
        params: { minutes },
      });
      return response.data;
    },

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

  protected: {
    getMyReports: async (params) => {
      const response = await protectedClient.get("/reports/my-reports", {
        params,
      });
      return response.data;
    },

    getVerificationStats: async () => {
      const response = await protectedClient.get("/reports/stats/verification");
      return response.data;
    },

    getReportAnalytics: async () => {
      const response = await protectedClient.get("/reports/stats/analytics");
      return response.data;
    },

    getReportStats: async () => {
      const response = await protectedClient.get("/reports/stats");
      return response.data;
    },

    getVerifiedReports: async (params) => {
      const response = await protectedClient.get("/reports/verified", {
        params,
      });
      return response.data;
    },

    verifyReport: async (reportId, verificationData) => {
      const response = await protectedClient.post(
        `/reports/${reportId}/verify`,
        verificationData,
      );
      return response.data;
    },

    dismissReport: async (reportId, dismissData) => {
      const response = await protectedClient.post(
        `/reports/${reportId}/dismiss`,
        dismissData,
      );
      return response.data;
    },
  },
};
