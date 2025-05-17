import { useState, useEffect, useContext } from "react";
import { ApiContext } from "../context/ApiContext";
import toast from "react-hot-toast";

const FIELD_STYLE = "bg-white border border-gray-300 text-sm rounded-md p-2 focus:ring-2 focus:ring-mango focus:outline-none";
const LABEL_STYLE = "block text-sm font-semibold text-gray-700 mb-1";

export default function PersonalDetailsPage() {
  const { userProfile, updateUserProfile } = useContext(ApiContext);

  const [form, setForm] = useState(null);

  useEffect(() => {
    if (userProfile) {
      setForm((prev) => {
        const newForm = {
          weight: userProfile.weight ?? "",
          height: userProfile.height ?? "",
          sex: userProfile.sex ?? "",
          birth_date: userProfile.birth_date ?? "",
          activity_level: userProfile.activity_level ?? "",
          goal: userProfile.goal ?? "",
          diet: userProfile.diet ?? "",
        };

        if (!prev) return newForm;

        return {
          ...newForm,
          ...prev,
        };
      });
    }
  }, [userProfile]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let hasError = false;
      const newForm = { ...form };

    const requiredFields = ["weight", "height", "sex", "birth_date"];
    for (const field of requiredFields) {
      if (!form[field]) {
        toast.error(`Please complete the ${field.replace("_", " ")} field.`);
        hasError = true;
      }
    }

    if (form.weight && Number(form.weight) <= 0) {
      toast.error("Weight must be a positive number.");
      newForm.weight = "";
      hasError = true;
    }

    if (form.height && Number(form.height) <= 0) {
      toast.error("Height must be a positive number.");
      newForm.height = "";
      hasError = true;
    }

    if (form.birth_date) {
      const today = new Date().toISOString().split("T")[0];
      if (form.birth_date > today) {
        toast.error("Birth date cannot be in the future.");
        newForm.birth_date = "";
        hasError = true;
      }
    }

    if (hasError) {
      setForm(newForm);
      return;
    }

    try {
      const filteredForm = Object.fromEntries(
        Object.entries(form).filter(([_, value]) => value !== "")
      );

      await updateUserProfile(filteredForm);
      toast.success("Profile updated successfully.");
    } catch (err) {
      toast.error("Error updating profile.");
    }
  };

  if (!form) return null;

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md mt-26">
      <h2 className="text-2xl font-bold text-vintage mb-6">Edit Personal Details</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={LABEL_STYLE}>Weight (kg)</label>
          <input
            type="number"
            name="weight"
            value={form.weight}
            onChange={handleChange}
            placeholder="Enter your weight"
            className={FIELD_STYLE}
          />
        </div>

        <div>
          <label className={LABEL_STYLE}>Height (cm)</label>
          <input
            type="number"
            name="height"
            value={form.height}
            onChange={handleChange}
            placeholder="Enter your height"
            className={FIELD_STYLE}
          />
        </div>

        <div>
          <label className={LABEL_STYLE}>Sex</label>
          <select
            name="sex"
            value={form.sex}
            onChange={handleChange}
            className={FIELD_STYLE}
          >
            <option value="">Select sex</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div>
          <label className={LABEL_STYLE}>Birth Date</label>
          <input
            type="date"
            name="birth_date"
            value={form.birth_date}
            onChange={handleChange}
            className={FIELD_STYLE}
          />
        </div>

        <div>
          <label className={LABEL_STYLE}>Activity Level</label>
          <select
            name="activity_level"
            value={form.activity_level}
            onChange={handleChange}
            className={FIELD_STYLE}
          >
            <option value="">Select activity level</option>
            <option value="sedentary">Sedentary</option>
            <option value="moderate">Moderate</option>
            <option value="active">Active</option>
            <option value="very_active">Very Active</option>
          </select>
        </div>

        <div>
          <label className={LABEL_STYLE}>Goal</label>
          <select
            name="goal"
            value={form.goal}
            onChange={handleChange}
            className={FIELD_STYLE}
          >
            <option value="">Select goal</option>
            <option value="maintain">Maintain Weight</option>
            <option value="lose">Lose Weight</option>
            <option value="gain">Gain Weight</option>
          </select>
        </div>

        <div>
          <label className={LABEL_STYLE}>Diet</label>
          <select
            name="diet"
            value={form.diet}
            onChange={handleChange}
            className={FIELD_STYLE}
          >
            <option value="">Select diet</option>
            <option value="omnivore">Omnivore</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="gluten_free">Gluten-Free</option>
            <option value="keto">Keto</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className=" bg-mango text-white py-2 px-4 rounded hover:bg-opacity-90 transition hover:bg-orange-500 cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}