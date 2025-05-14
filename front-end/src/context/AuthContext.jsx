import { createContext, useState, useEffect } from "react";

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
    await fetchUserInfo(data.access);

  };

  const logout = async () => {
    const refresh =
      localStorage.getItem("refreshToken") ||
      sessionStorage.getItem("refreshToken");
  
    let token = accessToken;
  
    const sendLogout = async () => {
      return await fetch("http://localhost:8000/api/users/logout/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ refresh }),
      });
    };
  
    try {
      let res = await sendLogout();
  
      if (res.status === 401 && refresh) {
        const refreshRes = await fetch("http://localhost:8000/api/users/login/refresh/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh }),
        });
  
        if (refreshRes.ok) {
          const data = await refreshRes.json();
          token = data.access;
          await sendLogout(); // retry logout
        } else {
          console.warn("Refresh token invalid during logout");
        }
      }
    } catch (err) {
      console.warn("Logout request failed:", err);
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
    <AuthContext.Provider value={{ accessToken, setAccessToken, isAuthenticated, login, logout, register}}>
      {children}
    </AuthContext.Provider>
  );
};
