import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

export const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const { accessToken, logout } = useContext(AuthContext);

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Functia fetchWithAuth
  const fetchWithAuth = async (url, options = {}) => {
    let token = accessToken;
    let headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    let res = await fetch(url, { ...options, headers });

    // Daca access token-ul a expirat, incearca refresh
    if (res.status === 401) {
      const refreshToken =
        localStorage.getItem("refreshToken") ||
        sessionStorage.getItem("refreshToken");

      if (!refreshToken) {
        logout();
        throw new Error("Session expired. Please log in again.");
      }

      const refreshRes = await fetch("http://localhost:8000/api/users/login/refresh/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (refreshRes.ok) {
        const data = await refreshRes.json();
        token = data.access;
        localStorage.setItem("accessToken", token);
        headers.Authorization = `Bearer ${token}`;

        // retrimitem request-ul original
        res = await fetch(url, { ...options, headers });
      } else {
        logout();
        throw new Error("Session expired. Please log in again.");
      }
    }

    if (!res.ok) {
      throw new Error("Fetch failed");
    }

    return res.json();
  };

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [recipesRes] = await Promise.all([
        //   fetchWithAuth("http://localhost:8000/api/users/me/"),
          fetchWithAuth("http://localhost:8000/api/recipes/"),
        ]);

        // setUserData(userRes);
        setRecipes(recipesRes);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      loadData();
      console.log("recipes");
    } else {
      setLoading(false);
    }
  }, [accessToken]);

  return (
    <ApiContext.Provider value={{ recipes, fetchWithAuth, loading }}>
      {children}
    </ApiContext.Provider>
  );
};
