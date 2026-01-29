// src/pages/DiagnosisResult.tsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logoImg from "../assets/images/logo.png";
import backgroundLeaf from "../assets/images/backroundleaf.png";

// ---------- Types ----------
interface User {
  id: string;
  firstName: string;
  lastName?: string;
  email?: string;
}

interface HealthProfile {
  userId: string;
  height: number; // cm
  weight: number; // kg
  bloodPressure?: string;
  medicalHistory?: string[];
  symptoms?: string[];
  firstName?: string;
  lastName?: string;
  age?: number;
  [key: string]: any; // for other properties
}

interface DiagnosisResultState {
  user?: User;
  healthProfile?: HealthProfile;
  riskScore?: number;
  modelType?: "heart" | "cardio";
  inputs?: any;
  [key: string]: any; // for other model results
}

// ---------- Component ----------
const DiagnosisResult: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as DiagnosisResultState;

  const user = state.user;
  const profile = state.healthProfile;

  // BMI calculation
  const bmi = profile?.height && profile?.weight
    ? +(profile.weight / ((profile.height / 100) ** 2)).toFixed(1)
    : null;

  const getBMITag = (bmi: number | null) => {
    if (bmi === null) return "N/A";
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal";
    if (bmi < 30) return "Overweight";
    return "High";
  };

  // Health score (risk)
  const healthScore = state.riskScore ?? 0;
  const getHealthScoreTag = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Moderate";
    return "Needs Attention";
  };

  const handleBack = () => navigate("/dashboard");

  const modelType = state.modelType || "heart";
  const testName = modelType === "cardio" ? "Cardiovascular Risk" : "Heart Disease Risk";

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
      {/* Navbar */}
      <header className="bg-white shadow-sm relative z-10">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center gap-3">
          <img src={logoImg} alt="NovaCare Logo" className="h-10 w-10 object-contain" />
          <span className="font-bold text-xl">NOVA CARE</span>
        </div>
      </header>

      <main className="px-6 py-10 max-w-4xl mx-auto relative z-10">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Diagnosis Result</h1>
            <p className="text-slate-600">Test Type: <span className="font-semibold">{testName}</span></p>
          </div>

          <section className="mb-6 space-y-3">
            <div className="flex justify-between items-center p-3 bg-sky-50 rounded-lg">
              <strong className="text-slate-700">Name:</strong>
              <span className="text-slate-900">{user?.firstName || profile?.firstName || state.user?.firstName || "User"}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-sky-50 rounded-lg">
              <strong className="text-slate-700">Age:</strong>
              <span className="text-slate-900">
                {modelType === "cardio" 
                  ? (state.inputs?.age_years ?? profile?.age ?? "N/A")
                  : (state.inputs?.Age ?? profile?.age ?? "N/A")
                }
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-sky-50 rounded-lg">
              <strong className="text-slate-700">BMI:</strong>
              <span className="text-slate-900">{bmi ?? "N/A"} <span className="text-sm text-slate-600">({getBMITag(bmi)})</span></span>
            </div>
            <div className="flex justify-between items-center p-3 bg-sky-50 rounded-lg">
              <strong className="text-slate-700">Blood Pressure:</strong>
              <span className="text-slate-900">
                {modelType === "cardio" && state.inputs?.ap_hi && state.inputs?.ap_lo
                  ? `${state.inputs.ap_hi}/${state.inputs.ap_lo}`
                  : (profile?.bloodPressure ?? "N/A")
                }
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg border-2 border-emerald-200">
              <strong className="text-slate-700">Risk Score:</strong>
              <span className="text-2xl font-bold text-emerald-700">{healthScore}% <span className="text-sm font-normal">({getHealthScoreTag(healthScore)})</span></span>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Medical Overview</h2>
            {modelType === "cardio" ? (
              <div className="space-y-2">
                <p>
                  <strong>Cholesterol Level:</strong>{" "}
                  {state.inputs?.cholesterol === 1 ? "Normal" : 
                   state.inputs?.cholesterol === 2 ? "Above Normal" :
                   state.inputs?.cholesterol === 3 ? "Well Above Normal" : "N/A"}
                </p>
                <p>
                  <strong>Glucose Level:</strong>{" "}
                  {state.inputs?.gluc === 1 ? "Normal" : 
                   state.inputs?.gluc === 2 ? "Above Normal" :
                   state.inputs?.gluc === 3 ? "Well Above Normal" : "N/A"}
                </p>
                <p>
                  <strong>Smoking Status:</strong>{" "}
                  {state.inputs?.smoke === 1 ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Alcohol Status:</strong>{" "}
                  {state.inputs?.alco === 1 ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Physical Activity:</strong>{" "}
                  {state.inputs?.active === 1 ? "Active" : "Not Active"}
                </p>
              </div>
            ) : (
              <>
                <p>
                  <strong>Medical History:</strong>{" "}
                  {profile?.medicalHistory?.length
                    ? profile.medicalHistory.join(", ")
                    : "No history recorded"}
                </p>
                <p>
                  <strong>Symptoms:</strong>{" "}
                  {profile?.symptoms?.length
                    ? profile.symptoms.join(", ")
                    : "No symptoms recorded"}
                </p>
              </>
            )}
          </section>

          <div className="flex justify-end">
            <button
              onClick={handleBack}
              className="bg-slate-900 text-white px-6 py-3 rounded-full hover:bg-slate-800 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DiagnosisResult;
