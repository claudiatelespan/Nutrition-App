import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const getInitialToken = () =>
    localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

  const [accessToken, setAccessToken] = useState(getInitialToken);
  const [isAuthenticated, setIsAuthenticated] = useState(!!getInitialToken());
  const [userData, setUserData] = useState(null);

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
    await fetchUserInfo(data.access);

  };

  const logout = async () => {
    const refresh =
      localStorage.getItem("refreshToken") ||
      sessionStorage.getItem("refreshToken");
  
    try {
      await fetch("http://localhost:8000/api/users/logout/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
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

  const fetchUserInfo = async (token) => {
    try {
      const res = await fetch("http://localhost:8000/api/users/me/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!res.ok) throw new Error("Failed to fetch user info");
      const data = await res.json();
      setUserData(data);
    } catch (err) {
      console.error("User fetch error:", err);
    }
  };
  

  useEffect(() => {
    if (accessToken) {
      fetchUserInfo(accessToken);
    }
  }, [accessToken]);
  
  
  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, isAuthenticated, login, logout, register, userData }}>
      {children}
    </AuthContext.Provider>
  );
};
