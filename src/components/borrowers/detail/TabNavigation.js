// src/components/borrowers/detail/TabNavigation.jsx
import React from 'react';

function TabNavigation({ activeTab, onTabChange, tabs }) {
  return (
    <div className="tab-navigation">
      {tabs.map(tab => (
        <button 
          key={tab.id}
          onClick={() => onTabChange(tab.id)} 
          className={activeTab === tab.id ? 'active' : ''}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default TabNavigation;