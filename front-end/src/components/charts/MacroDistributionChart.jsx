import { useContext, useEffect, useState } from "react";
import { ApiContext } from "../../context/ApiContext";
import { DateContext } from "../../context/DateContext";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { format } from "date-fns";

const COLORS = ["#FFB347", "#91E5A9", "#FF7C7C", "#ACD8E6", "#C299FC"];

const macroLabels = [
  { key: "protein", name: "Protein", color: COLORS[0] },
  { key: "carbs", name: "Carbs", color: COLORS[1] },
  { key: "fat", name: "Fat", color: COLORS[2] },
  { key: "fiber", name: "Fiber", color: COLORS[3] },
  { key: "sugar", name: "Sugar", color: COLORS[4] },
];

export default function MacroDistributionChart({ selectedDate, reloadChartsKey }) {
  const { fetchMacroDistribution } = useContext(ApiContext);
  const date = selectedDate;
  const formattedDate = format(date, "yyyy-MM-dd");
  const [data, setData] = useState(null);

  useEffect(() => {
    const getMacroDist = async () => {
      const res = await fetchMacroDistribution(formattedDate);
      setData(res);
    };
    getMacroDist();
  }, [formattedDate, reloadChartsKey, fetchMacroDistribution]);

  if (!data)
    return (
      <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center justify-center min-h-[300px] w-full">
        <span className="text-gray-400">Loading...</span>
      </div>
    );

  const chartData = macroLabels.map((macro) => ({
    name: macro.name,
    value: data[`${macro.key}_percent`] || 0,
    grams: data[`${macro.key}_g`] || 0,
    color: macro.color,
  })).filter(item => item.value > 0);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null;

    return (
        <div className="bg-white rounded-lg shadow p-2">
        {payload.map((entry, i) => (
            <div key={i} style={{ color: entry.payload.color, fontWeight: 600 }}>
            {entry.name}: {entry.value}%
            </div>
        ))}
        </div>
    );
  };


  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center min-h-[340px] w-full">
      <h3 className="text-lg font-bold text-mango mb-2">Macronutrient Calorie Distribution</h3>
        <PieChart width={320} height={250}>
          <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="47%"
              cy="50%"
              innerRadius={30}
              outerRadius={90}
              label={({ value }) => `${value}%`}
              style={{fontWeight:600}}
          >
              {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
          </Pie>
          <Tooltip content={<CustomTooltip />}  />
        </PieChart>
      
      <div className="flex flex-col gap-1 text-sm">
        {chartData.map((item, idx) => (
          <span key={item.name} style={{ color: item.color }}>
            <span className="font-semibold">{item.name}:</span>{" "}
            {item.grams}g ({item.value}%)
          </span>
        ))}
      </div>
      <span className="text-xs mt-2 text-gray-400">Values in grams. Based on calories: Protein/Carbs/Sugar (4kcal/g), Fat (9kcal/g), Fiber (2kcal/g).</span>
    </div>
  );
}
