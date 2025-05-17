import { useContext } from "react";
import { ApiContext } from "../context/ApiContext";
import RecipeCard from "../components/RecipeCard";

export default function MyFavoritesPage() {
  const { favorites, recipes, userProfile, updateShareFavorites } = useContext(ApiContext);

  const favoriteRecipes = recipes.filter((r) =>
    favorites.some((f) => f.recipe === r.id)
  );

  const handleToggleShare = () => {
    updateShareFavorites(!userProfile.share_favorites);
  };

  return (
    <div className="p-6 bg-beige min-h-screen mt-16">
      <div className="flex items-center justify-between mb-10 pr-20">
        <h1 className="text-2xl font-bold">My Favorite Recipes</h1>
        <label className="flex items-center gap-3 text-md font-semibold cursor-pointer select-none">
          <span>Share with friends</span>
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={userProfile?.share_favorites || false}
              onChange={handleToggleShare}
            />
            <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-mango transition-all duration-300"></div>
            <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-5"></div>
          </div>
        </label>
      </div>

      {favoriteRecipes.length === 0 ? (
        <p className="text-gray-500">No favorite recipes yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {favoriteRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}
