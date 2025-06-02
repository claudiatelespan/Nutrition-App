export default function EmptyChartPlaceholder({ emoji = "📈", comp = "meals, snacks and physical activity", chart = "Nutrition", act = "tracking"}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 text-center text-sm px-6 py-5 text-gray-600">
        <div className="text-3xl">{emoji}</div>
        <p className="font-semibold text-mango text-base">
        No data available yet!
        </p>
        <p className="text-gray-500 text-sm max-w-xs">
        Start {act} your <span className="font-medium">{comp}</span> to unlock insights about your {chart}.
        </p>
    </div>
  );
}
