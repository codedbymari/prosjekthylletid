// src/components/chart/ReportChart.jsx
import React, { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from "recharts";
import ScatterPlot from './ScatterPlot';
import colors from '../../utils/colors';
import './styles/ReportChart.css';

function ReportChart({ data }) {
  const [showScatterPlot, setShowScatterPlot] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef(null);
  
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

  //  tooltip for bar chart
  const BarChartTooltip = ({ active, payload, label }) => {
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
                content={<BarChartTooltip />} 
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
        ) : (
          <ScatterPlot containerWidth={containerWidth} />
        )}
      </div>
    </div>
  );
}

export default ReportChart;