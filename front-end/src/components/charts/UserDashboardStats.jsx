import { useEffect, useState, useContext } from "react";
import { ApiContext } from "../../context/ApiContext";

function TopList({ title, items }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md h-fit">
      <h3 className="text-lg font-bold text-mango mb-4">{title}</h3>
      <ul className="space-y-3 text-gray-800 text-sm">
        {items.map((item, index) => (
          <li
            key={index}
            className="flex justify-between items-center border-b last:border-none pb-2"
          >
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-mango text-white rounded-full text-xs font-bold flex items-center justify-center">
                {index + 1}
              </span>
              <span className="font-medium">
                {item.category || item.cuisine}
              </span>
            </div>
            <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1">
            {item.avg_rating ? (
                <>
                {item.avg_rating.toFixed(1)} <span className="text-yellow-500">★</span>
                </>
            ) : (
                item.count
            )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}


export default function UserDashboardStats({ reloadChartsKey }) {
  const { fetchTopMealCategories, fetchTopCuisines } = useContext(ApiContext);
  const [mealCategories, setMealCategories] = useState([]);
  const [cuisines, setCuisines] = useState([]);

  useEffect(() => {
    fetchTopMealCategories().then(setMealCategories);
    fetchTopCuisines().then(setCuisines);
  }, [fetchTopMealCategories, fetchTopCuisines, reloadChartsKey]);

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <TopList title="Most Frequent Meal Categories" items={mealCategories} />
      <TopList title="Top Cuisine Preferences (based on your ratings)" items={cuisines} />
    </div>
  );
}
