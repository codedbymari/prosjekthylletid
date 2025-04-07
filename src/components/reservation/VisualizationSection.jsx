// src/components/reservation/VisualizationSection.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FiDownload, FiChevronDown } from 'react-icons/fi';
import ReportChart from '../chart/ReportChart';
import ExportMenu from './ExportMenu';

function VisualizationSection({ 
  materialData, 
  reminderLogs, 
  pickupTimeLimit, 
  reminderDays,
  showToast 
}) {
  const [showStatistics, setShowStatistics] = useState(true);
  const [statisticsView, setStatisticsView] = useState('weekly');
  
  const generateChartData = () => {
    switch (statisticsView) {
      case 'weekly':
        return [
          { periode: 'Man', antallDager: 1.5, antallIkkeHentet: 5 },
          { periode: 'Tir', antallDager: 2.1, antallIkkeHentet: 3 },
          { periode: 'Ons', antallDager: 2.8, antallIkkeHentet: 4 },
          { periode: 'Tor', antallDager: 3.2, antallIkkeHentet: 6 },
          { periode: 'Fre', antallDager: 2.5, antallIkkeHentet: 4 },
          { periode: 'Lør', antallDager: 1.9, antallIkkeHentet: 2 },
          { periode: 'Søn', antallDager: 1.2, antallIkkeHentet: 1 },
        ];
      case 'monthly':
        return [
          { periode: 'Jan', antallDager: 2.5, antallIkkeHentet: 15 },
          { periode: 'Feb', antallDager: 2.7, antallIkkeHentet: 18 },
          { periode: 'Mar', antallDager: 2.3, antallIkkeHentet: 12 },
          { periode: 'Apr', antallDager: 2.1, antallIkkeHentet: 14 },
          { periode: 'Mai', antallDager: 1.9, antallIkkeHentet: 13 },
          { periode: 'Jun', antallDager: 2.0, antallIkkeHentet: 10 },
        ];
      case 'yearly':
        return [
          { periode: '2022', antallDager: 3.2, antallIkkeHentet: 120 },
          { periode: '2023', antallDager: 2.8, antallIkkeHentet: 105 },
          { periode: '2024', antallDager: 2.5, antallIkkeHentet: 95 },
          { periode: (new Date()).getFullYear().toString(), antallDager: 2.1, antallIkkeHentet: 45 },
        ];
      default:
        return [];
    }
  };
  
  return (
    <section className="visualization-section">
      <div className="section-header">
        <div className="title-group">
          <h2>Diagram av statistikk og trender</h2>
          
        </div>
        
        <ExportMenu 
          materialData={materialData}
          reminderLogs={reminderLogs}
          statisticsView={statisticsView}
          chartData={generateChartData()}
          pickupTimeLimit={pickupTimeLimit}
          reminderDays={reminderDays}
          showToast={showToast}
        />
      </div>
      
      {showStatistics && (
        <div className="chart-outer-container">
          <div className="chart-header">
            <div className="chart-tabs">
              <button 
                className={statisticsView === 'weekly' ? 'active' : ''} 
                onClick={() => setStatisticsView('weekly')}
                aria-pressed={statisticsView === 'weekly'}
              >
                Ukentlig
              </button>
              <button 
                className={statisticsView === 'monthly' ? 'active' : ''} 
                onClick={() => setStatisticsView('monthly')}
                aria-pressed={statisticsView === 'monthly'}
              >
                Månedlig
              </button>
              <button 
                className={statisticsView === 'yearly' ? 'active' : ''} 
                onClick={() => setStatisticsView('yearly')}
                aria-pressed={statisticsView === 'yearly'}
              >
                Årlig
              </button>
            </div>
          </div>
          
          <ReportChart data={generateChartData()} />
        </div>
      )}
    </section>
  );
}

VisualizationSection.propTypes = {
  materialData: PropTypes.array.isRequired,
  reminderLogs: PropTypes.array.isRequired,
  pickupTimeLimit: PropTypes.number.isRequired,
  reminderDays: PropTypes.number.isRequired,
  showToast: PropTypes.func.isRequired
};

export default VisualizationSection;