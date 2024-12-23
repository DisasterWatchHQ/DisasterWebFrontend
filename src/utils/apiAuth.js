export const signUp = async (userData) => {
  const response = await fetch("http://localhost:5000/api/user/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Something went wrong!");
  }

  return await response.json();
};

export const signIn = async (userData) => {
  const response = await fetch("http://localhost:5000/api/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Something went wrong!");
  }

  return await response.json();
};
