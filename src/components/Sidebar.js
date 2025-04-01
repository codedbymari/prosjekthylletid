// src/components/Sidebar.js
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  // Handle window resize
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
  
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  
  const closeSidebar = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Close sidebar with Escape key
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
      
      // Open help with F1 key
      if (event.key === 'F1') {
        event.preventDefault();
        window.location.href = '/hjelp';
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <>
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
      
      {isOpen && <div className="sidebar-overlay active" onClick={closeSidebar} aria-hidden="true"></div>}
      
      <div className={`sidebar ${isOpen ? 'open' : ''}`} role="navigation" aria-label="Main navigation">
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
            {/* Help link as part of the main menu but with a special class */}
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