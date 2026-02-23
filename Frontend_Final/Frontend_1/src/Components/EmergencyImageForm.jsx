import React, { useState } from 'react';
import { Form, Button, Row, Col, Alert, Card } from 'react-bootstrap';
import { citizenAPI } from '../services/api';
import { getCurrentLocation } from '../services/locationService';
import { validateField, validateImageFile } from '../utils/validation';

const EmergencyImageForm = ({ onSuccess }) => {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [targetDepartment, setTargetDepartment] = useState(1);
  const [loading, setLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    const descError = validateField('description', description);
    if (descError) newErrors.description = descError;
    
    const imageError = validateImageFile(image);
    if (imageError) newErrors.image = imageError;
    
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
      
      const formData = new FormData();
      formData.append('Image', image);
      formData.append('Description', description);
      formData.append('TargetDepartment', targetDepartment);
      formData.append('Latitude', location.latitude);
      formData.append('Longitude', location.longitude);
      if (location.address) {
        formData.append('Address', location.address);
      }

      await citizenAPI.createImageEmergency(formData);
      setDescription('');
      setImage(null);
      setTargetDepartment(1);
      setLocationStatus('');
      setErrors({});
      e.target.reset();
      onSuccess('📸 Emergency image sent successfully!');
    } catch (locationError) {
      try {
        const formData = new FormData();
        formData.append('Image', image);
        formData.append('Description', description);
        formData.append('TargetDepartment', targetDepartment);

        await citizenAPI.createImageEmergency(formData);
        setDescription('');
        setImage(null);
        setTargetDepartment(1);
        setErrors({});
        e.target.reset();
        onSuccess('📸 Emergency image sent (location unavailable)');
      } catch (error) {
        onSuccess('Failed to send emergency image', 'danger');
      }
    } finally {
      setLoading(false);
      setLocationStatus('');
    }
  };

  return (
    <Card className="shadow-sm border-0">
      <Card.Header className="bg-gradient text-white text-center py-3" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
        <h4 className="mb-0">📸 Emergency Image Report</h4>
        <small className="opacity-75">Upload photo evidence of your emergency</small>
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
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what's happening in detail..."
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
                  id="police-img"
                  name="targetDepartmentImg"
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
                  id="hospital-img"
                  name="targetDepartmentImg"
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
                  id="both-img"
                  name="targetDepartmentImg"
                  label="🚨 Both Departments (Critical)"
                  value={3}
                  checked={targetDepartment == 3}
                  onChange={(e) => setTargetDepartment(e.target.value)}
                  className="fw-medium text-danger"
                />
              </div>
            </div>
          </Form.Group>
        
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold text-dark mb-2">
              📷 Upload Image Evidence *
            </Form.Label>
            <div className="border-2 border-dashed rounded-3 p-4 text-center" style={{borderColor: '#dee2e6'}}>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className={`border-0 ${errors.image ? 'is-invalid' : ''}`}
                required
              />
              {errors.image && (
                <div className="invalid-feedback d-block">{errors.image}</div>
              )}
              <small className="text-muted mt-2 d-block">
                📱 Supported: JPG, PNG, GIF (Max 10MB)
              </small>
            </div>
          </Form.Group>
          <div className="d-grid gap-2">
            <Button 
              type="submit" 
              disabled={loading || !image || !description.trim()}
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
                  Uploading Emergency...
                </>
              ) : (
                '🚨 Send Emergency Image Report'
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default EmergencyImageForm;