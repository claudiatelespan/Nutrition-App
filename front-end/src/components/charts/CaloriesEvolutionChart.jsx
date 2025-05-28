import { useContext, useEffect, useState } from "react";
import { ApiContext } from "../../context/ApiContext";
import { format, subDays } from "date-fns";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer, Legend } from "recharts";

export default function CaloriesEvolutionChart({reloadChartsKey, selectedDate}) {
  const { fetchCaloriesLog } = useContext(ApiContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const endDate = format(selectedDate, "yyyy-MM-dd");
  const startDate = format(subDays(selectedDate, 6), "yyyy-MM-dd");

  useEffect(() => {
    setLoading(true);
    fetchCaloriesLog(startDate, endDate)
      .then((res) => setData(res || []))
      .finally(() => setLoading(false));
  }, [startDate, endDate, fetchCaloriesLog, reloadChartsKey]);

  const calorieTarget = data.length > 0 ? data[0].calorie_target : null;

  return (
    <div className="bg-white rounded-lg p-5 h-full shadow">
      <h3 className="text-lg font-bold mb-2 text-mango">
        Daily Calorie Evolution (last 7 days)
      </h3>
      {loading ? (
        <div className="text-gray-400 py-8 text-center">Loading...</div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} label={{ value: "kcal", angle: -90, position: "insideLeft" }} />
            <Tooltip
              formatter={(value) => [`${value} kcal`, "Calories"]}
              labelFormatter={label => `Day: ${label}`}
            />
            <Legend />
            <Line type="monotone" dataKey="calories" stroke="#03A791" strokeWidth={2} name="Calories Consumed" dot />
            {calorieTarget && (
              <ReferenceLine y={calorieTarget} label="Target" stroke="#30A46C" strokeDasharray="4 4" />
            )}
          </LineChart>
        </ResponsiveContainer>
      )}
      {data.length > 0 && (
        <div className="mt-4 text-sm text-center">
          {data[data.length - 1].status === "Target atins" && (
            <span className="text-green-600 font-semibold">You have reached your calorie target today! 🎉</span>
          )}
          {data[data.length - 1].status === "Peste target" && (
            <span className="text-red-600 font-semibold">You have exceeded your calorie target today!</span>
          )}
          {data[data.length - 1].status === "Sub target" && (
            <span className="text-yellow-600 font-semibold">You haven't reached your calorie target yet.</span>
          )}
        </div>
      )}
    </div>
  );
}
