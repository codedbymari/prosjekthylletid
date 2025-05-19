// src/components/reservation/StatisticsSection.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { 
  FiClock, 
  FiAlertCircle, 
  FiBook, 
  FiInfo, 
  FiX, 
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi';
import '../styles/StatisticsSection.css';


function StatisticsSection({ statistics, pickupTimeLimit, reminderDays, materialData }) {
  const [activeExplanation, setActiveExplanation] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('Siste 30 dager');
  
  const periodOptions = [
    'Siste 7 dager',
    'Siste 30 dager',
    'Siste 90 dager',
    'Siste år',
    'Alle'
  ];

  const toggleExplanation = (key) => {
    setActiveExplanation(activeExplanation === key ? null : key);
  };
  
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  
  const selectPeriod = (period) => {
    setSelectedPeriod(period);
    setIsDropdownOpen(false);
  };
  
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.period-selector-container')) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);
  

  
  return (
    <section className="statistics-section">
      <div className="statistics-container">
        {/* nøkkeltall  */}
        <header className="statistics-header">
          <h2 className="statistics-title">Reservasjonsoversikt</h2>
          <div className="period-selector-container">
            <span className="period-label">Periode:</span>
            <div className="dropdown-container">
              <button 
                className={`period-selector ${isDropdownOpen ? 'active' : ''}`}
                onClick={toggleDropdown}
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
              >
                <span>{selectedPeriod}</span>
                {isDropdownOpen ? 
                  <FiChevronUp className="period-icon" /> : 
                  <FiChevronDown className="period-icon" />
                }
              </button>

              {isDropdownOpen && (
                <ul className="period-dropdown">
                  {periodOptions.map((period) => (
                    <li key={period}>
                      <button 
                        className={`period-option ${period === selectedPeriod ? 'selected' : ''}`}
                        onClick={() => selectPeriod(period)}
                      >
                        {period}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </header>

        
        {/* nøkkeltall bokser */}
        <div className="statistics-cards">
          <div className="stat-card">
            <div className="stat-card-header">
              <h3 className="stat-title">Gjennomsnittlig hentetid</h3>
              <button 
                className="info-button" 
                onClick={() => toggleExplanation('pickup-time')}
                aria-label="Vis info om gjennomsnittlig hentetid"
              >
                <FiInfo />
              </button>
            </div>
            
            <div className="stat-content">
              <div className="stat-icon stat-icon-blue">
                <FiClock />
              </div>
              <div className="stat-value-container">
                <p className="stat-value">{statistics.averagePickupTime}</p>
                <p className="stat-unit">dager</p>
              </div>
            </div>
            
            {activeExplanation === 'pickup-time' && (
              <div className="stat-explanation">
                <div className="explanation-header">
                  <h4>Om gjennomsnittlig hentetid</h4>
                  <button 
                    onClick={() => setActiveExplanation(null)}
                    aria-label="Lukk forklaring"
                    className="close-explanation"
                  >
                    <FiX />
                  </button>
                </div>
                <p>Tiden det tar fra en reservasjon er klar til den blir hentet.</p>
                <ul className="explanation-list">
                  <li>Beregnes kun for materiale som faktisk er hentet</li>
                  <li>Lavere verdi indikerer mer effektiv materialsirkulasjon</li>
                  <li>Påvirkes av hentefristen ({pickupTimeLimit} dager)</li>
                </ul>
              </div>
            )}
          </div>
          
          <div className="stat-card">
            <div className="stat-card-header">
              <h3 className="stat-title">Ikke-hentet materiale</h3>
              <button 
                className="info-button" 
                onClick={() => toggleExplanation('not-picked')}
                aria-label="Vis info om ikke-hentet materiale"
              >
                <FiInfo />
              </button>
            </div>
            
            <div className="stat-content">
              <div className="stat-icon stat-icon-red">
                <FiAlertCircle />
              </div>
              <div className="stat-value-container">
                <p className="stat-value">{statistics.notPickedUpRate}</p>
                <p className="stat-unit">prosent</p>
              </div>
            </div>
            
            {activeExplanation === 'not-picked' && (
              <div className="stat-explanation">
                <div className="explanation-header">
                  <h4>Om ikke-hentet materiale</h4>
                  <button 
                    onClick={() => setActiveExplanation(null)}
                    aria-label="Lukk forklaring" 
                    className="close-explanation"
                  >
                    <FiX />
                  </button>
                </div>
                <p>Andel reservasjoner som aldri blir hentet av låner.</p>
                <ul className="explanation-list">
                  <li>Beregnes som antall utløpte reservasjoner delt på totalt antall</li>
                  <li>Høy verdi kan indikere behov for bedre påminnelsesrutiner</li>
                  <li>Påvirkes av hvor populære titlene er</li>
                </ul>
              </div>
            )}
          </div>
          
          {/* Aktiv Reservasjoner  */}
          <div className="stat-card">
            <div className="stat-card-header">
              <h3 className="stat-title">Aktive reservasjoner</h3>
              <button 
                className="info-button" 
                onClick={() => toggleExplanation('active-res')}
                aria-label="Vis info om aktive reservasjoner"
              >
                <FiInfo />
              </button>
            </div>
            
            <div className="stat-content">
              <div className="stat-icon stat-icon-green">
                <FiBook />
              </div>
              <div className="stat-value-container">
                <p className="stat-value">{materialData.filter(item => item.status === 'Venter').length}</p>
                <p className="stat-unit">venter på henting</p>
              </div>
            </div>
            
            
            {activeExplanation === 'active-res' && (
              <div className="stat-explanation">
                <div className="explanation-header">
                  <h4>Om aktive reservasjoner</h4>
                  <button 
                    onClick={() => setActiveExplanation(null)}
                    aria-label="Lukk forklaring" 
                    className="close-explanation"
                  >
                    <FiX />
                  </button>
                </div>
                <p>Antall reservasjoner som er klare for henting.</p>
                <ul className="explanation-list">
                  <li>Materialet er satt på hentehylle og venter på låner</li>
                  <li>Automatiske påminnelser sendes {reminderDays} dager før utløp</li>
                  <li>Materialet returneres til samling hvis ikke hentet innen {pickupTimeLimit} dager</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

StatisticsSection.propTypes = {
  statistics: PropTypes.shape({
    averagePickupTime: PropTypes.string.isRequired,
    notPickedUpRate: PropTypes.string.isRequired,
    pendingReminders: PropTypes.number.isRequired
  }).isRequired,
  pickupTimeLimit: PropTypes.number.isRequired,
  reminderDays: PropTypes.number.isRequired,
  materialData: PropTypes.array.isRequired
};

export default StatisticsSection;