import { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { ApiContext } from "../context/ApiContext";

export default function RecipeDetailPage() {
  const [isFavorite, setIsFavorite] = useState(false);
  const { recipes } = useContext(ApiContext);

  const handleFavoriteToggle = () => {
    setIsFavorite((prev) => !prev);
  };

  const { id } = useParams();
  const recipe = recipes.find((r) => r.id === parseInt(id));
  const navigate = useNavigate();

  if (!recipe) return <p className="p-6 text-center text-gray-500">Recipe not found.</p>;

  return (
    <div className="bg-beige min-h-screen px-4 py-8 overflow-auto">
      <button
        onClick={() => navigate("/recipes")}
        className="flex items-center gap-1 text-lg text-mango hover:underline cursor-pointer group"
      >
        <ArrowLeftIcon className="h-4 w-4 transform transition-transform group-hover:scale-120" />
        Back
      </button>

      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row h-auto md:h-[550px]">
        <img
          src={recipe.image}
          alt={recipe.name}
          className="w-full md:w-1/2 h-48 md:h-auto object-cover"
        />

        <div className="p-6 flex flex-col gap-4 overflow-y-auto w-full">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold">{recipe.name}</h1>
            <button
              onClick={handleFavoriteToggle}
              className={`text-sm px-3 py-1 rounded-full transition ${
                isFavorite
                  ? "bg-mint text-gray-800 hover:bg-gray-400"
                  : "bg-mango text-white hover:bg-orange-500"
              }`}
            >
              {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            </button>
          </div>

          <div className="flex flex-wrap gap-2 text-sm">
            <span className="px-2 py-0.5 bg-mint text-gray-700 rounded-full">{recipe.cuisine_type}</span>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">{recipe.meal_type}</span>
            <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full">{recipe.prep_time} min</span>
            <span className="px-2 py-0.5 bg-pink-100 text-pink-700 rounded-full">{recipe.difficulty}</span>
            <span className="px-2 py-0.5  bg-gray-100 text-gray-700 rounded-full">{recipe.calories} kcal</span>
          </div>

          <div className="text-yellow-500 font-semibold text-lg">{recipe.rating} ★</div>

          <div>
            <h2 className="font-semibold text-lg mb-1 text-mango">Ingredients:</h2>
            <ul className="list-disc list-inside text-sm text-gray-700">
              {recipe.ingredients.map((ingredient) => (
                <li key={ingredient.ingredient.id}>
                  {ingredient.quantity}
                  {ingredient.ingredient.unit} {ingredient.ingredient.name}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-1 text-mango">Instructions:</h2>
            <p className="text-sm text-gray-700">{recipe.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
