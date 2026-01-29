import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logoImg from "../assets/images/logo.png";
import backgroundLeaf from "../assets/images/backroundleaf.png";

type HeartFormData = {
  Chest_Pain: number;
  Shortness_of_Breath: number;
  Fatigue: number;
  Palpitations: number;
  Dizziness: number;
  Swelling: number;
  High_BP: number;
  Pain_Arms_Jaw_Back: number;
  Cold_Sweats_Nausea: number;
  High_Cholesterol: number;
  Diabetes: number;
  Smoking: number;
  Obesity: number;
  Sedentary_Lifestyle: number;
  Family_History: number;
  Chronic_Stress: number;
  Gender: number;
  Age: number | "";
};

export default function HeartDiagnosis() {
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

  // Map gender string to number (Male = 1, Female = 0)
  const mapGender = (gender?: string) => {
    if (!gender) return 0;
    return gender.toLowerCase() === "male" ? 1 : 0;
  };

  // Check if symptom exists in profile
  const hasSymptom = (symptomName: string) => {
    const symptoms = healthProfile.symptoms || [];
    return symptoms.some(s => 
      s.toLowerCase().includes(symptomName.toLowerCase()) || 
      symptomName.toLowerCase().includes(s.toLowerCase())
    ) ? 1 : 0;
  };

  // Check if medical condition exists in profile
  const hasCondition = (conditionName: string) => {
    const history = healthProfile.medicalHistory || [];
    return history.some(h => 
      h.toLowerCase().includes(conditionName.toLowerCase()) || 
      conditionName.toLowerCase().includes(h.toLowerCase())
    ) ? 1 : 0;
  };

  // Calculate BMI to determine obesity
  const calculateObesity = () => {
    if (!healthProfile.height || !healthProfile.weight) return 0;
    const heightM = healthProfile.height / 100;
    const bmi = healthProfile.weight / (heightM * heightM);
    return bmi >= 30 ? 1 : 0;
  };

  const [form, setForm] = useState<HeartFormData>({
    Chest_Pain: hasSymptom("Chest Pain"),
    Shortness_of_Breath: hasSymptom("Shortness of Breath"),
    Fatigue: hasSymptom("Fatigue"),
    Palpitations: hasSymptom("Palpitations"),
    Dizziness: hasSymptom("Dizziness"),
    Swelling: 0,
    High_BP: hasCondition("Hypertension") || (healthProfile.bloodPressure ? 1 : 0),
    Pain_Arms_Jaw_Back: 0,
    Cold_Sweats_Nausea: hasSymptom("Nausea"),
    High_Cholesterol: hasCondition("High Cholesterol"),
    Diabetes: hasCondition("Diabetes"),
    Smoking: 0,
    Obesity: calculateObesity(),
    Sedentary_Lifestyle: 0,
    Family_History: 0,
    Chronic_Stress: 0,
    Gender: mapGender(healthProfile.gender),
    Age: calculateAge(healthProfile.dob, healthProfile.age) || ""
  });

  const handleChange = (field: keyof HeartFormData, value: number | "") => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  // Convert risk score (0 or 1) to percentage for display
  const convertRiskToScore = (risk: number, profile: any): number => {
    // If risk is 1 (high risk), calculate based on profile factors
    // If risk is 0 (low risk), calculate based on profile factors
    if (risk === 1) {
      // High risk - start with base score and adjust
      let score = 75;
      const bmi = profile.height && profile.weight 
        ? profile.weight / ((profile.height / 100) ** 2)
        : 25;
      if (bmi > 30) score += 10;
      if (profile.medicalHistory?.length > 0) score += 5;
      if (profile.symptoms?.length > 0) score += 5;
      return Math.min(100, score);
    } else {
      // Low risk - start with base score and adjust
      let score = 25;
      const bmi = profile.height && profile.weight 
        ? profile.weight / ((profile.height / 100) ** 2)
        : 25;
      if (bmi < 25 && bmi >= 18.5) score += 10;
      if (!profile.medicalHistory || profile.medicalHistory.length === 0) score += 5;
      return Math.max(0, Math.min(40, score));
    }
  };

  const submitDiagnosis = async () => {
    if (form.Age === "") {
      alert("Please enter your age");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/predict/heart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const result = await response.json();

      // Convert risk (0 or 1) to a percentage score for display
      const riskValue = result.risk !== undefined ? result.risk : (result.prediction !== undefined ? result.prediction : 0);
      const riskScore = typeof riskValue === 'number' && riskValue <= 1 
        ? convertRiskToScore(riskValue, healthProfile) 
        : riskValue;

      // Save test result to localStorage
      const testResult = {
        id: Date.now().toString(),
        userId: healthProfile.userId,
        testType: "heart",
        testName: "Heart Disease Risk",
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
          modelType: "heart"
        }
      });
    } catch (error) {
      console.error(error);
      alert("Failed to run diagnosis. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const YesNoSelect = ({ label, field }: { label: string; field: keyof HeartFormData }) => (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <select
        className="w-full px-4 py-2 border rounded-lg"
        value={form[field] as number}
        onChange={e => handleChange(field, Number(e.target.value))}
      >
        <option value={0}>No</option>
        <option value={1}>Yes</option>
      </select>
    </div>
  );

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
            <h1 className="text-3xl font-bold mb-2">Heart Disease Risk Assessment</h1>
            <p className="text-slate-600">
              Please review and update the information below. Some fields have been pre-filled from your health profile.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {Object.keys(form)
              .filter(k => k !== "Age" && k !== "Gender")
              .map((key) => (
                <YesNoSelect key={key} label={key.replace(/_/g, " ")} field={key as keyof HeartFormData} />
              ))}

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium mb-1">Gender</label>
              <select
                className="w-full px-4 py-2 border rounded-lg"
                value={form.Gender}
                onChange={e => handleChange("Gender", Number(e.target.value))}
              >
                <option value={0}>Female</option>
                <option value={1}>Male</option>
              </select>
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium mb-1">Age</label>
              <input
                type="number"
                min={1}
                max={120}
                className="w-full px-4 py-2 border rounded-lg"
                value={form.Age}
                onChange={e => handleChange("Age", e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="Enter your age"
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              disabled={loading}
              onClick={submitDiagnosis}
              className="bg-slate-900 text-white px-8 py-3 rounded-full hover:bg-slate-800 disabled:opacity-50"
            >
              {loading ? "Analyzing..." : "Submit for Analysis"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
