import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import { authAPI } from "../services/api";

export default function OtpVerification() {
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate("/register");
      return;
    }
  }, [email, navigate]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setIsSubmitting(true);
    try {
      await authAPI.verifyOtp({ email, otp });
      toast.success("Email verified successfully! You can now login.");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    try {
      await authAPI.resendOtp({ email });
      toast.success("OTP resent successfully to your email!");
      setCountdown(60);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return null;
  }

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', background: '#f8f9fa' }}>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col xs={12} md={6} lg={4}>
            <Card className="shadow">
              <Card.Header className="bg-success text-white text-center">
                <h4>Verify Your Email</h4>
              </Card.Header>
              <Card.Body className="p-4">
                <Alert variant="info" className="text-center">
                  We've sent a 6-digit OTP to<br />
                  <strong>{email}</strong>
                </Alert>

                <Form onSubmit={handleVerifyOtp}>
                  <Form.Group className="mb-3">
                    <Form.Label>Enter OTP</Form.Label>
                    <Form.Control
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="123456"
                      maxLength={6}
                      className="text-center fs-4"
                      required
                    />
                  </Form.Group>

                  <Button 
                    type="submit" 
                    variant="success" 
                    className="w-100 mb-3" 
                    disabled={isSubmitting || otp.length !== 6}
                  >
                    {isSubmitting ? 'Verifying...' : 'Verify OTP'}
                  </Button>
                </Form>

                <div className="text-center">
                  <p className="mb-2">Didn't receive the OTP?</p>
                  <Button
                    variant="outline-primary"
                    onClick={handleResendOtp}
                    disabled={isResending || countdown > 0}
                    className="w-100"
                  >
                    {isResending ? 'Resending...' : 
                     countdown > 0 ? `Resend OTP (${countdown}s)` : 'Resend OTP'}
                  </Button>
                </div>

                <div className="text-center mt-3">
                  <Button
                    variant="link"
                    onClick={() => navigate("/register")}
                    className="text-decoration-none"
                  >
                    ← Back to Registration
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}