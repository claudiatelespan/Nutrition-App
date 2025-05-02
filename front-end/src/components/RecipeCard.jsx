export default function RecipeCard({ recipe }) {
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <img src={recipe.image} alt={recipe.title} className="w-full h-48 object-cover" />
        <div className="p-4">
          <h3 className="text-lg font-semibold">{recipe.title}</h3>
          <p className="text-sm text-gray-500">{recipe.cuisine} · {recipe.prepTime}</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-yellow-500 font-bold">{recipe.rating} ★</span>
            <button className="bg-[#f84525] text-white px-3 py-1 rounded-full text-xs hover:bg-red-700 transition">
              Add to Favorites
            </button>
          </div>
        </div>
      </div>
    );
  }
  