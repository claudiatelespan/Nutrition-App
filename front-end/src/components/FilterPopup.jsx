import { useState, useEffect } from "react";

export default function FilterPopup({ selected, setSelected, onApply, onClose, options }) {
  const [tempSelected, setTempSelected] = useState([]);

  useEffect(() => {
    setTempSelected(selected); 
  }, [selected]);

  const toggleCategory = (id) => {
    setTempSelected((prev) =>
      prev.includes(id) ? prev.filter((cat) => cat !== id) : [...prev, id]
    );
  };

  const handleApply = () => {
    setSelected(tempSelected);
    onApply();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20 flex items-center justify-center">
      <div className="bg-almostwhite p-6 rounded-lg shadow-xl w-80 sm:w-[28rem]">
        <h2 className="text-lg font-semibold mb-4 text-center">Select categories</h2>

        <div className="grid grid-cols-3 gap-4 mb-4">
          {options.map((cat) => (
            <button
              key={cat.id}
              onClick={() => toggleCategory(cat.id)}
              className={`flex flex-col items-center justify-center gap-1 p-2 text-sm border border-orange-600/20 rounded-full transition ${
                tempSelected.includes(cat.id)
                  ? "bg-mango text-white"
                  : "bg-beige text-gray-800"
              }`}
            >
              <span className="text-xl">{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => {
              setTempSelected([]);
            }}
            className="text-sm text-gray-600 underline hover:text-black"
          >
            Clear
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="text-sm px-3 py-1 border border-gray-300 rounded hover:bg-gray-300"
            >
              Close
            </button>
            <button
              onClick={handleApply}
              className="text-sm px-3 py-1 bg-[#FFA725] text-white rounded hover:bg-orange-500"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
