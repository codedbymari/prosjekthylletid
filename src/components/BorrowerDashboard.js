// src/components/BorrowerDashboard.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './BorrowerDashboard.css';

function BorrowerDashboard() {
  const { borrowerId } = useParams();
  const [activeTab, setActiveTab] = useState('reservations');
  const [borrowerInfo, setBorrowerInfo] = useState({});
  const [borrowerReservations, setBorrowerReservations] = useState([]);
  const [borrowerHistory, setBorrowerHistory] = useState([]);
  const [borrowerMessages, setBorrowerMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with loading state
    setIsLoading(true);
    
    // Simulate network delay for realistic UX
    const fetchTimer = setTimeout(() => {
      setBorrowerInfo({
        name: "Hanna Nguyen",
        membership: "Aktiv",
        contact: "Hanna.Nguyen@gmail.com",
        mobil: "+47 92345678"
      });

      // Mock data
      setBorrowerReservations([
        { id: 10, title: 'Søvngjengeren', author: 'Lars Kepler', reservedDate: '10.03.2025', readyDate: '12.03.2025', pickedUpDate: null, status: 'Venter', daysOnShelf: 5, borrowerId },
      ]);

      setBorrowerHistory([
        { id: 8, title: 'Skriket', author: 'Jørn Lier Horst', borrowedDate: '10.01.2025', returnedDate: '29.01.2025' },
      ]);

      setBorrowerMessages([
        { 
          id: 'msg2', 
          date: '17.03.2025', 
          subject: 'Påminnelse om reservering',
          message: 'Hei, Hanna Nguyen. Det er 2 dager igjen av hentefristen på din reservering: «Søvngjengeren» av Lars Kepler. Siste frist: 18.03.2025. Hylle: 23B. Velkommen innom! Hilsen Nordre Follo Bibliotek',
          sentVia: ['melding', 'epost']
        },
        { 
          id: 'msg1', 
          date: '26.01.2025', 
          subject: 'Forsinket innlevering',
          message: 'Hei, Hanna Nguyen. Boken «Skriket» av Jørn Lier Horst skulle vært levert 20.01.2025 og er nå 6 dager forsinket. Lever snarest for å unngå purregebyr på 100 kr. Hilsen Nordre Follo Bibliotek.',
          sentVia: ['melding', 'epost']
        }
      ]);
      
      setIsLoading(false);
    }, 600);
    
    // Clean up timer on component unmount
    return () => clearTimeout(fetchTimer);
  }, [borrowerId]);

  return (
    <div className="borrower-dashboard-wrapper">
      {isLoading ? (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Laster lånerinformasjon...</p>
        </div>
      ) : (
        <>
          <div className="page-header">
            <h1>Låner: {borrowerId || 'N00123456'}</h1>
          </div>
          
          {/* Borrower Info Section */}
          <div className="borrower-info-card">
            <div className="borrower-info-header">
              <h2>Lånerinformasjon</h2>
            </div>
            <div className="borrower-info-content">
              <div className="info-item">
                <span className="info-label">Navn:</span>
                <span className="info-value">{borrowerInfo.name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Medlemskap:</span>
                <span className="info-value membership-badge">{borrowerInfo.membership}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Epost:</span>
                <span className="info-value">{borrowerInfo.contact}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Mobil:</span>
                <span className="info-value">{borrowerInfo.mobil}</span>
              </div>
            </div>
          </div>

          <div className="tab-navigation">
            <button 
              onClick={() => setActiveTab('reservations')} 
              className={activeTab === 'reservations' ? 'active' : ''}
            >
              Reservasjoner
            </button>
            <button 
              onClick={() => setActiveTab('history')} 
              className={activeTab === 'history' ? 'active' : ''}
            >
              Historikk
            </button>
            <button 
              onClick={() => setActiveTab('messages')} 
              className={activeTab === 'messages' ? 'active' : ''}
            >
              Meldinger
            </button>
          </div>

          {activeTab === 'reservations' && (
            <div className="table-responsive">
              {borrowerReservations.length > 0 ? (
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
                    {borrowerReservations.map(item => (
                      <tr key={item.id}>
                        <td>{item.title}</td>
                        <td>{item.author}</td>
                        <td>{item.reservedDate}</td>
                        <td>{item.readyDate}</td>
                        <td>{item.pickedUpDate || "Ikke hentet"}</td>
                        <td className={`status-${item.status.toLowerCase()}`}>{item.status}</td>                        <td>{item.daysOnShelf}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="no-data-message">
                  Ingen aktive reservasjoner
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="table-responsive">
              {borrowerHistory.length > 0 ? (
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
                    {borrowerHistory.map(item => (
                      <tr key={item.id}>
                        <td>{item.title}</td>
                        <td>{item.author}</td>
                        <td>{item.borrowedDate}</td>
                        <td>{item.returnedDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="no-data-message">
                  Ingen lånehistorikk
                </div>
              )}
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="message-container">
              {borrowerMessages.length > 0 ? (
                borrowerMessages.map(msg => (
                  <div key={msg.id} className="email-message">
                    <div className="email-header">
                      <div className="email-meta">
                        <div className="email-date">{msg.date}</div>
                        <div className="email-subject">{msg.subject}</div>
                      </div>
                      <div className="message-delivery-info">
                        Sendt via: {msg.sentVia.join(' og ')}
                      </div>
                    </div>
                    <div className="email-body">
                      {msg.message}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-data-message">
                  Ingen meldinger
                </div>
              )}
            </div>
          )}

          <div className="navigation-link">
            <Link to="/låner">← Tilbake til låneroversikt</Link>
          </div>
        </>
      )}
    </div>
  );
}

export default BorrowerDashboard;