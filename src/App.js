import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ReservationDashboard from './components/ReservationDashboard';
import BorrowerDashboard from './components/BorrowerDashboard';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<ReservationDashboard />} />
        <Route path="/lanere/:borrowerId" element={<BorrowerDashboard />} />
      </Routes>
    </div>
  );
}

export default App;
