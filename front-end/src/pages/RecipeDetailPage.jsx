import { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import mockRecipes from "../assets/mockRecipes";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { ApiContext } from "../context/ApiContext";

export default function RecipeDetailPage() {
    const [isFavorite, setIsFavorite] = useState(false);
    const {recipes, loading} = useContext(ApiContext);

    const handleFavoriteToggle = () => {
        setIsFavorite((prev) => !prev);
    };

    const { id } = useParams();
    const recipe = recipes.find((r) => r.id === parseInt(id));

    const navigate = useNavigate();

    if (!recipe) return <p className="p-6 text-center text-gray-500">Recipe not found.</p>;

    return (
        <div className="bg-beige flex justify-center items-center py-8 px-4 overflow-auto">
            <button
                onClick={() => navigate("/recipes")}
                className="absolute top-20 left-20 flex items-center gap-1 text-lg text-mango hover:underline cursor-pointer group"
            >
                <ArrowLeftIcon className="h-4 w-4 transform transition-transform group-hover:scale-120" />
                Back
            </button>
        
            <div className="max-w-5xl w-full bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row h-auto md:h-[600px]">
                <img
                src={recipe.image}
                alt={recipe.name}
                className="w-full md:w-1/2 h-48 md:h-full object-cover"
                />
                <div className="p-6 flex flex-col gap-4 overflow-y-auto">
                    <h1 className="text-2xl font-bold">{recipe.name}</h1>
                    <p className="text-gray-500">{recipe.cuisine_type} · {recipe.prep_time} min · {recipe.calories} kcal</p>
                    <p className="text-yellow-500 font-semibold">{recipe.rating} ★</p>
                    <button
                        onClick={handleFavoriteToggle}
                        className={`self-start text-sm px-3 py-1 rounded-full transition ${
                            isFavorite
                            ? "bg-mint text-gray-800 hover:bg-gray-400"
                            : "bg-mango text-white hover:bg-red-700"
                        }`}
                        >
                        {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                    </button>

                    <div>
                        <h2 className="font-semibold text-lg mb-1 text-mango">Ingredients:</h2>
                        <ul className="list-disc list-inside text-sm text-gray-700">
                        {recipe.ingredients.map((ingredient) => (
                            <li key={ingredient.ingredient.id}>{ingredient.quantity}{ingredient.ingredient.unit} {ingredient.ingredient.name}</li>
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
