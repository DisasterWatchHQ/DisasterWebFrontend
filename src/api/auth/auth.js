import { authApi } from "@/lib/authApi";

export const createUser = async (userData) => {
  try {
    return await authApi.public.register(userData);
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const loginUser = async (credentials) => {
  try {
    return await authApi.public.login(credentials);
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const forgotPassword = async (data) => {
  try {
    return await authApi.public.forgotPassword(data);
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const resetPassword = async (token, password) => {
  try {
    return await authApi.public.resetPassword(token, password);
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const getCurrentUser = authApi.getCurrentUser;
export const isAuthenticated = authApi.isAuthenticated;
export const logout = authApi.logout;
