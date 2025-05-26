import { useContext, useEffect, useState } from "react";
import { DateContext } from "../context/DateContext";
import { ApiContext } from "../context/ApiContext";
import { format, subDays } from "date-fns";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer, Legend } from "recharts";

export default function CaloriesEvolutionChart() {
  const { selectedDate } = useContext(DateContext);
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
  }, [startDate, endDate, fetchCaloriesLog]);

  const calorieTarget = data.length > 0 ? data[0].calorie_target : null;

  return (
    <div className="bg-white rounded-lg p-4 shadow mb-4">
      <h3 className="font-semibold text-lg mb-2 text-mango">
        Evoluție calorii zilnice (ultimele 7 zile)
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
              formatter={(value, name) => [`${value} kcal`, name === "calories" ? "Calorii" : "Target"]}
              labelFormatter={label => `Ziua: ${label}`}
            />
            <Legend />
            <Line type="monotone" dataKey="calories" stroke="#03A791" strokeWidth={2} name="Calorii ingerate" dot />
            {calorieTarget && (
              <ReferenceLine y={calorieTarget} label="Target" stroke="#30A46C" strokeDasharray="4 4" />
            )}
          </LineChart>
        </ResponsiveContainer>
      )}
      {data.length > 0 && (
        <div className="mt-4 text-sm text-center">
          {data[data.length - 1].status === "Target atins" && (
            <span className="text-green-600 font-semibold">Ai atins targetul caloric azi! 🎉</span>
          )}
          {data[data.length - 1].status === "Peste target" && (
            <span className="text-red-600 font-semibold">Ai depășit targetul caloric azi!</span>
          )}
          {data[data.length - 1].status === "Sub target" && (
            <span className="text-yellow-600 font-semibold">Nu ai atins încă targetul caloric azi.</span>
          )}
        </div>
      )}
    </div>
  );
}
