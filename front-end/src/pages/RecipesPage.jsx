import { useState, useEffect, useContext, useMemo, useRef } from "react";
import { cuisineIcons } from "../assets/cuisineIcons";
import RecipeCard from "../components/cards/RecipeCard";
import FilterPopup from "../components/forms/FilterPopup";
import Pagination from "../components/general/Pagination";
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { ApiContext } from "../context/ApiContext";
import { useSearchParams } from "react-router-dom";

export default function RecipesPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCuisine, setSelectedCuisine] = useState(searchParams.get("cuisine")?.split(",") || []);
  const [selectedCategories, setSelectedCategories] = useState(searchParams.get("meal")?.split(",") || []);
  const [selectedDifficulties, setSelectedDifficulties] = useState(searchParams.get("difficulty")?.split(",") || []);
  const [sortField, setSortField] = useState(searchParams.get("sort") || "name");
  const [sortOrder, setSortOrder] = useState(searchParams.get("order") || "asc");
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
  const recipesPerPage = 12;

  const { recipes, loading } = useContext(ApiContext);

  const isFirstLoad = useRef(true);

  const availableCuisine = useMemo(() => {
    const cuisines = new Set();
    recipes.forEach(r => cuisines.add(r.cuisine_type.toLowerCase()));
    const toTitleCase = s => s.replace(/\b\w/g, c => c.toUpperCase());
    return Array.from(cuisines).map(id => {
      const iconKey = id.replace(/\s+/g, "_"); //for middle_eastern
      return {
        id,
        name: toTitleCase(id),                 
        icon: cuisineIcons[iconKey] || "🍽️"
      };
    });
  }, [recipes]);

  const availableCategories = useMemo(() => {
    return Array.from(new Set(recipes.map(r => r.category))).filter(Boolean);
  }, [recipes]);

  const availableDifficulties = useMemo(() => {
    return Array.from(new Set(recipes.map(r => r.difficulty))).filter(Boolean);
  }, [recipes]);

  const filteredRecipes = recipes.filter((recipe) => {
    const matchSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCuisine = selectedCuisine.length === 0 ||
      selectedCuisine.includes(recipe.cuisine_type.toLowerCase());
    const matchCategory = selectedCategories.length === 0 ||
      selectedCategories.includes(recipe.category);
    const matchDifficulty = selectedDifficulties.length === 0 ||
      selectedDifficulties.includes(recipe.difficulty);
    return matchSearch && matchCuisine && matchCategory && matchDifficulty;
  }).sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (typeof aVal === 'string') {
      return sortOrder === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
  });

  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = filteredRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe);
  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);

  const removeCuisine = (id) => {
    setSelectedCuisine(prev => prev.filter(c => c !== id));
  };

  const removeCategory = (type) => {
    setSelectedCategories(prev => prev.filter(cat => cat !== type));
  };

  const removeDifficulty = (level) => {
    setSelectedDifficulties(prev => prev.filter(d => d !== level));
  };

  const goToPage = (num) => {
    setCurrentPage(num);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (selectedCuisine.length > 0) params.set("cuisine", selectedCuisine.join(","));
    if (selectedCategories.length > 0) params.set("meal", selectedCategories.join(","));
    if (selectedDifficulties.length > 0) params.set("difficulty", selectedDifficulties.join(","));
    if (sortField) params.set("sort", sortField);
    if (sortOrder) params.set("order", sortOrder);
    if (currentPage > 1) params.set("page", String(currentPage));
    setSearchParams(params);
  }, [searchTerm, selectedCuisine, selectedCategories, selectedDifficulties, sortField, sortOrder, currentPage]);

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    setCurrentPage(1);
  }, [searchTerm, selectedCuisine, selectedCategories, selectedDifficulties, sortField, sortOrder]);

  return (
    <div className="p-6 mt-16 bg-beige min-h-screen relative">
      <h1 className="text-2xl font-bold mb-4">Recipes</h1>

      <div className="flex flex-col gap-2 mb-4 p-2">
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <div className="flex flex-row w-2xl gap-2">
            <div className="relative w-full max-w-xl">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-600" />
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 p-2 border border-gray-400 rounded-md outline-[#FFA725]"
              />
            </div>

            <button
              onClick={() => setFilterOpen(prev => !prev)}
              className="px-4 py-2 text-sm border border-gray-400 rounded-lg hover:bg-hover-beige flex items-center gap-2"
            >
              <FunnelIcon className="h-5 w-5" />
              Filter
            </button>
          </div>
          <div className="flex gap-2 items-center">
            <p>Sort by:</p>
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
              className="text-sm px-2 py-1 border border-gray-400 rounded-md"
            >
              <option value="name">Name</option>
              <option value="rating">Rating</option>
              <option value="calories">Calories</option>
              <option value="prep_time">Prep Time</option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="text-sm px-2 py-1 border border-gray-400 rounded-md"
            >
              <option value="asc">Asc</option>
              <option value="desc">Desc</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {selectedCuisine.map((id) => {
            const cuis = availableCuisine.find((c) => c.id === id);
            return (
              <div key={id} className="flex items-center gap-1 px-2 py-1 bg-mint rounded-full text-sm">
                <span>{cuis?.icon || "🍽️"} {cuis?.name || id}</span>
                <button onClick={() => removeCuisine(id)} className="text-gray-600 hover:text-gray-800">
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            );
          })}

          {selectedCategories.map((type) => (
            <div key={type} className="flex items-center gap-1 px-2 py-1 bg-blue-200 rounded-full text-sm">
              <span>{type}</span>
              <button onClick={() => removeCategory(type)} className="text-gray-600 hover:text-blue-800">
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          ))}

          {selectedDifficulties.map((level) => (
            <div key={level} className="flex items-center gap-1 px-2 py-1 bg-pink-200 rounded-full text-sm">
              <span>{level}</span>
              <button onClick={() => removeDifficulty(level)} className="text-gray-600 hover:text-pink-800">
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {filterOpen && (
        <FilterPopup
          selectedCuisine={selectedCuisine}
          setSelectedCuisine={setSelectedCuisine}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          selectedDifficulties={selectedDifficulties}
          setSelectedDifficulties={setSelectedDifficulties}
          onApply={() => setFilterOpen(false)}
          onClose={() => setFilterOpen(false)}
          options={availableCuisine}
          categories={availableCategories}
          difficulties={availableDifficulties}
        />
      )}

      {filteredRecipes.length === 0 ? (
        <p className="text-gray-500">No recipes found.</p>
      ) : (
        <div className="flex justify-center">
          <div className="w-full max-w-7xl px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {currentRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </div>
        </div>
      )}

      {filteredRecipes.length !== 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
        />
      )}
    </div>
  );
}
