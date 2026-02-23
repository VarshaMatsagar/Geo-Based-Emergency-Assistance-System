import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { citizenAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { validateField } from '../utils/validation';

const ProfileForm = ({ onSuccess }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    userId: user?.userId || 1,
    fullName: '',
    phoneNumber: '',
    newPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await citizenAPI.getProfile(user?.userId || 1);
      const userData = response.data;
      setProfile({
        userId: userData.userId,
        fullName: userData.fullName || '',
        phoneNumber: userData.phoneNumber || '',
        newPassword: ''
      });
    } catch (error) {
      onSuccess('Failed to load profile', 'danger');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    const nameError = validateField('name', profile.fullName);
    if (nameError) newErrors.fullName = nameError;
    
    const phoneError = validateField('phone', profile.phoneNumber);
    if (phoneError) newErrors.phoneNumber = phoneError;
    
    if (profile.newPassword) {
      const passwordError = validateField('password', profile.newPassword);
      if (passwordError) newErrors.newPassword = passwordError;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await citizenAPI.updateProfile(profile.userId, profile);
      setProfile(prev => ({ ...prev, newPassword: '' }));
      setErrors({});
      onSuccess('👤 Profile updated successfully!');
    } catch (error) {
      onSuccess('Failed to update profile', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <Card className="shadow-sm border-0">
      <Card.Header className="bg-gradient text-white text-center py-3" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
        <h4 className="mb-0">👤 My Profile</h4>
        <small className="opacity-75">Update your personal information</small>
      </Card.Header>
      
      <Card.Body className="p-4">
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold text-dark mb-2">
                  📝 Full Name *
                </Form.Label>
                <Form.Control
                  type="text"
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleChange}
                  className={`border-2 rounded-3 py-3 ${errors.fullName ? 'is-invalid' : ''}`}
                  placeholder="Enter your full name"
                  required
                />
                {errors.fullName && (
                  <div className="invalid-feedback">{errors.fullName}</div>
                )}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold text-dark mb-2">
                  📞 Phone Number *
                </Form.Label>
                <Form.Control
                  type="tel"
                  name="phoneNumber"
                  value={profile.phoneNumber}
                  onChange={handleChange}
                  className={`border-2 rounded-3 py-3 ${errors.phoneNumber ? 'is-invalid' : ''}`}
                  placeholder="Enter your phone number"
                  required
                />
                {errors.phoneNumber && (
                  <div className="invalid-feedback">{errors.phoneNumber}</div>
                )}
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold text-dark mb-2">
              🔒 New Password
            </Form.Label>
            <Form.Control
              type="password"
              name="newPassword"
              value={profile.newPassword}
              onChange={handleChange}
              className={`border-2 rounded-3 py-3 ${errors.newPassword ? 'is-invalid' : ''}`}
              placeholder="Leave blank to keep current password"
            />
            {errors.newPassword && (
              <div className="invalid-feedback">{errors.newPassword}</div>
            )}
            <small className="text-muted">Only enter a password if you want to change it</small>
          </Form.Group>
          <div className="d-grid gap-2">
            <Button 
              type="submit" 
              disabled={loading}
              className="py-3 fw-semibold border-0 rounded-3"
              style={{
                background: loading ? '#6c757d' : 'linear-gradient(135deg, #5f27cd 0%, #341f97 100%)',
                fontSize: '1.1rem',
                transition: 'all 0.3s ease'
              }}
            >
              {loading ? (
                <>
                  <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                  Updating Profile...
                </>
              ) : (
                '💾 Save Profile Changes'
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ProfileForm;