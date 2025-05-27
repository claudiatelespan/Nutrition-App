import { useContext, useEffect, useState } from "react";
import { ApiContext } from "../../context/ApiContext";
import { format } from "date-fns";

export default function CalorieTrackerCard({reloadChartsKey, selectedDate}) {
  const { fetchCaloriesForDay } = useContext(ApiContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const formattedDate = format(selectedDate, "yyyy-MM-dd");

  useEffect(() => {
    setLoading(true);
    fetchCaloriesForDay(formattedDate)
      .then((res) => {
        setData(res && res.length > 0 ? res[0] : null);
      })
      .finally(() => setLoading(false));
  }, [formattedDate, fetchCaloriesForDay, reloadChartsKey]);

  return (
    <div className="bg-aqua rounded-lg shadow p-6 flex flex-col items-center mb-3 min-h-[180px]">
      <h3 className="text-lg font-bold text-mango mb-2 w-full text-center">Calorie Tracker</h3>
      <div className="text-center mb-3 text-gray-500 w-full">{format(selectedDate, "PPP")}</div>
      {loading ? (
        <span className="text-gray-400">Loading...</span>
      ) : data ? (
        <>
          <div className="flex flex-row justify-center items-center w-full gap-8 mb-2">
            <div className="flex flex-col items-center flex-1">
              <span className="text-[16px] text-gray-600 mb-1">Today</span>
              <span className="text-2xl font-bold text-mango">{data.calories} kcal</span>
            </div>
            <div className="h-12 w-0.5 bg-vintage mx-2 hidden sm:block" />
            <div className="flex flex-col items-center flex-1">
              <span className="text-[16px] text-gray-600 mb-1">Target</span>
              <span className="text-2xl font-bold text-green-700">{data.calorie_target} kcal</span>
            </div>
          </div>
          <div className="w-full flex justify-center mt-2">
            {data.status === "Target atins" && (
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">You have reached your target! 🎉</span>
            )}
            {data.status === "Peste target" && (
              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">You have exceeded your target!</span>
            )}
            {data.status === "Sub target" && (
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">You are below your target.</span>
            )}
          </div>
        </>
      ) : (
        <span className="text-gray-500">No activity logged for this day.</span>
      )}
    </div>
  );
}
