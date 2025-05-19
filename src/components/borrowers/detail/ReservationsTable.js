// src/components/borrowers/detail/ReservationsTable.jsx
import React from 'react';

function ReservationsTable({ reservations }) {
  return (
    <div className="table-responsive">
      <table className="reservations-table">
        <thead>
          <tr>
            <th>Tittel</th>
            <th>Forfatter</th>
            <th>Reservert dato</th>
            <th>Satt på hentehylla</th>
            <th>Hentet dato</th>
            <th>Status</th>
            <th>Dager på hylle</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map(item => (
            <tr key={item.id}>
              <td>{item.title}</td>
              <td>{item.author}</td>
              <td>{item.reservedDate}</td>
              <td>{item.readyDate}</td>
              <td>{item.pickedUpDate || "Ikke hentet"}</td>
              <td className={`status-${item.status.toLowerCase()}`}>{item.status}</td>
              <td>{item.daysOnShelf || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReservationsTable;