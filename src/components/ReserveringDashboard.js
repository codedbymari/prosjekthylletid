// src/components/ReserveringDashboard.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ReserveringDashboard.css';
import ReportChart from './Reportchart';

function ReserveringDashboard() {
  const navigate = useNavigate();
  
  // State management
  const [statisticsView, setStatisticsView] = useState('weekly');
  const [pickupTimeLimit, setPickupTimeLimit] = useState(7);
  const [reminderDays, setReminderDays] = useState(2);
  const [materialData, setMaterialData] = useState([]);
  const [reminderLogs, setReminderLogs] = useState([]);
  const [pendingReminders, setPendingReminders] = useState(0);
  const [averagePickupTime, setAveragePickupTime] = useState(0);
  const [notPickedUpRate, setNotPickedUpRate] = useState(0);
  const [sentAutomaticReminders, setSentAutomaticReminders] = useState([]);
  const [showStatistics, setShowStatistics] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');


  // Check and send automatic reminders
  const checkAndSendAutomaticReminders = useCallback((reservations) => {
    const today = new Date();
    const remindersToSend = reservations
      .filter(res => {
        if (res.status !== 'Venter' || res.pickedUpDate) return false;
        const readyDate = new Date(res.readyDate);
        const expiryDate = new Date(readyDate);
        expiryDate.setDate(readyDate.getDate() + pickupTimeLimit);
        const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry === reminderDays && !sentAutomaticReminders.includes(res.id);
      })
      .map(res => ({
        id: `rem-${res.id}`,
        reservationId: res.id,
        title: res.title,
        author: res.author,
        borrowerId: res.borrowerId,
        readyDate: res.readyDate,
        expiryDate: new Date(new Date(res.readyDate).setDate(new Date(res.readyDate).getDate() + pickupTimeLimit))
                      .toISOString()
                      .split('T')[0],
        reminderSentDate: today.toISOString().split('T')[0],
        status: 'Sendt automatisk'
      }));

    if (remindersToSend.length > 0) {
      console.log("Automatiske påminnelser sendt:", remindersToSend);
      setReminderLogs(prevLogs => [...prevLogs, ...remindersToSend]);
      setSentAutomaticReminders(prev => [...prev, ...remindersToSend.map(r => r.reservationId)]);
    }
    
    const pendingCount = reservations
      .filter(res => {
        if (res.status !== 'Venter' || res.pickedUpDate) return false;
        const readyDate = new Date(res.readyDate);
        const expiryDate = new Date(readyDate);
        expiryDate.setDate(readyDate.getDate() + pickupTimeLimit);
        const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry === reminderDays + 1 && !sentAutomaticReminders.includes(res.id);
      }).length;
      
    setPendingReminders(pendingCount);
  }, [pickupTimeLimit, reminderDays, sentAutomaticReminders]);

  // Load reservation data
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call with a delay
    const fetchData = async () => {
      try {
  
        
        // Mock data 
        const mockReservations = [
          { id: 1, title: 'Sjøfareren', author: 'Erika Fatland', reservedDate: '14.03.2025', readyDate: '15.03.2025', pickedUpDate: '16.03.2025', status: 'Hentet', daysOnShelf: 2, borrowerId: 'N00123456' },
          { id: 2, title: 'Lur familiemat', author: 'Ida Gran-Jansen', reservedDate: '13.03.2025', readyDate: '14.03.2025', pickedUpDate: '17.03.2025', status: 'Hentet', daysOnShelf: 4, borrowerId: 'N00234567' },
          { id: 3, title: 'Råsterk på et år', author: 'Jørgine Massa Vasstrand', reservedDate: '15.03.2025', readyDate: '16.03.2025', pickedUpDate: null, status: 'Venter', daysOnShelf: 1, borrowerId: 'N00345678' },
          { id: 4, title: 'Tørt land', author: 'Jørn Lier Horst', reservedDate: '14.03.2025', readyDate: '15.03.2025', pickedUpDate: '16.03.2025', status: 'Hentet', daysOnShelf: 2, borrowerId: 'N00456789' },
          { id: 5, title: 'Kongen av Os', author: 'Jo Nesbø', reservedDate: '15.03.2025', readyDate: '16.03.2025', pickedUpDate: null, status: 'Venter', daysOnShelf: 1, borrowerId: 'N00567890' },
          { id: 6, title: '23 meter offside (Pondus)', author: 'Frode Øverli', reservedDate: '12.03.2025', readyDate: '13.03.2025', pickedUpDate: '14.03.2025', status: 'Hentet', daysOnShelf: 2, borrowerId: 'N00678901' },
          { id: 7, title: 'Felix har følelser', author: 'Charlotte Mjelde', reservedDate: '15.03.2025', readyDate: '16.03.2025', pickedUpDate: null, status: 'Venter', daysOnShelf: 1, borrowerId: 'N00789012' },
          { id: 8, title: 'Skriket', author: 'Jørn Lier Horst og Jan-Erik Fjell', reservedDate: '13.03.2025', readyDate: '14.03.2025', pickedUpDate: '15.03.2025', status: 'Hentet', daysOnShelf: 2, borrowerId: 'N00890123' },
          { id: 9, title: 'Juleroser', author: 'Herborg Kråkevik', reservedDate: '14.03.2025', readyDate: '15.03.2025', pickedUpDate: null, status: 'Utløpt', daysOnShelf: 1, borrowerId: 'N00901234' },
          { id: 10, title: 'Søvngjengeren', author: 'Lars Kepler', reservedDate: '10.03.2025', readyDate: '12.03.2025', pickedUpDate: null, status: 'Venter', daysOnShelf: 5, borrowerId: 'N00012345' },
        ];
      
        setMaterialData(mockReservations);
      
        // Calculate statistics
        const pickedUpItems = mockReservations.filter(res => res.pickedUpDate);
        const avgDays = pickedUpItems.reduce((sum, item) => sum + item.daysOnShelf, 0) / pickedUpItems.length || 0;
        setAveragePickupTime(avgDays.toFixed(1));
      
        const expiredItems = mockReservations.filter(res => res.status === 'Utløpt');
        const notPickedRate = (expiredItems.length / mockReservations.length) * 100;
        setNotPickedUpRate(notPickedRate.toFixed(1));
      
        // Check and send automatic reminders
        checkAndSendAutomaticReminders(mockReservations);
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching reservation data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
    
    // Adjust sidebar height (if needed)
    const adjustSidebarHeight = () => {
      const sidebar = document.querySelector('.sidebar');
      const reservationsSection = document.querySelector('.reservations-section');
      const sidebarFooter = document.querySelector('.sidebar-footer');

      if (sidebar && reservationsSection && sidebarFooter) {
        const reservationsSectionRect = reservationsSection.getBoundingClientRect();
        const sidebarRect = sidebar.getBoundingClientRect();
        const newSidebarHeight = reservationsSectionRect.bottom - sidebarRect.top;
        sidebar.style.height = `${newSidebarHeight}px`;
      }
    };

    // Set up observer for dynamic height adjustment
    const observer = new MutationObserver(adjustSidebarHeight);
    const contentArea = document.querySelector('.content-area');
    
    if (contentArea) {
      observer.observe(contentArea, {
        childList: true,
        subtree: true,
        characterData: true,
      });
      
      setTimeout(adjustSidebarHeight, 100);
    }
    
    // Cleanup
    return () => {
      if (contentArea) {
        observer.disconnect();
      }
    };
  }, [pickupTimeLimit, reminderDays, checkAndSendAutomaticReminders]);

  // Send reminders manually
  const sendAutomaticReminders = () => {
    const today = new Date();
    const remindersToSend = materialData
      .filter(res => {
        if (res.status !== 'Venter' || res.pickedUpDate) return false;
        const readyDate = new Date(res.readyDate);
        const expiryDate = new Date(readyDate);
        expiryDate.setDate(readyDate.getDate() + pickupTimeLimit);
        const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry <= reminderDays + 1 && !sentAutomaticReminders.includes(res.id);
      })
      .map(res => ({
        id: `rem-manual-${res.id}`,
        reservationId: res.id,
        title: res.title,
        author: res.author,
        borrowerId: res.borrowerId,
        readyDate: res.readyDate,
        expiryDate: new Date(new Date(res.readyDate).setDate(new Date(res.readyDate).getDate() + pickupTimeLimit))
                      .toISOString()
                      .split('T')[0],
        reminderSentDate: today.toISOString().split('T')[0],
        status: 'Sendt manuelt'
      }));
    
    if (remindersToSend.length > 0) {
      setReminderLogs(prevLogs => [...prevLogs, ...remindersToSend]);
      setSentAutomaticReminders(prev => [...prev, ...remindersToSend.map(r => r.reservationId)]);
      setPendingReminders(0);
    } else {
      console.log('Ingen ventende påminnelser å sende.');
    }
  };

  // Generate chart data based on selected statistics view
  const generateChartData = () => {
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

  // Export chart data to CSV
  const exportChartData = () => {
    // Create CSV content
    const csvRows = [];
    
    // Section 1: Summary statistics
    csvRows.push('# OPPSUMMERENDE STATISTIKK');
    csvRows.push(`Gjennomsnittlig hentetid,${averagePickupTime} dager`);
    csvRows.push(`Andel ikke-hentet materiale,${notPickedUpRate}%`);
    csvRows.push(`Hentefrist,${pickupTimeLimit} dager`);
    csvRows.push(`Påminnelse sendes,${reminderDays} dager før frist`);
    csvRows.push('');
    
    // Section 2: Chart data
    csvRows.push('# AGGREGERT STATISTIKK');
    const chartData = generateChartData();
    if (chartData.length > 0) {
      const chartHeaders = Object.keys(chartData[0]);
      csvRows.push(chartHeaders.join(','));
      chartData.forEach(row => {
        const values = chartHeaders.map(header => row[header]);
        csvRows.push(values.join(','));
      });
    }
    csvRows.push('');
    
    // Section 3: Detailed reservation information
    csvRows.push('# DETALJERT RESERVASJONSINFORMASJON');
    if (materialData.length > 0) {
      csvRows.push('ID,Tittel,Forfatter,Lånernummer,Reservert dato,Klar dato,Hentet dato,Status,Dager på hylle');
      materialData.forEach(item => {
        csvRows.push([
          item.id,
          `"${item.title}"`,
          `"${item.author}"`,
          item.borrowerId,
          item.reservedDate,
          item.readyDate,
          item.pickedUpDate || '',
          item.status,
          item.daysOnShelf
        ].join(','));
      });
    }
    csvRows.push('');
    
    // Section 4: Reminder logs
    csvRows.push('# PÅMINNELSESLOGG');
    if (reminderLogs.length > 0) {
      csvRows.push('ID,Tittel,Forfatter,Lånernummer,Klar dato,Utløpsdato,Påminnelse sendt,Status');
      reminderLogs.forEach(log => {
        csvRows.push([
          log.id,
          `"${log.title}"`,
          `"${log.author}"`,
          log.borrowerId,
          log.readyDate,
          log.expiryDate,
          log.reminderSentDate,
          log.status
        ].join(','));
      });
    }
    
    // Create and download CSV file
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `bibliotek-reservasjonsdata-${timestamp}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Update pickup time limit
  const updatePickupTimeLimit = () => {
    const newLimit = window.prompt("Endre hentefrist (antall dager):", pickupTimeLimit);
    if (newLimit && !isNaN(newLimit) && newLimit > 0) {
      setPickupTimeLimit(parseInt(newLimit));
      alert(`Hentefrist er endret til ${newLimit} dager.`);
    }
  };

  // Update reminder days
  const updateReminderDays = () => {
    const newDays = window.prompt("Endre påminnelse (antall dager før hentefrist):", reminderDays);
    if (newDays && !isNaN(newDays) && newDays > 0 && newDays < pickupTimeLimit) {
      setReminderDays(parseInt(newDays));
      alert(`Påminnelse vil nå sendes ${newDays} dager før hentefrist.`);
    }
  };

  // Check for reminders periodically
  useEffect(() => {
    const checkTimer = setTimeout(() => {
      checkAndSendAutomaticReminders(materialData);
    }, 1000);
    return () => clearTimeout(checkTimer);
  }, [materialData, reminderDays, pickupTimeLimit, sentAutomaticReminders, checkAndSendAutomaticReminders]);

  // Filter and search functionality
  const filteredMaterialData = useMemo(() => {
    return materialData.filter(item => {
      // Filter by status
      if (filterStatus !== 'all' && item.status.toLowerCase() !== filterStatus) {
        return false;
      }
      
      // Filter by search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          item.title.toLowerCase().includes(searchLower) ||
          item.author.toLowerCase().includes(searchLower) ||
          item.borrowerId.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    });
  }, [materialData, filterStatus, searchTerm]);

  // Navigate to borrower details
  const handleBorrowerClick = (borrowerId) => {
    navigate(`/låner/${borrowerId}`);
  };

  return (
   <div className="dashboard-wrapper">
      <div className="page-header">
        <h1>Reserveringer Dashboard</h1>
      </div>
      
      {isLoading ? (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Laster inn reservasjonsdata...</p>
        </div>
      ) : (
        <>
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

          {/* Statistics controls */}
          <div className="statistics-controls">
            <div className="controls-container">
              <div className="select-wrapper">
                <label htmlFor="showStatistics">Vis statistikk for hentetid: </label>
                <select
                  id="showStatistics"
                  value={showStatistics ? 'show' : 'hide'}
                  onChange={(e) => setShowStatistics(e.target.value === 'show')}
                  className="styled-select"
                >
                  <option value="show">Vis</option>
                  <option value="hide">Skjul</option>
                </select>
              </div>
              <button className="btn-export" onClick={exportChartData}>
                <span className="export-icon">⬇</span>
                Eksporter data
              </button>
            </div>
          </div>
          
          {/* Conditionally render chart section */}
          {showStatistics && (
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
          )}
        
          <div className="reservations-section">
            <div className="section-header">
              <h2>Aktive reserveringer</h2>
              <div className="action-buttons">
                {pendingReminders > 0 && (
                  <button 
                    className="btn-primary" 
                    onClick={sendAutomaticReminders}
                  >
                    Send {pendingReminders} påminnelser
                  </button>
                )}
                <button className="btn-primary">Ny reservering</button>
              </div>
            </div>
            
            <div className="filter-controls">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Søk etter tittel, forfatter eller lånernummer"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              
              <div className="filter-container">
                <label htmlFor="statusFilter">Status:</label>
                <select
                  id="statusFilter"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="styled-select"
                >
                  <option value="all">Alle</option>
                  <option value="venter">Venter</option>
                  <option value="hentet">Hentet</option>
                  <option value="utløpt">Utløpt</option>
                </select>
              </div>
            </div>
            
            {filteredMaterialData.length > 0 ? (
              <table className="reservations-table">
                <thead>
                  <tr>
                    <th>Tittel</th>
                    <th>Forfatter</th>
                    <th>Lånernummer</th>
                    <th>Reservert dato</th>
                    <th>Klar dato</th>
                    <th>Hentet dato</th>
                    <th>Status</th>
                    <th>Handlinger</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMaterialData.map(item => (
                    <tr key={item.id} className={item.status === 'Utløpt' ? 'expired-row' : ''}>
                      <td>{item.title}</td>
                      <td>{item.author}</td>
                      <td>
                        <Link to={`/låner/${item.borrowerId}`}>{item.borrowerId}</Link>
                      </td>
                      <td>{item.reservedDate}</td>
                      <td>{item.readyDate}</td>
                      <td>{item.pickedUpDate || '-'}</td>
                      <td className={`status-${item.status.toLowerCase()}`}>{item.status}</td>
                      <td>
                        <div className="action-buttons-cell">
                          <button 
                            className="btn-small"
                            onClick={() => handleBorrowerClick(item.borrowerId)}
                          >
                            Vis låner
                          </button>
                          {item.status === 'Venter' && (
                            <button className="btn-small">Merk hentet</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-data-message">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Ingen reserveringer matcher søkekriteriene' 
                  : 'Ingen aktive reserveringer'}
              </div>
            )}
          </div>
          
          {reminderLogs.length > 0 && (
            <div className="reminders-section">
              <h2>Påminnelseslogg</h2>
              <table className="logs-table">
                <thead>
                  <tr>
                    <th>Tittel</th>
                    <th>Forfatter</th>
                    <th>Lånernummer</th>
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
                      <td>
                        <Link to={`/låner/${log.borrowerId}`}>{log.borrowerId}</Link>
                      </td>
                      <td>{log.expiryDate}</td>
                      <td>{log.reminderSentDate}</td>
                      <td>{log.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ReserveringDashboard;