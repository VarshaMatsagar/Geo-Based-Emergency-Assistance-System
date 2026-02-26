import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <Container className="mt-5">
      <Row className="text-center mb-5">
        <Col>
          <h1 className="display-4">GEO Emergency Response System</h1>
          <p className="lead">Quick emergency reporting and response platform</p>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="text-center">
            <Card.Body className="p-5">
              <h3 className="mb-4">Report Emergency</h3>
              <p className="mb-4">
                Access the citizen portal to report emergencies, manage your profile, 
                and get immediate assistance when you need it most.
              </p>
              <Link to="/citizen">
                <Button variant="danger" size="lg">
                  🚨 Access Citizen Portal
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col md={4}>
          <Card className="h-100">
            <Card.Body className="text-center">
              <h5>📱 Message Emergency</h5>
              <p>Send detailed emergency descriptions instantly</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100">
            <Card.Body className="text-center">
              <h5>📸 Image Emergency</h5>
              <p>Upload photos to provide visual context</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100">
            <Card.Body className="text-center">
              <h5>🚨 Panic Button</h5>
              <p>One-click emergency alert for immediate help</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LandingPage;