import { useState, useContext, useMemo } from "react";
import { ApiContext } from "../context/ApiContext";
import { TrashIcon } from "@heroicons/react/24/outline";
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

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-mango font-semibold mb-2">Physical Activity</h3>

      {logsForDate.length === 0 ? (
        <button onClick={() => setShowModal(true)} className="border border-dashed p-4 w-full text-gray-500">
          + Add Activity
        </button>
      ) : (
        <>
          <ul className="space-y-1 text-sm text-gray-800">
            {logsForDate.map(log => (
              <li key={log.id} className="flex justify-between bg-gray-100 p-2 rounded">
                {log.activity_name} – {log.duration_minutes} min ({log.intensity}) – {log.calories} kcal
                <TrashIcon className="h-4 w-4 text-orange-500 cursor-pointer" onClick={() => deleteActivityLog(log.id)} />
              </li>
            ))}
          </ul>
          <button onClick={() => setShowModal(true)} className="mt-2 text-sm underline text-mango">
            + Add more
          </button>
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Add Activity</h2>

            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full border p-2 rounded mb-2"
            />

            <div className="max-h-40 overflow-y-auto mb-2">
              {filteredActivities.map(name => (
                <div
                  key={name}
                  className={`p-2 border rounded cursor-pointer mb-1 ${
                    selectedActivity === name ? "bg-mango text-white" : "hover:bg-mango hover:text-white"
                  }`}
                  onClick={() => setSelectedActivity(name)}
                >
                  {name}
                </div>
              ))}
            </div>

            {selectedActivity && (
              <>
                <input
                  type="number"
                  placeholder="Duration (minutes)"
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                  className="w-full border p-2 rounded mb-2"
                />

                <select
                  value={intensity}
                  onChange={e => setIntensity(e.target.value)}
                  className="w-full border p-2 rounded"
                >
                  <option value="low">Low</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">High</option>
                </select>
              </>
            )}

            <div className="flex justify-end mt-4">
              <button
                onClick={handleSave}
                disabled={!selectedActivity || !duration}
                className={`px-4 py-2 rounded ${
                  selectedActivity ? "bg-mango text-white" : "bg-gray-300 text-gray-500"
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
