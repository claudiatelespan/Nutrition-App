import { useState } from "react";
import mockRecipes from "../assets/mockRecipes";
import { foodCategories } from "../assets/foodCategories";
import RecipeCard from "../components/RecipeCard";
import FilterPopup from "../components/FilterPopup";
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function RecipesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const filteredRecipes = mockRecipes.filter((recipe) => {
    const matchSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory =
      selectedCategories.length === 0 || selectedCategories.includes(recipe.cuisine.toLowerCase());
    return matchSearch && matchCategory;
  });

  const removeCategory = (id) => {
    setSelectedCategories((prev) => prev.filter((cat) => cat !== id));
  };

  return (
    <div className="p-4 bg-[#f8f4f3] min-h-screen relative">
      <h1 className="text-2xl font-bold mb-4">Recipes</h1>

      <div className="flex gap-2 items-center mb-4">
        <div className="relative w-full max-w-xl">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 p-2 border border-gray-300 rounded-md outline-[#f84525]"
          />
        </div>

        <button
          onClick={() => setFilterOpen((prev) => !prev)}          
          className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100"
        >
          <FunnelIcon className="h-5 w-5" />
          Filter
        </button>
      </div>

      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedCategories.map((id) => {
            const cat = foodCategories.find((c) => c.id === id);
            return (
              <div key={id} className="flex items-center gap-1 px-2 py-1 bg-gray-200 rounded-full text-sm">
                <span>{cat.icon} {cat.name}</span>
                <button onClick={() => removeCategory(id)} className="text-gray-600 hover:text-red-600">
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {filterOpen && (
        <FilterPopup
          selected={selectedCategories}
          setSelected={setSelectedCategories}
          onApply={() => setFilterOpen(false)}
          onClear={() => setSelectedCategories([])}
          onClose={() => setFilterOpen(false)}
        />
      )}

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