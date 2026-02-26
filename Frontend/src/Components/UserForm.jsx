import React, { useEffect, useState } from "react";
import { Card, Form, Button, Row, Col, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import api from "../services/api";

// Only editable roles - ADMIN is excluded for security
const EDITABLE_ROLES = [
  { id: 2, name: "Citizen" },
  { id: 3, name: "Police" },
  { id: 4, name: "Hospital" }
];

const UserForm = ({ userId, onSuccess }) => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "Citizen"
  });

  const [loading, setLoading] = useState(false);
  const [isAdminUser, setIsAdminUser] = useState(false);

  // Load user for edit
  useEffect(() => {
    if (!userId) return;

    api.get(`/AdminUsers/${userId}`)
      .then(res => {
        const userRole = res.data.role?.roleName || "Citizen";
        const isAdmin = userRole === "Admin";
        
        setIsAdminUser(isAdmin);
        setForm({
          userId: Number(userId),
          fullName: res.data.fullName,
          email: res.data.email,
          phoneNumber: res.data.phoneNumber,
          password: "",
          role: userRole
        });
      })
      .catch(err => {
        console.error(err);
        const errorMessage = "Failed to load user";
        toast.error(errorMessage);
      });
  }, [userId]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    // Security check: prevent ADMIN role modification
    if (isAdminUser) {
      const errorMessage = "ADMIN role cannot be modified for security reasons";
      toast.error(errorMessage);
      return;
    }
    
    setLoading(true);

    try {
      const selectedRole = EDITABLE_ROLES.find(r => r.name === form.role);

      const payload = {
        fullName: form.fullName,
        email: form.email,
        phoneNumber: form.phoneNumber,
        roleId: selectedRole ? selectedRole.id : 2 // default Citizen
      };

      // Only include password for new users
      if (!userId && form.password) {
        payload.passwordHash = form.password;
      }

      if (userId) {
        await api.put(`/AdminUsers/${userId}`, payload);
        const successMessage = "User updated successfully";
        toast.success(successMessage);
      } else {
        await api.post("/AdminUsers", payload);
        const successMessage = "User added successfully";
        toast.success(successMessage);
      }

      onSuccess();
    } catch (err) {
      console.error(err.response?.data || err.message);
      const errorMessage = err.response?.data?.message || "Operation failed";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">
          <i className={`fas ${userId ? 'fa-edit' : 'fa-plus'} me-2`}></i>
          {userId ? "Edit User" : "Add User"}
        </h5>
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
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                  className="form-control-lg"
                  placeholder="Enter full name"
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">
                  <i className="fas fa-envelope me-2"></i>
                  Email
                </Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="form-control-lg"
                  placeholder="Enter email address"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col xs={12} md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">
                  <i className="fas fa-phone me-2"></i>
                  Phone Number
                </Form.Label>
                <Form.Control
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  required
                  className="form-control-lg"
                  placeholder="Enter phone number"
                />
              </Form.Group>
            </Col>
            {!userId && (
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    <i className="fas fa-lock me-2"></i>
                    Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="form-control-lg"
                    placeholder="Enter password"
                  />
                </Form.Group>
              </Col>
            )}
          </Row>

          <Row>
            <Col xs={12} md={6}>
              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold">
                  <i className="fas fa-user-tag me-2"></i>
                  Role
                </Form.Label>
                {isAdminUser ? (
                  <>
                    <Form.Control
                      type="text"
                      value="Admin (Protected)"
                      disabled
                      className="form-control-lg"
                      style={{ backgroundColor: '#f8f9fa', color: '#6c757d' }}
                    />
                    <Alert variant="warning" className="mt-2 mb-0">
                      <i className="fas fa-shield-alt me-2"></i>
                      ADMIN role cannot be modified for security reasons
                    </Alert>
                  </>
                ) : (
                  <Form.Select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="form-control-lg"
                  >
                    {EDITABLE_ROLES.map(r => (
                      <option key={r.id} value={r.name}>{r.name}</option>
                    ))}
                  </Form.Select>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col xs={12}>
              <div className="d-grid">
                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={loading || isAdminUser}
                  size="lg"
                  className="py-3"
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className={`fas ${userId ? 'fa-save' : 'fa-plus'} me-2`}></i>
                      {userId ? 'Update User' : 'Add User'}
                    </>
                  )}
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default UserForm;