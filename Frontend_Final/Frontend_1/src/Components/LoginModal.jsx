import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { validateField } from "../utils/validation";

export default function LoginModal({ show, onClose }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [errors, setErrors] = useState({});
    const { login } = useAuth();
    const navigate = useNavigate();

    if (!show) return null;

    const validateForm = () => {
        const newErrors = {};
        
        const emailError = validateField('email', email);
        if (emailError) newErrors.email = emailError;
        
        if (!password.trim()) newErrors.password = "Password is required";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        try {
            const response = await authAPI.login({ email, password });
            
            console.log('Login response:', response.data);
            
            login({
                userId: response.data.userId,
                name: response.data.fullName,
                email: response.data.email,
                Role: response.data.role,
                Token: response.data.token
            });

            onClose();
            console.log('Navigating to:', response.data.redirectTo);
            navigate(response.data.redirectTo || "/");
        } catch {
            setError("Invalid email or password");
        }
    };

    return (
        <div
            className="d-flex align-items-center justify-content-center"
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0,0,0,0.7)",
                zIndex: 1050,
                backdropFilter: "blur(5px)"
            }}
        >
            <div className="card shadow-lg border-0 rounded-4" style={{ width: "450px", maxWidth: "90vw" }}>
                <div className="card-header text-white text-center py-4 border-0" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
                    <h3 className="mb-1 fw-bold">🔑 Welcome Back</h3>
                    <p className="mb-0 opacity-75">Sign in to your emergency account</p>
                </div>
                
                <div className="card-body p-4">
                    {error && (
                        <div className="alert alert-danger border-0 rounded-3 mb-4">
                            <div className="d-flex align-items-center">
                                <span className="me-2">⚠️</span>
                                {error}
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label className="form-label fw-semibold text-dark mb-2">
                                📧 Email Address
                            </label>
                            <input
                                type="email"
                                className={`form-control form-control-lg border-2 rounded-3 py-3 ${errors.email ? 'is-invalid' : ''}`}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                            />
                            {errors.email && (
                                <div className="invalid-feedback">{errors.email}</div>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-semibold text-dark mb-2">
                                🔒 Password
                            </label>
                            <input
                                type="password"
                                className={`form-control form-control-lg border-2 rounded-3 py-3 ${errors.password ? 'is-invalid' : ''}`}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                            />
                            {errors.password && (
                                <div className="invalid-feedback">{errors.password}</div>
                            )}
                        </div>

                        <button 
                            className="btn btn-lg w-100 fw-semibold py-3 border-0 rounded-3 mb-4"
                            style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                fontSize: '1.1rem'
                            }}
                        >
                            🚀 Sign In
                        </button>
                    </form>

                    <hr className="my-4" />

                    <div className="text-center mb-3">
                        <p className="text-muted mb-3">Don't have an account?</p>
                        <a 
                            href="/register" 
                            className="btn btn-outline-secondary btn-lg w-100 py-3 rounded-3 fw-semibold"
                        >
                            🆕 Create New Account
                        </a>
                    </div>

                    <div className="text-center mt-4">
                        <button 
                            className="btn btn-link text-danger fw-semibold" 
                            onClick={onClose}
                        >
                            ✖ Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}