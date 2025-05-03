import { useState, useEffect } from "react";
import mockRecipes from "../assets/mockRecipes";
import { foodCategories } from "../assets/foodCategories";
import RecipeCard from "../components/RecipeCard";
import FilterPopup from "../components/FilterPopup";
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function RecipesPage() {
  const [searchTerm, setSearchTerm] = useState(""); //searchbar
  
  const [filterOpen, setFilterOpen] = useState(false); //filter popup 
  const [selectedCategories, setSelectedCategories] = useState([]); 
  
  const [currentPage, setCurrentPage] = useState(1); //pagination
  const recipesPerPage = 7;
  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;

  //searched recipes
  const filteredRecipes = mockRecipes.filter((recipe) => {
    const matchSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory =
      selectedCategories.length === 0 || selectedCategories.includes(recipe.cuisine.toLowerCase());
    return matchSearch && matchCategory;
  });

  //recipes displayed on page, pages
  const currentRecipes = filteredRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe);
  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);
  const pageNumbers = [...Array(totalPages).keys()].map((n) => n + 1);
  
  const removeCategory = (id) => {
    setSelectedCategories((prev) => prev.filter((cat) => cat !== id));
  };

  const goToPage = (num) => {
    setCurrentPage(num);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };  

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategories]);
  

  return (
    <div className="p-6 bg-[#f8f4f3] min-h-screen relative">

      <h1 className="text-2xl font-bold mb-4">Recipes</h1>

      {/* search bar div */}
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
          className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 flex items-center gap-2"
        >
          <FunnelIcon className="h-5 w-5" />
          Filter
        </button>

        {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-2">
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

      </div>
      {/* search bar div END*/}


      {/* filter popup */}
      {filterOpen && (
        <FilterPopup
          selected={selectedCategories}
          setSelected={setSelectedCategories}
          onApply={() => setFilterOpen(false)}
          onClose={() => setFilterOpen(false)}
        />
      )}

      {/* recipes list */}
      {filteredRecipes.length === 0 ? (
        <p className="text-gray-500">No recipes found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {currentRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-center items-center gap-2 flex-wrap">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          ←
        </button>

        {pageNumbers.map((num) => (
          <button
            key={num}
            onClick={() => goToPage(num)}
            className={`px-3 py-1 rounded border ${
              num === currentPage ? "bg-[#f84525] text-white" : "bg-gray-100"
            }`}
          >
            {num}
          </button>
        ))}

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          →
        </button>
      </div>

    </div>
  );
}