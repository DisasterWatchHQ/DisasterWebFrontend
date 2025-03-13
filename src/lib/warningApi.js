import { publicClient, protectedClient } from "./api";

export const warningApi = {
  public: {
    getActiveWarnings: async () => {
      const response = await publicClient.get("/warnings/active");
      return response.data;
    },

    getWarnings: async (params) => {
      const response = await publicClient.get("/warnings", { params });
      return response.data;
    },

    getWarningById: async (id) => {
      const response = await publicClient.get(`/warnings/${id}`);
      return response.data;
    },

    getWarningsByLocation: async (params) => {
      const response = await publicClient.get("/warnings/location", { params });
      return response.data;
    },
  },

  protected: {
    createWarning: async (warningData) => {
      const response = await protectedClient.post("/warnings", warningData);
      return response.data;
    },

    addUpdate: async (warningId, updateData) => {
      const response = await protectedClient.post(
        `/warnings/${warningId}/updates`,
        updateData,
      );
      return response.data;
    },

    resolveWarning: async (warningId, resolutionData) => {
      const response = await protectedClient.post(
        `/warnings/${warningId}/resolve`,
        resolutionData,
      );
      return response.data;
    },

    addAction: async (warningId, actionData) => {
      const response = await protectedClient.post(
        `/warnings/${warningId}/actions`,
        actionData,
      );
      return response.data;
    },

    updateActionStatus: async (warningId, actionId, statusData) => {
      const response = await protectedClient.patch(
        `/warnings/${warningId}/actions/${actionId}`,
        statusData,
      );
      return response.data;
    },

    updateWarning: async (warningId, updateData) => {
      const response = await protectedClient.patch(
        `/warnings/${warningId}`,
        updateData,
      );
      return response.data;
    },
  },
};
