const API_BASE = 'http://localhost:8000/api/users';

export const register = async (userData) => {
  const res = await fetch(`${API_BASE}/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  if (!res.ok) {
    throw new Error("Register failed");
  }
  return res.json();
};

export const login = async (userData) => {
  const res = await fetch(`${API_BASE}/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  if (!res.ok) {
    throw new Error("Login failed");
  }
  return res.json();
};
