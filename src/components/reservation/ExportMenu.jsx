// src/components/reservation/ExportMenu.jsx
import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { FiDownload, FiFilePlus, FiFileText, FiCheck, FiX, FiSliders, FiCalendar } from 'react-icons/fi';
import './ExportMenu.css';
import { jsPDF } from "jspdf";  // Import jsPDF

const ExportMenu = ({ 
  materialData, 
  reminderLogs, 
  statisticsView, 
  chartData, 
  pickupTimeLimit,
  reminderDays,
  showToast 
  
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [exportOptions, setExportOptions] = useState({
    includeReservations: true,
    includeReminders: true,
    includeStatistics: true,
    dateFormat: 'norwegian', 
    dateRange: 'all' 
  });
  
  const [customDateRange, setCustomDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });
  
  const menuRef = useRef(null);
  
  // lukke meny når du klikker utsiden av menyen 
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowExportOptions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setShowExportOptions(false);
    }
  };
  
  const toggleOptions = (e) => {
    e.stopPropagation();
    setShowExportOptions(!showExportOptions);
  };
  
  const updateExportOption = (option, value) => {
    setExportOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };
  
  const getTimestamp = () => {
    const now = new Date();
    return now.toISOString()
      .replace(/[-:]/g, '')
      .replace('T', '_')
      .split('.')[0];
  };
  
  const handleExport = () => {
    if (!exportOptions.includeReservations && !exportOptions.includeReminders && !exportOptions.includeStatistics) {
      showToast('Velg minst én datatype å eksportere', 'warning');
      return;
    }
    
    
    const timestamp = getTimestamp();
    let csvContent = '';
    
    if (exportOptions.includeReservations) {
      csvContent += 'RESERVASJONER\n';
      csvContent += 'Tittel,Forfatter,Låner-ID,Klar dato,Hentefrist,Hentet dato,Status,Dager på hylla,Hentenummer\n';
      
      materialData.forEach(item => {
        csvContent += `"${item.title}","${item.author}","${item.borrowerId}","${item.readyDate}","${item.expiryDate}","${item.pickedUpDate || ''}","${item.status}","${item.daysOnShelf !== null ? item.daysOnShelf : ''}","${item.pickupNumber}"\n`;
      });
      
      csvContent += '\n\n';
    }
    
    if (exportOptions.includeReminders) {
      csvContent += 'PÅMINNELSER\n';
      csvContent += 'Tittel,Forfatter,Låner-ID,Klar dato,Hentefrist,Påminnelse sendt,Status\n';
      
      reminderLogs.forEach(log => {
        csvContent += `"${log.title}","${log.author}","${log.borrowerId}","${log.readyDate}","${log.expiryDate}","${log.reminderSentDate}","${log.status}"\n`;
      });
      
      csvContent += '\n\n';
    }
    
    if (exportOptions.includeStatistics) {
      csvContent += 'STATISTIKK\n';
      csvContent += 'Periode,Gjennomsnittlig hentetid (dager),Antall ikke hentet\n';
      
      chartData.forEach(item => {
        csvContent += `"${item.periode}","${item.antallDager}","${item.antallIkkeHentet}"\n`;
      });
    }
    
    // laste ned
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `NordreFollo_data.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('Data eksportert til excel-fil', 'success');
    setIsOpen(false);
    setShowExportOptions(false);
  };

  // Function to generate PDF from data
  const handlePDFExport = () => {
    const doc = new jsPDF();

    if (exportOptions.includeReservations) {
      doc.text('RESERVASJONER', 10, 10);
      doc.text('Tittel, Forfatter, Låner-ID, Klar dato, Hentefrist, Hentet dato, Status, Dager på hylla, Hentenummer', 10, 20);
      materialData.forEach((item, index) => {
        doc.text(`${item.title}, ${item.author}, ${item.borrowerId}, ${item.readyDate}, ${item.expiryDate}, ${item.pickedUpDate || ''}, ${item.status}, ${item.daysOnShelf !== null ? item.daysOnShelf : ''}, ${item.pickupNumber}`, 10, 30 + (index * 10));
      });
      doc.addPage();
    }

    if (exportOptions.includeReminders) {
      doc.text('PÅMINNELSER', 10, 10);
      doc.text('Tittel, Forfatter, Låner-ID, Klar dato, Hentefrist, Påminnelse sendt, Status', 10, 20);
      reminderLogs.forEach((log, index) => {
        doc.text(`${log.title}, ${log.author}, ${log.borrowerId}, ${log.readyDate}, ${log.expiryDate}, ${log.reminderSentDate}, ${log.status}`, 10, 30 + (index * 10));
      });
      doc.addPage();
    }

    if (exportOptions.includeStatistics) {
      doc.text('STATISTIKK', 10, 10);
      doc.text('Periode, Gjennomsnittlig hentetid (dager), Antall ikke hentet', 10, 20);
      chartData.forEach((item, index) => {
        doc.text(`${item.periode}, ${item.antallDager}, ${item.antallIkkeHentet}`, 10, 30 + (index * 10));
      });
    }

    doc.save(`NordreFollo_data.pdf`);
    showToast('Data eksportert til PDF', 'success');
    setIsOpen(false);
    setShowExportOptions(false);
  };

  return (
    <div className="export-menu-container" ref={menuRef}>
      <button 
        className="export-menu-button" 
        onClick={toggleMenu}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <FiDownload className="button-icon" />
        <span className="button-text">Eksporter</span>
      </button>
      
      {isOpen && (
        <div className="export-menu-dropdown">
          <div className="export-menu-header">
          < h3 style={{ color: '#800020', opacity: 0.8, fontWeight: 200 }}> Eksporter data:    </h3>
            <button 
              className="export-options-button" 
              onClick={toggleOptions}
              aria-expanded={showExportOptions}
            >
              <FiSliders />
              <span>Alternativer</span>
            </button>
          </div>
          
          {showExportOptions ? (
            <div className="export-options-panel">
              <h4>Innhold</h4>
              <div className="export-option-group">
                <label className="export-option-checkbox">
                  <input 
                    type="checkbox" 
                    checked={exportOptions.includeReservations} 
                    onChange={() => updateExportOption('includeReservations', !exportOptions.includeReservations)}
                  />
                  <span className="checkbox-label">Reservasjoner</span>
                </label>
                
                <label className="export-option-checkbox">
                  <input 
                    type="checkbox" 
                    checked={exportOptions.includeReminders} 
                    onChange={() => updateExportOption('includeReminders', !exportOptions.includeReminders)}
                  />
                  <span className="checkbox-label">Påminnelser</span>
                </label>
                
                <label className="export-option-checkbox">
                  <input 
                    type="checkbox" 
                    checked={exportOptions.includeStatistics} 
                    onChange={() => updateExportOption('includeStatistics', !exportOptions.includeStatistics)}
                  />
                  <span className="checkbox-label">Statistikk</span>
                </label>
              </div>
              
              <h4>Datoformat</h4>
              <div className="export-option-group export-option-radio-group">
                <label className="export-option-radio">
                  <input 
                    type="radio" 
                    name="dateFormat" 
                    value="norwegian" 
                    checked={exportOptions.dateFormat === 'norwegian'} 
                    onChange={() => updateExportOption('dateFormat', 'norwegian')}
                  />
                  <span className="radio-label">Norsk (DD.MM.YYYY)</span>
                </label>
                
                <label className="export-option-radio">
                  <input 
                    type="radio" 
                    name="dateFormat" 
                    value="iso" 
                    checked={exportOptions.dateFormat === 'iso'} 
                    onChange={() => updateExportOption('dateFormat', 'iso')}
                  />
                  <span className="radio-label">ISO (YYYY-MM-DD)</span>
                </label>
              </div>
              
              <h4>Tidsperiode</h4>
              <div className="export-option-group export-option-radio-group">
                <label className="export-option-radio">
                  <input 
                    type="radio" 
                    name="dateRange" 
                    value="all" 
                    checked={exportOptions.dateRange === 'all'} 
                    onChange={() => updateExportOption('dateRange', 'all')}
                  />
                  <span className="radio-label">Alle data</span>
                </label>
                
                <label className="export-option-radio">
                  <input 
                    type="radio" 
                    name="dateRange" 
                    value="recent" 
                    checked={exportOptions.dateRange === 'recent'} 
                    onChange={() => updateExportOption('dateRange', 'recent')}
                  />
                  <span className="radio-label">Siste 30 dager</span>
                </label>
                
                <label className="export-option-radio">
                  <input 
                    type="radio" 
                    name="dateRange" 
                    value="custom" 
                    checked={exportOptions.dateRange === 'custom'} 
                    onChange={() => updateExportOption('dateRange', 'custom')}
                  />
                  <span className="radio-label">Egendefinert periode</span>
                </label>
              </div>
              
              {exportOptions.dateRange === 'custom' && (
                <div className="custom-date-range">
                  <div className="date-range-field">
                    <label htmlFor="fromDate">Fra:</label>
                    <div className="date-input-wrapper">
                      <FiCalendar className="date-icon" />
                      <input 
                        type="date" 
                        id="fromDate"
                        value={customDateRange.from}
                        onChange={(e) => setCustomDateRange({...customDateRange, from: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="date-range-field">
                    <label htmlFor="toDate">Til:</label>
                    <div className="date-input-wrapper">
                      <FiCalendar className="date-icon" />
                      <input 
                        type="date" 
                        id="toDate"
                        value={customDateRange.to}
                        onChange={(e) => setCustomDateRange({...customDateRange, to: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              <div className="export-options-actions">
                <button 
                  className="cancel-options-button" 
                  onClick={() => setShowExportOptions(false)}
                >
                  <FiX />
                  <span>Avbryt</span>
                </button>
                <button 
                  className="apply-options-button" 
                  onClick={() => setShowExportOptions(false)}
                >
                  <FiCheck />
                  <span>Bruk innstillinger</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="export-menu-options">
              <button 
                className="export-menu-item" 
                onClick={handleExport}
              >
                <FiFileText className="menu-icon" />
                <span className="menu-text">Eksporter som Excel-fil</span>
              </button>
              <button 
              className="export-menu-item" 
              onClick={handlePDFExport}
            >
              <FiFilePlus className="menu-icon" />
              <span className="menu-text">Eksporter som PDF-fil</span>
            </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

ExportMenu.propTypes = {
  materialData: PropTypes.array.isRequired,
  reminderLogs: PropTypes.array.isRequired,
  statisticsView: PropTypes.string.isRequired,
  chartData: PropTypes.array.isRequired,
  pickupTimeLimit: PropTypes.number.isRequired,
  reminderDays: PropTypes.number.isRequired,
  showToast: PropTypes.func.isRequired
};

export default ExportMenu;
