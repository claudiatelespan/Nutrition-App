import { useState, useEffect } from "react";

export default function FilterPopup({
  selectedCuisine,
  setSelectedCuisine,
  selectedCategories,
  setSelectedCategories,
  selectedDifficulties,
  setSelectedDifficulties,
  onApply,
  onClose,
  options,
  categories,
  difficulties
}) {
  const [tempCuisines, setTempCuisines] = useState([]);
  const [tempCategories, setTempCategories] = useState([]);
  const [tempDifficulties, setTempDifficulties] = useState([]);

  useEffect(() => {
    setTempCuisines(selectedCuisine);
    setTempCategories(selectedCategories);
    setTempDifficulties(selectedDifficulties);
  }, [selectedCuisine, selectedCategories, selectedDifficulties]);

  const toggle = (stateSetter, state, value) => {
    stateSetter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleApply = () => {
    setSelectedCuisine(tempCuisines);
    setSelectedCategories(tempCategories);
    setSelectedDifficulties(tempDifficulties);
    onApply();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-almostwhite p-6 rounded-lg shadow-xl w-[90%] max-w-5xl flex flex-col gap-6">
        <h2 className="text-lg font-semibold text-center">Filter Recipes</h2>
        <div className="flex gap-6 flex-col md:flex-row">
          {/* Left column: Cuisine categories */}
          <div className="flex-1">
            <h3 className="font-medium mb-2">Cuisine Type</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {options.map((op) => (
                <button
                  key={op.id}
                  onClick={() => toggle(setTempCuisines, tempCuisines, op.id)}
                  className={`flex flex-col items-center justify-center gap-1 p-2 text-sm border border-orange-600/20 rounded-full transition ${
                    tempCuisines.includes(op.id)
                      ? "bg-mango text-white"
                      : "bg-beige text-gray-800"
                  }`}
                >
                  <span className="text-xl">{op.icon}</span>
                  <span>{op.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right column: Category & difficulty */}
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="font-medium mb-2">Category</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => toggle(setTempCategories, tempCategories, cat)}
                    className={`px-3 py-1 border rounded-full text-sm transition ${
                      tempCategories.includes(cat)
                        ? "bg-mango text-white"
                        : "bg-beige text-gray-800 border-orange-600/20"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Difficulty</h3>
              <div className="flex flex-wrap gap-2">
                {difficulties.map((level) => (
                  <button
                    key={level}
                    onClick={() => toggle(setTempDifficulties, tempDifficulties, level)}
                    className={`px-3 py-1 border rounded-full text-sm transition ${
                      tempDifficulties.includes(level)
                        ? "bg-mango text-white"
                        : "bg-beige text-gray-800 border-orange-600/20"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom controls */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => {
              setTempCuisines([]);
              setTempCategories([]);
              setTempDifficulties([]);
            }}
            className="text-sm text-gray-600 underline hover:text-black"
          >
            Clear all
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="text-sm px-3 py-1 border border-gray-300 rounded hover:bg-gray-300"
            >
              Close
            </button>
            <button
              onClick={handleApply}
              className="text-sm px-3 py-1 bg-[#FFA725] text-white rounded hover:bg-orange-500"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
