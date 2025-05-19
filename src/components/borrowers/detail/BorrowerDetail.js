// src/components/borrowers/detail/BorrowerDetail.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BorrowerInfoCard from './BorrowerInfoCard';
import FavoriteAuthors from './FavoriteAuthors';
import FavoriteGenres from './FavoriteGenres';
import TabNavigation from './TabNavigation';
import ReservationsTable from './ReservationsTable.js';
import HistoryTable from './HistoryTable.js';
import MessagesSection from './MessagesSection';
import { formatDate, calculateDaysBetween, generateRandomGenres } from '../utils/formatUtils';
import NoDataMessage from '../common/NoDataMessage.js';

function BorrowerDetail({ borrowerId, mockData }) {
  const [activeTab, setActiveTab] = useState('reservations');
  const [borrowerInfo, setBorrowerInfo] = useState({});
  const [borrowerReservations, setBorrowerReservations] = useState([]);
  const [borrowerHistory, setBorrowerHistory] = useState([]);
  const [borrowerMessages, setBorrowerMessages] = useState([]);
  
  useEffect(() => {
    // Find data for this specific borrower
    const borrowerItems = mockData.filter(item => item.borrower.id === borrowerId);
    
    if (borrowerItems.length > 0) {
      processBorrowerData(borrowerItems);
    } else {
      setDefaultBorrowerData();
    }
  }, [borrowerId, mockData]);

  const processBorrowerData = (borrowerItems) => {
    // Process borrower info from the first matching item
    const firstItem = borrowerItems[0];
    setBorrowerInfo({
      name: firstItem.borrower.name,
      membership: 'Aktiv',
      contact: firstItem.borrower.email,
      mobil: firstItem.borrower.phone,
      address: firstItem.borrower.address,
      birthDate: formatDate(firstItem.borrower.birthDate),
      totalBooks: firstItem.borrower.totalBooks,
      averageRentalTime: `${firstItem.borrower.averageRentalTime} dager`,
      libraryAffiliation: firstItem.borrower.libraryAffiliation,
      favoriteAuthors: firstItem.borrower.favoriteAuthors,
      favoriteGenres: generateRandomGenres()
    });
    
    // Process reservations
    setBorrowerReservations(
      borrowerItems
        .filter(item => item.status === 'VENTER' || item.status === 'HENTET')
        .map(item => ({
          id: item.id,
          title: item.title,
          author: item.author,
          reservedDate: formatDate(item.reservedDate),
          readyDate: formatDate(item.readyDate),
          pickedUpDate: formatDate(item.pickedUpDate),
          status: item.status,
          daysOnShelf: item.pickedUpDate ? 
            calculateDaysBetween(item.readyDate, item.pickedUpDate) : 
            calculateDaysBetween(item.readyDate, new Date().toISOString())
        }))
    );
    
    // Process history
    setBorrowerHistory(
      borrowerItems
        .filter(item => item.status === 'HENTET')
        .map(item => ({
          id: item.id,
          title: item.title,
          author: item.author,
          borrowedDate: formatDate(item.pickedUpDate),
          returnedDate: formatDate(item.pickedUpDate) // We don't have returned date in mockdata
        }))
    );
    
    // Generate messages
    const messages = generateMessagesForBorrower(borrowerItems, firstItem.borrower.name);
    setBorrowerMessages(messages);
  };

  const setDefaultBorrowerData = () => {
    // No data found for this borrower, set default values
    setBorrowerInfo({
      name: "Ukjent låner",
      membership: "Inaktiv",
      contact: "Ingen kontaktinfo",
      mobil: "Ingen mobilnummer"
    });
    setBorrowerReservations([]);
    setBorrowerHistory([]);
    setBorrowerMessages([]);
  };

  const generateMessagesForBorrower = (borrowerItems, borrowerName) => {
    const messages = [];
    
    // Reminder messages for waiting items
    const waitingItems = borrowerItems.filter(item => item.status === 'VENTER');
    if (waitingItems.length > 0) {
      waitingItems.forEach(item => {
        messages.push({
          id: `msg-reminder-${item.id}`,
          date: formatDate(new Date().toISOString()),
          subject: 'Påminnelse om reservering',
          message: `Hei, ${borrowerName}. Det er 2 dager igjen av hentefristen på din reservering: «${item.title}» av ${item.author}. Siste frist: ${formatDate(item.readyDate)}. Hylle: ${item.pickupNumber}. Velkommen innom! Hilsen Nordre Follo Bibliotek`,
          sentVia: ['melding', 'epost']
        });
      });
    }
    
    // Overdue messages for expired items
    const expiredItems = borrowerItems.filter(item => item.status === 'UTLØPT');
    if (expiredItems.length > 0) {
      expiredItems.forEach(item => {
        messages.push({
          id: `msg-overdue-${item.id}`,
          date: formatDate(new Date().toISOString()),
          subject: 'Forsinket innlevering',
          message: `Hei, ${borrowerName}. Boken «${item.title}» av ${item.author} skulle vært levert for 6 dager siden. Lever snarest for å unngå purregebyr på 100 kr. Hilsen Nordre Follo Bibliotek.`,
          sentVia: ['melding', 'epost']
        });
      });
    }
    
    // Add a general message if we don't have any specific ones
    if (messages.length === 0) {
      messages.push({
        id: 'msg-general',
        date: formatDate(new Date().toISOString()),
        subject: 'Velkommen til biblioteket',
        message: `Hei, ${borrowerName}. Takk for at du bruker Nordre Follo Bibliotek. Husk at du kan fornye dine lån på nett eller i vår app. Hilsen Nordre Follo Bibliotek.`,
        sentVia: ['epost']
      });
    }
    
    return messages;
  };

  // Render different content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'reservations':
        return borrowerReservations.length > 0 ? (
          <ReservationsTable reservations={borrowerReservations} />
        ) : (
          <NoDataMessage message="Ingen aktive reservasjoner" />
        );
      case 'history':
        return borrowerHistory.length > 0 ? (
          <HistoryTable history={borrowerHistory} />
        ) : (
          <NoDataMessage message="Ingen lånehistorikk" />
        );
      case 'messages':
        return borrowerMessages.length > 0 ? (
          <MessagesSection messages={borrowerMessages} />
        ) : (
          <NoDataMessage message="Ingen meldinger" />
        );
      default:
        return <NoDataMessage message="Ingen data å vise" />;
    }
  };

  return (
    <>
      <div className="page-header">
        <h1>Låner: {borrowerInfo.name}</h1>
      </div>
      
      <BorrowerInfoCard borrowerInfo={borrowerInfo} borrowerId={borrowerId} />
      
      <FavoriteAuthors authors={borrowerInfo.favoriteAuthors} />
      
      <FavoriteGenres genres={borrowerInfo.favoriteGenres} />
      
      <TabNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        tabs={[
          { id: 'reservations', label: 'Reservasjoner' },
          { id: 'history', label: 'Historikk' },
          { id: 'messages', label: 'Meldinger' }
        ]} 
      />
      
      {renderTabContent()}
      
      <div className="navigation-link">
        <Link to="/laaner">← Tilbake til låneroversikt</Link>
      </div>
    </>
  );
}

export default BorrowerDetail;