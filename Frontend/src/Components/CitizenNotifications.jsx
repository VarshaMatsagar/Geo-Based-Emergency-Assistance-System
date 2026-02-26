import React, { useState, useEffect } from 'react';
import { Alert, Badge, Button, Card, ListGroup } from 'react-bootstrap';
import { notificationAPI } from '../services/api';
import { toast } from 'react-toastify';

const CitizenNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await notificationAPI.getNotifications();
      setNotifications(response.data.data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      toast.success('Notification marked as read');
    } catch (error) {
      toast.error('Failed to mark notification as read');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'RESOLVED': return 'success';
      case 'IN_PROGRESS': return 'primary';
      case 'ACCEPTED': return 'info';
      case 'REJECTED': return 'danger';
      default: return 'secondary';
    }
  };

  if (loading) {
    return <div className="text-center">Loading notifications...</div>;
  }

  if (notifications.length === 0) {
    return (
      <Alert variant="info" className="text-center">
        <i className="fas fa-bell me-2"></i>
        No notifications yet
      </Alert>
    );
  }

  return (
    <Card>
      <Card.Header>
        <h5><i className="fas fa-bell me-2"></i>Emergency Status Updates</h5>
      </Card.Header>
      <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
        <ListGroup variant="flush">
          {notifications.map((notification) => (
            <ListGroup.Item 
              key={notification.id}
              className={`d-flex justify-content-between align-items-start ${!notification.isRead ? 'bg-light' : ''}`}
            >
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <Badge bg={getStatusColor(notification.emergencyStatus)}>
                    {notification.emergencyStatus}
                  </Badge>
                  {!notification.isRead && (
                    <Badge bg="warning" text="dark">New</Badge>
                  )}
                </div>
                <p className="mb-1">{notification.message}</p>
                <small className="text-muted">
                  Emergency #{notification.emergency?.id} • {' '}
                  {new Date(notification.createdOn).toLocaleString()}
                </small>
              </div>
              {!notification.isRead && (
                <Button 
                  size="sm" 
                  variant="outline-primary"
                  onClick={() => markAsRead(notification.id)}
                >
                  Mark Read
                </Button>
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default CitizenNotifications;