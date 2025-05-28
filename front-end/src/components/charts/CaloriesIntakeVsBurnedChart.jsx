import { useContext, useEffect, useState, useMemo } from "react";
import { ApiContext } from "../../context/ApiContext";
import { DateContext } from "../../context/DateContext";
import { format, subDays } from "date-fns";
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer } from "recharts";

export default function CaloriesIntakeVsBurnedChart({ reloadChartsKey }) {
  const { fetchCaloriesIntakeVsBurned } = useContext(ApiContext);
  const { selectedDate } = useContext(DateContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const endDate = format(selectedDate, "yyyy-MM-dd");
  const startDate = format(subDays(selectedDate, 6), "yyyy-MM-dd");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchCaloriesIntakeVsBurned(startDate, endDate)
      .then((res) => {
        if (!cancelled) setData(res || []);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [fetchCaloriesIntakeVsBurned, startDate, endDate, reloadChartsKey]);

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col h-[340px]">
      <h3 className="text-lg font-semibold text-mango mb-2">Calories Intake vs Burned</h3>
      {loading ? (
        <span className="text-gray-400">Loading...</span>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 20, left: -10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} label={{ value: "kcal", angle: -90, position: "insideLeft", fontSize: 12 }} />
            <Tooltip formatter={(value) => `${value} kcal`} />
            <Legend />
            <Bar dataKey="intake" name="Calories Consumed" fill="#C95792" radius={[8,8,0,0]} />
            <Bar dataKey="burned" name="Calories Burned" fill="#7C4585" radius={[8,8,0,0]} />
            <Bar dataKey="total_net" name="Net Calories" fill="#3D365C" radius={[8,8,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
