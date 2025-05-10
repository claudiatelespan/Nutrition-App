import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

export const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const { accessToken, setAccessToken, logout } = useContext(AuthContext);

  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [snacks, setSnacks] = useState([]);
  const [mealLogs, setMealLogs] = useState([]);
  const [snackLogs, setSnackLogs] = useState([]);
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
        const storage =
          localStorage.getItem("accessToken") ? localStorage :
          sessionStorage.getItem("accessToken") ? sessionStorage :
          localStorage;
        storage.setItem("accessToken", token);
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

  const loadMealLogs = async () => {
    try {
      const res = await fetchWithAuth("http://localhost:8000/api/tracking/meals/");
      setMealLogs(res);
    } catch (err) {
      console.error("Failed to load meal logs:", err);
    }
  };
  
  const loadSnackLogs = async () => {
    try {
      const res = await fetchWithAuth("http://localhost:8000/api/tracking/snacks/");
      setSnackLogs(res);
    } catch (err) {
      console.error("Failed to load snack logs:", err);
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

  const logMeal = async (recipeName, date, mealType) => {
    const recipe = recipes.find((r) => r.name === recipeName);
    if (!recipe) return console.error("Recipe not found:", recipeName);

    const res = await fetchWithAuth("http://localhost:8000/api/tracking/meals/", {
      method: "POST",
      body: JSON.stringify({
        recipe: recipe.id,
        calories: recipe.calories,
        date,
        meal_type: mealType.toLowerCase(),
      }),
    });
  
    setMealLogs((prev) => [...prev, res]);
  };
  
  const logSnack = async (snackName, quantity, date) => {
    const snack = snacks.find((s) => s.name === snackName);
    if (!snack) return;
  

    const res = await fetchWithAuth("http://localhost:8000/api/tracking/snacks/", {
      method: "POST",
      body: JSON.stringify({
        snack: snack.id,
        quantity: parseInt(quantity),
        date,
      }),
    });
  
    setSnackLogs((prev) => [...prev, res]);
  };

  const deleteMealLog = async (logId) => {
    await fetchWithAuth(`http://localhost:8000/api/tracking/meals/${logId}/`, {
      method: "DELETE",
    });
    setMealLogs((prev) => prev.filter((log) => log.id !== logId));
  };
  
  const deleteSnackLog = async (logId) => {
    await fetchWithAuth(`http://localhost:8000/api/tracking/snacks/${logId}/`, {
      method: "DELETE",
    });
    setSnackLogs((prev) => prev.filter((log) => log.id !== logId));
  };
  
  

  useEffect(() => {
    const loadData = async () => {
      try {
        const recipesRes = await fetchWithAuth("http://localhost:8000/api/recipes/");
        setRecipes(recipesRes);
        await loadFavorites();
        const snacksRes = await fetchWithAuth("http://localhost:8000/api/snacks/");
        setSnacks(snacksRes);
        await loadMealLogs();
        await loadSnackLogs();
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
        snacks,
        mealLogs,
        snackLogs,
        fetchWithAuth,
        loading,
        addFavorite,
        removeFavorite,
        logMeal,
        logSnack,
        deleteMealLog,
        deleteSnackLog,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};
