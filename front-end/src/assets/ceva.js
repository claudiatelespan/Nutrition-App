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