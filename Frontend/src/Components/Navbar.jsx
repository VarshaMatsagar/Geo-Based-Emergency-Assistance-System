import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button, NavDropdown } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import LoginModal from "./LoginModal";

export default function NavigationBar() {
    const [showLogin, setShowLogin] = useState(false);
    const { isLoggedIn, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <>
            <Navbar expand="lg" fixed="top" className="shadow-sm" style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%) !important', 
                backdropFilter: 'blur(20px)',
                borderBottom: '3px solid #ff6b6b'
            }}>
                <Container>
                    <Navbar.Brand as={Link} to="/" className="fw-bold d-flex align-items-center">
                        <i className="fas fa-shield-alt me-2" style={{ color: '#ffd700', fontSize: '1.5rem' }}></i>
                        <span style={{ 
                            color: '#ffd700',
                            fontSize: '1.5rem',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                        }}>
                            GeoEmergency
                        </span>
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/" className="fw-semibold" style={{ color: '#ffd700 !important' }}>
                                <i className="fas fa-home me-1" style={{ color: '#ffd700' }}></i>
                                Home
                            </Nav.Link>

                            {/* Role-based navigation */}
                            {isLoggedIn && user?.role === "ADMIN" && (
                                <Nav.Link as={Link} to="/admin" className="fw-semibold" style={{ color: '#ff6b6b !important' }}>
                                    <i className="fas fa-cog me-1" style={{ color: '#ff6b6b' }}></i>
                                    Admin Dashboard
                                </Nav.Link>
                            )}

                            {isLoggedIn && user?.role === "POLICE" && (
                                <Nav.Link as={Link} to="/police" className="fw-semibold" style={{ color: '#4facfe !important' }}>
                                    <i className="fas fa-badge me-1" style={{ color: '#4facfe' }}></i>
                                    Police Dashboard
                                </Nav.Link>
                            )}

                            {isLoggedIn && user?.role === "HOSPITAL" && (
                                <Nav.Link as={Link} to="/hospital" className="fw-semibold" style={{ color: '#10b981 !important' }}>
                                    <i className="fas fa-hospital me-1" style={{ color: '#10b981' }}></i>
                                    Hospital Dashboard
                                </Nav.Link>
                            )}

                            {isLoggedIn && user?.role === "CITIZEN" && (
                                <Nav.Link as={Link} to="/citizen" className="fw-semibold" style={{ color: '#feca57 !important' }}>
                                    <i className="fas fa-user me-1" style={{ color: '#feca57' }}></i>
                                    Citizen Portal
                                </Nav.Link>
                            )}

                            <Nav.Link as={Link} to="/about" className="fw-semibold" style={{ color: '#ff9ff3 !important' }}>
                                <i className="fas fa-info-circle me-1" style={{ color: '#ff9ff3' }}></i>
                                About
                            </Nav.Link>
                            
                            <Nav.Link as={Link} to="/contact" className="fw-semibold" style={{ color: '#54a0ff !important' }}>
                                <i className="fas fa-envelope me-1" style={{ color: '#54a0ff' }}></i>
                                Contact
                            </Nav.Link>
                            
                            {isLoggedIn && user?.role === "CITIZEN" && (
                                <Nav.Link as={Link} to="/feedback" className="fw-semibold" style={{ color: '#5f27cd !important' }}>
                                    <i className="fas fa-comment me-1" style={{ color: '#5f27cd' }}></i>
                                    Feedback
                                </Nav.Link>
                            )}
                        </Nav>

                        <Nav className="ms-auto">
                            {isLoggedIn ? (
                                <NavDropdown 
                                    title={
                                        <span className="d-flex align-items-center">
                                            <i className="fas fa-user me-2" style={{ color: '#ff6b6b' }}></i>
                                            <span className="fw-semibold" style={{ color: '#000000' }}>
                                                {user?.name} ({user?.role})
                                            </span>
                                        </span>
                                    } 
                                    id="user-dropdown"
                                    align="end"
                                >
                                    <NavDropdown.Item disabled className="text-center py-3">
                                        <div>
                                            <strong className="d-block">{user?.name}</strong>
                                            <small className="text-muted">{user?.email}</small>
                                            <div className="mt-2">
                                                <span className="badge bg-primary">{user?.role}</span>
                                            </div>
                                        </div>
                                    </NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={handleLogout} className="text-danger">
                                        <i className="fas fa-sign-out-alt me-2"></i>
                                        Logout
                                    </NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <div className="d-flex gap-2">
                                    <Button
                                        variant="outline-primary"
                                        onClick={() => setShowLogin(true)}
                                        style={{ borderRadius: '25px', padding: '8px 20px' }}
                                    >
                                        <i className="fas fa-sign-in-alt me-2"></i>
                                        Login
                                    </Button>
                                    <Button
                                        variant="primary"
                                        onClick={() => navigate('/register')}
                                        style={{ 
                                            borderRadius: '25px', 
                                            padding: '8px 20px',
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            border: 'none'
                                        }}
                                    >
                                        <i className="fas fa-user-plus me-2"></i>
                                        Sign Up
                                    </Button>
                                </div>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <LoginModal
                show={showLogin}
                onClose={() => setShowLogin(false)}
            />
        </>
    );
}