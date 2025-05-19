// src/components/borrowers/BorrowerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { generateMockData } from '../../utils/mockData.js';
import BorrowersList from './list/BorrowersList';
import BorrowerDetail from './detail/BorrowerDetail';
import LoadingIndicator from './common/LoadingIndicator';
import './BorrowerDashboard.css';

function BorrowerDashboard() {
  const { borrowerId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [mockData, setMockData] = useState([]);

  useEffect(() => {
    // Simulate API call with loading state
    setIsLoading(true);
    
    // Simulate network delay
    const fetchTimer = setTimeout(() => {
      // Get mock data
      const data = generateMockData();
      setMockData(data);
      setIsLoading(false);
    }, 600);
    
    // Clean up timer on unmount
    return () => clearTimeout(fetchTimer);
  }, [borrowerId]); // Re-run when borrowerId changes

  // Show a different view based on whether we're looking at a specific borrower
  if (borrowerId) {
    return (
      <div className="borrower-dashboard-wrapper">
        {isLoading ? (
          <LoadingIndicator message="Laster lånerinformasjon..." />
        ) : (
          <BorrowerDetail 
            borrowerId={borrowerId} 
            mockData={mockData} 
          />
        )}
      </div>
    );
  }
  
  // If no borrowerId, show the borrowers list view
  return (
    <BorrowersList 
      mockData={mockData} 
      isLoading={isLoading} 
    />
  );
}

export default BorrowerDashboard;