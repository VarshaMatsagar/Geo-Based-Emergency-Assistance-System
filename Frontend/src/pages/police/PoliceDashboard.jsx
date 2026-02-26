import React, { useEffect, useState } from "react";
import { getAllEmergencies, getActiveEmergencies } from "../../api/policeApi";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Badge, ButtonGroup, Alert, Spinner } from "react-bootstrap";
import AuthenticatedImage from "../../Components/AuthenticatedImage";

export default function PoliceDashboard() {
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' or 'active'
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmergencies();
  }, [filter]);

  const fetchEmergencies = async () => {
    setLoading(true);
    setError("");
    try {
      const response = filter === 'active' 
        ? await getActiveEmergencies() 
        : await getAllEmergencies();
      setEmergencies(response.data);
    } catch (error) {
      setError("Failed to fetch emergencies");
      console.error("Error fetching emergencies", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { bg: "warning", text: "dark" },
      ACCEPTED: { bg: "info", text: "white" },
      IN_PROGRESS: { bg: "primary", text: "white" },
      RESOLVED: { bg: "success", text: "white" }
    };
    const config = statusConfig[status] || { bg: "secondary", text: "white" };
    return (
      <Badge bg={config.bg} text={config.text}>
        {status}
      </Badge>
    );
  };

  const getPriorityColor = (status) => {
    switch (status) {
      case 'PENDING': return 'border-warning';
      case 'ACCEPTED': return 'border-info';
      case 'IN_PROGRESS': return 'border-primary';
      case 'RESOLVED': return 'border-success';
      default: return 'border-secondary';
    }
  };

  const getEmergencyStats = () => {
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
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>🚓 Police Emergency Dashboard</h2>
        <ButtonGroup>
          <Button 
            variant={filter === 'all' ? 'primary' : 'outline-primary'}
            onClick={() => setFilter('all')}
          >
            All Emergencies
          </Button>
          <Button 
            variant={filter === 'active' ? 'primary' : 'outline-primary'}
            onClick={() => setFilter('active')}
          >
            Active Only
          </Button>
        </ButtonGroup>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center border-warning">
            <Card.Body>
              <h3 className="text-warning">{stats.PENDING || 0}</h3>
              <p className="mb-0">Pending</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-info">
            <Card.Body>
              <h3 className="text-info">{stats.ACCEPTED || 0}</h3>
              <p className="mb-0">Accepted</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-primary">
            <Card.Body>
              <h3 className="text-primary">{stats.IN_PROGRESS || 0}</h3>
              <p className="mb-0">In Progress</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-success">
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
          <p className="mb-0">
            {filter === 'active' 
              ? 'There are no active emergencies at the moment.' 
              : 'No emergencies have been reported yet.'}
          </p>
        </Alert>
      ) : (
        <Row>
          {emergencies.map((emergency) => (
            <Col md={6} lg={4} key={emergency.id} className="mb-4">
              <Card className={`h-100 ${getPriorityColor(emergency.status)}`}>
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">ID: {emergency.id}</small>
                  {getStatusBadge(emergency.status)}
                </Card.Header>
                <Card.Body>
                  <h6 className="card-title">{emergency.emergencyType}</h6>
                  <p className="card-text">
                    <strong>User:</strong> {emergency.user?.fullName || 'Anonymous'}<br/>
                    <strong>Location:</strong> {emergency.address || `${emergency.latitude?.toFixed(4)}, ${emergency.longitude?.toFixed(4)}` || 'Not specified'}<br/>
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
                        src={`http://localhost:8081/api/police/emergency/${emergency.id}/image`}
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
                    onClick={() => navigate(`/police/emergency/${emergency.id}`)}
                  >
                    View Details & Update Status
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