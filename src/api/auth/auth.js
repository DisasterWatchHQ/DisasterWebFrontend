import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

export const createUser = async (userData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/user/register`,
      userData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    throw new Error(errorMessage);
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/user/login`,
      credentials,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      },
    );

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    throw new Error(errorMessage);
  }
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
