import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const navigate = useNavigate();

    return (
        <div style={{ 
            paddingTop: '80px', 
            minHeight: '100vh', 
            backgroundImage: 'url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
        }}>
            <style>
                {`
                @keyframes gradientShift {
                    0% { background-position: 0% 50%, 100% 0%, 0% 0%; }
                    25% { background-position: 100% 50%, 0% 100%, 50% 50%; }
                    50% { background-position: 50% 100%, 50% 50%, 100% 100%; }
                    75% { background-position: 0% 0%, 100% 50%, 50% 0%; }
                    100% { background-position: 0% 50%, 100% 0%, 0% 0%; }
                }
                `}
            </style>
            <Container className="py-5">
                {/* Floating Elements */}
                <div style={{
                    position: 'absolute',
                    top: '10%',
                    left: '10%',
                    width: '100px',
                    height: '100px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%',
                    animation: 'float 6s ease-in-out infinite'
                }}></div>
                <div style={{
                    position: 'absolute',
                    top: '20%',
                    right: '15%',
                    width: '60px',
                    height: '60px',
                    background: 'rgba(255, 107, 107, 0.2)',
                    borderRadius: '50%',
                    animation: 'float 8s ease-in-out infinite reverse'
                }}></div>
                <div style={{
                    position: 'absolute',
                    bottom: '30%',
                    left: '20%',
                    width: '80px',
                    height: '80px',
                    background: 'rgba(103, 126, 234, 0.15)',
                    borderRadius: '50%',
                    animation: 'float 10s ease-in-out infinite'
                }}></div>
                
                <style>
                    {`
                    @keyframes float {
                        0%, 100% { transform: translateY(0px) rotate(0deg); }
                        50% { transform: translateY(-20px) rotate(180deg); }
                    }
                    `}
                </style>

                {/* Hero Section */}
                <Row className="justify-content-center text-center text-white mb-5">
                    <Col xs={12} lg={10}>
                        <div className="mb-4" style={{
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))',
                            borderRadius: '30px',
                            width: '150px',
                            height: '150px',
                            margin: '0 auto',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backdropFilter: 'blur(20px)',
                            border: '2px solid rgba(255, 255, 255, 0.3)',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                            animation: 'pulse 3s ease-in-out infinite'
                        }}>
                            <div style={{ fontSize: '5rem', textShadow: '0 0 20px rgba(255,255,255,0.5)' }}>🚨</div>
                        </div>
                        
                        <style>
                            {`
                            @keyframes pulse {
                                0%, 100% { transform: scale(1); box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
                                50% { transform: scale(1.05); box-shadow: 0 25px 50px rgba(0,0,0,0.2); }
                            }
                            `}
                        </style>
                        
                        <h1 className="display-2 fw-bold mb-4" style={{
                            textShadow: '3px 3px 6px rgba(0,0,0,0.4)',
                            background: 'linear-gradient(45deg, #fff, #ffd700, #ff69b4, #00ffff)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundSize: '300% 300%',
                            animation: 'textShine 4s ease-in-out infinite'
                        }}>
                            ⚡ GeoEmergency ⚡
                        </h1>
                        
                        <style>
                            {`
                            @keyframes textShine {
                                0%, 100% { background-position: 0% 50%; }
                                50% { background-position: 100% 50%; }
                            }
                            `}
                        </style>
                        
                        <p className="lead mb-4" style={{ 
                            fontSize: '1.4rem',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))',
                            color: '#1e293b',
                            padding: '25px',
                            borderRadius: '20px',
                            backdropFilter: 'blur(15px)',
                            border: '1px solid rgba(255,255,255,0.3)',
                            boxShadow: '0 15px 35px rgba(0,0,0,0.1)'
                        }}>
                            🛡️ Your safety is our priority. Connect instantly with emergency services 
                            using advanced geo-location technology. 📍
                        </p>
                        <div className="d-flex flex-column flex-sm-row gap-4 justify-content-center mb-5">
                            <Button 
                                size="lg" 
                                onClick={() => navigate('/register')}
                                className="px-5 py-3"
                                style={{ 
                                    borderRadius: '30px', 
                                    fontWeight: '700',
                                    fontSize: '1.2rem',
                                    background: 'linear-gradient(45deg, #ff6b6b, #feca57, #ff9ff3, #54a0ff)',
                                    border: 'none',
                                    boxShadow: '0 10px 30px rgba(255, 107, 107, 0.4)',
                                    transform: 'translateY(0)',
                                    transition: 'all 0.4s ease',
                                    backgroundSize: '300% 300%',
                                    animation: 'buttonGradient 3s ease infinite'
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.transform = 'translateY(-5px) scale(1.05)';
                                    e.target.style.boxShadow = '0 15px 40px rgba(255, 107, 107, 0.6)';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.transform = 'translateY(0) scale(1)';
                                    e.target.style.boxShadow = '0 10px 30px rgba(255, 107, 107, 0.4)';
                                }}
                            >
                                🚀 Get Started Now
                            </Button>
                            <Button 
                                size="lg" 
                                onClick={() => navigate('/about')}
                                className="px-5 py-3"
                                style={{ 
                                    borderRadius: '30px', 
                                    fontWeight: '700',
                                    fontSize: '1.2rem',
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))',
                                    border: '2px solid rgba(255, 255, 255, 0.4)',
                                    backdropFilter: 'blur(15px)',
                                    color: 'white',
                                    boxShadow: '0 10px 30px rgba(255, 255, 255, 0.2)'
                                }}
                            >
                                📖 Learn More
                            </Button>
                        </div>
                        
                        <style>
                            {`
                            @keyframes buttonGradient {
                                0%, 100% { background-position: 0% 50%; }
                                50% { background-position: 100% 50%; }
                            }
                            `}
                        </style>
                    </Col>
                </Row>

                {/* Features Section */}
                <Row className="g-4 mb-5">
                    <Col md={4}>
                        <Card className="h-100 text-center border-0 shadow-lg" style={{ 
                            borderRadius: '25px',
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.05))',
                            backdropFilter: 'blur(20px)',
                            border: '2px solid rgba(255, 255, 255, 0.3)',
                            transform: 'translateY(0)',
                            transition: 'all 0.4s ease'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-10px) rotateY(5deg)';
                            e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.2)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0) rotateY(0deg)';
                            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                        }}
                        >
                            <Card.Body className="p-4">
                                <div className="mb-3" style={{ 
                                    fontSize: '5rem',
                                    filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))',
                                    animation: 'bounce 2s ease-in-out infinite'
                                }}>
                                    🆘
                                </div>
                                <h5 className="fw-bold text-white mb-3" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>Emergency SOS</h5>
                                <p className="text-white" style={{ opacity: 0.9, textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                                    ⚡ Instantly alert emergency services with your exact location in seconds
                                </p>
                                <div className="mt-3">
                                    <span className="badge px-4 py-2" style={{
                                        background: 'linear-gradient(45deg, #ff6b6b, #ee5a24, #ff9ff3)',
                                        border: 'none',
                                        borderRadius: '20px',
                                        fontSize: '0.9rem',
                                        boxShadow: '0 5px 15px rgba(255, 107, 107, 0.4)'
                                    }}>🚨 One-Click Alert</span>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="h-100 text-center border-0 shadow-lg" style={{ 
                            borderRadius: '20px',
                            background: 'rgba(255, 255, 255, 0.15)',
                            backdropFilter: 'blur(15px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                            <Card.Body className="p-4">
                                <div className="mb-3" style={{ 
                                    fontSize: '4rem',
                                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                                }}>
                                    📍
                                </div>
                                <h5 className="fw-bold text-white mb-3">GPS Tracking</h5>
                                <p className="text-white" style={{ opacity: 0.9 }}>
                                    🗺️ Real-time location sharing for quick emergency response and navigation
                                </p>
                                <div className="mt-3">
                                    <span className="badge px-3 py-2" style={{
                                        background: 'linear-gradient(45deg, #3b82f6, #1d4ed8)',
                                        border: 'none',
                                        borderRadius: '15px'
                                    }}>📡 Live Tracking</span>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="h-100 text-center border-0 shadow-lg" style={{ 
                            borderRadius: '20px',
                            background: 'rgba(255, 255, 255, 0.15)',
                            backdropFilter: 'blur(15px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                            <Card.Body className="p-4">
                                <div className="mb-3" style={{ 
                                    fontSize: '4rem',
                                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                                }}>
                                    📸
                                </div>
                                <h5 className="fw-bold text-white mb-3">Photo Evidence</h5>
                                <p className="text-white" style={{ opacity: 0.9 }}>
                                    🖼️ Upload incident photos for better emergency assistance and documentation
                                </p>
                                <div className="mt-3">
                                    <span className="badge px-3 py-2" style={{
                                        background: 'linear-gradient(45deg, #10b981, #059669)',
                                        border: 'none',
                                        borderRadius: '15px'
                                    }}>📱 Instant Upload</span>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Combined Services and Stats Section */}
                <Row className="g-4 mb-5">
                    <Col lg={3} md={6}>
                        <Card className="text-center border-0 shadow-lg" style={{ 
                            borderRadius: '15px', 
                            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', 
                            color: 'white',
                            transform: 'translateY(0)',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <Card.Body className="p-3">
                                <div style={{ fontSize: '2.5rem' }}>👮‍♂️</div>
                                <h6 className="fw-bold">Police</h6>
                                <small>🚔 Law Enforcement</small>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={3} md={6}>
                        <Card className="text-center border-0 shadow-lg" style={{ 
                            borderRadius: '15px', 
                            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', 
                            color: 'white',
                            transform: 'translateY(0)',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <Card.Body className="p-3">
                                <div style={{ fontSize: '2.5rem' }}>🚑</div>
                                <h6 className="fw-bold">Medical</h6>
                                <small>🏥 Emergency Care</small>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={3} md={6}>
                        <Card className="text-center border-0 shadow-lg" style={{ 
                            borderRadius: '15px', 
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
                            color: 'white',
                            transform: 'translateY(0)',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <Card.Body className="p-3">
                                <div style={{ fontSize: '2.5rem' }}>⚡</div>
                                <h6 className="fw-bold">24/7</h6>
                                <small>Available Always</small>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={3} md={6}>
                        <Card className="text-center border-0 shadow-lg" style={{ 
                            borderRadius: '15px', 
                            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', 
                            color: 'white',
                            transform: 'translateY(0)',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <Card.Body className="p-3">
                                <div style={{ fontSize: '2.5rem' }}>🛡️</div>
                                <h6 className="fw-bold">100%</h6>
                                <small>Secure & Safe</small>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}