// src/components/ReserveringDashboard.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ReserveringDashboard.css';
import ReportChart from './Reportchart';

// Constants for filter values
const FILTER_STATUSES = {
  ALL: 'all',
  WAITING: 'venter',
  PICKED_UP: 'hentet',
  EXPIRED: 'utløpt'
};

// Helper functions moved outside component to avoid recreating on each render
const formatDateNorwegian = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
};

const parseNorwegianDate = (dateString) => {
  if (!dateString) return null;
  const parts = dateString.split('.');
  if (parts.length !== 3) return null;
  // Convert from DD.MM.YYYY to YYYY-MM-DD for Date constructor
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
      console.log("Loading safety timeout started");
      const safetyTimer = setTimeout(() => {
        console.log("Safety timeout triggered - forcing loading to false");
        setIsLoading(false);
      }, 5000); // 5 second safety timeout
      
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
    console.log("Running reminder check");
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
      console.log("Automatiske påminnelser sendt:", remindersToSend);
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

  // Load reservation data - only run once on mount
  useEffect(() => {
    console.log("Data loading effect running");
    let isMounted = true; // For cleanup/preventing state updates after unmount
    
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // Simulate API call with a delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Get current date to make realistic dates
        const today = new Date();
        
        // Helper to create dates relative to today
        const getRelativeDate = (daysDiff) => {
          const date = new Date(today);
          date.setDate(date.getDate() + daysDiff);
          return date.toISOString();
        };
        
        // Mock data that's structured similar to what Prisma would return
        const mockReservations = [
          { 
            id: 1, 
            title: 'Sjøfareren', 
            author: 'Erika Fatland', 
            borrower: {
              id: 'N00123456',
              name: 'Ole Nordmann',
              email: 'ole.nordmann@example.com',
              phone: '91234567'
            },
            reservedDate: getRelativeDate(-5),
            readyDate: getRelativeDate(-4),
            pickedUpDate: getRelativeDate(-2),
            status: 'HENTET',
            pickupNumber: 'A-123',
            createdAt: getRelativeDate(-6),
            updatedAt: getRelativeDate(-2)
          },
          { 
            id: 2, 
            title: 'Lur familiemat', 
            author: 'Ida Gran-Jansen', 
            borrower: {
              id: 'N00234567',
              name: 'Kari Nordmann',
              email: 'kari.nordmann@example.com',
              phone: '92345678'
            },
            reservedDate: getRelativeDate(-7),
            readyDate: getRelativeDate(-6),
            pickedUpDate: getRelativeDate(-3),
            status: 'HENTET',
            pickupNumber: 'A-124',
            createdAt: getRelativeDate(-8),
            updatedAt: getRelativeDate(-3)
          },
          { 
            id: 3, 
            title: 'Råsterk på et år', 
            author: 'Jørgine Massa Vasstrand', 
            borrower: {
              id: 'N00345678',
              name: 'Petter Hansen',
              email: 'petter.hansen@example.com',
              phone: '93456789'
            },
            reservedDate: getRelativeDate(-3),
            readyDate: getRelativeDate(-2),
            pickedUpDate: null,
            status: 'VENTER',
            pickupNumber: 'A-125',
            createdAt: getRelativeDate(-4),
            updatedAt: getRelativeDate(-2)
          },
          { 
            id: 4, 
            title: 'Tørt land', 
            author: 'Jørn Lier Horst', 
            borrower: {
              id: 'N00456789',
              name: 'Marte Kirkerud',
              email: 'marte.kirkerud@example.com',
              phone: '94567890'
            },
            reservedDate: getRelativeDate(-5),
            readyDate: getRelativeDate(-4),
            pickedUpDate: getRelativeDate(-3),
            status: 'HENTET',
            pickupNumber: 'A-126',
            createdAt: getRelativeDate(-6),
            updatedAt: getRelativeDate(-3)
          },
          { 
            id: 5, 
            title: 'Kongen av Os', 
            author: 'Jo Nesbø', 
            borrower: {
              id: 'N00567890',
              name: 'Lars Holm',
              email: 'lars.holm@example.com',
              phone: '95678901'
            },
            reservedDate: getRelativeDate(-3),
            readyDate: getRelativeDate(-2),
            pickedUpDate: null,
            status: 'VENTER',
            pickupNumber: 'A-127',
            createdAt: getRelativeDate(-4),
            updatedAt: getRelativeDate(-2)
          },
          { 
            id: 6, 
            title: '23 meter offside (Pondus)', 
            author: 'Frode Øverli', 
            borrower: {
              id: 'N00678901',
              name: 'Sofia Berg',
              email: 'sofia.berg@example.com',
              phone: '96789012'
            },
            reservedDate: getRelativeDate(-8),
            readyDate: getRelativeDate(-7),
            pickedUpDate: getRelativeDate(-6),
            status: 'HENTET',
            pickupNumber: 'A-128',
            createdAt: getRelativeDate(-9),
            updatedAt: getRelativeDate(-6)
          },
          { 
            id: 7, 
            title: 'Felix har følelser', 
            author: 'Charlotte Mjelde', 
            borrower: {
              id: 'N00789012',
              name: 'Erik Lund',
              email: 'erik.lund@example.com',
              phone: '97890123'
            },
            reservedDate: getRelativeDate(-1),
            readyDate: getRelativeDate(0), // Today
            pickedUpDate: null,
            status: 'VENTER',
            pickupNumber: 'A-129',
            createdAt: getRelativeDate(-2),
            updatedAt: getRelativeDate(0)
          },
          { 
            id: 8, 
            title: 'Skriket', 
            author: 'Jørn Lier Horst og Jan-Erik Fjell', 
            borrower: {
              id: 'N00890123',
              name: 'Anna Dahl',
              email: 'anna.dahl@example.com',
              phone: '98901234'
            },
            reservedDate: getRelativeDate(-6),
            readyDate: getRelativeDate(-5),
            pickedUpDate: getRelativeDate(-4),
            status: 'HENTET',
            pickupNumber: 'A-130',
            createdAt: getRelativeDate(-7),
            updatedAt: getRelativeDate(-4)
          },
          { 
            id: 9, 
            title: 'Juleroser', 
            author: 'Herborg Kråkevik', 
            borrower: {
              id: 'N00901234',
              name: 'Thomas Olsen',
              email: 'thomas.olsen@example.com',
              phone: '99012345'
            },
            reservedDate: getRelativeDate(-10),
            readyDate: getRelativeDate(-9),
            pickedUpDate: null,
            status: 'UTLØPT',
            pickupNumber: 'A-131',
            createdAt: getRelativeDate(-11),
            updatedAt: getRelativeDate(-1)
          },
          { 
            id: 10, 
            title: 'Søvngjengeren', 
            author: 'Lars Kepler', 
            borrower: {
              id: 'N00012345',
              name: 'Maria Johansen',
              email: 'maria.johansen@example.com',
              phone: '90123456'
            },
            reservedDate: getRelativeDate(-4),
            readyDate: getRelativeDate(-3),
            pickedUpDate: null,
            status: 'VENTER',
            pickupNumber: 'A-132',
            createdAt: getRelativeDate(-5),
            updatedAt: getRelativeDate(-3)
          },
        ];

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
              reminderSentDate: formatDateNorwegian(getRelativeDate(-1)),
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
      console.log("Data loading effect cleanup");
    };
  }, []); // Empty dependency array - only run once on mount

  // Separate effect for checking reminders
  useEffect(() => {
    // Only run this effect when data is loaded and we're not in loading state
    if (!isLoading && materialData.length > 0) {
      console.log("Reminder check effect running");
      
      // Check reminders once
      checkAndSendAutomaticReminders(materialData);
      
      // Set up interval for periodic checks
      const checkTimer = setInterval(() => {
        console.log("Periodic reminder check");
        checkAndSendAutomaticReminders(materialData);
      }, 30000); // Check every 30 seconds instead of every second
      
      // Cleanup
      return () => {
        clearInterval(checkTimer);
        console.log("Reminder check effect cleanup");
      };
    }
  }, [isLoading, materialData.length, checkAndSendAutomaticReminders]); 

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
    // In a real application, this would navigate to the borrower detail page
    navigate(`/låner/${borrowerId}`);
    // For demo purposes, show an toast
    showToast(`Navigerer til lånerdetaljer for: ${borrowerId}`, 'info');
  };

  // Mark item as picked up
  const handleMarkAsPickedUp = (id) => {
    const today = formatDateNorwegian(new Date());
    
    setMaterialData(prevData => 
      prevData.map(item => 
        item.id === id 
          ? { 
              ...item, 
              status: 'Hentet', 
              pickedUpDate: today,
              daysOnShelf: calculateDaysBetween(item.readyDate, today)
            } 
          : item
      )
    );
    
    // For demo: Show a confirmation message
    const item = materialData.find(item => item.id === id);
    showToast(`"${item.title}" er nå markert som hentet av ${item.borrowerName} (${item.borrowerId})`, 'success');
  };

  // Render sort indicator
  const renderSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return <span className="sort-indicator">{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>;
  };

  // Column management dropdown component
  const ColumnManager = () => (
    <div className="column-manager">
      <button 
        className="btn-column-manager"
        aria-haspopup="true"
        aria-expanded={columnMenuOpen}
        onClick={() => setColumnMenuOpen(!columnMenuOpen)}
        onBlur={(e) => {
          // Close menu when focus leaves unless it's going to a child element
          if (!e.currentTarget.contains(e.relatedTarget)) {
            setColumnMenuOpen(false);
          }
        }}
      >
        Velg kolonner <span className="dropdown-icon" aria-hidden="true">▼</span>
      </button>
      {columnMenuOpen && (
        <div className="column-dropdown" role="menu">
          <div className="column-options">
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
              <label key={key}>
                <input 
                  type="checkbox" 
                  checked={visibleColumns[key]} 
                  onChange={() => toggleColumnVisibility(key)}
                  aria-label={`Vis ${label} kolonne`}
                />
                {label}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="dashboard-wrapper">
      
      <div className="page-header">
        <h1>Reserveringer Dashboard</h1>
      </div>
      
      {toast.visible && (
        <div className={`toast toast-${toast.type}`} role="alert">
          {toast.message}
        </div>
      )}
      
      {isLoading ? (
        <div className="loading-indicator" aria-live="polite">
          <div className="spinner" aria-hidden="true"></div>
          <p>Laster inn reservasjonsdata...</p>
          <button 
            className="btn-small" 
            onClick={() => setIsLoading(false)}
            style={{ marginTop: '1rem' }}
          >
            Avbryt lasting
          </button>
        </div>
      ) : (
        <main id="main-content">
          <div className="dashboard-summary">
            <div className="stats-card" role="region" aria-label="Statistikk">
              <h3>Gjennomsnittlig hentetid</h3>
              <div className="stats-value">{averagePickupTime} dager</div>
            </div>
            <div className="stats-card" role="region" aria-label="Statistikk">
              <h3>Ikke hentet (%)</h3>
              <div className="stats-value">{notPickedUpRate}%</div>
            </div>
            <div className="settings-container">
              <button 
                className="settings-toggle-btn"
                onClick={() => setShowSettings(!showSettings)}
                aria-expanded={showSettings}
                aria-controls="settings-panel"
              >
                <span className="settings-icon" aria-hidden="true">⚙️</span>
                {showSettings ? 'Skjul innstillinger' : 'Vis innstillinger'}
              </button>
              
              {showSettings && (
                <div id="settings-panel" className="settings-panel">
                  <div className="settings-card">
                    <h3>Hentefrist</h3>
                    <div className="stats-value">{pickupTimeLimit} dager</div>
                    <button 
                      className="btn-small" 
                      onClick={updatePickupTimeLimit}
                      aria-label="Endre hentefrist"
                    >
                      Endre
                    </button>
                  </div>
                  <div className="settings-card">
                    <h3>Påminnelse før frist</h3>
                    <div className="stats-value">{reminderDays} dager</div>
                    <button 
                      className="btn-small" 
                      onClick={updateReminderDays}
                      aria-label="Endre påminnelsesdager"
                    >
                      Endre
                    </button>
                  </div>
                </div>
              )}
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
              <button 
                className="btn-export" 
                onClick={exportChartData}
                aria-label="Eksporter statistikkdata til CSV"
              >
                <span className="export-icon" aria-hidden="true">⬇</span>
                Eksporter data
              </button>
            </div>
          </div>
          
          {/* Conditionally render chart section */}
          {showStatistics && (
            <div className="dashboard-charts" role="region" aria-label="Statistikkgrafer">
              <div className="chart-controls">
                <h2>Statistikk for hentetid</h2>
                <div className="view-buttons" role="tablist">
                  <button 
                    role="tab"
                    aria-selected={statisticsView === 'weekly'}
                    className={statisticsView === 'weekly' ? 'active' : ''} 
                    onClick={() => setStatisticsView('weekly')}
                  >
                    Ukentlig
                  </button>
                  <button 
                    role="tab"
                    aria-selected={statisticsView === 'monthly'}
                    className={statisticsView === 'monthly' ? 'active' : ''} 
                    onClick={() => setStatisticsView('monthly')}
                  >
                    Månedlig
                  </button>
                  <button 
                    role="tab"
                    aria-selected={statisticsView === 'yearly'}
                    className={statisticsView === 'yearly' ? 'active' : ''} 
                    onClick={() => setStatisticsView('yearly')}
                  >
                    Årlig
                  </button>
                </div>
              </div>
              
              <div className="chart-container" role="tabpanel">
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
                    aria-label={`Send ${pendingReminders} ventende påminnelser`}
                  >
                    Send påminnelser
                    <span className="reminder-badge">{pendingReminders}</span>
                  </button>
                )}
                <button 
                  className="btn-primary" 
                  onClick={() => showToast("Funksjon for å legge til ny reservering", "info")}
                  aria-label="Legg til ny reservering"
                >
                  Ny reservering
                </button>
                <ColumnManager />
              </div>
            </div>
            
            <div className="filter-controls">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Søk etter tittel, forfatter, lånernummer, låner eller hentenummer"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                  aria-label="Søk i reserveringer"
                />
              </div>
              
              <div className="filter-container">
                <label htmlFor="statusFilter">Status:</label>
                <select
                  id="statusFilter"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="styled-select"
                  aria-label="Filtrer etter status"
                >
                  <option value={FILTER_STATUSES.ALL}>Alle</option>
                  <option value={FILTER_STATUSES.WAITING}>Venter</option>
                  <option value={FILTER_STATUSES.PICKED_UP}>Hentet</option>
                  <option value={FILTER_STATUSES.EXPIRED}>Utløpt</option>
                </select>
              </div>
            </div>
            
            {filteredAndSortedData.length > 0 ? (
              <div className="table-responsive">
                <table className="reservations-table" aria-label="Reserveringer">
                  <thead>
                    <tr>
                      {visibleColumns.title && (
                        <th 
                          onClick={() => requestSort('title')} 
                          className="sortable-header"
                          aria-sort={sortConfig.key === 'title' ? sortConfig.direction : 'none'}
                        >
                          Tittel {renderSortIndicator('title')}
                        </th>
                      )}
                      {visibleColumns.author && (
                        <th 
                          onClick={() => requestSort('author')} 
                          className="sortable-header"
                          aria-sort={sortConfig.key === 'author' ? sortConfig.direction : 'none'}
                        >
                          Forfatter {renderSortIndicator('author')}
                        </th>
                      )}
                      {visibleColumns.borrowerId && (
                        <th 
                          onClick={() => requestSort('borrowerId')} 
                          className="sortable-header"
                          aria-sort={sortConfig.key === 'borrowerId' ? sortConfig.direction : 'none'}
                        >
                          Lånernummer {renderSortIndicator('borrowerId')}
                        </th>
                      )}
                      {visibleColumns.reservedDate && (
                        <th 
                          onClick={() => requestSort('reservedDate')} 
                          className="sortable-header"
                          aria-sort={sortConfig.key === 'reservedDate' ? sortConfig.direction : 'none'}
                        >
                          Reservert dato {renderSortIndicator('reservedDate')}
                        </th>
                      )}
                      {visibleColumns.readyDate && (
                        <th 
                          onClick={() => requestSort('readyDate')} 
                          className="sortable-header"
                          aria-sort={sortConfig.key === 'readyDate' ? sortConfig.direction : 'none'}
                        >
                          Klar dato {renderSortIndicator('readyDate')}
                        </th>
                      )}
                      {visibleColumns.expiryDate && (
                        <th 
                          onClick={() => requestSort('expiryDate')} 
                          className="sortable-header"
                          aria-sort={sortConfig.key === 'expiryDate' ? sortConfig.direction : 'none'}
                          data-tooltip="Siste dato materialet kan hentes"
                        >
                          Hentefrist {renderSortIndicator('expiryDate')}
                        </th>
                      )}
                      {visibleColumns.pickedUpDate && (
                        <th 
                          onClick={() => requestSort('pickedUpDate')} 
                          className="sortable-header"
                          aria-sort={sortConfig.key === 'pickedUpDate' ? sortConfig.direction : 'none'}
                        >
                          Hentet dato {renderSortIndicator('pickedUpDate')}
                        </th>
                      )}
                      {visibleColumns.status && (
                        <th 
                          onClick={() => requestSort('status')} 
                          className="sortable-header"
                          aria-sort={sortConfig.key === 'status' ? sortConfig.direction : 'none'}
                        >
                          Status {renderSortIndicator('status')}
                        </th>
                      )}
                      {visibleColumns.daysOnShelf && (
                        <th 
                          onClick={() => requestSort('daysOnShelf')} 
                          className="sortable-header"
                          aria-sort={sortConfig.key === 'daysOnShelf' ? sortConfig.direction : 'none'}
                          data-tooltip="Antall dager materialet har ventet på henting"
                        >
                          Dager på hylle {renderSortIndicator('daysOnShelf')}
                        </th>
                      )}
                      {visibleColumns.pickupNumber && (
                        <th 
                          onClick={() => requestSort('pickupNumber')} 
                          className="sortable-header"
                          aria-sort={sortConfig.key === 'pickupNumber' ? sortConfig.direction : 'none'}
                        >
                          Hentenummer {renderSortIndicator('pickupNumber')}
                        </th>
                      )}
                      
                  
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedData.map(item => (
                      <tr 
                        key={item.id} 
                        className={item.status === 'Utløpt' ? 'expired-row' : ''}
                      >
                        {visibleColumns.title && <td>{item.title}</td>}
                        {visibleColumns.author && <td>{item.author}</td>}
                        {visibleColumns.borrowerId && (
                          <td>
                            <button 
                              className="link-button"
                              onClick={() => handleBorrowerClick(item.borrowerId)}
                              aria-label={`Vis låner ${item.borrowerId}`}
                            >
                              {item.borrowerId}
                            </button>
                          </td>
                        )}
                        {visibleColumns.reservedDate && <td>{item.reservedDate}</td>}
                        {visibleColumns.readyDate && <td>{item.readyDate}</td>}
                        {visibleColumns.expiryDate && (
                          <td className={
                            parseNorwegianDate(item.expiryDate) < new Date() && 
                            item.status !== 'Hentet' ? 'expired-date' : ''
                          }>
                            {item.expiryDate}
                          </td>
                        )}
                        {visibleColumns.pickedUpDate && <td>{item.pickedUpDate || '-'}</td>}
                        {visibleColumns.status && (
                          <td className={`status-${item.status.toLowerCase()}`}>
                            <span className="status-indicator"></span>
                            {item.status}
                          </td>
                        )}
                        {visibleColumns.daysOnShelf && (
                          <td>{item.daysOnShelf !== null ? item.daysOnShelf : '-'}</td>
                        )}
                        {visibleColumns.pickupNumber && (
                          <td className="pickup-number">{item.pickupNumber}</td>
                        )}
                        
                          
                         
                        
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="no-data-message" role="status">
                {searchTerm || filterStatus !== FILTER_STATUSES.ALL 
                  ? 'Ingen reserveringer matcher søkekriteriene' 
                  : 'Ingen aktive reserveringer'}
              </div>
            )}
          </div>
        </main>
      )}
    </div>
  );
}

export default ReserveringDashboard;