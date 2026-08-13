import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Warehouse,
  ArrowRight,
  PackageCheck,
  Truck,
  BarChart3,
  Eye,
  EyeOff,
  X,
  KeyRound,
  ShieldCheck
} from "lucide-react";
import { loginUser, forgotPassword, resetPassword } from "../Services/api";

/* ─── Toast Notification ─── */
function Toast({ message, type, onClose }) {
  return (
    <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-right-full duration-300">
      <div className={`flex items-center gap-3 px-5 py-4 rounded-xl shadow-xl border backdrop-blur-sm ${type === "success"
        ? "bg-white/95 border-green-200 text-green-800"
        : "bg-white/95 border-red-200 text-red-800"
        }`}>
        {type === "success" ? (
          <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
        ) : (
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
        )}
        <p className="text-sm font-semibold">{message}</p>
        <button
          onClick={onClose}
          className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/* ─── Feature Item for Left Panel ─── */
function FeatureItem({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-3 text-white/80">
      <div className="p-1.5 rounded-lg bg-white/10 backdrop-blur-sm">
        <Icon className="w-4 h-4 text-white" />
      </div>
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
}

/* ─── Input Field ─── */
function InputField({
  label,
  type,
  value,
  onChange,
  placeholder,
  icon: Icon,
  error
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200">
          <Icon className="w-5 h-5" />
        </div>
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full pl-11 pr-${isPassword ? '11' : '4'} py-3 bg-gray-50 border rounded-xl text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-200 ${error
            ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 bg-red-50/30"
            : "border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 hover:border-gray-300"
            }`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-xs font-medium text-red-500 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}

/* ─── Forgot/Reset Password Modal ─── */
function ForgotPasswordModal({ isOpen, onClose, showToast }) {
  const [step, setStep] = useState(1); // 1: Send OTP, 2: Enter OTP & New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalError, setModalError] = useState("");

  if (!isOpen) return null;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setModalError("Please enter your registered email address.");
      return;
    }
    setModalError("");
    setLoading(true);
    try {
      const res = await forgotPassword(email);
      showToast(res.message || "OTP has been sent to your email.", "success");
      setStep(2);
    } catch (err) {
      setModalError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      setModalError("OTP is required.");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setModalError("Password must be at least 6 characters long.");
      return;
    }
    setModalError("");
    setLoading(true);
    try {
      const res = await resetPassword(email, otp, newPassword);
      showToast(res.message || "Password reset successful! Please sign in.", "success");
      onClose();
      setStep(1);
      setEmail("");
      setOtp("");
      setNewPassword("");
    } catch (err) {
      setModalError(err.message || err.error || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md p-6 sm:p-8 animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-indigo-50 rounded-xl">
            <KeyRound className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Reset Password</h3>
            <p className="text-xs text-gray-500">
              {step === 1 ? "Enter your email to receive a 6-digit OTP" : "Enter OTP and set your new password"}
            </p>
          </div>
        </div>

        {modalError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-medium text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{modalError}</span>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <InputField
              label="Registered Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              icon={Mail}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm shadow-md shadow-indigo-200 transition-all disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Reset OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <InputField
              label="6-Digit OTP"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              icon={ShieldCheck}
            />
            <InputField
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 6 characters"
              icon={Lock}
            />
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-sm transition-all"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm shadow-md shadow-indigo-200 transition-all disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Reset Password"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/* ─── Main Login Page ─── */
export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const data = await loginUser(email, password);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      if (rememberMe) {
        localStorage.setItem("rememberEmail", email);
      } else {
        localStorage.removeItem("rememberEmail");
      }

      showToast("Welcome back! Redirecting...", "success");

      setTimeout(() => {
        navigate("/dashboard");
      }, 800);

    } catch (err) {
      console.error(err);
      showToast(err.message || err.error || "Unable to connect to server. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white">
      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        showToast={showToast}
      />

      {/* ─── LEFT PANEL (Branding) ─── */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950" />

        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[length:24px_24px]" />

        {/* Decorative Blurs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/10">
              <Warehouse className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                PickList Manager
              </h1>
              <p className="text-xs text-white/50 font-medium uppercase tracking-widest">
                Warehouse Intelligence
              </p>
            </div>
          </div>

          {/* Middle Content */}
          <div className="space-y-8 max-w-md">
            <div>
              <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
                Streamline your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-300">
                  warehouse operations
                </span>
              </h2>
              <p className="mt-4 text-base text-white/60 leading-relaxed">
                Extract, manage, and submit pick lists with intelligent PDF parsing.
                Built for modern logistics teams.
              </p>
            </div>

            <div className="space-y-4 pt-4">
              <FeatureItem icon={PackageCheck} text="Automated PDF picklist extraction" />
              <FeatureItem icon={Truck} text="Real-time inventory tracking" />
              <FeatureItem icon={BarChart3} text="Advanced analytics & reporting" />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-6 text-white/40 text-sm">
            <span>© 2026 PickList Manager</span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span>v2.4.0</span>
          </div>
        </div>
      </div>

      {/* ─── RIGHT PANEL (Login Form) ─── */}
      <div className="w-full lg:w-1/2 xl:w-[45%] flex flex-col justify-center items-center p-6 sm:p-12 bg-gray-50/50">

        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center gap-3 mb-8">
          <div className="p-2 bg-indigo-600 rounded-lg">
            <Warehouse className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">PickList Manager</h1>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Warehouse Intelligence</p>
          </div>
        </div>

        {/* Login Card */}
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-sm text-gray-500">
              Enter your credentials to access your dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 space-y-6">

            <InputField
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors(prev => ({ ...prev, email: null }));
              }}
              placeholder="you@company.com"
              icon={Mail}
              error={errors.email}
            />

            <InputField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors(prev => ({ ...prev, password: null }));
              }}
              placeholder="••••••••"
              icon={Lock}
              error={errors.password}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="w-5 h-5 rounded-md border-2 border-gray-300 peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-all duration-200" />
                  <CheckCircle2 className="w-3.5 h-3.5 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 transition-opacity duration-200" />
                </div>
                <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                  Remember me
                </span>
              </label>

              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all duration-200 overflow-hidden group"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}