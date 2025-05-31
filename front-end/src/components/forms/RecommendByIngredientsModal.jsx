import { useContext, useState } from "react";
import { ApiContext } from "../../context/ApiContext";

export default function RecommendByIngredientsModal({ onRecommend, onCancel }) {
  const { ingredients } = useContext(ApiContext);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");

  const categories = {};
  ingredients
    .filter(ing => ing.name.toLowerCase().includes(search.toLowerCase()))
    .forEach(ing => {
      if (!categories[ing.category]) categories[ing.category] = [];
      categories[ing.category].push(ing);
    });

  const handleToggle = (ingredientName) => {
    setSelected(prev =>
      prev.includes(ingredientName)
        ? prev.filter(n => n !== ingredientName)
        : [...prev, ingredientName]
    );
  };

  const handleRecommend = () => onRecommend(selected);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-xl w-full">
        <h3 className="text-xl font-bold mb-4">Select Ingredients</h3>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
          placeholder="Search ingredient..."
        />
        <div className="max-h-60 overflow-y-auto mb-4">
          {Object.entries(categories).map(([cat, ings]) => (
            <div key={cat} className="mb-2">
              <div className="font-semibold text-mango">{cat}</div>
              <div className="flex flex-wrap gap-2">
                {ings.map(ing => (
                  <label key={ing.id} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={selected.includes(ing.name)}
                      onChange={() => handleToggle(ing.name)}
                    />
                    <span>{ing.name}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-mango text-white font-semibold rounded hover:bg-orange-500"
            onClick={handleRecommend}
            disabled={selected.length === 0}
          >
            Recommend
          </button>
        </div>
      </div>
    </div>
  );
}
