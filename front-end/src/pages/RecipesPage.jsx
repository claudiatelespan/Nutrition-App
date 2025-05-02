import { useState } from "react";
import mockRecipes from "../assets/mockRecipes";
import RecipeCard from "../components/RecipeCard";

export default function RecipesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRecipes = mockRecipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 bg-[#f8f4f3] min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Recipes</h1>

      <input
        type="text"
        placeholder="Search recipes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-6 border border-gray-300 rounded-md outline-[#f84525]"
      />

      {filteredRecipes.length === 0 ? (
        <p className="text-gray-500">No recipes found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}