import React, { useState } from 'react';
import { Form, Button, Row, Col, ButtonGroup, Alert, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { citizenAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useGeolocation } from '../hooks/useGeolocation';

const EmergencyMessageForm = ({ onSuccess }) => {
  const { user } = useAuth();
  const { getCurrentLocation } = useGeolocation();
  const [description, setDescription] = useState('');
  const [targetDepartment, setTargetDepartment] = useState('BOTH');
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    setLoading(true);
    setLocationError('');
    
    try {
      // Get current location
      const locationData = await getCurrentLocation();
      
      const emergencyData = {
        citizenId: user?.userId || null,
        description,
        targetDepartment,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        address: locationData.address
      };
      
      await citizenAPI.createMessageEmergency(emergencyData);
      setDescription('');
      setTargetDepartment('BOTH');
      const successMessage = '📱 Emergency message sent with location!';
      toast.success(successMessage);
      onSuccess(successMessage);
    } catch (error) {
      if (error.includes && error.includes('Location')) {
        setLocationError('Location access denied. Emergency sent without location.');
        // Send without location
        try {
          const emergencyData = {
            citizenId: user?.userId || null,
            description,
            targetDepartment
          };
          await citizenAPI.createMessageEmergency(emergencyData);
          const successMessage = '📱 Emergency message sent (location unavailable)';
          toast.success(successMessage);
          onSuccess(successMessage);
        } catch (err) {
          const errorMessage = 'Failed to send emergency message';
          toast.error(errorMessage);
          onSuccess(errorMessage, 'danger');
        }
      } else {
        const errorMessage = 'Failed to send emergency message';
        toast.error(errorMessage);
        onSuccess(errorMessage, 'danger');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <Row className="justify-content-center">
        <Col xs={12} lg={10}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-warning text-dark">
              <h5 className="mb-0">
                <i className="fas fa-comment me-2"></i>
                Report Emergency - Message
              </h5>
            </Card.Header>
            <Card.Body className="p-4">
              {locationError && (
                <Alert variant="warning" className="mb-4">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {locationError}
                </Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col xs={12}>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold">
                        <i className="fas fa-edit me-2"></i>
                        Emergency Description *
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={5}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe your emergency in detail..."
                        required
                        className="form-control-lg"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col xs={12}>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold">
                        <i className="fas fa-paper-plane me-2"></i>
                        Send Emergency To:
                      </Form.Label>
                      <ButtonGroup className="w-100 d-flex flex-column flex-sm-row">
                        <Button 
                          variant={targetDepartment === 'POLICE' ? 'primary' : 'outline-primary'}
                          onClick={() => setTargetDepartment('POLICE')}
                          className="mb-2 mb-sm-0 flex-fill"
                          size="lg"
                        >
                          <i className="fas fa-shield-alt me-2"></i>
                          Police
                        </Button>
                        <Button 
                          variant={targetDepartment === 'HOSPITAL' ? 'primary' : 'outline-primary'}
                          onClick={() => setTargetDepartment('HOSPITAL')}
                          className="mb-2 mb-sm-0 flex-fill"
                          size="lg"
                        >
                          <i className="fas fa-hospital me-2"></i>
                          Hospital
                        </Button>
                        <Button 
                          variant={targetDepartment === 'BOTH' ? 'primary' : 'outline-primary'}
                          onClick={() => setTargetDepartment('BOTH')}
                          className="mb-2 mb-sm-0 flex-fill"
                          size="lg"
                        >
                          <i className="fas fa-exclamation-triangle me-2"></i>
                          Both
                        </Button>
                      </ButtonGroup>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col xs={12}>
                    <div className="d-grid">
                      <Button 
                        type="submit" 
                        variant="warning" 
                        disabled={loading || !description.trim()}
                        size="lg"
                        className="py-3"
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Getting Location & Sending...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-paper-plane me-2"></i>
                            Send Emergency Message
                          </>
                        )}
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default EmergencyMessageForm;