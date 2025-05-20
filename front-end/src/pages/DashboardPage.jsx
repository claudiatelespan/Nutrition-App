import MealLog from "../components/MealLog";

export default function DashboardPage() {
  return (
    <div className="p-6 bg-beige min-h-screen mt-16">
      <h1 className="text-3xl font-bold">Your Dashboard</h1>
      <MealLog />
    </div>
  );
}
