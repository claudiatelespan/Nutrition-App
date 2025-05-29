import { useState } from "react";
import StarRating from "../general/StarRating";

export default function RatingModal({ initialRating, onSave, onCancel, onDelete, isUpdate }) {
  const [rating, setRating] = useState(initialRating || 0);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center gap-4 w-[340px]">
        <h2 className="text-lg font-bold mb-2 text-mango">
          {isUpdate ? "Update your rating" : "Rate your experience"}
        </h2>
        <StarRating value={rating} onChange={setRating} />
        <div className="flex flex-row gap-2 mt-2">
          <button
            className="bg-mango text-white rounded px-4 py-2 font-semibold hover:bg-orange-500"
            disabled={rating === 0}
            onClick={() => onSave(rating)}
          >
            {isUpdate ? "Update Rating" : "Add Rating"}
          </button>
          <button
            className="bg-gray-100 text-gray-700 rounded px-4 py-2 font-semibold hover:bg-gray-300"
            onClick={onCancel}
          >
            Cancel
          </button>
          {isUpdate && (
            <button
              className="bg-red-100 text-red-600 rounded px-4 py-2 font-semibold hover:bg-red-200"
              onClick={onDelete}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
