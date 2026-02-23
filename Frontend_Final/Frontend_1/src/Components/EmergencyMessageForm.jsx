import React, { useState } from 'react';
import { Form, Button, Row, Col, Alert, Card } from 'react-bootstrap';
import { citizenAPI } from '../services/api';
import { getCurrentLocation } from '../services/locationService';
import { validateField } from '../utils/validation';

const EmergencyMessageForm = ({ onSuccess }) => {
  const [description, setDescription] = useState('');
  const [targetDepartment, setTargetDepartment] = useState(1);
  const [loading, setLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    const descError = validateField('description', description);
    if (descError) newErrors.description = descError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setLocationStatus('Getting your location...');
    
    try {
      const location = await getCurrentLocation();
      
      await citizenAPI.createMessageEmergency({ 
        description, 
        targetDepartment: parseInt(targetDepartment),
        latitude: location.latitude,
        longitude: location.longitude,
        address: location.address
      });
      
      setDescription('');
      setTargetDepartment(1);
      setLocationStatus('');
      setErrors({});
      onSuccess('📱 Emergency message sent successfully!');
    } catch (locationError) {
      try {
        await citizenAPI.createMessageEmergency({ 
          description, 
          targetDepartment: parseInt(targetDepartment)
        });
        setDescription('');
        setTargetDepartment(1);
        setErrors({});
        onSuccess('📱 Emergency message sent (location unavailable)');
      } catch (error) {
        onSuccess('Failed to send emergency message', 'danger');
      }
    } finally {
      setLoading(false);
      setLocationStatus('');
    }
  };

  return (
    <Card className="shadow-sm border-0">
      <Card.Header className="bg-gradient text-white text-center py-3" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
        <h4 className="mb-0">📱 Emergency Message Report</h4>
        <small className="opacity-75">Send detailed emergency information</small>
      </Card.Header>
      
      <Card.Body className="p-4">
        {locationStatus && (
          <Alert variant="info" className="mb-4 border-0 rounded-3">
            <div className="d-flex align-items-center">
              <div className="spinner-border spinner-border-sm me-2" role="status"></div>
              📍 {locationStatus}
            </div>
          </Alert>
        )}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold text-dark mb-2">
              📝 Emergency Description *
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your emergency in detail..."
              className={`border-2 rounded-3 ${errors.description ? 'is-invalid' : ''}`}
              style={{resize: 'none'}}
              required
            />
            {errors.description && (
              <div className="invalid-feedback">{errors.description}</div>
            )}
          </Form.Group>
          
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold text-dark mb-3">
              🏢 Send to Department *
            </Form.Label>
            <div className="d-flex flex-column gap-2">
              <div className="p-3 border rounded-3 hover-shadow" style={{cursor: 'pointer', transition: 'all 0.2s'}}>
                <Form.Check
                  type="radio"
                  id="police"
                  name="targetDepartment"
                  label="🚓 Police Department"
                  value={1}
                  checked={targetDepartment == 1}
                  onChange={(e) => setTargetDepartment(e.target.value)}
                  className="fw-medium"
                />
              </div>
              <div className="p-3 border rounded-3 hover-shadow" style={{cursor: 'pointer', transition: 'all 0.2s'}}>
                <Form.Check
                  type="radio"
                  id="hospital"
                  name="targetDepartment"
                  label="🏥 Hospital/Medical"
                  value={2}
                  checked={targetDepartment == 2}
                  onChange={(e) => setTargetDepartment(e.target.value)}
                  className="fw-medium"
                />
              </div>
              <div className="p-3 border rounded-3 hover-shadow" style={{cursor: 'pointer', transition: 'all 0.2s'}}>
                <Form.Check
                  type="radio"
                  id="both"
                  name="targetDepartment"
                  label="🚨 Both Departments (Critical)"
                  value={3}
                  checked={targetDepartment == 3}
                  onChange={(e) => setTargetDepartment(e.target.value)}
                  className="fw-medium text-danger"
                />
              </div>
            </div>
          </Form.Group>
          
          <div className="d-grid gap-2">
            <Button 
              type="submit" 
              disabled={loading || !description.trim()}
              className="py-3 fw-semibold border-0 rounded-3"
              style={{
                background: loading ? '#6c757d' : 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                fontSize: '1.1rem',
                transition: 'all 0.3s ease'
              }}
            >
              {loading ? (
                <>
                  <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                  Sending Emergency...
                </>
              ) : (
                '🚨 Send Emergency Message'
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default EmergencyMessageForm;