import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return (
      <Container className="mt-5">
        <Card className="text-center">
          <Card.Body className="p-5">
            <h3 className="mb-4">🔒 Access Restricted</h3>
            <p className="mb-4">Please login as a citizen to access the emergency dashboard.</p>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return children;
};

export default ProtectedRoute;