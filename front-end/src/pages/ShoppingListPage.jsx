import { useContext, useState, useMemo } from "react";
import { ApiContext } from "../context/ApiContext";
import AddItemModal from "../components/forms/AddItemModal";
import { TrashIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { exportShoppingListToExcel } from "../utils/exportToExcel";

export default function ShoppingListPage() {
  const {
    shoppingListItems,
    recipes,
    generateShoppingList,
    toggleShoppingListItem,
    deleteShoppingListItem,
  } = useContext(ApiContext);

  const [showModal, setShowModal] = useState(false);
  const [selectedRecipeNames, setSelectedRecipeNames] = useState([]);
  const recipeNames = useMemo(() => recipes.map((r) => r.name), [recipes]);

  const shouldDisplayQuantity = (item) => {
    const unit = item.unit.toLowerCase();
    const quantity = item.quantity;
  
    const isSmallGramsOrMl = (unit === 'grams' || unit === 'ml' || unit === '') && quantity <= 20;
  
    return !isSmallGramsOrMl;
  };

  const pluralizeUnit = (unit, quantity) => {
    if (quantity === 1 || unit == "grams") return unit;
  
    return unit + 's';
  };

  const handleSaveRecipes = async () => {
    const selectedIds = recipes
      .filter((r) => selectedRecipeNames.includes(r.name))
      .map((r) => r.id);

    try {
      await generateShoppingList(selectedIds);
      setShowModal(false);
      setSelectedRecipeNames([]);
    } catch (err) {
      console.error("Failed to generate shopping list", err);
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleShoppingListItem(id);
    } catch (err) {
      console.error("Failed to toggle shopping list item", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteShoppingListItem(id);
    } catch (err) {
      console.error("Failed to delete shopping list item", err);
    }
  };

    const sortedItems = useMemo(() => {
      const unchecked = shoppingListItems.filter((item) => !item.is_checked);
      const checked = shoppingListItems.filter((item) => item.is_checked);
      return [...unchecked, ...checked];
    }, [shoppingListItems]);

  return (
    <div className="p-6 bg-grid-paper mt-20">
      <div className="flex justify-between items-center mb-4 ml-20 mr-20">
        <h1 className="text-2xl font-bold text-vintage">Shopping List</h1>
        <div className="flex gap-2">
          <button
            onClick={() => exportShoppingListToExcel(shoppingListItems)}
            className="bg-vintage text-white px-4 py-2 rounded hover:bg-hover ml-2"
          >
            Export Excel
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="bg-mango text-white px-4 py-2 rounded hover:bg-orange-500"
          >
            Generate List
          </button>
        </div>
      </div>

      {sortedItems.length === 0 ? (
        <p className="text-gray-500">No items found.</p>
      ) : (
        <ul className="mt-10 p-10 ml-20 max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 ">
          {sortedItems.map((item) => (
            <li
              key={item.id}
              className={`p-4 rounded-xl shadow-md border border-almostwhite transition-all relative whitespace-pre-wrap bg-yellow-100 ${
                item.is_checked ? "opacity-70" : "opacity-100"
              }`}
              style={{
                backgroundColor: item.is_checked ? "beige" : "#fff9db",
              }}
            >
              <span
                className={`block mb-2 font-medium transition-all duration-300 ease-in-out ${
                  item.is_checked ? "line-through text-gray-500" : "text-gray-900"
                }`}
              >
                {item.ingredient.name} {(shouldDisplayQuantity(item)) ? ( <> – {item.quantity} {pluralizeUnit(item.unit, item.quantity)} </> ) : (<div></div>)}
              </span>
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => handleToggle(item.id)}
                  className={`transition-transform transform hover:scale-110 ${
                    item.is_checked ? "text-yellow-500" : "text-green-600"
                  }`}
                  title={item.is_checked ? "Uncheck" : "Check"}
                >
                  {item.is_checked ? (
                    <XMarkIcon className="w-5 h-5" />
                  ) : (
                    <CheckIcon className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
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
          items={recipeNames}
          selectedItem={selectedRecipeNames}
          setSelectedItem={setSelectedRecipeNames}
          onSave={handleSaveRecipes}
          onClose={() => setShowModal(false)}
          saveDisabled={selectedRecipeNames.length === 0}
          multiSelect
        />
      )}
    </div>
  );
}
