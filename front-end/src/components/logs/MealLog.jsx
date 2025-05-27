import { useMemo, useState, useContext } from "react";
import { format } from "date-fns";
import { ApiContext } from "../../context/ApiContext";
import MealCard from "../cards/MealCard";
import AddItemModal from "../forms/AddItemModal";

export default function MealLog({ setReloadChartsKey, selectedDate }) {
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [mealType, setMealType] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const { recipes, logMeal, deleteMealLog, mealLogs } = useContext(ApiContext);
  const meals = ["Breakfast", "Lunch", "Dinner"];
  const formattedDate = format(selectedDate, "yyyy-MM-dd");

  const handleSaveSelectedItem = async () => {
    if (!selectedItem) return;
    try {
      await logMeal(selectedItem.name, formattedDate, mealType);
      setReloadChartsKey(k => k + 1);
      setSelectedItem("");
      setShowRecipeModal(false);
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const handleCloseModal = () => {
    setShowRecipeModal(false);
    setSelectedItem(null);
  };

  const findLogId = (type, item) => {
    return mealLogs.find(
      (log) => log.date === formattedDate && capitalize(log.meal_type) === type && log.recipe_name === item
    )?.id;
  };

  const handleDeleteMeal = async (type, index) => {
    const item = getMealsFor(type)[index];
    const logId = findLogId(type, item);
    if (logId) {
      await deleteMealLog(logId);
      setReloadChartsKey(k => k + 1);
    }
  };

  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  const mealLog = useMemo(() => {
    const grouped = {};
    mealLogs.forEach(log => {
      const date = log.date;
      if (!grouped[date]) {
        grouped[date] = { Breakfast: [], Lunch: [], Dinner: [] };
      }
      grouped[date][capitalize(log.meal_type)].push(log.recipe_name);
    });
    return grouped;
  }, [mealLogs]);

  const getMealsFor = (type) => {
    return mealLog[formattedDate]?.[type] || [];
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-mango mb-5">Track your meals, one bite at a time 🍽️</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 auto-rows-min mb-6">
        {meals.map((meal) => (
          <MealCard
            key={meal}
            title={meal}
            items={getMealsFor(meal)}
            onAddClick={() => {
              setMealType(meal);
              setShowRecipeModal(true);
            }}
            onDeleteClick={(index) => handleDeleteMeal(meal, index)}
          />
        ))}
      </div>
      {showRecipeModal && (
        <AddItemModal
          title={`Add Food to ${mealType}`}
          onClose={handleCloseModal}
          items={mealType === "Snack" ? snacks : recipes}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          onSave={handleSaveSelectedItem}
          saveDisabled={!selectedItem || (mealType === "Snack" && !snackQuantity)}
          renderExtras={() =>
            mealType === "Snack" && (
              <input
                type="number"
                min="1"
                placeholder="Quantity (grams)"
                value={snackQuantity}
                onChange={(e) => setSnackQuantity(e.target.value)}
                className="w-full border p-2 rounded outline-mango"
              />
            )
          }
        />
      )}
    </div>
  );
}
