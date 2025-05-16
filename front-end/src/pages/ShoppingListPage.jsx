import { useContext, useState, useMemo } from "react";
import { ApiContext } from "../context/ApiContext";
import AddItemModal from "../components/AddItemModal";
import { TrashIcon, CheckIcon } from "@heroicons/react/24/outline";

export default function ShoppingListPage() {
  const {
    recipes,
    shoppingListItems,
    generateShoppingList,
    toggleShoppingListItem,
    deleteShoppingListItem,
    loadShoppingListItems,
  } = useContext(ApiContext);

  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);

  const recipeOptions = useMemo(
    () =>
      recipes
        .filter((r) => r.name.toLowerCase().includes(search.toLowerCase()))
        .map((r) => r.name),
    [recipes, search]
  );

  const handleGenerate = async () => {
    const recipe = recipes.find((r) => r.name === selectedItem);
    if (!recipe) return;
    setLoading(true);
    try {
      await generateShoppingList([recipe.id]);
      await loadShoppingListItems();
      setModalOpen(false);
      setSelectedItem(null);
      setSearch("");
    } catch (err) {
      console.error("Failed to generate shopping list", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-beige min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Shopping List</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-mango text-white px-4 py-2 rounded hover:bg-orange-500"
        >
          Select Recipes
        </button>
      </div>

      {shoppingListItems.length === 0 ? (
        <p className="text-gray-500">No items yet. Select recipes to generate your shopping list.</p>
      ) : (
        <ul className="space-y-3">
          {shoppingListItems.map((item) => (
            <li
              key={item.id}
              className={`flex justify-between items-center p-3 rounded border ${
                item.checked ? "bg-green-100 line-through text-gray-500" : "bg-white"
              }`}
            >
              <div>
                <span className="font-medium">{item.ingredient.name}</span> - {item.quantity} {item.ingredient.unit}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleShoppingListItem(item.id)}
                  className="text-green-600 hover:text-green-800"
                >
                  <CheckIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => deleteShoppingListItem(item.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {modalOpen && (
        <AddItemModal
          title="Select Recipes"
          search={search}
          setSearch={setSearch}
          items={recipeOptions}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          onClose={() => setModalOpen(false)}
          onSave={handleGenerate}
          saveDisabled={!selectedItem || loading}
        />
      )}
    </div>
  );
}
