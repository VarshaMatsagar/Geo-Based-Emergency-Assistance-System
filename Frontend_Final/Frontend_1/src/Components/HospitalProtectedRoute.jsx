import React from 'react';
import { Container, Card } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const HospitalProtectedRoute = ({ children }) => {
  const { isLoggedIn, user } = useAuth();

  console.log('HospitalProtectedRoute - isLoggedIn:', isLoggedIn);
  console.log('HospitalProtectedRoute - user:', user);
  console.log('HospitalProtectedRoute - user.role:', user?.role);
  console.log('HospitalProtectedRoute - user.Role:', user?.Role);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user?.Role || user?.role;
  if (userRole !== 'Hospital') {
    return (
      <Container className="mt-5">
        <Card className="text-center">
          <Card.Body className="p-5">
            <h3 className="mb-4">🚫 Access Denied</h3>
            <p className="mb-4">You need HOSPITAL role to access this page. Current role: {userRole}</p>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return children;
};

export default HospitalProtectedRoute;