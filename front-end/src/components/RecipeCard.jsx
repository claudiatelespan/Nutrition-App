import { useState } from "react"; 
import { useNavigate } from "react-router-dom";

export default function RecipeCard({ recipe }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteToggle = () => {
    setIsFavorite((prev) => !prev);
  };

  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden"
    onClick={() => navigate(`/recipes/${recipe.id}`)}>
      <img src={recipe.image} alt={recipe.title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{recipe.title}</h3>
        <p className="text-sm text-gray-500">{recipe.cuisine} · {recipe.prepTime}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-yellow-500 font-bold">{recipe.rating} ★</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleFavoriteToggle();
            }}
            className={`px-3 py-1 rounded-full text-xs transition ${
              isFavorite
                ? "bg-gray-300 text-gray-800 hover:bg-gray-400"
                : "bg-[#f84525] text-white hover:bg-red-700"
            }`}
          >
            {isFavorite ? "Remove" : "Add to Favorites"}
          </button>
        </div>
      </div>
    </div>
  );
}
  