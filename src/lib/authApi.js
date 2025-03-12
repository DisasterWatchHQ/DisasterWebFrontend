import { publicClient, protectedClient } from './api';

export const authApi = {
  public: {
    login: async (credentials) => {
      const response = await publicClient.post("/users/login", credentials);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      return response.data;
    },

    register: async (userData) => {
      const response = await publicClient.post("/users/register", userData);
      return response.data;
    },

    forgotPassword: async (data) => {
      const response = await publicClient.post("/users/forgot-password", data);
      return response.data;
    },

    resetPassword: async (token, password) => {
      const response = await publicClient.post("/users/reset-password", {
        token,
        password,
      });
      return response.data;
    },
  },

  protected: {
    changePassword: async (userId, passwordData) => {
      const response = await protectedClient.patch(
        `/users/changepassword/${userId}`,
        passwordData
      );
      return response.data;
    },

    updatePreferences: async (preferences) => {
      const response = await protectedClient.patch("/users/preferences", {
        preferences,
      });
      return response.data;
    },

    updatePushToken: async (pushToken) => {
      const response = await protectedClient.patch("/users/push-token", {
        pushToken,
      });
      return response.data;
    },
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};