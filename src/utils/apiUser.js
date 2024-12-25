export const getUserProfile = async (userId) => {
  const token = localStorage.getItem("authToken");

  try {
    const response = await fetch(`http://localhost:5000/api/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch user profile");
    }

    return data;
  } catch (error) {
    throw new Error(error.message || "Error fetching user profile");
  }
};

export const updateUser = async (userId, updates) => {
  const token = localStorage.getItem("authToken");

  try {
    const response = await fetch(`http://localhost:5000/api/user/${userId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...updates,
        ...(updates.location && {
          location: {
            latitude: updates.location.latitude,
            longitude: updates.location.longitude,
          },
        }),
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to update user");
    }

    return data;
  } catch (error) {
    console.error("Error in updateUser:", error);
    throw error;
  }
};

export const changePassword = async (userId, currentPassword, newPassword) => {
  const token = localStorage.getItem("authToken");
  
  try {
    const response = await fetch(`http://localhost:5000/api/user/change-password/${userId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currentPassword,
        newPassword
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to change password");
    }
    
    return data;
  } catch (error) {
    console.error("Error in changePassword:", error);
    throw error;
  }
};