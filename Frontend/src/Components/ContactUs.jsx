import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';
      await axios.post(
        `${API_BASE_URL}/contact/submit`,
        formData
      );

      const successMessage = "Message sent successfully!";
      toast.success(successMessage);
      setFormData({ fullName: "", email: "", message: "" });

    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || "Failed to send message";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="main-content bg-light">
      {/* Header Section */}
      <section
        className="hero-section"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url("ContactUs.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <Container>
          <Row className="justify-content-center text-center">
            <Col xs={12} lg={8}>
              <h1 className="display-4 fw-bold mb-4">
                <i className="fas fa-envelope me-3"></i>
                Contact Us
              </h1>
              <p className="lead">
                Get in touch with us for support, queries, or feedback
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact Section */}
      <Container className="py-5">
        <Row className="g-5">
          {/* Contact Info */}
          <Col xs={12} lg={5}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="p-4">
                <h3 className="fw-bold mb-4">
                  <i className="fas fa-info-circle me-2 text-primary"></i>
                  Contact Information
                </h3>

                <div className="mb-4">
                  <div className="d-flex align-items-center mb-3">
                    <i className="fas fa-project-diagram text-primary me-3 fs-5"></i>
                    <div>
                      <strong>Project:</strong><br />
                      <span className="text-muted">Geo-Based Emergency Alert System</span>
                    </div>
                  </div>

                  <div className="d-flex align-items-center mb-3">
                    <i className="fas fa-envelope text-primary me-3 fs-5"></i>
                    <div>
                      <strong>Email:</strong><br />
                      <a href="mailto:support@geoemergency.com" className="text-decoration-none">
                        support@geoemergency.com
                      </a>
                    </div>
                  </div>

                  <div className="d-flex align-items-center mb-3">
                    <i className="fas fa-phone text-primary me-3 fs-5"></i>
                    <div>
                      <strong>Phone:</strong><br />
                      <a href="tel:+919876543210" className="text-decoration-none">
                        +91 98765 43210
                      </a>
                    </div>
                  </div>

                  <div className="d-flex align-items-center mb-3">
                    <i className="fas fa-map-marker-alt text-primary me-3 fs-5"></i>
                    <div>
                      <strong>Address:</strong><br />
                      <span className="text-muted">Mumbai, Maharashtra, India</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-light rounded">
                  <p className="text-muted mb-0">
                    <i className="fas fa-shield-alt text-primary me-2"></i>
                    Our system helps citizens connect quickly with nearby emergency services 
                    for immediate assistance during critical situations.
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Contact Form */}
          <Col xs={12} lg={7}>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-primary text-white">
                <h4 className="mb-0">
                  <i className="fas fa-paper-plane me-2"></i>
                  Send Us a Message
                </h4>
              </Card.Header>
              <Card.Body className="p-4">
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col xs={12} md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">
                          <i className="fas fa-user me-2"></i>
                          Full Name
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="Enter your name"
                          required
                          className="form-control-lg"
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">
                          <i className="fas fa-envelope me-2"></i>
                          Email Address
                        </Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter your email"
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
                          <i className="fas fa-comment me-2"></i>
                          Message
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={5}
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Enter your message..."
                          required
                          className="form-control-lg"
                        />
                        <Form.Text className="text-muted">
                          {formData.message.length}/500 characters
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={12}>
                      <div className="d-grid">
                        <Button 
                          type="submit" 
                          variant="success"
                          size="lg"
                          disabled={isSubmitting}
                          className="py-3"
                        >
                          {isSubmitting ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Sending...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-paper-plane me-2"></i>
                              Send Message
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
      </Container>
    </div>
  );
};

export default ContactUs;