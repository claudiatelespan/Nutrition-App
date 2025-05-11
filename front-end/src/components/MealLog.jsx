import { useMemo, useState, useContext } from "react";
import { format, addDays, subDays } from "date-fns";
import { DayPicker } from "react-day-picker";
import { MagnifyingGlassIcon, TrashIcon, ChevronUpIcon, ChevronDownIcon, ArrowLeftIcon, ArrowRightIcon} from "@heroicons/react/24/outline";
import "react-day-picker/dist/style.css";
import { ApiContext } from "../context/ApiContext";
import { DateContext } from "../context/DateContext";
import  ActivityLog from "./ActivityLog";
import MealCard from "./MealCard";

export default function MealLog() {
  const { selectedDate, setSelectedDate } = useContext(DateContext);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [mealType, setMealType] = useState("");
  const [search, setSearch] = useState("");
  const meals = ["Breakfast", "Lunch", "Dinner"];
  const [selectedItem, setSelectedItem] = useState("");
  const [snackQuantity, setSnackQuantity] = useState("");
  const { recipes, snacks, logMeal, logSnack, deleteMealLog, deleteSnackLog, mealLogs, snackLogs } = useContext(ApiContext);

  const filteredRecipes = recipes.map(r => r.name).filter((r) =>
    r.toLowerCase().includes(search.toLowerCase())
  );
  
  const filteredSnacks = snacks.map(r => r.name).filter((r) =>
    r.toLowerCase().includes(search.toLowerCase())
  );

  const formattedDate = format(selectedDate, "yyyy-MM-dd");

  const handlePrevDay = () => setSelectedDate((d) => subDays(d, 1));
  const handleNextDay = () => setSelectedDate((d) => addDays(d, 1));

  const handleSaveSelectedItem = async () => {
    if (!selectedItem) return;
  
    try {
      if (mealType === "Snack") {
        await logSnack(selectedItem, snackQuantity || 1, formattedDate);
      } else {
        await logMeal(selectedItem, formattedDate, mealType);
      }
    
      setSelectedItem("");
      setSnackQuantity("");
      setSearch("");
      setShowRecipeModal(false);
    } catch (err) {
      console.error("Save error:", err);
    }
  };
  
  const handleCloseModal = () => {
    setShowRecipeModal(false);
    setSelectedItem(null);
    setSnackQuantity("");
    setSearch("");
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
        const unit = snacks.find(s => s.name === log.snack_name)?.unit || "";
        grouped[date]["Snack"].push(`${log.snack_name} (${log.quantity} ${unit})`);
    });
    return grouped;
   }, [mealLogs, snackLogs]);

   const selectedSnack = mealType === "Snack"
  ? snacks.find((s) => s.name === selectedItem)
  : null;

  console.log(mealLog);

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

                <div className="md:col-span-3 bg-white rounded-lg shadow flex flex-col">
                    <ActivityLog />
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

            </div>
        </div>

        {/* Modal */}
        {showRecipeModal && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white p-6 w-full max-w-md rounded shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-bold text-lg">Add Food to {mealType}</h2>
                        <button className="cursor-pointer hover:text-hover" onClick={handleCloseModal}>✕</button>
                    </div>
                    <div className="relative w-full max-w-xl">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-4 h-5 w-5 text-gray-600" />
                        <input
                            type="text"
                            placeholder="Search recipes..."
                            value={search}  
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full border border-gray-400 pl-10 p-2 rounded mb-4 outline-mango"
                        />
                    </div>
                    <div className="max-h-60 overflow-y-auto space-y-2">
                        {(mealType === "Snack" ? filteredSnacks : filteredRecipes).map((item) => (
                            <div
                                key={item}
                                className={`p-2 border border-gray-400 rounded cursor-pointer transition-colors ${
                                selectedItem === item
                                    ? "bg-mango text-white"
                                    : "hover:bg-mango hover:text-white"
                                }`}
                                onClick={() => setSelectedItem(item)}
                            >
                                {item}
                            </div>
                        ))}

                        {(mealType === "Snack" ? filteredSnacks : filteredRecipes).length === 0 && (
                        <p className="text-sm text-gray-500">No items found.</p>
                        )}
                    </div>

                    {mealType === "Snack" && selectedItem && (
                        <input
                            type="number"
                            min="1"
                            placeholder={`Quantity (${selectedSnack?.unit || ""})`}
                            value={snackQuantity}
                            onChange={(e) => setSnackQuantity(e.target.value)}
                            className="w-full border p-2 rounded mt-4"
                        />
                    )}
                    
                    <div className="flex justify-end mt-4">
                        <button
                            onClick={handleSaveSelectedItem}
                            disabled={!selectedItem}
                            className={`mt-4 px-4 py-2 rounded cursor-pointer transition-all duration-200 ${
                                selectedItem
                                ? "bg-mango text-white hover:bg-orange-500"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                        >
                        Save
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
}
