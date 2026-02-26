import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { authAPI } from "../services/api";

export default function Register() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ================= FRONTEND VALIDATIONS =================
    const fullNameRegex = /^[A-Za-z\s]{3,}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
    const phoneRegex = /^[6-9]\d{9}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!fullNameRegex.test(form.fullName)) {
      toast.error("Full name must contain only letters and spaces (min 3 chars)");
      return;
    }
    if (!emailRegex.test(form.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!phoneRegex.test(form.phoneNumber)) {
      toast.error("Phone number must be 10 digits starting with 6,7,8, or 9");
      return;
    }
    if (!passwordRegex.test(form.password)) {
      toast.error("Password must be at least 8 chars with 1 uppercase, 1 lowercase, 1 number, 1 special char");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    // ==========================================================

    setIsSubmitting(true);
    try {
      const response = await authAPI.register({
        fullName: form.fullName,
        email: form.email,
        phoneNumber: form.phoneNumber,
        password: form.password,
      });

      toast.success(response.data.data.message || "Registration successful! Please check your email for OTP.");
      navigate("/verify-otp", { state: { email: form.email } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', background: '#f8f9fa' }}>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <Card className="shadow">
              <Card.Header className="bg-primary text-white text-center">
                <h3>Create Account</h3>
              </Card.Header>
              <Card.Body className="p-4">
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="phoneNumber"
                      value={form.phoneNumber}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Button type="submit" variant="primary" className="w-100" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
