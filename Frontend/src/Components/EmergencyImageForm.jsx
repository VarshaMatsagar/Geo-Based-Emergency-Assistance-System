import React, { useState } from 'react';
import { Form, Button, Row, Col, ButtonGroup, Card, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { citizenAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const EmergencyImageForm = ({ onSuccess }) => {
  const { user } = useAuth();
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [targetDepartment, setTargetDepartment] = useState('BOTH');
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image || !description.trim()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('Image', image);
      formData.append('Description', description);
      formData.append('TargetDepartment', targetDepartment);
      if (user?.userId) {
        formData.append('CitizenId', user.userId);
      }

      await citizenAPI.createImageEmergency(formData);
      setDescription('');
      setImage(null);
      setImagePreview(null);
      setTargetDepartment('BOTH');
      e.target.reset();
      
      const successMessage = '📸 Emergency image sent successfully!';
      toast.success(successMessage);
      onSuccess(successMessage);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send emergency image';
      toast.error(errorMessage);
      onSuccess(errorMessage, 'danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <Row className="justify-content-center">
        <Col xs={12} lg={10}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-info text-white">
              <h5 className="mb-0">
                <i className="fas fa-camera me-2"></i>
                Report Emergency - Image
              </h5>
            </Card.Header>
            <Card.Body className="p-4">
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
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe your emergency..."
                        required
                        className="form-control-lg"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col xs={12} md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold">
                        <i className="fas fa-upload me-2"></i>
                        Upload Image *
                      </Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                        className="form-control-lg"
                      />
                      <Form.Text className="text-muted">
                        Supported formats: JPG, PNG, GIF (Max 10MB)
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6}>
                    {imagePreview && (
                      <div className="mb-4">
                        <Form.Label className="fw-semibold">
                          <i className="fas fa-eye me-2"></i>
                          Image Preview
                        </Form.Label>
                        <div className="border rounded p-2">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="img-fluid rounded"
                            style={{ maxHeight: '200px', width: '100%', objectFit: 'cover' }}
                          />
                        </div>
                      </div>
                    )}
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
                        disabled={loading || !image || !description.trim()}
                        size="lg"
                        className="py-3"
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-camera me-2"></i>
                            Send Emergency Image
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

export default EmergencyImageForm;