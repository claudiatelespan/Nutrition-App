import { useState } from "react"; 
import { useNavigate } from "react-router-dom";

export default function RecipeCard({ recipe }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteToggle = () => {
    setIsFavorite((prev) => !prev);
  };

  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-transform hover:scale-[1.01]"
      onClick={() => navigate(`/recipes/${recipe.id}`)}
    >
      <img src={recipe.image} alt={recipe.name} className="w-full h-48 object-cover" />
      
      <div className="p-4">
        <h3 className="text-lg font-semibold">{recipe.name}</h3>
        <p className="text-sm text-gray-500">{recipe.cuisine_type} · {recipe.prep_time} min · {recipe.difficulty}</p>

        <div className="mt-2 flex items-center justify-between">
          <span className="text-yellow-500 font-bold">{recipe.rating} ★</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleFavoriteToggle();
            }}
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
  