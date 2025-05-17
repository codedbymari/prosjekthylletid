import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import HomePage from './components/HomePage';
import HomeDashboard from './components/HomeDashboard';
import BorrowerDashboard from './components/BorrowerDashboard';
import ReserveringDashboard from './components/reservation/ReserveringDashboard';
import ToastNotification from './components/common/ToastNotification'; 
import UnavailableFeatureTooltip from './components/layout/UnavailableFeatureTooltip';
import './layout.css';
import './App.css';

// List of routes that are not implemented in the prototype
const unavailableRoutes = [
  '/samlinger',
  '/innkjøp',
  '/fjernlån',
  '/arrangementer',
  '/statistikk',
  '/oppsett',
  '/hjelp'
];

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/*" element={<AppLayout />} />
    </Routes>
  );
}

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [showFeatureTooltip, setShowFeatureTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: '50%', left: '50%' });
  
  const location = useLocation();
  const navigate = useNavigate();

  // Check if current path is in unavailable routes
  useEffect(() => {
    const currentPath = '/' + location.pathname.split('/')[1];
    if (unavailableRoutes.includes(currentPath)) {
      // Navigate back to previous page or home
      navigate(-1, { replace: true });
      
      // Show the tooltip in the center of the screen
      setTooltipPosition({ top: '50%', left: '50%' });
      setShowFeatureTooltip(true);
    }
  }, [location.pathname, navigate]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const showToastMessage = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const handleUnavailableFeature = (e, path, position) => {
    e.preventDefault();
    // Use the position where the click happened if provided
    if (position) {
      setTooltipPosition(position);
    }
    setShowFeatureTooltip(true);
  };

  useEffect(() => {
    const headerElement = document.querySelector('.app-header');
    if (headerElement) {
      const headerHeight = headerElement.offsetHeight;
      document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
    }
  }, []);

  return (
    <div className="app-container">
      <Header onMenuClick={toggleSidebar} />
      <div className="main-content">
        <Sidebar 
          isOpen={sidebarOpen} 
          onToggle={toggleSidebar} 
          unavailableRoutes={unavailableRoutes}
          onUnavailableFeature={handleUnavailableFeature}
        />
        <div className="content-area">
          <Routes>
            <Route path="/hjem" element={<HomeDashboard showToast={showToastMessage} />} />
            <Route path="/laaner" element={<BorrowerDashboard showToast={showToastMessage} />} />
            <Route path="/laaner/:borrowerId" element={<BorrowerDashboard showToast={showToastMessage} />} />
            <Route path="/reservering" element={<ReserveringDashboard showToast={showToastMessage} />} />
            <Route path="/reservering/oversikt" element={<ReserveringDashboard showToast={showToastMessage} />} />
            <Route path="/reservering/aktive" element={<ReserveringDashboard showToast={showToastMessage} />} />
            <Route path="/reservering/innstillinger" element={<ReserveringDashboard showToast={showToastMessage} />} />
          </Routes>
        </div>
      </div>

      <ToastNotification
        visible={showToast}
        message={toastMessage}
        type={toastType}
        onClose={() => setShowToast(false)}
      />
      
      <UnavailableFeatureTooltip
        isVisible={showFeatureTooltip}
        onClose={() => setShowFeatureTooltip(false)}
        position={tooltipPosition}
      />
    </div>
  );
}

export default App;