import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../utils/authService";
import loginImg from "../assets/images/doctor-patient.jpeg";
import logoImg from "../assets/images/logo.png";
import backgroundLeaf from "../assets/images/backroundleaf.png";

export default function Login() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const result = await loginUser(formData.email, formData.password);

      if (result.success) {
        login(result.session.user);
        navigate("/dashboard");
      } else {
        setErrorMessage(result.error || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 relative overflow-hidden">
      {/* Background Leaf */}
      <div 
        className="absolute top-0 right-0 w-[500px] h-[500px] opacity-15 -z-0"
        style={{
          backgroundImage: `url(${backgroundLeaf})`,
          backgroundSize: 'contain',
          backgroundPosition: 'top right',
          backgroundRepeat: 'no-repeat',
          transform: 'translate(10%, -10%)'
        }}
      />
      {/* LEFT IMAGE */}
      <div className="hidden lg:block relative">
        <img
          src={loginImg}
          alt="Medical professionals"
          className="w-full h-full object-cover"
        />

        <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white flex justify-around py-6">
          <span> Secure & Private</span>
          <span>24/7 Support</span>
          <span>Quality Care</span>
        </div>
      </div>

      {/* RIGHT FORM */}
      <div className="flex items-center justify-center bg-sky-50 px-8 relative z-10">
        <div className="w-full max-w-md">
          <div className="mb-10 flex items-center gap-3">
            <img 
              src={logoImg} 
              alt="NovaCare Logo" 
              className="h-12 w-12 object-contain"
            />
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome Back!</h1>
            <p className="text-slate-600">
              Log in to access AI powered Heart Disease prediction system
            </p>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-slate-900`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div className="relative">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-slate-900`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
              <span className="absolute right-3 top-3 text-sm text-blue-600 cursor-pointer hover:underline">
                Forgot Password?
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span>Remember Me</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-3 rounded-full hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

            <div className="text-center text-sm text-slate-500">
              Or Sign in with
            </div>

            <div className="flex justify-center gap-4">
              <button
                type="button"
                className="border p-3 rounded-full hover:bg-gray-100 transition-colors"
              >
                G
              </button>
              <button
                type="button"
                className="border p-3 rounded-full hover:bg-gray-100 transition-colors"
              >
                in
              </button>
            </div>

            <p className="text-center text-sm mt-6">
              New to NOVA CARE?{" "}
              <Link to="/signup" className="text-blue-600 font-medium hover:underline">
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
