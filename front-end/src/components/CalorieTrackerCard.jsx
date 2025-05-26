import { useContext, useEffect, useState } from "react";
import { DateContext } from "../context/DateContext";
import { ApiContext } from "../context/ApiContext";
import { format } from "date-fns";

export default function CalorieTrackerCard() {
  const { selectedDate } = useContext(DateContext);
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
  }, [formattedDate, fetchCaloriesForDay]);

  return (
    <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center mb-4">
      <h3 className="text-lg font-bold text-mango mb-2">Calorie Tracker</h3>
      <div className="text-center mb-2 text-gray-500">{format(selectedDate, "PPP")}</div>
      {loading ? (
        <span className="text-gray-400">Loading...</span>
      ) : data ? (
        <>
          <div className="flex flex-col gap-2 items-center mb-2">
            <span className="text-xl font-semibold text-mango">
              {data.calories} kcal
            </span>
            <span className="text-sm text-gray-600">
              Target: <span className="font-semibold text-green-700">{data.calorie_target} kcal</span>
            </span>
          </div>
          {data.status === "Target atins" && (
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">Ai atins targetul! 🎉</span>
          )}
          {data.status === "Peste target" && (
            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">Ai depășit targetul!</span>
          )}
          {data.status === "Sub target" && (
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">Ești sub target.</span>
          )}
        </>
      ) : (
        <span className="text-gray-500">Nicio activitate înregistrată pentru această zi.</span>
      )}
    </div>
  );
}
