import { useContext, useMemo, useState } from "react";
import { ApiContext } from "../context/ApiContext";
import { DateContext } from "../context/DateContext";
import MealCard from "./MealCard";
import AddItemModal from "./AddItemModal";
import { format } from "date-fns";
import toast from "react-hot-toast";

export default function SnackLog({ reloadChartsKey, setReloadChartsKey }) {
  const { snacks, snackLogs, logSnack, deleteSnackLog } = useContext(ApiContext);
  const { selectedDate } = useContext(DateContext);
  const [showSnackModal, setShowSnackModal] = useState(false);
  const [selectedSnack, setSelectedSnack] = useState(null);
  const [snackQuantity, setSnackQuantity] = useState("");

  const formattedDate = format(selectedDate, "yyyy-MM-dd");

  const snacksForDate = useMemo(() => {
    return snackLogs
      .filter(log => log.date === formattedDate)
      .map(log => `${log.snack_name} (${log.quantity} grams)`);
  }, [snackLogs, formattedDate]);

  const handleAddSnack = () => setShowSnackModal(true);

  const handleDeleteSnack = (index) => {
    const log = snackLogs.filter(log => log.date === formattedDate)[index];
    if (log) {
      deleteSnackLog(log.id);
      if (setReloadChartsKey) setReloadChartsKey(k => k + 1);
    }
  };

  const handleSaveSnack = async () => {
    if (!selectedSnack || !snackQuantity || snackQuantity <= 0) {
      toast.error("Completează toate câmpurile corect!");
      return;
    }
    await logSnack(selectedSnack.name, snackQuantity, formattedDate);
    setShowSnackModal(false);
    setSelectedSnack(null);
    setSnackQuantity("");
    if (setReloadChartsKey) setReloadChartsKey(k => k + 1);
  };

  return (
    <>
      <MealCard
        title="Snacks"
        items={snacksForDate}
        onAddClick={handleAddSnack}
        onDeleteClick={handleDeleteSnack}
      />
      {showSnackModal && (
        <AddItemModal
          title="Add Snack"
          onClose={() => setShowSnackModal(false)}
          items={snacks}
          selectedItem={selectedSnack}
          setSelectedItem={setSelectedSnack}
          onSave={handleSaveSnack}
          saveDisabled={!selectedSnack || !snackQuantity}
          renderExtras={() => (
            <input
              type="number"
              min="1"
              placeholder="Quantity (grams)"
              value={snackQuantity}
              onChange={(e) => setSnackQuantity(e.target.value)}
              className="w-full border p-2 rounded outline-mango"
            />
          )}
        />
      )}
    </>
  );
}
