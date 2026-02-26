import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Table, Button, Modal, Nav, Badge, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeMenu, setActiveMenu] = useState("users");
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/users");
      console.log('API Response:', res.data);
      console.log('First user:', res.data[0]);
      setUsers(res.data);
      toast.success(`${res.data.length} users loaded successfully`);
    } catch (err) {
      console.error('Fetch users error:', err);
      const errorMessage = err.response?.data?.message || "Failed to fetch users";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/contact/admin/all");
      console.log('Contacts API Response:', res.data);
      setContacts(res.data);
      toast.success(`${res.data.length} contact queries loaded successfully`);
    } catch (err) {
      console.error('Fetch contacts error:', err);
      const errorMessage = err.response?.data?.message || "Failed to fetch contact queries";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const res = await api.get("/feedback");
      console.log('Feedbacks data:', res.data);
      console.log('First feedback object:', res.data[0]);
      setFeedbacks(res.data || []);
      const count = res.data ? res.data.length : 0;
      toast.success(`${count} feedbacks loaded successfully`);
    } catch (err) {
      console.error('Fetch feedbacks error:', err);
      const errorMessage = err.response?.data?.message || "Failed to fetch feedbacks";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeMenu === "users") fetchUsers();
    if (activeMenu === "contacts") fetchContacts();
    if (activeMenu === "feedbacks") fetchFeedbacks();
  }, [activeMenu]);

  const handleViewItem = (item) => {
    setSelectedItem(item);
    setShowViewModal(true);
  };

  const handleEditUser = (user) => {
    const userId = user.userId || user.id || user.user_id;
    navigate(`/admin/edit-user/${userId}`);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      const userId = userToDelete.userId || userToDelete.id || userToDelete.user_id;
      await api.delete(`/admin/users/${userId}`);
      setUsers((prev) => prev.filter((u) => (u.userId || u.id || u.user_id) !== userId));
      toast.success(`User ${userToDelete.fullName} deleted successfully`);
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (err) {
      console.error('Delete user error:', err);
      const errorMessage = err.response?.data?.message || "Failed to delete user";
      toast.error(errorMessage);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.info("Logged out successfully");
    navigate("/");
  };

  const getRoleBadgeVariant = (role) => {
    const roleName = role?.toLowerCase() || '';
    switch (roleName) {
      case 'admin': return 'danger';
      case 'police': return 'primary';
      case 'hospital': return 'success';
      case 'citizen': return 'info';
      case 'unknown': return 'warning';
      default: return 'secondary';
    }
  };

  return (
    <div className="min-vh-100 admin-dashboard" style={{ 
      paddingTop: '120px', 
      backgroundColor: 'white', 
      backgroundImage: 'none',
      position: 'relative',
      zIndex: 10
    }}>
      <Container fluid className="px-4">
        <Row>
          {/* Sidebar */}
          <Col xs={12} lg={3} className="mb-2">
            <Card className="border-0 shadow-sm h-100">
              <Card.Header className="text-white py-4" style={{ background: 'linear-gradient(90deg, #6F7BD9, #6A3FA0)' }}>
                <h5 className="mb-0 fw-bold text-center">
                  <i className="fas fa-cog me-2"></i>
                  Admin Panel
                </h5>
              </Card.Header>
              <Card.Body className="p-0">
                <Nav variant="pills" className="flex-column p-2">
                  <Nav.Item className="mb-2">
                    <Nav.Link
                      active={activeMenu === "users"}
                      onClick={() => setActiveMenu("users")}
                      className="py-3 px-4 fw-semibold"
                      style={{
                        background: activeMenu === "users" ? 'linear-gradient(90deg, #6F7BD9, #6A3FA0)' : 'transparent',
                        color: 'white',
                        borderRadius: '8px'
                      }}
                    >
                      <i className="fas fa-users me-3"></i>
                      Manage Users
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item className="mb-2">
                    <Nav.Link
                      active={activeMenu === "contacts"}
                      onClick={() => setActiveMenu("contacts")}
                      className="py-3 px-4 fw-semibold"
                      style={{
                        background: activeMenu === "contacts" ? 'linear-gradient(90deg, #6F7BD9, #6A3FA0)' : 'transparent',
                        color: 'white',
                        borderRadius: '8px'
                      }}
                    >
                      <i className="fas fa-envelope me-3"></i>
                      Contact Queries
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item className="mb-2">
                    <Nav.Link
                      active={activeMenu === "feedbacks"}
                      onClick={() => setActiveMenu("feedbacks")}
                      className="py-3 px-4 fw-semibold"
                      style={{
                        background: activeMenu === "feedbacks" ? 'linear-gradient(90deg, #6F7BD9, #6A3FA0)' : 'transparent',
                        color: 'white',
                        borderRadius: '8px'
                      }}
                    >
                      <i className="fas fa-comments me-3"></i>
                      Manage Feedback
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Body>
            </Card>
          </Col>

          {/* Main Content */}
          <Col xs={12} lg={9}>
            {/* Users Section */}
            {activeMenu === "users" && (
              <Card className="border-0 shadow-sm">
                <Card.Header className="text-white py-4" style={{ background: 'linear-gradient(90deg, #6F7BD9, #6A3FA0)' }}>
                  <Row className="align-items-center">
                    <Col xs={12} md={8}>
                      <h4 className="mb-1 fw-bold">
                        <i className="fas fa-users me-3"></i>
                        User Management
                      </h4>
                      <p className="mb-0 opacity-75">Manage system users and their roles</p>
                    </Col>
                    <Col xs={12} md={4} className="text-md-end mt-3 mt-md-0">
                      <Button
                        variant="light"
                        className="px-4 py-2 fw-semibold"
                        onClick={() => navigate("/admin/add-user")}
                      >
                        <i className="fas fa-plus me-2"></i>
                        Add User
                      </Button>
                    </Col>
                  </Row>
                </Card.Header>
                
                <Card.Body className="p-0 mt-3">
                  {loading ? (
                    <div className="text-center py-5">
                      <Spinner animation="border" variant="primary" className="mb-3" />
                      <p className="text-muted">Loading users...</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <Table hover className="mb-0">
                        <thead className="table-light">
                          <tr>
                            <th className="py-3 px-4 fw-bold">ID</th>
                            <th className="py-3 px-4 fw-bold">Full Name</th>
                            <th className="py-3 px-4 fw-bold d-none d-md-table-cell">Email</th>
                            <th className="py-3 px-4 fw-bold d-none d-lg-table-cell">Phone</th>
                            <th className="py-3 px-4 fw-bold">Role</th>
                            <th className="py-3 px-4 fw-bold text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((u) => (
                            <tr key={u.userId}>
                              <td className="py-3 px-4 align-middle">
                                <span className="fw-bold text-primary">{u.userId || u.id || u.user_id || 'N/A'}</span>
                              </td>
                              <td className="py-3 px-4 align-middle">
                                <div className="fw-semibold">{u.fullName}</div>
                                <small className="text-muted d-md-none">{u.email}</small>
                              </td>
                              <td className="py-3 px-4 align-middle d-none d-md-table-cell">
                                <span className="text-muted">{u.email}</span>
                              </td>
                              <td className="py-3 px-4 align-middle d-none d-lg-table-cell">
                                <span className="text-muted">{u.phoneNumber}</span>
                              </td>
                              <td className="py-3 px-4 align-middle">
                                <Badge 
                                  bg={getRoleBadgeVariant(u.role?.roleName || u.role?.name || u.roleName || u.role || "Unknown")}
                                  className="px-3 py-2 fw-semibold"
                                >
                                  {u.role?.roleName || u.role?.name || u.roleName || u.role || "Unknown"}
                                </Badge>
                              </td>
                              <td className="py-3 px-4 align-middle text-center">
                                <div className="d-flex gap-2 justify-content-center flex-wrap">
                                  <Button
                                    variant="outline-info"
                                    size="sm"
                                    onClick={() => handleViewItem(u)}
                                    className="px-3"
                                  >
                                    <i className="fas fa-eye me-1"></i>
                                    View
                                  </Button>
                                  <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() => handleEditUser(u)}
                                    className="px-3"
                                  >
                                    <i className="fas fa-edit me-1"></i>
                                    Edit
                                  </Button>
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => {
                                      setUserToDelete(u);
                                      setShowDeleteModal(true);
                                    }}
                                    className="px-3"
                                  >
                                    <i className="fas fa-trash me-1"></i>
                                    Delete
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {users.length === 0 && (
                            <tr>
                              <td colSpan="6" className="text-center py-5">
                                <div className="text-muted">
                                  <i className="fas fa-users fa-3x mb-3 opacity-25"></i>
                                  <h5>No users found</h5>
                                  <p className="mb-0">Start by adding your first user</p>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </Card.Body>
              </Card>
            )}

            {/* Contact Queries Section */}
            {activeMenu === "contacts" && (
              <Card className="border-0 shadow-sm">
                <Card.Header className="text-white py-4" style={{ background: 'linear-gradient(90deg, #6F7BD9, #6A3FA0)' }}>
                  <Row className="align-items-center">
                    <Col xs={12} md={8}>
                      <h4 className="mb-1 fw-bold">
                        <i className="fas fa-envelope me-3"></i>
                        Contact Queries
                      </h4>
                      <p className="mb-0 opacity-75">Review and manage customer inquiries</p>
                    </Col>
                    <Col xs={12} md={4} className="text-md-end mt-3 mt-md-0">
                      <Badge 
                        bg="light" 
                        text="dark" 
                        className="px-3 py-2 fw-semibold fs-6"
                      >
                        Total: {contacts.length}
                      </Badge>
                    </Col>
                  </Row>
                </Card.Header>
                
                <Card.Body className="p-0 mt-3">
                  {loading ? (
                    <div className="text-center py-5">
                      <Spinner animation="border" variant="success" className="mb-3" />
                      <p className="text-muted">Loading contact queries...</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <Table hover className="mb-0">
                        <thead className="table-light">
                          <tr>
                            <th className="py-3 px-4 fw-bold">ID</th>
                            <th className="py-3 px-4 fw-bold">Full Name</th>
                            <th className="py-3 px-4 fw-bold d-none d-md-table-cell">Email</th>
                            <th className="py-3 px-4 fw-bold">Message</th>
                            <th className="py-3 px-4 fw-bold d-none d-lg-table-cell">Created At</th>
                            <th className="py-3 px-4 fw-bold text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {contacts.map((c) => (
                            <tr key={c.contactId}>
                              <td className="py-3 px-4 align-middle">
                                <span className="fw-bold text-primary">{c.contactId || c.id || c.contact_id || 'N/A'}</span>
                              </td>
                              <td className="py-3 px-4 align-middle">
                                <div className="fw-semibold">{c.fullName}</div>
                                <small className="text-muted d-md-none">{c.email}</small>
                              </td>
                              <td className="py-3 px-4 align-middle d-none d-md-table-cell">
                                <span className="text-muted">{c.email}</span>
                              </td>
                              <td className="py-3 px-4 align-middle">
                                <div className="text-truncate" style={{ maxWidth: '250px' }}>
                                  {c.message.length > 60
                                    ? `${c.message.substring(0, 60)}...`
                                    : c.message}
                                </div>
                              </td>
                              <td className="py-3 px-4 align-middle d-none d-lg-table-cell">
                                <span className="text-muted">
                                  {new Date(c.createdAt).toLocaleDateString()}
                                </span>
                              </td>
                              <td className="py-3 px-4 align-middle text-center">
                                <Button
                                  variant="outline-info"
                                  size="sm"
                                  onClick={() => handleViewItem(c)}
                                  className="px-3"
                                >
                                  <i className="fas fa-eye me-1"></i>
                                  View
                                </Button>
                              </td>
                            </tr>
                          ))}
                          {contacts.length === 0 && (
                            <tr>
                              <td colSpan="5" className="text-center py-5">
                                <div className="text-muted">
                                  <i className="fas fa-envelope fa-3x mb-3 opacity-25"></i>
                                  <h5>No contact queries found</h5>
                                  <p className="mb-0">Customer inquiries will appear here</p>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </Card.Body>
              </Card>
            )}

            {/* Manage Feedback Section */}
            {activeMenu === "feedbacks" && (
              <Card className="border-0 shadow-sm">
                <Card.Header className="text-white py-4" style={{ background: 'linear-gradient(90deg, #6F7BD9, #6A3FA0)' }}>
                  <Row className="align-items-center">
                    <Col xs={12} md={8}>
                      <h4 className="mb-1 fw-bold">
                        <i className="fas fa-comments me-3"></i>
                        Manage Feedback
                      </h4>
                      <p className="mb-0 opacity-75">Review and manage user feedback</p>
                    </Col>
                    <Col xs={12} md={4} className="text-md-end mt-3 mt-md-0">
                      <Badge 
                        bg="light" 
                        text="dark" 
                        className="px-3 py-2 fw-semibold fs-6"
                      >
                        Total: {feedbacks.length}
                      </Badge>
                    </Col>
                  </Row>
                </Card.Header>
                
                <Card.Body className="p-0 mt-3">
                  {loading ? (
                    <div className="text-center py-5">
                      <Spinner animation="border" variant="primary" className="mb-3" />
                      <p className="text-muted">Loading feedbacks...</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <Table hover className="mb-0">
                        <thead className="table-light">
                          <tr>
                            <th className="py-3 px-4 fw-bold">ID</th>
                            <th className="py-3 px-4 fw-bold">User ID</th>
                            <th className="py-3 px-4 fw-bold">Rating</th>
                            <th className="py-3 px-4 fw-bold">Comments</th>
                            <th className="py-3 px-4 fw-bold d-none d-lg-table-cell">Created At</th>
                            <th className="py-3 px-4 fw-bold text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {feedbacks.map((f) => (
                            <tr key={f.feedbackId || f.id}>
                              <td className="py-3 px-4 align-middle">
                                <span className="fw-bold text-primary">{f.feedbackId || f.id || f.feedback_id || 'N/A'}</span>
                              </td>
                              <td className="py-3 px-4 align-middle">
                                <div className="fw-semibold">{f.userId || f.user_id || f.id}</div>
                              </td>
                              <td className="py-3 px-4 align-middle">
                                <div className="d-flex align-items-center">
                                  <span className="fw-bold text-warning me-2">{f.rating}/5</span>
                                  <div>
                                    {[...Array(5)].map((_, i) => (
                                      <i key={i} className={`fas fa-star ${i < f.rating ? 'text-warning' : 'text-muted'}`}></i>
                                    ))}
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4 align-middle">
                                <div className="text-truncate" style={{ maxWidth: '250px' }}>
                                  {f.comments && f.comments.length > 60
                                    ? `${f.comments.substring(0, 60)}...`
                                    : f.comments || f.feedback}
                                </div>
                              </td>
                              <td className="py-3 px-4 align-middle d-none d-lg-table-cell">
                                <span className="text-muted">
                                  {f.createdAt ? new Date(f.createdAt).toLocaleDateString() : 'N/A'}
                                </span>
                              </td>
                              <td className="py-3 px-4 align-middle text-center">
                                <Button
                                  variant="outline-info"
                                  size="sm"
                                  onClick={() => handleViewItem(f)}
                                  className="px-3"
                                >
                                  <i className="fas fa-eye me-1"></i>
                                  View
                                </Button>
                              </td>
                            </tr>
                          ))}
                          {feedbacks.length === 0 && (
                            <tr>
                              <td colSpan="5" className="text-center py-5">
                                <div className="text-muted">
                                  <i className="fas fa-comments fa-3x mb-3 opacity-25"></i>
                                  <h5>No feedback found</h5>
                                  <p className="mb-0">User feedback will appear here</p>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>

        {/* View Modal */}
        <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg" centered>
          <Modal.Header closeButton className={`text-white ${activeMenu === "users" ? "bg-primary" : activeMenu === "contacts" ? "bg-success" : "bg-info"}`} style={activeMenu === "feedbacks" ? { background: 'linear-gradient(90deg, #6F7BD9, #6A3FA0)' } : {}}>
            <Modal.Title className="fw-bold">
              <i className={`fas ${activeMenu === "users" ? "fa-user" : activeMenu === "contacts" ? "fa-envelope" : "fa-comments"} me-2`}></i>
              {activeMenu === "users" ? "User Details" : activeMenu === "contacts" ? "Contact Query Details" : "Feedback Details"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">
            {selectedItem && (
              <div>
                {activeMenu === "users" ? (
                  <Row className="g-4">
                    <Col md={6}>
                      <div className="p-3 bg-light rounded">
                        <small className="text-muted fw-bold text-uppercase">User ID</small>
                        <div className="fw-bold text-primary fs-5">{selectedItem.userId || selectedItem.id || selectedItem.user_id || 'N/A'}</div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="p-3 bg-light rounded">
                        <small className="text-muted fw-bold text-uppercase">Role</small>
                        <div className="mt-2">
                          <Badge 
                            bg={getRoleBadgeVariant(selectedItem.role?.roleName)}
                            className="px-3 py-2 fw-semibold"
                          >
                            {selectedItem.role?.roleName || selectedItem.role?.name || selectedItem.roleName || selectedItem.role || "Unknown"}
                          </Badge>
                        </div>
                      </div>
                    </Col>
                    <Col xs={12}>
                      <div className="p-3 bg-light rounded">
                        <small className="text-muted fw-bold text-uppercase">Full Name</small>
                        <div className="fw-bold fs-5">{selectedItem.fullName}</div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="p-3 bg-light rounded">
                        <small className="text-muted fw-bold text-uppercase">Email</small>
                        <div className="fw-semibold">{selectedItem.email}</div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="p-3 bg-light rounded">
                        <small className="text-muted fw-bold text-uppercase">Phone</small>
                        <div className="fw-semibold">{selectedItem.phoneNumber}</div>
                      </div>
                    </Col>
                  </Row>
                ) : activeMenu === "feedbacks" ? (
                  <Row className="g-4">
                    <Col xs={12}>
                      <div className="p-3 bg-light rounded">
                        <small className="text-muted fw-bold text-uppercase">Feedback ID</small>
                        <div className="fw-bold text-primary fs-5">{selectedItem.feedbackId || selectedItem.feedback_id || selectedItem.id || 'N/A'}</div>
                      </div>
                    </Col>
                    <Col xs={12}>
                      <div className="p-3 bg-light rounded">
                        <small className="text-muted fw-bold text-uppercase">User ID</small>
                        <div className="fw-bold fs-5">{selectedItem.userId || selectedItem.user_id || selectedItem.id || 'N/A'}</div>
                      </div>
                    </Col>
                    <Col xs={12}>
                      <div className="p-3 bg-light rounded">
                        <small className="text-muted fw-bold text-uppercase">Rating</small>
                        <div className="d-flex align-items-center mt-2">
                          <span className="fw-bold text-warning me-3 fs-4">{selectedItem.rating}/5</span>
                          <div>
                            {[...Array(5)].map((_, i) => (
                              <i key={i} className={`fas fa-star fs-5 ${i < selectedItem.rating ? 'text-warning' : 'text-muted'}`}></i>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col xs={12}>
                      <div className="p-3 bg-light rounded">
                        <small className="text-muted fw-bold text-uppercase">Comments</small>
                        <div className="fw-semibold" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                          {selectedItem.comments || selectedItem.feedback || 'No comments provided'}
                        </div>
                      </div>
                    </Col>
                    <Col xs={12}>
                      <div className="p-3 bg-light rounded">
                        <small className="text-muted fw-bold text-uppercase">Created At</small>
                        <div className="fw-semibold">{selectedItem.createdAt ? new Date(selectedItem.createdAt).toLocaleString() : 'N/A'}</div>
                      </div>
                    </Col>
                  </Row>
                ) : (
                  <Row className="g-4">
                    <Col xs={12}>
                      <div className="p-3 bg-light rounded">
                        <small className="text-muted fw-bold text-uppercase">Full Name</small>
                        <div className="fw-bold fs-5">{selectedItem.fullName}</div>
                      </div>
                    </Col>
                    <Col xs={12}>
                      <div className="p-3 bg-light rounded">
                        <small className="text-muted fw-bold text-uppercase">Email</small>
                        <div className="fw-semibold">{selectedItem.email}</div>
                      </div>
                    </Col>
                    <Col xs={12}>
                      <div className="p-3 bg-light rounded">
                        <small className="text-muted fw-bold text-uppercase">Message</small>
                        <div className="fw-semibold" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                          {selectedItem.message}
                        </div>
                      </div>
                    </Col>
                    <Col xs={12}>
                      <div className="p-3 bg-light rounded">
                        <small className="text-muted fw-bold text-uppercase">Created At</small>
                        <div className="fw-semibold">{new Date(selectedItem.createdAt).toLocaleString()}</div>
                      </div>
                    </Col>
                  </Row>
                )}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowViewModal(false)}>
              <i className="fas fa-times me-2"></i>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
          <Modal.Header closeButton className="bg-danger text-white">
            <Modal.Title className="fw-bold">
              <i className="fas fa-exclamation-triangle me-2"></i>
              Confirm Delete
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">
            {userToDelete && (
              <div className="text-center">
                <div 
                  className="mx-auto mb-4 d-flex align-items-center justify-content-center bg-danger text-white rounded-circle"
                  style={{ width: '80px', height: '80px' }}
                >
                  <i className="fas fa-trash fa-2x"></i>
                </div>
                <h5 className="mb-3 fw-bold">Delete User</h5>
                <p className="text-muted mb-0">
                  Are you sure you want to delete <strong>{userToDelete.fullName}</strong>? 
                  This action cannot be undone.
                </p>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer className="justify-content-center">
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)} className="me-2">
              <i className="fas fa-times me-2"></i>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteUser}>
              <i className="fas fa-trash me-2"></i>
              Delete User
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default AdminDashboard;