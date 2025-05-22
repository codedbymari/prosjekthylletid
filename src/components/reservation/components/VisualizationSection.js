import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  FiBarChart2,
  FiInfo,
  FiPieChart,
  FiGrid,
  FiCalendar,
  FiBook,
  FiChevronRight,
  FiX
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
  Label,
  ReferenceLine 
} from 'recharts';
import ScatterPlot from '../../chart/ScatterPlot';
import PickupDistributionChart from '../../chart/PickupDistributionChart';
import ExportMenu from '../components/ExportMenu';
import colors from '../../../utils/colors';
import '../styles/VisualizationSection.css';

function VisualizationSection({ 
  materialData, 
  reminderLogs, 
  pickupTimeLimit, 
  reminderDays,
  pickupDistributionData, 
  showToast
}) {
  const [statisticsView, setStatisticsView] = useState('weekly');
  const [chartType, setChartType] = useState('barChart'); // 'barChart', 'scatterPlot', 'distribution'
  const [showIntro, setShowIntro] = useState(true);
  const [showGlossary, setShowGlossary] = useState(false);
  
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
          { 
            periode: 'Mandag', 
            shortName: 'Man', 
            antallDager: 1.5, 
            antallIkkeHentet: 5,
            hentinger: 23 
          },
          { 
            periode: 'Tirsdag', 
            shortName: 'Tir', 
            antallDager: 2.1, 
            antallIkkeHentet: 3,
            hentinger: 19
          },
          { 
            periode: 'Onsdag', 
            shortName: 'Ons', 
            antallDager: 2.8, 
            antallIkkeHentet: 4,
            hentinger: 25
          },
          { 
            periode: 'Torsdag', 
            shortName: 'Tor', 
            antallDager: 3.2, 
            antallIkkeHentet: 6,
            hentinger: 28
          },
          { 
            periode: 'Fredag', 
            shortName: 'Fre', 
            antallDager: 2.5, 
            antallIkkeHentet: 4,
            hentinger: 22
          },
          { 
            periode: 'Lørdag', 
            shortName: 'Lør', 
            antallDager: 1.9, 
            antallIkkeHentet: 2,
            hentinger: 15
          },
          { 
            periode: 'Søndag', 
            shortName: 'Søn', 
            antallDager: 1.2, 
            antallIkkeHentet: 1,
            hentinger: 8
          },
        ];
      case 'monthly':
        return [
          { periode: 'Januar', shortName: 'Jan', antallDager: 2.5, antallIkkeHentet: 15, hentinger: 112 },
          { periode: 'Februar', shortName: 'Feb', antallDager: 2.7, antallIkkeHentet: 18, hentinger: 98 },
          { periode: 'Mars', shortName: 'Mar', antallDager: 2.3, antallIkkeHentet: 12, hentinger: 105 },
          { periode: 'April', shortName: 'Apr', antallDager: 2.1, antallIkkeHentet: 14, hentinger: 93 },
          { periode: 'Mai', shortName: 'Mai', antallDager: 1.9, antallIkkeHentet: 13, hentinger: 87 },
          { periode: 'Juni', shortName: 'Jun', antallDager: 2.0, antallIkkeHentet: 10, hentinger: 91 },
        ];
      case 'yearly':
        return [
          { periode: '2022', shortName: '2022', antallDager: 3.2, antallIkkeHentet: 120, hentinger: 1240 },
          { periode: '2023', shortName: '2023', antallDager: 2.8, antallIkkeHentet: 105, hentinger: 1350 },
          { periode: '2024', shortName: '2024', antallDager: 2.5, antallIkkeHentet: 95, hentinger: 1420 },
          { periode: (new Date()).getFullYear().toString(), shortName: (new Date()).getFullYear().toString(), antallDager: 2.1, antallIkkeHentet: 45, hentinger: 578 },
        ];
      default:
        return [];
    }
  };
  
  const chartData = generateChartData();
  
  const findMostActiveDay = () => {
    if (statisticsView !== 'weekly' || chartData.length === 0) return null;
    
    let maxPickups = -1;
    let mostActiveDay = null;
    
    chartData.forEach(day => {
      if (day.hentinger > maxPickups) {
        maxPickups = day.hentinger;
        mostActiveDay = day.periode;
      }
    });
    
    return { day: mostActiveDay, count: maxPickups };
  };
  
  const mostActiveDay = findMostActiveDay();
  
  const IntroductionPanel = () => (
    <div className="intro-panel">
      <div className="intro-header">
        <h3 className="intro-title">
          Velkommen til statistikkoversikten
        </h3>
        <button 
          className="intro-close-btn" 
          onClick={() => setShowIntro(false)}
          aria-label="Lukk introduksjon"
        >
          <FiX />
        </button>
      </div>
      
      <div className="intro-content">
        <p>
          Her finner du statistikk som gir innsikt i reservasjoner og hentetider. Du kan:
        </p>
        <ul>
          <li>Se gjennomsnittlig hentetid for materialer</li>
          <li>Kartlegge når materialer ikke blir hentet</li>
          <li>Analysere hentetider på tvers av ulike perioder</li>
          <li>Forstå sammenhenger mellom materialets popularitet og hentetid</li>
        </ul>
        
        <div className="intro-terms">
          <button 
            className="glossary-toggle-btn" 
            onClick={() => setShowGlossary(!showGlossary)}
          >
            <FiBook className="glossary-icon" />
            {showGlossary ? "Skjul ordforklaringer" : "Vis ordforklaringer"}
          </button>
          
          {showGlossary && (
            <div className="glossary-section">
              <h4 className="glossary-title">Ordforklaringer:</h4>
              <dl className="glossary-list">
                <dt>Hentetid</dt>
                <dd>Antall dager fra en reservasjon er klar til den blir hentet av låner.</dd>
                
                <dt>Reservasjoner</dt>
                <dd>Bestillinger av materialer som er gjort av lånere, både aktive og fullførte.</dd>
                
                <dt>Antall ikke hentet</dt>
                <dd>Materialer som har vært reservert men ikke hentet innen tidsfristen.</dd>
                
                <dt>Gjennomsnittlig hentetid</dt>
                <dd>Gjennomsnittet av alle hentetider i den valgte perioden.</dd>
              </dl>
            </div>
          )}
        </div>
        
        <button 
          className="explore-btn" 
          onClick={() => setShowIntro(false)}
        >
          Utforsk diagrammene <FiChevronRight className="explore-icon" />
        </button>
      </div>
    </div>
  );

  return (
    <section className="visualization-section" ref={containerRef}>
      <div className="section-header">
        <div className="title-group">
          {!showIntro && (
            <h2 className="section-title">
              <FiBarChart2 className="section-icon" />
              Statistikk og oversikt
            </h2>
          )}
          

        </div>
        
<div className="button-group">
 {!showIntro && (
 <>
 <ExportMenu 
 materialData={materialData}
 reminderLogs={reminderLogs}
 statisticsView={statisticsView}
 chartData={chartData}
 pickupTimeLimit={pickupTimeLimit}
reminderDays={reminderDays}
 showToast={showToast}
/>
 <button 
className="intro-toggle-btn" 
 onClick={() => setShowIntro(true)}
 >
 <span> Oversikt</span>
 </button>
 </>
 )}
</div>
</div>

      
      {showIntro ? (
        <IntroductionPanel />
      ) : (
        <div className="chart-container">

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
            
            {chartType === 'barChart' && (
              <div className="time-periods">
                <button 
                  className={statisticsView === 'weekly' ? 'active' : ''}
                  onClick={() => setStatisticsView('weekly')}
                  aria-pressed={statisticsView === 'weekly'}
                >
                  <FiCalendar className="period-icon" />
                  Ukentlig
                </button>
                <button 
                  className={statisticsView === 'monthly' ? 'active' : ''}
                  onClick={() => setStatisticsView('monthly')}
                  aria-pressed={statisticsView === 'monthly'}
                >
                  <FiCalendar className="period-icon" />
                  Månedlig
                </button>
                <button 
                  className={statisticsView === 'yearly' ? 'active' : ''}
                  onClick={() => setStatisticsView('yearly')}
                  aria-pressed={statisticsView === 'yearly'}
                >
                  <FiCalendar className="period-icon" />
                  Årlig
                </button>
              </div>
            )}
          </div>
          
          <div className="chart-description">
                {chartType === 'barChart' && (
                  <p className="chart-description-text">
                    <FiInfo className="description-icon" />
                    Dette diagrammet viser <strong>gjennomsnittlig hentetid</strong> og <strong>antall ikke hentede materialer</strong> for hver {
                      statisticsView === 'weekly' ? 'ukedag' : 
                      statisticsView === 'monthly' ? 'måned' : 'år'
                    }.
                  </p>
                )}
                
              

                {chartType === 'scatterPlot' && (
                  <p className="chart-description-text">
                    <FiInfo className="description-icon" />
                    Dette diagrammet viser forholdet mellom materialets <strong>popularitet</strong> og <strong>gjennomsnittlig hentetid</strong>. 
                    Hvert punkt representerer et materiale.
                  </p>
                )}
                
                {chartType === 'distribution' && (
                  <p className="chart-description-text">
                    <FiInfo className="description-icon" />
                    Dette diagrammet viser <strong>fordelingen av hentetider</strong> - hvor mange materialer som blir hentet innen ulike tidsintervaller.
                  </p>
                )}
                </div>

           
          {/* Chart visualization area */}
          <div className="chart-visualization">
            {chartType === 'barChart' && (
              <div className="bar-chart-container">
                {statisticsView === 'weekly' && (
                  <div className="chart-summary">
                    
                  </div>
                )}
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
                      <linearGradient id="highlightGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#e85692" />
                        <stop offset="100%" stopColor="#d13e7a" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      vertical={false} 
                      stroke={colors.neutral[200]} 
                      opacity={0.7}
                    />
                    <XAxis 
                      dataKey={containerWidth < 500 ? "shortName" : "periode"} 
                      tick={{ 
                        fontSize: containerWidth < 500 ? 10 : 12,
                        fill: colors.neutral[700],
                        fontWeight: (tick) => {
                          if (statisticsView === 'weekly' && mostActiveDay && tick === (containerWidth < 500 ? 
                            chartData.find(day => day.periode === mostActiveDay.day)?.shortName : 
                            mostActiveDay.day)) {
                            return 600;
                          }
                          return 400;
                        }
                      }}
                      tickMargin={10}
                      height={40}
                      stroke={colors.neutral[200]}
                      axisLine={{ stroke: colors.neutral[200] }}
                      label={{
                        value: statisticsView === 'weekly' ? 'Ukedag' : 
                                statisticsView === 'monthly' ? 'Måned' : 'År',
                        position: 'insideBottom',
                        offset: -10,
                        style: { 
                          fill: colors.neutral[700],
                          fontSize: 12,
                          fontWeight: 500,
                          textAnchor: "middle"
                        }
                      }}
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
                      domain={[0, 'dataMax + 1']} 
                    >
                      <Label 
                        value="Gjennomsnittlig hentetid (dager)" 
                        position="insideLeft"
                        angle={-90}
                        style={{ 
                          fill: colors.primary, 
                          fontSize: containerWidth < 500 ? '10px' : '12px',
                          fontWeight: 500,
                          textAnchor: "middle"
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
                          fontWeight: 500,
                          textAnchor: "middle"
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
                      radius={[4, 4, 0, 0]}
                      animationDuration={800}
                      animationEasing="cubic-bezier(0.34, 1.56, 0.64, 1)"
                      fill="#3E4C59	"
                    />
                    <Bar 
                      yAxisId="right" 
                      dataKey="antallIkkeHentet" 
                      name="Antall ikke hentet" 
                      fill="#7D203A"
                      radius={[4, 4, 0, 0]}
                      animationDuration={800}
                      animationEasing="cubic-bezier(0.34, 1.56, 0.64, 1)"
                      animationBegin={100}
                      fillOpacity={0.9}
                    />
                    
                    {statisticsView === 'weekly' && mostActiveDay && 
                      <ReferenceLine 
                        x={containerWidth < 500 ? 
                          chartData.find(day => day.periode === mostActiveDay.day)?.shortName : 
                          mostActiveDay.day} 
                        stroke="#e85692" 
                        strokeWidth={1.5} 
                        strokeDasharray="5 2"
                        yAxisId="left"
                        label={{
                          value: 'Flest hentinger',
                          position: 'top',
                          fill: '#e85692',
                          fontSize: 11,
                          fontWeight: 500
                        }}
                      />
                    }
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
            {chartType === 'scatterPlot' && <ScatterPlot containerWidth={containerWidth} />}
            {chartType === 'distribution' && <PickupDistributionChart data={pickupDistributionData || []} />}
          </div>
        </div>
      )}
    </section>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const dataEntry = payload[0]?.payload;
    
    return (
      <div className="custom-tooltip">
        <p className="tooltip-title">{dataEntry.periode || label}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`}>
            <span className="tooltip-label">{entry.name}:</span>
            <span className="tooltip-value" style={{ color: entry.color }}>
              {entry.name.includes('dager') ? `${entry.value.toFixed(1)} dager` : entry.value}
            </span>
          </p>
        ))}
        
        {dataEntry && dataEntry.hentinger !== undefined && (
          <p>
            <span className="tooltip-label">Antall hentinger:</span>
            <span className="tooltip-value" style={{ color: colors.highlight || '#e85692' }}>
              {dataEntry.hentinger}
            </span>
          </p>
        )}
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