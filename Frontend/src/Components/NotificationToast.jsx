import React, { useEffect, useState, useRef } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { notificationAPI } from '../services/api';

const NotificationToast = () => {
  const [notifications, setNotifications] = useState([]);
  const shownIdsRef = useRef(new Set());

  const fetchUnreadNotifications = async () => {
    try {
      const response = await notificationAPI.getUnreadNotifications();
      if (!response.data?.success) return;

      const unread = response.data.data || [];

      unread.forEach(n => {
        if (!shownIdsRef.current.has(n.id)) {
          shownIdsRef.current.add(n.id);
        }
      });

      setNotifications(unread);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    // ✔ async callback → ESLint safe
    const timeoutId = setTimeout(() => {
      fetchUnreadNotifications();
    }, 0);

    const intervalId = setInterval(() => {
      fetchUnreadNotifications();
    }, 30000);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, []);

  const handleClose = async (id) => {
    try {
      await notificationAPI.markAsRead(id);

      setNotifications(prev => prev.filter(n => n.id !== id));
      shownIdsRef.current.delete(id);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getToastVariant = (status) => {
    switch (status) {
      case 'ACCEPTED':
      case 'RESOLVED':
        return 'success';
      case 'IN_PROGRESS':
        return 'info';
      case 'REJECTED':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  return (
    <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
      {notifications.map(notification => (
        <Toast
          key={notification.id}
          show
          bg={getToastVariant(notification.emergencyStatus)}
          onClose={() => handleClose(notification.id)}
          delay={10000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">🚨 Emergency Update</strong>
            <small>
              {new Date(notification.createdOn).toLocaleTimeString()}
            </small>
          </Toast.Header>
          <Toast.Body className="text-white">
            <div className="fw-bold">
              Emergency #{notification.emergency?.id}
            </div>
            <div>{notification.message}</div>
          </Toast.Body>
        </Toast>
      ))}
    </ToastContainer>
  );
};

export default NotificationToast;





// import React, { useState, useEffect } from 'react';
// import { Toast, ToastContainer } from 'react-bootstrap';
// import { notificationAPI } from '../services/api';

// const NotificationToast = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [showToasts, setShowToasts] = useState({});

//   useEffect(() => {
//     fetchUnreadNotifications();
//     // Poll for new notifications every 30 seconds
//     const interval = setInterval(fetchUnreadNotifications, 30000);
//     return () => clearInterval(interval);
//   }, []);

//   const fetchUnreadNotifications = async () => {
//     try {
//       const response = await notificationAPI.getUnreadNotifications();
//       const newNotifications = response.data?.data || [];
      
//       // Show toasts for new notifications
//       newNotifications.forEach(notification => {
//         if (!showToasts[notification.id]) {
//           setShowToasts(prev => ({ ...prev, [notification.id]: true }));
//         }
//       });
      
//       setNotifications(newNotifications);
//     } catch (error) {
//       console.error('Error fetching notifications:', error);
//     }
//   };

//   const handleClose = async (notificationId) => {
//     try {
//       await notificationAPI.markAsRead(notificationId);
//       setShowToasts(prev => ({ ...prev, [notificationId]: false }));
//       setNotifications(prev => prev.filter(n => n.id !== notificationId));
//     } catch (error) {
//       console.error('Error marking notification as read:', error);
//     }
//   };

//   const getToastVariant = (status) => {
//     switch (status) {
//       case 'ACCEPTED': return 'success';
//       case 'IN_PROGRESS': return 'info';
//       case 'RESOLVED': return 'success';
//       case 'REJECTED': return 'warning';
//       default: return 'info';
//     }
//   };

//   return (
//     <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
//       {notifications.map(notification => (
//         <Toast
//           key={notification.id}
//           show={showToasts[notification.id]}
//           onClose={() => handleClose(notification.id)}
//           delay={10000}
//           autohide
//           bg={getToastVariant(notification.emergencyStatus)}
//         >
//           <Toast.Header>
//             <strong className="me-auto">
//               🚨 Emergency Update
//             </strong>
//             <small>{new Date(notification.createdOn).toLocaleTimeString()}</small>
//           </Toast.Header>
//           <Toast.Body className="text-white">
//             <div className="fw-bold mb-1">
//               Emergency #{notification.emergency?.id}
//             </div>
//             <div>{notification.message}</div>
//           </Toast.Body>
//         </Toast>
//       ))}
//     </ToastContainer>
//   );
// };

// export default NotificationToast;