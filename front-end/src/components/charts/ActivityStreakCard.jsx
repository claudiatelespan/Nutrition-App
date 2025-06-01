import { useEffect, useState, useContext } from "react";
import { ApiContext } from "../../context/ApiContext";

export default function ActivityStreakCard({ reloadChartsKey }) {
  const { fetchActivityStreak } = useContext(ApiContext);
  const [streak, setStreak] = useState(null);

  useEffect(() => {
    fetchActivityStreak().then(data => setStreak(data.current_streak_days));
  }, [fetchActivityStreak, reloadChartsKey]);

  return (
    <div className="bg-white rounded-xl p-5 shadow text-center">
      <h3 className="text-lg font-bold text-vintage mb-1">🏆 Current Activity Streak</h3>
      <div className="text-4xl font-bold text-mango">{streak ?? "—"}</div>
      <p className="text-sm text-gray-500 mt-1">Days with Physical Activity in a row</p>
    </div>
  );
}
