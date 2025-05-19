import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import './styles/Sidebar.css';
import UnavailableFeatureTooltip from './UnavailableFeatureTooltip';

function Sidebar({ unavailableRoutes = [], onUnavailableFeature }) {
  // sidebar is open by default
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [hoveredUnavailableItem, setHoveredUnavailableItem] = useState(null);
  
  // State for tooltip
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [tooltipMessage, setTooltipMessage] = useState('');
  
  // use Kolbotn as default
  const [selectedBranch, setSelectedBranch] = useState(() => {
    const saved = localStorage.getItem('currentBranch');
    return saved ? JSON.parse(saved).name : 'Kolbotn';
  });
  
  const userMenuRef = useRef(null);
  const profileModalRef = useRef(null);
  const sidebarRef = useRef(null);
  const toggleButtonRef = useRef(null);
  const itemRefs = useRef({});
  const navigate = useNavigate();
  const location = useLocation();
  
  // List of branches
  const branches = ['Kolbotn', 'Ski'];
  

  const updatePositions = useCallback(() => {
    const sidebar = sidebarRef.current;
    const toggleButton = toggleButtonRef.current;
    const contentArea = document.querySelector('.content-area');
    
    if (sidebar && toggleButton && contentArea) {
      const sidebarRightEdge = sidebar.getBoundingClientRect().right;
      
      toggleButton.style.left = `${sidebarRightEdge}px`;
      

      if (!isMobile) {
        contentArea.style.marginLeft = isOpen ? '240px' : '60px';
      } else {
        contentArea.style.marginLeft = '0';
      }
    }
  }, [isOpen, isMobile]); // Dependencies for updatePositions
  
  useEffect(() => {
    document.body.classList.toggle('sidebar-collapsed', !isOpen);
    
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        updatePositions();
      });
    });
  }, [isOpen, updatePositions]); 
  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth <= 768;
      setIsMobile(newIsMobile);
      
      if (newIsMobile && !isMobile) {
        setIsOpen(false);
      }
      
      requestAnimationFrame(() => {
        updatePositions();
      });
    };
    
    // Initial position update
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        updatePositions();
      });
    });
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile, updatePositions]); // Now updatePositions is stable
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      
      if (profileModalRef.current && !profileModalRef.current.contains(event.target)) {
        setShowProfileModal(false);
      }
      
      // Close sidebar on mobile when clicking outside
      if (isMobile && isOpen && !event.target.closest('.sidebar') && 
          !event.target.closest('.sidebar-toggle') &&
          !event.target.closest('.sidebar-edge-toggle')) {
        setIsOpen(false);
      }
      
      // Close tooltip when clicking outside
      if (tooltipVisible && !event.target.closest('.unavailable') && 
          !event.target.closest('.unavailable-feature-tooltip')) {
        setTooltipVisible(false);
      }
    };
    
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (showProfileModal) {
          setShowProfileModal(false);
        } else if (userMenuOpen) {
          setUserMenuOpen(false);
        } else if (isOpen && isMobile) {
          setIsOpen(false);
        } else if (tooltipVisible) {
          setTooltipVisible(false);
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
  }, [isOpen, userMenuOpen, showProfileModal, navigate, isMobile, tooltipVisible]);
  
  // Listen for changes from HomeDashboard
  useEffect(() => {
    const handleDashboardBranchChange = (event) => {
      setSelectedBranch(event.detail.name.split(' ')[0]); // Only take first word (Kolbotn/Ski)
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
    
    // Create data for the selected branch
    const branchId = newBranch === 'Kolbotn' ? 'b1' : 'b2';
    const branchFullName = newBranch === 'Kolbotn' ? 'Kolbotn bibliotek' : 'Ski bibliotek';
    const branchAddress = newBranch === 'Kolbotn' ? 'Kolbotnveien 22, 1410 Kolbotn' : 'Kirkeveien 3, 1400 Ski';
    
    const branchData = {
      id: branchId,
      name: branchFullName,
      address: branchAddress,
      theme: '#7d203a',
    };
    
    localStorage.setItem('currentBranch', JSON.stringify(branchData));
    window.dispatchEvent(new CustomEvent('branchChanged', { detail: branchData }));
  };
  
  const closeSidebar = () => {
    setIsOpen(false);
    setUserMenuOpen(false);
  };
  
  const handleLogout = () => {
    // Redirect to homepage
    navigate('/');
  };
  
  const openProfileModal = (e) => {
    e.preventDefault();
    setShowProfileModal(true);
    setUserMenuOpen(false);
  };

  const handleMouseEnter = (path) => {
    if (unavailableRoutes && unavailableRoutes.includes(path)) {
      setHoveredUnavailableItem(path);
    }
  };

  const handleMouseLeave = () => {
    setHoveredUnavailableItem(null);
  };

  const handleUnavailableClick = (e, path) => {
    e.preventDefault();
    
    // Get position of the clicked item for tooltip placement
    if (itemRefs.current[path]) {
      const rect = itemRefs.current[path].getBoundingClientRect();
      const position = {
        top: rect.top + rect.height / 2,
        left: rect.left + rect.width + 20, 
      };
      
      // Set tooltip message based on the route
      let message = 'Denne funksjonen er ikke tilgjengelig i prototypen';
      
      if (path === '/fjernlån') {
        message = 'Fjernlån-funksjonen kommer i en senere versjon av prototypen';
      } else if (path === '/innkjøp') {
        message = 'Innkjøp-funksjonen er under utvikling';
      } else if (path === '/oppsett') {
        message = 'Oppsett er kun tilgjengelig for administratorer';
      }
      
      // Show the tooltip with position and message
      setTooltipPosition(position);
      setTooltipMessage(message);
      setTooltipVisible(true);
      
      // Also call the original handler if provided
      if (onUnavailableFeature) {
        onUnavailableFeature(e, path, position);
      }
    }
  };

  // Handler to close the tooltip
  const handleCloseTooltip = () => {
    setTooltipVisible(false);
  };

  // Handler for navigation links
  const handleNavLinkClick = (path, e) => {
    // Check if route is unavailable
    if (unavailableRoutes && unavailableRoutes.includes(path)) {
      handleUnavailableClick(e, path);
      return;
    }

    // On mobile, close the sidebar
    if (isMobile) {
      closeSidebar();
    }
  };

  // Function to check if a path is currently active
  const isActive = (path) => {
    const currentPath = '/' + location.pathname.split('/')[1];
    return currentPath === path;
  };

  // Icon mapping for the menu items
  const getIconForRoute = (route) => {
    // SVG icons for each route - using explicit SVG elements instead of CSS backgrounds
    const icons = {
      '/hjem': (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
      ),
      '/laaner': (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      ),
      '/samlinger': (
        <svg width="24" height="24" viewBox="0 0 33 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M6.59 9.935v19.234H1.995V9.935h4.59m1.1-2H.905a.9.9 0 0 0-.9.9v21.424a.9.9 0 0 0 .9.9h6.78a.9.9 0 0 0 .9-.9V8.84a.9.9 0 0 0-.9-.9ZM18.095 2v27.169h-4.344V2zm1.1-2h-6.54a.9.9 0 0 0-.9.9v29.359a.9.9 0 0 0 .9.9h6.534a.9.9 0 0 0 .9-.9V.907a.9.9 0 0 0-.9-.9ZM29.66 13.658v15.511h-4.222V13.658zm1.1-2h-6.412a.9.9 0 0 0-.9.9v17.7a.9.9 0 0 0 .9.9h6.412a.905.905 0 0 0 .9-.9v-17.7a.905.905 0 0 0-.9-.9"/>
        <path d="M0 12.56h8.59v2H0zm11.75-6.811h8.344v2H11.75zm0 3.742h8.344v2H11.75zm11.687 5.663h8.223v2h-8.223zm0 3.398h8.223v2h-8.223z"/></svg>
      ),
      '/reservering': (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z" />
        </svg>
      ),
      '/innkjøp': (
        <svg xmlns="http://www.w3.org/2000/svg" width="55" height="55" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.5 13v9m0-9-8-5m8 5 8-5m-12-2.5 8 5M4.5 8l8-5 8 5v9l-8 5-8-5z" stroke="#7d203a" stroke-width="1.2"/>
        </svg> 
      ),
      '/fjernlån': (
        <svg width="24" height="24" viewBox="0 0 1024 1024" fill="currentColor" class="icon" xmlns="http://www.w3.org/2000/svg">
          <path d="M128.896 736H96a32 32 0 0 1-32-32V224a32 32 0 0 1 32-32h576a32 32 0 0 1 32 32v96h164.544a32 32 0 0 1 31.616 27.136l54.144 352A32 32 0 0 1 922.688 736h-91.52a144 144 0 1 1-286.272 0H415.104a144 144 0 1 1-286.272 0zm23.36-64a143.872 143.872 0 0 1 239.488 0H568.32c17.088-25.6 42.24-45.376 71.744-55.808V256H128v416zm655.488 0h77.632l-19.648-128H704v64.896A144 144 0 0 1 807.744 672m48.128-192-14.72-96H704v96zM688 832a80 80 0 1 0 0-160 80 80 0 0 0 0 160m-416 0a80 80 0 1 0 0-160 80 80 0 0 0 0 160"/></svg>
      ),
      '/arrangementer': (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5z" />
        </svg>
      ),
      '/statistikk': (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4zm2 2H5V5h14v14zm0-16H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
        </svg>
      ),
      '/oppsett': (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
        </svg>
      ),
      '/hjelp': (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
        </svg>
      )
    };
    
    return icons[route] || (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
      </svg>
    );
  };

  return (
    <>
      {/* Mobile toggle */}
      {isMobile && (
        <button className="sidebar-toggle" onClick={toggleSidebar} aria-label="Toggle navigation menu" aria-expanded={isOpen}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6V8H21V6H3Z" fill="white" />
          </svg>
        </button>
      )}
  
      {/* Sidebar */}
      <div 
        className={`sidebar ${isOpen ? 'open' : 'mini'}`} 
        role="navigation" 
        aria-label="Main navigation"
        ref={sidebarRef}
      >
        {/* User profile section */}
        <div className={`user-profile ${isOpen ? '' : 'mini'}`} onClick={isOpen ? toggleUserMenu : toggleSidebar} ref={userMenuRef}>
          <div className="user-avatar">
            AB
            {isOpen && (
              <div className={`avatar-arrow ${userMenuOpen ? 'open' : ''}`} aria-hidden="true">
                <svg width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0.5 0.5L4 4L7.5 0.5" stroke="#7d203a" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
          </div>
          {isOpen && (
            <>
              <div className="user-name">Alex Bergersen</div>
              <div className="user-meta">
                <span className="user-branch">{selectedBranch}</span>
              </div>
            </>
          )}
          
          {isOpen && (
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
                <span className="dropdown-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </span>
                Profilinnstillinger
              </button>
              <div className="user-dropdown-item logout-item" onClick={handleLogout}>
                <span className="dropdown-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                  </svg>
                </span>
                Logg ut
              </div>
            </div>
          )}
        </div>
        
        <div className="sidebar-nav">
          <ul className="main-menu">
            {[
              { path: '/hjem', text: 'Hjem' },
              { path: '/laaner', text: 'Lånere' },
              { path: '/samlinger', text: 'Samlinger' },
              { path: '/reservering', text: 'Reservering' },
              { path: '/innkjøp', text: 'Innkjøp' },
              { path: '/fjernlån', text: 'Fjernlån' },
              { path: '/arrangementer', text: 'Arrangementer' },
              { path: '/statistikk', text: 'Statistikk' },
              { path: '/oppsett', text: 'Oppsett' }
            ].map((item) => {
              const isUnavailable = unavailableRoutes && unavailableRoutes.includes(item.path);
              const isItemActive = isActive(item.path);
              const isItemHovered = hoveredUnavailableItem === item.path;
              
              return (
                <li 
                  key={item.path}
                  ref={el => itemRefs.current[item.path] = el}
                  onMouseEnter={() => handleMouseEnter(item.path)}
                  onMouseLeave={handleMouseLeave}
                  className={isUnavailable ? 'unavailable' : ''}
                >
                  {isUnavailable ? (
                    <a 
                      href="#" 
                      className={`${isItemActive ? 'active' : ''} ${!isOpen ? 'icon-only' : ''}`}
                      onClick={(e) => handleUnavailableClick(e, item.path)}
                      title={item.text}
                    >
                      <span className="menu-icon" aria-hidden="true">
                        {getIconForRoute(item.path)}
                      </span>
                      {isOpen && <span className="menu-text">{item.text}</span>}
                      {isOpen && isItemHovered && (
                        <div className="unavailable-tooltip">
                        </div>
                      )}
                    </a>
                  ) : (
                    <NavLink 
                      to={item.path} 
                      className={({isActive}) => `${isActive ? 'active' : ''} ${!isOpen ? 'icon-only' : ''}`} 
                      onClick={(e) => handleNavLinkClick(item.path, e)}
                      title={item.text}
                    >
                      <span className="menu-icon" aria-hidden="true">
                        {getIconForRoute(item.path)}
                      </span>
                      {isOpen && <span className="menu-text">{item.text}</span>}
                    </NavLink>
                  )}
                </li>
              );
            })}
          </ul>
          
          <ul className="bottom-menu">
            <li 
              className="help-menu-item"
              ref={el => itemRefs.current['/hjelp'] = el}
              onMouseEnter={() => handleMouseEnter('/hjelp')}
              onMouseLeave={handleMouseLeave}
            >
              {unavailableRoutes && unavailableRoutes.includes('/hjelp') ? (
                <a 
                  href="#" 
                  className={`help-link ${isActive('/hjelp') ? 'active' : ''} ${!isOpen ? 'icon-only' : ''}`}
                  onClick={(e) => handleUnavailableClick(e, '/hjelp')}
                  title="Hjelp (F1)"
                >
                  <span className="menu-icon" aria-hidden="true">
                    {getIconForRoute('/hjelp')}
                  </span>
                  {isOpen && <span className="menu-text">Hjelp (F1)</span>}
                  {isOpen && hoveredUnavailableItem === '/hjelp' && (
                    <div className="unavailable-tooltip">
                    </div>
                  )}
                </a>
              ) : (
                <NavLink 
                  to="/hjelp" 
                  className={({isActive}) => `help-link ${isActive ? 'active' : ''} ${!isOpen ? 'icon-only' : ''}`} 
                  onClick={(e) => handleNavLinkClick('/hjelp', e)}
                  title="Hjelp (F1)"
                >
                  <span className="menu-icon" aria-hidden="true">
                    {getIconForRoute('/hjelp')}
                  </span>
                  {isOpen && <span className="menu-text">Hjelp (F1)</span>}
                </NavLink>
              )}
            </li>
          </ul>
        </div>
      </div>
  
      {/* Toggle button that sticks out */}
      <button 
        className="sidebar-edge-toggle" 
        ref={toggleButtonRef}
        onClick={toggleSidebar} 
        aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
      >
     <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d={isOpen
              ? "M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"
              : "M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"}
            fill="currentColor"
          />
        </svg>
      </button>
      
      {/* Profile settings modal */}
      
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

{tooltipVisible && (
  <UnavailableFeatureTooltip
    position={tooltipPosition}
    message={tooltipMessage}
    onClose={handleCloseTooltip}
  />
)}

    </>
  );
  
}

export default Sidebar;
