// src/components/common/NoResults.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { FiBook } from 'react-icons/fi';

function NoResults({ searchTerm, filterStatus, resetFilters }) {
  return (
    <div className="no-results">
      <div className="no-results-icon">
        <FiBook />
      </div>
      <h3>Ingen reserveringer funnet</h3>
      <p>
        {searchTerm || filterStatus !== 'all' 
          ? 'Prøv å endre søkekriteriene dine' 
          : 'Det er ingen aktive reserveringer for øyeblikket'}
      </p>
      {(searchTerm || filterStatus !== 'all') && (
        <button 
          className="btn-reset-filters"
          onClick={resetFilters}
        >
          Tilbakestill filtre
        </button>
      )}
    </div>
  );
}

NoResults.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  filterStatus: PropTypes.string.isRequired,
  resetFilters: PropTypes.func.isRequired
};

export default NoResults;