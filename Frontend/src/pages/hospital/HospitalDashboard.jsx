import React, { useEffect, useState } from "react";
import { getAllEmergencies } from "../../api/hospitalApi";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner } from "react-bootstrap";
import AuthenticatedImage from "../../Components/AuthenticatedImage";

export default function HospitalDashboard() {
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmergencies();
  }, []);

  const fetchEmergencies = async () => {
    setLoading(true);
    setError("");
    try {
      console.log('Fetching emergencies for hospital...');
      const response = await getAllEmergencies();
      console.log('Hospital API Response:', response);
      
      // Extract data from ApiResponse structure
      const emergencyData = response.data?.data || response.data || [];
      console.log('Emergency data:', emergencyData);
      
      setEmergencies(Array.isArray(emergencyData) ? emergencyData : []);
    } catch (error) {
      console.error("Error fetching emergencies:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      console.error("Current token:", localStorage.getItem('token'));
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          "Failed to fetch emergencies";
      setError(`${errorMessage} (Status: ${error.response?.status || 'Unknown'})`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { bg: "warning", text: "dark" },
      ACCEPTED: { bg: "info", text: "white" },
      ON_THE_WAY: { bg: "primary", text: "white" },
      RESOLVED: { bg: "success", text: "white" }
    };
    const config = statusConfig[status] || { bg: "secondary", text: "white" };
    return (
      <Badge bg={config.bg} text={config.text}>
        {status}
      </Badge>
    );
  };

  const getEmergencyStats = () => {
    if (!Array.isArray(emergencies)) return {};
    const stats = emergencies.reduce((acc, emergency) => {
      acc[emergency.status] = (acc[emergency.status] || 0) + 1;
      return acc;
    }, {});
    return stats;
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading emergencies...</p>
      </Container>
    );
  }

  const stats = getEmergencyStats();

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>🏥 Hospital Emergency Dashboard</h2>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Row className="mb-4 g-3">
        <Col md={3}>
          <Card 
            className="text-center border-warning" 
            style={{ transition: 'all 0.3s ease', cursor: 'pointer' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#fff3cd';
              e.currentTarget.style.transform = 'translateY(-5px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Card.Body>
              <h3 className="text-warning">{stats.PENDING || 0}</h3>
              <p className="mb-0">Pending</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card 
            className="text-center border-info" 
            style={{ transition: 'all 0.3s ease', cursor: 'pointer' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#d1ecf1';
              e.currentTarget.style.transform = 'translateY(-5px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Card.Body>
              <h3 className="text-info">{stats.ACCEPTED || 0}</h3>
              <p className="mb-0">Accepted</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card 
            className="text-center border-primary" 
            style={{ transition: 'all 0.3s ease', cursor: 'pointer' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#d1ecf1';
              e.currentTarget.style.transform = 'translateY(-5px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Card.Body>
              <h3 className="text-primary">{stats.ON_THE_WAY || 0}</h3>
              <p className="mb-0">On The Way</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card 
            className="text-center border-success" 
            style={{ transition: 'all 0.3s ease', cursor: 'pointer' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#d4edda';
              e.currentTarget.style.transform = 'translateY(-5px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Card.Body>
              <h3 className="text-success">{stats.RESOLVED || 0}</h3>
              <p className="mb-0">Resolved</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Emergencies List */}
      {emergencies.length === 0 ? (
        <Alert variant="info" className="text-center">
          <h5>No emergencies found</h5>
          <p className="mb-0">No emergencies have been reported yet.</p>
        </Alert>
      ) : (
        <Row>
          {emergencies.map((emergency) => (
            <Col md={6} lg={4} key={emergency.id} className="mb-4">
              <Card className="h-100">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">ID: {emergency.id}</small>
                  {getStatusBadge(emergency.status)}
                </Card.Header>
                <Card.Body>
                  <h6 className="card-title">{emergency.emergencyType}</h6>
                  <p className="card-text">
                    <strong>User:</strong> {emergency.user?.fullName || 'Anonymous'}<br/>
                    <strong>Location:</strong> {emergency.address || 
                      (emergency.latitude && emergency.longitude 
                        ? `${emergency.latitude.toFixed(4)}, ${emergency.longitude.toFixed(4)}` 
                        : 'Not specified')}<br/>
                    {emergency.assignedHospital && (
                      <><strong>Assigned Hospital:</strong> {emergency.assignedHospital.name}<br/></>
                    )}
                    <strong>Time:</strong> {emergency.createdOn ? new Date(emergency.createdOn).toLocaleString() : 'N/A'}
                  </p>
                  <p className="card-text text-muted">
                    {emergency.description?.length > 100 
                      ? `${emergency.description.substring(0, 100)}...` 
                      : emergency.description || 'No description'}
                  </p>
                  {emergency.emergencyType === 'Image' && (
                    <div className="mb-2">
                      <AuthenticatedImage
                        src={`http://localhost:8081/api/hospital/emergency/${emergency.id}/image`}
                        alt="Emergency evidence"
                        className="img-thumbnail"
                        style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                  {emergency.latitude && emergency.longitude && (
                    <p className="card-text">
                      <a 
                        href={`https://www.google.com/maps?q=${emergency.latitude},${emergency.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-primary"
                      >
                        🗺️ View Location
                      </a>
                    </p>
                  )}
                </Card.Body>
                <Card.Footer>
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-100"
                    onClick={() => navigate(`/hospital/emergency/${emergency.id}`)}
                  >
                    View Details
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}