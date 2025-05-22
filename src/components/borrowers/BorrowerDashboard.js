import React, { useState, useEffect, useMemo } from 'react';
import { generateMockData } from '../../utils/mockData';
import './BorrowerDashboard.css';

// Helper function to format dates
const formatDate = (isoDate) => {
  if (!isoDate) return null;
  const date = new Date(isoDate);
  return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
};

// Helper function to calculate days between dates
const calculateDaysBetween = (startDate, endDate) => {
  if (!startDate || !endDate) return null;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

function BorrowerDashboard() {
  // Check if we're on a borrower detail page
  const isDetailPage = window.location.pathname.includes('/laaner/') && window.location.pathname.split('/').length > 2;
  const borrowerId = isDetailPage ? window.location.pathname.split('/').pop() : null;

  // State for main dashboard
  const [allReservations, setAllReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Search states
  const [quickSearch, setQuickSearch] = useState('');
  const [searchFilters, setSearchFilters] = useState({
    borrower: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    borrowerGroup: '',
    localLibrary: '',
    lastActive: '',
    blockingReason: ''
  });

  // State for borrower detail page
  const [borrower, setBorrower] = useState(null);
  const [borrowerReservations, setBorrowerReservations] = useState([]);
  const [activeTab, setActiveTab] = useState('current');

  // Load mock data on component mount
  useEffect(() => {
    setIsLoading(true);
    
    const fetchTimer = setTimeout(() => {
      const mockData = generateMockData();
      setAllReservations(mockData);
      
      if (isDetailPage && borrowerId) {
        // Find borrower reservations
        const reservations = mockData.filter(r => r.borrower.id === borrowerId);
        setBorrowerReservations(reservations);
        
        // Get borrower info from first reservation
        if (reservations.length > 0) {
          setBorrower(reservations[0].borrower);
        }
      }
      
      setIsLoading(false);
    }, isDetailPage ? 300 : 600);
    
    return () => clearTimeout(fetchTimer);
  }, [isDetailPage, borrowerId]);

  // Advanced filtering logic for main dashboard
  const filteredReservations = useMemo(() => {
    if (!hasSearched || isDetailPage) return [];
    
    let filtered = [...allReservations];

    // Quick search
    if (quickSearch.trim()) {
      const searchLower = quickSearch.toLowerCase().trim();
      filtered = filtered.filter(reservation => 
        reservation.title.toLowerCase().includes(searchLower) ||
        reservation.author.toLowerCase().includes(searchLower) ||
        reservation.borrower.id.toLowerCase().includes(searchLower) ||
        reservation.borrower.name.toLowerCase().includes(searchLower) ||
        reservation.borrower.email.toLowerCase().includes(searchLower) ||
        reservation.borrower.phone.includes(searchLower) ||
        reservation.borrower.address.toLowerCase().includes(searchLower) ||
        reservation.status.toLowerCase().includes(searchLower) ||
        reservation.pickupNumber.toLowerCase().includes(searchLower)
      );
    }

    // Apply advanced filters
    if (searchFilters.borrower.trim()) {
      const borrowerSearch = searchFilters.borrower.toLowerCase().trim();
      filtered = filtered.filter(reservation => 
        reservation.borrower.id.toLowerCase().includes(borrowerSearch) ||
        reservation.borrower.name.toLowerCase().includes(borrowerSearch)
      );
    }

    if (searchFilters.name.trim()) {
      const nameSearch = searchFilters.name.toLowerCase().trim();
      filtered = filtered.filter(reservation => 
        reservation.borrower.name.toLowerCase().includes(nameSearch)
      );
    }

    if (searchFilters.email.trim()) {
      const emailSearch = searchFilters.email.toLowerCase().trim();
      filtered = filtered.filter(reservation => 
        reservation.borrower.email.toLowerCase().includes(emailSearch)
      );
    }

    if (searchFilters.phone.trim()) {
      const phoneSearch = searchFilters.phone.trim();
      filtered = filtered.filter(reservation => 
        reservation.borrower.phone.includes(phoneSearch)
      );
    }

    if (searchFilters.address.trim()) {
      const addressSearch = searchFilters.address.toLowerCase().trim();
      filtered = filtered.filter(reservation => 
        reservation.borrower.address.toLowerCase().includes(addressSearch)
      );
    }

    if (searchFilters.borrowerGroup) {
      filtered = filtered.filter(reservation => 
        reservation.borrower.libraryAffiliation && 
        reservation.borrower.libraryAffiliation.toLowerCase().includes(searchFilters.borrowerGroup.toLowerCase())
      );
    }

    if (searchFilters.localLibrary) {
      filtered = filtered.filter(reservation => 
        reservation.borrower.libraryAffiliation && 
        reservation.borrower.libraryAffiliation.toLowerCase() === searchFilters.localLibrary.toLowerCase()
      );
    }

    if (searchFilters.lastActive) {
      const filterDate = new Date(searchFilters.lastActive);
      filtered = filtered.filter(reservation => {
        const updatedDate = new Date(reservation.updatedAt);
        return updatedDate <= filterDate;
      });
    }

    if (searchFilters.blockingReason) {
      if (searchFilters.blockingReason === 'none') {
        filtered = filtered.filter(reservation => 
          reservation.status !== 'UTLØPT'
        );
      } else if (searchFilters.blockingReason === 'forsinket') {
        filtered = filtered.filter(reservation => 
          reservation.status === 'UTLØPT'
        );
      }
    }

    return filtered;
  }, [allReservations, quickSearch, searchFilters, hasSearched, isDetailPage]);

  // Filter reservations by status for detail page
  const detailFilteredReservations = useMemo(() => {
    if (!isDetailPage) return [];
    
    switch (activeTab) {
      case 'current':
        return borrowerReservations.filter(r => r.status === 'VENTER' || r.status === 'RESERVERT');
      case 'picked':
        return borrowerReservations.filter(r => r.status === 'HENTET');
      case 'expired':
        return borrowerReservations.filter(r => r.status === 'UTLØPT');
      case 'all':
      default:
        return borrowerReservations;
    }
  }, [borrowerReservations, activeTab, isDetailPage]);

  // Get unique borrowers for statistics (main dashboard)
  const uniqueBorrowers = useMemo(() => {
    if (isDetailPage) return [];
    
    const borrowerMap = new Map();
    filteredReservations.forEach(reservation => {
      const borrowerId = reservation.borrower.id;
      if (!borrowerMap.has(borrowerId)) {
        borrowerMap.set(borrowerId, {
          ...reservation.borrower,
          reservationCount: 1,
          latestReservation: reservation
        });
      } else {
        const existing = borrowerMap.get(borrowerId);
        existing.reservationCount += 1;
        if (new Date(reservation.updatedAt) > new Date(existing.latestReservation.updatedAt)) {
          existing.latestReservation = reservation;
        }
      }
    });
    return Array.from(borrowerMap.values());
  }, [filteredReservations, isDetailPage]);

  // Statistics for detail page
  const detailStats = useMemo(() => {
    if (!isDetailPage) return {};
    
    return {
      total: borrowerReservations.length,
      current: borrowerReservations.filter(r => r.status === 'VENTER' || r.status === 'RESERVERT').length,
      picked: borrowerReservations.filter(r => r.status === 'HENTET').length,
      expired: borrowerReservations.filter(r => r.status === 'UTLØPT').length,
      lastActive: borrowerReservations.length > 0 ? 
        Math.max(...borrowerReservations.map(r => new Date(r.updatedAt).getTime())) : null
    };
  }, [borrowerReservations, isDetailPage]);

  // Event handlers for main dashboard
  const handleQuickSearch = (e) => {
    const value = e.target.value;
    setQuickSearch(value);
  };

  const handleFilterChange = (field, value) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setHasSearched(true);
    setShowResults(true);
  };

  const handleReset = () => {
    setSearchFilters({
      borrower: '',
      name: '',
      email: '',
      phone: '',
      address: '',
      borrowerGroup: '',
      localLibrary: '',
      lastActive: '',
      blockingReason: ''
    });
    setQuickSearch('');
    setShowResults(false);
    setHasSearched(false);
  };

  const handleCreateBorrower = () => {
    alert('Opprett ny låner funksjonalitet kommer snart!');
  };

  const handleBorrowerClick = (borrowerId) => {
    window.location.href = `/laaner/${borrowerId}`;
  };

  const handleQuickSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearchSubmit(e);
    }
  };

  // Event handlers for detail page
  const handleGoBack = () => {
    window.history.back();
  };

  const handleEditBorrower = () => {
    alert('Rediger låner funksjonalitet kommer snart!');
  };

  const handleBlockBorrower = () => {
    alert('Blokker låner funksjonalitet kommer snart!');
  };

  const handleSendNotification = () => {
    alert('Send varsel funksjonalitet kommer snart!');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'VENTER': return 'status-waiting';
      case 'HENTET': return 'status-picked';
      case 'UTLØPT': return 'status-expired';
      case 'RESERVERT': return 'status-reserved';
      default: return 'status-default';
    }
  };

  // Check if any search is active
  const isSearchActive = quickSearch.trim() || Object.values(searchFilters).some(filter => filter !== '');

  // Render borrower detail page
  if (isDetailPage) {
    if (isLoading) {
      return (
        <div className="page-container">
          <div className="content-wrapper">
            <div className="loading-center">
              <div className="loading-spinner"></div>
              <span className="loading-text">Laster lånerdetaljer...</span>
            </div>
          </div>
        </div>
      );
    }

    if (!borrower) {
      return (
        <div className="page-container">
          <div className="content-wrapper">
            <div className="error-container">
              <div className="error-icon">❌</div>
              <h2 className="error-title">Låner ikke funnet</h2>
              <p className="error-message">Låner med ID "{borrowerId}" finnes ikke i systemet.</p>
              <button onClick={handleGoBack} className="btn btn-primary">
                Gå tilbake
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="page-container">
        <div className="content-wrapper">
          {/* Header */}
          <div className="page-header">
            <div className="header-nav">
              <button onClick={handleGoBack} className="back-button">
                <svg className="back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="page-title">Lånerdetaljer</h1>
            </div>
          </div>

          {/* Borrower Info Card */}
          <div className="borrower-info-card">
            <div className="borrower-header">
              <div className="borrower-avatar-section">
                <div className="borrower-avatar">
                  <svg className="avatar-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="borrower-title-info">
                  <h2 className="borrower-name">{borrower.name}</h2>
                  <p className="borrower-id">Låner-ID: {borrower.id}</p>
                </div>
              </div>
              <div className="borrower-actions">
                <button onClick={handleEditBorrower} className="btn btn-secondary">
                  Rediger
                </button>
                <button onClick={handleSendNotification} className="btn btn-primary">
                  Send varsel
                </button>
                <button onClick={handleBlockBorrower} className="btn btn-danger">
                  Blokker
                </button>
              </div>
            </div>

            <div className="borrower-details-grid">
              <div className="detail-item">
                <h3 className="detail-label">E-post</h3>
                <p className="detail-value">{borrower.email}</p>
              </div>
              <div className="detail-item">
                <h3 className="detail-label">Telefon</h3>
                <p className="detail-value">{borrower.phone}</p>
              </div>
              <div className="detail-item">
                <h3 className="detail-label">Adresse</h3>
                <p className="detail-value">{borrower.address}</p>
              </div>
              <div className="detail-item">
                <h3 className="detail-label">Bibliotek</h3>
                <p className="detail-value library-name">{borrower.libraryAffiliation || 'Ikke spesifisert'}</p>
              </div>
            </div>

            {detailStats.lastActive && (
              <div className="last-active-section">
                <div className="last-active-text">
                  Sist aktiv: {formatDate(new Date(detailStats.lastActive).toISOString())}
                </div>
              </div>
            )}
          </div>

          {/* Statistics Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{detailStats.total}</div>
              <div className="stat-label">Totale reservasjoner</div>
            </div>
            <div className="stat-card stat-blue">
              <div className="stat-number">{detailStats.current}</div>
              <div className="stat-label">Aktive reservasjoner</div>
            </div>
            <div className="stat-card stat-green">
              <div className="stat-number">{detailStats.picked}</div>
              <div className="stat-label">Hentede bøker</div>
            </div>
            <div className="stat-card stat-red">
              <div className="stat-number">{detailStats.expired}</div>
              <div className="stat-label">Utløpte reservasjoner</div>
            </div>
          </div>

          {/* Reservations */}
          <div className="reservations-container">
            <div className="reservations-header">
              <h3 className="reservations-title">Reservasjoner</h3>
            </div>

            {/* Tabs */}
            <div className="tabs-container">
              <nav className="tabs-nav">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`tab ${activeTab === 'all' ? 'tab-active' : ''}`}
                >
                  Alle ({detailStats.total})
                </button>
                <button
                  onClick={() => setActiveTab('current')}
                  className={`tab ${activeTab === 'current' ? 'tab-active' : ''}`}
                >
                  Aktive ({detailStats.current})
                </button>
                <button
                  onClick={() => setActiveTab('picked')}
                  className={`tab ${activeTab === 'picked' ? 'tab-active' : ''}`}
                >
                  Hentet ({detailStats.picked})
                </button>
                <button
                  onClick={() => setActiveTab('expired')}
                  className={`tab ${activeTab === 'expired' ? 'tab-active' : ''}`}
                >
                  Utløpt ({detailStats.expired})
                </button>
              </nav>
            </div>

            {/* Reservations Table */}
            <div className="table-container">
              <table className="reservations-table">
                <thead className="table-header">
                  <tr>
                    <th className="table-header-cell">Tittel</th>
                    <th className="table-header-cell">Forfatter</th>
                    <th className="table-header-cell">Klar dato</th>
                    <th className="table-header-cell">Hentefrist</th>
                    <th className="table-header-cell">Hentet dato</th>
                    <th className="table-header-cell">Status</th>
                    <th className="table-header-cell">Dager</th>
                    <th className="table-header-cell">Hentenr.</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {detailFilteredReservations.length > 0 ? (
                    detailFilteredReservations.map((reservation) => {
                      const days = reservation.pickedUpDate ?
                        calculateDaysBetween(reservation.readyDate, reservation.pickedUpDate) :
                        calculateDaysBetween(reservation.readyDate, new Date().toISOString());

                      return (
                        <tr key={reservation.id} className="table-row">
                          <td className="table-cell table-cell-title">{reservation.title}</td>
                          <td className="table-cell table-cell-author">{reservation.author}</td>
                          <td className="table-cell table-cell-date">{formatDate(reservation.readyDate)}</td>
                          <td className="table-cell table-cell-date">{formatDate(reservation.reservedDate)}</td>
                          <td className="table-cell table-cell-date">{formatDate(reservation.pickedUpDate) || '---'}</td>
                          <td className="table-cell">
                            <span className={`status-badge ${getStatusColor(reservation.status)}`}>
                              {reservation.status}
                            </span>
                          </td>
                          <td className="table-cell table-cell-days">{days || '---'}</td>
                          <td className="table-cell table-cell-pickup">{reservation.pickupNumber}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="9" className="table-empty">
                        <div className="empty-icon">🔍</div>
                        <div className="empty-text">Ingen resultater funnet</div>
                        <div className="empty-subtext">Prøv å justere søkekriteriene dine</div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render main dashboard
  if (isLoading) {
    return (
      <div className="page-container">
        <div className="content-wrapper">
          <div className="loading-center">
            <div className="loading-spinner"></div>
            <span className="loading-text">Laster lånerdata...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      

        {/* Search Section */}
        <div className="search-section">
          <form onSubmit={handleSearchSubmit} className="search-form">
            {/* Quick Search */}
            <div className="quick-search-container">
              <div className="search-input-group">
                <input
                  type="text"
                  placeholder="Søk etter låner, navn, e-post, telefon, adresse eller bok..."
                  value={quickSearch}
                  onChange={handleQuickSearch}
                  onKeyDown={handleQuickSearchKeyDown}
                  className="search-input"
                />
                <button type="submit" className="search-button">
                  <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Søk
                </button>
              </div>
            </div>

            {/* Advanced Filters */}
            <div className="advanced-filters">
              <div className="filter-grid">
                <div className="filter-group">
                  <label className="filter-label">Låner (ID/Navn)</label>
                  <input
                    type="text"
                    placeholder="Søk låner..."
                    value={searchFilters.borrower}
                    onChange={(e) => handleFilterChange('borrower', e.target.value)}
                    className="filter-input"
                  />
                </div>

                <div className="filter-group">
                  <label className="filter-label">Navn</label>
                  <input
                    type="text"
                    placeholder="Søk navn..."
                    value={searchFilters.name}
                    onChange={(e) => handleFilterChange('name', e.target.value)}
                    className="filter-input"
                  />
                </div>

                <div className="filter-group">
                  <label className="filter-label">E-post</label>
                  <input
                    type="email"
                    placeholder="Søk e-post..."
                    value={searchFilters.email}
                    onChange={(e) => handleFilterChange('email', e.target.value)}
                    className="filter-input"
                  />
                </div>

                <div className="filter-group">
                  <label className="filter-label">Telefon</label>
                  <input
                    type="tel"
                    placeholder="Søk telefon..."
                    value={searchFilters.phone}
                    onChange={(e) => handleFilterChange('phone', e.target.value)}
                    className="filter-input"
                  />
                </div>

                <div className="filter-group">
                  <label className="filter-label">Adresse</label>
                  <input
                    type="text"
                    placeholder="Søk adresse..."
                    value={searchFilters.address}
                    onChange={(e) => handleFilterChange('address', e.target.value)}
                    className="filter-input"
                  />
                </div>

                

                <div className="filter-group">
                  <label className="filter-label">Lokalbibliotek</label>
                  <select
                    value={searchFilters.localLibrary}
                    onChange={(e) => handleFilterChange('localLibrary', e.target.value)}
                    className="filter-select"
                  >
                    <option value="">Alle bibliotek</option>
                    <option value="hovedbibliotek">Hovedbibliotek</option>
                    <option value="filial nord">Filial Nord</option>
                    <option value="filial sør">Filial Sør</option>
                  </select>
                </div>

               
      
              </div>

              {/* Action Buttons */}
              <div className="filter-actions">
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn btn-secondary"
                  disabled={!isSearchActive}
                >
                  Tilbakestill
                </button>
                <button type="submit" className="btn btn-primary">
                  Søk
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Results Section */}
        {showResults && hasSearched && (
          <div className="results-section">
            <div className="results-header">
              <h2 className="results-title">
                Søkeresultater ({uniqueBorrowers.length} {uniqueBorrowers.length === 1 ? 'låner' : 'lånere'})
              </h2>
            </div>

            {uniqueBorrowers.length > 0 ? (
              <div className="borrowers-grid">
                {uniqueBorrowers.map((borrower) => (
                  <div
                    key={borrower.id}
                    className="borrower-card"
                    onClick={() => handleBorrowerClick(borrower.id)}
                  >
                    <div className="borrower-card-header">
                      <div className="borrower-avatar-small">
                        <svg className="avatar-icon-small" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="borrower-card-info">
                        <h3 className="borrower-card-name">{borrower.name}</h3>
                        <p className="borrower-card-id">ID: {borrower.id}</p>
                      </div>
                    </div>

                    <div className="borrower-card-details">
                      <div className="detail-row">
                        <span className="detail-icon">📧</span>
                        <span className="detail-text">{borrower.email}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-icon">📞</span>
                        <span className="detail-text">{borrower.phone}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-icon">📍</span>
                        <span className="detail-text">{borrower.address}</span>
                      </div>
                      {borrower.libraryAffiliation && (
                        <div className="detail-row">
                          <span className="detail-icon">🏛️</span>
                          <span className="detail-text">{borrower.libraryAffiliation}</span>
                        </div>
                      )}
                    </div>

                   
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-results">
                <h3 className="no-results-title">Ingen lånere funnet</h3>
             
              </div>
            )}
          </div>

 

        )}
      </div>

  );
}

export default BorrowerDashboard;