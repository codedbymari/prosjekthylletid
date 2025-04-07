// src/components/reservation/FilterBar.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FiSearch, FiFilter, FiChevronDown, FiChevronUp, FiX, FiEye, FiEyeOff } from 'react-icons/fi';

const FILTER_STATUSES = {
  ALL: 'all',
  WAITING: 'venter',
  PICKED_UP: 'hentet',
  EXPIRED: 'utløpt'
};

function FilterBar({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  visibleColumns,
  setVisibleColumns
}) {
  const [columnMenuOpen, setColumnMenuOpen] = useState(false);

  // Toggle column visibility
  const toggleColumnVisibility = (column) => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  return (
    <div className="filter-bar">
      <div className="search-wrapper">
        <FiSearch className="search-icon" />
        <input
          type="text"
          placeholder="Søk etter tittel, forfatter, lånernummer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          aria-label="Søk i reserveringer"
        />
        {searchTerm && (
          <button 
            className="clear-search" 
            onClick={() => setSearchTerm('')}
            aria-label="Tøm søk"
          >
            <FiX />
          </button>
        )}
      </div>
      
      <div className="filter-dropdown">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-select"
          aria-label="Filtrer etter status"
        >
          <option value={FILTER_STATUSES.ALL}>Alle statuser</option>
          <option value={FILTER_STATUSES.WAITING}>Venter</option>
          <option value={FILTER_STATUSES.PICKED_UP}>Hentet</option>
          <option value={FILTER_STATUSES.EXPIRED}>Utløpt</option>
        </select>
        <FiFilter className="filter-icon" />
      </div>
      
      <div className="column-manager-dropdown">
        <button 
          className="column-manager-toggle"
          onClick={() => setColumnMenuOpen(!columnMenuOpen)}
          aria-expanded={columnMenuOpen}
          aria-haspopup="true"
        >
          {columnMenuOpen ? <FiEyeOff className="icon" /> : <FiEye className="icon" />}
          Kolonner
          <span className="dropdown-icon">
            {columnMenuOpen ? <FiChevronUp /> : <FiChevronDown />}
          </span>
        </button>
        
        {columnMenuOpen && (
          <div className="column-options" role="menu">
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
              <label key={key} className="column-option">
                <input 
                  type="checkbox" 
                  checked={visibleColumns[key]} 
                  onChange={() => toggleColumnVisibility(key)}
                  aria-label={`Vis ${label} kolonne`}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

FilterBar.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  filterStatus: PropTypes.string.isRequired,
  setFilterStatus: PropTypes.func.isRequired,
  visibleColumns: PropTypes.object.isRequired,
  setVisibleColumns: PropTypes.func.isRequired
};

export default FilterBar;