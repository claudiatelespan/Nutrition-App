import { useMemo, useState, useContext } from "react";
import { format, addDays, subDays } from "date-fns";
import { DayPicker } from "react-day-picker";
import { ChevronUpIcon, ChevronDownIcon, ArrowLeftIcon, ArrowRightIcon} from "@heroicons/react/24/outline";
import "react-day-picker/dist/style.css";
import { ApiContext } from "../context/ApiContext";
import { DateContext } from "../context/DateContext";
import  ActivityLog from "./ActivityLog";
import MealCard from "./MealCard";
import AddItemModal from "./AddItemModal";
import CalorieTrackerCard from "./CalorieTrackerCard";
import CaloriesEvolutionChart from "./CaloriesEvolutionChart";
import CalorieInfoCard from "./CalorieInfoCard";
import toast from "react-hot-toast";

export default function MealLog() {
  const { selectedDate, setSelectedDate } = useContext(DateContext);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [mealType, setMealType] = useState("");
  const meals = ["Breakfast", "Lunch", "Dinner"];
  const [selectedItem, setSelectedItem] = useState("");
  const [snackQuantity, setSnackQuantity] = useState("");
  const { recipes, snacks, logMeal, logSnack, deleteMealLog, deleteSnackLog, mealLogs, snackLogs } = useContext(ApiContext);

  const formattedDate = format(selectedDate, "yyyy-MM-dd");

  const handlePrevDay = () => setSelectedDate((d) => subDays(d, 1));
  const handleNextDay = () => setSelectedDate((d) => addDays(d, 1));

  const handleSaveSelectedItem = async () => {
    if (!selectedItem) return;
  
    if (mealType === "Snack" && (!snackQuantity || snackQuantity <= 0)) {
      toast.error("Please enter a valid quantity greater than 0.");
      setSnackQuantity("");
      return;
    } 

    try {
      if (mealType === "Snack") {
        await logSnack(selectedItem.name, snackQuantity || 1, formattedDate);
      } else {
        await logMeal(selectedItem.name, formattedDate, mealType);
      }
      setSelectedItem("");
      setSnackQuantity("");
      setShowRecipeModal(false);
    } catch (err) {
      console.error("Save error:", err);
    }
  };
  
  const handleCloseModal = () => {
    setShowRecipeModal(false);
    setSelectedItem(null);
    setSnackQuantity("");
  };  

  const handleDeleteMeal = (type, index) => {
    const item = getMealsFor(type)[index];
    const logId = findLogId(type, item);
  
    if (logId) {
      if (type === "Snack") {
        deleteSnackLog(logId);
      } else {
        deleteMealLog(logId);
      }
    }
  };

  const findLogId = (type, item) => {
    const logs = type === "Snack" ? snackLogs : mealLogs;
    const date = formattedDate;
  
    if (type === "Snack") {
      const [snackName, qty] = item.split(" (");
      return logs.find(
        (log) => log.date === date && log.snack_name === snackName.trim()
      )?.id;
    } else {
      return logs.find(
        (log) => log.date === date && capitalize(log.meal_type) === type && log.recipe_name === item
      )?.id;
    }
  };
  
  const getMealsFor = (type) => {
    return mealLog[formattedDate]?.[type] || [];
  };

  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  const mealLog = useMemo(() => {
    const grouped = {};
    mealLogs.forEach(log => {
        const date = log.date;
        if (!grouped[date]) {
        grouped[date] = { Breakfast: [], Lunch: [], Dinner: [], Snack: [] };
        }
        grouped[date][capitalize(log.meal_type)].push(log.recipe_name);
    });
    snackLogs.forEach(log => {
        const date = log.date;
        if (!grouped[date]) {
        grouped[date] = { Breakfast: [], Lunch: [], Dinner: [], Snack: [] };
        }
        grouped[date]["Snack"].push(`${log.snack_name} (${log.quantity} grams)`);
    });
    return grouped;
   }, [mealLogs, snackLogs]);

  return (
    <div className="p-6 bg-beige space-y-8 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-mango">Track your meals, one bite at a time 🍽️</h2>

        <div className="flex flex-col lg:flex-row gap-8">
        
         {/* ZONA PRINCIPALĂ: Meals + Activity */}
         <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 auto-rows-min">
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

<div className="md:col-span-3 flex flex-row gap-4 items-stretch">
  <div className="flex-1 min-w-0 flex flex-col h-full">
    <CalorieTrackerCard />
    <CalorieInfoCard />
  </div>
  <div className="flex-1 min-w-0 h-full flex flex-col">
    <CaloriesEvolutionChart />
  </div>
</div>

          </div>

         {/* ZONA SECUNDARĂ: Calendar + Snacks */}
            <div className="w-full lg:w-[20rem] flex flex-col gap-6">
                <div className="bg-white rounded-lg p-4 shadow w-[330px]">
                    <div className="flex items-center justify-between">
                        <button onClick={handlePrevDay}><ArrowLeftIcon className="h-4 w-4 cursor-pointer    "/></button>
                        <button
                            onClick={() => setShowCalendar((prev) => !prev)}
                            className="text-sm font-semibold flex items-center gap-2"
                        >
                            {format(selectedDate, "PPP")}
                            {showCalendar ? (
                            <ChevronUpIcon className="h-4 w-4 cursor-pointer" />
                            ) : (
                            <ChevronDownIcon className="h-4 w-4 cursor-pointer" />
                            )}
                        </button>
                        <button onClick={handleNextDay}><ArrowRightIcon className="h-4 w-4 cursor-pointer"/></button>
                    </div>
                    <div
                        className={`transition-all duration-300 overflow-hidden ${
                            showCalendar ? "max-h-[300px]" : "max-h-0"
                        }`}
                        >
                        <DayPicker
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => {
                                if (date) {
                                    setSelectedDate(date);
                                }
                            }}
                        />
                    </div>
                </div>

                <MealCard
                    title="Snacks"
                    items={getMealsFor("Snack")}
                    onAddClick={() => {
                        setMealType("Snack");
                        setShowRecipeModal(true);
                    }}
                    onDeleteClick={(index) => handleDeleteMeal("Snack", index)}
                />

                <ActivityLog />
            </div>
        </div>

        {/* Modal */}
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
