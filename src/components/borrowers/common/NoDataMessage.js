import React from 'react';

function NoDataMessage({ message = 'Ingen data tilgjengelig' }) {
  return (
    <div className="no-data-message">
      {message}
    </div>
  );
}

export default NoDataMessage;