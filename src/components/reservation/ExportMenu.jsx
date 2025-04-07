// src/components/reservation/ExportMenu.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FiDownload, FiChevronDown, FiPrinter } from 'react-icons/fi';
import * as XLSX from 'xlsx';

function ExportMenu({ 
  materialData, 
  reminderLogs, 
  statisticsView, 
  chartData,
  pickupTimeLimit,
  reminderDays,
  showToast
}) {
  const [printMenuOpen, setPrintMenuOpen] = useState(false);

  // Print functionality
  const preparePrintView = (reportType) => {
    document.body.setAttribute('data-print-report', reportType);
    window.print();
    setTimeout(() => {
      document.body.removeAttribute('data-print-report');
    }, 1000);
  };
  
  const printReservationReport = () => {
    preparePrintView('reservations');
    setPrintMenuOpen(false);
  };
  
  const printStatisticsReport = () => {
    preparePrintView('statistics');
    setPrintMenuOpen(false);
  };
  
  const printReminderReport = () => {
    preparePrintView('reminders');
    setPrintMenuOpen(false);
  };

  // Export data to CSV
  const exportChartData = () => {
    // Create CSV with better organization
    const csvRows = [];
    
    // Add a title and timestamp
    csvRows.push('BIBLIOTEK RESERVASJONSDATA');
    csvRows.push(`Eksportert: ${new Date().toLocaleDateString('no-NO', { 
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    })}`);
    csvRows.push(''); // Empty row for spacing
    
    // Section 1: Summary statistics with clear section header
    csvRows.push('=== OPPSUMMERENDE STATISTIKK ===');
    csvRows.push('Nøkkeltall,Verdi,Enhet,Merknad');
    
    const averagePickupTime = materialData
      .filter(item => item.daysOnShelf !== null)
      .reduce((sum, item) => sum + item.daysOnShelf, 0) / 
      materialData.filter(item => item.daysOnShelf !== null).length || 0;
    
    const notPickedUpRate = (materialData.filter(item => item.status === 'Utløpt').length / materialData.length) * 100;
    
    csvRows.push(`Gjennomsnittlig hentetid,${averagePickupTime.toFixed(1)},dager,"Gjennomsnitt for alle hentede reservasjoner"`);
    csvRows.push(`Andel ikke-hentet materiale,${notPickedUpRate.toFixed(1)},prosent,"Prosent av reservasjoner som utløper uten å bli hentet"`);
    csvRows.push(`Hentefrist,${pickupTimeLimit},dager,"Antall dager en reservasjon kan vente på hentehyllen"`);
    csvRows.push(`Påminnelse sendes,${reminderDays},dager,"Antall dager før utløp når påminnelse sendes"`);
    csvRows.push(''); // Empty row for spacing
    
    // Section 2: Chart data with better headers
    csvRows.push('=== AGGREGERT STATISTIKK ===');
    csvRows.push(`Periode: ${statisticsView === 'weekly' ? 'Ukentlig' : statisticsView === 'monthly' ? 'Månedlig' : 'Årlig'}`);
    
    if (chartData.length > 0) {
      // More descriptive headers
      csvRows.push('Periode,Gjennomsnittlig hentetid (dager),Antall ikke-hentet materiale');
      chartData.forEach(row => {
        csvRows.push(`${row.periode},${row.antallDager},${row.antallIkkeHentet}`);
      });
    }
    csvRows.push(''); // Empty row for spacing
    
    // Section 3: Reservation info with better formatting
    csvRows.push('=== DETALJERT RESERVASJONSINFORMASJON ===');
    if (materialData.length > 0) {
      csvRows.push('ID,Tittel,Forfatter,Lånernummer,Låner navn,Reservert dato,Klar dato,Hentefrist,Hentet dato,Status,Dager på hylle,Hentenummer');
      materialData.forEach(item => {
        csvRows.push([
          item.id,
          `"${item.title}"`,
          `"${item.author}"`,
          item.borrowerId,
          `"${item.borrowerName || ''}"`,
          item.reservedDate || '',
          item.readyDate || '',
          item.expiryDate || '',
          item.pickedUpDate || '',
          item.status,
          item.daysOnShelf !== null ? item.daysOnShelf : '',
          item.pickupNumber
        ].join(','));
      });
    }
    csvRows.push(''); // Empty row for spacing
    
    // Section 4: Reminder logs with better organization
    csvRows.push('=== PÅMINNELSESLOGG ===');
    if (reminderLogs.length > 0) {
      csvRows.push('ID,Tittel,Forfatter,Lånernummer,Låner navn,Klar dato,Utløpsdato,Påminnelse sendt,Status');
      reminderLogs.forEach(log => {
        csvRows.push([
          log.id,
          `"${log.title}"`,
          `"${log.author}"`,
          log.borrowerId,
          `"${log.borrowerName || ''}"`,
          log.readyDate || '',
          log.expiryDate || '',
          log.reminderSentDate || '',
          log.status
        ].join(','));
      });
    } else {
      csvRows.push('Ingen påminnelser er sendt ennå.');
    }
    
    // Add explanatory notes at the end
    csvRows.push('');
    csvRows.push('=== FORKLARINGER ===');
    csvRows.push('"Status","Forklaring"');
    csvRows.push('"Venter","Reservasjonen er klar for henting og venter på låner"');
    csvRows.push('"Hentet","Reservasjonen er hentet av låner"');
    csvRows.push('"Utløpt","Reservasjonen ble ikke hentet innen fristen"');
    csvRows.push('');
    csvRows.push('"Dager på hylle","Antall dager fra reservasjonen var klar til den ble hentet"');
    
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
    
    showToast('Eksport fullført. CSV-filen er lastet ned.', 'success');
    setPrintMenuOpen(false);
  };

 // src/components/reservation/ExportMenu.jsx (continued)
  // Export data to Excel
  const exportExcelData = () => {
    // Create workbook
    const wb = XLSX.utils.book_new();
    
    // Add a summary sheet
    const summaryData = [
      ['BIBLIOTEK RESERVASJONSDATA'],
      [`Eksportert: ${new Date().toLocaleDateString('no-NO', { 
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
      })}`],
      [''],
      ['OPPSUMMERENDE STATISTIKK'],
      ['Nøkkeltall', 'Verdi', 'Enhet', 'Merknad'],
      ['Gjennomsnittlig hentetid', 
        materialData.filter(item => item.daysOnShelf !== null).reduce((sum, item) => sum + item.daysOnShelf, 0) / 
        materialData.filter(item => item.daysOnShelf !== null).length || 0, 
        'dager', 'Gjennomsnitt for alle hentede reservasjoner'],
      ['Andel ikke-hentet materiale', 
        (materialData.filter(item => item.status === 'Utløpt').length / materialData.length) * 100, 
        'prosent', 'Prosent av reservasjoner som utløper uten å bli hentet'],
      ['Hentefrist', pickupTimeLimit, 'dager', 'Antall dager en reservasjon kan vente på hentehyllen'],
      ['Påminnelse sendes', reminderDays, 'dager', 'Antall dager før utløp når påminnelse sendes']
    ];
    
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summarySheet, 'Sammendrag');
    
    // Add a statistics sheet
    const statsData = [
      [`STATISTIKK (${statisticsView === 'weekly' ? 'Ukentlig' : statisticsView === 'monthly' ? 'Månedlig' : 'Årlig'})`],
      [''],
      ['Periode', 'Gjennomsnittlig hentetid (dager)', 'Antall ikke-hentet materiale']
    ];
    
    chartData.forEach(row => {
      statsData.push([row.periode, row.antallDager, row.antallIkkeHentet]);
    });
    
    const statsSheet = XLSX.utils.aoa_to_sheet(statsData);
    XLSX.utils.book_append_sheet(wb, statsSheet, 'Statistikk');
    
    // Add a reservations sheet
    const reservationsData = [
      ['DETALJERT RESERVASJONSINFORMASJON'],
      [''],
      ['ID', 'Tittel', 'Forfatter', 'Lånernummer', 'Låner navn', 'Reservert dato', 'Klar dato', 'Hentefrist', 'Hentet dato', 'Status', 'Dager på hylle', 'Hentenummer']
    ];
    
    materialData.forEach(item => {
      reservationsData.push([
        item.id,
        item.title,
        item.author,
        item.borrowerId,
        item.borrowerName || '',
        item.reservedDate || '',
        item.readyDate || '',
        item.expiryDate || '',
        item.pickedUpDate || '',
        item.status,
        item.daysOnShelf !== null ? item.daysOnShelf : '',
        item.pickupNumber
      ]);
    });
    
    const reservationsSheet = XLSX.utils.aoa_to_sheet(reservationsData);
    XLSX.utils.book_append_sheet(wb, reservationsSheet, 'Reservasjoner');
    
    // Add a reminders sheet
    const remindersData = [
      ['PÅMINNELSESLOGG'],
      [''],
      ['ID', 'Tittel', 'Forfatter', 'Lånernummer', 'Låner navn', 'Klar dato', 'Utløpsdato', 'Påminnelse sendt', 'Status']
    ];
    
    if (reminderLogs.length > 0) {
      reminderLogs.forEach(log => {
        remindersData.push([
          log.id,
          log.title,
          log.author,
          log.borrowerId,
          log.borrowerName || '',
          log.readyDate || '',
          log.expiryDate || '',
          log.reminderSentDate || '',
          log.status
        ]);
      });
    } else {
      remindersData.push(['Ingen påminnelser er sendt ennå.', '', '', '', '', '', '', '']);
    }
    
    const remindersSheet = XLSX.utils.aoa_to_sheet(remindersData);
    XLSX.utils.book_append_sheet(wb, remindersSheet, 'Påminnelser');
    
    // Add a help sheet with explanations
    const helpData = [
      ['FORKLARINGER OG HJELP'],
      [''],
      ['Status', 'Forklaring'],
      ['Venter', 'Reservasjonen er klar for henting og venter på låner'],
      ['Hentet', 'Reservasjonen er hentet av låner'],
      ['Utløpt', 'Reservasjonen ble ikke hentet innen fristen'],
      [''],
      ['Felt', 'Forklaring'],
      ['Dager på hylle', 'Antall dager fra reservasjonen var klar til den ble hentet'],
      ['Hentenummer', 'Unikt nummer som identifiserer reservasjonen på hentehyllen']
    ];
    
    const helpSheet = XLSX.utils.aoa_to_sheet(helpData);
    XLSX.utils.book_append_sheet(wb, helpSheet, 'Hjelp');
    
    // Apply some basic styling (column widths)
    const setColumnWidth = (sheet, cols) => {
      const colWidth = [];
      for (const col in cols) {
        colWidth.push({ wch: cols[col] });
      }
      sheet['!cols'] = colWidth;
    };
    
    setColumnWidth(reservationsSheet, [10, 30, 20, 15, 20, 15, 15, 15, 15, 15, 15, 15]);
    
    // Generate Excel file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    XLSX.writeFile(wb, `bibliotek-reservasjonsdata-${timestamp}.xlsx`);
    
    showToast('Eksport fullført. Excel-filen er lastet ned.', 'success');
    setPrintMenuOpen(false);
  };

  return (
    <div className="print-export-menu">
      <button 
        className="btn-export" 
        onClick={() => setPrintMenuOpen(!printMenuOpen)}
        aria-expanded={printMenuOpen}
      >
        <FiDownload className="icon" />
        Eksporter/Skriv ut
        <FiChevronDown className={`dropdown-icon ${printMenuOpen ? 'open' : ''}`} />
      </button>
      
      {printMenuOpen && (
        <div className="print-options">
          <button className="btn-print" onClick={exportChartData}>
            <FiDownload className="icon" />
            Eksporter til CSV
          </button>
          <button className="btn-print" onClick={exportExcelData}>
            <FiDownload className="icon" />
            Eksporter til Excel
          </button>
          <div className="print-options-divider"></div>
          <button className="btn-print" onClick={printStatisticsReport}>
            <FiPrinter className="icon" />
            Skriv ut statistikk
          </button>
          <button className="btn-print" onClick={printReservationReport}>
            <FiPrinter className="icon" />
            Skriv ut reservasjonsliste
          </button>
          <button className="btn-print" onClick={printReminderReport}>
            <FiPrinter className="icon" />
            Skriv ut påminnelseslogg
          </button>
        </div>
      )}
    </div>
  );
}

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