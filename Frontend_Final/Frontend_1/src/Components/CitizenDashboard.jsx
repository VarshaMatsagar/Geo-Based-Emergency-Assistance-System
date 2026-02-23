import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Alert, Nav } from 'react-bootstrap';
import EmergencyMessageForm from './EmergencyMessageForm';
import EmergencyImageForm from './EmergencyImageForm';
import ProfileForm from './ProfileForm';
import ConnectionTest from './ConnectionTest';
import { citizenAPI } from '../services/api';
import { getCurrentLocation } from '../services/locationService';

const CitizenDashboard = () => {
  const [activeTab, setActiveTab] = useState('message');
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
  };

  const handlePanicButton = async () => {
    try {
      // Get current location first
      const location = await getCurrentLocation();
      
      await citizenAPI.createPanicAlert({
        latitude: location.latitude,
        longitude: location.longitude,
        address: location.address
      });
      
      showAlert('🚨 Emergency alert sent successfully!', 'danger');
    } catch (error) {
      // If location fails, send without location
      try {
        await citizenAPI.createPanicAlert({});
        showAlert('🚨 Emergency alert sent (location unavailable)!', 'warning');
      } catch (fallbackError) {
        showAlert('Failed to send emergency alert', 'danger');
      }
    }
  };

  return (
    <Container className="mt-4">
      <ConnectionTest />
      
      {alert.show && (
        <Alert variant={alert.type} className="mb-3">
          {alert.message}
        </Alert>
      )}

      <Card>
        <Card.Header>
          <Row className="align-items-center">
            <Col>
              <h4 className="mb-0">Citizen Emergency Dashboard</h4>
            </Col>
            <Col xs="auto">
              <Button 
                variant="danger" 
                size="lg"
                onClick={handlePanicButton}
                className="fw-bold"
              >
                🚨 PANIC BUTTON
              </Button>
            </Col>
          </Row>
        </Card.Header>
        
        <Card.Body>
          <Nav variant="tabs" className="mb-4">
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'message'}
                onClick={() => setActiveTab('message')}
                className="fw-semibold"
              >
                📱 Message Emergency
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'image'}
                onClick={() => setActiveTab('image')}
                className="fw-semibold"
              >
                📸 Image Emergency
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'profile'}
                onClick={() => setActiveTab('profile')}
                className="fw-semibold"
              >
                👤 My Profile
              </Nav.Link>
            </Nav.Item>
          </Nav>

          {activeTab === 'message' && (
            <EmergencyMessageForm onSuccess={(msg) => showAlert(msg)} />
          )}
          
          {activeTab === 'image' && (
            <EmergencyImageForm onSuccess={(msg) => showAlert(msg)} />
          )}
          
          {activeTab === 'profile' && (
            <ProfileForm onSuccess={(msg) => showAlert(msg)} />
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CitizenDashboard;