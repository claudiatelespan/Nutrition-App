import { useEffect, useState, useContext } from "react";
import { ApiContext } from "../../context/ApiContext";
import EmptyChartPlaceholder from "./EmptyChartPlaceholder";

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

function StatBlock({ title, value, unit, description, emoji }) {
  return (
    <div className="flex-1 bg-white p-5 rounded-xl shadow text-center flex flex-col justify-center gap-2">
      <div className="text-lg font-bold text-vintage flex justify-center items-center gap-2">
        {emoji} {title}
      </div>
      <div className="text-3xl font-bold text-mango">
        {value}
        <span className="text-base text-gray-500"> {unit}</span>
      </div>
      <div className="text-sm text-gray-500">{description}</div>
    </div>
  );
}


export default function UserDashboardStats({ reloadChartsKey }) {
  const { fetchTopMealCategories, fetchTopCuisines } = useContext(ApiContext);
  const { fetchAverageSnacksPerDay, fetchAverageActivityDuration } = useContext(ApiContext);
  const [mealCategories, setMealCategories] = useState([]);
  const [cuisines, setCuisines] = useState([]);
  const [avgSnacks, setAvgSnacks] = useState(null);
  const [avgActivity, setAvgActivity] = useState(null);

  useEffect(() => {
    fetchTopMealCategories().then(setMealCategories);
    fetchTopCuisines().then(setCuisines);
    fetchAverageSnacksPerDay().then(data =>
    setAvgSnacks(data.average_snacks_per_day)
    );
    fetchAverageActivityDuration().then(data =>
    setAvgActivity(data.average_activity_minutes_per_day)
    );
  }, [fetchTopMealCategories, fetchTopCuisines, fetchAverageActivityDuration, fetchAverageSnacksPerDay, reloadChartsKey]);

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {mealCategories.length===0 ? (
        <div className="bg-white p-6 rounded-xl shadow-md h-fit">
          <h3 className="text-lg font-bold text-mango mb-4">Most Frequent Meal Categories</h3>
          <EmptyChartPlaceholder emoji="🍽️📊" comp="meals" chart="Most Frequent Meal Categories"/>
        </div>
      ) : (
      <TopList title="Most Frequent Meal Categories" items={mealCategories} />
      )}

      {cuisines.length===0 ? (
        <div className="bg-white p-6 rounded-xl shadow-md h-fit">
          <h3 className="text-lg font-bold text-mango">Top Cuisine Preferences (based on your ratings)</h3>
          <EmptyChartPlaceholder emoji="🍽️⭐📊" act="rating" comp="meals" chart="Top Cuisine Preferences"/>
        </div>
      ) : (
      <TopList title="Top Cuisine Preferences (based on your ratings)" items={cuisines} />
      )}

      <div className="flex flex-col gap-4">
        <StatBlock
        title="Average Snacks per Day"
        value={avgSnacks !== null ? avgSnacks : "—"}
        unit="snacks"
        description={`You have on average ${avgSnacks ?? "—"} snacks per day.`}
        emoji="🍪"
        />
        <StatBlock
        title="Average Physical Activity per Day"
        value={avgActivity !== null ? avgActivity.toFixed(1) : "—"}
        unit="min"
        description={`You exercise around ${avgActivity ?? "—"} minutes daily.`}
        emoji="🏃‍♂️"
        />
      </div>
    </div>
  );
}
