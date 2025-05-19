// src/components/common/LoadingSpinner.jsx
import React from 'react';
import PropTypes from 'prop-types';

function LoadingSpinner({ message }) {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>{message || 'Laster inn...'}</p>
      <button className="btn-text" onClick={() => window.location.reload()}>
        Avbryt lasting
      </button>
    </div>
  );
}

LoadingSpinner.propTypes = {
  message: PropTypes.string
};

export default LoadingSpinner;