import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  // Change to true so sidebar is open by default
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const location = useLocation();
  
  // Get selected branch from localStorage or use Kolbotn as default
  const [selectedBranch, setSelectedBranch] = useState(() => {
    const saved = localStorage.getItem('currentBranch');
    return saved ? JSON.parse(saved).name : 'Kolbotn';
  });
  
  const userMenuRef = useRef(null);
  const profileModalRef = useRef(null);
  const sidebarRef = useRef(null);
  const toggleButtonRef = useRef(null);
  const contentAreaRef = useRef(null);
  const navigate = useNavigate();
  
  // List of branches
  const branches = ['Kolbotn', 'Ski'];
  
  // List of active and placeholder routes
  const activeRoutes = ['/hjem', '/låner', '/reservering'];
  const placeholderRoutes = ['/samlinger', '/innkjøp', '/fjernlån', '/arrangementer', '/statistikk', '/oppsett', '/hjelp'];
  
  // Function to update toggle button position and content margin
  const updatePositions = () => {
    const sidebar = sidebarRef.current;
    const toggleButton = toggleButtonRef.current;
    const contentArea = document.querySelector('.content-area');
    
    if (sidebar && toggleButton && contentArea) {
      // Get the sidebar's right edge position
      const sidebarRightEdge = sidebar.getBoundingClientRect().right;
      
      // Set the toggle button's left position
      toggleButton.style.left = `${sidebarRightEdge}px`;
      
      // Set content margin based on sidebar state
      // In mobile view, content area should not have a margin
      if (!isMobile) {
        contentArea.style.marginLeft = isOpen ? '240px' : '60px';
      } else {
        contentArea.style.marginLeft = '0';
      }
    }
  };
  
  useEffect(() => {
    document.body.classList.toggle('sidebar-collapsed', !isOpen);
    
    // Update positions after sidebar state change
    // Use double requestAnimationFrame to ensure CSS transitions complete
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        updatePositions();
      });
    });
  }, [isOpen]);
  
  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth <= 768;
      setIsMobile(newIsMobile);
      
      // If switching to mobile, automatically collapse sidebar
      if (newIsMobile && !isMobile) {
        setIsOpen(false);
      }
      
      // Update positions on resize
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
  }, [isMobile]);
  
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
    };
    
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (showProfileModal) {
          setShowProfileModal(false);
        } else if (userMenuOpen) {
          setUserMenuOpen(false);
        } else if (isOpen && isMobile) {
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
  }, [isOpen, userMenuOpen, showProfileModal, navigate, isMobile]);
  
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
    
    // Save to localStorage and dispatch to HomeDashboard
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

  // Handler for navigation links
  const handleNavLinkClick = (path, e) => {
    // On mobile, close the sidebar
    if (isMobile) {
      closeSidebar();
    }
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
      '/låner': (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      ),
      '/samlinger': (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" />
        </svg>
      ),
      '/reservering': (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z" />
        </svg>
      ),
      '/innkjøp': (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
        </svg>
      ),
      '/fjernlån': (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12z" />
        </svg>
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

  // Handle "back" action for PagePlaceholder
  const handlePlaceholderBack = () => {
    navigate(-1);
  };

  // Handle "home" action for PagePlaceholder
  const handlePlaceholderHome = () => {
    navigate('/hjem');
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
              { path: '/låner', text: 'Lånere' },
              { path: '/samlinger', text: 'Samlinger' },
              { path: '/reservering', text: 'Reservering' },
              { path: '/innkjøp', text: 'Innkjøp' },
              { path: '/fjernlån', text: 'Fjernlån' },
              { path: '/arrangementer', text: 'Arrangementer' },
              { path: '/statistikk', text: 'Statistikk' },
              { path: '/oppsett', text: 'Oppsett' }
            ].map((item) => (
              <li key={item.path}>
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
              </li>
            ))}
          </ul>
          
          <ul className="bottom-menu">
            <li className="help-menu-item">
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
            fill="white"
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
    </>
  );
}

export default Sidebar;