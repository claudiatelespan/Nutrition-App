import { useState, useContext, useMemo } from "react";
import { ApiContext } from "../../context/ApiContext";
import { format } from "date-fns";
import MealCard from "../cards/MealCard";
import AddItemModal from "../forms/AddItemModal";
import toast from "react-hot-toast";

export default function ActivityLog({ selectedDate }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState("");
  const [intensity, setIntensity] = useState("moderate");
  const [duration, setDuration] = useState("");

  const { activities, activityLogs, logActivity, deleteActivityLog } = useContext(ApiContext);
  const formattedDate = format(selectedDate, "yyyy-MM-dd");

  const logsForDate = useMemo(() => {
    return activityLogs.filter(log => log.date === formattedDate);
  }, [activityLogs, formattedDate]);

  const handleSave = async () => {
    if(!duration || duration <= 0) {
      toast.error("Please enter a valid duration greater than 0.");
      setDuration("");
      return;
    }
    await logActivity(selectedActivity.name, formattedDate, intensity, parseInt(duration));
    setSelectedActivity("");
    setIntensity("moderate");
    setDuration("");
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedActivity(null);
    setDuration("");
    setIntensity("moderate");
  };  

  return (
    <div className="h-[13rem] max-w-[23rem] flex flex-col justify-between gap-2">
      <MealCard
        title="Physical Activity"
        items={logsForDate.map(log => `${log.activity_name} – ${log.duration_minutes} min (${log.intensity})`)}
        onAddClick={() => setShowModal(true)}
        onDeleteClick={(index) => deleteActivityLog(logsForDate[index].id)}
      />

      {showModal && (
        <AddItemModal
          title="Add Physical Activity"
          onClose={handleCloseModal}
          items={activities}
          selectedItem={selectedActivity}
          setSelectedItem={setSelectedActivity}
          onSave={handleSave}
          saveDisabled={!selectedActivity || !duration}
          renderExtras={() => (
            <div className="flex flex-col gap-4">
              {/* Info */}
              {selectedActivity && selectedActivity.information && (
                <div className="mb-2 text-justify">
                  <label className="block text-sm font-semibold mb-1 text-mango">How to choose intensity:</label>
                  <ul className="list-disc pl-5 text-xs text-gray-700">
                    {selectedActivity.information.split(";").map((phrase, idx) => (
                      <li key={idx}>{phrase.trim()};</li>
                    ))}
                  </ul>
                </div>
              )}
              {/* effort level */}
              <div className="flex flex-row justify-between">
                <div>
                  <label className="block text-sm font-medium mb-1">Effort Level</label>
                  <select
                    value={intensity}
                    onChange={(e) => setIntensity(e.target.value)}
                    className="w-40 border border-gray-400 p-2 rounded outline-mango"
                  >
                    <option value="low">Low</option>
                    <option value="moderate">Moderate</option>
                    <option value="high">High</option>
                  </select>
                </div>

                {/* duration */}
                <div>
                  <label className="block text-sm font-medium mb-1">Duration (min)</label>
                  <input
                    type="number"
                    min="1"
                    value={duration}
                    placeholder="Type duration..."
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full border border-gray-400 p-2 rounded outline-mango"
                  />
                </div>
              </div>
            </div>
          )}
        />
      )}

    </div>
  );
}
