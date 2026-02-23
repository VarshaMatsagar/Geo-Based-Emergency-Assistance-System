import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import LoginModal from "./LoginModal";

export default function Navbar() {
    const [showLogin, setShowLogin] = useState(false);
    const { isLoggedIn, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">
                        GeoEmergency
                    </Link>

                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarNav">
                        {/* ================= LEFT MENU ================= */}
                        <ul className="navbar-nav gap-3">
                            <li className="nav-item">
                                <Link className="nav-link" to="/">
                                    Home
                                </Link>
                            </li>

                            {/* ===== ROLE BASED NAVIGATION ===== */}
                            {isLoggedIn && user?.role === "Admin" && (
                                <li className="nav-item">
                                    <Link className="nav-link" to="/admin">
                                        Admin Dashboard
                                    </Link>
                                </li>
                            )}

                            {isLoggedIn && user?.role === "Police" && (
                                <li className="nav-item">
                                    <Link className="nav-link" to="/police">
                                        Police Dashboard
                                    </Link>
                                </li>
                            )}

                            {isLoggedIn && (user?.role === "Hospital" || user?.Role === "Hospital") && (
                                <li className="nav-item">
                                    <Link className="nav-link" to="/hospital">
                                        Hospital Dashboard
                                    </Link>
                                </li>
                            )}

                            {isLoggedIn && user?.role === "Citizen" && (
                                <li className="nav-item">
                                    <Link className="nav-link" to="/citizen">
                                        Citizen Portal
                                    </Link>
                                </li>
                            )}

                            <li className="nav-item"><a className="nav-link" href="about">About</a></li>
                            <li className="nav-item"><a className="nav-link" href="contact">Contact</a></li>
                        </ul>

                        {/* ================= RIGHT MENU ================= */}
                        <div className="ms-auto">
                            {isLoggedIn ? (
                                <div className="d-flex align-items-center gap-3">
                                    <span className="text-light">
                                        Welcome, {user?.name} ({user?.role})
                                    </span>

                                    <button
                                        className="btn btn-outline-light"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <button
                                    className="btn btn-outline-light"
                                    onClick={() => setShowLogin(true)}
                                >
                                    Login
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* ================= LOGIN MODAL ================= */}
            <LoginModal
                show={showLogin}
                onClose={() => setShowLogin(false)}
            />
        </>
    );
}
