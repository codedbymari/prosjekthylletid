import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('Kolbotn');
  const userMenuRef = useRef(null);
  const navigate = useNavigate();
  
  // filialer
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
    };
    
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (userMenuOpen) {
          setUserMenuOpen(false);
        } else if (isOpen) {
          setIsOpen(false);
        }
      }
      
      // Open help with F1 key
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
  }, [isOpen, userMenuOpen, navigate]);
  
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  
  const toggleUserMenu = (e) => {
    e.stopPropagation();
    setUserMenuOpen(!userMenuOpen);
  };
  
  const handleBranchChange = (e) => {
    e.stopPropagation();
    setSelectedBranch(e.target.value);
  };
  
  const closeSidebar = () => {
    if (isMobile) {
      setIsOpen(false);
    }
    setUserMenuOpen(false);
  };
  
  const handleLogout = () => {
    alert('Logger deg ut...');
 
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
        <div className="user-profile" onClick={toggleUserMenu} ref={userMenuRef}>
          <div className="user-avatar">
            JS
            <div className={`avatar-arrow ${userMenuOpen ? 'open' : ''}`} aria-hidden="true">
              <svg width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.5 0.5L4 4L7.5 0.5" stroke="#7d203a" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className="user-name">Jens Christian Strandos</div>
          <div className="user-meta">
            <span className="user-branch">{selectedBranch}</span>
            <span className="user-role">Leder</span>
          </div>
          
          <div className={`user-dropdown ${userMenuOpen ? 'open' : ''}`} aria-hidden={!userMenuOpen}>
            <div className="dropdown-header">
              <span>Brukervalg</span>
            </div>
            <div className="user-dropdown-item">
              <span className="dropdown-icon branch-icon" aria-hidden="true"></span>
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
            <NavLink to="/profil" className="user-dropdown-item" onClick={closeSidebar}>
              <span className="dropdown-icon settings-profile-icon" aria-hidden="true"></span>
              Profilinnstillinger
            </NavLink>
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
                to="/" 
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
    </>
  );
}

export default Sidebar;