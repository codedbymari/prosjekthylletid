import React, { useState, useEffect } from 'react';
import './ReserveringDashboard.css';
import Header from './Header';
import Sidebar from './Sidebar';
import ReportChart from './Reportchart';

function ReserveringDashboard() {
  const [statisticsView, setStatisticsView] = useState('weekly'); // 'weekly', 'monthly', 'yearly'
  const [pickupTimeLimit, setPickupTimeLimit] = useState(7); // Standard hentefrist i dager
  const [reminderDays, setReminderDays] = useState(2); // Dager før hentefrist for påminnelse
  const [materialData, setMaterialData] = useState([]);
  const [reminderLogs, setReminderLogs] = useState([]);
  const [pendingReminders, setPendingReminders] = useState(0);
  const [averagePickupTime, setAveragePickupTime] = useState(0);
  const [notPickedUpRate, setNotPickedUpRate] = useState(0);

  // Simulerte data for reserveringer
  useEffect(() => {
    // Dette ville vanligvis være en API-kall
    const mockReservations = [
      { id: 1, title: 'Sult', author: 'Knut Hamsun', reservedDate: '2025-03-05', readyDate: '2025-03-06', pickedUpDate: '2025-03-09', status: 'Hentet', daysOnShelf: 3 },
      { id: 2, title: '1984', author: 'George Orwell', reservedDate: '2025-03-06', readyDate: '2025-03-07', pickedUpDate: '2025-03-12', status: 'Hentet', daysOnShelf: 5 },
      { id: 3, title: 'Sofies verden', author: 'Jostein Gaarder', reservedDate: '2025-03-06', readyDate: '2025-03-08', pickedUpDate: null, status: 'Venter', daysOnShelf: 4 },
      { id: 4, title: 'Hobbiten', author: 'J.R.R. Tolkien', reservedDate: '2025-03-07', readyDate: '2025-03-08', pickedUpDate: '2025-03-09', status: 'Hentet', daysOnShelf: 1 },
      { id: 5, title: 'Det norske samfunn', author: 'Ivar Frønes', reservedDate: '2025-03-07', readyDate: '2025-03-09', pickedUpDate: null, status: 'Venter', daysOnShelf: 3 },
      { id: 6, title: 'Pippi Langstrømpe', author: 'Astrid Lindgren', reservedDate: '2025-03-08', readyDate: '2025-03-09', pickedUpDate: '2025-03-10', status: 'Hentet', daysOnShelf: 1 },
      { id: 7, title: 'Fuglane', author: 'Tarjei Vesaas', reservedDate: '2025-03-08', readyDate: '2025-03-10', pickedUpDate: null, status: 'Utløpt', daysOnShelf: 2 },
      { id: 8, title: 'Kristin Lavransdatter', author: 'Sigrid Undset', reservedDate: '2025-03-09', readyDate: '2025-03-11', pickedUpDate: '2025-03-15', status: 'Hentet', daysOnShelf: 4 },
      { id: 9, title: 'Doppler', author: 'Erlend Loe', reservedDate: '2025-03-10', readyDate: '2025-03-11', pickedUpDate: null, status: 'Venter', daysOnShelf: 1 },
      { id: 10, title: 'Naiv. Super', author: 'Erlend Loe', reservedDate: '2025-03-10', readyDate: '2025-03-11', pickedUpDate: null, status: 'Venter', daysOnShelf: 1 },
    ];

    // Generer påminnelser basert på materialer som nærmer seg hentefrist
    const today = new Date();
    const mockReminders = mockReservations
      .filter(res => res.status === 'Venter' && res.daysOnShelf >= (pickupTimeLimit - reminderDays))
      .map(res => ({
        id: `rem-${res.id}`,
        reservationId: res.id,
        title: res.title,
        author: res.author,
        readyDate: res.readyDate,
        expiryDate: new Date(new Date(res.readyDate).setDate(new Date(res.readyDate).getDate() + pickupTimeLimit)).toISOString().split('T')[0],
        reminderSentDate: today.toISOString().split('T')[0],
        status: 'Sendt'
      }));

    setMaterialData(mockReservations);
    setReminderLogs(mockReminders);
    setPendingReminders(mockReminders.length);

    // Beregn statistikk
    const pickedUpItems = mockReservations.filter(res => res.pickedUpDate);
    const avgDays = pickedUpItems.reduce((sum, item) => sum + item.daysOnShelf, 0) / pickedUpItems.length || 0;
    setAveragePickupTime(avgDays.toFixed(1));

    const expiredItems = mockReservations.filter(res => res.status === 'Utløpt');
    const notPickedRate = (expiredItems.length / mockReservations.length) * 100;
    setNotPickedUpRate(notPickedRate.toFixed(1));
  }, [pickupTimeLimit, reminderDays]);

  // Funksjon for å generere statistikkdata for diagrammet
  const generateChartData = () => {
    // Dette ville vanligvis være basert på faktiske data
    switch (statisticsView) {
      case 'weekly':
        return [
          { periode: 'Mandag', antallDager: 1.5, antallIkkeHentet: 5 },
          { periode: 'Tirsdag', antallDager: 2.1, antallIkkeHentet: 3 },
          { periode: 'Onsdag', antallDager: 2.8, antallIkkeHentet: 4 },
          { periode: 'Torsdag', antallDager: 3.2, antallIkkeHentet: 6 },
          { periode: 'Fredag', antallDager: 2.5, antallIkkeHentet: 4 },
          { periode: 'Lørdag', antallDager: 1.9, antallIkkeHentet: 2 },
          { periode: 'Søndag', antallDager: 1.2, antallIkkeHentet: 1 },
        ];
      case 'monthly':
        return [
          { periode: 'Januar', antallDager: 2.5, antallIkkeHentet: 15 },
          { periode: 'Februar', antallDager: 2.7, antallIkkeHentet: 18 },
          { periode: 'Mars', antallDager: 2.3, antallIkkeHentet: 12 },
          // ... flere måneder
        ];
      case 'yearly':
        return [
          { periode: '2022', antallDager: 3.2, antallIkkeHentet: 120 },
          { periode: '2023', antallDager: 2.8, antallIkkeHentet: 105 },
          { periode: '2024', antallDager: 2.5, antallIkkeHentet: 95 },
          { periode: '2025', antallDager: 2.1, antallIkkeHentet: 45 },
        ];
      default:
        return [];
    }
  };
  
  // Automatisk påminnelse funksjon
  const sendAutomaticReminders = () => {
    // Simulerer sending av påminnelser
    alert(`${pendingReminders} påminnelser er nå sendt automatisk til lånere`);
    
    // Oppdater logg
    const today = new Date().toISOString().split('T')[0];
    const remindersSent = materialData
      .filter(res => res.status === 'Venter' && res.daysOnShelf >= (pickupTimeLimit - reminderDays))
      .map(res => ({
        id: `rem-auto-${res.id}`,
        reservationId: res.id,
        title: res.title,
        author: res.author,
        readyDate: res.readyDate,
        expiryDate: new Date(new Date(res.readyDate).setDate(new Date(res.readyDate).getDate() + pickupTimeLimit)).toISOString().split('T')[0],
        reminderSentDate: today,
        status: 'Sendt automatisk'
      }));
    
    setReminderLogs([...reminderLogs, ...remindersSent]);
    setPendingReminders(0);
  };

  // Funksjon for å endre hentefristen
  const updatePickupTimeLimit = () => {
    const newLimit = window.prompt("Endre hentefrist (antall dager):", pickupTimeLimit);
    if (newLimit && !isNaN(newLimit) && newLimit > 0) {
      setPickupTimeLimit(parseInt(newLimit));
      alert(`Hentefrist er endret til ${newLimit} dager.`);
    }
  };

  // Funksjon for å endre påminnelsesdager
  const updateReminderDays = () => {
    const newDays = window.prompt("Endre påminnelse (antall dager før hentefrist):", reminderDays);
    if (newDays && !isNaN(newDays) && newDays > 0 && newDays < pickupTimeLimit) {
      setReminderDays(parseInt(newDays));
      alert(`Påminnelse vil nå sendes ${newDays} dager før hentefrist.`);
    }
  };

  return (
    <div className="app-container">
      <Header username="Jens Christian Strandos" department="Fjellhyten" role="Oslo1" />
      <div className="main-content">
        <Sidebar active="reservering" />
        <div className="content-area">
          <div className="page-header">
            <h1> Dashboard</h1>
          </div>
          
          <div className="dashboard-summary">
            <div className="stats-card">
              <h3>Gjennomsnittlig hentetid</h3>
              <div className="stats-value">{averagePickupTime} dager</div>
            </div>
            <div className="stats-card">
              <h3>Ikke hentet (%)</h3>
              <div className="stats-value">{notPickedUpRate}%</div>
            </div>
            <div className="stats-card">
              <h3>Hentefrist</h3>
              <div className="stats-value">{pickupTimeLimit} dager</div>
              <button className="btn-small" onClick={updatePickupTimeLimit}>Endre</button>
            </div>
            <div className="stats-card">
              <h3>Påminnelse før frist</h3>
              <div className="stats-value">{reminderDays} dager</div>
              <button className="btn-small" onClick={updateReminderDays}>Endre</button>
            </div>
          </div>
          
          <div className="dashboard-charts">
            <div className="chart-controls">
              <h2>Statistikk for hentetid</h2>
              <div className="view-buttons">
                <button 
                  className={statisticsView === 'weekly' ? 'active' : ''} 
                  onClick={() => setStatisticsView('weekly')}
                >
                  Ukentlig
                </button>
                <button 
                  className={statisticsView === 'monthly' ? 'active' : ''} 
                  onClick={() => setStatisticsView('monthly')}
                >
                  Månedlig
                </button>
                <button 
                  className={statisticsView === 'yearly' ? 'active' : ''} 
                  onClick={() => setStatisticsView('yearly')}
                >
                  Årlig
                </button>
              </div>
            </div>
            
            <div className="chart-container">
              <ReportChart data={generateChartData()} />
            </div>
          </div>
          
          <div className="reminders-section">
            <div className="section-header">
              <h2>Påminnelser</h2>
              <div className="pending-reminders">
                <span>Ventende påminnelser: {pendingReminders}</span>
                <button 
                  className="btn-primary" 
                  onClick={sendAutomaticReminders} 
                  disabled={pendingReminders === 0}
                >
                  Send automatiske påminnelser
                </button>
              </div>
            </div>
            
            <div className="reminder-logs">
              <h3>Påminnelseslogg</h3>
              <table className="logs-table">
                <thead>
                  <tr>
                    <th>Tittel</th>
                    <th>Forfatter</th>
                    <th>Klar dato</th>
                    <th>Utløpsdato</th>
                    <th>Påminnelse sendt</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reminderLogs.map(log => (
                    <tr key={log.id}>
                      <td>{log.title}</td>
                      <td>{log.author}</td>
                      <td>{log.readyDate}</td>
                      <td>{log.expiryDate}</td>
                      <td>{log.reminderSentDate}</td>
                      <td>{log.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="reservations-section">
            <h2>Aktive reserveringer</h2>
            <table className="reservations-table">
              <thead>
                <tr>
                  <th>Tittel</th>
                  <th>Forfatter</th>
                  <th>Reservert dato</th>
                  <th>Klar dato</th>
                  <th>Hentet dato</th>
                  <th>Dager på hylla</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {materialData.map(item => (
                  <tr key={item.id} className={item.status === 'Utløpt' ? 'expired-row' : ''}>
                    <td>{item.title}</td>
                    <td>{item.author}</td>
                    <td>{item.reservedDate}</td>
                    <td>{item.readyDate}</td>
                    <td>{item.pickedUpDate || '-'}</td>
                    <td>{item.daysOnShelf}</td>
                    <td className={`status-${item.status.toLowerCase()}`}>{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReserveringDashboard;