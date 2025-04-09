import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  FiBarChart2, 
  FiInfo, 
  FiTrendingUp, 
  FiTrendingDown, 
  FiArrowUp, 
  FiArrowDown,
  FiHelpCircle,
  FiFolder,
  FiPieChart,
  FiGrid 
} from 'react-icons/fi';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  Label 
} from 'recharts';
import ReportChart from '../chart/ReportChart';
import ScatterPlot from '../chart/ScatterPlot';
import PickupDistributionChart from '../chart/PickupDistributionChart';
import ExportMenu from './ExportMenu';
import colors from '../../utils/colors';
import './VisualizationSection.css';

function VisualizationSection({ 
  materialData, 
  reminderLogs, 
  pickupTimeLimit, 
  reminderDays,
  pickupDistributionData, 
  showToast
}) {
  const [statisticsView, setStatisticsView] = useState('weekly');
  const [showInsights, setShowInsights] = useState(false);
  const [showCategoryAnalysis, setShowCategoryAnalysis] = useState(false);
  const [chartType, setChartType] = useState('barChart'); // 'barChart', 'scatterPlot', 'distribution'
  
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);
  
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
  
  const chartData = generateChartData();
  
  const getChartTrend = () => {
    if (chartData.length < 2) return { trend: 'neutral', icon: FiInfo };
    
    const firstValue = chartData[0].antallDager;
    const lastValue = chartData[chartData.length - 1].antallDager;
    const trend = lastValue < firstValue ? 'positive' : lastValue > firstValue ? 'negative' : 'neutral';
    
    const percentChange = firstValue !== 0 
      ? Math.abs(Math.round(((lastValue - firstValue) / firstValue) * 100)) 
      : 0;
    
    let trendIcon;
    if (trend === 'positive') {
      trendIcon = percentChange > 10 ? FiTrendingDown : FiArrowDown;
    } else if (trend === 'negative') {
      trendIcon = percentChange > 10 ? FiTrendingUp : FiArrowUp;
    } else {
      trendIcon = FiInfo;
    }
    
    return { trend, icon: trendIcon, percentChange };
  };
  
  const getNotPickedUpTrend = () => {
    if (chartData.length < 2) return { trend: 'neutral', icon: FiInfo };
    
    const firstValue = chartData[0].antallIkkeHentet;
    const lastValue = chartData[chartData.length - 1].antallIkkeHentet;
    const trend = lastValue < firstValue ? 'positive' : lastValue > firstValue ? 'negative' : 'neutral';
    
    // Calculate the percentage change
    const percentChange = firstValue !== 0 
      ? Math.abs(Math.round(((lastValue - firstValue) / firstValue) * 100)) 
      : 0;
    
    let trendIcon;
    if (trend === 'positive') {
      trendIcon = percentChange > 10 ? FiTrendingDown : FiArrowDown;
    } else if (trend === 'negative') {
      trendIcon = percentChange > 10 ? FiTrendingUp : FiArrowUp;
    } else {
      trendIcon = FiInfo;
    }
    
    return { trend, icon: trendIcon, percentChange };
  };
  
  const { trend: pickupTrend, icon: PickupTrendIcon, percentChange: pickupChange } = getChartTrend();
  const { trend: notPickedUpTrend, icon: NotPickedUpTrendIcon, percentChange: notPickedUpChange } = getNotPickedUpTrend();

  const categoryData = [
    { name: "Skjønnlitteratur", avgDays: 1.8, notPickedRate: 2.1 },
    { name: "Faglitteratur", avgDays: 2.3, notPickedRate: 3.7 },
    { name: "Barnebøker", avgDays: 1.2, notPickedRate: 1.5 },
    { name: "Filmer", avgDays: 1.1, notPickedRate: 1.9 },
    { name: "Lydbøker", avgDays: 2.7, notPickedRate: 4.2 }
  ];

  return (
    <section className="visualization-section" ref={containerRef}>
      <div className="section-header">
        <div className="title-group">
          <h2 className="section-title">
            <FiBarChart2 className="section-icon" />
            Visualisering og rapporter
          </h2>
        </div>

        <div className="action-buttons">
          <div className="insight-buttons">
            <button 
              className={`action-button ${showInsights ? 'active' : ''}`}
              onClick={() => setShowInsights(!showInsights)}
              aria-label="Vis innsikt og trender"
              aria-expanded={showInsights}
            >
              <FiHelpCircle className="button-icon" />
            </button>
            
         
          </div>
          
          <ExportMenu 
            materialData={materialData}
            reminderLogs={reminderLogs}
            statisticsView={statisticsView}
            chartData={chartData}
            pickupTimeLimit={pickupTimeLimit}
            reminderDays={reminderDays}
            showToast={showToast}
          />
        </div>
      </div>
      
      <div className="chart-container">
        {/* Chart type selector */}
        <div className="chart-navigation">
          <div className="chart-types">
            <button 
              className={chartType === 'barChart' ? 'active' : ''}
              onClick={() => setChartType('barChart')}
              aria-pressed={chartType === 'barChart'}
            >
              <FiBarChart2 className="chart-type-icon" />
              <span>Hentetid per periode</span>
            </button>
            <button 
              className={chartType === 'scatterPlot' ? 'active' : ''}
              onClick={() => setChartType('scatterPlot')}
              aria-pressed={chartType === 'scatterPlot'}
            >
              <FiGrid className="chart-type-icon" />
              <span>Popularitet vs. hentetid</span>
            </button>
            <button 
              className={chartType === 'distribution' ? 'active' : ''}
              onClick={() => setChartType('distribution')}
              aria-pressed={chartType === 'distribution'}
            >
              <FiPieChart className="chart-type-icon" />
              <span>Hentetid fordeling</span>
            </button>
          </div>
          
          {/* Only show time period tabs for bar chart */}
          {chartType === 'barChart' && (
            <div className="time-periods">
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
          )}
        </div>
        
        {/* Insights panel */}
        {showInsights && (
          <div className="insights-panel">
            <div className="panel-header">
              <FiInfo className="panel-icon" />
              <h4 className="panel-title">Nøkkelinnsikt og trender</h4>
            </div>
            
            <div className="insights-content">
              <div className="insights-metrics">
                <div className={`insight-item ${pickupTrend}`}>
                  <div className="insight-icon">
                    <PickupTrendIcon />
                  </div>
                  <div className="insight-content">
                    <h4 className="insight-title">Hentetid</h4>
                    <p className="insight-value">
                      {pickupTrend === 'positive' 
                        ? `Nedgang på ${pickupChange}%` 
                        : pickupTrend === 'negative' 
                          ? `Økning på ${pickupChange}%` 
                          : 'Ingen endring'}
                    </p>
                  </div>
                </div>
                
                <div className={`insight-item ${notPickedUpTrend}`}>
                  <div className="insight-icon">
                    <NotPickedUpTrendIcon />
                  </div>
                  <div className="insight-content">
                    <h4 className="insight-title">Ikke-hentet</h4>
                    <p className="insight-value">
                      {notPickedUpTrend === 'positive' 
                        ? `Nedgang på ${notPickedUpChange}%` 
                        : notPickedUpTrend === 'negative' 
                          ? `Økning på ${notPickedUpChange}%` 
                          : 'Ingen endring'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="chart-legend">
                <div className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: colors.primary }}></span>
                  <span className="legend-label">Gjennomsnittlig hentetid (dager)</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: colors.secondary }}></span>
                  <span className="legend-label">Antall ikke-hentede reservasjoner</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
       
        {/* Chart visualization area */}
        <div className="chart-visualization">
          {chartType === 'barChart' && (
            <div className="bar-chart-container">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 60, left: 60, bottom: 60 }}
                  barGap={containerWidth < 500 ? 2 : 8}
                  barSize={containerWidth < 500 ? 15 : 24}
                >
                  <defs>
                    <linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#b53b62" />
                      <stop offset="100%" stopColor="#852c45" />
                    </linearGradient>
                    <linearGradient id="secondaryGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4a9bbe" />
                      <stop offset="100%" stopColor="#367a90" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    vertical={false} 
                    stroke={colors.neutral[200]} 
                    opacity={0.7}
                  />
                  <XAxis 
                    dataKey="periode" 
                    tick={{ 
                      fontSize: containerWidth < 500 ? 10 : 12,
                      fill: colors.neutral[700]
                    }}
                    tickMargin={10}
                    height={40}
                    stroke={colors.neutral[200]}
                    axisLine={{ stroke: colors.neutral[200] }}
                  />
                  <YAxis 
                    yAxisId="left" 
                    orientation="left" 
                    stroke={colors.primary}
                    tick={{ 
                      fontSize: containerWidth < 500 ? 10 : 12,
                      fill: colors.neutral[700]
                    }}
                    tickFormatter={(value) => value.toFixed(1)}
                    width={55}
                    axisLine={{ stroke: colors.neutral[200] }}
                    tickLine={{ stroke: colors.neutral[200] }}
                  >
                    <Label 
                      value="Gjennomsnittlig hentetid (dager)" 
                      position="insideLeft"
                      angle={-90}
                      style={{ 
                        fill: colors.primary, 
                        fontSize: containerWidth < 500 ? '10px' : '12px',
                        fontWeight: 500
                      }}
                      offset={-45}
                    />
                  </YAxis>
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    stroke={colors.secondary}
                    tick={{ 
                      fontSize: containerWidth < 500 ? 10 : 12,
                      fill: colors.neutral[700]
                    }}
                    width={55}
                    axisLine={{ stroke: colors.neutral[200] }}
                    tickLine={{ stroke: colors.neutral[200] }}
                  >
                    <Label 
                      value="Antall ikke hentet" 
                      position="insideRight"
                      angle={90}
                      style={{ 
                        fill: colors.secondary, 
                        fontSize: containerWidth < 500 ? '10px' : '12px',
                        fontWeight: 500
                      }}
                      offset={-45}
                    />
                  </YAxis>
                  <Tooltip 
                    content={<CustomTooltip />} 
                    cursor={{ 
                      fill: colors.neutral[900],
                      fillOpacity: 0.04,
                      radius: 4
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom"
                    height={36}
                    wrapperStyle={{ 
                      paddingTop: 20,
                      fontSize: containerWidth < 500 ? 10 : 12,
                      color: colors.neutral[700],
                      bottom: 0
                    }}
                    iconType="circle"
                    iconSize={8}
                  />
                  <Bar 
                    yAxisId="left" 
                    dataKey="antallDager" 
                    name="Gjennomsnittlig hentetid (dager)" 
                    fill="url(#primaryGradient)"
                    radius={[4, 4, 0, 0]}
                    animationDuration={800}
                    animationEasing="cubic-bezier(0.34, 1.56, 0.64, 1)"
                  />
                  <Bar 
                    yAxisId="right" 
                    dataKey="antallIkkeHentet" 
                    name="Antall ikke hentet" 
                    fill="url(#secondaryGradient)"
                    radius={[4, 4, 0, 0]}
                    animationDuration={800}
                    animationEasing="cubic-bezier(0.34, 1.56, 0.64, 1)"
                    animationBegin={100}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          {chartType === 'scatterPlot' && <ScatterPlot containerWidth={containerWidth} />}
          {chartType === 'distribution' && <PickupDistributionChart data={pickupDistributionData || []} />}
        </div>
      </div>
    </section>
  );
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-title">{label}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`}>
            <span className="tooltip-label">{entry.name}:</span>
            <span className="tooltip-value" style={{ color: entry.color }}>
              {entry.name.includes('dager') ? `${entry.value.toFixed(1)} dager` : entry.value}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

VisualizationSection.propTypes = {
  materialData: PropTypes.array.isRequired,
  reminderLogs: PropTypes.array.isRequired,
  pickupTimeLimit: PropTypes.number.isRequired,
  reminderDays: PropTypes.number.isRequired,
  pickupDistributionData: PropTypes.array,
  showToast: PropTypes.func.isRequired
};

// Set default props
VisualizationSection.defaultProps = {
  pickupDistributionData: []
};

export default VisualizationSection;