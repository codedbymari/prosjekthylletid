import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './ReserveringDashboard.css';
import ReportChart from './Reportchart';
import { generateMockData } from '../mockData';
import { 
  FiSettings, FiDownload, FiSearch, FiFilter, FiChevronDown, 
  FiChevronUp, FiX, FiUser, FiBook, FiCalendar, FiClock, 
  FiCheckCircle, FiAlertCircle, FiGrid, FiList, FiEye, FiEyeOff,
  FiArrowUp, FiArrowDown, FiInfo, FiMail
} from 'react-icons/fi';

// Constants for filter values
const FILTER_STATUSES = {
  ALL: 'all',
  WAITING: 'venter',
  PICKED_UP: 'hentet',
  EXPIRED: 'utløpt'
};

// Helper functions
const formatDateNorwegian = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
};

const parseNorwegianDate = (dateString) => {
  if (!dateString) return null;
  const parts = dateString.split('.');
  if (parts.length !== 3) return null;
  return new Date(parts[2], parts[1] - 1, parts[0]);
};

const calculateDaysBetween = (startDate, endDate) => {
  if (!startDate || !endDate) return null;
  const start = parseNorwegianDate(startDate);
  const end = parseNorwegianDate(endDate);
  if (!start || !end) return null;
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

function ReserveringDashboard() {
  const navigate = useNavigate();
  
  // UI state
  const [showStatistics, setShowStatistics] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [statisticsView, setStatisticsView] = useState('weekly');
  const [columnMenuOpen, setColumnMenuOpen] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [viewMode, setViewMode] = useState('table');
  
  // Settings state
  const [pickupTimeLimit, setPickupTimeLimit] = useState(7);
  const [reminderDays, setReminderDays] = useState(2);
  
  // Data state
  const [materialData, setMaterialData] = useState([]);
  const [reminderLogs, setReminderLogs] = useState([]);
  const [sentAutomaticReminders, setSentAutomaticReminders] = useState([]);
  
  // Statistics state
  const [pendingReminders, setPendingReminders] = useState(0);
  const [averagePickupTime, setAveragePickupTime] = useState(0);
  const [notPickedUpRate, setNotPickedUpRate] = useState(0);
  
  // Filtering and sorting state
  const [filterStatus, setFilterStatus] = useState(FILTER_STATUSES.ALL);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'readyDate', direction: 'desc' });
  
  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState({
    title: true,
    author: true,
    borrowerId: true,
    reservedDate: false,
    readyDate: true,
    expiryDate: true,
    pickedUpDate: true,
    status: true,
    daysOnShelf: true,
    pickupNumber: true,
    actions: false
  });

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: '', type: 'success' }), 3000);
  };

  // Safety timeout to prevent stuck loading state
  useEffect(() => {
    if (isLoading) {
      const safetyTimer = setTimeout(() => {
        setIsLoading(false);
      }, 5000);
      return () => clearTimeout(safetyTimer);
    }
  }, [isLoading]);

  // Calculate expiry date based on ready date and pickup time limit
  const calculateExpiryDate = useCallback((readyDate) => {
    if (!readyDate) return null;
    const date = parseNorwegianDate(readyDate);
    if (!date) return null;
    
    date.setDate(date.getDate() + pickupTimeLimit);
    return formatDateNorwegian(date);
  }, [pickupTimeLimit]);

  // Check and send automatic reminders
  const checkAndSendAutomaticReminders = useCallback((reservations) => {
    const today = new Date();
    
    // Find reservations that need reminders
    const remindersToSend = reservations
      .filter(res => {
        if (res.status !== 'Venter' || res.pickedUpDate) return false;
        
        const readyDate = parseNorwegianDate(res.readyDate);
        if (!readyDate) return false;
        
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
        borrowerName: res.borrowerName,
        readyDate: res.readyDate,
        expiryDate: res.expiryDate,
        reminderSentDate: formatDateNorwegian(today),
        status: 'Sendt automatisk'
      }));

    // Update state if reminders were sent
    if (remindersToSend.length > 0) {
      setReminderLogs(prevLogs => [...prevLogs, ...remindersToSend]);
      setSentAutomaticReminders(prev => [...prev, ...remindersToSend.map(r => r.reservationId)]);
      showToast(`${remindersToSend.length} automatiske påminnelser har blitt sendt.`, 'info');
    }
    
    // Calculate pending reminders for tomorrow
    const pendingCount = reservations
      .filter(res => {
        if (res.status !== 'Venter' || res.pickedUpDate) return false;
        
        const readyDate = parseNorwegianDate(res.readyDate);
        if (!readyDate) return false;
        
        const expiryDate = new Date(readyDate);
        expiryDate.setDate(readyDate.getDate() + pickupTimeLimit);
        
        const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry === reminderDays + 1 && !sentAutomaticReminders.includes(res.id);
      }).length;
    
    setPendingReminders(pendingCount);
  }, [pickupTimeLimit, reminderDays, sentAutomaticReminders]);

