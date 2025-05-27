import { ChevronUpIcon, ChevronDownIcon, ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { DayPicker } from "react-day-picker";
import { format, addDays, subDays } from "date-fns";
import { useState } from "react";
import "react-day-picker/dist/style.css";

export default function DashboardCalendar({ selectedDate, setSelectedDate }) {
  const [showCalendar, setShowCalendar] = useState(false);

  const handlePrevDay = () => setSelectedDate((d) => subDays(d, 1));
  const handleNextDay = () => setSelectedDate((d) => addDays(d, 1));

  return (
    <div className="bg-white rounded-lg p-4 shadow ">
      <div className="flex items-center justify-between">
        <button onClick={handlePrevDay}><ArrowLeftIcon className="h-4 w-4 cursor-pointer" /></button>
        <button
          onClick={() => setShowCalendar((prev) => !prev)}
          className="text-sm font-semibold flex items-center gap-2"
        >
          {format(selectedDate, "PPP")}
          {showCalendar ? (
            <ChevronUpIcon className="h-4 w-4 cursor-pointer" />
          ) : (
            <ChevronDownIcon className="h-4 w-4 cursor-pointer" />
          )}
        </button>
        <button onClick={handleNextDay}><ArrowRightIcon className="h-4 w-4 cursor-pointer"/></button>
      </div>
      <div
        className={`transition-all duration-300 overflow-hidden ${
          showCalendar ? "max-h-[300px]" : "max-h-0"
        }`}
      >
        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            if (date) {
              setSelectedDate(date);
            }
          }}
        />
      </div>
    </div>
  );
}
