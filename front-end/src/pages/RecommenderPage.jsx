import { useState, useContext, useEffect } from "react";
import RecommendByIngredientsModal from "../components/forms/RecommendByIngredientsModal";
import RecipeCard from "../components/cards/RecipeCard";
import { ApiContext } from "../context/ApiContext";

export default function RecommendationsPage() {
  const [showIngredientsModal, setShowIngredientsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { recommendedRecipes, setRecommendedRecipes, recommendRecipesByIngredients } = useContext(ApiContext);

  const handleOpenModal = () => setShowIngredientsModal(true);

  const handleRecommend = async (selectedIngredients) => {
    setLoading(true);
    try {
      const res = await recommendRecipesByIngredients(selectedIngredients);
      sessionStorage.setItem("recommendedRecipes", JSON.stringify(res));
      setRecommendedRecipes(res);
    } finally {
      setLoading(false);
      setShowIngredientsModal(false);
    }
  };

  useEffect(() => {
    const stored = sessionStorage.getItem("recommendedRecipes");
    if (stored) {
      setRecommendedRecipes(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="p-6 bg-beige min-h-screen mt-16">
      <h1 className="text-3xl font-bold mb-6">Recipe Recommendations</h1>
      
      <section className="mb-12">
        <div className="flex flex-row items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Ingredient-based Recommendation</h2>
          <button
            onClick={handleOpenModal}
            className="bg-mango text-white font-bold px-4 py-2 rounded shadow hover:bg-orange-500"
          >
            Select Ingredients
          </button>
        </div>

        {/* list recommended recipes */}
        <div className="mt-6 pl-15 pr-15 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? <span className="text-gray-400">Loading recommendations...</span>
            : recommendedRecipes.length === 0
              ? <span className="text-gray-500">No recommendations yet.</span>
              : recommendedRecipes.map(r => (
                <div key={r.recipe.id} className="flex flex-col justify-between">
                  <RecipeCard recipe={r.recipe} />
                  {r.matched_ingredients && r.matched_ingredients.length > 0 && (
                    <div className="mt-2 bg-mango bg-opacity-90 text-white text-xs px-3 py-1 rounded shadow w-fit">
                      <span className="font-semibold">Matching ingredients:</span>
                      <span className="ml-1 capitalize">
                        {r.matched_ingredients.join(", ")}
                      </span>
                    </div>
                  )}
                </div>
              ))
          }
        </div>
      </section>

      {/* select ingredients */}
      {showIngredientsModal && (
        <RecommendByIngredientsModal
          onRecommend={handleRecommend}
          onCancel={() => setShowIngredientsModal(false)}
        />
      )}
    </div>
  );
}
