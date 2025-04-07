// src/components/reservation/ReservationCards.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { FiUser, FiCalendar, FiClock, FiCheckCircle, FiInfo } from 'react-icons/fi';
import StatusBadge from '../common/StatusBadge';

function ReservationCards({ data, handleBorrowerClick }) {
  // Check if date is expired
  const isDateExpired = (dateString) => {
    if (!dateString) return false;
    
    const parseNorwegianDate = (dateStr) => {
      if (!dateStr) return null;
      const parts = dateStr.split('.');
      if (parts.length !== 3) return null;
      return new Date(parts[2], parts[1] - 1, parts[0]);
    };
    
    const date = parseNorwegianDate(dateString);
    return date && date < new Date();
  };

  return (
    <div className="card-grid">
      {data.map(item => (
        <div 
          key={item.id} 
          className={`reservation-card status-${item.status.toLowerCase()}-card`}
        >
          <div className="card-header">
            <div className="card-status">
              <StatusBadge status={item.status} />
            </div>
            <div className="card-pickup-number">
              <span className="pickup-label">Hentenr.</span>
              <span className="pickup-number">{item.pickupNumber}</span>
            </div>
          </div>
          
          <div className="card-content">
            <h3 className="book-title" title={item.title}>{item.title}</h3>
            <p className="book-author" title={item.author}>{item.author}</p>
            
            <div className="card-details">
              <div className="detail-row">
                <span className="detail-label">
                  <FiUser className="detail-icon" />
                  Låner:
                </span>
                <button 
                  className="borrower-link"
                  onClick={() => handleBorrowerClick(item.borrowerId)}
                  title={`Vis lånerdetaljer for ${item.borrowerName || item.borrowerId}`}
                >
                  {item.borrowerName || item.borrowerId}
                </button>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">
                  <FiCalendar className="detail-icon" />
                  Klar dato:
                </span>
                <span>{item.readyDate}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">
                  <FiClock className="detail-icon" />
                  Hentefrist:
                </span>
                <span className={
                  isDateExpired(item.expiryDate) && 
                  item.status !== 'Hentet' ? 'expired-date' : ''
                }>{item.expiryDate}</span>
              </div>
              
              {item.pickedUpDate && (
                <div className="detail-row">
                  <span className="detail-label">
                    <FiCheckCircle className="detail-icon success" />
                    Hentet:
                  </span>
                  <span>{item.pickedUpDate}</span>
                </div>
              )}
              
              {item.daysOnShelf !== null && (
                <div className="detail-row">
                  <span className="detail-label">
                    <FiInfo className="detail-icon" />
                    Dager på hylle:
                  </span>
                  <span className="days-value">{item.daysOnShelf}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="card-footer">
            <div className="card-metadata">
              <span className="metadata-item">
                ID: {item.id}
              </span>
              {item.reservedDate && (
                <span className="metadata-item">
                  Reservert: {item.reservedDate}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

ReservationCards.propTypes = {
  data: PropTypes.array.isRequired,
  handleBorrowerClick: PropTypes.func.isRequired
};

export default ReservationCards;