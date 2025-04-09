import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  // Hent valgt filial fra localStorage eller bruk Kolbotn som standard
  const [selectedBranch, setSelectedBranch] = useState(() => {
    const saved = localStorage.getItem('currentBranch');
    return saved ? JSON.parse(saved).name : 'Kolbotn';
  });
  
  const userMenuRef = useRef(null);
  const profileModalRef = useRef(null);
  const navigate = useNavigate();
  
  // Liste over filialer
  const branches = ['Kolbotn', 'Ski'];
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      
      if (profileModalRef.current && !profileModalRef.current.contains(event.target)) {
        setShowProfileModal(false);
      }
    };
    
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (showProfileModal) {
          setShowProfileModal(false);
        } else if (userMenuOpen) {
          setUserMenuOpen(false);
        } else if (isOpen) {
          setIsOpen(false);
        }
      }
      
      // Åpne hjelp med F1-tasten
      if (event.key === 'F1') {
        event.preventDefault();
        navigate('/hjelp');
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, userMenuOpen, showProfileModal, navigate]);
  
  // Lytt etter endringer fra HomeDashboard
  useEffect(() => {
    const handleDashboardBranchChange = (event) => {
      setSelectedBranch(event.detail.name.split(' ')[0]); // Tar bare første ordet (Kolbotn/Ski)
    };
    
    window.addEventListener('dashboardBranchChanged', handleDashboardBranchChange);
    
    return () => {
      window.removeEventListener('dashboardBranchChanged', handleDashboardBranchChange);
    };
  }, []);
  
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  
  const toggleUserMenu = (e) => {
    e.stopPropagation();
    setUserMenuOpen(!userMenuOpen);
  };
  
  const handleBranchChange = (e) => {
    e.stopPropagation();
    const newBranch = e.target.value;
    setSelectedBranch(newBranch);
    
    // Lag data for den valgte filialen
    const branchId = newBranch === 'Kolbotn' ? 'b1' : 'b2';
    const branchFullName = newBranch === 'Kolbotn' ? 'Kolbotn bibliotek' : 'Ski bibliotek';
    const branchAddress = newBranch === 'Kolbotn' ? 'Kolbotnveien 22, 1410 Kolbotn' : 'Kirkeveien 3, 1400 Ski';
    
    const branchData = {
      id: branchId,
      name: branchFullName,
      address: branchAddress,
      theme: '#7d203a',
    };
    
    // Lagre i localStorage og send til HomeDashboard
    localStorage.setItem('currentBranch', JSON.stringify(branchData));
    window.dispatchEvent(new CustomEvent('branchChanged', { detail: branchData }));
  };
  
  const closeSidebar = () => {
    if (isMobile) {
      setIsOpen(false);
    }
    setUserMenuOpen(false);
  };
  
  const handleLogout = () => {
    // Redirect til hjemmesiden
    navigate('/');
  };
  
  const openProfileModal = (e) => {
    e.preventDefault();
    setShowProfileModal(true);
    setUserMenuOpen(false);
  };

  return (
    <>
      {isMobile && (
        <button 
          className="sidebar-toggle" 
          onClick={toggleSidebar} 
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6V8H21V6H3Z" fill="white"/>
          </svg>
        </button>
      )}
      
      {isOpen && <div className="sidebar-overlay active" onClick={closeSidebar} aria-hidden="true"></div>}
      
      <div className={`sidebar ${isOpen ? 'open' : ''}`} role="navigation" aria-label="Main navigation">
        <div className="user-profile no-hover" onClick={toggleUserMenu} ref={userMenuRef}>
          <div className="user-avatar">
            AB
            <div className={`avatar-arrow ${userMenuOpen ? 'open' : ''}`} aria-hidden="true">
              <svg width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.5 0.5L4 4L7.5 0.5" stroke="#7d203a" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className="user-name">Alex Bergersen</div>
          <div className="user-meta">
            <span className="user-branch">{selectedBranch}</span>
          </div>
          
          <div className={`user-dropdown ${userMenuOpen ? 'open' : ''}`} aria-hidden={!userMenuOpen}>
            <div className="dropdown-header">
              <span>Brukervalg</span>
            </div>
            <div className="user-dropdown-item">
              <label htmlFor="branch-select">Filial:</label>
              <select 
                id="branch-select"
                className="branch-selector" 
                value={selectedBranch} 
                onChange={handleBranchChange}
                onClick={(e) => e.stopPropagation()}
              >
                {branches.map(branch => (
                  <option key={branch} value={branch}>{branch}</option>
                ))}
              </select>
            </div>
            <button 
              className="user-dropdown-item profile-settings-btn" 
              onClick={openProfileModal}
            >
              <span className="dropdown-icon settings-profile-icon" aria-hidden="true"></span>
              Profilinnstillinger
            </button>
            <div className="user-dropdown-item logout-item" onClick={handleLogout}>
              <span className="dropdown-icon logout-icon" aria-hidden="true"></span>
              Logg ut
            </div>
          </div>
        </div>
        
        <div className="sidebar-nav">
          <ul>
            <li>
              <NavLink 
                to="/dashboard" 
                className={({isActive}) => isActive ? 'active' : ''} 
                onClick={closeSidebar}
              >
                <span className="menu-icon home-icon" aria-hidden="true"></span>
                <span className="menu-text">Hjem</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/låner" 
                className={({isActive}) => isActive ? 'active' : ''} 
                onClick={closeSidebar}
              >
                <span className="menu-icon user-icon" aria-hidden="true"></span>
                <span className="menu-text">Lånere</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/samlinger" 
                className={({isActive}) => isActive ? 'active' : ''} 
                onClick={closeSidebar}
              >
                <span className="menu-icon collection-icon" aria-hidden="true"></span>
                <span className="menu-text">Samlinger</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/reservering" 
                className={({isActive}) => isActive ? 'active' : ''} 
                onClick={closeSidebar}
              >
                <span className="menu-icon reservation-icon" aria-hidden="true"></span>
                <span className="menu-text">Reservering</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/innkjøp" 
                className={({isActive}) => isActive ? 'active' : ''} 
                onClick={closeSidebar}
              >
                <span className="menu-icon purchase-icon" aria-hidden="true"></span>
                <span className="menu-text">Innkjøp</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/fjernlån" 
                className={({isActive}) => isActive ? 'active' : ''} 
                onClick={closeSidebar}
              >
                <span className="menu-icon loan-icon" aria-hidden="true"></span>
                <span className="menu-text">Fjernlån</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/arrangementer" 
                className={({isActive}) => isActive ? 'active' : ''} 
                onClick={closeSidebar}
              >
                <span className="menu-icon event-icon" aria-hidden="true"></span>
                <span className="menu-text">Arrangementer</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/statistikk" 
                className={({isActive}) => isActive ? 'active' : ''} 
                onClick={closeSidebar}
              >
                <span className="menu-icon stats-icon" aria-hidden="true"></span>
                <span className="menu-text">Statistikk</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/oppsett" 
                className={({isActive}) => isActive ? 'active' : ''} 
                onClick={closeSidebar}
              >
                <span className="menu-icon settings-icon" aria-hidden="true"></span>
                <span className="menu-text">Oppsett</span>
              </NavLink>
            </li>
            <li className="help-menu-item">
               <NavLink 
                to="/hjelp" 
                className={({isActive}) => `help-link ${isActive ? 'active' : ''}`} 
                onClick={closeSidebar}
              >
                <span className="menu-icon help-icon" aria-hidden="true"></span>
                <span className="menu-text">Hjelp (F1)</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Profilinnstillinger modal */}
      {showProfileModal && (
        <div className="modal-overlay">
          <div className="modal profile-modal" ref={profileModalRef}>
            <div className="modal-header">
              <h2>Profilinnstillinger</h2>
              <button 
                className="close-button" 
                onClick={() => setShowProfileModal(false)}
                aria-label="Lukk"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" fill="currentColor"/>
                </svg>
              </button>
            </div>
            
            <div className="modal-content">
              <div className="profile-info">
                <div className="profile-avatar">
                  <div className="large-avatar">AB</div>
                </div>
                <div className="profile-details">
                  <h3>Alex Bergersen</h3>
                  <p className="profile-role">Bibliotekar</p>
                  <p className="profile-organization">Nordre Follo Bibliotek</p>
                  <p className="profile-branch">Filial: {selectedBranch}</p>
                </div>
              </div>
              
              <div className="profile-settings-section">
                <h4>Endre passord</h4>
                <div className="form-group">
                  <label htmlFor="current-password">Nåværende passord</label>
                  <input 
                    type="password" 
                    id="current-password" 
                    placeholder="••••••••"
                    disabled
                  />
                  <p className="form-note">Passord brukes ikke i denne demoversjonen</p>
                </div>
                
                <div className="form-group">
                  <label htmlFor="new-password">Nytt passord</label>
                  <input 
                    type="password" 
                    id="new-password" 
                    placeholder="••••••••"
                    disabled
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirm-password">Bekreft nytt passord</label>
                  <input 
                    type="password" 
                    id="confirm-password" 
                    placeholder="••••••••"
                    disabled
                  />
                </div>
              </div>
              
              <div className="profile-settings-section">
                <h4>Kontaktinformasjon</h4>
                <div className="form-group">
                  <label htmlFor="email">E-post</label>
                  <input 
                    type="email" 
                    id="email" 
                    value="alex.bergersen@nordrefollo.no"
                    readOnly
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">Telefon</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    value="479 82 XXX"
                    readOnly
                  />
                </div>
              </div>
              
              <div className="modal-actions">
                <button 
                  className="modal-button secondary"
                  onClick={() => setShowProfileModal(false)}
                >
                  Lukk
                </button>
                <button 
                  className="modal-button primary"
                  onClick={() => {
                    alert('Endringer lagret (demo)');
                    setShowProfileModal(false);
                  }}
                  disabled
                >
                  Lagre endringer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;