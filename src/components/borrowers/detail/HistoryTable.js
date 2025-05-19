// src/components/borrowers/detail/HistoryTable.jsx
import React from 'react';

function HistoryTable({ history }) {
  return (
    <div className="table-responsive">
      <table className="reservations-table">
        <thead>
          <tr>
            <th>Tittel</th>
            <th>Forfatter</th>
            <th>Lånt dato</th>
            <th>Returnert dato</th>
          </tr>
        </thead>
        <tbody>
          {history.map(item => (
            <tr key={item.id}>
              <td>{item.title}</td>
              <td>{item.author}</td>
              <td>{item.borrowedDate}</td>
              <td>{item.returnedDate || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HistoryTable;