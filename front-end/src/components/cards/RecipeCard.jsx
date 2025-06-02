import { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ApiContext } from "../../context/ApiContext";

export default function RecipeCard({ recipe }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { favorites, addFavorite, removeFavorite } = useContext(ApiContext);

  const isFavorite = favorites.some((f) => f.recipe === recipe.id);

  const handleToggle = (e) => {
    e.stopPropagation();
    if (isFavorite) removeFavorite(recipe.id);
    else addFavorite(recipe.id);
  };

  return (
    <div
      className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-transform hover:scale-[1.01] min-h-[340px] flex flex-col"
      onClick={() => navigate(`/recipes/${recipe.id}`, {
        state: { from: location.pathname + location.search },
      })}
    >
      <img src={recipe.image} alt={recipe.name} className="w-full h-48 object-cover" />

      <div className="p-4 flex-1 flex flex-col justify-between">
        <h3 className="text-lg font-semibold">{recipe.name}</h3>

        <div className="flex flex-wrap gap-2 mt-2 text-xs">
          <span className="px-2 py-0.5 bg-mint text-gray-700 rounded-full">{recipe.cuisine_type}</span>
          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">{recipe.category}</span>
          <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full">{recipe.prep_time} min</span>
          <span className="px-2 py-0.5 bg-pink-100 text-pink-700 rounded-full">{recipe.difficulty}</span>
          <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full">{recipe.calories} kcal</span>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-yellow-500 font-bold">{recipe.rating} ★</span>
          <button
            onClick={handleToggle}
            className={`px-3 py-1 rounded-full text-xs transition ${
              isFavorite
                ? "bg-mint text-gray-800 hover:bg-gray-400"
                : "bg-mango text-white hover:bg-orange-500"
            } ease-in-out duration-300`}
          >
            {isFavorite ? "Remove" : "Add to Favorites"}
          </button>
        </div>
      </div>
    </div>
  );
}