import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logoImg from "../assets/images/LOGO.jpeg";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [healthProfile, setHealthProfile] = useState(null);
  const [activeMenuItem, setActiveMenuItem] = useState("Dashboard");

  useEffect(() => {
    // Load health profile from localStorage
    const profiles = JSON.parse(
      localStorage.getItem("novacare_health_profiles") || "[]"
    );
    const userProfile = profiles.find((p) => p.userId === user?.id);
    setHealthProfile(userProfile);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const calculateBMI = (height, weight) => {
    if (!height || !weight) return null;
    const heightInMeters = height / 100;
    const bmi = parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
    return bmi;
  };

  const getHealthScore = () => {
    // Simple health score calculation based on BMI and other factors
    if (!healthProfile) return null;
    const bmi = calculateBMI(healthProfile.height, healthProfile.weight);
    if (!bmi) return null;
    
    let score = 100;
    // Deduct points for high BMI
    if (bmi > 30) score -= 20;
    else if (bmi > 25) score -= 10;
    
    // Deduct points for medical history
    if (healthProfile.medicalHistory && healthProfile.medicalHistory.length > 0) {
      score -= healthProfile.medicalHistory.length * 5;
    }
    
    // Deduct points for symptoms
    if (healthProfile.symptoms && healthProfile.symptoms.length > 0) {
      score -= healthProfile.symptoms.length * 3;
    }
    
    return Math.max(0, Math.min(100, score));
  };

  const getBMITag = (bmi) => {
    if (!bmi) return "N/A";
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal";
    if (bmi < 30) return "Overweight";
    return "High";
  };

  const getHealthScoreTag = (score) => {
    if (!score) return "N/A";
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Moderate";
    return "Needs Attention";
  };

  const handleSidebarClick = (item) => {
    setActiveMenuItem(item);
    if (item === "Health Profile") {
      navigate("/medical-history");
    } else if (item === "Medical History") {
      navigate("/medical-history");
    } else if (item === "Settings") {
      // Navigate to settings when implemented
      navigate("/dashboard");
    }
    // Other menu items can be implemented later
  };

  const bmi = healthProfile ? calculateBMI(healthProfile.height, healthProfile.weight) : null;
  const healthScore = getHealthScore();

  return (
    <div className="min-h-screen bg-sky-50 flex">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white shadow-md p-6 min-h-screen">
        <div className="flex items-center gap-3 font-bold text-xl mb-8">
          <img
            src={logoImg}
            alt="NovaCare Logo"
            className="h-10 w-10 object-contain"
          />
          <span className="text-slate-900">NOVA CARE</span>
        </div>

        <nav className="space-y-2">
          <SidebarItem
            active={activeMenuItem === "Dashboard"}
            label="Dashboard"
            onClick={() => handleSidebarClick("Dashboard")}
          />
          <SidebarItem
            active={activeMenuItem === "Health Profile"}
            label="Health Profile"
            onClick={() => handleSidebarClick("Health Profile")}
          />
          <SidebarItem
            active={activeMenuItem === "Vitals History"}
            label="Vitals History"
            onClick={() => handleSidebarClick("Vitals History")}
          />
          <SidebarItem
            active={activeMenuItem === "Prescriptions"}
            label="Prescriptions"
            onClick={() => handleSidebarClick("Prescriptions")}
          />
          <SidebarItem
            active={activeMenuItem === "Appointments"}
            label="Appointments"
            onClick={() => handleSidebarClick("Appointments")}
          />
          <SidebarItem
            active={activeMenuItem === "Medical History"}
            label="Medical History"
            onClick={() => handleSidebarClick("Medical History")}
          />
          <SidebarItem
            active={activeMenuItem === "Settings"}
            label="Settings"
            onClick={() => handleSidebarClick("Settings")}
          />
        </nav>

        <div className="mt-auto pt-8">
          <button
            onClick={handleLogout}
            className="w-full bg-slate-900 text-white px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome, {user?.firstName || "User"} 👋
            </h1>
            <p className="text-slate-600 mt-2">
              Here's an overview of your health status
            </p>
          </div>

          <button
            onClick={() => navigate("/cardio-diagnosis")}
            className="bg-slate-900 text-white px-6 py-3 rounded-full hover:bg-slate-800 transition-colors font-medium"
          >
            Run AI Health Analysis
          </button>
        </div>

        {/* STATS */}
        <section className="grid md:grid-cols-3 gap-6 mb-10">
          <StatCard
            title="Health Score"
            value={healthScore !== null ? healthScore.toString() : "N/A"}
            tag={getHealthScoreTag(healthScore)}
          />
          <StatCard
            title="BMI"
            value={bmi !== null ? bmi.toString() : "N/A"}
            tag={getBMITag(bmi)}
          />
          <StatCard
            title="Blood Pressure"
            value="130/85"
            tag="Elevated"
          />
        </section>

        {/* QUICK ACTIONS */}
        <section className="bg-white rounded-2xl shadow-md p-8 mb-6">
          <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <ActionCard
              title="View Health Profile"
              description="Review your personal and medical information"
              onClick={() => navigate("/medical-history")}
            />
            <ActionCard
              title="Run Diagnosis"
              description="Analyze your data using AI diagnostics"
              onClick={() => navigate("/cardio-diagnosis")}
            />
            <ActionCard
              title="Book Appointment"
              description="Schedule a consultation with a specialist"
              onClick={() => navigate("/dashboard")}
            />
          </div>
        </section>

        {/* PROFILE SETUP REMINDER */}
        {!healthProfile && (
          <section className="bg-white rounded-2xl shadow-md p-8">
            <h2 className="text-xl font-semibold mb-4">Complete Your Profile</h2>
            <p className="text-slate-600 mb-6">
              Set up your health profile to get personalized insights and recommendations.
            </p>
            <button
              onClick={() => navigate("/setup-profile")}
              className="bg-emerald-600 text-white px-8 py-3 rounded-full hover:bg-emerald-700 transition-colors font-medium"
            >
              Setup Health Profile
            </button>
          </section>
        )}
      </main>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function SidebarItem({ label, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`px-4 py-3 rounded-xl cursor-pointer transition-colors ${
        active
          ? "bg-emerald-100 text-emerald-800 font-medium"
          : "text-slate-600 hover:bg-slate-100"
      }`}
    >
      {label}
    </div>
  );
}

function StatCard({ title, value, tag }) {
  const getTagColor = (tag) => {
    if (tag === "Excellent" || tag === "Normal") return "bg-emerald-100 text-emerald-700";
    if (tag === "Moderate" || tag === "Elevated") return "bg-yellow-100 text-yellow-700";
    if (tag === "High" || tag === "Needs Attention") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h3 className="text-sm text-slate-500 mb-2">{title}</h3>
      <div className="flex items-center justify-between">
        <span className="text-3xl font-bold">{value}</span>
        <span className={`text-sm px-3 py-1 rounded-full ${getTagColor(tag)}`}>
          {tag}
        </span>
      </div>
    </div>
  );
}

function ActionCard({ title, description, onClick }) {
  return (
    <div
      onClick={onClick}
      className="border border-gray-200 rounded-xl p-6 hover:shadow-md cursor-pointer transition-shadow"
    >
      <h3 className="font-semibold mb-2 text-slate-900">{title}</h3>
      <p className="text-sm text-slate-600">{description}</p>
    </div>
  );
}

export default Dashboard;
