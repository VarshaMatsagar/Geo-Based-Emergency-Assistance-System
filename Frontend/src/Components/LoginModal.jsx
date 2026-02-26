import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import { toast } from 'react-toastify';
import { authAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function LoginModal({ show, onClose }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");
        
        try {
            const response = await authAPI.login({ email, passwordHash: password });
            const user = response.data.user;

            login({
                userId: user.id,
                name: user.fullName,
                email: user.email,
                role: user.role,
                token: response.data.token
            });

            toast.success(`Welcome back, ${user.fullName}!`);
            onClose();

            if (user.role === "CITIZEN") {
                navigate("/citizen");
            } else {
                navigate("/");
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Invalid email or password";
            setError(errorMessage);
            
            // If email verification is required, show specific message
            if (errorMessage.includes("verify your email")) {
                toast.error("Please verify your email first. Check your inbox for the OTP.");
            } else {
                toast.error(errorMessage);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Login</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                
                <Form onSubmit={handleLogin}>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Button type="submit" variant="primary" className="w-100" disabled={isSubmitting}>
                        {isSubmitting ? 'Logging in...' : 'Login'}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}