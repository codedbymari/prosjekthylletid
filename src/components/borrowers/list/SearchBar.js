import React from 'react';
import '../BorrowerDashboard.css';

function SearchBar({ searchTerm, statusFilter, onSearchChange, onStatusFilterChange }) {
  // Status filter options
  const statusOptions = ['Alle statuser', 'VENTER', 'HENTET', 'UTLØPT'];

  // Handle search input changes
  const handleSearch = (e) => {
    onSearchChange(e.target.value);
  };

  // Handle status filter button click
  const handleStatusFilter = () => {
    // Rotate through status options
    const currentIndex = statusOptions.indexOf(statusFilter);
    const nextIndex = (currentIndex + 1) % statusOptions.length;
    onStatusFilterChange(statusOptions[nextIndex]);
  };

  return (
    <div className="search-container">
      <input 
        type="text" 
        placeholder="Søk etter tittel, forfatter, låner..." 
        className="search-input"
        value={searchTerm}
        onChange={handleSearch}
        aria-label="Søk etter lånere og reservasjoner"
      />
      <button 
        className="filter-button"
        onClick={handleStatusFilter}
        aria-label="Filtrer på status"
      >
        {statusFilter}
      </button>
    </div>
  );
}

export default SearchBar;