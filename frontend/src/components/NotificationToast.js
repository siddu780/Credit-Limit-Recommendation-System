import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { useNotification } from '../context/NotificationContext';
import '../styles/Notification.css';

const NotificationToast = () => {
  const { notifications, removeNotification } = useNotification();

  const getBackgroundColor = (type) => {
    switch (type) {
      case 'success':
        return '#d4edda';
      case 'error':
        return '#f8d7da';
      case 'warning':
        return '#fff3cd';
      case 'info':
      default:
        return '#d1ecf1';
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'success':
        return '#c3e6cb';
      case 'error':
        return '#f5c6cb';
      case 'warning':
        return '#ffeaa7';
      case 'info':
      default:
        return '#bee5eb';
    }
  };

  const getTextColor = (type) => {
    switch (type) {
      case 'success':
        return '#155724';
      case 'error':
        return '#721c24';
      case 'warning':
        return '#856404';
      case 'info':
      default:
        return '#0c5460';
    }
  };

  return (
    <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          onClose={() => removeNotification(notification.id)}
          show={true}
          delay={5000}
          autohide
          style={{
            backgroundColor: getBackgroundColor(notification.type),
            borderLeft: `4px solid ${getBorderColor(notification.type)}`,
          }}
        >
          <Toast.Header closeButton>
            <strong className="me-auto" style={{ color: getTextColor(notification.type) }}>
              {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
            </strong>
          </Toast.Header>
          <Toast.Body style={{ color: getTextColor(notification.type) }}>
            {notification.message}
          </Toast.Body>
        </Toast>
      ))}
    </ToastContainer>
  );
};

export default NotificationToast;
