// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import BorrowerDashboard from './components/BorrowerDashboard';
import ReserveringDashboard from './components/ReserveringDashboard';
import Reservations from './Backend/Reservations'
import './layout.css'; // Import the global layout styles
import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="app-container">
      <Header onMenuClick={toggleSidebar} />
      <div className="main-content">
        <Sidebar className={sidebarOpen ? 'open' : ''} />
        <div className="content-area">
          <Routes>
            <Route path="/" element={<div>Home Dashboard</div>} />
            <Route path="/låner" element={<BorrowerDashboard />} />
            <Route path="/låner/:borrowerId" element={<BorrowerDashboard />} />
            <Route path="/reservering" element={<Reservations />}/>
            {/* Add other routes as needed */}
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;