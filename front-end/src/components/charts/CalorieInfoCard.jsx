import { useContext } from "react";
import { ApiContext } from "../../context/ApiContext";

export default function CalorieInfoCard() {
  const { userProfile } = useContext(ApiContext);

  // vezi ce date lipsesc
  const missingFields = [];
  if (!userProfile?.weight) missingFields.push("greutate");
  if (!userProfile?.height) missingFields.push("înălțime");
  if (!userProfile?.sex) missingFields.push("sex");
  if (!userProfile?.birth_date) missingFields.push("data nașterii");
  if (!userProfile?.activity_level) missingFields.push("nivel de activitate");

  return (
    <div className="bg-lightBeige rounded-lg p-4 text-mango shadow-sm flex flex-col gap-2">
      <div className="font-semibold mb-1">
        Cum am calculat targetul caloric?
      </div>
      <div className="text-gray-700 text-sm text-justify indent-5">
        <p>Targetul tău caloric zilnic este estimat cu formula <b>BMR (Mifflin-St Jeor)</b> în funcție de: greutate, înălțime, sex, vârstă și nivel de activitate, după datele completate în profilul tău.</p>
        <p>Dacă unele informații lipsesc, folosim valori standard (greutate 65kg, înălțime 170cm, sex masculin, vârstă 24 ani, activitate moderată).</p>
      </div>
      {missingFields.length > 0 && (
        <div className="bg-yellow-200 text-yellow-900 mt-2 px-3 py-2 rounded text-xs flex items-center gap-2">
          <svg className="w-4 h-4 inline-block text-yellow-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z" />
          </svg>
          <span>
            Pentru un calcul precis, completează: <b>{missingFields.join(", ")}</b> în <a href="/details" className="underline text-vintage font-bold">profilul tău</a>.
          </span>
        </div>
      )}
    </div>
  );
}
