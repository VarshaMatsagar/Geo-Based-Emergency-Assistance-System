import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Alert, Nav } from 'react-bootstrap';
import { toast } from 'react-toastify';
import EmergencyMessageForm from './EmergencyMessageForm';
import EmergencyImageForm from './EmergencyImageForm';
import ProfileForm from './ProfileForm';
import ConnectionTest from './ConnectionTest';
import NotificationToast from './NotificationToast';
import CitizenNotifications from './CitizenNotifications';
import { citizenAPI } from '../services/api';
import MyFeedbacks from "./MyFeedbacks";

const CitizenDashboard = () => {
  const [activeTab, setActiveTab] = useState('message');
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  const showAlert = (message, type = 'success') => {
    if (type === 'success') {
      toast.success(message);
    } else if (type === 'danger' || type === 'error') {
      toast.error(message);
    } else if (type === 'warning') {
      toast.warning(message);
    } else {
      toast.info(message);
    }
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
  };

  const handlePanicButton = async () => {
    console.log('🚨 PANIC BUTTON: Starting panic alert process...');
    
    try {
      console.log('🔑 Testing authentication...');
      await citizenAPI.testAuth();
      console.log('🔑 Authentication successful');
      
      try {
        console.log('🚨 PANIC BUTTON: Getting location...');
        const { getCurrentLocation } = await import('../hooks/useGeolocation');
        const locationData = await getCurrentLocation();
        console.log('🚨 PANIC BUTTON: Location obtained:', locationData);
        
        const response = await citizenAPI.createPanicAlert('BOTH', locationData.latitude, locationData.longitude, locationData.address);
        console.log('🚨 PANIC BUTTON: Success response:', response);
        toast.success('🚨 Emergency alert sent to Police and Hospital with location!');
        showAlert('🚨 Emergency alert sent to Police and Hospital with location!', 'success');
      } catch (locationError) {
        console.log('🚨 PANIC BUTTON: Location failed, sending without location:', locationError);
        const response = await citizenAPI.createPanicAlert('BOTH');
        console.log('🚨 PANIC BUTTON: Success response (no location):', response);
        toast.success('🚨 Emergency alert sent to Police and Hospital!');
        showAlert('🚨 Emergency alert sent to Police and Hospital!', 'success');
      }
    } catch (error) {
      console.error('🚨 PANIC BUTTON ERROR:', error);
      
      let errorMessage = 'Failed to send emergency alert';
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Authentication failed - please login again';
        } else if (error.response.status === 403) {
          errorMessage = 'Access denied - insufficient permissions';
        } else {
          errorMessage += ` (${error.response.status}: ${error.response.data?.message || error.response.statusText})`;
        }
      } else if (error.message) {
        errorMessage += ` (${error.message})`;
      }
      
      toast.error(errorMessage);
      showAlert(errorMessage, 'danger');
    }
  };

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', background: '#f8fafc' }}>
      <Container fluid className="py-4">
        <NotificationToast />
        <ConnectionTest />
        
        <Row className="justify-content-center">
          <Col xs={12} xl={11}>
            {/* Header Section */}
            <div className="text-center mb-5">
              <h1 className="display-5 fw-bold mb-3" style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                <i className="fas fa-tachometer-alt me-3"></i>
                Citizen Emergency Dashboard
              </h1>
              <p className="lead text-muted mb-4">
                Your safety command center - report emergencies, track alerts, and manage your profile
              </p>
              
              {/* Emergency Button */}
              <Button 
                onClick={handlePanicButton}
                size="lg"
                className="mb-4 px-5 py-3"
                style={{
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  border: 'none',
                  borderRadius: '50px',
                  color: 'white',
                  fontWeight: '700',
                  fontSize: '1.2rem',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  boxShadow: '0 8px 25px rgba(239, 68, 68, 0.4)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-3px) scale(1.05)';
                  e.target.style.boxShadow = '0 12px 35px rgba(239, 68, 68, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = '0 8px 25px rgba(239, 68, 68, 0.4)';
                }}
              >
                <i className="fas fa-exclamation-triangle me-2"></i>
                EMERGENCY PANIC BUTTON
              </Button>
            </div>

            {alert.show && (
              <Alert variant={alert.type} className="mb-4 text-center" style={{ 
                borderRadius: '16px', 
                border: 'none', 
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)' 
              }}>
                <i className={`fas ${alert.type === 'success' ? 'fa-check-circle' : alert.type === 'danger' ? 'fa-exclamation-circle' : 'fa-info-circle'} me-2`}></i>
                {alert.message}
              </Alert>
            )}

            {/* Main Dashboard Card */}
            <Card className="border-0" style={{ 
              borderRadius: '24px', 
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              overflow: 'hidden'
            }}>
              <Card.Header style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                padding: '24px'
              }}>
                <Nav variant="pills" className="justify-content-center">
                  <Nav.Item className="me-2">
                    <Nav.Link 
                      active={activeTab === 'message'}
                      onClick={() => setActiveTab('message')}
                      className="fw-semibold px-4 py-2"
                      style={{
                        backgroundColor: activeTab === 'message' ? 'rgba(255,255,255,0.2)' : 'transparent',
                        color: 'white',
                        border: 'none',
                        borderRadius: '25px',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <i className="fas fa-comment me-2"></i>
                      Message Emergency
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item className="me-2">
                    <Nav.Link 
                      active={activeTab === 'image'}
                      onClick={() => setActiveTab('image')}
                      className="fw-semibold px-4 py-2"
                      style={{
                        backgroundColor: activeTab === 'image' ? 'rgba(255,255,255,0.2)' : 'transparent',
                        color: 'white',
                        border: 'none',
                        borderRadius: '25px',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <i className="fas fa-camera me-2"></i>
                      Image Emergency
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item className="me-2">
                    <Nav.Link 
                      active={activeTab === 'profile'}
                      onClick={() => setActiveTab('profile')}
                      className="fw-semibold px-4 py-2"
                      style={{
                        backgroundColor: activeTab === 'profile' ? 'rgba(255,255,255,0.2)' : 'transparent',
                        color: 'white',
                        border: 'none',
                        borderRadius: '25px',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <i className="fas fa-user me-2"></i>
                      My Profile
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      active={activeTab === "feedback"}
                      onClick={() => setActiveTab("feedback")}
                      className="fw-semibold px-4 py-2"
                      style={{
                        backgroundColor: activeTab === 'feedback' ? 'rgba(255,255,255,0.2)' : 'transparent',
                        color: 'white',
                        border: 'none',
                        borderRadius: '25px',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <i className="fas fa-star me-2"></i>
                      My Feedback
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      active={activeTab === "notifications"}
                      onClick={() => setActiveTab("notifications")}
                      className="fw-semibold px-4 py-2"
                      style={{
                        backgroundColor: activeTab === 'notifications' ? 'rgba(255,255,255,0.2)' : 'transparent',
                        color: 'white',
                        border: 'none',
                        borderRadius: '25px',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <i className="fas fa-bell me-2"></i>
                      Notifications
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Header>
              
              <Card.Body className="p-4">
                {activeTab === 'message' && (
                  <EmergencyMessageForm onSuccess={(msg) => showAlert(msg)} />
                )}
                
                {activeTab === 'image' && (
                  <EmergencyImageForm onSuccess={(msg) => showAlert(msg)} />
                )}
                
                {activeTab === 'profile' && (
                  <ProfileForm onSuccess={(msg) => showAlert(msg)} />
                )}
                
                {activeTab === "feedback" && (
                  <MyFeedbacks />
                )}
                
                {activeTab === "notifications" && (
                  <CitizenNotifications />
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CitizenDashboard;