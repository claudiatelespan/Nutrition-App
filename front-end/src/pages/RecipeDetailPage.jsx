import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { ApiContext } from "../context/ApiContext";
import RatingModal from "../components/forms/RatingModal";
import StarRating from "../components/general/StarRating";
import toast from "react-hot-toast";

export default function RecipeDetailPage() {
  const { recipes, favorites, addFavorite, removeFavorite, fetchMyRating, createRating, updateRating, deleteRating, reloadRecipe } = useContext(ApiContext);
  const { id } = useParams();
  const location = useLocation();
  const recipe = recipes.find((r) => r.id === parseInt(id));
  const navigate = useNavigate();

  const isFavorite = favorites.some((f) => f.recipe === recipe?.id);

  const [showRatingModal, setShowRatingModal] = useState(false);
  const [myRating, setMyRating] = useState(null);
  const [loadingRating, setLoadingRating] = useState(false);

  const handleFavoriteToggle = () => {  
    if (!recipe) return;
    if (isFavorite) removeFavorite(recipe.id);
    else addFavorite(recipe.id);
  };

  const handleBack = () => {
    const prev = location.state?.from || "/recipes";
    navigate(prev);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (recipe) {
      setLoadingRating(true);
      fetchMyRating(recipe.id)
        .then(res => {
          setMyRating(res);
        })
        .catch(() => setMyRating(null))
        .finally(() => setLoadingRating(false));
    }
  }, [recipe, fetchMyRating]);

  const handleRateClick = () => setShowRatingModal(true);

  const handleSaveRating = async (rating) => {
    setLoadingRating(true);
    try {
      if (myRating && myRating.id) {
        await updateRating(myRating.id, rating);
        toast.success("Your rating has been updated!");
        setMyRating({ ...myRating, rating });
      } else {
        const res = await createRating(recipe.id, rating);
        toast.success("Thank you for your rating!");
        setMyRating(res);
      }
      await reloadRecipe(recipe.id);
    } catch (e) {
      toast.error("Something went wrong!");
    } finally {
      setShowRatingModal(false);
      setLoadingRating(false);
    }
  };

  const handleDeleteRating = async () => {
    if (!myRating) return;
    setLoadingRating(true);
    try {
      await deleteRating(myRating.id);
      toast.success("Your rating was removed.");
      setMyRating(null);
      await reloadRecipe(recipe.id);
    } catch (e) {
      toast.error("Could not remove rating.");
    } finally {
      setShowRatingModal(false);
      setLoadingRating(false);
    }
  };

  const handleCancelRating = () => {
    setShowRatingModal(false);
  };

  if (!recipe) return <p className="p-6 text-center text-gray-500">Recipe not found.</p>;

  return (
    <div className="bg-beige mt-16 min-h-screen px-4 py-8 overflow-auto">
      <button
        onClick={handleBack}
        className="flex items-center gap-1 text-lg text-mango hover:underline hover:text-orange-500 cursor-pointer group"
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

        <div className="p-10 flex flex-col gap-4 overflow-y-auto w-full">
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
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">{recipe.category}</span>
            <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full">{recipe.prep_time} min</span>
            <span className="px-2 py-0.5 bg-pink-100 text-pink-700 rounded-full">{recipe.difficulty}</span>
            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full">{recipe.calories} kcal</span>
          </div>

          <div className="flex items-center gap-2 text-yellow-500 font-semibold text-lg">
            {recipe.rating} ★
            <button
              className="ml-2 px-2 py-1 bg-mango rounded text-white text-sm font-semibold hover:bg-orange-500"
              onClick={handleRateClick}
            >
            {loadingRating
              ? "Loading..."
              : myRating
              ? "Update your rating"
              : "Rate your experience"}
            </button>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-1 text-mango">Ingredients:</h2>
            <ul className="list-disc list-inside text-sm text-gray-700 text-justify">
              {recipe.ingredients.split(";").map((ingredient) => (
                <li key={ingredient}>
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-1 text-mango">Description:</h2>
            <p className="text-sm text-gray-700 text-justify">{recipe.description}</p>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-1 text-mango">Directions:</h2>
            <p className="text-sm text-gray-700 whitespace-pre-line text-justify">{recipe.directions}</p>
          </div>

          <div className="mt-4 border-t pt-4">
            <h2 className="font-semibold text-lg mb-2 text-mango">Nutritional Values (per serving):</h2>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-gray-700">
              <li><strong>Calories:</strong> {recipe.calories} kcal</li>
              <li><strong>Protein:</strong> {recipe.protein} g</li>
              <li><strong>Carbohydrates:</strong> {recipe.carbohydrates} g</li>
              <li><strong>Sugars:</strong> {recipe.sugars} g</li>
              <li><strong>Fat:</strong> {recipe.fat} g</li>
              <li><strong>Fiber:</strong> {recipe.fiber} g</li>
            </ul>
          </div>
        </div>
      </div>

      {showRatingModal && (
        <RatingModal
          initialRating={myRating?.rating || 0}
          onSave={handleSaveRating}
          onCancel={handleCancelRating}
          onDelete={myRating ? handleDeleteRating : undefined}
          isUpdate={!!myRating}
        />
      )}
    </div>
  );
}
