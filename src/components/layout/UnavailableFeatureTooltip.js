import React, { useEffect, useRef } from 'react';
import './UnavailableFeatureTooltip.css';

const UnavailableFeatureTooltip = ({ isVisible, onClose, position, message, }) => {
  const tooltipRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const tooltipPosition = position || { top: '50%', left: '50%' };

  return (
    <div className="tooltip-overlay">
      <div
        ref={tooltipRef}
        className="tooltip-container"
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
        }}
      >
      
        <p className="tooltip-message">{message || 'Denne funksjonen er ikke tilgjengelig i prototypen.'}</p>
        <button className="tooltip-close" onClick={onClose}>Lukk</button>
      </div>
    </div>
  );
};

export default UnavailableFeatureTooltip;
