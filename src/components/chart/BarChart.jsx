// src/components/chart/BarChart.jsx
import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';
import './BarChart.css';
const primaryBurgundy = "#7d203a";
const primaryGreen = "#4a7c59";

const palette = {
  // farger
  burgundy: {
    main: "#7d203a",
    light: "#9d405a",
    dark: "#5d0020"
  }
};
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
                style={{ color: entry.color }}
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
  
  return (
    <div className="bar-chart">
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
            tick={{ fontSize: containerWidth < 500 ? 10 : 12 }}
            tickMargin={10}
            height={50}
            padding={{ left: 10, right: 10 }}
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
                textAnchor: 'middle'
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
                textAnchor: 'middle'
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
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;