import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logoImg from "../assets/images/logo.png";
import backgroundLeaf from "../assets/images/backroundleaf.png";

type CardioFormData = {
  age_years: number | "";
  gender: number;
  height: number | "";
  weight: number | "";
  ap_hi: number | ""; // Systolic BP
  ap_lo: number | ""; // Diastolic BP
  cholesterol: number;
  gluc: number;
  smoke: number;
  alco: number;
  active: number;
};

export default function CardioDiagnosis() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  // Get original profile from Dashboard
  const healthProfile = location.state || {};

  // Calculate age from DOB if available
  const calculateAge = (dob?: string, age?: number) => {
    if (age) return age;
    if (!dob) return "";
    const today = new Date();
    const birthDate = new Date(dob);
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }
    return calculatedAge;
  };

  // Map gender string to number (Male = 1, Female = 2 for cardio model)
  const mapGender = (gender?: string) => {
    if (!gender) return 1;
    return gender.toLowerCase() === "male" ? 2 : 1;
  };

  // Parse blood pressure
  const parseBloodPressure = (bp?: string): { systolic: number | ""; diastolic: number | "" } => {
    if (!bp) return { systolic: "", diastolic: "" };
    const parts = bp.split("/");
    const systolic = parts[0]?.trim();
    const diastolic = parts[1]?.trim();
    return {
      systolic: systolic && !isNaN(Number(systolic)) ? Number(systolic) : "",
      diastolic: diastolic && !isNaN(Number(diastolic)) ? Number(diastolic) : ""
    };
  };

  const bp = parseBloodPressure(healthProfile.bloodPressure);

  const [form, setForm] = useState<CardioFormData>({
    age_years: calculateAge(healthProfile.dob, healthProfile.age) || "",
    gender: mapGender(healthProfile.gender),
    height: healthProfile.height ? Number(healthProfile.height) : "",
    weight: healthProfile.weight ? Number(healthProfile.weight) : "",
    ap_hi: (bp.systolic === "" ? "" : Number(bp.systolic)) as number | "",
    ap_lo: (bp.diastolic === "" ? "" : Number(bp.diastolic)) as number | "",
    cholesterol: 1, // 1 = normal, 2 = above normal, 3 = well above normal
    gluc: 1, // 1 = normal, 2 = above normal, 3 = well above normal
    smoke: 0,
    alco: 0,
    active: 1, // 1 = active, 0 = not active
  });

  const handleChange = (field: keyof CardioFormData, value: number | string) => {
    setForm(prev => ({ ...prev, [field]: value === "" ? "" : Number(value) }));
  };

  const calculateBMI = () => {
    if (form.height && form.weight) {
      const heightM = Number(form.height) / 100;
      const bmi = Number(form.weight) / (heightM * heightM);
      return bmi.toFixed(1);
    }
    return "";
  };

  const submitDiagnosis = async () => {
    // Validate required fields
    if (form.age_years === "" || form.height === "" || form.weight === "" || 
        form.ap_hi === "" || form.ap_lo === "") {
      alert("Please fill in all required fields (Age, Height, Weight, Systolic BP, Diastolic BP)");
      return;
    }

    // Prepare data for backend - ensure all values are numbers
    const submitData = {
      age_years: Number(form.age_years),
      gender: Number(form.gender),
      height: Number(form.height),
      weight: Number(form.weight),
      ap_hi: Number(form.ap_hi),
      ap_lo: Number(form.ap_lo),
      cholesterol: Number(form.cholesterol),
      gluc: Number(form.gluc),
      smoke: Number(form.smoke),
      alco: Number(form.alco),
      active: Number(form.active),
    };

    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/predict/cardio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData)
      });

      if (!response.ok) {
        throw new Error("Failed to get prediction");
      }

      const result = await response.json();

      // Convert risk (0 or 1) to a percentage score for display
      const riskValue = result.risk !== undefined ? result.risk : 0;
      const riskScore = convertRiskToScore(riskValue, healthProfile);

      // Save test result to localStorage
      const testResult = {
        id: Date.now().toString(),
        userId: healthProfile.userId,
        testType: "cardio",
        testName: "Cardiovascular Risk",
        riskScore: riskScore,
        prediction: riskValue,
        inputs: form,
        healthProfile: healthProfile,
        date: new Date().toISOString(),
        timestamp: Date.now()
      };

      // Get existing test results
      const existingTests = JSON.parse(
        localStorage.getItem("novacare_test_results") || "[]"
      );
      existingTests.push(testResult);
      localStorage.setItem("novacare_test_results", JSON.stringify(existingTests));

      // Send AI result + original profile to DiagnosisResult
      navigate("/diagnosis-result", {
        state: {
          user: {
            id: healthProfile.userId,
            firstName: healthProfile.firstName,
            lastName: healthProfile.lastName,
            email: healthProfile.email
          },
          healthProfile: healthProfile,
          inputs: form,
          riskScore: riskScore,
          prediction: riskValue,
          modelType: "cardio"
        }
      });
    } catch (error) {
      console.error(error);
      alert("Failed to run diagnosis. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Convert risk score (0 or 1) to percentage for display
  const convertRiskToScore = (risk: number, profile: any): number => {
    if (risk === 1) {
      // High risk - calculate based on profile factors
      let score = 75;
      const bmi = profile.height && profile.weight 
        ? profile.weight / ((profile.height / 100) ** 2)
        : 25;
      if (bmi > 30) score += 10;
      if (profile.medicalHistory?.length > 0) score += 5;
      return Math.min(100, score);
    } else {
      // Low risk
      let score = 25;
      const bmi = profile.height && profile.weight 
        ? profile.weight / ((profile.height / 100) ** 2)
        : 25;
      if (bmi < 25 && bmi >= 18.5) score += 10;
      if (!profile.medicalHistory || profile.medicalHistory.length === 0) score += 5;
      return Math.max(0, Math.min(40, score));
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 relative overflow-hidden">
      {/* Background Leaf - Enlarged */}
      <div 
        className="absolute top-0 right-0 w-[800px] h-[800px] opacity-20 -z-0"
        style={{
          backgroundImage: `url(${backgroundLeaf})`,
          backgroundSize: 'contain',
          backgroundPosition: 'top right',
          backgroundRepeat: 'no-repeat',
          transform: 'translate(10%, -10%)'
        }}
      />
      <div 
        className="absolute bottom-0 left-0 w-[600px] h-[600px] opacity-15 -z-0"
        style={{
          backgroundImage: `url(${backgroundLeaf})`,
          backgroundSize: 'contain',
          backgroundPosition: 'bottom left',
          backgroundRepeat: 'no-repeat',
          transform: 'translate(-10%, 10%)'
        }}
      />

      <header className="bg-white shadow-sm relative z-10">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center gap-3">
          <img src={logoImg} alt="NovaCare Logo" className="h-10 w-10 object-contain" />
          <span className="font-bold text-xl">NOVA CARE</span>
        </div>
      </header>

      <div className="px-6 py-10 relative z-10">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Cardiovascular Symptoms</h1>
            <p className="text-slate-600">
              Please review and update the information below. Some fields have been pre-filled from your health profile.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Age */}
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">Age</label>
              <input
                type="number"
                min={1}
                max={120}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={form.age_years}
                onChange={e => handleChange("age_years", e.target.value)}
                placeholder="Enter your age"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">Gender</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={form.gender}
                onChange={e => handleChange("gender", Number(e.target.value))}
              >
                <option value={1}>Female</option>
                <option value={2}>Male</option>
              </select>
            </div>

            {/* Height */}
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">Height (cm)</label>
              <input
                type="number"
                min={50}
                max={250}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={form.height}
                onChange={e => handleChange("height", e.target.value)}
                placeholder="Enter height in cm"
              />
            </div>

            {/* Weight */}
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">Weight (kg)</label>
              <input
                type="number"
                min={20}
                max={300}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={form.weight}
                onChange={e => handleChange("weight", e.target.value)}
                placeholder="Enter weight in kg"
              />
            </div>

            {/* Smoking Status */}
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">Smoking Status</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={form.smoke}
                onChange={e => handleChange("smoke", Number(e.target.value))}
              >
                <option value={0}>No</option>
                <option value={1}>Yes</option>
              </select>
            </div>

            {/* Systolic BP */}
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">Systolic BP</label>
              <input
                type="number"
                min={50}
                max={250}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={form.ap_hi}
                onChange={e => handleChange("ap_hi", e.target.value)}
                placeholder="e.g., 120"
              />
            </div>

            {/* Diastolic BP */}
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">Diastolic BP</label>
              <input
                type="number"
                min={30}
                max={150}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={form.ap_lo}
                onChange={e => handleChange("ap_lo", e.target.value)}
                placeholder="e.g., 80"
              />
            </div>

            {/* Glucose Level */}
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">Glucose Level</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={form.gluc}
                onChange={e => handleChange("gluc", Number(e.target.value))}
              >
                <option value={1}>Normal</option>
                <option value={2}>Above Normal</option>
                <option value={3}>Well Above Normal</option>
              </select>
            </div>

            {/* Alcohol Status */}
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">Alcohol Status</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={form.alco}
                onChange={e => handleChange("alco", Number(e.target.value))}
              >
                <option value={0}>No</option>
                <option value={1}>Yes</option>
              </select>
            </div>

            {/* Body Mass Index (calculated) */}
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">Body Mass Index</label>
              <input
                type="text"
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                value={calculateBMI() || "Enter height and weight"}
                placeholder="Auto-calculated"
              />
            </div>

            {/* Cholesterol */}
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">Cholesterol</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={form.cholesterol}
                onChange={e => handleChange("cholesterol", Number(e.target.value))}
              >
                <option value={1}>Normal</option>
                <option value={2}>Above Normal</option>
                <option value={3}>Well Above Normal</option>
              </select>
            </div>

            {/* Physical Activity */}
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">Physical Activity</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={form.active}
                onChange={e => handleChange("active", Number(e.target.value))}
              >
                <option value={0}>Not Active</option>
                <option value={1}>Active</option>
              </select>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              disabled={loading}
              onClick={submitDiagnosis}
              className="bg-slate-900 text-white px-8 py-3 rounded-full hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? "Analyzing..." : "Submit for Analysis"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
