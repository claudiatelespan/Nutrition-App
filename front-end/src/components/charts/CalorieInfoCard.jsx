import { useContext } from "react";
import { ApiContext } from "../../context/ApiContext";

export default function CalorieInfoCard() {
  const { userProfile } = useContext(ApiContext);

  // vezi ce date lipsesc
  const missingFields = [];
  if (!userProfile?.weight) missingFields.push("weight");
  if (!userProfile?.height) missingFields.push("height");
  if (!userProfile?.sex) missingFields.push("sex");
  if (!userProfile?.birth_date) missingFields.push("birth date");
  if (!userProfile?.activity_level) missingFields.push("activity level");

  return (
    <div className="bg-lightBeige rounded-lg p-4 text-mango shadow-sm flex flex-col gap-2">
      <div className="font-semibold mb-1">
        How did we calculate your calorie target?
      </div>
      <div className="text-gray-700 text-sm text-justify indent-5">
        <p>Your daily calorie target is estimated using the <b>BMR (Mifflin-St Jeor)</b> formula based on your weight, height, sex, age, and activity level, according to the details you entered in your profile.</p>
        <p>If some information is missing, we use default values (weight 65kg, height 170cm, male, age 24, moderate activity level).</p>
      </div>
      {missingFields.length > 0 && (
        <div className="bg-yellow-200 text-yellow-900 mt-2 px-3 py-2 rounded text-xs flex items-center gap-2">
          <svg className="w-4 h-4 inline-block text-yellow-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z" />
          </svg>
          <span>
            For an accurate calculation, please complete: <b>{missingFields.join(", ")}</b> in <a href="/details" className="underline font-bold">your profile</a>.
          </span>
        </div>
      )}
    </div>
  );
}
