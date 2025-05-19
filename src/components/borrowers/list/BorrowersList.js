import React from 'react';
import SearchBar from './SearchBar.js';
import ReservationsTable from './ReservationsTable.js';
import '../BorrowerDashboard.css';

function BorrowersList() {
  const [allReservations, setAllReservations] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('Alle statuser');

  React.useEffect(() => {
    // Import is inside useEffect to avoid circular dependencies
    const { generateMockData } = require('../../../utils/mockData.js');
    
    // Simulerer API-kall med lastestatus
    setIsLoading(true);
    
    // Simuler nettverksforsinkelse for realistisk brukeropplevelse
    const fetchTimer = setTimeout(() => {
      // Hent mock data
      const mockData = generateMockData();
      
      // Lagre alle reservasjoner for oversiktssiden
      setAllReservations(mockData);
      setIsLoading(false);
    }, 600);
    
    // Rydd opp timer ved avmontering av komponenten
    return () => clearTimeout(fetchTimer);
  }, []); 

  // Handle search term changes
  const handleSearchChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
  };

  // Handle status filter changes
  const handleStatusFilterChange = (newStatusFilter) => {
    setStatusFilter(newStatusFilter);
  };

  // Filter reservations based on search term and status filter
  const filteredReservations = React.useMemo(() => {
    return allReservations.filter(reservation => {
      // Filtrer først basert på søketekst
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = (
        reservation.title.toLowerCase().includes(searchLower) ||
        reservation.author.toLowerCase().includes(searchLower) ||
        reservation.borrower.id.toLowerCase().includes(searchLower) ||
        reservation.borrower.name.toLowerCase().includes(searchLower) ||
        reservation.status.toLowerCase().includes(searchLower)
      );
      
      // Deretter filtrer på status hvis nødvendig
      const matchesStatus = statusFilter === 'Alle statuser' || reservation.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [allReservations, searchTerm, statusFilter]);

  return (
    <div className="borrowers-list">
      <div className="page-header">
        <h1>Lånere</h1>
      </div>
      
      <SearchBar 
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onSearchChange={handleSearchChange}
        onStatusFilterChange={handleStatusFilterChange}
      />
      
      <ReservationsTable 
        reservations={filteredReservations}
        isLoading={isLoading}
      />
    </div>
  );
}

export default BorrowersList;