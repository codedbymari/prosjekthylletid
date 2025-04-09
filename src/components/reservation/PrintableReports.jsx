// src/components/reservation/PrintableReports.jsx
import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import './PrintableReports.css';

function PrintableReports({ materialData, reminderLogs, statistics, pickupTimeLimit, reminderDays }) {
  const printContentRef = useRef(null);
  const currentDate = new Date().toLocaleDateString('no-NO', { 
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
  });

  return (
    <div className="printable-content" ref={printContentRef}>
      {/* Reservasjonsrapport*/}
      <div className="print-only print-report reservation-report">
        <div className="print-header">
          <h1>Reservasjonsrapport</h1>
          <p className="print-date">Generert: {currentDate}</p>
        </div>
        
        <div className="print-summary">
          <div className="print-summary-item">
            <h3>Totalt antall reservasjoner</h3>
            <p>{materialData.length}</p>
          </div>
          <div className="print-summary-item">
            <h3>Venter på henting</h3>
            <p>{materialData.filter(item => item.status === 'Venter').length}</p>
          </div>
          <div className="print-summary-item">
            <h3>Hentet</h3>
            <p>{materialData.filter(item => item.status === 'Hentet').length}</p>
          </div>
          <div className="print-summary-item">
            <h3>Utløpt</h3>
            <p>{materialData.filter(item => item.status === 'Utløpt').length}</p>
          </div>
        </div>
        
        <table className="print-table">
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
            {materialData.map(item => (
              <tr key={`print-${item.id}`} className={`status-${item.status.toLowerCase()}-row`}>
                <td>{item.title}</td>
                <td>{item.author}</td>
                <td>{item.borrowerId}</td>
                <td>{item.readyDate}</td>
                <td>{item.expiryDate}</td>
                <td>{item.pickedUpDate || '—'}</td>
                <td>{item.status}</td>
                <td>{item.daysOnShelf !== null ? item.daysOnShelf : '—'}</td>
                <td>{item.pickupNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Statistikkrapport */}
      <div className="print-only print-report statistics-report">
        <div className="print-header">
          <h1>Statistikkrapport</h1>
          <p className="print-date">Generert: {currentDate}</p>
        </div>
        
        <div className="print-summary">
          <div className="print-summary-item">
            <h3>Gjennomsnittlig hentetid</h3>
            <p>{statistics.averagePickupTime} dager</p>
          </div>
          <div className="print-summary-item">
            <h3>Ikke-hentet materiale</h3>
            <p>{statistics.notPickedUpRate}%</p>
          </div>
          <div className="print-summary-item">
            <h3>Hentefrist</h3>
            <p>{pickupTimeLimit} dager</p>
          </div>
          <div className="print-summary-item">
            <h3>Påminnelse sendes</h3>
            <p>{reminderDays} dager før frist</p>
          </div>
        </div>
        
        <div className="print-chart-data">
          <h2>Detaljert statistikk</h2>
          <p>For detaljert statistikk, se eksportert CSV-fil.</p>
        </div>
      </div>
      
      {/* Påminnelseslogg */}
      <div className="print-only print-report reminder-report">
        <div className="print-header">
          <h1>Påminnelseslogg</h1>
          <p className="print-date">Generert: {currentDate}</p>
        </div>
        
        <div className="print-summary">
          <div className="print-summary-item">
            <h3>Totalt antall påminnelser</h3>
            <p>{reminderLogs.length}</p>
          </div>
          <div className="print-summary-item">
            <h3>Automatiske påminnelser</h3>
            <p>{reminderLogs.filter(log => log.status === 'Sendt automatisk').length}</p>
          </div>
          <div className="print-summary-item">
            <h3>Manuelle påminnelser</h3>
            <p>{reminderLogs.filter(log => log.status === 'Sendt manuelt').length}</p>
          </div>
        </div>
        
        {reminderLogs.length > 0 ? (
          <table className="print-table">
            <thead>
              <tr>
                <th>Tittel</th>
                <th>Forfatter</th>
                <th>Låner</th>
                <th>Klar dato</th>
                <th>Hentefrist</th>
                <th>Påminnelse sendt</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {reminderLogs.map(log => (
                <tr key={`reminder-${log.id}`}>
                  <td>{log.title}</td>
                  <td>{log.author}</td>
                  <td>{log.borrowerId}</td>
                  <td>{log.readyDate}</td>
                  <td>{log.expiryDate}</td>
                  <td>{log.reminderSentDate}</td>
                  <td>{log.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="print-no-data">
            <p>Ingen påminnelser er sendt ennå.</p>
          </div>
        )}
      </div>
    </div>
  );
}

PrintableReports.propTypes = {
  materialData: PropTypes.array.isRequired,
  reminderLogs: PropTypes.array.isRequired,
  statistics: PropTypes.shape({
    averagePickupTime: PropTypes.string.isRequired,
    notPickedUpRate: PropTypes.string.isRequired,
    pendingReminders: PropTypes.number.isRequired
  }).isRequired,
  pickupTimeLimit: PropTypes.number.isRequired,
  reminderDays: PropTypes.number.isRequired
};

export default PrintableReports;