import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer 
      className="text-light py-5 mt-auto" 
      style={{ 
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)',
        borderTop: '3px solid #6366f1'
      }}
    >
      <Container>
        <Row className="g-4">
          {/* Company Info */}
          <Col lg={4} md={6}>
            <div className="mb-4">
              <h4 
                className="mb-3" 
                style={{ 
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: '800'
                }}
              >
                <i className="fas fa-shield-alt me-2"></i>
                GeoEmergency
              </h4>
              <p className="text-light mb-3" style={{ lineHeight: '1.6' }}>
                Your safety is our priority. We provide rapid emergency response services 
                with advanced location tracking and real-time communication.
              </p>
              <div className="d-flex gap-3">
                <a 
                  href="#" 
                  className="text-decoration-none" 
                  style={{ 
                    color: '#60a5fa',
                    fontSize: '1.5rem',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => e.target.style.color = '#3b82f6'}
                  onMouseOut={(e) => e.target.style.color = '#60a5fa'}
                >
                  <i className="fab fa-facebook"></i>
                </a>
                <a 
                  href="#" 
                  className="text-decoration-none" 
                  style={{ 
                    color: '#34d399',
                    fontSize: '1.5rem',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => e.target.style.color = '#10b981'}
                  onMouseOut={(e) => e.target.style.color = '#34d399'}
                >
                  <i className="fab fa-twitter"></i>
                </a>
                <a 
                  href="#" 
                  className="text-decoration-none" 
                  style={{ 
                    color: '#f59e0b',
                    fontSize: '1.5rem',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => e.target.style.color = '#d97706'}
                  onMouseOut={(e) => e.target.style.color = '#f59e0b'}
                >
                  <i className="fab fa-instagram"></i>
                </a>
                <a 
                  href="#" 
                  className="text-decoration-none" 
                  style={{ 
                    color: '#ef4444',
                    fontSize: '1.5rem',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => e.target.style.color = '#dc2626'}
                  onMouseOut={(e) => e.target.style.color = '#ef4444'}
                >
                  <i className="fab fa-youtube"></i>
                </a>
              </div>
            </div>
          </Col>

          {/* Quick Links */}
          <Col lg={2} md={6}>
            <h5 className="mb-3" style={{ color: '#f1f5f9', fontWeight: '600' }}>
              <i className="fas fa-link me-2" style={{ color: '#6366f1' }}></i>
              Quick Links
            </h5>
            <ul className="list-unstyled">
              {[
                { name: 'Home', icon: 'fas fa-home', color: '#60a5fa', path: '/' },
                { name: 'About Us', icon: 'fas fa-info-circle', color: '#34d399', path: '/about' },
                { name: 'Contact', icon: 'fas fa-envelope', color: '#ef4444', path: '/contact' }
              ].map((link, index) => (
                <li key={index} className="mb-2">
                  <Link 
                    to={link.path}
                    className="text-decoration-none d-flex align-items-center" 
                    style={{ 
                      color: '#cbd5e1',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.color = link.color;
                      e.target.style.paddingLeft = '8px';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.color = '#cbd5e1';
                      e.target.style.paddingLeft = '0px';
                    }}
                  >
                    <i className={`${link.icon} me-2`} style={{ color: link.color, width: '16px' }}></i>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </Col>

          {/* Emergency Services */}
          <Col lg={3} md={6}>
            <h5 className="mb-3" style={{ color: '#f1f5f9', fontWeight: '600' }}>
              <i className="fas fa-ambulance me-2" style={{ color: '#ef4444' }}></i>
              Emergency Services
            </h5>
            <ul className="list-unstyled">
              {[
                { name: 'Police Emergency', icon: 'fas fa-shield-alt', color: '#3b82f6' },
                { name: 'Medical Emergency', icon: 'fas fa-heartbeat', color: '#ef4444' }
              ].map((service, index) => (
                <li key={index} className="mb-2">
                  <a 
                    href="#" 
                    className="text-decoration-none d-flex align-items-center" 
                    style={{ 
                      color: '#cbd5e1',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.color = service.color;
                      e.target.style.paddingLeft = '8px';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.color = '#cbd5e1';
                      e.target.style.paddingLeft = '0px';
                    }}
                  >
                    <i className={`${service.icon} me-2`} style={{ color: service.color, width: '16px' }}></i>
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </Col>

          {/* Contact Info */}
          <Col lg={3} md={6}>
            <h5 className="mb-3" style={{ color: '#f1f5f9', fontWeight: '600' }}>
              <i className="fas fa-phone me-2" style={{ color: '#10b981' }}></i>
              Contact Info
            </h5>
            <div className="mb-3">
              <div className="d-flex align-items-center mb-2">
                <i className="fas fa-phone-alt me-3" style={{ color: '#10b981', width: '16px' }}></i>
                <span style={{ color: '#cbd5e1' }}>Emergency: 911</span>
              </div>
              <div className="d-flex align-items-center mb-2">
                <i className="fas fa-envelope me-3" style={{ color: '#6366f1', width: '16px' }}></i>
                <span style={{ color: '#cbd5e1' }}>support@geoemergency.com</span>
              </div>
              <div className="d-flex align-items-center mb-2">
                <i className="fas fa-map-marker-alt me-3" style={{ color: '#ef4444', width: '16px' }}></i>
                <span style={{ color: '#cbd5e1' }}>24/7 Emergency Response</span>
              </div>
              <div className="d-flex align-items-center">
                <i className="fas fa-clock me-3" style={{ color: '#f59e0b', width: '16px' }}></i>
                <span style={{ color: '#cbd5e1' }}>Available 24/7</span>
              </div>
            </div>
          </Col>
        </Row>

        {/* Bottom Section */}
        <hr style={{ borderColor: '#475569', margin: '2rem 0 1rem' }} />
        <Row className="align-items-center">
          <Col md={6}>
            <p className="mb-0" style={{ color: '#94a3b8' }}>
              &copy; {currentYear} GeoEmergency. All rights reserved. 
              <span style={{ color: '#6366f1' }}> Made with ❤️ for your safety</span>
            </p>
          </Col>
          <Col md={6} className="text-md-end">
            <div className="d-flex justify-content-md-end gap-3 mt-2 mt-md-0">
              <Link 
                to="/"
                className="text-decoration-none" 
                style={{ 
                  color: '#94a3b8',
                  fontSize: '0.9rem',
                  transition: 'color 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.color = '#6366f1'}
                onMouseOut={(e) => e.target.style.color = '#94a3b8'}
              >
                Privacy Policy
              </Link>
              <span style={{ color: '#64748b' }}>|</span>
              <Link 
                to="/"
                className="text-decoration-none" 
                style={{ 
                  color: '#94a3b8',
                  fontSize: '0.9rem',
                  transition: 'color 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.color = '#10b981'}
                onMouseOut={(e) => e.target.style.color = '#94a3b8'}
              >
                Terms of Service
              </Link>
              <span style={{ color: '#64748b' }}>|</span>
              <Link 
                to="/"
                className="text-decoration-none" 
                style={{ 
                  color: '#94a3b8',
                  fontSize: '0.9rem',
                  transition: 'color 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.color = '#f59e0b'}
                onMouseOut={(e) => e.target.style.color = '#94a3b8'}
              >
                Help Center
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}