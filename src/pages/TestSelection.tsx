import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logoImg from "../assets/images/logo.png";
import backgroundLeaf from "../assets/images/backroundleaf.png";

interface TestSelectionProps {}

const TestSelection: React.FC<TestSelectionProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const healthProfile = location.state || {};

  const handleTestSelection = (testType: "heart" | "cardio") => {
    if (testType === "heart") {
      navigate("/heart-diagnosis", { state: healthProfile });
    } else {
      navigate("/cardio-diagnosis", { state: healthProfile });
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

      {/* Navbar */}
      <header className="bg-white shadow-sm relative z-10">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center gap-3">
          <img src={logoImg} alt="NovaCare Logo" className="h-10 w-10 object-contain" />
          <span className="font-bold text-xl">NOVA CARE</span>
        </div>
      </header>

      <main className="px-6 py-10 max-w-4xl mx-auto relative z-10">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-4 text-center">Select Diagnostic Test</h1>
          <p className="text-slate-600 text-center mb-8">
            Choose the type of health analysis you would like to run
          </p>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            {/* Heart Disease Risk Test */}
            <div 
              onClick={() => handleTestSelection("heart")}
              className="border-2 border-slate-200 rounded-2xl p-8 hover:border-emerald-500 hover:shadow-lg cursor-pointer transition-all"
            >
              <div className="text-center">
                <div className="text-6xl mb-4">🫀</div>
                <h2 className="text-2xl font-bold mb-3 text-slate-900">Heart Disease Risk</h2>
                <p className="text-slate-600 mb-4">
                  Assess your risk for heart disease based on symptoms, medical history, and lifestyle factors.
                </p>
                <ul className="text-left text-sm text-slate-600 space-y-2 mb-6">
                  <li>• Symptom-based assessment</li>
                  <li>• Medical history analysis</li>
                  <li>• Lifestyle factor evaluation</li>
                </ul>
                <button className="w-full bg-slate-900 text-white px-6 py-3 rounded-full hover:bg-slate-800 transition-colors font-medium">
                  Start Heart Analysis
                </button>
              </div>
            </div>

            {/* Cardiovascular Risk Test */}
            <div 
              onClick={() => handleTestSelection("cardio")}
              className="border-2 border-slate-200 rounded-2xl p-8 hover:border-emerald-500 hover:shadow-lg cursor-pointer transition-all"
            >
              <div className="text-center">
                <div className="text-6xl mb-4">🩺</div>
                <h2 className="text-2xl font-bold mb-3 text-slate-900">Cardiovascular Risk</h2>
                <p className="text-slate-600 mb-4">
                  Evaluate your cardiovascular health using vital signs, blood pressure, and metabolic indicators.
                </p>
                <ul className="text-left text-sm text-slate-600 space-y-2 mb-6">
                  <li>• Blood pressure analysis</li>
                  <li>• Metabolic indicators</li>
                  <li>• Vital signs assessment</li>
                </ul>
                <button className="w-full bg-slate-900 text-white px-6 py-3 rounded-full hover:bg-slate-800 transition-colors font-medium">
                  Start Cardiovascular Analysis
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-slate-600 hover:text-slate-900 text-sm font-medium"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TestSelection;
