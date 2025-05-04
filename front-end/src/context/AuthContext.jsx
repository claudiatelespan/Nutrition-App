import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const getInitialToken = () =>
    localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

  const [accessToken, setAccessToken] = useState(getInitialToken);
  const [isAuthenticated, setIsAuthenticated] = useState(!!getInitialToken());

  const login = async (userData, remember) => {
    const res = await fetch("http://localhost:8000/api/users/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      throw new Error("Login failed. Check your credentials.");
    }

    const data = await res.json();
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem("accessToken", data.access);
    storage.setItem("refreshToken", data.refresh);

    setAccessToken(data.access);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    const storage = localStorage.getItem("accessToken") ? localStorage : sessionStorage;
    const access = storage.getItem("accessToken");
    const refresh = storage.getItem("refreshToken");
  
    try {
      await fetch("http://localhost:8000/api/users/logout/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify({ refresh }),
      });
    } catch (err) {
      console.warn("Logout request failed or token invalid.");
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("refreshToken");
  
      setAccessToken(null);
      setIsAuthenticated(false);
    }
  };
  

  const register = async (userData) => {
    const res = await fetch("http://localhost:8000/api/users/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
  
    if (!res.ok) {
      const errorData = await res.json();
      const message =
        errorData.username?.[0] ||
        errorData.email?.[0] ||
        "Register failed.";
      throw new Error(message);
    }
  
    return res.json();
  };  

  return (
    <AuthContext.Provider value={{ accessToken, isAuthenticated, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
