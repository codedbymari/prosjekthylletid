// src/components/BorrowerDashboard.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { generateMockData } from '../mockData'; // Importer mock data funksjonen
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

function BorrowerDashboard() {
  // Hent borrowerId fra URL-parameteren
  const { borrowerId } = useParams();
  
  // State for detaljvisning
  const [activeTab, setActiveTab] = useState('reservations');
  const [borrowerInfo, setBorrowerInfo] = useState({});
  const [borrowerReservations, setBorrowerReservations] = useState([]);
  const [borrowerHistory, setBorrowerHistory] = useState([]);
  const [borrowerMessages, setBorrowerMessages] = useState([]);
  
  // State for oversiktssiden
  const [allReservations, setAllReservations] = useState([]);
  
  // Felles state
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulerer API-kall med lastestatus
    setIsLoading(true);
    
    // Simuler nettverksforsinkelse for realistisk brukeropplevelse
    const fetchTimer = setTimeout(() => {
      // Hent mock data
      const mockData = generateMockData();
      
      // Lagre alle reservasjoner for oversiktssiden
      setAllReservations(mockData);
      
      // Hvis vi er på detaljsiden (har borrowerId)
      if (borrowerId) {
        // Finn reservasjoner for denne låneren
        const borrowerItems = mockData.filter(item => item.borrower.id === borrowerId);
        
        // Hvis vi fant reservasjoner for denne låneren
        if (borrowerItems.length > 0) {
          // Hent lånerinfo fra første reservasjon
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
          
          // Organiser data for de ulike fanene
          // Aktive reservasjoner (ikke returnert)
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
          
          // Historikk (alle hentede elementer for denne demo)
          setBorrowerHistory(
            borrowerItems
              .filter(item => item.status === 'HENTET')
              .map(item => ({
                id: item.id,
                title: item.title,
                author: item.author,
                borrowedDate: formatDate(item.pickedUpDate),
                returnedDate: formatDate(item.pickedUpDate) // Vi har ikke returnert dato i mockdata, så vi bruker hentet dato + 14 dager
              }))
          );
          
          // Generer meldinger basert på lånerens aktiviteter
          const messages = [];
          
          // Påminnelse om reservering for ventende elementer
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
          
          // Forsinket innlevering for utløpte elementer
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
          
          // Legg til en generell melding hvis vi ikke har noen spesifikke
          if (messages.length === 0) {
            messages.push({
              id: 'msg-general',
              date: formatDate(new Date().toISOString()),
              subject: 'Velkommen til biblioteket',
              message: `Hei, ${firstItem.borrower.name}. Takk for at du bruker Nordre Follo Bibliotek. Husk at du kan fornye dine lån på nett eller i vår app. Hilsen Nordre Follo Bibliotek.`,
              sentVia: ['epost']
            });
          }
          
          setBorrowerMessages(messages);
        } else {
          // Ingen data funnet for denne låneren, sett standardverdier
          setBorrowerInfo({
            name: "Ukjent låner",
            membership: "Inaktiv",
            contact: "Ingen kontaktinfo",
            mobil: "Ingen mobilnummer"
          });
          setBorrowerReservations([]);
          setBorrowerHistory([]);
          setBorrowerMessages([]);
        }
      }
      
      setIsLoading(false);
    }, 600);
    
    // Rydd opp timer ved avmontering av komponenten
    return () => clearTimeout(fetchTimer);
  }, [borrowerId]); // Kjør på nytt når borrowerId endres

  // Søkefunksjonalitet
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredReservations = allReservations.filter(reservation => {
    const searchLower = searchTerm.toLowerCase();
    return (
      reservation.title.toLowerCase().includes(searchLower) ||
      reservation.author.toLowerCase().includes(searchLower) ||
      reservation.borrower.id.toLowerCase().includes(searchLower) ||
      reservation.borrower.name.toLowerCase().includes(searchLower) ||
      reservation.status.toLowerCase().includes(searchLower)
    );
  });

  // Hvis vi har en borrowerId, vis detaljsiden
  if (borrowerId) {
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
              <h1>Låner: {borrowerInfo.name}</h1>
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
                    <span className="info-label">Gjennomsnittlig utlånstid:</span>
                    <span className="info-value">{borrowerInfo.averageRentalTime}</span>
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

            {/* Favorite Author Section */}
            <div className="favorite-author-card">
              <div className="favorite-author-header">
                <h2>Favorittforfattere</h2>
              </div>
              <div className="favorite-author-content">
                <div className="authors-list">
                  {borrowerInfo.favoriteAuthors && borrowerInfo.favoriteAuthors.map((author, index) => (
                    <div key={index} className="author-info">
                      <span className="author-name">{author}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Favorite Genres Section */}
            <div className="favorite-genres-card">
              <div className="favorite-genres-header">
                <h2>Favorittsjangere</h2>
              </div>
              <div className="favorite-genres-content">
                <div className="genres-list">
                  {borrowerInfo.favoriteGenres && borrowerInfo.favoriteGenres.map((genre, index) => (
                    <div key={index} className="genre-info">
                      <span className="genre-name">{genre}</span>
                    </div>
                  ))}
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

            <div className="navigation-link">
              <Link to="/låner">← Tilbake til låneroversikt</Link>
            </div>
          </>
        )}
      </div>
    );
  }
  
  // Hvis ingen borrowerId, vis oversiktssiden
  return (
    <div className="borrowers-list">
      <div className="page-header">
        <h1>Lånere</h1>
      </div>
      
      <div className="search-container">
        <input 
          type="text" 
          placeholder="Søk etter tittel, forfatter, låner..." 
          className="search-input"
          value={searchTerm}
          onChange={handleSearch}
        />
        <button className="filter-button">Alle statuser</button>
      </div>
      
      <div className="table-responsive">
        <table className="borrowers-table">
          <thead>
            <tr>
              <th>Tittel</th>
              <th>Forfatter</th>
              <th>Låner</th>
              <th>Klar dato</th>
              <th>Hentefrist</th>
              <th>Hentet dato</th>
              <th>Status</th>
              <th>Dager</th>
              <th>Hentenr.</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="9" className="loading-cell">Laster data...</td>
              </tr>
            ) : filteredReservations.length > 0 ? (
              filteredReservations.map((reservation) => {
                // Beregn dager mellom klar dato og hentet dato, eller dagens dato hvis ikke hentet
                const days = reservation.pickedUpDate ? 
                  calculateDaysBetween(reservation.readyDate, reservation.pickedUpDate) : 
                  calculateDaysBetween(reservation.readyDate, new Date().toISOString());
                
                return (
                  <tr key={reservation.id}>
                    <td>{reservation.title}</td>
                    <td>{reservation.author}</td>
                    <td>
                      <Link to={`/låner/${reservation.borrower.id}`} className="borrower-link">
                        {reservation.borrower.id}
                      </Link>
                    </td>
                    <td>{formatDate(reservation.readyDate)}</td>
                    <td>{formatDate(reservation.reservedDate)}</td>
                    <td>{formatDate(reservation.pickedUpDate) || '—'}</td>
                    <td className={`status-${reservation.status.toLowerCase()}`}>{reservation.status}</td>
                    <td>{days || '—'}</td>
                    <td>{reservation.pickupNumber}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="9" className="no-data-cell">Ingen resultater funnet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BorrowerDashboard;