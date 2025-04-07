// src/components/chart/ReportChart.jsx
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, Label } from "recharts";
import ScatterPlot from './ScatterPlot'; // Import the ScatterPlot component
import './ReportChart.css';

function ReportChart({ data }) {
  const [showScatterPlot, setShowScatterPlot] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = React.useRef(null);
  
  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
      
      const handleResize = () => {
        setContainerWidth(containerRef.current.offsetWidth);
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Custom tooltip for bar chart
  const BarChartTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-title">{label}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`}>
              <span className="tooltip-label">{entry.name}:</span>
              <span className="tooltip-value" style={{ color: entry.color }}>
                {entry.name.includes('dager') ? `${entry.value} dager` : entry.value}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Log the current state to debug
  console.log("ReportChart rendering, showScatterPlot:", showScatterPlot);

  return (
    <div className="report-chart-container" ref={containerRef}>
      <div className="chart-toggle">
        <button 
          className={!showScatterPlot ? 'active' : ''}
          onClick={() => setShowScatterPlot(false)}
        >
          Hentetid per periode
        </button>
        <button 
          className={showScatterPlot ? 'active' : ''}
          onClick={() => setShowScatterPlot(true)}
        >
          Popularitet vs. hentetid
        </button>
      </div>

      <div className="chart-wrapper">
        {!showScatterPlot ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={data}
              margin={{ top: 20, right: 60, left: 60, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="periode" 
                tick={{ fontSize: containerWidth < 500 ? 10 : 12 }}
                tickMargin={10}
                height={40}
              />
              <YAxis 
                yAxisId="left" 
                orientation="left" 
                stroke="#8884d8"
                tick={{ fontSize: containerWidth < 500 ? 10 : 12 }}
                tickFormatter={(value) => value.toFixed(1)}
                width={55}
              >
                <Label 
                  value="Gjennomsnittlig hentetid (dager)" 
                  position="insideLeft"
                  angle={-90}
                  style={{ fill: '#8884d8', fontSize: containerWidth < 500 ? '10px' : '12px' }}
                  offset={-40}
                />
              </YAxis>
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                stroke="#82ca9d"
                tick={{ fontSize: containerWidth < 500 ? 10 : 12 }}
                width={55}
              >
                <Label 
                  value="Antall ikke hentet" 
                  position="insideRight"
                  angle={90}
                  style={{ fill: '#82ca9d', fontSize: containerWidth < 500 ? '10px' : '12px' }}
                  offset={-40}
                />
              </YAxis>
              <Tooltip content={<BarChartTooltip />} />
              <Legend 
                verticalAlign="bottom"
                height={36}
                wrapperStyle={{ 
                  paddingTop: 20,
                  bottom: 0
                }}
              />
              <Bar 
                yAxisId="left" 
                dataKey="antallDager" 
                name="Gjennomsnittlig hentetid (dager)" 
                fill="#8884d8" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                yAxisId="right" 
                dataKey="antallIkkeHentet" 
                name="Antall ikke hentet" 
                fill="#82ca9d" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          // Explicitly render the ScatterPlot component
          <ScatterPlot containerWidth={containerWidth} />
        )}
      </div>
    </div>
  );
}

export default ReportChart;