import { useContext, useState, useMemo } from "react";
import { ApiContext } from "../context/ApiContext";
import AddItemModal from "../components/AddItemModal";
import { TrashIcon, CheckIcon } from "@heroicons/react/24/outline";

export default function ShoppingListPage() {
  const {
    shoppingListItems,
    recipes,
    generateShoppingList,
    toggleShoppingListItem,
    deleteShoppingListItem,
  } = useContext(ApiContext);

  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedRecipes, setSelectedRecipes] = useState([]);

  const filteredItems = useMemo(() => {
    if (!search) return shoppingListItems;
    return shoppingListItems.filter((item) =>
      item.ingredient.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, shoppingListItems]);

  const handleSaveRecipes = async () => {
    const selectedIds = selectedRecipes
      .map((name) => recipes.find((r) => r.name === name)?.id)
      .filter(Boolean);

    try {
      await generateShoppingList(selectedIds);
      setShowModal(false);
      setSelectedRecipes([]);
    } catch (err) {
      console.error("Failed to generate shopping list", err);
    }
  };

  return (
    <div className="p-6 bg-beige min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Shopping List</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-mango text-white px-4 py-2 rounded hover:bg-orange-500"
        >
          Generate List
        </button>
      </div>

      <div className="max-w-xl mb-4">
        <input
          type="text"
          placeholder="Search ingredients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded"
        />
      </div>

      {filteredItems.length === 0 ? (
        <p className="text-gray-500">No items found.</p>
      ) : (
        <ul className="space-y-3">
          {filteredItems.map((item) => (
            <li
              key={item.id}
              className={`p-4 border rounded flex justify-between items-center transition-all ${
                item.checked ? "bg-green-100" : "bg-white"
              }`}
            >
              <span>
                {item.ingredient.name} - {item.quantity} {item.ingredient.unit}
              </span>
              <div className="space-x-2">
                <button
                  onClick={() => toggleShoppingListItem(item.id)}
                  className="text-green-600 hover:text-green-800"
                >
                  <CheckIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => deleteShoppingListItem(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showModal && (
        <AddItemModal
          title="Select Recipes"
          search={search}
          setSearch={setSearch}
          items={recipes.map((r) => r.name)}
          selectedItem={selectedRecipes}
          setSelectedItem={setSelectedRecipes}
          onSave={handleSaveRecipes}
          onClose={() => setShowModal(false)}
          saveDisabled={selectedRecipes.length === 0}
          multiSelect
        />
      )}
    </div>
  );
}
