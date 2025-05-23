import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/ReserveringDashboard.css';
import { generateMockData } from '../../../utils/mockData';
// Removed unused import FiHelpCircle
import StatisticsSection from '../components/StatisticsSection';
import VisualizationSection from '../components/VisualizationSection';
import ReservationList from '../components/ReservationList';
import SettingsPanel from '../components/SettingsPanel';
import ToastNotification from '../../common/ToastNotification';
import LoadingSpinner from '../../common/LoadingSpinner';
import PrintableReports from '../helpers/PrintableReports';
// Removed unused import axios - it's commented out in the actual fetch logic

import { formatDateNorwegian, parseNorwegianDate, calculateDaysBetween } from '../../../utils/dateUtils';

const FILTER_STATUSES = {
  ALL: 'all',
  WAITING: 'venter',
  PICKED_UP: 'hentet',
  EXPIRED: 'utløpt'
};

function ReserveringDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentTab = location.pathname.includes('/innstillinger') 
    ? 'innstillinger' 
    : location.pathname.includes('/aktive') 
      ? 'aktive' 
      : 'oversikt';
  
  // UI 
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table');
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  
  // Instillinger 
  const [pickupTimeLimit, setPickupTimeLimit] = useState(7);
  const [reminderDays, setReminderDays] = useState(2);
  // Removed unused state tempSettings and setTempSettings
  
  // Data 
  const [materialData, setMaterialData] = useState([]);
  const [reminderLogs, setReminderLogs] = useState([]);
  const [sentAutomaticReminders, setSentAutomaticReminders] = useState([]);
  const [pickupDistributionData, setPickupDistributionData] = useState([]);
  
  // Statestikk 
  const [statistics, setStatistics] = useState({
    averagePickupTime: 0,
    notPickedUpRate: 0,
    pendingReminders: 0
  });
  
  // Filtering and sortering
  const [filterStatus, setFilterStatus] = useState(FILTER_STATUSES.ALL);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'readyDate', direction: 'desc' });
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

  // Notifikasjon
  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: '', type: 'success' }), 3000);
  };

  // Expiry date calculation - now defined with useCallback to avoid dependency issues
  const calculateExpiryDate = useCallback((readyDate) => {
    if (!readyDate) return null;
    const date = parseNorwegianDate(readyDate);
    if (!date) return null;
    
    date.setDate(date.getDate() + pickupTimeLimit);
    return formatDateNorwegian(date);
  }, [pickupTimeLimit]);

  // kalkulere hentetid fordeling data - now defined with useCallback to avoid dependency issues
  const calculatePickupDistribution = useCallback(() => {
    // Group items by how many days they spent on the shelf
    const dayGroups = {};
    const pickedUpItems = materialData.filter(item => item.pickedUpDate);
    
    // tell materiale for hver dag
    pickedUpItems.forEach(item => {
      const days = item.daysOnShelf;
      dayGroups[days] = (dayGroups[days] || 0) + 1;
    });
    
    // kalkulere total material som ikke er hentet 
    const totalItems = materialData.length || 1; // Prevent division by zero
    const notPickedUpCount = materialData.filter(item => item.status === 'Utløpt').length;
    
    // lage  distribution data
    const distributionData = [];
    
    // legge til data for dag 1-7 (eller hva enn hentefristen er)
    for (let i = 1; i <= pickupTimeLimit; i++) {
      const count = dayGroups[i] || 0;
      const percentage = Math.round((count / totalItems) * 100);
      distributionData.push({
        day: `Dag ${i}`,
        count,
        percentage
      });
    }
    
    //legge til ikke hentet sist
    distributionData.push({
      day: "Ikke hentet",
      count: notPickedUpCount,
      percentage: Math.round((notPickedUpCount / totalItems) * 100)
    });
    
    return distributionData;
  }, [materialData, pickupTimeLimit]);

  // oppdatere pickup distribution data når den relevante dataen forandres
  useEffect(() => {
    if (materialData.length > 0) {
      const distributionData = calculatePickupDistribution();
      setPickupDistributionData(distributionData);
    }
  }, [materialData, pickupTimeLimit, calculatePickupDistribution]); 


     /* useEffect(() => {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const response = await axios.get("http://localhost:5000/reservasjoner");
          const data = response.data;
  
          if (Array.isArray(data)) {
            const filteredData = data.filter(item => item !== undefined && item !== null);
            console.log("Filtrerte data:", filteredData);
  
            // Kartlegg dataene
            const mappedData = filteredData.map(item => {
              const reserved = parseNorwegianDate(item.reservert_dato);
              const pickedUp = parseNorwegianDate(item.hentet_dato);
              const shelfDate = pickedUp || new Date();
            
              const daysOnShelf = reserved && shelfDate
                ? calculateDaysBetween(reserved, shelfDate)
                : 0;
            
              return {
                id: item.id,
                title: item.tittel,
                author: item.forfatter,
                borrowerId: item.lanernummer,
                reservedDate: item.reservert_dato,
                readyDate: item.klar_dato,
                pickedUpDate: item.hentet_dato,
                status: item.status,
                expiryDate: item.hentefrist,
                daysOnShelf,
                pickupNumber: item.hentenr,
              };
            });
            
  
            console.log("Mapped data:", mappedData); // Debug
            setMaterialData(mappedData);
            
          } else {
            console.error("Forventet en array, men fikk noe annet:", data);
          }
        } catch (error) {
          console.error("Feil ved henting av reservasjonene:", error);
          showToast("Kunne ikke hente data fra serveren", "error");
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchData();
    }, []); */

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
       
        const savedPickupTimeLimit = localStorage.getItem('pickupTimeLimit');
        const savedReminderDays = localStorage.getItem('reminderDays');
        
        if (savedPickupTimeLimit) {
          setPickupTimeLimit(parseInt(savedPickupTimeLimit));
        }
        
        if (savedReminderDays) {
          setReminderDays(parseInt(savedReminderDays));
        }
        
        // simulere API call
        await new Promise(resolve => setTimeout(resolve, 800));

        //For tilkobling til databasen
        //const response = await axios.get('http://localhost:5000/reservasjoner');
        //const mockReservations = response.data;
        
        const mockReservations = generateMockData();
        
        const processedReservations = mockReservations.map(item => {
          const readyDateFormatted = formatDateNorwegian(item.readyDate);
          const pickedUpDateFormatted = item.pickedUpDate ? formatDateNorwegian(item.pickedUpDate) : null;
          const reservedDateFormatted = formatDateNorwegian(item.reservedDate);
          
          const daysOnShelf = item.pickedUpDate ? 
            calculateDaysBetween(readyDateFormatted, pickedUpDateFormatted) : null;
          
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
            status: item.status.charAt(0) + item.status.slice(1).toLowerCase(),
            pickupNumber: item.pickupNumber,
            expiryDate: expiryDate,
            daysOnShelf: daysOnShelf
          };
        });
        
        setMaterialData(processedReservations);
        
        // kalkulere statestikk
        const pickedUpItems = processedReservations.filter(res => res.pickedUpDate);
        const avgDays = pickedUpItems.length > 0 
          ? pickedUpItems.reduce((sum, item) => sum + item.daysOnShelf, 0) / pickedUpItems.length 
          : 0;
        
        const expiredItems = processedReservations.filter(res => res.status === 'Utløpt');
        const notPickedRate = processedReservations.length > 0
          ? (expiredItems.length / processedReservations.length) * 100
          : 0;
        
        setStatistics({
          averagePickupTime: avgDays.toFixed(1),
          notPickedUpRate: notPickedRate.toFixed(1),
          pendingReminders: 0
        });
        
        // påminnelse logg
        const initialReminderLogs = [
          {
            id: 'rem-history-1',
            reservationId: 3,
            title: 'Råsterk på et år',
            author: 'Jørgine Massa Vasstrand',
            borrowerId: 'N00345678',
            borrowerName: 'Petter Hansen',
            readyDate: processedReservations.find(r => r.id === 3)?.readyDate || '',
            expiryDate: processedReservations.find(r => r.id === 3)?.expiryDate || '',
            reminderSentDate: formatDateNorwegian(new Date(Date.now() - 86400000)),
            status: 'Sendt automatisk'
          }
        ];
        
        setReminderLogs(initialReminderLogs);
        setSentAutomaticReminders([3]);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching reservation data:", error);
        setIsLoading(false);
        showToast("Kunne ikke laste inn data. Prøv igjen senere.", "error");
      }
    };

    fetchData();
  }, [calculateExpiryDate]);

  //For å hente data
  /*
  async function fetchData() {
    try {
        const response = await axios.get("http://localhost:5000/reservasjoner");
        const data = response.data;

        // Filtrer bort eventuelle undefined eller null elementer
        if (Array.isArray(data)) {
            const filteredData = data.filter(item => item !== undefined && item !== null);

            // Logg de filtrerte dataene for å se at det er riktig format
            console.log("Filtrerte data:", filteredData);

            // Sett de filtrerte dataene til state
            setReservasjoner(filteredData);
        } else {
            console.error("Forventet en array, men fikk noe annet:", data);
        }
    } catch (error) {
        console.error("Feil ved henting av reservasjonene:", error);
    }
}
  */

  const handleBorrowerClick = (borrowerId) => {
    navigate(`/laaner/${borrowerId}`);
    showToast(`Navigerer til lånerdetaljer for: ${borrowerId}`, 'info');
  };

  const saveSettings = (newSettings) => {
    if (newSettings) {
      const newPickupTimeLimit = typeof newSettings.pickupTimeLimit === 'number' ? 
        newSettings.pickupTimeLimit : pickupTimeLimit;
      
      const newReminderDays = typeof newSettings.reminderDays === 'number' ? 
        newSettings.reminderDays : reminderDays;
      
      // lagre i localStorage
      localStorage.setItem('pickupTimeLimit', newPickupTimeLimit);
      localStorage.setItem('reminderDays', newReminderDays);
      
      setPickupTimeLimit(newPickupTimeLimit);
      setReminderDays(newReminderDays);
      
      if (newPickupTimeLimit !== pickupTimeLimit) {
        setMaterialData(prevData => 
          prevData.map(item => ({
            ...item,
            expiryDate: calculateExpiryDate(item.readyDate)
          }))
        );
      }
      
      showToast('Innstillinger er lagret', 'success');
    }
  };

  // sende påminnelser
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
      setStatistics(prev => ({...prev, pendingReminders: 0}));
      showToast(`${remindersToSend.length} påminnelser har blitt sendt.`, 'success');
    } else {
      showToast('Ingen ventende påminnelser å sende.', 'info');
    }
  };

  return (
    <div className="dashboard-wrapper">
      {/* Notification */}
      <ToastNotification
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, visible: false })}
      />
      
      {isLoading ? (
        <LoadingSpinner message="Laster inn reservasjonsdata..." />
      ) : (
        <main className="dashboard-main">
          {currentTab === 'oversikt' && (
            <>
              <StatisticsSection 
                statistics={statistics}
                pickupTimeLimit={pickupTimeLimit}
                reminderDays={reminderDays}
                materialData={materialData} 
              />
              <VisualizationSection 
                materialData={materialData}
                reminderLogs={reminderLogs}
                pickupTimeLimit={pickupTimeLimit}
                reminderDays={reminderDays}
                pickupDistributionData={pickupDistributionData}
                showToast={showToast}
              />
            </>
          )}
          
          {currentTab === 'aktive' && (
            <ReservationList 
              materialData={materialData}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              sortConfig={sortConfig}
              setSortConfig={setSortConfig}
              visibleColumns={visibleColumns}
              setVisibleColumns={setVisibleColumns}
              viewMode={viewMode}
              setViewMode={setViewMode}
              handleBorrowerClick={handleBorrowerClick}
              calculateExpiryDate={calculateExpiryDate}
              showToast={showToast}
            />
          )}
          
          {currentTab === 'innstillinger' && (
            <SettingsPanel 
              pickupTimeLimit={pickupTimeLimit}
              reminderDays={reminderDays}
              saveSettings={saveSettings}
              showToast={showToast}
              sendAutomaticReminders={sendAutomaticReminders}
            />
          )}
        </main>
      )}
      
      {/* Printable */}
      <PrintableReports 
        materialData={materialData}
        reminderLogs={reminderLogs}
        statistics={statistics}
        pickupTimeLimit={pickupTimeLimit}
        reminderDays={reminderDays}
      />
    </div>
  );
}

export default ReserveringDashboard;