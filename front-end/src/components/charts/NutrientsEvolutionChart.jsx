import { useContext, useEffect, useState, useCallback } from "react";
import { DateContext } from "../../context/DateContext";
import { ApiContext } from "../../context/ApiContext";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, subDays } from "date-fns";

export default function NutrientsEvolutionChart({ reloadChartsKey }) {
  const { selectedDate } = useContext(DateContext);
  const { fetchNutrientsLog } = useContext(ApiContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const end = format(selectedDate, "yyyy-MM-dd");
  const start = format(subDays(selectedDate, 6), "yyyy-MM-dd");

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchNutrientsLog(start, end);
      setData(res);
    } catch (e) {
      setData([]);
    }
    setLoading(false);
  }, [fetchNutrientsLog, start, end, reloadChartsKey]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="bg-white rounded-lg shadow p-4 flex-1 min-w-0 flex flex-col" style={{ height: 340 }}>
      <h3 className="text-lg font-bold text-mango mb-2">Daily Macronutrients</h3>
      {loading ? (
        <div className="flex-1 flex items-center justify-center text-gray-400">Loading...</div>
      ) : (
        <ResponsiveContainer width="100%" height="90%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis 
                tick={{ fontSize: 12 }}
                label={{ value: "grams", angle: -90, position: "insideLeft", fontSize: 12 }}
            />
            <Tooltip formatter={(value) => `${value} g`}/>
            <Legend verticalAlign="top" height={36} />
            <Area type="monotone" dataKey="protein" stackId="1" name="Protein" stroke="#ed9e21" fill="#FFD69C" />
            <Area type="monotone" dataKey="carbohydrates" stackId="1" name="Carbohydrates" stroke="#82ca9d" fill="#CAF9DB" />
            <Area type="monotone" dataKey="fat" stackId="1" name="Fat" stroke="#c599b6" fill="#c599b6" />
            <Area type="monotone" dataKey="sugar" stackId="1" name="Sugar" stroke="#e6b2ba" fill="#FDE2E6" />
            <Area type="monotone" dataKey="fiber" stackId="1" name="Fiber" stroke="#8884d8" fill="#e1e7ef" />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
