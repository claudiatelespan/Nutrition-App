import { useParams } from "react-router-dom";
import mockRecipes from "../assets/mockRecipes";

export default function RecipeDetailPage() {
  const { id } = useParams();
  const recipe = mockRecipes.find((r) => r.id === parseInt(id));

  if (!recipe) return <p className="p-6 text-center text-gray-500">Recipe not found.</p>;

  return (
    <div className="min-h-screen bg-[#f8f4f3] p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full md:w-1/2 h-64 md:h-auto object-cover"
        />
        <div className="p-6 flex flex-col gap-4">
          <h1 className="text-2xl font-bold">{recipe.title}</h1>
          <p className="text-gray-500">{recipe.cuisine} · {recipe.prepTime} · {recipe.kcal} kcal</p>
          <p className="text-yellow-500 font-semibold">{recipe.rating} ★</p>

          <div>
            <h2 className="font-semibold text-lg mb-1 text-[#f84525]">Ingredients:</h2>
            <ul className="list-disc list-inside text-sm text-gray-700">
              {recipe.ingredients.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-1 text-[#f84525]">Instructions:</h2>
            <p className="text-sm text-gray-700">{recipe.instructions}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
