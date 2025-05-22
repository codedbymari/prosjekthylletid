// src/components/BorrowerDashboard.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { generateMockData } from '../../utils/mockData';
import './BorrowerDashboard.css';

// Hjelpefunksjon for å formatere datoer
const formatDate = (isoDate) => {
  if (!isoDate) return null;
  const date = new Date(isoDate);
  return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
};

// Hjelpefunksjon for å beregne dager mellom datoer
const calculateDaysBetween = (startDate, endDate) => {
  if (!startDate || !endDate) return null;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Hjelpefunksjon for å generere tilfeldige favorittsjangere
const generateRandomGenres = () => {
  const allGenres = [
    'Krim', 'Roman', 'Biografi', 'Fantasy', 'Science Fiction', 
    'Historisk', 'Drama', 'Thriller', 'Ungdom', 'Barn', 
    'Poesi', 'Reise', 'Kokebok', 'Selvhjelp', 'Faglitteratur'
  ];
  
  // Velg tilfeldig antall sjangere (2 eller 3)
  const numGenres = Math.random() < 0.5 ? 2 : 3;
  
  // Bland arrayen og velg de første numGenres elementene
  const shuffled = [...allGenres].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numGenres);
};

// Hjelpefunksjon for å generere unike lånere fra reservasjonsdata
const generateUniqueBorrowers = (reservations) => {
  const borrowerMap = new Map();
  
  reservations.forEach(reservation => {
    const borrower = reservation.borrower;
    if (!borrowerMap.has(borrower.id)) {
      borrowerMap.set(borrower.id, {
        id: borrower.id,
        name: borrower.name,
        email: borrower.email,
        phone: borrower.phone,
        address: borrower.address,
        birthDate: borrower.birthDate,
        totalBooks: borrower.totalBooks,
        averageRentalTime: borrower.averageRentalTime,
        libraryAffiliation: borrower.libraryAffiliation,
        favoriteAuthors: borrower.favoriteAuthors
      });
    }
  });
  
  return Array.from(borrowerMap.values());
};

// Borrower Details Component (used in both modal and full page)
const BorrowerDetails = ({ 
  borrowerInfo, 
  borrowerId, 
  activeTab, 
  setActiveTab, 
  borrowerReservations, 
  borrowerHistory, 
  borrowerMessages, 
  isLoading,
  isModal = false,
  onExpandToFullPage = null,
  onClose = null 
}) => {
  if (isLoading) {
    return (
      <div className="loading-indicator">
        <div className="spinner"></div>
        <p>Laster lånerinformasjon...</p>
      </div>
    );
  }

  return (
    <div className={`borrower-dashboard-wrapper ${isModal ? 'modal-content' : ''}`}>
      <div className="page-header">
        <h1>Låner: {borrowerInfo.name}</h1>
        {isModal && (
          <div className="modal-actions">
            <button 
              className="expand-button" 
              onClick={onExpandToFullPage}
              title="Åpne i full side"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15,3 21,3 21,9"></polyline>
                <polyline points="9,21 3,21 3,15"></polyline>
                <line x1="21" y1="3" x2="14" y2="10"></line>
                <line x1="3" y1="21" x2="10" y2="14"></line>
              </svg>
            </button>
            <button 
              className="close-button" 
              onClick={onClose}
              title="Lukk"
            >
              ×
            </button>
          </div>
        )}
      </div>
      
      {/* Borrower Info Section */}
      <div className="borrower-info-card">
        <div className="borrower-info-header">
          <h2>Lånerinformasjon</h2>
        </div>
        <div className="borrower-info-content two-columns">
          <div className="info-column">
            <div className="info-item">
              <span className="info-label">Lånernummer:</span>
              <span className="info-value">{borrowerId}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Epost:</span>
              <span className="info-value">{borrowerInfo.contact}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Mobil:</span>
              <span className="info-value">{borrowerInfo.mobil}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Adresse:</span>
              <span className="info-value">{borrowerInfo.address}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Fødselsdato:</span>
              <span className="info-value">{borrowerInfo.birthDate}</span>
            </div>
          </div>
          <div className="info-column">
            <div className="info-item">
              <span className="info-label">Totalt antall bøker:</span>
              <span className="info-value">{borrowerInfo.totalBooks}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Medlemskap:</span>
              <span className="info-value membership-badge">{borrowerInfo.membership}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Bibliotek:</span>
              <span className="info-value library-badge">{borrowerInfo.libraryAffiliation}</span>
            </div>
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
                    <td className={`status-${item.status.toLowerCase()}`}>{item.status}</td>
                    <td>{item.daysOnShelf || '—'}</td>
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
                    <td>{item.returnedDate || '—'}</td>
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

      {!isModal && (
        <div className="navigation-link">
          <Link to="/laaner">← Tilbake til låneroversikt</Link>
        </div>
      )}
    </div>
  );
};

