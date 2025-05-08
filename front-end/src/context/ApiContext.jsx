import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

export const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const { accessToken, setAccessToken, logout } = useContext(AuthContext);

  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWithAuth = async (url, options = {}) => {
    let token = accessToken;
    let headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    let res = await fetch(url, { ...options, headers });

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
        setAccessToken(token);
        headers.Authorization = `Bearer ${token}`;
        res = await fetch(url, { ...options, headers });
      } else {
        logout();
        throw new Error("Session expired. Please log in again.");
      }
    }

    if (res.status === 204) return null;
    if (!res.ok) throw new Error("Fetch failed");
    return res.json();
  };

  const loadFavorites = async () => {
    try {
      const favRes = await fetchWithAuth("http://localhost:8000/api/favorites/");
      setFavorites(favRes);
    } catch (err) {
      console.error("Failed to load favorites:", err);
    }
  };

  const addFavorite = async (recipeId) => {
    try {
      const newFav = await fetchWithAuth("http://localhost:8000/api/favorites/", {
        method: "POST",
        body: JSON.stringify({ recipe: recipeId }),
      });
      setFavorites((prev) => [...prev, newFav]);
    } catch (err) {
      console.error("Add favorite error:", err);
    }
  };

  const removeFavorite = async (recipeId) => {
    const fav = favorites.find((f) => f.recipe === recipeId);
    if (!fav) return;

    try {
      await fetchWithAuth(`http://localhost:8000/api/favorites/${fav.id}/`, {
        method: "DELETE",
      });
      setFavorites((prev) => prev.filter((f) => f.id !== fav.id));
    } catch (err) {
      console.error("Remove favorite error:", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const recipesRes = await fetchWithAuth("http://localhost:8000/api/recipes/");
        setRecipes(recipesRes);
        await loadFavorites();
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      loadData();
      console.log("data fetch");
    } else {
      setLoading(false);
    }
  }, [accessToken]);

  return (
    <ApiContext.Provider
      value={{
        recipes,
        favorites,
        fetchWithAuth,
        loading,
        addFavorite,
        removeFavorite,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};
