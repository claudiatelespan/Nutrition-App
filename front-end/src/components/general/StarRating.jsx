export default function StarRating({ value, onChange }) {
  return (
    <div className="flex flex-row gap-1">
      {[1,2,3,4,5].map((star) => (
        <span
          key={star}
          className={`cursor-pointer text-2xl ${star <= value ? "text-yellow-400" : "text-gray-300"}`}
          onClick={() => onChange(star)}
          role="button"
        >
          ★
        </span>
      ))}
    </div>
  );
}
