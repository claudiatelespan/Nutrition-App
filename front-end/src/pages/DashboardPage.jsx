import { useState, useContext } from "react";
import { DateContext } from "../context/DateContext";
import MealLog from "../components/logs/MealLog";
import CalorieTrackerCard from "../components/charts/CalorieTrackerCard";
import CaloriesEvolutionChart from "../components/charts/CaloriesEvolutionChart";
import CalorieInfoCard from "../components/charts/CalorieInfoCard";
import ActivityLog from "../components/logs/ActivityLog";
import SnackLog from "../components/logs/SnackLog";
import DashboardCalendar from "../components/logs/DashboardCalendar";

export default function DashboardPage() {
  const { selectedDate, setSelectedDate } = useContext(DateContext);
  const [reloadChartsKey, setReloadChartsKey] = useState(0);

  return (
    <div className="p-6 bg-beige min-h-screen mt-16 mx-auto">
      <h1 className="text-3xl font-bold">Your Dashboard</h1>
      <div className="flex flex-col lg:flex-row gap-8 p-5 pl-10 pr-10">
        {/* MAIN CONTENT */}
        <div className="flex-1 space-y-6">
          <MealLog
            setReloadChartsKey={setReloadChartsKey}
            selectedDate={selectedDate}
          />
          <div className="flex flex-row gap-4">
            <div className="flex-1 flex flex-col">
              <CalorieTrackerCard
                reloadChartsKey={reloadChartsKey}
                selectedDate={selectedDate}
              />
              <CalorieInfoCard />
            </div>
            <div className="flex-1 flex flex-col">
              <CaloriesEvolutionChart
                reloadChartsKey={reloadChartsKey}
                selectedDate={selectedDate}
              />
            </div>
          </div>
        </div>
        {/* SIDEBAR */}
        <div className="w-full lg:w-[20rem] flex flex-col gap-6">
          <DashboardCalendar
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
          <SnackLog setReloadChartsKey={setReloadChartsKey} />
          <ActivityLog selectedDate={selectedDate} />
        </div>
      </div>
    </div>
  );
}
