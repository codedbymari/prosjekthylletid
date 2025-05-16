// src/components/chart/BarChart.jsx
import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';
import './BarChart.css';

const BarChart = ({ 
  data, 
  containerWidth = 600, 
  containerHeight = 400,
  leftAxisLabel = "Gjennomsnittlig hentetid (dager)",
  rightAxisLabel = "Antall ikke hentet",
  leftDataKey = "antallDager",
  rightDataKey = "antallIkkeHentet",
  xAxisDataKey = "periode",
  leftBarName = "Gjennomsnittlig hentetid (dager)",
  rightBarName = "Antall ikke hentet",
  leftBarColor = "#7d203a", 
  rightBarColor = "#4a7c59" 
}) => {
  const getMargins = () => {
    const baseMargin = { top: 20, bottom: 60 };
    
    if (containerWidth < 500) {
      return { ...baseMargin, left: 40, right: 40 };
    } else if (containerWidth < 768) {
      return { ...baseMargin, left: 50, right: 50 };
    }
    return { ...baseMargin, left: 60, right: 60 };
  };
  
  // Enhanced tooltip with clearer visual hierarchy and more detailed information
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bar-chart-tooltip">
          <h4>{label}</h4>
          {payload.map((entry, index) => (
            <div key={`tooltip-item-${index}`} className="tooltip-item">
              <span className="tooltip-label">{entry.name}:</span>
              <span 
                className="tooltip-value"
                style={{ color: entry.color, fontWeight: 600 }}
              >
                {entry.name.includes('dager') ? 
                  `${entry.value.toFixed(1)} dager` : 
                  entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Enhanced X-axis formatter to make weekdays more clear
  const formatXAxisTick = (value) => {
    // If value is a weekday (Mandag, Tirsdag, etc.), make it more prominent
    const weekdays = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"];
    if (weekdays.includes(value) || weekdays.some(day => value.includes(day))) {
      return value;
    }
    return value;
  };
  
  return (
    <div className="bar-chart">
      {/* Add an explicit title for the chart to improve understanding */}
      <div className="chart-title" style={{ 
        textAlign: 'center', 
        marginBottom: '10px',
        fontSize: containerWidth < 500 ? '14px' : '16px',
        color: '#333',
        fontWeight: 600
      }}>
        {xAxisDataKey === "ukedag" ? "Aktivitet per ukedag" : "Oversikt"}
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          margin={getMargins()}
          barSize={containerWidth < 500 ? 15 : 20}
          barGap={containerWidth < 500 ? 2 : 5}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey={xAxisDataKey} 
            tick={{ 
              fontSize: containerWidth < 500 ? 10 : 12,
              fill: "#333",
              fontWeight: xAxisDataKey === "ukedag" ? 600 : 400, // Make weekday text bolder
            }}
            tickMargin={10}
            height={50}
            padding={{ left: 10, right: 10 }}
            tickFormatter={formatXAxisTick}
            label={
              xAxisDataKey === "ukedag" ? {
                value: "Ukedag",
                position: "insideBottom",
                offset: -10,
                style: { 
                  fill: "#555", 
                  fontSize: containerWidth < 500 ? '10px' : '12px',
                  textAnchor: 'middle',
                  fontWeight: 500
                }
              } : null
            }
          />
          <YAxis 
            yAxisId="left" 
            orientation="left" 
            stroke={leftBarColor}
            tick={{ fontSize: containerWidth < 500 ? 10 : 12 }}
            tickFormatter={(value) => value.toFixed(1)}
            width={55}
            padding={{ top: 10, bottom: 10 }}
          >
            <Label 
              value={leftAxisLabel} 
              position="insideLeft"
              angle={-90}
              style={{ 
                fill: leftBarColor, 
                fontSize: containerWidth < 500 ? '10px' : '12px',
                textAnchor: 'middle',
                fontWeight: 500
              }}
              offset={-45}
            />
          </YAxis>
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            stroke={rightBarColor}
            tick={{ fontSize: containerWidth < 500 ? 10 : 12 }}
            width={55}
            padding={{ top: 10, bottom: 10 }}
          >
            <Label 
              value={rightAxisLabel} 
              position="insideRight"
              angle={90}
              style={{ 
                fill: rightBarColor, 
                fontSize: containerWidth < 500 ? '10px' : '12px',
                textAnchor: 'middle',
                fontWeight: 500
              }}
              offset={-45}
            />
          </YAxis>
          <Tooltip 
            content={<CustomTooltip />}
            cursor={{ 
              fill: 'rgba(0, 0, 0, 0.05)',
              radius: 4
            }}
          />
          <Legend 
            verticalAlign="bottom"
            height={36}
            wrapperStyle={{ 
              paddingTop: 20,
              fontSize: containerWidth < 500 ? 10 : 12,
              bottom: 0
            }}
            iconType="circle"
            iconSize={8}
          />
          <Bar 
            yAxisId="left" 
            dataKey={leftDataKey} 
            name={leftBarName} 
            fill={leftBarColor} 
            radius={[4, 4, 0, 0]}
            animationDuration={800}
            animationEasing="ease-out"
            // Add pattern or texture for better visual distinction
            fillOpacity={0.9}
          />
          <Bar 
            yAxisId="right" 
            dataKey={rightDataKey} 
            name={rightBarName} 
            fill={rightBarColor} 
            radius={[4, 4, 0, 0]}
            animationDuration={800}
            animationEasing="ease-out"
            animationBegin={100}
            // Add pattern or texture for better visual distinction
            fillOpacity={0.9}
          />
        </RechartsBarChart>
      </ResponsiveContainer>

      {/* Add helper text for weekday view to help users like Siri */}
      {xAxisDataKey === "ukedag" && (
        <div className="chart-helper-text" style={{
          fontSize: containerWidth < 500 ? '11px' : '12px',
          color: '#666',
          textAlign: 'center',
          marginTop: '10px'
        }}>
          Tips: Søyler viser aktivitet for hver ukedag. Høyere søyle betyr mer aktivitet.
        </div>
      )}
    </div>
  );
};

export default BarChart;