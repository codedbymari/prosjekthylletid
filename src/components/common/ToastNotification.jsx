import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import './ToastNotification.css';

function ToastNotification({ visible, message, type, onClose }) {
  const [hovering, setHovering] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (visible && !hovering) {
      const wordCount = message.trim().split(/\s+/).length;
      const duration = Math.min(1000 + wordCount * 500, 8000);

      timeoutRef.current = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timeoutRef.current);
    }
  }, [visible, message, hovering, onClose]);

  if (!visible) return null;

  const icon = type === 'success' ? <FiCheckCircle /> : <FiXCircle />;

  return (
    <div
      className={`modern-toast toast-${type}`}
      role="alert"
      aria-live="polite"
      onMouseEnter={() => {
        setHovering(true);
        clearTimeout(timeoutRef.current);
      }}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="toast-icon">{icon}</div>
      <div className="toast-text">
        <strong>{type === 'success' ? 'Success' : 'Error'}.</strong> {message}
      </div>
    </div>
  );
}

ToastNotification.propTypes = {
  visible: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error']).isRequired,
  onClose: PropTypes.func.isRequired
};

export default ToastNotification;
