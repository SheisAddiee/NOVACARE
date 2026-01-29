import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logoImg from "../assets/images/logo.png";
import backgroundLeaf from "../assets/images/backroundleaf.png";

function MedicalHistory() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [healthProfile, setHealthProfile] = useState(null);
  const [testHistory, setTestHistory] = useState([]);

  useEffect(() => {
    // Load health profile from localStorage
    const profiles = JSON.parse(
      localStorage.getItem("novacare_health_profiles") || "[]"
    );
    const userProfile = profiles.find((p) => p.userId === user?.id);
    setHealthProfile(userProfile);

    // Load test history from localStorage
    const allTests = JSON.parse(
      localStorage.getItem("novacare_test_results") || "[]"
    );
    const userTests = allTests
      .filter((test) => test.userId === user?.id)
      .sort((a, b) => b.timestamp - a.timestamp); // Sort by most recent first
    setTestHistory(userTests);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const calculateAge = (dob) => {
    if (!dob) return "N/A";
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const calculateBMI = (height, weight) => {
    if (!height || !weight) return "N/A";
    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
    return bmi;
  };

  const getHealthScoreTag = (score) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Moderate";
    return "Needs Attention";
  };

  const getHealthScoreColor = (score) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!healthProfile) {
    return (
      <div className="min-h-screen bg-sky-50 relative overflow-hidden">
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
        <header className="bg-white shadow-sm relative z-10">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">
            <div className="flex items-center gap-3 font-bold text-xl">
              <img
                src={logoImg}
                alt="NovaCare Logo"
                className="h-10 w-10 object-contain"
              />
              <span className="text-slate-900">NOVA CARE</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm hover:bg-slate-800 transition-colors"
            >
              Logout
            </button>
          </div>
        </header>
        <div className="max-w-4xl mx-auto px-8 py-20 relative z-10">
          <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
            <h2 className="text-2xl font-bold mb-4">No Health Profile Found</h2>
            <p className="text-slate-600 mb-6">
              Please complete your health profile setup first.
            </p>
            <button
              onClick={() => navigate("/setup-profile")}
              className="bg-emerald-600 text-white px-8 py-3 rounded-full hover:bg-emerald-700 transition-colors font-medium"
            >
              Setup Health Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-slate-600 hover:text-slate-900 text-sm font-medium"
            >
              Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm hover:bg-slate-800 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-8 py-12 relative z-10">
        <div className="mb-8 flex items-center gap-6">
          <div>
            {healthProfile.profilePicture ? (
              <img
                src={healthProfile.profilePicture}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-emerald-500"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-300">
                <span className="text-gray-400 text-sm">No Photo</span>
              </div>
            )}
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-2">Health Profile</h1>
            <p className="text-slate-600">
              Your complete health information and medical history
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Personal Information Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-slate-900">
              Personal Information
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Height:</span>
                <span className="font-medium">{healthProfile.height || "N/A"} cm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Weight:</span>
                <span className="font-medium">{healthProfile.weight || "N/A"} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Age:</span>
                <span className="font-medium">
                  {calculateAge(healthProfile.dob)} years
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Date of Birth:</span>
                <span className="font-medium">
                  {healthProfile.dob
                    ? new Date(healthProfile.dob).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Gender:</span>
                <span className="font-medium">{healthProfile.gender || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">BMI:</span>
                <span className="font-medium">
                  {calculateBMI(healthProfile.height, healthProfile.weight)}
                </span>
              </div>
            </div>
          </div>

          {/* Medical Details Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-slate-900">
              Medical Details
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Blood Group:</span>
                <span className="font-medium">
                  {healthProfile.bloodGroup || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Genotype:</span>
                <span className="font-medium">
                  {healthProfile.genotype || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Medical History Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-slate-900">
            Medical History
          </h2>
          {healthProfile.medicalHistory &&
          healthProfile.medicalHistory.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {healthProfile.medicalHistory.map((condition, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium"
                >
                  {condition}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-slate-500">No medical history recorded</p>
          )}
        </div>

        {/* Current Symptoms Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-slate-900">
            Current Symptoms
          </h2>
          {healthProfile.symptoms && healthProfile.symptoms.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {healthProfile.symptoms.map((symptom, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium"
                >
                  {symptom}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-slate-500">No current symptoms recorded</p>
          )}
        </div>

        {/* Medications Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-slate-900">
            Current Medications
          </h2>
          {healthProfile.medications &&
          healthProfile.medications.filter((m) => m.trim() !== "").length > 0 ? (
            <ul className="space-y-2">
              {healthProfile.medications
                .filter((m) => m.trim() !== "")
                .map((medication, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm"
                  >
                    {medication}
                  </li>
                ))}
            </ul>
          ) : (
            <p className="text-slate-500">No medications recorded</p>
          )}
        </div>

        {/* Test History Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-slate-900">
              Test History
            </h2>
            <button
              onClick={() => navigate("/test-selection", { state: healthProfile })}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              + Run New Test
            </button>
          </div>
          {testHistory.length > 0 ? (
            <div className="space-y-4">
              {testHistory.map((test) => (
                <div
                  key={test.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg text-slate-900">
                        {test.testName}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {formatDate(test.date)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getHealthScoreColor(test.riskScore)}`}>
                        {test.riskScore}%
                      </div>
                      <div className={`text-sm ${getHealthScoreColor(test.riskScore)}`}>
                        {getHealthScoreTag(test.riskScore)}
                      </div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-2 text-sm">
                    {test.testType === "cardio" ? (
                      <>
                        <div>
                          <span className="text-slate-600">Age:</span>{" "}
                          <span className="font-medium">{test.inputs?.age_years || "N/A"}</span>
                        </div>
                        <div>
                          <span className="text-slate-600">Blood Pressure:</span>{" "}
                          <span className="font-medium">
                            {test.inputs?.ap_hi && test.inputs?.ap_lo
                              ? `${test.inputs.ap_hi}/${test.inputs.ap_lo}`
                              : "N/A"}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-600">Cholesterol:</span>{" "}
                          <span className="font-medium">
                            {test.inputs?.cholesterol === 1 ? "Normal" : 
                             test.inputs?.cholesterol === 2 ? "Above Normal" :
                             test.inputs?.cholesterol === 3 ? "Well Above Normal" : "N/A"}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-600">Glucose:</span>{" "}
                          <span className="font-medium">
                            {test.inputs?.gluc === 1 ? "Normal" : 
                             test.inputs?.gluc === 2 ? "Above Normal" :
                             test.inputs?.gluc === 3 ? "Well Above Normal" : "N/A"}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <span className="text-slate-600">Age:</span>{" "}
                          <span className="font-medium">{test.inputs?.Age || "N/A"}</span>
                        </div>
                        <div>
                          <span className="text-slate-600">Gender:</span>{" "}
                          <span className="font-medium">
                            {test.inputs?.Gender === 1 ? "Male" : "Female"}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-600">Chest Pain:</span>{" "}
                          <span className="font-medium">
                            {test.inputs?.Chest_Pain === 1 ? "Yes" : "No"}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-600">Shortness of Breath:</span>{" "}
                          <span className="font-medium">
                            {test.inputs?.Shortness_of_Breath === 1 ? "Yes" : "No"}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  <button
                    onClick={() => navigate("/diagnosis-result", { state: test })}
                    className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View Full Results →
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-500 mb-4">No test history available</p>
              <button
                onClick={() => navigate("/test-selection", { state: healthProfile })}
                className="bg-emerald-600 text-white px-6 py-2 rounded-full hover:bg-emerald-700 transition-colors font-medium text-sm"
              >
                Run Your First Test
              </button>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button
            onClick={() => navigate("/setup-profile")}
            className="bg-emerald-600 text-white px-8 py-3 rounded-full hover:bg-emerald-700 transition-colors font-medium"
          >
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default MedicalHistory;
