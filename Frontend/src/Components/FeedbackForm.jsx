import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import { feedbackAPI } from "../services/api";

const FeedbackForm = () => {
  const [rating, setRating] = useState("");
  const [comments, setComments] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with:', { rating, comments });

    // Basic validation
    if (!rating) {
      const errorMessage = "Please select a rating";
      setMessage(errorMessage);
      toast.error(errorMessage);
      return;
    }
    
    if (!comments.trim()) {
      const errorMessage = "Please enter your comments";
      setMessage(errorMessage);
      toast.error(errorMessage);
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Sending feedback to API...');
      const response = await feedbackAPI.submitFeedback({
        rating: parseInt(rating), 
        comments: comments.trim()
      });
      console.log('API Response:', response);

      const successMessage = "Thank you for your feedback!";
      setMessage(successMessage);
      toast.success(successMessage);
      setComments("");
      setRating("");
    } catch (err) {
      console.error('Feedback submission error:', err);
      const errorMessage = err.response?.data?.message || "Unable to submit feedback";
      setMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const ratingOptions = [
    { value: "5", label: "⭐⭐⭐⭐⭐ Excellent (5/5)" },
    { value: "4", label: "⭐⭐⭐⭐ Very Good (4/5)" },
    { value: "3", label: "⭐⭐⭐ Good (3/5)" },
    { value: "2", label: "⭐⭐ Fair (2/5)" },
    { value: "1", label: "⭐ Poor (1/5)" }
  ];

  return (
    <div className="main-content" style={{ 
      background: 'white',
      minHeight: '100vh', 
      paddingTop: '80px' 
    }}>
      <Container className="py-5" style={{ paddingTop: '120px' }}>
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <Card className="shadow-lg border-0" style={{ borderRadius: '20px' }}>
              <Card.Header 
                className="text-white text-center py-3" 
                style={{ background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)' }}
              >
                <h4 className="mb-0">
                  <i className="fas fa-comment-dots me-2"></i>
                  Share Your Feedback
                </h4>
                <p className="mb-0 mt-2 opacity-75">Help us improve our emergency services</p>
              </Card.Header>

              <Card.Body className="p-4">
                {message && (
                  <Alert 
                    variant={message.includes("Thank you") ? "success" : "danger"} 
                    className="mb-4"
                    style={{ borderRadius: '10px' }}
                  >
                    <i className={`fas ${message.includes("Thank you") ? "fa-check-circle" : "fa-exclamation-circle"} me-2`}></i>
                    {message}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">
                      <i className="fas fa-star me-2" style={{ color: '#f59e0b' }}></i>
                      How would you rate our service?
                    </Form.Label>
                    <Form.Select
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      required
                      style={{ borderRadius: '10px', padding: '10px' }}
                    >
                      <option value="">Select your rating...</option>
                      {ratingOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">
                      <i className="fas fa-comment me-2" style={{ color: '#10b981' }}></i>
                      Your Comments
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      placeholder="Share your experience with our emergency services..."
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      required
                      maxLength={500}
                      style={{ borderRadius: '10px', padding: '12px' }}
                    />
                    <Form.Text className="text-muted d-flex justify-content-between">
                      <span>Share your detailed feedback</span>
                      <span>{comments.length}/500</span>
                    </Form.Text>
                  </Form.Group>

                  <Button 
                    type="submit" 
                    size="lg"
                    disabled={isSubmitting || !comments.trim() || !rating}
                    className="w-100 py-2"
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      border: 'none',
                      borderRadius: '10px',
                      fontWeight: '600'
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane me-2"></i>
                        Submit Feedback
                      </>
                    )}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default FeedbackForm;