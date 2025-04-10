// src/components/reservation/ReservationList.jsx
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { FiGrid, FiList } from 'react-icons/fi';
import FilterBar from './FilterBar.jsx';
import ReservationTable from './ReservationTable.jsx';
import ReservationCards from './ReservationCards.jsx';
import NoResults from '../common/NoResults.jsx';

const FILTER_STATUSES = {
  ALL: 'all',
  WAITING: 'venter',
  PICKED_UP: 'hentet',
  EXPIRED: 'utløpt'
};

function ReservationList({
  materialData,
  filterStatus,
  setFilterStatus,
  searchTerm,
  setSearchTerm,
  sortConfig,
  setSortConfig,
  visibleColumns,
  setVisibleColumns,
  viewMode,
  setViewMode,
  handleBorrowerClick,
  calculateExpiryDate,
  showToast
}) {
  // Filter and sortering av data
  const filteredAndSortedData = useMemo(() => {
    // først filter  dataen
    const filteredData = materialData.filter(item => {
      // Filter status
      if (filterStatus !== FILTER_STATUSES.ALL && item.status.toLowerCase() !== filterStatus) {
        return false;
      }
      
      // Filter med søk 
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          item.title.toLowerCase().includes(searchLower) ||
          item.author.toLowerCase().includes(searchLower) ||
          item.borrowerId.toLowerCase().includes(searchLower) ||
          (item.borrowerName && item.borrowerName.toLowerCase().includes(searchLower)) ||
          (item.pickupNumber && item.pickupNumber.toLowerCase().includes(searchLower))
        );
      }
      
      return true;
    });
    
    // sorter filtert data
    if (sortConfig.key) {
      return [...filteredData].sort((a, b) => {
        // null values
        if (a[sortConfig.key] === null) return 1;
        if (b[sortConfig.key] === null) return -1;
        if (a[sortConfig.key] === b[sortConfig.key]) return 0;
        
        // Sorter med nummersik eller string value
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (sortConfig.key.includes('Date')) {
            const parseNorwegianDate = (dateString) => {
              if (!dateString) return null;
              const parts = dateString.split('.');
              if (parts.length !== 3) return null;
              return new Date(parts[2], parts[1] - 1, parts[0]);
            };
            
            const dateA = parseNorwegianDate(aValue);
            const dateB = parseNorwegianDate(bValue);
  
            return sortConfig.direction === 'asc' 
              ? dateA - dateB 
              : dateB - dateA;
          }
          
          //  numeric values like daysOnShelf
          if (sortConfig.key === 'daysOnShelf' && aValue !== null && bValue !== null) {
            return sortConfig.direction === 'asc'
              ? aValue - bValue
              : bValue - aValue;
          }
          
          // For strings
          return sortConfig.direction === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        });
      }
  
      return filteredData;
    }, [materialData, filterStatus, searchTerm, sortConfig]);
  
    // Sorter handler for table columns
    const requestSort = (key) => {
      let direction = 'asc';
      if (sortConfig.key === key && sortConfig.direction === 'asc') {
        direction = 'desc';
      }
      setSortConfig({ key, direction });
    };
  
    return (
      <section className="reservations-section">
        <div className="section-header">
          <div className="title-group">
            <h2>Aktive reserveringer</h2>
            <span className="item-count">{filteredAndSortedData.length} reserveringer</span>
          </div>
          
          <div className="view-controls">
            <button 
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              aria-label="Vis som tabell"
              title="Tabellvisning"
            >
              <FiList className="icon" />
            </button>
            <button 
              className={`view-btn ${viewMode === 'card' ? 'active' : ''}`}
              onClick={() => setViewMode('card')}
              aria-label="Vis som kort"
              title="Kortvisning"
            >
              <FiGrid className="icon" />
            </button>
          </div>
        </div>
        
        <FilterBar 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
        />
        
        {filteredAndSortedData.length > 0 ? (
          <>
            {viewMode === 'table' ? (
              <ReservationTable 
                data={filteredAndSortedData}
                visibleColumns={visibleColumns}
                sortConfig={sortConfig}
                requestSort={requestSort}
                handleBorrowerClick={handleBorrowerClick}
                calculateExpiryDate={calculateExpiryDate}
              />
            ) : (
              <ReservationCards 
                data={filteredAndSortedData}
                handleBorrowerClick={handleBorrowerClick}
              />
            )}
          </>
        ) : (
          <NoResults 
            searchTerm={searchTerm}
            filterStatus={filterStatus}
            resetFilters={() => {
              setSearchTerm('');
              setFilterStatus(FILTER_STATUSES.ALL);
            }}
          />
        )}
      </section>
    );
  }
  
  ReservationList.propTypes = {
    materialData: PropTypes.array.isRequired,
    filterStatus: PropTypes.string.isRequired,
    setFilterStatus: PropTypes.func.isRequired,
    searchTerm: PropTypes.string.isRequired,
    setSearchTerm: PropTypes.func.isRequired,
    sortConfig: PropTypes.shape({
      key: PropTypes.string,
      direction: PropTypes.string
    }).isRequired,
    setSortConfig: PropTypes.func.isRequired,
    visibleColumns: PropTypes.object.isRequired,
    setVisibleColumns: PropTypes.func.isRequired,
    viewMode: PropTypes.string.isRequired,
    setViewMode: PropTypes.func.isRequired,
    handleBorrowerClick: PropTypes.func.isRequired,
    calculateExpiryDate: PropTypes.func.isRequired,
    showToast: PropTypes.func.isRequired
  };
  
  export default ReservationList;