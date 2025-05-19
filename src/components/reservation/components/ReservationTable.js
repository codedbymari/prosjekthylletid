// src/components/reservation/ReservationTable.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { FiUser, FiCalendar, FiClock, FiCheckCircle, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import StatusBadge from '../../common/StatusBadge';

function ReservationTable({
  data,
  visibleColumns,
  sortConfig,
  requestSort,
  handleBorrowerClick
}) {
  const renderSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return (
      <span className="sort-indicator">
        {sortConfig.direction === 'asc' ? <FiArrowUp /> : <FiArrowDown />}
      </span>
    );
  };

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
    <div className="data-table-container">
      <table className="data-table" aria-label="Reserveringer">
        <thead>
          <tr>
            {visibleColumns.title && (
              <th 
                onClick={() => requestSort('title')} 
                className="sortable"
                aria-sort={sortConfig.key === 'title' ? sortConfig.direction : 'none'}
              >
                Tittel {renderSortIndicator('title')}
              </th>
            )}
            {visibleColumns.author && (
              <th 
                onClick={() => requestSort('author')} 
                className="sortable"
                aria-sort={sortConfig.key === 'author' ? sortConfig.direction : 'none'}
              >
                Forfatter {renderSortIndicator('author')}
              </th>
            )}
            {visibleColumns.borrowerId && (
              <th 
                onClick={() => requestSort('borrowerId')} 
                className="sortable"
                aria-sort={sortConfig.key === 'borrowerId' ? sortConfig.direction : 'none'}
              >
                Låner {renderSortIndicator('borrowerId')}
              </th>
            )}
            {visibleColumns.readyDate && (
              <th 
                onClick={() => requestSort('readyDate')} 
                className="sortable"
                aria-sort={sortConfig.key === 'readyDate' ? sortConfig.direction : 'none'}
              >
                Klar dato {renderSortIndicator('readyDate')}
              </th>
            )}
            {visibleColumns.expiryDate && (
              <th 
                onClick={() => requestSort('expiryDate')} 
                className="sortable"
                aria-sort={sortConfig.key === 'expiryDate' ? sortConfig.direction : 'none'}
              >
                Hentefrist {renderSortIndicator('expiryDate')}
              </th>
            )}
            {visibleColumns.pickedUpDate && (
              <th 
                onClick={() => requestSort('pickedUpDate')} 
                className="sortable"
                aria-sort={sortConfig.key === 'pickedUpDate' ? sortConfig.direction : 'none'}
              >
                Hentet dato {renderSortIndicator('pickedUpDate')}
              </th>
            )}
            {visibleColumns.status && (
              <th 
                onClick={() => requestSort('status')} 
                className="sortable"
                aria-sort={sortConfig.key === 'status' ? sortConfig.direction : 'none'}
              >
                Status {renderSortIndicator('status')}
              </th>
            )}
            {visibleColumns.daysOnShelf && (
              <th 
                onClick={() => requestSort('daysOnShelf')} 
                className="sortable"
                aria-sort={sortConfig.key === 'daysOnShelf' ? sortConfig.direction : 'none'}
              >
                Dager {renderSortIndicator('daysOnShelf')}
              </th>
            )}
            {visibleColumns.pickupNumber && (
              <th 
                onClick={() => requestSort('pickupNumber')} 
                className="sortable"
                aria-sort={sortConfig.key === 'pickupNumber' ? sortConfig.direction : 'none'}
              >
                Hentenr. {renderSortIndicator('pickupNumber')}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr 
              key={item.id} 
              className={`status-${item.status.toLowerCase()}-row`}
            >
              {visibleColumns.title && (
                <td className="title-cell" title={item.title}>
                  {item.title}
                </td>
              )}
              {visibleColumns.author && (
                <td title={item.author}>{item.author}</td>
              )}
              {visibleColumns.borrowerId && (
                <td>
                  <button 
                    className="borrower-link"
                    onClick={() => handleBorrowerClick(item.borrowerId)}
                    title={`Vis lånerdetaljer for ${item.borrowerName || item.borrowerId}`}
                  >
                    <FiUser className="borrower-icon" />
                    <span>{item.borrowerId}</span>
                  </button>
                </td>
              )}
              {visibleColumns.readyDate && (
                <td>
                  <div className="date-cell">
                    <FiCalendar className="date-icon" />
                    <span>{item.readyDate}</span>
                  </div>
                </td>
              )}
              {visibleColumns.expiryDate && (
                <td className={
                  isDateExpired(item.expiryDate) && 
                  item.status !== 'Hentet' ? 'expired-date' : ''
                }>
                  <div className="date-cell">
                    <FiClock className="date-icon" />
                    <span>{item.expiryDate}</span>
                  </div>
                </td>
              )}
              {visibleColumns.pickedUpDate && (
                <td>
                  {item.pickedUpDate ? (
                    <div className="date-cell">
                      <FiCheckCircle className="date-icon success" />
                      <span>{item.pickedUpDate}</span>
                    </div>
                  ) : (
                    <span className="empty-cell">—</span>
                  )}
                </td>
              )}
              {visibleColumns.status && (
                <td>
                  <StatusBadge status={item.status} />
                </td>
              )}
              {visibleColumns.daysOnShelf && (
                <td className="days-cell">
                  {item.daysOnShelf !== null ? (
                    <span className="days-value">{item.daysOnShelf}</span>
                  ) : (
                    <span className="empty-cell">—</span>
                  )}
                </td>
              )}
              {visibleColumns.pickupNumber && (
                <td className="pickup-number">{item.pickupNumber}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

ReservationTable.propTypes = {
  data: PropTypes.array.isRequired,
  visibleColumns: PropTypes.object.isRequired,
  sortConfig: PropTypes.shape({
    key: PropTypes.string,
    direction: PropTypes.string
  }).isRequired,
  requestSort: PropTypes.func.isRequired,
  handleBorrowerClick: PropTypes.func.isRequired
};

export default ReservationTable;