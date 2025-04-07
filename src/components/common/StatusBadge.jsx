// src/components/common/StatusBadge.jsx
import React from 'react';
import PropTypes from 'prop-types';

function StatusBadge({ status }) {
  return (
    <span className={`status-badge status-${status.toLowerCase()}`}>
      {status}
    </span>
  );
}

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired
};

export default StatusBadge;