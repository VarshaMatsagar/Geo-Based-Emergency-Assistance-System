import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import { validateField } from "../utils/validation";

export default function Register() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: ""
  });
  const [otp, setOtp] = useState("");
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    const nameError = validateField('name', form.fullName);
    if (nameError) newErrors.fullName = nameError;
    
    const emailError = validateField('email', form.email);
    if (emailError) newErrors.email = emailError;
    
    const phoneError = validateField('phone', form.phoneNumber);
    if (phoneError) newErrors.phoneNumber = phoneError;
    
    const passwordError = validateField('password', form.password);
    if (passwordError) newErrors.password = passwordError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const sendOtp = async () => {
    if (!validateEmail(form.email)) {
      alert("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      await authAPI.sendOtp({ email: form.email });
      setShowOtpScreen(true);
      startCountdown();
      alert("OTP sent to your email!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (otp.length !== 6) {
      alert("Please enter a 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      await authAPI.verifyOtp({ email: form.email, otp });
      setIsEmailVerified(true);
      alert("Email verified successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (!canResend) return;
    await sendOtp();
  };

  const startCountdown = () => {
    setCanResend(false);
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    if (!isEmailVerified) {
      alert("Please verify your email first");
      return;
    }

    try {
      const response = await authAPI.register(form);
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data || "Registration failed");
    }
  };

  if (showOtpScreen && !isEmailVerified) {
    return (
      <div
        style={{
          minHeight: "calc(100vh - 70px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "20px"
        }}
      >
        <div
          className="card shadow-lg border-0 rounded-4"
          style={{
            width: "100%",
            maxWidth: "450px"
          }}
        >
          <div className="card-header text-white text-center py-4 border-0" style={{background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)'}}>
            <h2 className="mb-1 fw-bold">📧 Verify Email</h2>
            <p className="mb-0 opacity-75">Check your inbox for verification code</p>
          </div>
          
          <div className="card-body p-4">
            <p className="text-center mb-4 text-muted">Enter the 6-digit OTP sent to <strong>{form.email}</strong></p>

            <div className="mb-4">
              <input
                type="text"
                className="form-control form-control-lg text-center border-2 rounded-3 py-3"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                style={{ letterSpacing: '0.5em', fontSize: '1.5rem' }}
              />
            </div>

            <button 
              onClick={verifyOtp} 
              className="btn btn-lg w-100 fw-semibold py-3 border-0 rounded-3 mb-3"
              style={{
                background: (loading || otp.length !== 6) ? '#6c757d' : 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                color: 'white',
                fontSize: '1.1rem'
              }}
              disabled={loading || otp.length !== 6}
            >
              {loading ? "Verifying..." : "✅ Verify OTP"}
            </button>

            <button 
              onClick={resendOtp} 
              className="btn btn-outline-secondary w-100 py-3 rounded-3 fw-semibold mb-3"
              disabled={!canResend || loading}
            >
              {canResend ? "🔄 Resend OTP" : `⏱️ Resend in ${countdown}s`}
            </button>

            <button 
              onClick={() => setShowOtpScreen(false)} 
              className="btn btn-link w-100 text-primary fw-semibold"
            >
              ← Back to Registration
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "calc(100vh - 70px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px"
      }}
    >
      <div
        className="card shadow-lg border-0 rounded-4"
        style={{
          width: "100%",
          maxWidth: "500px"
        }}
      >
        <div className="card-header text-white text-center py-4 border-0" style={{background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)'}}>
          <h2 className="mb-1 fw-bold">🆕 Join Emergency Network</h2>
          <p className="mb-0 opacity-75">Create your emergency response account</p>
        </div>
        
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label fw-semibold text-dark mb-2">
                👤 Full Name
              </label>
              <input
                type="text"
                name="fullName"
                className={`form-control form-control-lg border-2 rounded-3 py-3 ${errors.fullName ? 'is-invalid' : ''}`}
                placeholder="Enter your full name"
                value={form.fullName}
                onChange={handleChange}
                required
              />
              {errors.fullName && (
                <div className="invalid-feedback">{errors.fullName}</div>
              )}
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold text-dark mb-2">
                📧 Email Address
              </label>
              <div className="input-group">
                <input
                  type="email"
                  name="email"
                  className={`form-control form-control-lg border-2 rounded-start-3 py-3 ${
                    errors.email ? 'is-invalid' : ''
                  } ${
                    isEmailVerified ? 'is-valid' : ''
                  }`}
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  disabled={isEmailVerified}
                />
                {!isEmailVerified && (
                  <button
                    type="button"
                    className="btn btn-outline-primary px-4 rounded-end-3"
                    onClick={sendOtp}
                    disabled={!form.email || !validateEmail(form.email) || loading}
                  >
                    {loading ? "Sending..." : "Verify"}
                  </button>
                )}
                {isEmailVerified && (
                  <span className="input-group-text bg-success text-white rounded-end-3">
                    ✓ Verified
                  </span>
                )}
              </div>
              {errors.email && (
                <div className="invalid-feedback d-block">
                  {errors.email}
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold text-dark mb-2">
                📞 Phone Number
              </label>
              <input
                type="text"
                name="phoneNumber"
                className={`form-control form-control-lg border-2 rounded-3 py-3 ${errors.phoneNumber ? 'is-invalid' : ''}`}
                placeholder="Enter your phone number"
                value={form.phoneNumber}
                onChange={handleChange}
                required
              />
              {errors.phoneNumber && (
                <div className="invalid-feedback">{errors.phoneNumber}</div>
              )}
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold text-dark mb-2">
                🔒 Password
              </label>
              <input
                type="password"
                name="password"
                className={`form-control form-control-lg border-2 rounded-3 py-3 ${errors.password ? 'is-invalid' : ''}`}
                placeholder="Create a secure password"
                value={form.password}
                onChange={handleChange}
                required
              />
              {errors.password && (
                <div className="invalid-feedback">{errors.password}</div>
              )}
            </div>

            <button 
              type="submit" 
              className="btn btn-lg w-100 fw-semibold py-3 border-0 rounded-3"
              style={{
                background: isEmailVerified ? 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)' : '#6c757d',
                color: 'white',
                fontSize: '1.1rem'
              }}
              disabled={!isEmailVerified}
            >
              🚀 Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}