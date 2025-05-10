import { useState, useContext } from "react";
import { format, addDays, subDays } from "date-fns";
import { DayPicker } from "react-day-picker";
import { MagnifyingGlassIcon, TrashIcon, ChevronUpIcon, ChevronDownIcon, ArrowLeftIcon, ArrowRightIcon} from "@heroicons/react/24/outline";
import "react-day-picker/dist/style.css";
import { ApiContext } from "../context/ApiContext";

export default function MealLog() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [mealType, setMealType] = useState("");
  const [search, setSearch] = useState("");
  const [mealLog, setMealLog] = useState({});
  const { recipes, snacks } = useContext(ApiContext);
  const meals = ["Breakfast", "Lunch", "Dinner"];
  const [selectedItem, setSelectedItem] = useState("");
  const [snackQuantity, setSnackQuantity] = useState("");
  const { logMeal, logSnack } = useContext(ApiContext);

  
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
  
      const itemToAdd =
        mealType === "Snack"
          ? `${selectedItem} (${snackQuantity || 1})`
          : selectedItem;
  
      setMealLog((prev) => {
        const dayMeals = prev[formattedDate] || {
          Breakfast: [],
          Lunch: [],
          Dinner: [],
          Snack: [],
        };
  
        return {
          ...prev,
          [formattedDate]: {
            ...dayMeals,
            [mealType]: [...dayMeals[mealType], itemToAdd],
          },
        };
      });
  
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
    setMealLog((prev) => {
      const updated = [...(prev[formattedDate]?.[type] || [])];
      updated.splice(index, 1);
      return {
        ...prev,
        [formattedDate]: {
          ...prev[formattedDate],
          [type]: updated,
        },
      };
    });
  };

  const getMealsFor = (type) => {
    return mealLog[formattedDate]?.[type] || [];
  };

  return (
    <div className="p-6 bg-beige min-h-screen space-y-8 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-mango">Track your meals, one bite at a time 🍽️</h2>

        <div className="flex justify-between gap-8 flex-wrap">
        
            {/* Left: Meal Cards */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {meals.map((meal) => (
                    <div key={meal} className="bg-white rounded-lg p-4 shadow flex flex-col gap-2 w-full h-[13rem]">
                        <h3 className="text-mango font-semibold">{meal}</h3>
                        {getMealsFor(meal).length === 0 ? (
                            <button
                            className="bg-gray-100 border border-dashed border-gray-400 rounded-lg h-28 flex items-center justify-center text-gray-500 transform transition-transform duration-200 hover:scale-103 cursor-pointer"
                            onClick={() => {
                                setMealType(meal);
                                setShowRecipeModal(true);
                            }}
                            >
                            + Add {meal}
                            </button>
                        ) : (
                            <ul className="space-y-1 text-sm text-gray-800 overflow-auto">
                            {getMealsFor(meal).map((r, i) => (
                                <li key={i} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                                {r}
                                <TrashIcon className="h-4 w-4 text-orange-500 transform transition-transform duration-200 hover:scale-110 cursor-pointer" onClick={() => handleDeleteMeal(meal, i)} />
                                </li>
                            ))}
                            <button
                                className="text-sm font-semibold text-mango mt-2 underline transition ease-in-out hover:text-orange-500 cursor-pointer"
                                onClick={() => {
                                setMealType(meal);
                                setShowRecipeModal(true);
                                }}
                            >
                                + Add more
                            </button>
                            </ul>
                        )}
                    </div>
                ))}
            </div>

            {/* Right: Calendar + Snacks */}
            <div className="w-full md:w-[20rem] flex flex-col gap-6">
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
                                    setShowCalendar(false);
                                }
                            }}
                        />
                    </div>
                </div>

                <div className="bg-white rounded-lg p-4 flex flex-col shadow h-[9rem]">
                    <h3 className="text-mango font-semibold mb-2">Snacks</h3>
                    {getMealsFor("Snack").length === 0 ? (
                        <button
                            className="bg-gray-100 border border-dashed border-gray-400 rounded-lg h-20 flex items-center justify-center text-gray-500 w-full transform transition-transform duration-200 hover:scale-103 cursor-pointer"
                            onClick={() => {
                            setMealType("Snack");
                            setShowRecipeModal(true);
                            }}
                        >
                        + Add Snack
                        </button>
                    ) : (
                        <ul className="space-y-1 text-sm text-gray-800 overflow-auto">
                            {getMealsFor("Snack").map((r, i) => (
                            <li
                                key={i}
                                className="flex justify-between items-center bg-gray-100 p-2 rounded"
                            >
                                {r}
                                <TrashIcon
                                className="h-4 w-4 text-orange-500 transform transition-transform duration-200 hover:scale-110 cursor-pointer"
                                onClick={() => handleDeleteMeal("Snack", i)}
                                />                                
                            </li>
                            ))}
                            <button
                                className="text-sm font-semibold text-mango mt-2 underline transition ease-in-out hover:text-orange-500 cursor-pointer"
                                onClick={() => {
                                setMealType("Snack");
                                setShowRecipeModal(true);
                            }}
                            >
                            + Add more
                            </button>
                        </ul>
                    )}
                </div>
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
                            placeholder="Quantity"
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