function BorrowerDashboard() {
  // Hent borrowerId fra URL-parameteren
  const { borrowerId } = useParams();
  const navigate = useNavigate();
  
  // State for detaljvisning
  const [activeTab, setActiveTab] = useState('reservations');
  const [borrowerInfo, setBorrowerInfo] = useState({});
  const [borrowerReservations, setBorrowerReservations] = useState([]);
  const [borrowerHistory, setBorrowerHistory] = useState([]);
  const [borrowerMessages, setBorrowerMessages] = useState([]);
  
  // State for oversiktssiden
  const [allBorrowers, setAllBorrowers] = useState([]);
  const [allReservations, setAllReservations] = useState([]);
  
  // Modal state
  const [selectedBorrowerId, setSelectedBorrowerId] = useState(null);
  const [modalBorrowerInfo, setModalBorrowerInfo] = useState({});
  const [modalBorrowerReservations, setModalBorrowerReservations] = useState([]);
  const [modalBorrowerHistory, setModalBorrowerHistory] = useState([]);
  const [modalBorrowerMessages, setModalBorrowerMessages] = useState([]);
  const [modalActiveTab, setModalActiveTab] = useState('reservations');
  const [isModalLoading, setIsModalLoading] = useState(false);
  
  // Felles state
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Funksjon for å laste lånerdata
  const loadBorrowerData = (targetBorrowerId, isForModal = false) => {
    const mockData = generateMockData();
    const borrowerItems = mockData.filter(item => item.borrower.id === targetBorrowerId);
    
    if (borrowerItems.length > 0) {
      const firstItem = borrowerItems[0];
      const borrowerData = {
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
      };
      
      const reservations = borrowerItems
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
        }));
      
      const history = borrowerItems
        .filter(item => item.status === 'HENTET')
        .map(item => ({
          id: item.id,
          title: item.title,
          author: item.author,
          borrowedDate: formatDate(item.pickedUpDate),
          returnedDate: formatDate(item.pickedUpDate)
        }));
      
      // Generate messages
      const messages = [];
      const waitingItems = borrowerItems.filter(item => item.status === 'VENTER');
      if (waitingItems.length > 0) {
        waitingItems.forEach(item => {
          messages.push({
            id: `msg-reminder-${item.id}`,
            date: formatDate(new Date().toISOString()),
            subject: 'Påminnelse om reservering',
            message: `Hei, ${firstItem.borrower.name}. Det er 2 dager igjen av hentefristen på din reservering: «${item.title}» av ${item.author}. Siste frist: ${formatDate(item.readyDate)}. Hylle: ${item.pickupNumber}. Velkommen innom! Hilsen Nordre Follo Bibliotek`,
            sentVia: ['melding', 'epost']
          });
        });
      }
      
      const expiredItems = borrowerItems.filter(item => item.status === 'UTLØPT');
      if (expiredItems.length > 0) {
        expiredItems.forEach(item => {
          messages.push({
            id: `msg-overdue-${item.id}`,
            date: formatDate(new Date().toISOString()),
            subject: 'Forsinket innlevering',
            message: `Hei, ${firstItem.borrower.name}. Boken «${item.title}» av ${item.author} skulle vært levert for 6 dager siden. Lever snarest for å unngå purregebyr på 100 kr. Hilsen Nordre Follo Bibliotek.`,
            sentVia: ['melding', 'epost']
          });
        });
      }
      
      if (messages.length === 0) {
        messages.push({
          id: 'msg-general',
          date: formatDate(new Date().toISOString()),
          subject: 'Velkommen til biblioteket',
          message: `Hei, ${firstItem.borrower.name}. Takk for at du bruker Nordre Follo Bibliotek. Husk at du kan fornye dine lån på nett eller i vår app. Hilsen Nordre Follo Bibliotek.`,
          sentVia: ['epost']
        });
      }
      
      if (isForModal) {
        setModalBorrowerInfo(borrowerData);
        setModalBorrowerReservations(reservations);
        setModalBorrowerHistory(history);
        setModalBorrowerMessages(messages);
      } else {
        setBorrowerInfo(borrowerData);
        setBorrowerReservations(reservations);
        setBorrowerHistory(history);
        setBorrowerMessages(messages);
      }
    } else {
      const defaultData = {
        name: "Ukjent låner",
        membership: "Inaktiv",
        contact: "Ingen kontaktinfo",
        mobil: "Ingen mobilnummer"
      };
      
      if (isForModal) {
        setModalBorrowerInfo(defaultData);
        setModalBorrowerReservations([]);
        setModalBorrowerHistory([]);
        setModalBorrowerMessages([]);
      } else {
        setBorrowerInfo(defaultData);
        setBorrowerReservations([]);
        setBorrowerHistory([]);
        setBorrowerMessages([]);
      }
    }
  };

  useEffect(() => {
    setIsLoading(true);
    
    const fetchTimer = setTimeout(() => {
      const mockData = generateMockData();
      setAllReservations(mockData);
      
      const uniqueBorrowers = generateUniqueBorrowers(mockData);
      setAllBorrowers(uniqueBorrowers);
      
      if (borrowerId) {
        loadBorrowerData(borrowerId, false);
      }
      
      setIsLoading(false);
    }, 600);
    
    return () => clearTimeout(fetchTimer);
  }, [borrowerId]);

  // Modal handlers
  const openModal = (borrowerIdToOpen) => {
    setSelectedBorrowerId(borrowerIdToOpen);
    setModalActiveTab('reservations');
    setIsModalLoading(true);
    
    setTimeout(() => {
      loadBorrowerData(borrowerIdToOpen, true);
      setIsModalLoading(false);
    }, 300);
  };

  const closeModal = () => {
    setSelectedBorrowerId(null);
    setModalBorrowerInfo({});
    setModalBorrowerReservations([]);
    setModalBorrowerHistory([]);
    setModalBorrowerMessages([]);
  };

  const expandToFullPage = () => {
    navigate(`/laaner/${selectedBorrowerId}`);
    closeModal();
  };

  // Søkefunksjonalitet for lånere
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredBorrowers = allBorrowers.filter(borrower => {
    const searchLower = searchTerm.toLowerCase();
    return (
      borrower.id.toLowerCase().includes(searchLower) ||
      borrower.name.toLowerCase().includes(searchLower)
    );
  });

  // Hvis vi har en borrowerId, vis detaljsiden (full page)
  if (borrowerId) {
    return (
      <BorrowerDetails
        borrowerInfo={borrowerInfo}
        borrowerId={borrowerId}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        borrowerReservations={borrowerReservations}
        borrowerHistory={borrowerHistory}
        borrowerMessages={borrowerMessages}
        isLoading={isLoading}
        isModal={false}
      />
    );
  }
  
  // Lånersøkesiden med modal
  return (
    <>
      <div className="borrowers-search">
        <div className="page-header">
          <h1>Søk etter lånere</h1>
        </div>
        
        <div className="search-container-borrower">
          <input 
            type="text" 
            placeholder="Søk etter lånenummer eller navn..." 
            className="search-input-borrower"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        {isLoading ? (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>Laster lånere...</p>
          </div>
        ) : (
          <div className="borrowers-results">
            {searchTerm.length > 0 ? (
              filteredBorrowers.length > 0 ? (
                <div className="borrowers-list">
                  <h2>Søkeresultater ({filteredBorrowers.length})</h2>
                  <div className="borrowers-list-container">
                    {filteredBorrowers.map((borrower) => (
                      <div 
                        key={borrower.id}
                        className="borrower-list-item"
                        onClick={() => openModal(borrower.id)}
                      >
                        <div className="borrower-list-id">{borrower.id}</div>
                        <div className="borrower-list-name">{borrower.name}</div>
                        <div className="borrower-list-email">{borrower.email}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="no-results">
                  <p>Ingen lånere funnet for søket "{searchTerm}"</p>
                </div>
              )
            ) : (
              <div className="search-help">
                <p>Skriv inn lånenummer eller navn for å søke etter lånere</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedBorrowerId && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <BorrowerDetails
              borrowerInfo={modalBorrowerInfo}
              borrowerId={selectedBorrowerId}
              activeTab={modalActiveTab}
              setActiveTab={setModalActiveTab}
              borrowerReservations={modalBorrowerReservations}
              borrowerHistory={modalBorrowerHistory}
              borrowerMessages={modalBorrowerMessages}
              isLoading={isModalLoading}
              isModal={true}
              onExpandToFullPage={expandToFullPage}
              onClose={closeModal}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default BorrowerDashboard;