import { useState, useContext, useMemo } from "react";
import { ApiContext } from "../context/ApiContext";
import { TrashIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { DateContext } from "../context/DateContext";
import { format } from "date-fns";

export default function ActivityLog() {
  const [showModal, setShowModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState("");
  const [intensity, setIntensity] = useState("moderate");
  const [duration, setDuration] = useState("");
  const [search, setSearch] = useState("");

  const { selectedDate } = useContext(DateContext);
  const { activities, activityLogs, logActivity, deleteActivityLog } = useContext(ApiContext);
  const formattedDate = format(selectedDate, "yyyy-MM-dd");

  const filteredActivities = activities.map(a => a.name).filter(name =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  const logsForDate = useMemo(() => {
    return activityLogs.filter(log => log.date === formattedDate);
  }, [activityLogs, formattedDate]);

  const handleSave = async () => {
    await logActivity(selectedActivity, formattedDate, intensity, parseInt(duration));
    setSelectedActivity("");
    setIntensity("moderate");
    setDuration("");
    setSearch("");
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedActivity(null);
    setDuration("");
    setIntensity("moderate");
    setSearch("");
  };  

  return (
    <div className="bg-white p-4 rounded shadow h-[13rem]">
      <h3 className="text-mango font-semibold mb-2">Physical Activity</h3>

      {logsForDate.length === 0 ? (
        <button onClick={() => setShowModal(true)} className="border border-dashed p-4 w-full text-gray-500">
          + Add Activity
        </button>
      ) : (
        <>
          <ul className="space-y-1 text-sm text-gray-800 overflow-y-auto max-h-30 pr-1">
            {logsForDate.map(log => (
              <li key={log.id} className="flex justify-between bg-gray-100 p-2 rounded">
                {log.activity_name} – {log.duration_minutes} min ({log.intensity}) – {log.calories} kcal
                <TrashIcon className="h-4 w-4 text-orange-500 cursor-pointer transform transition-transform duration-200 hover:scale-110" onClick={() => deleteActivityLog(log.id)} />
              </li>
            ))}
          </ul>
          <button onClick={() => setShowModal(true)} className="mt-2 text-sm underline font-semibold text-mango transition ease-in-out hover:text-orange-500 cursor-pointer">
            + Add more
          </button>
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-md shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-bold text-lg">Add Physical Activity</h2>
                    <button className="cursor-pointer hover:text-hover" onClick={handleCloseModal}>✕</button>
                </div>
                <div className="relative w-full max-w-xl">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-4 h-5 w-5 text-gray-600" />
                    <input
                        type="text"
                        placeholder="Search recipes..."
                        value={search}  
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full border border-gray-400 pl-10 p-2 rounded mb-4 outline-mango"
                    />
                </div>

            <div className="max-h-60 mb-5 bg-almostwhite border border-gray-300 rounded-xl p-5 overflow-y-auto">
              {filteredActivities.map(name => (
                <div
                  key={name}
                  className={`p-2 border border-gray-400 rounded cursor-pointer mb-1 ${
                    selectedActivity === name ? "bg-mango text-white" : "hover:bg-mango hover:text-white"
                  }`}
                  onClick={() => setSelectedActivity(name)}
                >
                  {name}
                </div>
              ))}
            </div>

            {selectedActivity && (
                <div className={`flex flex-col gap-4 transition-all duration-1000 transform ${
                    selectedActivity ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                  }`}>
                    <div>
                    <label className="block text-sm font-medium mb-1">Effort Level</label>
                    <select
                        value={intensity}
                        onChange={e => setIntensity(e.target.value)}
                        className="w-full border border-gray-400 p-2 rounded outline-mango"
                    >
                        <option value="low">Light</option>
                        <option value="moderate">Moderate</option>
                        <option value="high">High</option>
                    </select>
                    </div>

                    <div>
                    <label className="block text-sm font-medium mb-1">Duration (min)</label>
                    <div className="flex items-center gap-2">
                        <input
                        required
                        type="number"
                        min="1"
                        value={duration}
                        onChange={e => setDuration(e.target.value)}
                        className="w-full border border-gray-400 p-2 rounded outline-mango"
                        />
                    </div>
                    </div>
                </div>
            )}

            <div className="flex justify-end mt-4">
              <button
                onClick={handleSave}
                disabled={!selectedActivity || !duration}
                className={`px-4 py-2 rounded ${
                  selectedActivity ? "bg-mango text-white cursor-pointer hover:bg-orange-500" : "bg-gray-300 text-gray-500"
                }`}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
