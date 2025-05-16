import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function AddItemModal({
  title,
  search,
  onClose,
  setSearch,
  items,
  selectedItem,
  setSelectedItem,
  renderExtras,
  onSave,
  saveDisabled,
  multiSelect = false
}) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-6 w-full max-w-md rounded shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg">{title}</h2>
          <button className="cursor-pointer hover:text-hover" onClick={onClose}>✕</button>
        </div>

        <div className="relative w-full max-w-xl">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-4 h-5 w-5 text-gray-600" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-400 pl-10 p-2 rounded mb-4 outline-mango"
          />
        </div>

        <div className="max-h-60 overflow-y-auto space-y-2 mb-4">
          {items.length > 0 ? items.map((item) => {
            const isSelected = multiSelect
              ? selectedItem.includes(item)
              : selectedItem === item;

            return (
              <div
                key={item}
                className={`p-2 border border-gray-400 rounded cursor-pointer transition-colors ${
                  isSelected ? "bg-mango text-white" : "hover:bg-mango hover:text-white"
                }`}
                onClick={() => {
                  if (multiSelect) {
                    setSelectedItem((prev) =>
                      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
                    );
                  } else {
                    setSelectedItem(item);
                  }
                }}
              >
                {item}
              </div>
            );
          }) : (
            <p className="text-sm text-gray-500">No items found.</p>
          )}

        </div>

        {renderExtras && renderExtras()}

        <div className="flex justify-end mt-4">
          <button
            onClick={onSave}
            disabled={saveDisabled}
            className={`mt-4 px-4 py-2 rounded cursor-pointer transition-all duration-200 ${
              saveDisabled
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-mango text-white hover:bg-orange-500"
            }`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
