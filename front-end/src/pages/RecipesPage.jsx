import { useState, useEffect, useContext, useMemo, useRef } from "react";
import { cuisineIcons } from "../assets/cuisineIcons";
import RecipeCard from "../components/RecipeCard";
import FilterPopup from "../components/FilterPopup";
import Pagination from "../components/Pagination";
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { ApiContext } from "../context/ApiContext";
import { useSearchParams } from "react-router-dom";

export default function RecipesPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState(searchParams.get("cuisine")?.split(",") || []);
  const [selectedMealTypes, setSelectedMealTypes] = useState(searchParams.get("meal")?.split(",") || []);
  const [selectedDifficulties, setSelectedDifficulties] = useState(searchParams.get("difficulty")?.split(",") || []);
  const [sortField, setSortField] = useState(searchParams.get("sort") || "name");
  const [sortOrder, setSortOrder] = useState(searchParams.get("order") || "asc");
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
  const recipesPerPage = 3;

  const { recipes, loading } = useContext(ApiContext);

  const isFirstLoad = useRef(true);

  const availableCategories = useMemo(() => {
    const cuisines = new Set();
    recipes.forEach(r => cuisines.add(r.cuisine_type.toLowerCase()));
    return Array.from(cuisines).map(id => ({
      id,
      name: id.charAt(0).toUpperCase() + id.slice(1),
      icon: cuisineIcons[id] || "🍽️"
    }));
  }, [recipes]);

  const availableMealTypes = useMemo(() => {
    return Array.from(new Set(recipes.map(r => r.meal_type))).filter(Boolean);
  }, [recipes]);

  const availableDifficulties = useMemo(() => {
    return Array.from(new Set(recipes.map(r => r.difficulty))).filter(Boolean);
  }, [recipes]);

  const filteredRecipes = recipes.filter((recipe) => {
    const matchSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategories.length === 0 ||
      selectedCategories.includes(recipe.cuisine_type.toLowerCase());
    const matchMealType = selectedMealTypes.length === 0 ||
      selectedMealTypes.includes(recipe.meal_type);
    const matchDifficulty = selectedDifficulties.length === 0 ||
      selectedDifficulties.includes(recipe.difficulty);
    return matchSearch && matchCategory && matchMealType && matchDifficulty;
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

  const removeCategory = (id) => {
    setSelectedCategories(prev => prev.filter(cat => cat !== id));
  };

  const removeMealType = (type) => {
    setSelectedMealTypes(prev => prev.filter(m => m !== type));
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
    if (selectedCategories.length > 0) params.set("cuisine", selectedCategories.join(","));
    if (selectedMealTypes.length > 0) params.set("meal", selectedMealTypes.join(","));
    if (selectedDifficulties.length > 0) params.set("difficulty", selectedDifficulties.join(","));
    if (sortField) params.set("sort", sortField);
    if (sortOrder) params.set("order", sortOrder);
    if (currentPage > 1) params.set("page", String(currentPage));
    setSearchParams(params);
  }, [searchTerm, selectedCategories, selectedMealTypes, selectedDifficulties, sortField, sortOrder, currentPage]);

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    setCurrentPage(1);
  }, [searchTerm, selectedCategories, selectedMealTypes, selectedDifficulties, sortField, sortOrder]);

  return (
    <div className="p-6 bg-beige min-h-screen relative">
      <h1 className="text-2xl font-bold mb-4">Recipes</h1>

      <div className="flex flex-col gap-2 mb-4">
        <div className="flex flex-wrap gap-2 items-center">
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
            className="px-4 py-2 text-sm border border-gray-400 rounded-lg hover:bg-gray-300 flex items-center gap-2"
          >
            <FunnelIcon className="h-5 w-5" />
            Filter
          </button>

          <div className="flex gap-2 items-center">
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
          {selectedCategories.map((id) => {
            const cat = availableCategories.find((c) => c.id === id);
            return (
              <div key={id} className="flex items-center gap-1 px-2 py-1 bg-mint rounded-full text-sm">
                <span>{cat?.icon || "🍽️"} {cat?.name || id}</span>
                <button onClick={() => removeCategory(id)} className="text-gray-600 hover:text-orange-500">
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            );
          })}

          {selectedMealTypes.map((type) => (
            <div key={type} className="flex items-center gap-1 px-2 py-1 bg-blue-200 rounded-full text-sm">
              <span>{type}</span>
              <button onClick={() => removeMealType(type)} className="text-gray-600 hover:text-blue-800">
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
          selected={selectedCategories}
          setSelected={setSelectedCategories}
          mealTypeSelected={selectedMealTypes}
          setMealTypeSelected={setSelectedMealTypes}
          difficultySelected={selectedDifficulties}
          setDifficultySelected={setSelectedDifficulties}
          onApply={() => setFilterOpen(false)}
          onClose={() => setFilterOpen(false)}
          options={availableCategories}
          mealTypes={availableMealTypes}
          difficulties={availableDifficulties}
        />
      )}

      {filteredRecipes.length === 0 ? (
        <p className="text-gray-500">No recipes found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {currentRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
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
