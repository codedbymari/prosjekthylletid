import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import HomePage from './components/HomePage';
import HomeDashboard from './components/HomeDashboard';
import BorrowerDashboard from './components/BorrowerDashboard';
import ReserveringDashboard from './components/reservation/ReserveringDashboard';
import ToastNotification from './components/common/ToastNotification'; 
import PagePlaceholder from './components/layout/PagePlaceholder';
import './layout.css';
import './App.css';

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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const showToastMessage = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
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
        <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
        <div className="content-area">
          <Routes>
            <Route path="/hjem" element={<HomeDashboard showToast={showToastMessage} />} />
            <Route path="/låner" element={<BorrowerDashboard showToast={showToastMessage} />} />
            <Route path="/låner/:borrowerId" element={<BorrowerDashboard showToast={showToastMessage} />} />
            <Route path="/reservering" element={<ReserveringDashboard showToast={showToastMessage} />} />
            <Route path="/reservering/oversikt" element={<ReserveringDashboard showToast={showToastMessage} />} />
            <Route path="/reservering/aktive" element={<ReserveringDashboard showToast={showToastMessage} />} />
            <Route path="/reservering/innstillinger" element={<ReserveringDashboard showToast={showToastMessage} />} />
            {/*  <Route path="/statistikk" element={<ReservasjonStatistikk showToast={showToastMessage} />} /> */}
            
            <Route path="/samlinger" element={<PagePlaceholder pageName="/samlinger" onBack={() => window.history.back()} onHome={() => window.location.href = '/hjem'} />} />
            <Route path="/innkjøp" element={<PagePlaceholder pageName="/innkjøp" onBack={() => window.history.back()} onHome={() => window.location.href = '/hjem'} />} />
            <Route path="/fjernlån" element={<PagePlaceholder pageName="/fjernlån" onBack={() => window.history.back()} onHome={() => window.location.href = '/hjem'} />} />
            <Route path="/arrangementer" element={<PagePlaceholder pageName="/arrangementer" onBack={() => window.history.back()} onHome={() => window.location.href = '/hjem'} />} />
            <Route path="/statistikk" element={<PagePlaceholder pageName="/statistikk" onBack={() => window.history.back()} onHome={() => window.location.href = '/hjem'} />} />
            <Route path="/oppsett" element={<PagePlaceholder pageName="/oppsett" onBack={() => window.history.back()} onHome={() => window.location.href = '/hjem'} />} />
            <Route path="/hjelp" element={<PagePlaceholder pageName="/hjelp" onBack={() => window.history.back()} onHome={() => window.location.href = '/hjem'} />} />
           
            <Route path="*" element={<Navigate to="/hjem" replace />} />

          </Routes>
        </div>
      </div>

      <ToastNotification
        visible={showToast}
        message={toastMessage}
        type={toastType}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}

export default App;
