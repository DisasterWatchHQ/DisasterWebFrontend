"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const UserContext = createContext();

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

export const UserProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status on mount
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (!token || !storedUser) {
        handleLogout();
        return;
      }

      // Check token expiration
      const userData = JSON.parse(storedUser);
      if (isTokenExpired(token)) {
        handleLogout();
        return;
      }

      setUser(userData);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Auth check error:", error);
      handleLogout();
    } finally {
      setIsLoading(false);
    }
  };

  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };

  const login = (userData, token) => {
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
  };

  const handleLogout = async () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Clear any other auth-related storage
    sessionStorage.clear();

    // Optional: Clear cookies if you're using them
    document.cookie.split(";").forEach((cookie) => {
      document.cookie = cookie
        .replace(/^ +/, "")
        .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
    });

    // Redirect to login page
    router.push("/auth");
  };

  const updateUser = (newUserData) => {
    const updatedUser = { ...user, ...newUserData };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  // Don't render children until initial auth check is complete
  if (isLoading) {
    return null; // or a loading spinner
  }

  return (
    <UserContext.Provider
      value={{
        user,
        isLoggedIn,
        isLoading,
        login,
        logout: handleLogout,
        updateUser,
        checkAuth,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
