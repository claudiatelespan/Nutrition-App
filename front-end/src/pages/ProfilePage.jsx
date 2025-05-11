import MealLog from "../components/MealLog";
import ActivityLog from "../components/ActivityLog";

export default function ProfilePage() {
  return (
    <div className="p-6 bg-beige min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      <MealLog />
      <ActivityLog/>
    </div>
  );
}
