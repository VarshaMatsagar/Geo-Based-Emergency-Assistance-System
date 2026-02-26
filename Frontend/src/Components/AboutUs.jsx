import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

const AboutUs = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Prem Myana",
      role: "Software Developer",
      image: "Prem.jpeg",
    },
    {
      id: 2,
      name: "Vedant Mali",
      role: "Software Developer",
      image: "Vedant.jpeg",
    },
    {
      id: 3,
      name: "Varsha Matsagar",
      role: "Software Developer",
      image: "Varsha.jpeg",
    },
    {
      id: 4,
      name: "Sofiya Sutar",
      role: "Software Developer",
      image: "Sofiya.jpeg",
    }
  ];

  return (
    <div className="main-content" style={{ background: '#f8fafc', minHeight: '100vh', paddingTop: '80px' }}>
      {/* Hero Section */}
      <section
        className="py-5 text-white position-relative"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          minHeight: '400px',
          display: 'flex',
          alignItems: 'center'
        }}
      >

        <Container className="position-relative">
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <h1 className="display-3 fw-bold mb-4">
                <i className="fas fa-shield-alt me-3"></i>
                Geo-Based Emergency Assistance System
              </h1>
              <p className="lead fs-4">
                A smart solution to connect citizens with nearby police stations and hospitals during emergencies.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* About Project */}
      <section className="py-5">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <div className="pe-lg-4">
                <h2 className="fw-bold mb-4 fs-1" style={{ color: '#1e293b' }}>
                  <i className="fas fa-exclamation-triangle me-3" style={{ color: '#ef4444' }}></i>
                  About the Project
                </h2>
                <div className="mb-4">
                  <p className="lead text-muted mb-4 fs-5">
                    The Geo-Based Emergency Assistance System is designed to provide quick
                    assistance during critical situations such as accidents, crimes,
                    and medical emergencies.
                  </p>
                  <p className="lead text-muted mb-4 fs-5">
                    The system automatically detects the user's location and sends
                    alerts to the nearest police station and hospital, reducing
                    response time and saving lives.
                  </p>
                  <p className="lead text-muted fs-5">
                    This project focuses on public safety, real-time communication,
                    and location-based services.
                  </p>
                </div>
                
                <div className="d-flex flex-wrap gap-3">
                  <div className="d-flex align-items-center">
                    <div 
                      className="me-3"
                      style={{
                        width: '50px',
                        height: '50px',
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                      }}
                    >
                      <i className="fas fa-clock"></i>
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold fs-6">Fast Response</h6>
                      <small className="text-muted fs-6">Quick emergency alerts</small>
                    </div>
                  </div>
                  
                  <div className="d-flex align-items-center">
                    <div 
                      className="me-3"
                      style={{
                        width: '50px',
                        height: '50px',
                        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                      }}
                    >
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold fs-6">Location Based</h6>
                      <small className="text-muted fs-6">GPS tracking system</small>
                    </div>
                  </div>
                </div>
              </div>
            </Col>

            <Col lg={6}>
              <div className="text-center">
                <img
                  src="Alert.png"
                  alt="Emergency System"
                  className="img-fluid rounded-4 shadow-lg"
                  style={{ maxHeight: '400px', objectFit: 'cover' }}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Mission & Vision */}
      <section className="py-5" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Container>
          <Row className="g-5 text-center text-white">
            <Col lg={6}>
              <div 
                className="p-4 rounded-4"
                style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)' }}
              >
                <div 
                  className="mx-auto mb-4"
                  style={{
                    width: '80px',
                    height: '80px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem'
                  }}
                >
                  <i className="fas fa-bullseye"></i>
                </div>
                <h3 className="fw-bold mb-3 fs-2">Our Mission</h3>
                <p className="lead fs-5">
                  To provide a fast, reliable, and location-based emergency assistance
                  system that ensures immediate help from police and hospitals.
                </p>
              </div>
            </Col>

            <Col lg={6}>
              <div 
                className="p-4 rounded-4"
                style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)' }}
              >
                <div 
                  className="mx-auto mb-4"
                  style={{
                    width: '80px',
                    height: '80px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem'
                  }}
                >
                  <i className="fas fa-globe"></i>
                </div>
                <h3 className="fw-bold mb-3 fs-2">Our Vision</h3>
                <p className="lead fs-5">
                  To enhance public safety by leveraging technology for smarter
                  emergency response and saving lives.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Meet the Team */}
      <section className="py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3 fs-1" style={{ color: '#1e293b' }}>
              <i className="fas fa-users me-3" style={{ color: '#6366f1' }}></i>
              Meet Our Team
            </h2>
            <p className="lead text-muted fs-5">
              The talented team behind the Geo-Based Emergency Assistance System
            </p>
          </div>

          <Row className="g-4 justify-content-center">
            {teamMembers.map(member => (
              <Col key={member.id} md={6} lg={3}>
                <Card 
                  className="border-0 shadow-lg text-center h-100 p-4"
                  style={{ 
                    borderRadius: '20px',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-10px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div className="position-relative mb-3">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="rounded-circle mx-auto shadow"
                      style={{ 
                        width: "120px", 
                        height: "120px", 
                        objectFit: "cover",
                        border: '4px solid #f1f5f9'
                      }}
                    />
                  </div>

                  <h5 className="fw-bold mb-2 fs-4" style={{ color: '#1e293b' }}>{member.name}</h5>
                  <p className="fw-semibold mb-3 fs-6" style={{ color: '#1e293b' }}>{member.role}</p>
                  <div 
                    className="mx-auto"
                    style={{
                      width: '50px',
                      height: '3px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '2px'
                    }}
                  ></div>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default AboutUs;