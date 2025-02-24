import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const createUser = async (userData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/user/register`,
      userData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    return response.data;
  } catch (error) {
    // Extract the error message from the response if it exists
    const errorMessage = error.response?.data?.message || error.message;
    
    // Throw an error with the message so it can be handled by the frontend
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
          'Content-Type': 'application/json',
        },
        withCredentials: true, // Important for receiving cookies
      }
    );

    // Store the token if you need it in the frontend
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      // You might also want to store user data
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    throw new Error(errorMessage);
  }
};

// Utility function to get the current logged-in user's data
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Utility function to check if user is logged in
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Utility function to logout
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};