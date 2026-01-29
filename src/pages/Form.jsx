import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logoImg from "../assets/images/logo.png";
import backgroundLeaf from "../assets/images/backroundleaf.png";

export default function Form() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    height: "",
    weight: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    genotype: "",
    bloodPressure: "",
    medicalHistory: [],
    symptoms: [],
    medications: [""],
    profilePicture: "",
  });
  const [profilePicturePreview, setProfilePicturePreview] = useState("");

  const medicalOptions = [
    "Hypertension",
    "Diabetes",
    "Heart Disease",
    "Asthma",
    "Kidney Disease",
    "High Cholesterol",
    "Arthritis",
    "None",
  ];

  const symptomOptions = [
    "Chest Pain",
    "Shortness of Breath",
    "Dizziness",
    "Fatigue",
    "Palpitations",
    "Headache",
    "Nausea",
    "None",
  ];

  const bloodGroupOptions = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const genotypeOptions = ["AA", "AS", "AC", "SS", "SC", "CC"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckbox = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };

  const handleMedicationChange = (index, value) => {
    const newMedications = [...formData.medications];
    newMedications[index] = value;
    setFormData((prev) => ({
      ...prev,
      medications: newMedications,
    }));
  };

  const addMedicationField = () => {
    setFormData((prev) => ({
      ...prev,
      medications: [...prev.medications, ""],
    }));
  };

  const removeMedicationField = (index) => {
    if (formData.medications.length > 1) {
      const newMedications = formData.medications.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        medications: newMedications,
      }));
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setFormData((prev) => ({
          ...prev,
          profilePicture: base64String,
        }));
        setProfilePicturePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfilePicture = () => {
    setFormData((prev) => ({
      ...prev,
      profilePicture: "",
    }));
    setProfilePicturePreview("");
  };

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    } else if (user) {
      // Load existing profile data from localStorage
      const profiles = JSON.parse(
        localStorage.getItem("novacare_health_profiles") || "[]"
      );
      const userProfile = profiles.find((p) => p.userId === user.id);
      if (userProfile) {
        setFormData({
          height: userProfile.height || "",
          weight: userProfile.weight || "",
          dob: userProfile.dob || "",
          gender: userProfile.gender || "",
          bloodGroup: userProfile.bloodGroup || "",
          genotype: userProfile.genotype || "",
          bloodPressure: userProfile.bloodPressure || "",
          medicalHistory: userProfile.medicalHistory || [],
          symptoms: userProfile.symptoms || [],
          medications: userProfile.medications && userProfile.medications.length > 0 
            ? userProfile.medications 
            : [""],
          profilePicture: userProfile.profilePicture || "",
        });
        if (userProfile.profilePicture) {
          setProfilePicturePreview(userProfile.profilePicture);
        }
      }
    }
  }, [user, authLoading, navigate]);

  // Don't render form if still loading auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-sky-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    // Validate required fields
    if (!formData.height || !formData.weight || !formData.dob || !formData.gender || !formData.bloodGroup || !formData.genotype) {
      alert("Please fill in all required fields (Height, Weight, Date of Birth, Gender, Blood Group, and Genotype)");
      setIsSubmitting(false);
      return;
    }
    
    // Calculate age from DOB
    const age = formData.dob ? Math.floor((new Date().getTime() - new Date(formData.dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : null;

    if (!user?.id) {
      alert("User not found. Please log in again.");
      navigate("/login");
      setIsSubmitting(false);
      return;
    }

    try {
      // Save health profile to localStorage
      const healthProfile = {
        ...formData,
        userId: user.id,
        age: age,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Get existing profiles or create new array
      const existingProfiles = JSON.parse(
        localStorage.getItem("novacare_health_profiles") || "[]"
      );

      // Update or add profile for current user
      const profileIndex = existingProfiles.findIndex(
        (p) => p.userId === user.id
      );

      if (profileIndex >= 0) {
        existingProfiles[profileIndex] = healthProfile;
      } else {
        existingProfiles.push(healthProfile);
      }

      localStorage.setItem(
        "novacare_health_profiles",
        JSON.stringify(existingProfiles)
      );

      // Small delay to ensure data is saved
      await new Promise(resolve => setTimeout(resolve, 100));

      // Redirect to dashboard after profile setup
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving health profile:", error);
      alert("An error occurred while saving your profile. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 relative overflow-hidden">
      {/* Background Leaf */}
      <div 
        className="absolute top-0 right-0 w-[600px] h-[600px] opacity-20 -z-0"
        style={{
          backgroundImage: `url(${backgroundLeaf})`,
          backgroundSize: 'contain',
          backgroundPosition: 'top right',
          backgroundRepeat: 'no-repeat',
          transform: 'translate(15%, -15%)'
        }}
      />
      {/* NAVBAR */}
      <header className="bg-white shadow-sm sticky top-0 z-50 relative">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-3 font-bold text-xl">
            <img
              src={logoImg}
              alt="NovaCare Logo"
              className="h-10 w-10 object-contain"
            />
            <span className="text-slate-900">NOVA CARE</span>
          </div>
        </div>
      </header>

      <div className="px-8 py-12 relative z-10">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-10">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Health Profile Setup</h1>
            <p className="text-slate-600">
              Please fill in your health information to get started with
              personalized healthcare predictions.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* PROFILE PICTURE */}
            <section>
              <h2 className="text-2xl font-semibold mb-6 text-slate-900">
                Profile Picture
              </h2>
              <div className="flex flex-col items-start gap-4">
                {profilePicturePreview ? (
                  <div className="relative">
                    <img
                      src={profilePicturePreview}
                      alt="Profile preview"
                      className="w-32 h-32 rounded-full object-cover border-4 border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={removeProfilePicture}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                      title="Remove picture"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-dashed border-gray-300">
                    <span className="text-gray-400 text-sm">No Image</span>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Upload Profile Picture
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 file:cursor-pointer cursor-pointer"
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    Supported formats: JPG, PNG, GIF (Max 5MB)
                  </p>
                </div>
              </div>
            </section>

            {/* PERSONAL INFO */}
            <section>
              <h2 className="text-2xl font-semibold mb-6 text-slate-900">
                Personal Information
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    name="height"
                    placeholder="e.g., 175"
                    value={formData.height}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                    min="50"
                    max="250"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    name="weight"
                    placeholder="e.g., 70"
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                    min="20"
                    max="300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                    max={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Gender
                  </label>
                  <select
                    name="gender"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Blood Group
                  </label>
                  <select
                    name="bloodGroup"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Blood Group</option>
                    {bloodGroupOptions.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Genotype
                  </label>
                  <select
                    name="genotype"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    value={formData.genotype}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Genotype</option>
                    {genotypeOptions.map((genotype) => (
                      <option key={genotype} value={genotype}>
                        {genotype}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Blood Pressure (mmHg)
                  </label>
                  <input
                    type="text"
                    name="bloodPressure"
                    placeholder="e.g., 120/80"
                    value={formData.bloodPressure}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    pattern="\d{2,3}/\d{2,3}"
                  />
                  <p className="mt-1 text-xs text-slate-500">Format: Systolic/Diastolic (e.g., 120/80)</p>
                </div>
              </div>
            </section>

            {/* MEDICAL HISTORY */}
            <section>
              <h2 className="text-2xl font-semibold mb-6 text-slate-900">
                Medical History
              </h2>
              <p className="text-sm text-slate-600 mb-4">
                Select all that apply (you can select multiple)
              </p>

              <div className="grid md:grid-cols-3 gap-4">
                {medicalOptions.map((item) => (
                  <label
                    key={item}
                    className="flex gap-3 items-center p-3 border border-gray-200 rounded-lg hover:bg-sky-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.medicalHistory.includes(item)}
                      onChange={() => handleCheckbox("medicalHistory", item)}
                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <span className="text-slate-700">{item}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* SYMPTOMS */}
            <section>
              <h2 className="text-2xl font-semibold mb-6 text-slate-900">
                Current Symptoms
              </h2>
              <p className="text-sm text-slate-600 mb-4">
                Select all current symptoms (you can select multiple)
              </p>

              <div className="grid md:grid-cols-3 gap-4">
                {symptomOptions.map((item) => (
                  <label
                    key={item}
                    className="flex gap-3 items-center p-3 border border-gray-200 rounded-lg hover:bg-sky-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.symptoms.includes(item)}
                      onChange={() => handleCheckbox("symptoms", item)}
                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <span className="text-slate-700">{item}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* MEDICATIONS */}
            <section>
              <h2 className="text-2xl font-semibold mb-6 text-slate-900">
                Current Medications
              </h2>
              <p className="text-sm text-slate-600 mb-4">
                List any medications you are currently taking
              </p>

              <div className="space-y-3">
                {formData.medications.map((medication, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      type="text"
                      placeholder={`Medication ${index + 1}`}
                      value={medication}
                      onChange={(e) =>
                        handleMedicationChange(index, e.target.value)
                      }
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                    {formData.medications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMedicationField(index)}
                        className="px-4 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addMedicationField}
                  className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                >
                  + Add Another Medication
                </button>
              </div>
            </section>

            {/* ACTIONS */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="px-8 py-3 border border-gray-300 rounded-full text-slate-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-slate-900 text-white px-8 py-3 rounded-full hover:bg-slate-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Saving..." : "Save & Continue"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
