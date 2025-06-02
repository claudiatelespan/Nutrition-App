import { useEffect, useState, useContext } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ApiContext } from "../../context/ApiContext";
import EmptyChartPlaceholder from "./EmptyChartPlaceholder";

const COLORS = ["#FFA500", "#FF8C00", "#FFD700", "#FF6347", "#FFA07A"];

export default function TopActivitiesChart({ reloadChartsKey }) {
  const { fetchTopActivityTypes } = useContext(ApiContext);
  const [data, setData] = useState([]);
  const dynamicHeight = Math.max(150, data.length * 50);

  useEffect(() => {
    fetchTopActivityTypes().then((res) => {
        if (res?.top_activity_types && Array.isArray(res.top_activity_types)) {
        setData(res.top_activity_types);
        } else {
        console.warn("Invalid response for top activity types", res);
        setData([]);
        }
    });
  }, [fetchTopActivityTypes, reloadChartsKey]);

  return (
    <div className="bg-white rounded-xl p-5 shadow">
      <h3 className="text-lg font-bold text-vintage mb-3 flex items-center gap-2">
        🔥 Most Frequent Activities
      </h3>
      {data.length === 0 ? (
        <EmptyChartPlaceholder emoji="🏃‍♂️📊" comp= "physical activities" chart="Most Frequent Activities"/>
      ) : (
        <ResponsiveContainer width="100%" height={dynamicHeight}>
          <BarChart
            data={data}
            layout="vertical"
            barCategoryGap={0}
            barSize={24}
            margin={{ top: 0, bottom: 0, left: 10, right: 20 }}
          >
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={90} />
            <Tooltip
              formatter={(value) => [`${value} times`, "Count"]}
              cursor={{ fill: "#f0f0f0" }}
            />
            <Bar dataKey="count" radius={[0, 6, 6, 0]}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
      
    </div>


  );
}
