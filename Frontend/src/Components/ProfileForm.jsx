import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { citizenAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ProfileForm = ({ onSuccess }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    userId: '',
    fullName: '',
    phoneNumber: '',
    newPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.userId) {
      loadProfile();
    } else {
      setError('User not found. Please login again.');
      toast.error('User not found. Please login again.');
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const response = await citizenAPI.getProfile(user.userId);
      const userData = response.data;
      setProfile({
        userId: userData.userId,
        fullName: userData.fullName || '',
        phoneNumber: userData.phoneNumber || '',
        newPassword: ''
      });
      setError('');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to load profile';
      setError(errorMessage);
      toast.error(errorMessage);
      if (onSuccess) onSuccess(errorMessage, 'danger');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.userId) {
      const errorMessage = 'User not found. Please login again.';
      setError(errorMessage);
      toast.error(errorMessage);
      return;
    }
    
    setLoading(true);
    try {
      await citizenAPI.updateProfile(user.userId, profile);
      setProfile(prev => ({ ...prev, newPassword: '' }));
      const successMessage = '✅ Profile updated successfully!';
      toast.success(successMessage);
      if (onSuccess) onSuccess(successMessage);
      setError('');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      setError(errorMessage);
      toast.error(errorMessage);
      if (onSuccess) onSuccess(errorMessage, 'danger');
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

  if (!user) {
    return (
      <div className="text-center py-5">
        <h5>Authentication Required</h5>
        <p>Please login to view and edit your profile.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-4">
        <h4 className="text-primary mb-2">My Profile</h4>
        <p className="text-muted">Manage your personal information</p>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4">
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
        </Alert>
      )}
      
      <Form onSubmit={handleSubmit}>
        <Row className="g-3">
          <Col xs={12} md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                value={profile.fullName}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                name="phoneNumber"
                value={profile.phoneNumber}
                onChange={handleChange}
                required
                placeholder="Enter your phone number"
              />
            </Form.Group>
          </Col>
        </Row>
        
        <Row>
          <Col xs={12}>
            <Form.Group className="mb-4">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                name="newPassword"
                value={profile.newPassword}
                onChange={handleChange}
                placeholder="Leave blank to keep current password"
              />
              <Form.Text className="text-muted">
                Leave blank to keep your current password
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>
        
        <Row>
          <Col xs={12}>
            <Button 
              type="submit" 
              variant="primary"
              disabled={loading || !user?.userId}
              className="w-100"
              size="lg"
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Updating Profile...
                </>
              ) : (
                <>
                  <i className="fas fa-save me-2"></i>
                  Update Profile
                </>
              )}
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default ProfileForm;