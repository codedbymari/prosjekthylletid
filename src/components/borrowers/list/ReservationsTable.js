import React from 'react';
import { Link } from 'react-router-dom';
import LoadingIndicator from '../common/LoadingIndicator';
import NoDataMessage from '../common/NoDataMessage.js';
import '../BorrowerDashboard.css';

function ReservationsTable({ reservations, isLoading }) {
  // Import utility functions
  const { formatDate, calculateDaysBetween } = require('../utils/formatUtils');

  return (
    <div className="table-responsive">
      <table className="borrowers-table">
        <thead>
          <tr>
            <th>Tittel</th>
            <th>Forfatter</th>
            <th>Låner</th>
            <th>Klar dato</th>
            <th>Hentefrist</th>
            <th>Hentet dato</th>
            <th>Status</th>
            <th>Dager</th>
            <th>Hentenr.</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="9" className="loading-cell">
                <LoadingIndicator message="Laster data..." />
              </td>
            </tr>
          ) : reservations.length > 0 ? (
            reservations.map((reservation) => {
              // Beregn dager mellom klar dato og hentet dato, eller dagens dato hvis ikke hentet
              const days = reservation.pickedUpDate ? 
                calculateDaysBetween(reservation.readyDate, reservation.pickedUpDate) : 
                calculateDaysBetween(reservation.readyDate, new Date().toISOString());
              
              return (
                <tr key={reservation.id}>
                  <td>{reservation.title}</td>
                  <td>{reservation.author}</td>
                  <td>
                    <Link to={`/laaner/${reservation.borrower.id}`} className="borrower-link">
                      {reservation.borrower.id}
                    </Link>
                  </td>
                  <td>{formatDate(reservation.readyDate)}</td>
                  <td>{formatDate(reservation.reservedDate)}</td>
                  <td>{formatDate(reservation.pickedUpDate) || '—'}</td>
                  <td className={`status-${reservation.status.toLowerCase()}`}>{reservation.status}</td>
                  <td>{days || '—'}</td>
                  <td>{reservation.pickupNumber}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="9" className="no-data-cell">
                <NoDataMessage message="Ingen resultater funnet" />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ReservationsTable;