import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner } from "react-bootstrap";
import { getEmergencyById, updateEmergencyStatus } from "../../api/hospitalApi";
import AuthenticatedImage from "../../Components/AuthenticatedImage";

const HospitalEmergencyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [emergency, setEmergency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Hospital-specific status flow
  const statusFlow = {
    PENDING: { next: 'ACCEPTED', label: 'Accept Emergency', variant: 'success' },
    ACCEPTED: { next: 'IN_PROGRESS', label: 'Mark as In Progress', variant: 'primary' },
    IN_PROGRESS: { next: 'RESOLVED', label: 'Mark as Resolved', variant: 'info' },
    RESOLVED: { next: null, label: 'Completed', variant: 'secondary' }
  };

  useEffect(() => {
    fetchEmergencyDetails();
  }, [id]);

  const fetchEmergencyDetails = async () => {
    try {
      const response = await getEmergencyById(id);
      // Extract emergency data from ApiResponse structure
      const emergencyData = response.data?.data;
      
      // Debug logging
      console.log('🔍 Emergency API Response:', response.data);
      console.log('🏥 Assigned Hospital:', emergencyData?.assignedHospital);
      
      setEmergency(emergencyData);
    } catch (error) {
      setError("Failed to load emergency details");
      console.error("Error fetching emergency details:", error);
    } finally {
      setLoading(false);
    }
  };



  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    setError("");
    setSuccess("");
    
    try {
      await updateEmergencyStatus(id, newStatus);
      setSuccess(`Emergency status updated to ${newStatus}`);
      // Refresh emergency details
      await fetchEmergencyDetails();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update emergency status");
      console.error("Error updating status:", error);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      PENDING: "warning",
      ACCEPTED: "info", 
      IN_PROGRESS: "primary",
      RESOLVED: "success",
      REJECTED: "danger"
    };
    return <Badge bg={statusColors[status] || "secondary"}>{status}</Badge>;
  };

  const canUpdateStatus = (currentStatus) => {
    return statusFlow[currentStatus]?.next !== null;
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading emergency details...</p>
      </Container>
    );
  }

  if (error && !emergency) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
        <Button variant="secondary" onClick={() => navigate("/hospital")}>
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  if (!emergency) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">Emergency not found</Alert>
        <Button variant="secondary" onClick={() => navigate("/hospital")}>
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>🏥 Emergency Details</h2>
        <Button variant="secondary" onClick={() => navigate("/hospital")}>
          ← Back to Dashboard
        </Button>
      </div>

      {/* Status Messages */}
      {error && <Alert variant="danger" dismissible onClose={() => setError("")}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess("")}>{success}</Alert>}

      <Row>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Header>
              <h5>👤 User Information</h5>
            </Card.Header>
            <Card.Body>
              {emergency.user ? (
                <>
                  <p><strong>User ID:</strong> {emergency.user.id}</p>
                  <p><strong>Name:</strong> {emergency.user.fullName}</p>
                  <p><strong>Email:</strong> {emergency.user.email}</p>
                  <p><strong>Mobile:</strong> {emergency.user.phoneNumber}</p>
                  <p><strong>Address:</strong> {emergency.user.address || "Not provided"}</p>
                </>
              ) : (
                <p className="text-muted">Anonymous User</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-4">
          <Card>
            <Card.Header>
              <h5>🚨 Emergency Information</h5>
            </Card.Header>
            <Card.Body>
              <p><strong>Emergency ID:</strong> {emergency.id}</p>
              <p><strong>Type:</strong> {emergency.emergencyType}</p>
              <p><strong>Status:</strong> {getStatusBadge(emergency.status)}</p>
              <p><strong>Date & Time:</strong> {emergency.createdOn ? new Date(emergency.createdOn).toLocaleString() : "N/A"}</p>
              <p><strong>Assigned Hospital:</strong> 
                {emergency.assignedHospital ? (
                  <span className="text-success fw-bold">{emergency.assignedHospital.name}</span>
                ) : (
                  <span className="text-muted">Not assigned</span>
                )}
              </p>
              <p><strong>Location:</strong> {emergency.address || 
                (emergency.latitude && emergency.longitude 
                  ? `${emergency.latitude.toFixed(4)}, ${emergency.longitude.toFixed(4)}` 
                  : "Not provided")}</p>
              {emergency.latitude && emergency.longitude && (
                <p>
                  <a 
                    href={`https://www.google.com/maps?q=${emergency.latitude},${emergency.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    🗺️ View on Map
                  </a>
                </p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={12} className="mb-4">
          <Card>
            <Card.Header>
              <h5>📝 Emergency Message</h5>
            </Card.Header>
            <Card.Body>
              <p>{emergency.description || "No message provided"}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Emergency Media */}
      {emergency.emergencyType === 'Image' && (
        <Row>
          <Col md={12} className="mb-4">
            <Card>
              <Card.Header>
                <h5>📸 Emergency Image</h5>
              </Card.Header>
              <Card.Body className="text-center">
                <AuthenticatedImage
                  src={`http://localhost:8081/api/hospital/emergency/${emergency.id}/image`}
                  alt="Emergency evidence"
                  className="img-fluid"
                  style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain' }}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Status Update Actions */}
      <Row>
        <Col md={12} className="text-center">
          <Card>
            <Card.Header>
              <h5>🔄 Update Emergency Status</h5>
            </Card.Header>
            <Card.Body>
              <p className="mb-3">Current Status: {getStatusBadge(emergency.status)}</p>
              
              {canUpdateStatus(emergency.status) ? (
                <Button 
                  variant={statusFlow[emergency.status].variant}
                  size="lg"
                  disabled={updating}
                  onClick={() => handleStatusUpdate(statusFlow[emergency.status].next)}
                >
                  {updating ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Updating...
                    </>
                  ) : (
                    statusFlow[emergency.status].label
                  )}
                </Button>
              ) : (
                <Alert variant="info" className="mb-0">
                  This emergency has been resolved and cannot be updated further.
                </Alert>
              )}
              
              {/* Status Flow Indicator */}
              <div className="mt-4">
                <h6>Status Flow:</h6>
                <div className="d-flex justify-content-center align-items-center flex-wrap">
                  {Object.keys(statusFlow).map((status, index) => (
                    <React.Fragment key={status}>
                      <Badge 
                        bg={emergency.status === status ? "primary" : "light"}
                        text={emergency.status === status ? "white" : "dark"}
                        className="px-3 py-2 m-1"
                      >
                        {status}
                      </Badge>
                      {index < Object.keys(statusFlow).length - 1 && (
                        <span className="mx-2">→</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HospitalEmergencyDetail;