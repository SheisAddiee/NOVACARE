import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Onboarding from "./pages/Onboarding";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Form from "./pages/Form";
import HeartDiagnosis from "./pages/HeartDiagnosis";
import CardioDiagnosis from "./pages/CardioDiagnosis.tsx";
import TestSelection from "./pages/TestSelection";
import MedicalHistory from "./pages/MedicalHistory";
import DiagnosisResult from "./pages/DiagnosisResult";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Onboarding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/setup-profile" element={<ProtectedRoute><Form /></ProtectedRoute>} />
          <Route path="/medical-history" element={<ProtectedRoute><MedicalHistory /></ProtectedRoute>} />
          <Route path="/test-selection" element={<ProtectedRoute><TestSelection /></ProtectedRoute>} />
          <Route path="/heart-diagnosis" element={<ProtectedRoute><HeartDiagnosis /></ProtectedRoute>} />
          <Route path="/cardio-diagnosis" element={<ProtectedRoute><CardioDiagnosis /></ProtectedRoute>} />
          <Route path="/diagnosis-result" element={<ProtectedRoute><DiagnosisResult /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