// ReserveringDashboard.js - continued

  // Load reservation data
  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // Simulate API call with a delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Get mock data from separate file
        const mockReservations = generateMockData();

        // Process the reservation data
        const processedReservations = mockReservations.map(item => {
          // Format dates in Norwegian format
          const readyDateFormatted = formatDateNorwegian(item.readyDate);
          const pickedUpDateFormatted = item.pickedUpDate ? formatDateNorwegian(item.pickedUpDate) : null;
          const reservedDateFormatted = formatDateNorwegian(item.reservedDate);
          
          // Calculate days on shelf (for picked up items)
          const daysOnShelf = item.pickedUpDate ? 
            calculateDaysBetween(readyDateFormatted, pickedUpDateFormatted) : null;
          
          // Calculate expiry date (hentefrist)
          const expiryDate = calculateExpiryDate(readyDateFormatted);
          
          return {
            id: item.id,
            title: item.title,
            author: item.author,
            borrowerId: item.borrower.id,
            borrowerName: item.borrower.name,
            borrowerEmail: item.borrower.email,
            borrowerPhone: item.borrower.phone,
            reservedDate: reservedDateFormatted,
            readyDate: readyDateFormatted,
            pickedUpDate: pickedUpDateFormatted,
            status: item.status.charAt(0) + item.status.slice(1).toLowerCase(), // Convert "HENTET" to "Hentet"
            pickupNumber: item.pickupNumber,
            expiryDate: expiryDate,
            daysOnShelf: daysOnShelf
          };
        });
        
        // Only update state if component is still mounted
        if (isMounted) {
          setMaterialData(processedReservations);
          
          // Calculate statistics
          const pickedUpItems = processedReservations.filter(res => res.pickedUpDate);
          const avgDays = pickedUpItems.reduce((sum, item) => sum + item.daysOnShelf, 0) / pickedUpItems.length || 0;
          setAveragePickupTime(avgDays.toFixed(1));
          
          const expiredItems = processedReservations.filter(res => res.status === 'Utløpt');
          const notPickedRate = (expiredItems.length / processedReservations.length) * 100;
          setNotPickedUpRate(notPickedRate.toFixed(1));
          
          // Initial reminder logs
          const initialReminderLogs = [
            {
              id: 'rem-history-1',
              reservationId: 3,
              title: 'Råsterk på et år',
              author: 'Jørgine Massa Vasstrand',
              borrowerId: 'N00345678',
              borrowerName: 'Petter Hansen',
              readyDate: processedReservations.find(r => r.id === 3).readyDate,
              expiryDate: processedReservations.find(r => r.id === 3).expiryDate,
              reminderSentDate: formatDateNorwegian(new Date(Date.now() - 86400000)), // Yesterday
              status: 'Sendt automatisk'
            }
          ];
          
          setReminderLogs(initialReminderLogs);
          setSentAutomaticReminders([3]); // Mark that we've sent a reminder for item #3
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching reservation data:", error);
        if (isMounted) {
          setIsLoading(false);
          showToast("Kunne ikke laste inn data. Prøv igjen senere.", "error");
        }
      }
    };

    fetchData();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [calculateExpiryDate]);

  // Separate effect for checking reminders
  useEffect(() => {
    // Only run this effect when data is loaded and we're not in loading state
    if (!isLoading && materialData.length > 0) {
      // Check reminders once
      checkAndSendAutomaticReminders(materialData);
      
      // Set up interval for periodic checks (every 30 seconds)
      const checkTimer = setInterval(() => {
        checkAndSendAutomaticReminders(materialData);
      }, 30000);
      
      // Cleanup
      return () => {
        clearInterval(checkTimer);
      };
    }
  }, [isLoading, materialData, checkAndSendAutomaticReminders]);

  // Send reminders manually
  const sendAutomaticReminders = () => {
    const today = new Date();
    const remindersToSend = materialData
      .filter(res => {
        if (res.status !== 'Venter' || res.pickedUpDate) return false;
        
        const readyDate = parseNorwegianDate(res.readyDate);
        if (!readyDate) return false;
        
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
        borrowerName: res.borrowerName,
        readyDate: res.readyDate,
        expiryDate: res.expiryDate,
        reminderSentDate: formatDateNorwegian(today),
        status: 'Sendt manuelt'
      }));
    
    if (remindersToSend.length > 0) {
      setReminderLogs(prevLogs => [...prevLogs, ...remindersToSend]);
      setSentAutomaticReminders(prev => [...prev, ...remindersToSend.map(r => r.reservationId)]);
      setPendingReminders(0);
      showToast(`${remindersToSend.length} påminnelser har blitt sendt.`, 'success');
    } else {
      showToast('Ingen ventende påminnelser å sende.', 'info');
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
          { periode: 'April', antallDager: 2.1, antallIkkeHentet: 14 },
          { periode: 'Mai', antallDager: 1.9, antallIkkeHentet: 13 },
          { periode: 'Juni', antallDager: 2.0, antallIkkeHentet: 10 },
        ];
      case 'yearly':
        return [
          { periode: '2022', antallDager: 3.2, antallIkkeHentet: 120 },
          { periode: '2023', antallDager: 2.8, antallIkkeHentet: 105 },
          { periode: '2024', antallDager: 2.5, antallIkkeHentet: 95 },
          { periode: (new Date()).getFullYear().toString(), antallDager: 2.1, antallIkkeHentet: 45 },
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
      csvRows.push('ID,Tittel,Forfatter,Lånernummer,Reservert dato,Klar dato,Hentefrist,Hentet dato,Status,Dager på hylle,Hentenummer');
      materialData.forEach(item => {
        csvRows.push([
          item.id,
          `"${item.title}"`,
          `"${item.author}"`,
          item.borrowerId,
          item.reservedDate,
          item.readyDate,
          item.expiryDate,
          item.pickedUpDate || '',
          item.status,
          item.daysOnShelf || '',
          item.pickupNumber
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
    
    showToast('Eksport fullført. Filen er lastet ned.', 'success');
  };

  // Update pickup time limit
  const updatePickupTimeLimit = () => {
    const newLimit = window.prompt("Endre hentefrist (antall dager):", pickupTimeLimit);
    if (newLimit && !isNaN(newLimit) && parseInt(newLimit) > 0) {
      const newLimitValue = parseInt(newLimit);
      setPickupTimeLimit(newLimitValue);
      
      // Update the expiry dates for all items
      setMaterialData(prevData => 
        prevData.map(item => ({
          ...item,
          expiryDate: calculateExpiryDate(item.readyDate)
        }))
      );
      
      showToast(`Hentefrist er endret til ${newLimitValue} dager.`, 'success');
    }
  };

  // Update reminder days
  const updateReminderDays = () => {
    const newDays = window.prompt("Endre påminnelse (antall dager før hentefrist):", reminderDays);
    if (newDays && !isNaN(newDays)) {
      const newDaysValue = parseInt(newDays);
      if (newDaysValue > 0 && newDaysValue < pickupTimeLimit) {
        setReminderDays(newDaysValue);
        showToast(`Påminnelse vil nå sendes ${newDaysValue} dager før hentefrist.`, 'success');
      } else if (newDaysValue >= pickupTimeLimit) {
        showToast(`Påminnelsesdager må være mindre enn hentefristen (${pickupTimeLimit} dager).`, 'error');
      }
    }
  };

  // Sort handler for table columns
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Toggle column visibility
  const toggleColumnVisibility = (column) => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  // Filter and search functionality with sorting
  const filteredAndSortedData = useMemo(() => {
    // First filter the data
    const filteredData = materialData.filter(item => {
      // Filter by status
      if (filterStatus !== FILTER_STATUSES.ALL && item.status.toLowerCase() !== filterStatus) {
        return false;
      }
      
      // Filter by search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          item.title.toLowerCase().includes(searchLower) ||
          item.author.toLowerCase().includes(searchLower) ||
          item.borrowerId.toLowerCase().includes(searchLower) ||
          (item.borrowerName && item.borrowerName.toLowerCase().includes(searchLower)) ||
          (item.pickupNumber && item.pickupNumber.toLowerCase().includes(searchLower))
        );
      }
      
      return true;
    });
    
    // Then sort the filtered data
    if (sortConfig.key) {
      return [...filteredData].sort((a, b) => {
        // Handle null values
        if (a[sortConfig.key] === null) return 1;
        if (b[sortConfig.key] === null) return -1;
        if (a[sortConfig.key] === b[sortConfig.key]) return 0;
        
        // Sort by numeric or string value
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        // For dates, convert to Date objects
        if (sortConfig.key.includes('Date')) {
          const dateA = parseNorwegianDate(aValue);
          const dateB = parseNorwegianDate(bValue);

          return sortConfig.direction === 'asc' 
            ? dateA - dateB 
            : dateB - dateA;
        }
        
        // For numeric values like daysOnShelf
        if (sortConfig.key === 'daysOnShelf' && aValue !== null && bValue !== null) {
          return sortConfig.direction === 'asc'
            ? aValue - bValue
            : bValue - aValue;
        }
        
        // For strings
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      });
    }

    return filteredData;
  }, [materialData, filterStatus, searchTerm, sortConfig]);

  // Navigate to borrower details
  const handleBorrowerClick = (borrowerId) => {
    navigate(`/låner/${borrowerId}`);
    showToast(`Navigerer til lånerdetaljer for: ${borrowerId}`, 'info');
  };

  // Render sort indicator
  const renderSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return (
      <span className="sort-indicator">
        {sortConfig.direction === 'asc' ? <FiArrowUp /> : <FiArrowDown />}
      </span>
    );
  };

  return (
    <div className="dashboard-wrapper">
      {/* Modern page header with gradient */}
      <div className="page-header">
        <div className="header-content">
          <h1>Reserveringer Dashboard</h1>
          <div className="header-actions">
            {pendingReminders > 0 && (
              <button 
                className="btn-notify" 
                onClick={sendAutomaticReminders}
                aria-label={`Send ${pendingReminders} ventende påminnelser`}
              >
                <FiMail className="icon" />
                Send påminnelser
                <span className="badge">{pendingReminders}</span>
              </button>
            )}
            <button 
              className="btn-settings"
              onClick={() => setShowSettings(!showSettings)}
              aria-expanded={showSettings}
              aria-controls="settings-panel"
            >
              <FiSettings className="icon" />
              Innstillinger
            </button>
          </div>
        </div>
      </div>
      
      {toast.visible && (
        <div className={`toast toast-${toast.type}`} role="alert">
          <div className="toast-content">
            <span className="toast-icon">
              {toast.type === 'success' ? <FiCheckCircle /> : 
               toast.type === 'error' ? <FiX /> : <FiInfo />}
            </span>
            <p>{toast.message}</p>
          </div>
        </div>
      )}
      
      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Laster inn reservasjonsdata...</p>
          <button className="btn-text" onClick={() => setIsLoading(false)}>
            Avbryt lasting
          </button>
        </div>
      ) : (
        <main className="dashboard-main">

<section className="stats-section">
  <div className="stats-grid">
    <div className="stat-card">
      <div className="stat-icon time-icon">
        <FiClock />
      </div>
      <div className="stat-content">
        <h3>Gjennomsnittlig hentetid</h3>
        <p className="stat-value">{averagePickupTime} <span>dager</span></p>
      </div>
    </div>
    
    <div className="stat-card">
      <div className="stat-icon pickup-icon">
        <FiCheckCircle />
      </div>
      <div className="stat-content">
        <h3>Ikke-hentet materiale</h3>
        <p className="stat-value">{notPickedUpRate}<span>%</span></p>
      </div>
    </div>
    
    <div className="stat-card settings-preview-card">
      <div className="settings-preview">
        <div className="settings-preview-item">
          <div className="preview-label">
            <FiClock className="preview-icon" />
            <span>Hentefrist:</span>
          </div>
          <div className="preview-value">
            <strong>{pickupTimeLimit}</strong> dager
            <button 
              className="btn-quick-edit" 
              onClick={updatePickupTimeLimit}
              aria-label="Endre hentefrist"
              title="Endre hentefrist"
            >
              <FiSettings />
            </button>
          </div>
        </div>
        
        <div className="settings-preview-item">
          <div className="preview-label">
            <FiMail className="preview-icon" />
            <span>Påminnelse:</span>
          </div>
          <div className="preview-value">
            <strong>{reminderDays}</strong> dager før frist
            <button 
              className="btn-quick-edit" 
              onClick={updateReminderDays}
              aria-label="Endre påminnelsesdager"
              title="Endre påminnelsesdager"
            >
              <FiSettings />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  
 {/* Settings drawer that slides in when settings button is clicked */}
{showSettings && (
  <>
    <div className="settings-backdrop" onClick={() => setShowSettings(false)}></div>
    <div className="settings-drawer">
      <div className="settings-drawer-header">
        <h3>Innstillinger</h3>
        <button 
          className="btn-close-drawer"
          onClick={() => setShowSettings(false)}
          aria-label="Lukk innstillinger"
        >
          <FiX />
        </button>
      </div>
      
      <div className="settings-drawer-content">
        <div className="settings-group">
          <h4>Hentefrist og påminnelser</h4>
          
          <div className="setting-item">
            <div className="setting-info">
              <label htmlFor="pickup-time-limit">Hentefrist</label>
              <p className="setting-description">
                Antall dager en reservasjon kan vente på hentehyllen
              </p>
            </div>
            <div className="setting-control">
              <div className="number-input-group">
                <input 
                  type="number" 
                  id="pickup-time-limit"
                  min="1" 
                  max="30"
                  value={pickupTimeLimit}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value > 0) {
                      setPickupTimeLimit(value);
                      setMaterialData(prevData => 
                        prevData.map(item => ({
                          ...item,
                          expiryDate: calculateExpiryDate(item.readyDate)
                        }))
                      );
                    }
                  }}
                />
                <span className="input-suffix">dager</span>
              </div>
            </div>
          </div>
          
          <div className="setting-item">
            <div className="setting-info">
              <label htmlFor="reminder-days">Påminnelse før frist</label>
              <p className="setting-description">
                Antall dager før hentefrist som påminnelse sendes
              </p>
            </div>
            <div className="setting-control">
              <div className="number-input-group">
                <input 
                  type="number" 
                  id="reminder-days"
                  min="1" 
                  max={pickupTimeLimit - 1}
                  value={reminderDays}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value > 0 && value < pickupTimeLimit) {
                      setReminderDays(value);
                    }
                  }}
                />
                <span className="input-suffix">dager</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="settings-actions">
          <button 
            className="btn-apply-settings"
            onClick={() => {
              showToast('Innstillinger er lagret', 'success');
              setShowSettings(false);
            }}
          >
            Lagre innstillinger
          </button>
        </div>
      </div>
    </div>
  </>
)}
</section>
          
          {/* Statistics visualization */}
          <section className="visualization-section">
  <div className="section-header">
    <div className="title-group">
      <h2>Statistikk og trender</h2>
      <div className="toggle-container">
        <label className="toggle-label" htmlFor="showStatistics">
          Vis statistikk
        </label>
        <div 
          className="toggle-switch"
          onClick={() => setShowStatistics(!showStatistics)}
        >
          <input
            type="checkbox"
            id="showStatistics"
            checked={showStatistics}
            onChange={() => setShowStatistics(!showStatistics)}
          />
          <span className="toggle-slider"></span>
        </div>
      </div>
    </div>
    
    <button className="btn-export" onClick={exportChartData}>
      <FiDownload className="icon" />
      Eksporter data
    </button>
  </div>
  
  {showStatistics && (
    <div className="chart-container">
      <div className="chart-header">
        <h3>Hentetid statistikk</h3>
        <div className="chart-tabs">
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
      
      <div className="chart-visualization">
        <ReportChart data={generateChartData()} />
      </div>
    </div>
  )}
