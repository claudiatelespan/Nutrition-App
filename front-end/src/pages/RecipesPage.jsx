import mockRecipes from "../assets/mockRecipes";
import RecipeCard from "../components/RecipeCard";

export default function RecipesPage() {
    return (
      <div className="p-4 bg-[#f8f4f3] min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Recipes</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {mockRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </div>
    );
  }