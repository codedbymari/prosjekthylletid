// src/components/common/ToastNotification.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { FiCheckCircle, FiX, FiInfo } from 'react-icons/fi';

function ToastNotification({ visible, message, type }) {
  if (!visible) return null;
  
  return (
    <div className={`toast toast-${type}`} role="alert">
      <div className="toast-content">
        <span className="toast-icon">
          {type === 'success' ? <FiCheckCircle /> : 
           type === 'error' ? <FiX /> : <FiInfo />}
        </span>
        <p>{message}</p>
      </div>
    </div>
  );
}

ToastNotification.propTypes = {
  visible: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'info']).isRequired
};

export default ToastNotification;