</section>
          
          {/* Reservations data section */}
          <section className="reservations-section">
            <div className="section-header">
              <div className="title-group">
                <h2>Aktive reserveringer</h2>
                <span className="item-count">{filteredAndSortedData.length} reserveringer</span>
              </div>
              
              <div className="view-controls">
                <button 
                  className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
                  onClick={() => setViewMode('table')}
                  aria-label="Vis som tabell"
                  title="Tabellvisning"
                >
                  <FiList className="icon" />
                </button>
                <button 
                  className={`view-btn ${viewMode === 'card' ? 'active' : ''}`}
                  onClick={() => setViewMode('card')}
                  aria-label="Vis som kort"
                  title="Kortvisning"
                >
                  <FiGrid className="icon" />
                </button>
              </div>
            </div>
            
            <div className="filter-bar">
              <div className="search-wrapper">
                <FiSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Søk etter tittel, forfatter, lånernummer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                  aria-label="Søk i reserveringer"
                />
                {searchTerm && (
                  <button 
                    className="clear-search" 
                    onClick={() => setSearchTerm('')}
                    aria-label="Tøm søk"
                  >
                    <FiX />
                  </button>
                )}
              </div>
              
              <div className="filter-dropdown">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="filter-select"
                  aria-label="Filtrer etter status"
                >
                  <option value={FILTER_STATUSES.ALL}>Alle statuser</option>
                  <option value={FILTER_STATUSES.WAITING}>Venter</option>
                  <option value={FILTER_STATUSES.PICKED_UP}>Hentet</option>
                  <option value={FILTER_STATUSES.EXPIRED}>Utløpt</option>
                </select>
                <FiFilter className="filter-icon" />
              </div>
              
              <div className="column-manager-dropdown">
                <button 
                  className="column-manager-toggle"
                  onClick={() => setColumnMenuOpen(!columnMenuOpen)}
                  aria-expanded={columnMenuOpen}
                  aria-haspopup="true"
                >
                  {columnMenuOpen ? <FiEyeOff className="icon" /> : <FiEye className="icon" />}
                  Kolonner
                  <span className="dropdown-icon">
                    {columnMenuOpen ? <FiChevronUp /> : <FiChevronDown />}
                  </span>
                </button>
                
                {columnMenuOpen && (
                  <div className="column-options" role="menu">
                    {Object.entries({
                      title: 'Tittel',
                      author: 'Forfatter',
                      borrowerId: 'Lånernummer',
                      reservedDate: 'Reservert dato',
                      readyDate: 'Klar dato',
                      expiryDate: 'Hentefrist',
                      pickedUpDate: 'Hentet dato',
                      status: 'Status',
                      daysOnShelf: 'Dager på hylle',
                      pickupNumber: 'Hentenummer'
                    }).map(([key, label]) => (
                      <label key={key} className="column-option">
                        <input 
                          type="checkbox" 
                          checked={visibleColumns[key]} 
                          onChange={() => toggleColumnVisibility(key)}
                          aria-label={`Vis ${label} kolonne`}
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {filteredAndSortedData.length > 0 ? (
              <>
                {/* Table View */}
                {viewMode === 'table' && (
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
                        {filteredAndSortedData.map(item => (
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
                                parseNorwegianDate(item.expiryDate) < new Date() && 
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
                                <span className={`status-badge status-${item.status.toLowerCase()}`}>
                                  {item.status}
                                </span>
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
                )}
                
                {/* Card View */}
                {viewMode === 'card' && (
                  <div className="card-grid">
                    {filteredAndSortedData.map(item => (
                      <div 
                        key={item.id} 
                        className={`reservation-card status-${item.status.toLowerCase()}-card`}
                      >
                        <div className="card-header">
                          <div className="card-status">
                            <span className={`status-badge status-${item.status.toLowerCase()}`}>
                              {item.status}
                            </span>
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
                                parseNorwegianDate(item.expiryDate) < new Date() && 
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
                )}
              </>
            ) : (
              <div className="no-results">
                <div className="no-results-icon">
                  <FiBook />
                </div>
                <h3>Ingen reserveringer funnet</h3>
                <p>
                  {searchTerm || filterStatus !== FILTER_STATUSES.ALL 
                    ? 'Prøv å endre søkekriteriene dine' 
                    : 'Det er ingen aktive reserveringer for øyeblikket'}
                </p>
                {(searchTerm || filterStatus !== FILTER_STATUSES.ALL) && (
                  <button 
                    className="btn-reset-filters"
                    onClick={() => {
                      setSearchTerm('');
                      setFilterStatus(FILTER_STATUSES.ALL);
                    }}
                  >
                    Tilbakestill filtre
                  </button>
                )}
              </div>
            )}
          </section>
        </main>
      )}
    </div>
  );
}

export default ReserveringDashboard;