import { TrashIcon } from "@heroicons/react/24/outline";

export default function MealCard({
  title,
  items = [],
  onAddClick,
  onDeleteClick
}) {
  return (
    <div className="bg-white rounded-lg p-4 shadow flex flex-col justify-between h-[13rem]">
      <h3 className="text-mango font-semibold mb-2">{title}</h3>
      {items.length === 0 ? (
        <button
          className="bg-gray-100 border border-dashed border-gray-400 rounded-lg h-28 flex items-center justify-center text-gray-500 transform transition-transform duration-200 hover:scale-103 cursor-pointer"
          onClick={onAddClick}
        >
          + Add {title}
        </button>
      ) : (
        <div className="flex flex-col justify-between h-full">
          <ul className="space-y-1 text-sm text-gray-800 overflow-auto max-h-30">
            {items.map((item, index) => (
              <li
                key={index}
                className="flex justify-between items-start gap-2 bg-gray-100 p-2 rounded"
              >
                <span className="flex-1 min-w-0">{item}</span>
                <TrashIcon
                  className="h-4 w-4 text-orange-500 transform transition-transform duration-200 hover:scale-110 cursor-pointer"
                  onClick={() => onDeleteClick(index)}
                />
              </li>
            ))}
          </ul>
          <button
            className="text-sm font-semibold text-mango mt-2 underline transition ease-in-out hover:text-orange-500 cursor-pointer self-end"
            onClick={onAddClick}
          >
            + Add more
          </button>
        </div>
      )}
    </div>
  );
}
