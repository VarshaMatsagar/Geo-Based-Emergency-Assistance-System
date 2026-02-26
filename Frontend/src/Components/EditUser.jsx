import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import UserForm from "./UserForm";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <Container fluid className="py-4">
      <Row className="justify-content-center">
        <Col xs={12} lg={10} xl={8}>
          <div className="mb-4">
            <Button 
              variant="outline-secondary" 
              onClick={() => navigate("/admin")}
              className="mb-3"
            >
              <i className="fas fa-arrow-left me-2"></i>
              Back to Admin Dashboard
            </Button>
          </div>
          <UserForm
            userId={id}
            onSuccess={() => navigate("/admin")}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default EditUser;